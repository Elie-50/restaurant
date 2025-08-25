ALTER TABLE `users` RENAME COLUMN `name` TO `username`;--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `id` varchar(36) NOT NULL;--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `username` varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `users` ADD `password` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `first_name` varchar(100);--> statement-breakpoint
ALTER TABLE `users` ADD `last_name` varchar(100);--> statement-breakpoint
ALTER TABLE `users` ADD `is_verified` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `verification_token` varchar(255);--> statement-breakpoint
ALTER TABLE `users` ADD `verification_token_expires` timestamp;--> statement-breakpoint
ALTER TABLE `users` ADD `verification_code` varchar(6);--> statement-breakpoint
ALTER TABLE `users` ADD `verification_code_expires_in` timestamp;--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_id_unique` UNIQUE(`id`);--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_username_unique` UNIQUE(`username`);