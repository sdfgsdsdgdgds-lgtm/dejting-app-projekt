# Design Guidelines: Dating/Matching Application

## Design Approach

**Selected Approach:** Reference-Based (Dating App Industry Leaders)

Drawing inspiration from Tinder's card-based interactions, Bumble's friendly aesthetics, and Hinge's conversation-focused design, this application emphasizes visual storytelling through profile imagery while maintaining clean, intuitive navigation.

**Core Principles:**
- Photo-first: Profile images dominate the visual hierarchy
- Immediacy: Users should understand actions instantly
- Trust & Safety: Clean, professional interface builds credibility
- Distinct Modes: Clear separation between browsing, chatting, and admin functions

---

## Typography

**Font Stack:**
- Primary: Inter (Google Fonts) - Clean, modern, excellent at all sizes
- Accent: DM Sans (Google Fonts) - For headings and CTAs

**Hierarchy:**
- Hero Headlines: 3xl to 5xl, bold weight
- Section Headers: 2xl to 3xl, semibold
- Profile Names: xl to 2xl, medium weight  
- Body Text: base to lg, regular weight
- Metadata (age, location): sm to base, medium weight
- Buttons/CTAs: base to lg, semibold

---

## Layout System

**Spacing Primitives:** Tailwind units of 2, 4, 6, 8, 12, 16

**Containers:**
- Landing page: max-w-7xl with full-width hero
- Profile browsing: max-w-6xl centered
- Chat interface: max-w-4xl
- Admin dashboard: max-w-screen-2xl for data tables

**Grid Systems:**
- Profile cards: Single column mobile, 2-3 column desktop (grid-cols-1 md:grid-cols-2 lg:grid-cols-3)
- Admin tables: Responsive full-width with horizontal scroll on mobile

---

## Component Library

### Landing Page Components

**Hero Section (60-70vh):**
- Large background: Gradient overlay on lifestyle imagery showing diverse people connecting
- Centered content with headline, subheadline, primary CTA
- Floating cards showcasing example profiles (absolute positioned, subtle shadows)

**Feature Sections:**
- Three-column grid: Icon + Title + Description pattern
- Icons: Heroicons (outline style, size-12 to size-16)
- Alternating image-text layouts for detailed features

**Social Proof:**
- Testimonial cards in 2-column layout
- User avatars (rounded-full, size-12)
- Star ratings with review snippets

**CTA Section:**
- Full-width with subtle gradient background
- Large headline, supporting text, prominent button

### User Authentication

**Login/Register Forms:**
- Centered card design (max-w-md)
- Generous padding (p-8 to p-12)
- Floating labels for inputs
- OAuth buttons with brand icons (Google, Apple)
- Toggle between login/register states

### Profile Browsing Interface

**Profile Cards:**
- Portrait orientation (aspect-ratio: 3/4)
- Large profile photo with subtle gradient overlay at bottom
- Name, age, location overlaid on image (bottom-left, p-6)
- Interests as pill badges (rounded-full, px-4 py-2)
- Like/Pass action buttons (circular, size-16, fixed at bottom)

**Card Interactions:**
- Hover: Subtle scale (scale-105) and shadow increase
- Click to expand: Full-screen modal with complete profile

### Chat Interface

**Message List:**
- Split layout: Conversation list (w-80 fixed) + active chat (flex-1)
- Match avatars in sidebar (size-12, rounded-full)
- Last message preview with timestamp
- Unread indicator (badge)

**Chat Window:**
- Sticky header with match info and avatar
- Message bubbles with max-width (max-w-md)
- Sender bubbles: right-aligned
- Receiver bubbles: left-aligned  
- Input field: Sticky bottom with send button

### Admin Panel

**Dashboard Layout:**
- Sidebar navigation (w-64 fixed, h-screen)
- Main content area with header breadcrumbs
- Stats cards in 4-column grid (grid-cols-4)

**Data Tables:**
- Striped rows for readability
- Sticky headers
- Action buttons per row (view, edit, delete icons)
- Search and filter controls above table
- Pagination at bottom

**Activity Logs:**
- Timeline layout with timestamp markers
- Icon indicators for action types
- Expandable details on click

---

## Images

**Hero Section Image:**
- Full-width background image (1920x1080 minimum)
- Subject: Diverse group of people socializing, laughing, connecting in modern setting
- Treatment: Subtle gradient overlay (dark to transparent, bottom to top)
- Placement: Spans full hero section with content overlaid

**Profile Browsing:**
- Placeholder profile photos in cards (600x800 portrait)
- Mix of lifestyle shots, headshots showing personality
- All images with subtle border-radius (rounded-lg to rounded-xl)

**Feature Sections:**
- Alternating sections use lifestyle imagery (800x600)
- Screenshots of app interface where relevant
- All images maintain consistent rounded corners

**Admin Panel:**
- Minimal imagery - focus on data
- User avatars only (thumbnail size-10 to size-12)

---

## Form Elements

**Input Fields:**
- Consistent height (h-12)
- Border style: border-2 with rounded-lg
- Focus states: Ring effect (ring-2, ring-offset-2)
- Padding: px-4

**Buttons:**
- Primary CTAs: Large (px-8 py-4), rounded-full
- Secondary actions: Outlined style, same size
- Icon buttons: Circular (rounded-full, size-12 to size-16)
- Consistent hover/active states with transform and shadow

**Select/Dropdown:**
- Match input field styling
- Custom arrow icon
- Dropdown menu with shadow-lg

---

## Navigation

**Public Pages:**
- Transparent header on landing (becomes solid on scroll)
- Logo left, navigation center, CTA button right
- Mobile: Hamburger menu

**Authenticated User:**
- Fixed bottom navigation on mobile (4-5 icons)
- Sidebar on desktop with avatar, profile link, browse, matches, chat

**Admin:**
- Vertical sidebar navigation
- Grouped menu items with section headers
- Active state indicators

---

## Accessibility

- All interactive elements have minimum touch target of 44x44px
- Form inputs have visible labels
- Focus states clearly visible with ring utilities
- Consistent tab navigation order
- ARIA labels on icon-only buttons
- Color contrast meets WCAG AA standards

---

## Key Screens Specifications

**Landing:** Hero + 3 feature sections + social proof + CTA (5-6 sections total)

**Browse Profiles:** Grid of 6-12 profile cards per page with pagination

**Profile Detail Modal:** Full-screen overlay with image gallery, bio, interests, action buttons

**Chat:** Split view with conversation list and active chat window

**Admin Dashboard:** Stats overview + recent activity + quick actions