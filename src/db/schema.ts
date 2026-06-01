import { sql } from "drizzle-orm";
import { sqliteTable, text, uniqueIndex, index } from "drizzle-orm/sqlite-core";

const timestamps = {
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
};

export const users = sqliteTable(
  "users",
  {
    id: text("id").primaryKey(), // Clerk user ID
    email: text("email").notNull(),
    name: text("name").notNull(),
    role: text("role").notNull(), // 'Founder' | 'Cofounder' | 'Jobseeker' | 'Freelancer' | 'Student'
    avatarUrl: text("avatar_url"),
    ...timestamps,
  },
  (t) => ({
    emailIdx: uniqueIndex("users_email_idx").on(t.email),
    roleIdx: index("users_role_idx").on(t.role),
  })
);

export const posts = sqliteTable(
  "posts",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull(),
    userName: text("user_name").notNull(),
    userRole: text("user_role").notNull(),
    userAvatar: text("user_avatar").notNull(),
    title: text("title").notNull(),
    content: text("content").notNull(),
    category: text("category").notNull(), // 'Idea' | 'MVP' | 'Investment Wanted' | 'Partners Wanted' | 'Startup Space Wanted' | 'Cofounder Wanted'
    imagesJson: text("images_json").notNull().default("[]"), // Up to 3 base64 strings serialized as JSON
    ...timestamps,
  },
  (t) => ({
    categoryIdx: index("posts_category_idx").on(t.category),
    userIdIdx: index("posts_user_id_idx").on(t.userId),
  })
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
