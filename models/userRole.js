const create ="CREATE TABLE `salvage`.`users_roles` ( `user_role_id` INT NOT NULL AUTO_INCREMENT , `user_id` INT NOT NULL , `role_id` INT NOT NULL , `created_by` INT NOT NULL , `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , `updated_at` TIMESTAMP on update CURRENT_TIMESTAMP NULL , `updated_by` INT NULL , PRIMARY KEY (`user_role_id`)) ENGINE = InnoDB;"