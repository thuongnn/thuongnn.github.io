---
author: thuongnn
pubDatetime: 2023-07-12T09:15:33Z
title: "[AWS] Amazon FSx for Windows File Server"
draft: false
tags:
  - AWS
  - Amazon Web Services
description: Tìm hiểu về dịch vụ lưu trữ file Windows được quản lý hoàn toàn bởi AWS, tương thích với Windows.
---
Bài viết được tham khảo và tổng hợp lại từ Jayendra's Blog, xem bài viết gốc ở đây: https://jayendrapatil.com/aws-fsx-for-windows. 

## Table of contents


Amazon FSx for Windows File Server cung cấp **lưu trữ file được quản lý hoàn toàn**, **đáng tin cậy**, và **có thể mở rộng**, truy cập qua **giao thức SMB (Server Message Block)**.

- **Xây dựng trên Windows Server**, hỗ trợ **user quotas, end-user file restore, ACLs**, và **tích hợp Microsoft Active Directory (AD)**.
- Cung cấp **hiệu suất cao với throughput lớn, IOPS cao, độ trễ dưới millisecond**.
- Hỗ trợ **triển khai Single-AZ và Multi-AZ**, **backup được quản lý hoàn toàn**, và **mã hóa dữ liệu khi lưu trữ và truyền tải**.
- **Backup trên FSx for Windows đảm bảo tính toàn vẹn của file system, có độ bền cao và là incremental backup**.
- Hỗ trợ **Windows, Linux, MacOS**, cho phép **truy cập đồng thời từ hàng nghìn instance và thiết bị**.
- Kết nối được với **EC2, VMware Cloud on AWS, Amazon WorkSpaces, Amazon AppStream 2.0**.
- **Tích hợp với CloudWatch** để giám sát dung lượng lưu trữ và hoạt động file system.
- **Tích hợp với CloudTrail** để theo dõi các API call của Amazon FSx.
- **Hỗ trợ các use case** như **CRM, ERP, ứng dụng .NET, thư mục home directories, phân tích dữ liệu, media & entertainment, web hosting, quản lý nội dung, môi trường build phần mềm, Microsoft SQL Server**.
- Có thể truy cập từ **on-premises thông qua AWS Direct Connect hoặc AWS VPN**.
- **Hỗ trợ kết nối từ nhiều VPC, tài khoản AWS, và khu vực AWS** thông qua **VPC Peering hoặc AWS Transit Gateway**.
- **Độ trễ thấp**:
    - **SSD storage**: độ trễ **dưới millisecond**.
    - **HDD storage**: độ trễ **millisecond đơn**.
- Hỗ trợ **Microsoft Distributed File System (DFS)** để tổ chức các file share thành một cấu trúc thư mục lớn lên đến **hàng trăm PB**.

# **Bảo mật FSx for Windows**

- **Tích hợp Microsoft Active Directory (AD)**, hỗ trợ **AWS Managed Microsoft AD hoặc self-managed AD**.
- Cung cấp **quyền truy cập Windows tiêu chuẩn (Windows ACLs)** cho files và folders.
- **Mã hóa dữ liệu tại chỗ (encryption at rest)** sử dụng **KMS managed keys**.
- **Mã hóa dữ liệu khi truyền tải (encryption in transit)** sử dụng **SMB Kerberos session keys** khi truy cập từ các client hỗ trợ **SMB 3.0**.
- **Hỗ trợ khôi phục file và folder theo phiên bản trước đó (Windows Shadow Copies)**.
- **Tuân thủ các tiêu chuẩn bảo mật ISO, PCI-DSS, SOC** và **đủ điều kiện HIPAA**.

# **FSx for Windows - Availability & Durability**

- **Tự động sao chép dữ liệu trong cùng một Availability Zone (AZ)** để bảo vệ khỏi lỗi phần cứng.
- **Giám sát liên tục lỗi phần cứng** và **tự động thay thế** các thành phần hạ tầng nếu xảy ra lỗi.

### **Hỗ trợ Multi-AZ**

- **Tự động triển khai và duy trì một file server dự phòng** ở AZ khác.
- **Dữ liệu được đồng bộ giữa AZs theo thời gian thực**, đảm bảo nhất quán khi có sự cố.
- **Tăng tính sẵn sàng** khi có bảo trì hệ thống hoặc sự cố dịch vụ.
- **Bảo vệ dữ liệu khỏi lỗi instance hoặc gián đoạn AZ**.
- Khi xảy ra sự cố, **hệ thống tự động chuyển đổi (failover) sang file server dự phòng** để đảm bảo truy cập dữ liệu mà không cần can thiệp thủ công.

### **Multi-AZ Failover tự động khi**

- AZ chính gặp sự cố.
- File server chính không khả dụng.
- File server chính cần bảo trì.

### **Backup & Lưu trữ**

- **Tự động sao lưu file system**, chỉ lưu trữ các thay đổi kể từ lần backup gần nhất (incremental).
- **Backup được lưu trữ trên Amazon S3**.
