CREATE TABLE `mvps` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`user_name` text NOT NULL,
	`user_role` text NOT NULL,
	`user_avatar` text NOT NULL,
	`title` text NOT NULL,
	`tagline` text NOT NULL,
	`category` text NOT NULL,
	`reason` text NOT NULL,
	`asking_price` text NOT NULL,
	`revenue` text NOT NULL,
	`users` text NOT NULL,
	`github_repo` text,
	`tech_stack` text NOT NULL,
	`product_description` text NOT NULL,
	`repo_verified` integer DEFAULT false,
	`ownership_verified` integer DEFAULT true,
	`github_stars` integer DEFAULT 0,
	`screenshot` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `posts` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`user_name` text NOT NULL,
	`user_role` text NOT NULL,
	`user_avatar` text NOT NULL,
	`title` text NOT NULL,
	`content` text NOT NULL,
	`category` text NOT NULL,
	`images_json` text DEFAULT '[]' NOT NULL,
	`show_contact_email` integer DEFAULT false,
	`show_contact_phone` integer DEFAULT false,
	`show_contact_country` integer DEFAULT false,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `profiles` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`phone` text,
	`country` text,
	`location` text,
	`linkedin_url` text,
	`twitter_url` text,
	`instagram_url` text,
	`leetcode_url` text,
	`hackerrank_url` text,
	`portfolio_url` text,
	`best_project_url` text,
	`roles_json` text DEFAULT '[]' NOT NULL,
	`employment_status` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
DROP INDEX `users_role_idx`;--> statement-breakpoint
DROP INDEX "users_email_idx";--> statement-breakpoint
ALTER TABLE `users` ALTER COLUMN "role" TO "role" text NOT NULL DEFAULT 'None';--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_idx` ON `users` (`email`);