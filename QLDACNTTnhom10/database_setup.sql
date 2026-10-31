-- =============================================================================
-- FITMANAGE GYM & YOGA SUITE - DATABASE SETUP & SEED SCRIPT
-- Cơ sở dữ liệu: GymManagementDB
-- Hướng dẫn: Chạy toàn bộ file này trong SQL Server Management Studio (SSMS)
-- =============================================================================

IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'GymManagementDB')
BEGIN
    CREATE DATABASE [GymManagementDB];
END
GO

USE [GymManagementDB];
GO

-- 1. BẢNG ROLES
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'ROLES')
BEGIN
    CREATE TABLE ROLES (
        RoleID int IDENTITY(1,1) NOT NULL PRIMARY KEY,
        RoleName nvarchar(50) NOT NULL
    );
END
GO

-- 2. BẢNG USERS
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'USERS')
BEGIN
    CREATE TABLE USERS (
        UserID int IDENTITY(1,1) NOT NULL PRIMARY KEY,
        Username varchar(50) NOT NULL,
        PasswordHash varchar(255) NOT NULL,
        Email varchar(100) NOT NULL,
        RoleID int NOT NULL,
        IsActive bit NULL DEFAULT 1,
        CreatedAt datetime NULL DEFAULT GETDATE(),
        UpdatedAt datetime NULL,
        CONSTRAINT FK_Users_Roles FOREIGN KEY (RoleID) REFERENCES ROLES(RoleID)
    );
END
GO

-- 3. BẢNG MEMBERS
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'MEMBERS')
BEGIN
    CREATE TABLE MEMBERS (
        MemberID int IDENTITY(1,1) NOT NULL PRIMARY KEY,
        UserID int NOT NULL,
        FullName nvarchar(100) NOT NULL,
        Phone varchar(20) NOT NULL,
        DateOfBirth date NULL,
        Gender nvarchar(10) NULL,
        CreatedAt datetime NULL DEFAULT GETDATE(),
        AvatarUrl nvarchar(500) NULL,
        CONSTRAINT FK_Members_Users FOREIGN KEY (UserID) REFERENCES USERS(UserID)
    );
END
GO

-- 4. BẢNG TRAINERS
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'TRAINERS')
BEGIN
    CREATE TABLE TRAINERS (
        TrainerID int IDENTITY(1,1) NOT NULL PRIMARY KEY,
        UserID int NOT NULL,
        Specialization nvarchar(50) NOT NULL,
        Phone varchar(20) NOT NULL,
        CreatedAt datetime NULL DEFAULT GETDATE(),
        CONSTRAINT FK_Trainers_Users FOREIGN KEY (UserID) REFERENCES USERS(UserID)
    );
END
GO

-- 5. BẢNG PACKAGES
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'PACKAGES')
BEGIN
    CREATE TABLE PACKAGES (
        PackageID int IDENTITY(1,1) NOT NULL PRIMARY KEY,
        PackageName nvarchar(100) NOT NULL,
        PackageType nvarchar(50) NOT NULL,
        DurationDays int NOT NULL,
        TotalSessions int NULL,
        Price decimal(18,2) NOT NULL,
        IsFlexibleTime bit NULL DEFAULT 0,
        IsActive bit NULL DEFAULT 1
    );
END
GO

-- 6. BẢNG CLASSES
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'CLASSES')
BEGIN
    CREATE TABLE CLASSES (
        ClassID int IDENTITY(1,1) NOT NULL PRIMARY KEY,
        ClassName nvarchar(100) NOT NULL,
        TrainerID int NOT NULL,
        Capacity int NULL DEFAULT 20,
        CONSTRAINT FK_Classes_Trainers FOREIGN KEY (TrainerID) REFERENCES TRAINERS(TrainerID)
    );
END
GO

-- 7. BẢNG CONTRACTS
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'CONTRACTS')
BEGIN
    CREATE TABLE CONTRACTS (
        ContractID int IDENTITY(1,1) NOT NULL PRIMARY KEY,
        MemberID int NOT NULL,
        PackageID int NOT NULL,
        TrainerID int NULL,
        ClassID int NULL,
        StartDate date NOT NULL,
        EndDate date NOT NULL,
        RemainingSessions int NULL,
        TotalAmount decimal(18,2) NOT NULL,
        DiscountAmount decimal(18,2) NULL DEFAULT 0,
        PromoCode varchar(50) NULL,
        Status nvarchar(20) NULL DEFAULT N'Active',
        LastRemindedDate datetime NULL,
        CreatedAt datetime NULL DEFAULT GETDATE(),
        UpdatedAt datetime NULL,
        CONSTRAINT FK_Contracts_Members FOREIGN KEY (MemberID) REFERENCES MEMBERS(MemberID),
        CONSTRAINT FK_Contracts_Packages FOREIGN KEY (PackageID) REFERENCES PACKAGES(PackageID),
        CONSTRAINT FK_Contracts_Trainers FOREIGN KEY (TrainerID) REFERENCES TRAINERS(TrainerID),
        CONSTRAINT FK_Contracts_Classes FOREIGN KEY (ClassID) REFERENCES CLASSES(ClassID)
    );
END
GO

-- 8. BẢNG PAYMENTS
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'PAYMENTS')
BEGIN
    CREATE TABLE PAYMENTS (
        PaymentID int IDENTITY(1,1) NOT NULL PRIMARY KEY,
        ContractID int NOT NULL,
        Amount decimal(18,2) NOT NULL,
        PaymentDate datetime NULL DEFAULT GETDATE(),
        PaymentMethod nvarchar(50) NOT NULL,
        TransactionNo varchar(100) NULL,
        Status nvarchar(20) NULL DEFAULT N'Completed',
        CONSTRAINT FK_Payments_Contracts FOREIGN KEY (ContractID) REFERENCES CONTRACTS(ContractID)
    );
END
GO

-- 9. BẢNG CLASS_SCHEDULES
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'CLASS_SCHEDULES')
BEGIN
    CREATE TABLE CLASS_SCHEDULES (
        ScheduleID int IDENTITY(1,1) NOT NULL PRIMARY KEY,
        ClassID int NOT NULL,
        Room nvarchar(50) NOT NULL,
        StartTime datetime NOT NULL,
        EndTime datetime NOT NULL,
        CONSTRAINT FK_Schedules_Classes FOREIGN KEY (ClassID) REFERENCES CLASSES(ClassID)
    );
END
GO

-- 10. BẢNG CHECK_INS
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'CHECK_INS')
BEGIN
    CREATE TABLE CHECK_INS (
        CheckInID int IDENTITY(1,1) NOT NULL PRIMARY KEY,
        MemberID int NOT NULL,
        ContractID int NOT NULL,
        ScheduleID int NULL,
        CheckInTime datetime NOT NULL DEFAULT GETDATE(),
        CheckOutTime datetime NULL,
        CheckInType nvarchar(50) NOT NULL,
        CONSTRAINT FK_CheckIns_Members FOREIGN KEY (MemberID) REFERENCES MEMBERS(MemberID),
        CONSTRAINT FK_CheckIns_Contracts FOREIGN KEY (ContractID) REFERENCES CONTRACTS(ContractID),
        CONSTRAINT FK_CheckIns_Schedules FOREIGN KEY (ScheduleID) REFERENCES CLASS_SCHEDULES(ScheduleID)
    );
END
GO

-- 11. BẢNG AI_PREDICTIONS
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'AI_PREDICTIONS')
BEGIN
    CREATE TABLE AI_PREDICTIONS (
        PredictionID int IDENTITY(1,1) NOT NULL PRIMARY KEY,
        MemberID int NOT NULL,
        ContractID int NOT NULL,
        RenewalProbability float NOT NULL,
        RiskLevel nvarchar(20) NOT NULL,
        RetentionStrategy nvarchar(max) NULL,
        IsHandled bit NULL DEFAULT 0,
        PredictionDate date NULL DEFAULT CAST(GETDATE() AS DATE),
        CONSTRAINT FK_Predictions_Members FOREIGN KEY (MemberID) REFERENCES MEMBERS(MemberID),
        CONSTRAINT FK_Predictions_Contracts FOREIGN KEY (ContractID) REFERENCES CONTRACTS(ContractID)
    );
END
GO

-- =============================================================================
-- SEED DATA: Chèn dữ liệu mẫu nếu bảng đang trống
-- =============================================================================

-- SEED CHO BẢNG ROLES
IF NOT EXISTS (SELECT 1 FROM ROLES)
BEGIN
    SET IDENTITY_INSERT ROLES ON;
    INSERT INTO ROLES ([RoleID], [RoleName]) VALUES (1, N'Admin');
    INSERT INTO ROLES ([RoleID], [RoleName]) VALUES (4, N'Member');
    INSERT INTO ROLES ([RoleID], [RoleName]) VALUES (2, N'Staff');
    INSERT INTO ROLES ([RoleID], [RoleName]) VALUES (3, N'Trainer');
    SET IDENTITY_INSERT ROLES OFF;
END
GO

-- SEED CHO BẢNG USERS
IF NOT EXISTS (SELECT 1 FROM USERS)
BEGIN
    SET IDENTITY_INSERT USERS ON;
    INSERT INTO USERS ([UserID], [Username], [PasswordHash], [Email], [RoleID], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (1, 'admin_gym', 'HASH1', 'admin@gym.com', 1, 1, '2026-10-24 21:56:04.840', '2026-10-24 21:56:04.840');
    INSERT INTO USERS ([UserID], [Username], [PasswordHash], [Email], [RoleID], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (2, 'staff_sale', 'HASH2', 'sale@gym.com', 2, 1, '2026-10-24 21:56:04.840', '2026-10-24 21:56:04.840');
    INSERT INTO USERS ([UserID], [Username], [PasswordHash], [Email], [RoleID], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (3, 'pt_tuan', 'HASH3', 'tuanpt@gym.com', 3, 1, '2026-10-24 21:56:04.840', '2026-10-24 21:56:04.840');
    INSERT INTO USERS ([UserID], [Username], [PasswordHash], [Email], [RoleID], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (4, 'yoga_hoa', 'HASH4', 'hoayoga@gym.com', 3, 1, '2026-10-24 21:56:04.840', '2026-10-24 21:56:04.840');
    INSERT INTO USERS ([UserID], [Username], [PasswordHash], [Email], [RoleID], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (5, 'mem_khoi', 'HASH5', 'khoi.vo@gmail.com', 4, 1, '2026-10-24 21:56:04.840', '2026-10-24 21:56:04.840');
    INSERT INTO USERS ([UserID], [Username], [PasswordHash], [Email], [RoleID], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (6, 'mem_nhiem', 'HASH6', 'nhiem.vo@gmail.com', 4, 1, '2026-10-24 21:56:04.840', '2026-10-24 21:56:04.840');
    INSERT INTO USERS ([UserID], [Username], [PasswordHash], [Email], [RoleID], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (7, 'mem_tam', 'HASH7', 'tam.le@gmail.com', 4, 1, '2026-10-24 21:56:04.840', '2026-10-24 21:56:04.840');
    INSERT INTO USERS ([UserID], [Username], [PasswordHash], [Email], [RoleID], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (8, 'qa_tester_admin', '$2a$11$JbDgm7oIKXbektWx2zkf6.Wd/NMjTJUpIYpLYsp9eH5UUkUEdT.LK', 'qa_admin@fitmanage.vn', 1, 1, '2026-10-24 22:14:25.807', '2026-10-24 22:14:25.807');
    INSERT INTO USERS ([UserID], [Username], [PasswordHash], [Email], [RoleID], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (9, 'admin_super', '$2a$11$Y3cKcD3d4rD4.qiXoXxsdemwxyp/L/ohCbl4DgxK0Zab08bGXtHRO', 'admin_super@fitmanage.vn', 1, 1, '2026-10-24 22:44:43.473', '2026-10-24 22:44:43.473');
    INSERT INTO USERS ([UserID], [Username], [PasswordHash], [Email], [RoleID], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (10, 'nam_yoga', '123456', 'nam.nguyen@fitmanage.vn', 3, 1, '2026-10-30 21:56:53.317', '2026-10-30 21:56:53.317');
    INSERT INTO USERS ([UserID], [Username], [PasswordHash], [Email], [RoleID], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (11, 'trang_pilates', '123456', 'trang.pilates@fitmanage.vn', 3, 1, '2026-10-30 21:56:53.320', '2026-10-30 21:56:53.320');
    INSERT INTO USERS ([UserID], [Username], [PasswordHash], [Email], [RoleID], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (12, 'david_pt', '123456', 'david.tran@fitmanage.vn', 3, 1, '2026-10-30 21:56:53.320', '2026-10-30 21:56:53.320');
    INSERT INTO USERS ([UserID], [Username], [PasswordHash], [Email], [RoleID], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (13, 'quan_boxing', '123456', 'quan.boxing@fitmanage.vn', 3, 1, '2026-10-30 21:56:53.320', '2026-10-30 21:56:53.320');
    INSERT INTO USERS ([UserID], [Username], [PasswordHash], [Email], [RoleID], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (14, 'ngocanh_yin', '123456', 'ngocanh.yin@fitmanage.vn', 3, 1, '2026-10-30 21:56:53.320', '2026-10-30 21:56:53.320');
    INSERT INTO USERS ([UserID], [Username], [PasswordHash], [Email], [RoleID], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (15, 'trong_strength', '123456', 'trong.strength@fitmanage.vn', 3, 1, '2026-10-30 21:56:53.320', '2026-10-30 21:56:53.320');
    INSERT INTO USERS ([UserID], [Username], [PasswordHash], [Email], [RoleID], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (16, 'sarah_mitchel', '123456', 'sarah.mitchel@gmail.com', 4, 1, '2026-10-30 21:56:53.333', '2026-10-30 21:56:53.333');
    INSERT INTO USERS ([UserID], [Username], [PasswordHash], [Email], [RoleID], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (17, 'james_torlak', '123456', 'james.torlak@gmail.com', 4, 1, '2026-10-30 21:56:53.333', '2026-10-30 21:56:53.333');
    INSERT INTO USERS ([UserID], [Username], [PasswordHash], [Email], [RoleID], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (18, 'priya_nat', '123456', 'priya.nat@gmail.com', 4, 1, '2026-10-30 21:56:53.333', '2026-10-30 21:56:53.333');
    INSERT INTO USERS ([UserID], [Username], [PasswordHash], [Email], [RoleID], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (19, 'carlos_reyes', '123456', 'carlos.reyes@gmail.com', 4, 1, '2026-10-30 21:56:53.333', '2026-10-30 21:56:53.333');
    INSERT INTO USERS ([UserID], [Username], [PasswordHash], [Email], [RoleID], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (20, 'ngoc_tran', '123456', 'ngoc.tran@gmail.com', 4, 1, '2026-10-30 21:56:53.337', '2026-10-30 21:56:53.337');
    INSERT INTO USERS ([UserID], [Username], [PasswordHash], [Email], [RoleID], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (21, 'fit_test_admin', '$2a$12$zyh9OzizWVpT.BxhzxqvNuwQ38csVOcfZNtOvyg4kbnZfL5h/ufGO', 'fit-test-admin@example.invalid', 1, 1, '2026-10-31 00:21:21.843', '2026-10-31 00:21:21.843');
    INSERT INTO USERS ([UserID], [Username], [PasswordHash], [Email], [RoleID], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (22, 'fit_test_staff', '$2a$12$Dm9xEgBDF8.myNsn2EI5q.YuhiCC.zKb0bD31Mczucohjqkux4Bj6', 'fit-test-staff@example.invalid', 2, 1, '2026-10-31 00:21:22.113', '2026-10-31 00:21:22.113');
    INSERT INTO USERS ([UserID], [Username], [PasswordHash], [Email], [RoleID], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (23, 'fit_test_trainer', '$2a$12$ZqC7lrDKATHVlVNr4UHYs.K70IMTZlQjsocEAyZKoUUgrU7QHQ192', 'fit-test-trainer@example.invalid', 3, 1, '2026-10-31 00:21:22.367', '2026-10-31 00:21:22.367');
    INSERT INTO USERS ([UserID], [Username], [PasswordHash], [Email], [RoleID], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (24, 'fit_test_member', '$2a$12$ogoM2chqVXTLFjNxBSUvouhLy9weMZVJ2Eo3FqF6XMq1uxqh/J9ku', 'fit-test-member@example.invalid', 4, 1, '2026-10-31 00:21:22.610', '2026-10-31 00:21:22.610');
    SET IDENTITY_INSERT USERS OFF;
END
GO

-- SEED CHO BẢNG MEMBERS
IF NOT EXISTS (SELECT 1 FROM MEMBERS)
BEGIN
    SET IDENTITY_INSERT MEMBERS ON;
    INSERT INTO MEMBERS ([MemberID], [UserID], [FullName], [Phone], [DateOfBirth], [Gender], [CreatedAt], [AvatarUrl]) VALUES (1, 5, N'Võ Nguyễn Đăng Khôi', '0987654321', NULL, NULL, '2026-10-24 21:56:04.850', NULL);
    INSERT INTO MEMBERS ([MemberID], [UserID], [FullName], [Phone], [DateOfBirth], [Gender], [CreatedAt], [AvatarUrl]) VALUES (2, 6, N'Võ Minh Nhiệm', '0912345678', NULL, NULL, '2026-10-24 21:56:04.850', NULL);
    INSERT INTO MEMBERS ([MemberID], [UserID], [FullName], [Phone], [DateOfBirth], [Gender], [CreatedAt], [AvatarUrl]) VALUES (3, 7, N'Lê Anh Tâm', '0977889900', NULL, NULL, '2026-10-24 21:56:04.850', NULL);
    INSERT INTO MEMBERS ([MemberID], [UserID], [FullName], [Phone], [DateOfBirth], [Gender], [CreatedAt], [AvatarUrl]) VALUES (4, 16, N'Sarah Mitchel', '081-234-5678', '1998-09-12', N'Nữ', '2025-04-30 21:56:53.333', NULL);
    INSERT INTO MEMBERS ([MemberID], [UserID], [FullName], [Phone], [DateOfBirth], [Gender], [CreatedAt], [AvatarUrl]) VALUES (5, 17, N'James Torlak', '081-345-6789', '1992-04-15', N'Nam', '2025-10-30 21:56:53.333', NULL);
    INSERT INTO MEMBERS ([MemberID], [UserID], [FullName], [Phone], [DateOfBirth], [Gender], [CreatedAt], [AvatarUrl]) VALUES (6, 18, N'Priya Natarajan', '081-456-7890', '1995-11-20', N'Nữ', '2026-02-28 21:56:53.333', NULL);
    INSERT INTO MEMBERS ([MemberID], [UserID], [FullName], [Phone], [DateOfBirth], [Gender], [CreatedAt], [AvatarUrl]) VALUES (7, 19, N'Carlos Reyes', '081-567-8901', '1996-03-08', N'Nam', '2026-04-30 21:56:53.337', NULL);
    INSERT INTO MEMBERS ([MemberID], [UserID], [FullName], [Phone], [DateOfBirth], [Gender], [CreatedAt], [AvatarUrl]) VALUES (8, 20, N'Trần Bảo Ngọc', '0909-112-233', '1997-07-22', N'Nữ', '2025-12-30 21:56:53.337', NULL);
    INSERT INTO MEMBERS ([MemberID], [UserID], [FullName], [Phone], [DateOfBirth], [Gender], [CreatedAt], [AvatarUrl]) VALUES (9, 24, N'Hội viên kiểm thử FitManage', '0900009904', NULL, N'Khác', '2026-10-31 00:21:22.627', NULL);
    SET IDENTITY_INSERT MEMBERS OFF;
END
GO

-- SEED CHO BẢNG TRAINERS
IF NOT EXISTS (SELECT 1 FROM TRAINERS)
BEGIN
    SET IDENTITY_INSERT TRAINERS ON;
    INSERT INTO TRAINERS ([TrainerID], [UserID], [Specialization], [Phone], [CreatedAt]) VALUES (1, 3, N'Gym & Fitness PT', '0901111222', '2026-10-24 21:56:04.847');
    INSERT INTO TRAINERS ([TrainerID], [UserID], [Specialization], [Phone], [CreatedAt]) VALUES (2, 4, N'Yoga Hatha', '0903333444', '2026-10-24 21:56:04.847');
    INSERT INTO TRAINERS ([TrainerID], [UserID], [Specialization], [Phone], [CreatedAt]) VALUES (3, 10, N'Master Yoga Coach', '0908 123 456', '2026-10-30 21:56:53.317');
    INSERT INTO TRAINERS ([TrainerID], [UserID], [Specialization], [Phone], [CreatedAt]) VALUES (4, 11, N'Senior Pilates Specialist', '0918 222 333', '2026-10-30 21:56:53.320');
    INSERT INTO TRAINERS ([TrainerID], [UserID], [Specialization], [Phone], [CreatedAt]) VALUES (5, 12, N'Elite Bodybuilding & PT', '0978 999 888', '2026-10-30 21:56:53.320');
    INSERT INTO TRAINERS ([TrainerID], [UserID], [Specialization], [Phone], [CreatedAt]) VALUES (6, 13, N'Senior Kickboxing & HIIT', '0938 555 123', '2026-10-30 21:56:53.320');
    INSERT INTO TRAINERS ([TrainerID], [UserID], [Specialization], [Phone], [CreatedAt]) VALUES (7, 14, N'Yoga Therapy & Yin', '0903 777 999', '2026-10-30 21:56:53.320');
    INSERT INTO TRAINERS ([TrainerID], [UserID], [Specialization], [Phone], [CreatedAt]) VALUES (8, 15, N'Junior Strength & Conditioning', '0966 444 777', '2026-10-30 21:56:53.320');
    INSERT INTO TRAINERS ([TrainerID], [UserID], [Specialization], [Phone], [CreatedAt]) VALUES (9, 23, N'Kiểm thử giao diện - không nhận lớp', '0900009903', '2026-10-31 00:21:22.373');
    SET IDENTITY_INSERT TRAINERS OFF;
END
GO

-- SEED CHO BẢNG PACKAGES
IF NOT EXISTS (SELECT 1 FROM PACKAGES)
BEGIN
    SET IDENTITY_INSERT PACKAGES ON;
    INSERT INTO PACKAGES ([PackageID], [PackageName], [PackageType], [DurationDays], [TotalSessions], [Price], [IsFlexibleTime], [IsActive]) VALUES (1, N'Gym Tự Do 1 Tháng', N'Gym', 30, 0, 500000.00, NULL, 1);
    INSERT INTO PACKAGES ([PackageID], [PackageName], [PackageType], [DurationDays], [TotalSessions], [Price], [IsFlexibleTime], [IsActive]) VALUES (2, N'Yoga Theo Lớp 1 Tháng', N'Yoga', 30, 0, 800000.00, 0, 1);
    INSERT INTO PACKAGES ([PackageID], [PackageName], [PackageType], [DurationDays], [TotalSessions], [Price], [IsFlexibleTime], [IsActive]) VALUES (3, N'Gym + PT 1 Kèm 1 (1 Tháng)', N'PT', 30, 12, 3500000.00, NULL, 1);
    INSERT INTO PACKAGES ([PackageID], [PackageName], [PackageType], [DurationDays], [TotalSessions], [Price], [IsFlexibleTime], [IsActive]) VALUES (4, N'Gym Diamond 12 Tháng', N'Gym', 365, 0, 18500000.00, NULL, 1);
    INSERT INTO PACKAGES ([PackageID], [PackageName], [PackageType], [DurationDays], [TotalSessions], [Price], [IsFlexibleTime], [IsActive]) VALUES (5, N'Yoga VIP Unlimited All-Access', N'Yoga', 365, 0, 14200000.00, NULL, 1);
    INSERT INTO PACKAGES ([PackageID], [PackageName], [PackageType], [DurationDays], [TotalSessions], [Price], [IsFlexibleTime], [IsActive]) VALUES (6, N'Combo PT 1:1 Siêu cấp (36 Buổi)', N'PT', 180, 36, 28800000.00, NULL, 1);
    INSERT INTO PACKAGES ([PackageID], [PackageName], [PackageType], [DurationDays], [TotalSessions], [Price], [IsFlexibleTime], [IsActive]) VALUES (7, N'Gym Cao Cấp Premium (6 Tháng)', N'Gym', 180, 0, 9600000.00, NULL, 1);
    INSERT INTO PACKAGES ([PackageID], [PackageName], [PackageType], [DurationDays], [TotalSessions], [Price], [IsFlexibleTime], [IsActive]) VALUES (8, N'Pilates Reformer VIP (3 Tháng)', N'Yoga', 90, 36, 7500000.00, NULL, 1);
    INSERT INTO PACKAGES ([PackageID], [PackageName], [PackageType], [DurationDays], [TotalSessions], [Price], [IsFlexibleTime], [IsActive]) VALUES (9, N'Gói Thử Nghiệm 7 Ngày', N'Gym', 7, 7, 150000.00, NULL, 1);
    SET IDENTITY_INSERT PACKAGES OFF;
END
GO

-- SEED CHO BẢNG CLASSES
IF NOT EXISTS (SELECT 1 FROM CLASSES)
BEGIN
    SET IDENTITY_INSERT CLASSES ON;
    INSERT INTO CLASSES ([ClassID], [ClassName], [TrainerID], [Capacity]) VALUES (1, N'Yoga Sáng Hatha', 2, 20);
    INSERT INTO CLASSES ([ClassID], [ClassName], [TrainerID], [Capacity]) VALUES (2, N'Vinyasa Flow Yoga', 4, 15);
    INSERT INTO CLASSES ([ClassID], [ClassName], [TrainerID], [Capacity]) VALUES (3, N'Ashtanga Morning Kick', 3, 18);
    INSERT INTO CLASSES ([ClassID], [ClassName], [TrainerID], [Capacity]) VALUES (4, N'BodyPump Strength', 6, 20);
    INSERT INTO CLASSES ([ClassID], [ClassName], [TrainerID], [Capacity]) VALUES (5, N'Pilates Reformer Core', 4, 6);
    SET IDENTITY_INSERT CLASSES OFF;
END
GO

-- SEED CHO BẢNG CONTRACTS
IF NOT EXISTS (SELECT 1 FROM CONTRACTS)
BEGIN
    SET IDENTITY_INSERT CONTRACTS ON;
    INSERT INTO CONTRACTS ([ContractID], [MemberID], [PackageID], [TrainerID], [ClassID], [StartDate], [EndDate], [RemainingSessions], [TotalAmount], [DiscountAmount], [PromoCode], [Status], [LastRemindedDate], [CreatedAt], [UpdatedAt]) VALUES (1, 1, 1, NULL, NULL, '2026-09-01', '2026-10-01', 0, 500000.00, NULL, NULL, N'Expired', NULL, '2026-10-24 21:56:04.853', '2026-10-24 22:43:52.797');
    INSERT INTO CONTRACTS ([ContractID], [MemberID], [PackageID], [TrainerID], [ClassID], [StartDate], [EndDate], [RemainingSessions], [TotalAmount], [DiscountAmount], [PromoCode], [Status], [LastRemindedDate], [CreatedAt], [UpdatedAt]) VALUES (2, 2, 2, NULL, 1, '2026-09-01', '2026-10-01', 0, 800000.00, NULL, NULL, N'Expired', '2026-10-30 18:17:25.260', '2026-10-24 21:56:04.853', '2026-10-30 18:17:25.260');
    INSERT INTO CONTRACTS ([ContractID], [MemberID], [PackageID], [TrainerID], [ClassID], [StartDate], [EndDate], [RemainingSessions], [TotalAmount], [DiscountAmount], [PromoCode], [Status], [LastRemindedDate], [CreatedAt], [UpdatedAt]) VALUES (3, 3, 3, 1, NULL, '2026-09-01', '2026-10-01', 0, 3150000.00, 350000.00, 'AI_GIA_HAN_10', N'Expired', NULL, '2026-10-24 21:56:04.853', '2026-10-24 22:43:52.797');
    INSERT INTO CONTRACTS ([ContractID], [MemberID], [PackageID], [TrainerID], [ClassID], [StartDate], [EndDate], [RemainingSessions], [TotalAmount], [DiscountAmount], [PromoCode], [Status], [LastRemindedDate], [CreatedAt], [UpdatedAt]) VALUES (4, 4, 5, NULL, NULL, '2025-11-06', '2026-11-06', 0, 14200000.00, 0.00, 'AI_COMEBACK_20', N'Active', NULL, '2025-11-06 21:56:53.337', '2026-10-30 21:56:53.337');
    INSERT INTO CONTRACTS ([ContractID], [MemberID], [PackageID], [TrainerID], [ClassID], [StartDate], [EndDate], [RemainingSessions], [TotalAmount], [DiscountAmount], [PromoCode], [Status], [LastRemindedDate], [CreatedAt], [UpdatedAt]) VALUES (5, 5, 7, NULL, NULL, '2026-05-17', '2026-11-13', 0, 9600000.00, 0.00, 'AI_COMEBACK_20', N'Active', NULL, '2026-05-17 21:56:53.340', '2026-10-30 21:56:53.340');
    INSERT INTO CONTRACTS ([ContractID], [MemberID], [PackageID], [TrainerID], [ClassID], [StartDate], [EndDate], [RemainingSessions], [TotalAmount], [DiscountAmount], [PromoCode], [Status], [LastRemindedDate], [CreatedAt], [UpdatedAt]) VALUES (6, 6, 6, NULL, NULL, '2026-05-24', '2026-11-20', 4, 28800000.00, 0.00, 'AI_GIA_HAN_10', N'Active', NULL, '2026-05-24 21:56:53.340', '2026-10-30 21:56:53.340');
    INSERT INTO CONTRACTS ([ContractID], [MemberID], [PackageID], [TrainerID], [ClassID], [StartDate], [EndDate], [RemainingSessions], [TotalAmount], [DiscountAmount], [PromoCode], [Status], [LastRemindedDate], [CreatedAt], [UpdatedAt]) VALUES (7, 7, 4, NULL, NULL, '2025-11-27', '2026-11-27', 0, 18500000.00, 0.00, 'AI_GIA_HAN_10', N'Active', NULL, '2025-11-27 21:56:53.340', '2026-10-30 21:56:53.340');
    INSERT INTO CONTRACTS ([ContractID], [MemberID], [PackageID], [TrainerID], [ClassID], [StartDate], [EndDate], [RemainingSessions], [TotalAmount], [DiscountAmount], [PromoCode], [Status], [LastRemindedDate], [CreatedAt], [UpdatedAt]) VALUES (8, 8, 5, NULL, NULL, '2025-12-14', '2026-12-14', 0, 14200000.00, 0.00, 'AI_VIP_15', N'Active', '2026-10-30 22:26:10.750', '2025-12-14 21:56:53.340', '2026-10-30 22:26:10.750');
    SET IDENTITY_INSERT CONTRACTS OFF;
END
GO

-- SEED CHO BẢNG PAYMENTS
IF NOT EXISTS (SELECT 1 FROM PAYMENTS)
BEGIN
    SET IDENTITY_INSERT PAYMENTS ON;
    INSERT INTO PAYMENTS ([PaymentID], [ContractID], [Amount], [PaymentDate], [PaymentMethod], [TransactionNo], [Status]) VALUES (1, 1, 500000.00, '2026-10-24 21:56:04.853', N'MoMo', 'MM12345', N'Completed');
    INSERT INTO PAYMENTS ([PaymentID], [ContractID], [Amount], [PaymentDate], [PaymentMethod], [TransactionNo], [Status]) VALUES (2, 2, 800000.00, '2026-10-24 21:56:04.853', N'VNPAY', 'VN99887', N'Completed');
    INSERT INTO PAYMENTS ([PaymentID], [ContractID], [Amount], [PaymentDate], [PaymentMethod], [TransactionNo], [Status]) VALUES (3, 3, 3150000.00, '2026-10-24 21:56:04.853', N'Tiền mặt', NULL, N'Completed');
    SET IDENTITY_INSERT PAYMENTS OFF;
END
GO

-- SEED CHO BẢNG CLASS_SCHEDULES
IF NOT EXISTS (SELECT 1 FROM CLASS_SCHEDULES)
BEGIN
    SET IDENTITY_INSERT CLASS_SCHEDULES ON;
    INSERT INTO CLASS_SCHEDULES ([ScheduleID], [ClassID], [Room], [StartTime], [EndTime]) VALUES (1, 1, N'Studio 1', '2026-09-17 07:30:00.000', '2026-09-17 09:00:00.000');
    INSERT INTO CLASS_SCHEDULES ([ScheduleID], [ClassID], [Room], [StartTime], [EndTime]) VALUES (2, 2, N'Studio 01', '2026-10-30 07:00:00.000', '2026-10-30 08:00:00.000');
    INSERT INTO CLASS_SCHEDULES ([ScheduleID], [ClassID], [Room], [StartTime], [EndTime]) VALUES (3, 2, N'Studio 01', '2026-11-01 07:00:00.000', '2026-11-01 08:00:00.000');
    INSERT INTO CLASS_SCHEDULES ([ScheduleID], [ClassID], [Room], [StartTime], [EndTime]) VALUES (5, 4, N'Studio GroupX', '2026-11-01 07:00:00.000', '2026-11-01 08:00:00.000');
    INSERT INTO CLASS_SCHEDULES ([ScheduleID], [ClassID], [Room], [StartTime], [EndTime]) VALUES (6, 5, N'Studio Pilates', '2026-10-30 09:30:00.000', '2026-10-30 10:30:00.000');
    SET IDENTITY_INSERT CLASS_SCHEDULES OFF;
END
GO

-- SEED CHO BẢNG CHECK_INS
IF NOT EXISTS (SELECT 1 FROM CHECK_INS)
BEGIN
    SET IDENTITY_INSERT CHECK_INS ON;
    INSERT INTO CHECK_INS ([CheckInID], [MemberID], [ContractID], [ScheduleID], [CheckInTime], [CheckOutTime], [CheckInType]) VALUES (1, 1, 1, NULL, '2026-09-16 18:30:00.000', '2026-09-16 20:15:00.000', N'Gym_Entry');
    INSERT INTO CHECK_INS ([CheckInID], [MemberID], [ContractID], [ScheduleID], [CheckInTime], [CheckOutTime], [CheckInType]) VALUES (2, 2, 2, 1, '2026-09-17 07:20:00.000', NULL, N'Class_Session');
    INSERT INTO CHECK_INS ([CheckInID], [MemberID], [ContractID], [ScheduleID], [CheckInTime], [CheckOutTime], [CheckInType]) VALUES (3, 4, 4, NULL, '2026-10-16 21:56:53.337', NULL, N'Thẻ từ');
    INSERT INTO CHECK_INS ([CheckInID], [MemberID], [ContractID], [ScheduleID], [CheckInTime], [CheckOutTime], [CheckInType]) VALUES (4, 4, 4, NULL, '2026-10-08 21:56:53.337', NULL, N'Thẻ từ');
    INSERT INTO CHECK_INS ([CheckInID], [MemberID], [ContractID], [ScheduleID], [CheckInTime], [CheckOutTime], [CheckInType]) VALUES (5, 5, 5, NULL, '2026-10-25 21:56:53.340', NULL, N'Thẻ từ');
    INSERT INTO CHECK_INS ([CheckInID], [MemberID], [ContractID], [ScheduleID], [CheckInTime], [CheckOutTime], [CheckInType]) VALUES (6, 5, 5, NULL, '2026-10-20 21:56:53.340', NULL, N'Thẻ từ');
    INSERT INTO CHECK_INS ([CheckInID], [MemberID], [ContractID], [ScheduleID], [CheckInTime], [CheckOutTime], [CheckInType]) VALUES (7, 5, 5, NULL, '2026-10-12 21:56:53.340', NULL, N'Thẻ từ');
    INSERT INTO CHECK_INS ([CheckInID], [MemberID], [ContractID], [ScheduleID], [CheckInTime], [CheckOutTime], [CheckInType]) VALUES (8, 5, 5, NULL, '2026-10-05 21:56:53.340', NULL, N'Thẻ từ');
    INSERT INTO CHECK_INS ([CheckInID], [MemberID], [ContractID], [ScheduleID], [CheckInTime], [CheckOutTime], [CheckInType]) VALUES (9, 6, 6, NULL, '2026-10-28 21:56:53.340', NULL, N'Thẻ từ');
    INSERT INTO CHECK_INS ([CheckInID], [MemberID], [ContractID], [ScheduleID], [CheckInTime], [CheckOutTime], [CheckInType]) VALUES (10, 6, 6, NULL, '2026-10-26 21:56:53.340', NULL, N'Thẻ từ');
    INSERT INTO CHECK_INS ([CheckInID], [MemberID], [ContractID], [ScheduleID], [CheckInTime], [CheckOutTime], [CheckInType]) VALUES (11, 6, 6, NULL, '2026-10-23 21:56:53.340', NULL, N'Thẻ từ');
    INSERT INTO CHECK_INS ([CheckInID], [MemberID], [ContractID], [ScheduleID], [CheckInTime], [CheckOutTime], [CheckInType]) VALUES (12, 6, 6, NULL, '2026-10-19 21:56:53.340', NULL, N'Thẻ từ');
    INSERT INTO CHECK_INS ([CheckInID], [MemberID], [ContractID], [ScheduleID], [CheckInTime], [CheckOutTime], [CheckInType]) VALUES (13, 6, 6, NULL, '2026-10-15 21:56:53.340', NULL, N'Thẻ từ');
    INSERT INTO CHECK_INS ([CheckInID], [MemberID], [ContractID], [ScheduleID], [CheckInTime], [CheckOutTime], [CheckInType]) VALUES (14, 6, 6, NULL, '2026-10-11 21:56:53.340', NULL, N'Thẻ từ');
    INSERT INTO CHECK_INS ([CheckInID], [MemberID], [ContractID], [ScheduleID], [CheckInTime], [CheckOutTime], [CheckInType]) VALUES (15, 6, 6, NULL, '2026-10-07 21:56:53.340', NULL, N'Thẻ từ');
    INSERT INTO CHECK_INS ([CheckInID], [MemberID], [ContractID], [ScheduleID], [CheckInTime], [CheckOutTime], [CheckInType]) VALUES (16, 6, 6, NULL, '2026-10-02 21:56:53.340', NULL, N'Thẻ từ');
    INSERT INTO CHECK_INS ([CheckInID], [MemberID], [ContractID], [ScheduleID], [CheckInTime], [CheckOutTime], [CheckInType]) VALUES (17, 7, 7, NULL, '2026-10-27 21:56:53.340', NULL, N'Thẻ từ');
    INSERT INTO CHECK_INS ([CheckInID], [MemberID], [ContractID], [ScheduleID], [CheckInTime], [CheckOutTime], [CheckInType]) VALUES (18, 7, 7, NULL, '2026-10-21 21:56:53.340', NULL, N'Thẻ từ');
    INSERT INTO CHECK_INS ([CheckInID], [MemberID], [ContractID], [ScheduleID], [CheckInTime], [CheckOutTime], [CheckInType]) VALUES (19, 7, 7, NULL, '2026-10-14 21:56:53.340', NULL, N'Thẻ từ');
    INSERT INTO CHECK_INS ([CheckInID], [MemberID], [ContractID], [ScheduleID], [CheckInTime], [CheckOutTime], [CheckInType]) VALUES (20, 7, 7, NULL, '2026-10-08 21:56:53.340', NULL, N'Thẻ từ');
    INSERT INTO CHECK_INS ([CheckInID], [MemberID], [ContractID], [ScheduleID], [CheckInTime], [CheckOutTime], [CheckInType]) VALUES (21, 7, 7, NULL, '2026-10-03 21:56:53.340', NULL, N'Thẻ từ');
    INSERT INTO CHECK_INS ([CheckInID], [MemberID], [ContractID], [ScheduleID], [CheckInTime], [CheckOutTime], [CheckInType]) VALUES (22, 8, 8, NULL, '2026-10-29 21:56:53.340', NULL, N'Thẻ từ');
    INSERT INTO CHECK_INS ([CheckInID], [MemberID], [ContractID], [ScheduleID], [CheckInTime], [CheckOutTime], [CheckInType]) VALUES (23, 8, 8, NULL, '2026-10-27 21:56:53.340', NULL, N'Thẻ từ');
    INSERT INTO CHECK_INS ([CheckInID], [MemberID], [ContractID], [ScheduleID], [CheckInTime], [CheckOutTime], [CheckInType]) VALUES (24, 8, 8, NULL, '2026-10-25 21:56:53.340', NULL, N'Thẻ từ');
    INSERT INTO CHECK_INS ([CheckInID], [MemberID], [ContractID], [ScheduleID], [CheckInTime], [CheckOutTime], [CheckInType]) VALUES (25, 8, 8, NULL, '2026-10-22 21:56:53.340', NULL, N'Thẻ từ');
    INSERT INTO CHECK_INS ([CheckInID], [MemberID], [ContractID], [ScheduleID], [CheckInTime], [CheckOutTime], [CheckInType]) VALUES (26, 8, 8, NULL, '2026-10-20 21:56:53.340', NULL, N'Thẻ từ');
    SET IDENTITY_INSERT CHECK_INS OFF;
END
GO

-- SEED CHO BẢNG AI_PREDICTIONS
IF NOT EXISTS (SELECT 1 FROM AI_PREDICTIONS)
BEGIN
    SET IDENTITY_INSERT AI_PREDICTIONS ON;
    INSERT INTO AI_PREDICTIONS ([PredictionID], [MemberID], [ContractID], [RenewalProbability], [RiskLevel], [RetentionStrategy], [IsHandled], [PredictionDate]) VALUES (1, 1, 1, 12.3, N'High', N'Chào anh Võ Nguyễn Đăng Khôi! Chúng tôi nhận thấy anh đã nghỉ 44 ngày. Để giúp anh quay lại, chúng tôi có gói khuyến mãi đặc biệt: 20% giảm giá cho 1 tháng Gym Tự Do. Hãy liên hệ qua Zalo 0901234567 để nhận mã AI_COMEBACK_20 và được tư vấn miễn phí.', 0, '2026-10-30');
    INSERT INTO AI_PREDICTIONS ([PredictionID], [MemberID], [ContractID], [RenewalProbability], [RiskLevel], [RetentionStrategy], [IsHandled], [PredictionDate]) VALUES (2, 2, 2, 12.5, N'High', N'Gửi tin nhắn cá nhân qua Zalo: ''Chúng tôi nhớ bạn! Hãy trở lại với ưu đãi 20% cho 2 buổi đầu tiên''', NULL, '2026-10-30');
    INSERT INTO AI_PREDICTIONS ([PredictionID], [MemberID], [ContractID], [RenewalProbability], [RiskLevel], [RetentionStrategy], [IsHandled], [PredictionDate]) VALUES (3, 4, 4, 12, N'High', N'Gửi tin nhắn Zalo kèm mã AI_COMEBACK_20, mời tham gia lớp Yoga miễn phí 1 buổi, khuyến mãi giảm giá 20% cho gói 3 tháng tiếp theo.', 0, '2026-10-31');
    INSERT INTO AI_PREDICTIONS ([PredictionID], [MemberID], [ContractID], [RenewalProbability], [RiskLevel], [RetentionStrategy], [IsHandled], [PredictionDate]) VALUES (4, 5, 5, 55, N'Medium', N'Kịch 1: Gửi tin nhắn Zalo: "Chào James, chúng tôi thấy bạn đã rời khỏi phòng tập 5 ngày. Để giữ gói Premium, hãy đặt lịch 1 buổi thử miễn phí ngay hôm nay. Đừng bỏ lỡ cơ hội giữ gói ưu đãi!" Kịch 2: Gửi tin nhắn Zalo: "James, chúng tôi có mã giảm 20% cho gói 3 tháng tiếp theo. Nhập mã AI_COMEBACK_20 khi thanh toán. Hãy quay lại để tiếp tục đạt mục tiêu sức khỏe."', 0, '2026-10-30');
    INSERT INTO AI_PREDICTIONS ([PredictionID], [MemberID], [ContractID], [RenewalProbability], [RiskLevel], [RetentionStrategy], [IsHandled], [PredictionDate]) VALUES (5, 6, 6, 45.3, N'Medium', N'Gửi tin nhắn Zalo kèm mã giảm giá 20% cho gói PT 1:1 Siêu cấp, kèm lời khuyên cá nhân và lịch tập linh hoạt để tăng sự gắn kết.', 0, '2026-10-30');
    INSERT INTO AI_PREDICTIONS ([PredictionID], [MemberID], [ContractID], [RenewalProbability], [RiskLevel], [RetentionStrategy], [IsHandled], [PredictionDate]) VALUES (6, 7, 7, 42.5, N'Medium', N'Gửi tin nhắn Zalo kèm mã giảm giá 10% và mời tham gia lớp Yoga miễn phí 1 buổi.', 0, '2026-10-30');
    INSERT INTO AI_PREDICTIONS ([PredictionID], [MemberID], [ContractID], [RenewalProbability], [RiskLevel], [RetentionStrategy], [IsHandled], [PredictionDate]) VALUES (7, 8, 8, 45, N'Medium', N'Gửi tin nhắn Zalo kèm mã giảm giá AI_COMEBACK_20, kèm lời khuyên luyện tập cá nhân, đề xuất buổi tư vấn miễn phí', NULL, '2026-10-30');
    SET IDENTITY_INSERT AI_PREDICTIONS OFF;
END
GO

