// Database storage implementation with all CRUD operations
// Reference: blueprint:javascript_database and blueprint:javascript_log_in_with_replit

import {
  users,
  likes,
  matches,
  messages,
  activityLogs,
  type User,
  type UpsertUser,
  type UpdateProfile,
  type Like,
  type InsertLike,
  type Match,
  type Message,
  type InsertMessage,
  type ActivityLog,
  type InsertActivityLog,
  type MatchWithUsers,
  type MessageWithSender,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, or, not, desc, sql } from "drizzle-orm";

export interface IStorage {
  // User operations (required by Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Profile operations
  updateProfile(userId: string, data: UpdateProfile): Promise<User>;
  getAllUsers(): Promise<User[]>;
  getUsersExceptCurrent(currentUserId: string): Promise<User[]>;
  
  // Like operations
  createLike(fromUserId: string, data: InsertLike): Promise<Like>;
  getLikesBetweenUsers(userId1: string, userId2: string): Promise<Like[]>;
  getAllLikes(): Promise<any[]>;
  
  // Match operations
  createMatch(userId1: string, userId2: string): Promise<Match>;
  getUserMatches(userId: string): Promise<MatchWithUsers[]>;
  getMatchById(matchId: string): Promise<MatchWithUsers | undefined>;
  getAllMatches(): Promise<MatchWithUsers[]>;
  
  // Message operations
  createMessage(senderId: string, data: InsertMessage): Promise<Message>;
  getMatchMessages(matchId: string): Promise<MessageWithSender[]>;
  getAllMessages(): Promise<any[]>;
  
  // Activity log operations
  createActivityLog(data: InsertActivityLog): Promise<ActivityLog>;
  getAllActivityLogs(): Promise<any[]>;
  
  // Admin statistics
  getAdminStats(): Promise<{
    totalUsers: number;
    totalLikes: number;
    totalMatches: number;
    totalMessages: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateProfile(userId: string, data: UpdateProfile): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();

    // Log profile update
    await this.createActivityLog({
      userId,
      action: "profile_update",
      metadata: { fields: Object.keys(data) },
    });

    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(desc(users.createdAt));
  }

  async getUsersExceptCurrent(currentUserId: string): Promise<User[]> {
    // Get users that the current user hasn't liked yet
    const userLikes = await db
      .select({ toUserId: likes.toUserId })
      .from(likes)
      .where(eq(likes.fromUserId, currentUserId));

    const likedUserIds = userLikes.map(l => l.toUserId);

    return await db
      .select()
      .from(users)
      .where(
        and(
          not(eq(users.id, currentUserId)),
          likedUserIds.length > 0 
            ? not(sql`${users.id} = ANY(${likedUserIds})`)
            : sql`true`
        )
      )
      .orderBy(sql`RANDOM()`)
      .limit(50);
  }

  // Like operations
  async createLike(fromUserId: string, data: InsertLike): Promise<Like> {
    const [like] = await db
      .insert(likes)
      .values({
        fromUserId,
        toUserId: data.toUserId,
      })
      .returning();

    // Log like activity
    await this.createActivityLog({
      userId: fromUserId,
      action: "sent_like",
      metadata: { toUserId: data.toUserId },
    });

    // Check if there's a mutual like (match)
    const mutualLikes = await this.getLikesBetweenUsers(fromUserId, data.toUserId);
    if (mutualLikes.length === 2) {
      // Create a match
      await this.createMatch(fromUserId, data.toUserId);
    }

    return like;
  }

  async getLikesBetweenUsers(userId1: string, userId2: string): Promise<Like[]> {
    return await db
      .select()
      .from(likes)
      .where(
        or(
          and(eq(likes.fromUserId, userId1), eq(likes.toUserId, userId2)),
          and(eq(likes.fromUserId, userId2), eq(likes.toUserId, userId1))
        )
      );
  }

  async getAllLikes(): Promise<any[]> {
    const allLikes = await db
      .select({
        id: likes.id,
        fromUserId: likes.fromUserId,
        toUserId: likes.toUserId,
        createdAt: likes.createdAt,
        fromUser: users,
      })
      .from(likes)
      .leftJoin(users, eq(likes.fromUserId, users.id))
      .orderBy(desc(likes.createdAt));

    // Fetch toUser separately
    const result = await Promise.all(
      allLikes.map(async (like) => {
        const [toUser] = await db
          .select()
          .from(users)
          .where(eq(users.id, like.toUserId));
        return {
          ...like,
          toUser,
        };
      })
    );

    return result;
  }

  // Match operations
  async createMatch(userId1: string, userId2: string): Promise<Match> {
    const [match] = await db
      .insert(matches)
      .values({
        user1Id: userId1,
        user2Id: userId2,
      })
      .returning();

    // Log match activity for both users
    await this.createActivityLog({
      userId: userId1,
      action: "new_match",
      metadata: { withUserId: userId2 },
    });
    await this.createActivityLog({
      userId: userId2,
      action: "new_match",
      metadata: { withUserId: userId1 },
    });

    return match;
  }

  async getUserMatches(userId: string): Promise<MatchWithUsers[]> {
    const userMatches = await db
      .select()
      .from(matches)
      .where(or(eq(matches.user1Id, userId), eq(matches.user2Id, userId)))
      .orderBy(desc(matches.createdAt));

    const result = await Promise.all(
      userMatches.map(async (match) => {
        const [user1] = await db.select().from(users).where(eq(users.id, match.user1Id));
        const [user2] = await db.select().from(users).where(eq(users.id, match.user2Id));
        return {
          ...match,
          user1,
          user2,
        };
      })
    );

    return result;
  }

  async getMatchById(matchId: string): Promise<MatchWithUsers | undefined> {
    const [match] = await db.select().from(matches).where(eq(matches.id, matchId));
    if (!match) return undefined;

    const [user1] = await db.select().from(users).where(eq(users.id, match.user1Id));
    const [user2] = await db.select().from(users).where(eq(users.id, match.user2Id));

    return {
      ...match,
      user1,
      user2,
    };
  }

  async getAllMatches(): Promise<MatchWithUsers[]> {
    const allMatches = await db.select().from(matches).orderBy(desc(matches.createdAt));

    const result = await Promise.all(
      allMatches.map(async (match) => {
        const [user1] = await db.select().from(users).where(eq(users.id, match.user1Id));
        const [user2] = await db.select().from(users).where(eq(users.id, match.user2Id));
        return {
          ...match,
          user1,
          user2,
        };
      })
    );

    return result;
  }

  // Message operations
  async createMessage(senderId: string, data: InsertMessage): Promise<Message> {
    const [message] = await db
      .insert(messages)
      .values({
        matchId: data.matchId,
        senderId,
        content: data.content,
      })
      .returning();

    // Log message activity
    await this.createActivityLog({
      userId: senderId,
      action: "sent_message",
      metadata: { matchId: data.matchId },
    });

    return message;
  }

  async getMatchMessages(matchId: string): Promise<MessageWithSender[]> {
    const matchMessages = await db
      .select()
      .from(messages)
      .where(eq(messages.matchId, matchId))
      .orderBy(messages.createdAt);

    const result = await Promise.all(
      matchMessages.map(async (message) => {
        const [sender] = await db.select().from(users).where(eq(users.id, message.senderId));
        return {
          ...message,
          sender,
        };
      })
    );

    return result;
  }

  async getAllMessages(): Promise<any[]> {
    const allMessages = await db.select().from(messages).orderBy(desc(messages.createdAt));

    const result = await Promise.all(
      allMessages.map(async (message) => {
        const [sender] = await db.select().from(users).where(eq(users.id, message.senderId));
        const match = await this.getMatchById(message.matchId);
        return {
          ...message,
          sender,
          match,
        };
      })
    );

    return result;
  }

  // Activity log operations
  async createActivityLog(data: InsertActivityLog): Promise<ActivityLog> {
    const [log] = await db
      .insert(activityLogs)
      .values(data)
      .returning();
    return log;
  }

  async getAllActivityLogs(): Promise<any[]> {
    const logs = await db.select().from(activityLogs).orderBy(desc(activityLogs.createdAt)).limit(500);

    const result = await Promise.all(
      logs.map(async (log) => {
        if (log.userId) {
          const [user] = await db.select().from(users).where(eq(users.id, log.userId));
          return {
            ...log,
            user,
          };
        }
        return log;
      })
    );

    return result;
  }

  // Admin statistics
  async getAdminStats(): Promise<{
    totalUsers: number;
    totalLikes: number;
    totalMatches: number;
    totalMessages: number;
  }> {
    const [usersCount] = await db.select({ count: sql<number>`count(*)` }).from(users);
    const [likesCount] = await db.select({ count: sql<number>`count(*)` }).from(likes);
    const [matchesCount] = await db.select({ count: sql<number>`count(*)` }).from(matches);
    const [messagesCount] = await db.select({ count: sql<number>`count(*)` }).from(messages);

    return {
      totalUsers: Number(usersCount.count),
      totalLikes: Number(likesCount.count),
      totalMatches: Number(matchesCount.count),
      totalMessages: Number(messagesCount.count),
    };
  }
}

export const storage = new DatabaseStorage();
