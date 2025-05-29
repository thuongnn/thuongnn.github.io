---
author: thuongnn
pubDatetime: 2023-03-20T08:30:15Z
modDatetime: 2023-03-20T08:30:15Z
title: "[AWS] Amazon Elastic Compute Cloud (EC2)"
folder: "aws"
draft: false
tags:
  - AWS
  - Amazon Web Services
description: Tìm hiểu về dịch vụ máy chủ ảo đàn hồi của AWS, cho phép khởi tạo và quản lý các máy chủ ảo trong đám mây.
---

Bài viết được tham khảo và tổng hợp lại từ Jayendra's Blog, xem bài viết gốc ở đây: https://jayendrapatil.com/aws-ec2.

## Table of contents

# **Tổng quan**

- **EC2 cung cấp tài nguyên máy tính có thể mở rộng trên AWS**.
- **Giúp loại bỏ chi phí đầu tư vào phần cứng** trước khi triển khai ứng dụng.
- **Hỗ trợ khởi chạy nhiều hoặc ít máy ảo (instances) tùy theo nhu cầu**, có thể cấu hình bảo mật, mạng và quản lý lưu trữ.
- **Dễ dàng mở rộng lên/xuống để đáp ứng nhu cầu**, giảm rủi ro dự báo lưu lượng sai.

# **Tính năng của EC2**

- **EC2 Instances** – Môi trường điện toán ảo.
- [**Amazon Machine Images (AMIs)**](<Amazon%20Machine%20Image%20(AMI)%20trong%20AWS%20EC2%201a73fa6ae48380f5993ae90515e4b90c.md>) – Mẫu máy ảo được cấu hình sẵn (gồm OS + phần mềm).
- [**Instance Types**](AWS%20EC2%20Instance%20Types%201a73fa6ae48380aeb582c7e4f9d8304e.md) – Các cấu hình khác nhau về CPU, RAM, lưu trữ và mạng.
- **Key Pairs** – Thông tin đăng nhập bảo mật (AWS giữ public key, người dùng giữ private key).
- [**Instance Store Volumes**](../Storage%2070aaf40d3b5b466d957e7eb24935e1fa/EC2%20Instance%20Store%20Storage%20cb80ab442fd24103bc84157b58c47c8d.md) – Lưu trữ tạm thời, bị xóa khi dừng hoặc xóa instance.
- [**EBS Volumes**](<../Storage%2070aaf40d3b5b466d957e7eb24935e1fa/Elastic%20Block%20Store%20Storage%20(EBS)%201743fa6ae4838071ae93f555536b3400.md>) – Lưu trữ lâu dài bằng **Elastic Block Store (EBS)**.
- **Regions và Availability Zones** – Các địa điểm vật lý để triển khai tài nguyên (instances, EBS...).
- [**Security Groups**](../Networking%20ca0a21a6ceb64d3fbc7b62fe954794df/Security%20Groups%20va%CC%80%20NACLs%2015a3fa6ae4838060b015db16c6255fdd.md) – Firewall để kiểm soát truy cập bằng **protocol, port, IP source**.
- [**Elastic IP addresses**](../Networking%20ca0a21a6ceb64d3fbc7b62fe954794df/Virtual%20Private%20Network%20%E2%80%93%20VPC%201593fa6ae483806eaa13c20dcc38aafb/IP%20Addresses%201593fa6ae4838079ab75c730b0f660e4.md) – IP tĩnh cho các ứng dụng cần địa chỉ cố định.
- **Tags** – Gán metadata để dễ quản lý tài nguyên EC2.

# **Các cách truy cập EC2**

- **Amazon EC2 Console** – Giao diện web quản lý từ **AWS Management Console**.
- **AWS Command Line Interface (CLI)** – Công cụ dòng lệnh chạy trên **Windows, Mac, Linux**.
- **Amazon EC2 CLI Tools** – Công cụ CLI cho **EC2, EBS, VPC**.
- **AWS Tools for Windows PowerShell** – Dành cho người dùng **PowerShell**.
- **AWS Query API** – **Gửi request HTTP(S)** bằng **GET/POST** với tham số **Action**.
- **AWS SDK Libraries** – Cung cấp thư viện lập trình để **tích hợp EC2 vào ứng dụng** với tính năng tự động ký request, retry, xử lý lỗi...
