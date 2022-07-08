const query = "CREATE TABLE `salvage`.`users` ( `user_id` INT NOT NULL AUTO_INCREMENT , `first_name` VARCHAR(50) NOT NULL , `last_name` VARCHAR(50) NOT NULL , `email` VARCHAR(100) NOT NULL , `password` VARCHAR(500) NOT NULL,  `status` VARCHAR(50) NOT NULL DEFAULT 'active', PRIMARY KEY (`user_id`)) ENGINE = InnoDB";

const alter = "ALTER TABLE `users` ADD `phone` VARCHAR(50) NOT NULL AFTER `status`, ADD `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP AFTER `phone`, ADD `updated_at` TIMESTAMP on update CURRENT_TIMESTAMP NULL AFTER `created_at`, ADD `deleted_at` TIMESTAMP NULL AFTER `updated_at`, ADD `created_by` INT NOT NULL AFTER `deleted_at`";

const alter2 = "ALTER TABLE `users` ADD `updated_by` INT NULL AFTER `created_by`, ADD `deleted_by` INT NULL AFTER `updated_by`;"

const alter3 = "ALTER TABLE `users` ADD `photo` VARCHAR(500) NULL AFTER `phone`;"