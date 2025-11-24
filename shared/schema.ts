import { sql } from 'drizzle-orm';
import { relations } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  varchar,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table - Required by Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Users table - Core user data from Replit Auth + profile extensions
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  bio: text("bio"),
  interests: text("interests").array(),
  isAdmin: boolean("is_admin").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Likes table - Track who liked whom
export const likes = pgTable("likes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fromUserId: varchar("from_user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  toUserId: varchar("to_user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("likes_from_user_idx").on(table.fromUserId),
  index("likes_to_user_idx").on(table.toUserId),
]);

// Matches table - Created when both users like each other
export const matches = pgTable("matches", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  user1Id: varchar("user1_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  user2Id: varchar("user2_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("matches_user1_idx").on(table.user1Id),
  index("matches_user2_idx").on(table.user2Id),
]);

// Messages table - Chat messages between matched users
export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  matchId: varchar("match_id").notNull().references(() => matches.id, { onDelete: 'cascade' }),
  senderId: varchar("sender_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("messages_match_idx").on(table.matchId),
  index("messages_created_at_idx").on(table.createdAt),
]);

// Activity logs table - Track all user actions for admin monitoring
export const activityLogs = pgTable("activity_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id, { onDelete: 'cascade' }),
  action: varchar("action").notNull(), // e.g., "login", "profile_update", "sent_like", "sent_message"
  metadata: jsonb("metadata"), // Additional context as JSON
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("activity_logs_user_idx").on(table.userId),
  index("activity_logs_created_at_idx").on(table.createdAt),
]);

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  sentLikes: many(likes, { relationName: "sentLikes" }),
  receivedLikes: many(likes, { relationName: "receivedLikes" }),
  matchesAsUser1: many(matches, { relationName: "matchesAsUser1" }),
  matchesAsUser2: many(matches, { relationName: "matchesAsUser2" }),
  messages: many(messages),
  activityLogs: many(activityLogs),
}));

export const likesRelations = relations(likes, ({ one }) => ({
  fromUser: one(users, {
    fields: [likes.fromUserId],
    references: [users.id],
    relationName: "sentLikes",
  }),
  toUser: one(users, {
    fields: [likes.toUserId],
    references: [users.id],
    relationName: "receivedLikes",
  }),
}));

export const matchesRelations = relations(matches, ({ one, many }) => ({
  user1: one(users, {
    fields: [matches.user1Id],
    references: [users.id],
    relationName: "matchesAsUser1",
  }),
  user2: one(users, {
    fields: [matches.user2Id],
    references: [users.id],
    relationName: "matchesAsUser2",
  }),
  messages: many(messages),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  match: one(matches, {
    fields: [messages.matchId],
    references: [matches.id],
  }),
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
  }),
}));

export const activityLogsRelations = relations(activityLogs, ({ one }) => ({
  user: one(users, {
    fields: [activityLogs.userId],
    references: [users.id],
  }),
}));

// Zod schemas for validation
export const upsertUserSchema = z.object({
  id: z.string(),
  email: z.string().email().nullable(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  profileImageUrl: z.string().nullable(),
});

export const updateProfileSchema = z.object({
  bio: z.string().max(500).optional(),
  interests: z.array(z.string()).max(10).optional(),
  profileImageUrl: z.string().url().optional(),
});

export const insertLikeSchema = createInsertSchema(likes).pick({
  toUserId: true,
});

export const insertMessageSchema = createInsertSchema(messages).pick({
  matchId: true,
  content: true,
}).extend({
  content: z.string().min(1).max(1000),
});

export const insertActivityLogSchema = createInsertSchema(activityLogs).pick({
  userId: true,
  action: true,
  metadata: true,
});

// TypeScript types
export type User = typeof users.$inferSelect;
export type UpsertUser = z.infer<typeof upsertUserSchema>;
export type UpdateProfile = z.infer<typeof updateProfileSchema>;

export type Like = typeof likes.$inferSelect;
export type InsertLike = z.infer<typeof insertLikeSchema>;

export type Match = typeof matches.$inferSelect;

export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;

export type ActivityLog = typeof activityLogs.$inferSelect;
export type InsertActivityLog = z.infer<typeof insertActivityLogSchema>;

// Extended types with relations for frontend use
export type UserWithProfile = User;

export type MatchWithUsers = Match & {
  user1: User;
  user2: User;
};

export type MessageWithSender = Message & {
  sender: User;
};
