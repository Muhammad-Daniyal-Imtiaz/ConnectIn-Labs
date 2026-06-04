CREATE TABLE `challenge_submissions` (
	`id` text PRIMARY KEY NOT NULL,
	`challenge_id` text NOT NULL,
	`team_id` text NOT NULL,
	`captain_user_id` text NOT NULL,
	`team_name` text NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`video_link` text,
	`github_url` text,
	`live_demo_url` text,
	`tech_stack_json` text DEFAULT '[]' NOT NULL,
	`team_members_json` text DEFAULT '[]' NOT NULL,
	`additional_links_json` text DEFAULT '[]',
	`status` text DEFAULT 'Submitted' NOT NULL,
	`judge_notes` text,
	`prize_won` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `challenge_submissions_challenge_idx` ON `challenge_submissions` (`challenge_id`);--> statement-breakpoint
CREATE INDEX `challenge_submissions_team_idx` ON `challenge_submissions` (`team_id`);--> statement-breakpoint
CREATE INDEX `challenge_submissions_captain_idx` ON `challenge_submissions` (`captain_user_id`);--> statement-breakpoint
CREATE INDEX `challenge_submissions_status_idx` ON `challenge_submissions` (`status`);--> statement-breakpoint
CREATE TABLE `challenge_teams` (
	`id` text PRIMARY KEY NOT NULL,
	`challenge_id` text NOT NULL,
	`team_name` text NOT NULL,
	`captain_user_id` text NOT NULL,
	`members_json` text DEFAULT '[]' NOT NULL,
	`invitation_status` text DEFAULT 'Active' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `challenge_teams_challenge_idx` ON `challenge_teams` (`challenge_id`);--> statement-breakpoint
CREATE INDEX `challenge_teams_captain_idx` ON `challenge_teams` (`captain_user_id`);--> statement-breakpoint
CREATE TABLE `challenges` (
	`id` text PRIMARY KEY NOT NULL,
	`posted_by_user_id` text NOT NULL,
	`company_page_id` text,
	`company_name` text NOT NULL,
	`company_logo` text,
	`company_slug` text,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`prizes_json` text DEFAULT '[]' NOT NULL,
	`duration` text NOT NULL,
	`location` text NOT NULL,
	`min_team_members` integer DEFAULT 1 NOT NULL,
	`max_team_members` integer DEFAULT 5 NOT NULL,
	`category` text DEFAULT 'Engineering' NOT NULL,
	`status` text DEFAULT 'Open' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `challenges_poster_idx` ON `challenges` (`posted_by_user_id`);--> statement-breakpoint
CREATE INDEX `challenges_company_idx` ON `challenges` (`company_page_id`);--> statement-breakpoint
CREATE INDEX `challenges_status_idx` ON `challenges` (`status`);--> statement-breakpoint
CREATE TABLE `freelance_submissions` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text NOT NULL,
	`applicant_user_id` text NOT NULL,
	`name` text DEFAULT '' NOT NULL,
	`email` text DEFAULT '' NOT NULL,
	`proposal_text` text NOT NULL,
	`portfolio_link` text,
	`bid_amount` integer,
	`status` text DEFAULT 'Submitted' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `freelance_submissions_unique_idx` ON `freelance_submissions` (`project_id`,`applicant_user_id`);--> statement-breakpoint
CREATE INDEX `freelance_submissions_project_idx` ON `freelance_submissions` (`project_id`);--> statement-breakpoint
CREATE INDEX `freelance_submissions_applicant_idx` ON `freelance_submissions` (`applicant_user_id`);--> statement-breakpoint
DROP INDEX "challenge_submissions_challenge_idx";--> statement-breakpoint
DROP INDEX "challenge_submissions_team_idx";--> statement-breakpoint
DROP INDEX "challenge_submissions_captain_idx";--> statement-breakpoint
DROP INDEX "challenge_submissions_status_idx";--> statement-breakpoint
DROP INDEX "challenge_teams_challenge_idx";--> statement-breakpoint
DROP INDEX "challenge_teams_captain_idx";--> statement-breakpoint
DROP INDEX "challenges_poster_idx";--> statement-breakpoint
DROP INDEX "challenges_company_idx";--> statement-breakpoint
DROP INDEX "challenges_status_idx";--> statement-breakpoint
DROP INDEX "company_pages_slug_idx";--> statement-breakpoint
DROP INDEX "company_pages_owner_idx";--> statement-breakpoint
DROP INDEX "company_pages_industry_idx";--> statement-breakpoint
DROP INDEX "freelance_submissions_unique_idx";--> statement-breakpoint
DROP INDEX "freelance_submissions_project_idx";--> statement-breakpoint
DROP INDEX "freelance_submissions_applicant_idx";--> statement-breakpoint
DROP INDEX "job_applications_unique_idx";--> statement-breakpoint
DROP INDEX "job_applications_job_idx";--> statement-breakpoint
DROP INDEX "job_applications_applicant_idx";--> statement-breakpoint
DROP INDEX "job_applications_status_idx";--> statement-breakpoint
DROP INDEX "job_postings_company_idx";--> statement-breakpoint
DROP INDEX "job_postings_poster_idx";--> statement-breakpoint
DROP INDEX "job_postings_industry_idx";--> statement-breakpoint
DROP INDEX "job_postings_open_idx";--> statement-breakpoint
DROP INDEX "job_postings_type_idx";--> statement-breakpoint
DROP INDEX "users_email_idx";--> statement-breakpoint
ALTER TABLE `job_applications` ALTER COLUMN "phone" TO "phone" text;--> statement-breakpoint
CREATE UNIQUE INDEX `company_pages_slug_idx` ON `company_pages` (`slug`);--> statement-breakpoint
CREATE INDEX `company_pages_owner_idx` ON `company_pages` (`owner_id`);--> statement-breakpoint
CREATE INDEX `company_pages_industry_idx` ON `company_pages` (`industry`);--> statement-breakpoint
CREATE UNIQUE INDEX `job_applications_unique_idx` ON `job_applications` (`job_id`,`applicant_user_id`);--> statement-breakpoint
CREATE INDEX `job_applications_job_idx` ON `job_applications` (`job_id`);--> statement-breakpoint
CREATE INDEX `job_applications_applicant_idx` ON `job_applications` (`applicant_user_id`);--> statement-breakpoint
CREATE INDEX `job_applications_status_idx` ON `job_applications` (`status`);--> statement-breakpoint
CREATE INDEX `job_postings_company_idx` ON `job_postings` (`company_page_id`);--> statement-breakpoint
CREATE INDEX `job_postings_poster_idx` ON `job_postings` (`posted_by_user_id`);--> statement-breakpoint
CREATE INDEX `job_postings_industry_idx` ON `job_postings` (`industry`);--> statement-breakpoint
CREATE INDEX `job_postings_open_idx` ON `job_postings` (`is_open`);--> statement-breakpoint
CREATE INDEX `job_postings_type_idx` ON `job_postings` (`employment_type`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_idx` ON `users` (`email`);--> statement-breakpoint
ALTER TABLE `job_applications` ADD `name` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `job_applications` ADD `email` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `job_applications` ADD `address` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `job_applications` ADD `portfolio_link` text;--> statement-breakpoint
ALTER TABLE `job_applications` ADD `cover_letter_url` text;