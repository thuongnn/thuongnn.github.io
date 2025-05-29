---
author: thuongnn
pubDatetime: 2023-03-21T11:45:22Z
modDatetime: 2023-03-21T11:45:22Z
title: "[AWS] Amazon Machine Image (AMI)"
folder: "aws"
draft: false
tags:
  - AWS
  - Amazon Web Services
description: Tìm hiểu về AMI - template chứa thông tin cấu hình phần mềm cần thiết để khởi tạo EC2 instance.
---

Bài viết được tham khảo và tổng hợp lại từ Jayendra's Blog, xem bài viết gốc ở đây: https://jayendrapatil.com/aws-ami.

## Table of contents

**Amazon Machine Image (AMI)** là một mẫu chứa tất cả thông tin cần thiết để khởi chạy một **EC2 instance** (máy chủ ảo trên AWS).

Mỗi AMI bao gồm:

- **Một hoặc nhiều snapshot của EBS** hoặc một mẫu ổ đĩa gốc (với AMI dựa trên **Instance Store**).
- **Thông tin về quyền khởi chạy**, xác định tài khoản AWS nào có thể sử dụng AMI để khởi chạy instance.
- **Ánh xạ thiết bị khối (block device mapping)**, xác định cách ánh xạ các volume vào instance khi khởi chạy.

📌 **AMI giúp dễ dàng khởi tạo và sao chép các EC2 instances với cấu hình giống nhau, giúp triển khai hệ thống nhanh chóng và hiệu quả.**

## **Các loại AMI**

AWS cung cấp ba loại AMI chính:

- **AMI do AWS quản lý (AWS Managed AMI)**
  - AWS duy trì và cập nhật thường xuyên.
  - Hỗ trợ các hệ điều hành phổ biến như **Amazon Linux, Ubuntu, Windows Server...**
  - Cung cấp các bản cập nhật bảo mật tự động, giúp người dùng tiết kiệm công sức quản lý.
- **AMI từ bên thứ ba (Third-Party AMI)**
  - Được cung cấp bởi các nhà cung cấp phần mềm trên **AWS Marketplace**.
  - Có thể chứa các ứng dụng được cấu hình sẵn như **SQL Server, SAP, Jenkins...**
  - Người dùng có thể sử dụng nhưng phải trả phí tùy theo nhà cung cấp.
- **AMI do người dùng tự tạo (Custom AMI)**
  - Người dùng tự tạo AMI dựa trên nhu cầu riêng.
  - Có thể **tùy chỉnh phần mềm, cấu hình bảo mật và dịch vụ hệ thống**.
  - Thích hợp để chuẩn hóa môi trường triển khai trên nhiều EC2 instances.

📌 **Người dùng có thể sao chép AMI giữa các AWS Regions để triển khai hệ thống trên nhiều khu vực khác nhau.**

## **Hệ điều hành và kiến trúc phần cứng**

- AMI hỗ trợ nhiều hệ điều hành khác nhau như **Linux (Amazon Linux, Ubuntu, RHEL, CentOS, SUSE...) và Windows Server**.
- Hỗ trợ cả **kiến trúc 32-bit và 64-bit**, tùy thuộc vào hệ điều hành và loại phần cứng.

## **Loại lưu trữ gốc của AMI**

- **AMI dựa trên EBS (EBS-backed AMI)**
  - Root volume là **Amazon EBS volume**.
  - **Lợi ích chính:**
    - ✅ **Dữ liệu không bị mất khi EC2 instance bị dừng hoặc reboot.**
    - ✅ Hỗ trợ **stop/start instance**, giúp quản lý dễ dàng hơn.
    - ✅ **Sao lưu dễ dàng** bằng cách tạo snapshot từ EBS.
- **AMI dựa trên Instance Store (Instance Store-backed AMI)**
  - Root volume là **Instance Store**, chỉ cung cấp **lưu trữ tạm thời**.
  - **Hạn chế chính:**
    - ❌ **Dữ liệu sẽ bị mất khi instance bị dừng hoặc terminated.**
    - ❌ Không hỗ trợ snapshot như EBS.
  - **Ưu điểm:**
    - ✅ Hiệu suất đọc/ghi cao, phù hợp với ứng dụng **cần tốc độ nhanh nhưng không yêu cầu lưu trữ dữ liệu lâu dài**.

📌 **AWS khuyến nghị sử dụng AMI dựa trên EBS vì nó linh hoạt và an toàn hơn so với Instance Store.**

## **Loại ảo hóa của AMI Linux**

Có hai loại ảo hóa chính trên AMI chạy Linux:

- **Paravirtual (PV)**
  - Sử dụng mô hình ảo hóa **không đầy đủ**, hoạt động trực tiếp trên phần cứng.
  - Hiệu suất thấp hơn HVM, không hỗ trợ GPU hoặc các tính năng phần cứng mới.
  - Chủ yếu được dùng cho các instance cũ.
- **Hardware Virtual Machine (HVM)**
  - Hỗ trợ chạy trên **phần cứng ảo hóa đầy đủ**, bao gồm CPU, GPU...
  - **Cung cấp hiệu suất tốt hơn** và hỗ trợ các instance mới nhất.
  - AWS **khuyến nghị sử dụng HVM** vì nó tận dụng tối đa phần cứng hiện đại.

📌 **Hầu hết các AMI hiện nay đều sử dụng HVM để tối ưu hóa hiệu suất.**

## **Sao lưu và quản lý AMI**

- AMI có thể **được chia sẻ với tài khoản AWS khác** trong cùng một Region.
- AMI có thể **sao chép giữa các Regions** để hỗ trợ triển khai trên nhiều khu vực địa lý khác nhau.
- Người dùng có thể **xóa AMI** khi không còn sử dụng để tiết kiệm chi phí lưu trữ.

📌 **AWS EC2 Image Builder giúp tự động hóa quá trình tạo, thử nghiệm và triển khai AMI, giúp duy trì hệ thống bảo mật và tối ưu.**
