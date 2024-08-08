-- CreateTable
CREATE TABLE `menucategory`
(
    `id`        INTEGER      NOT NULL AUTO_INCREMENT,
    `name`      VARCHAR(191) NOT NULL,
    `priority`  DOUBLE       NOT NULL DEFAULT -1,
    `createdAt` DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3)  NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `menuitem`
(
    `id`             INTEGER        NOT NULL AUTO_INCREMENT,
    `name`           VARCHAR(191)   NOT NULL,
    `type`           VARCHAR(191)   NOT NULL DEFAULT 'FOOD',
    `menuCategoryId` INTEGER        NOT NULL,
    `price`          DECIMAL(10, 2) NOT NULL,
    `createdAt`      DATETIME(3)    NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt`      DATETIME(3)    NOT NULL,

    INDEX `MenuItem_menuCategoryId_fkey` (`menuCategoryId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `order`
(
    `id`        INTEGER     NOT NULL AUTO_INCREMENT,
    `tableId`   INTEGER     NOT NULL,
    `closedAt`  DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Order_tableId_fkey` (`tableId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `orderitem`
(
    `id`         INTEGER     NOT NULL AUTO_INCREMENT,
    `orderId`    INTEGER     NOT NULL,
    `menuItemId` INTEGER     NOT NULL,
    `quantity`   INTEGER     NOT NULL,
    `createdAt`  DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt`  DATETIME(3) NOT NULL,

    INDEX `OrderItem_menuItemId_fkey` (`menuItemId`),
    INDEX `OrderItem_orderId_fkey` (`orderId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `table`
(
    `id`        INTEGER      NOT NULL AUTO_INCREMENT,
    `name`      VARCHAR(191) NOT NULL,
    `x`         INTEGER      NOT NULL,
    `y`         INTEGER      NOT NULL,
    `width`     INTEGER      NOT NULL,
    `height`    INTEGER      NOT NULL,
    `createdAt` DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3)  NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user`
(
    `id`        INTEGER      NOT NULL AUTO_INCREMENT,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName`  VARCHAR(191) NOT NULL,
    `username`  VARCHAR(191) NOT NULL,
    `password`  VARCHAR(191) NOT NULL,
    `pin`       VARCHAR(191) NOT NULL,
    `role`      VARCHAR(191) NOT NULL DEFAULT 'WAITER',
    `token`     VARCHAR(191) NULL,
    `createdAt` DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3)  NOT NULL,

    UNIQUE INDEX `User_username_key` (`username`),
    UNIQUE INDEX `User_pin_key` (`pin`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `menuitem`
    ADD CONSTRAINT `MenuItem_menuCategoryId_fkey` FOREIGN KEY (`menuCategoryId`) REFERENCES `menucategory` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order`
    ADD CONSTRAINT `Order_tableId_fkey` FOREIGN KEY (`tableId`) REFERENCES `table` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orderitem`
    ADD CONSTRAINT `OrderItem_menuItemId_fkey` FOREIGN KEY (`menuItemId`) REFERENCES `menuitem` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orderitem`
    ADD CONSTRAINT `OrderItem_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `order` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

