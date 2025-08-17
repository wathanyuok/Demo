-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: ecommerce_db
-- ------------------------------------------------------
-- Server version	8.4.4

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cart`
--

DROP TABLE IF EXISTS `cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart` (
  `cartID` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `customerID` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `productID` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `qty` int NOT NULL,
  `total` double NOT NULL,
  PRIMARY KEY (`cartID`),
  KEY `Cart_customerID_fkey` (`customerID`),
  KEY `Cart_productID_fkey` (`productID`),
  CONSTRAINT `Cart_customerID_fkey` FOREIGN KEY (`customerID`) REFERENCES `customer` (`customerID`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Cart_productID_fkey` FOREIGN KEY (`productID`) REFERENCES `product` (`productID`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart`
--

LOCK TABLES `cart` WRITE;
/*!40000 ALTER TABLE `cart` DISABLE KEYS */;
INSERT INTO `cart` VALUES ('f7a66fa4-d05b-424c-9af3-cf29ba13da96','e98ea83a-6442-4ab6-8e90-de774c924d14','1edeb21e-0205-4bac-b000-64086adf9d28',15,1500);
/*!40000 ALTER TABLE `cart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category` (
  `categoryID` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `categoryName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`categoryID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES ('2960b5ba-17f6-46c1-873d-3069f66c56ac','josei'),('7d9a5a31-a418-4025-ad4e-cd034333e0b0','comedy'),('b0e93440-4d3a-4f49-8b40-400bf56b2f66','fantasy'),('bd8cd1b3-0518-4b55-bea0-f8560ea00757','shonen');
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customer`
--

DROP TABLE IF EXISTS `customer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customer` (
  `customerID` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `firstname` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lastname` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phonenumber` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`customerID`),
  UNIQUE KEY `Customer_email_key` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer`
--

LOCK TABLES `customer` WRITE;
/*!40000 ALTER TABLE `customer` DISABLE KEYS */;
INSERT INTO `customer` VALUES ('00fa1b1f-0dd6-4e99-b2c3-db86d185ed39','Wathanyu','Thinrat','nuii@gmail.com','$2b$10$/ElEeFlL9qO0UrKDMuapsODCX5Wuj8rMz1CzDMt00JA/0c9kQ/Vn6','0961462659','40/772 Rangsit road Klongsam district'),('78f0b7f7-35c5-4ec7-aa06-4a89864149c0','test','tse','customer3@gmail.com','$2b$10$X9NSsIy0OA.83rhagmEo..8j2MKebq513dzHioM.VklV9ELUZFSMW','0978959555','Bankkog'),('8191d88e-95ec-4f61-888b-6abafc0665e7','John','Doe','johndoe@example.com','$2b$10$CYCDQWNAJktdpub7r4vLQebeX2BvYC7QR3xLHjBs78OIK4iRdg8oC','0812345678','Bangkok'),('bb92cf94-2570-4910-b634-5102377a73f4','test','ss','customer1@gmail.com','$2b$10$RJTWft9kYLUSsA4yuvOQMuOn5WfSattdNOTLH0Ls8k4AGVXQldwOG','093939333','address'),('c02f2580-6bd5-4ea0-a331-717b13d8cca8','Wathanyu1','Thinrat','customer5@gmail.com','$2b$10$JWU0WwotLnedOkuwr44F9Oggd0afyZwGbWl4UgbAVm0Ik1YrfUMae','0961462654','40/772 Rangsit road Klongsam district'),('e84eee8a-4522-459c-9e7c-6549645a9af3','test1','11111','customer@gmail.com','$2b$10$Isv7VWpuMcn9bY8LNhiy6O0msob60Xy4heZeVmTVI8mTCfivEJmjW','0111113331','ddd'),('e98ea83a-6442-4ab6-8e90-de774c924d14','john2','john2','john2@gmail.com','$2b$10$mFtWuaVqkM7618rfzKuASebv/wyKVZypX2NZmFOnXM6z7bIthVGTi','09898990303','tst2'),('fdb9a2ff-59c9-4cd8-a56b-90f312cc73ed','john','lastname','john@gmail.com','$2b$10$ac76SvtAka.5fEwJTEIuMOS2/P4K2OwJk95P6vEu4lG3YBkPaAZLy','0961462659','40/772 Rangsit road Klongsam district');
/*!40000 ALTER TABLE `customer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `discount`
--

DROP TABLE IF EXISTS `discount`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `discount` (
  `discountID` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `discountType` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `discountValue` double NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`discountID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `discount`
--

LOCK TABLES `discount` WRITE;
/*!40000 ALTER TABLE `discount` DISABLE KEYS */;
/*!40000 ALTER TABLE `discount` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order`
--

DROP TABLE IF EXISTS `order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order` (
  `orderID` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `customerID` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `orderdate` datetime(3) NOT NULL,
  `totalAmount` double NOT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`orderID`),
  KEY `Order_customerID_fkey` (`customerID`),
  CONSTRAINT `Order_customerID_fkey` FOREIGN KEY (`customerID`) REFERENCES `customer` (`customerID`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order`
--

LOCK TABLES `order` WRITE;
/*!40000 ALTER TABLE `order` DISABLE KEYS */;
INSERT INTO `order` VALUES ('3253617b-42d1-43cb-93a4-d4070217081d','fdb9a2ff-59c9-4cd8-a56b-90f312cc73ed','2025-03-05 18:44:32.249',10,'paid','address'),('c37b155e-e1df-458f-84ed-f8b61e092886','fdb9a2ff-59c9-4cd8-a56b-90f312cc73ed','2025-03-05 18:22:54.720',1000,'paid','ggg'),('f9aa30d4-5c69-4984-961d-a5dd733d2d1d','00fa1b1f-0dd6-4e99-b2c3-db86d185ed39','2025-03-06 09:03:51.307',1253,'completed','address1');
/*!40000 ALTER TABLE `order` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orderdetail`
--

DROP TABLE IF EXISTS `orderdetail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orderdetail` (
  `orderDetailID` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `orderID` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `productID` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `quantity` int NOT NULL,
  `price` double NOT NULL,
  PRIMARY KEY (`orderDetailID`),
  KEY `OrderDetail_orderID_fkey` (`orderID`),
  KEY `OrderDetail_productID_fkey` (`productID`),
  CONSTRAINT `OrderDetail_orderID_fkey` FOREIGN KEY (`orderID`) REFERENCES `order` (`orderID`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `OrderDetail_productID_fkey` FOREIGN KEY (`productID`) REFERENCES `product` (`productID`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orderdetail`
--

LOCK TABLES `orderdetail` WRITE;
/*!40000 ALTER TABLE `orderdetail` DISABLE KEYS */;
INSERT INTO `orderdetail` VALUES ('6f87daf9-4525-4d7e-8754-4fafed3e3e96','f9aa30d4-5c69-4984-961d-a5dd733d2d1d','349fb809-f980-45ab-93b4-e2d7fc380f56',7,179),('a6fedac7-8b11-4aa8-84cd-4e715be0af6a','3253617b-42d1-43cb-93a4-d4070217081d','349fb809-f980-45ab-93b4-e2d7fc380f56',1,10),('b87791db-0f89-4f9f-a54f-a6d78eb2ec46','c37b155e-e1df-458f-84ed-f8b61e092886','98844c22-91c5-4f86-91aa-5b3e519063b3',1,1000);
/*!40000 ALTER TABLE `orderdetail` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment`
--

DROP TABLE IF EXISTS `payment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment` (
  `paymentID` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `orderID` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `paymentDate` datetime(3) NOT NULL,
  `slip` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `amount` double NOT NULL,
  `paymentMethod` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`paymentID`),
  UNIQUE KEY `Payment_orderID_key` (`orderID`),
  CONSTRAINT `Payment_orderID_fkey` FOREIGN KEY (`orderID`) REFERENCES `order` (`orderID`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment`
--

LOCK TABLES `payment` WRITE;
/*!40000 ALTER TABLE `payment` DISABLE KEYS */;
INSERT INTO `payment` VALUES ('dc719588-0ddb-4ff1-b052-4c192e7946b0','f9aa30d4-5c69-4984-961d-a5dd733d2d1d','2025-03-06 09:05:17.932','https://res.cloudinary.com/ds8jrtl0x/image/upload/v1741251918/xg0zxx9ditygztrfkrqi.jpg',1253,'bank_transfer'),('e48622c5-b6bb-40b3-983b-acb0ca22d8a4','c37b155e-e1df-458f-84ed-f8b61e092886','2025-03-05 18:23:36.696','https://res.cloudinary.com/ds8jrtl0x/image/upload/v1741199017/xiplg9tznsq5old1bn5u.png',1000,'bank_transfer'),('feaafe53-09f5-41c1-a7aa-ca4034050801','3253617b-42d1-43cb-93a4-d4070217081d','2025-03-05 18:44:48.080','https://res.cloudinary.com/ds8jrtl0x/image/upload/v1741200289/thkh14y503vfantoyj9n.jpg',10,'bank_transfer');
/*!40000 ALTER TABLE `payment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product` (
  `productID` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `productName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `productImage` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `price` double NOT NULL,
  `stockQuantity` int NOT NULL,
  `categoryID` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`productID`),
  KEY `Product_categoryID_fkey` (`categoryID`),
  CONSTRAINT `Product_categoryID_fkey` FOREIGN KEY (`categoryID`) REFERENCES `category` (`categoryID`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product`
--

LOCK TABLES `product` WRITE;
/*!40000 ALTER TABLE `product` DISABLE KEYS */;
INSERT INTO `product` VALUES ('1edeb21e-0205-4bac-b000-64086adf9d28','Dragonball','Dragon Ball is a Japanese media franchise created by Akira Toriyama in 1984. The initial manga, written and illustrated by Toriyama,','https://res.cloudinary.com/ds8jrtl0x/image/upload/v1741233623/products/ahkbczw0qmcyyhzq1enl.jpg',100,0,'b0e93440-4d3a-4f49-8b40-400bf56b2f66'),('349fb809-f980-45ab-93b4-e2d7fc380f56','Bleach','Bleach (stylized in all caps) is a Japanese anime television series based on Tite Kubo\'s original manga','https://res.cloudinary.com/ds8jrtl0x/image/upload/v1741233319/products/ue4pftrte1xqvruk0lxc.png',179,3,'2960b5ba-17f6-46c1-873d-3069f66c56ac'),('3e4ae585-12cd-4665-bc1f-f1a9bcb587d6','Naruto','xx','https://res.cloudinary.com/ds8jrtl0x/image/upload/v1741233386/products/vld6lszt8e64bycuwgj3.jpg',179,10,'b0e93440-4d3a-4f49-8b40-400bf56b2f66'),('98844c22-91c5-4f86-91aa-5b3e519063b3','Boruto','xx','https://res.cloudinary.com/ds8jrtl0x/image/upload/v1740734951/products/w0g1bfvz3stfukewco3b.jpg',1000,9,'b0e93440-4d3a-4f49-8b40-400bf56b2f66'),('cde1553e-372c-4c63-8b74-d8f2244a6b35','School Day','School Days is a Japanese slice-of-life eroge visual novel game developed by 0verflow,','https://res.cloudinary.com/ds8jrtl0x/image/upload/v1740494183/products/mij6rzeuwcrkjjvnrapj.jpg',159,1,'b0e93440-4d3a-4f49-8b40-400bf56b2f66');
/*!40000 ALTER TABLE `product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `productdiscount`
--

DROP TABLE IF EXISTS `productdiscount`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `productdiscount` (
  `productDiscountID` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `discountID` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `productID` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `discountType` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `discountValue` double NOT NULL,
  `startDate` datetime(3) NOT NULL,
  `endDate` datetime(3) NOT NULL,
  `isActive` tinyint(1) NOT NULL,
  PRIMARY KEY (`productDiscountID`),
  KEY `ProductDiscount_productID_fkey` (`productID`),
  CONSTRAINT `ProductDiscount_productID_fkey` FOREIGN KEY (`productID`) REFERENCES `product` (`productID`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productdiscount`
--

LOCK TABLES `productdiscount` WRITE;
/*!40000 ALTER TABLE `productdiscount` DISABLE KEYS */;
/*!40000 ALTER TABLE `productdiscount` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `userID` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `username` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'admin',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`userID`),
  UNIQUE KEY `User_username_key` (`username`),
  UNIQUE KEY `User_email_key` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES ('283f5b40-78b4-4198-965b-81f8f468c44a','admin','admin@gmail.com','$2a$12$npgQxSWtyQ2buGzKQZ2S7uP.891Fi9./4rg2pLfEdytvWk/dMdPgi','admin','admin','2025-02-25 19:39:00.000','2025-02-25 19:39:00.000');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-08-15 21:42:13
