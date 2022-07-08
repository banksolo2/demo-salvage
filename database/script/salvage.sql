-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 03, 2022 at 06:59 PM
-- Server version: 10.4.22-MariaDB
-- PHP Version: 8.1.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `salvage`
--

-- --------------------------------------------------------

--
-- Table structure for table `bids`
--

CREATE TABLE `bids` (
  `bid_id` int(11) NOT NULL,
  `buyer_id` int(11) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `item_id` int(11) NOT NULL,
  `narration` text NOT NULL,
  `bid_status_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `approved_by` int(11) DEFAULT NULL,
  `approved_at` timestamp NULL DEFAULT NULL,
  `declined_by` int(11) DEFAULT NULL,
  `declined_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `bids`
--

INSERT INTO `bids` (`bid_id`, `buyer_id`, `amount`, `item_id`, `narration`, `bid_status_id`, `created_at`, `updated_at`, `approved_by`, `approved_at`, `declined_by`, `declined_at`) VALUES
(2, 2, '2000000.00', 3, 'I need this car now', 2, '2022-06-28 19:19:17', '2022-06-28 19:19:42', 1, '2022-06-28 19:19:42', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `bid_status`
--

CREATE TABLE `bid_status` (
  `bid_status_id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL,
  `code` varchar(150) NOT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_by` int(11) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `bid_status`
--

INSERT INTO `bid_status` (`bid_status_id`, `name`, `code`, `created_by`, `created_at`, `updated_by`, `updated_at`) VALUES
(1, 'Pending', 'PENDING', 1, '2022-06-27 10:32:31', NULL, NULL),
(2, 'Approved', 'APPROVED', 1, '2022-06-27 10:32:48', NULL, NULL),
(3, 'Declined', 'DECLINED', 1, '2022-06-27 10:32:58', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `brands`
--

CREATE TABLE `brands` (
  `brand_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_by` int(11) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `brands`
--

INSERT INTO `brands` (`brand_id`, `name`, `created_by`, `created_at`, `updated_by`, `updated_at`) VALUES
(1, 'Cars ', 1, '2022-06-13 14:49:56', 1, '2022-06-13 14:50:29'),
(2, 'Others', 1, '2022-06-16 08:57:59', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `buyers`
--

CREATE TABLE `buyers` (
  `buyer_id` int(11) NOT NULL,
  `name` varchar(200) NOT NULL,
  `phone` varchar(200) NOT NULL,
  `email` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `buyers`
--

INSERT INTO `buyers` (`buyer_id`, `name`, `phone`, `email`, `created_at`, `updated_at`) VALUES
(1, 'Peter Olotu', '08080643360', 'peterolo2@gmail.com', '2022-06-27 11:29:54', '2022-06-27 11:43:55'),
(2, 'Joseph Olotu', '08080643360', 'josepholo2@yahoo.ca', '2022-06-27 11:36:53', '2022-06-27 11:43:32');

-- --------------------------------------------------------

--
-- Table structure for table `items`
--

CREATE TABLE `items` (
  `item_id` int(11) NOT NULL,
  `name` varchar(200) DEFAULT NULL,
  `reg_no` varchar(200) DEFAULT NULL,
  `state_id` int(11) DEFAULT NULL,
  `phone` varchar(200) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `close_date` date DEFAULT NULL,
  `brand_id` int(11) DEFAULT NULL,
  `salvage_status_id` int(11) DEFAULT NULL,
  `reserve_price` decimal(10,2) DEFAULT NULL,
  `disposal_price` decimal(10,2) DEFAULT NULL,
  `claim_no` varchar(100) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `front_image` varchar(200) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `approved_by` int(11) DEFAULT NULL,
  `approved_at` timestamp NULL DEFAULT NULL,
  `deleted_by` int(11) DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `closed_by` int(11) DEFAULT NULL,
  `closed_at` timestamp NULL DEFAULT NULL,
  `page` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `items`
--

INSERT INTO `items` (`item_id`, `name`, `reg_no`, `state_id`, `phone`, `address`, `close_date`, `brand_id`, `salvage_status_id`, `reserve_price`, `disposal_price`, `claim_no`, `created_by`, `created_at`, `front_image`, `updated_by`, `updated_at`, `approved_by`, `approved_at`, `deleted_by`, `deleted_at`, `closed_by`, `closed_at`, `page`) VALUES
(3, 'Benz c300', '455776869969', 24, '08080643360', 'Block 103, Flat 3, Zone A, 1st car park, Iba Housing Estate', '2022-08-31', 1, 5, '1600000.00', '2000000.00', '5467488849', 1, '2022-06-28 19:15:43', NULL, 1, '2022-06-30 13:57:23', 1, '2022-06-28 19:16:11', 1, '2022-06-30 13:57:23', 1, '2022-06-28 19:19:42', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `items_back_images`
--

CREATE TABLE `items_back_images` (
  `item_image_id` int(11) NOT NULL,
  `image` varchar(200) NOT NULL,
  `item_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `role_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `code` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_by` int(11) NOT NULL,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `updated_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`role_id`, `name`, `code`, `created_at`, `created_by`, `updated_at`, `updated_by`) VALUES
(1, 'Super Admin', 'SUPER_ADMIN', '2022-06-13 14:04:49', 1, NULL, NULL),
(2, 'Admin', 'ADMIN', '2022-06-13 14:13:49', 1, NULL, NULL),
(3, 'Salvage Committee', 'SALVAGE_COMMITTEE', '2022-06-13 14:13:49', 1, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `salvage_status`
--

CREATE TABLE `salvage_status` (
  `salvage_status_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `code` varchar(100) NOT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_by` int(11) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `salvage_status`
--

INSERT INTO `salvage_status` (`salvage_status_id`, `name`, `code`, `created_by`, `created_at`, `updated_by`, `updated_at`) VALUES
(2, 'Approved', 'APPROVED', 1, '2022-06-13 14:51:14', NULL, NULL),
(3, 'Pending', 'PENDING', 1, '2022-06-14 15:16:42', NULL, NULL),
(4, 'Declined', 'DECLINED', 1, '2022-06-14 15:17:04', NULL, NULL),
(5, 'Deleted', 'DELETED', 1, '2022-06-15 15:37:13', 1, '2022-06-15 15:37:36'),
(6, 'Closed', 'CLOSED', 1, '2022-06-21 10:37:55', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `states`
--

CREATE TABLE `states` (
  `state_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_by` int(11) NOT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `states`
--

INSERT INTO `states` (`state_id`, `name`, `created_at`, `created_by`, `updated_by`, `updated_at`) VALUES
(1, 'Abia', '2022-06-13 14:20:25', 1, NULL, NULL),
(2, 'Adamawa', '2022-06-13 14:20:38', 1, NULL, NULL),
(3, 'Akwa Ibom', '2022-06-13 14:21:41', 1, NULL, NULL),
(4, 'Anambra', '2022-06-13 14:21:52', 1, NULL, NULL),
(5, 'Bauchi', '2022-06-13 14:22:06', 1, NULL, NULL),
(6, 'Bayelsa', '2022-06-13 14:22:20', 1, NULL, NULL),
(7, 'Benue', '2022-06-13 14:22:30', 1, NULL, NULL),
(8, 'Borno', '2022-06-13 14:22:44', 1, NULL, NULL),
(9, 'Cross River', '2022-06-13 14:23:05', 1, NULL, NULL),
(10, 'Delta', '2022-06-13 14:23:17', 1, NULL, NULL),
(11, 'Ebonyi', '2022-06-13 14:23:31', 1, NULL, NULL),
(12, 'Edo', '2022-06-13 14:23:43', 1, NULL, NULL),
(13, 'Ekiti', '2022-06-13 14:23:54', 1, NULL, NULL),
(14, 'Enugu', '2022-06-13 14:24:25', 1, NULL, NULL),
(15, 'Gombe', '2022-06-13 14:24:46', 1, NULL, NULL),
(16, 'Imo', '2022-06-13 14:25:12', 1, NULL, NULL),
(17, 'Jigawa', '2022-06-13 14:25:30', 1, NULL, NULL),
(18, 'Kaduna', '2022-06-13 14:25:49', 1, NULL, NULL),
(19, 'Kano', '2022-06-13 14:26:06', 1, NULL, NULL),
(20, 'Katsina', '2022-06-13 14:26:19', 1, NULL, NULL),
(21, 'Kebbi', '2022-06-13 14:26:36', 1, NULL, NULL),
(22, 'Kogi', '2022-06-13 14:26:49', 1, NULL, NULL),
(23, 'Kwara', '2022-06-13 14:27:07', 1, NULL, NULL),
(24, 'Lagos', '2022-06-13 14:27:25', 1, NULL, NULL),
(25, 'Nasarawa', '2022-06-13 14:27:45', 1, NULL, NULL),
(26, 'Niger', '2022-06-13 14:28:04', 1, NULL, NULL),
(27, 'Ogun', '2022-06-13 14:28:20', 1, NULL, NULL),
(28, 'Ondo', '2022-06-13 14:28:58', 1, NULL, NULL),
(29, 'Osun', '2022-06-13 14:29:20', 1, NULL, NULL),
(30, 'Oyo', '2022-06-13 14:30:20', 1, NULL, NULL),
(31, 'Plateau', '2022-06-13 14:30:31', 1, NULL, NULL),
(32, 'Rivers', '2022-06-13 14:30:46', 1, NULL, NULL),
(33, 'Sokoto', '2022-06-13 14:31:00', 1, NULL, NULL),
(34, 'Taraba', '2022-06-13 14:31:34', 1, NULL, NULL),
(35, 'Yobe', '2022-06-13 14:31:50', 1, NULL, NULL),
(36, 'Zamfara', '2022-06-13 14:32:17', 1, NULL, NULL),
(37, 'Abuja', '2022-06-13 14:34:36', 1, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(500) NOT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'active',
  `phone` varchar(50) NOT NULL,
  `photo` varchar(500) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_by` int(11) NOT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `deleted_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `first_name`, `last_name`, `email`, `password`, `status`, `phone`, `photo`, `created_at`, `updated_at`, `deleted_at`, `created_by`, `updated_by`, `deleted_by`) VALUES
(1, 'Oluwaseun  ', 'Olotu  ', 'seunolo2@gmail.com', '$2b$10$KkzQOKzHl/Du105gNIvy9uedxGJtWZ6ywKE2lYioyusmpuuez8xwu', 'Active', '2348080643360  ', '192298271_3987336984680442_7638215833304910601_n.jpg', '2022-06-13 14:03:01', '2022-06-13 14:18:28', NULL, 0, 1, NULL),
(2, 'Joseph', 'Olotu', 'josepholo2@yahoo.ca', '$2b$10$/pL6BD174.VWg4zcE04eGuHLvXY8WSFCibJ/5XUm02K8ql9V9X8v.', 'active', '08080643360', NULL, '2022-06-19 19:24:22', NULL, NULL, 1, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users_roles`
--

CREATE TABLE `users_roles` (
  `user_role_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `updated_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users_roles`
--

INSERT INTO `users_roles` (`user_role_id`, `user_id`, `role_id`, `created_by`, `created_at`, `updated_at`, `updated_by`) VALUES
(1, 1, 1, 1, '2022-06-13 14:05:20', NULL, NULL),
(2, 2, 3, 1, '2022-06-19 19:24:55', NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bids`
--
ALTER TABLE `bids`
  ADD PRIMARY KEY (`bid_id`);

--
-- Indexes for table `bid_status`
--
ALTER TABLE `bid_status`
  ADD PRIMARY KEY (`bid_status_id`);

--
-- Indexes for table `brands`
--
ALTER TABLE `brands`
  ADD PRIMARY KEY (`brand_id`);

--
-- Indexes for table `buyers`
--
ALTER TABLE `buyers`
  ADD PRIMARY KEY (`buyer_id`);

--
-- Indexes for table `items`
--
ALTER TABLE `items`
  ADD PRIMARY KEY (`item_id`);

--
-- Indexes for table `items_back_images`
--
ALTER TABLE `items_back_images`
  ADD PRIMARY KEY (`item_image_id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`role_id`);

--
-- Indexes for table `salvage_status`
--
ALTER TABLE `salvage_status`
  ADD PRIMARY KEY (`salvage_status_id`);

--
-- Indexes for table `states`
--
ALTER TABLE `states`
  ADD PRIMARY KEY (`state_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`);

--
-- Indexes for table `users_roles`
--
ALTER TABLE `users_roles`
  ADD PRIMARY KEY (`user_role_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bids`
--
ALTER TABLE `bids`
  MODIFY `bid_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `bid_status`
--
ALTER TABLE `bid_status`
  MODIFY `bid_status_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `brands`
--
ALTER TABLE `brands`
  MODIFY `brand_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `buyers`
--
ALTER TABLE `buyers`
  MODIFY `buyer_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `items`
--
ALTER TABLE `items`
  MODIFY `item_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `items_back_images`
--
ALTER TABLE `items_back_images`
  MODIFY `item_image_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `role_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `salvage_status`
--
ALTER TABLE `salvage_status`
  MODIFY `salvage_status_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `states`
--
ALTER TABLE `states`
  MODIFY `state_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `users_roles`
--
ALTER TABLE `users_roles`
  MODIFY `user_role_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
