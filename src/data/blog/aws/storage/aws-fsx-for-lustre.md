---
author: thuongnn
pubDatetime: 2023-07-11T14:30:45Z
title: "[AWS] Amazon FSx for Lustre"
folder: "aws"
draft: false
tags:
  - AWS
  - Amazon Web Services
description: Tìm hiểu về dịch vụ lưu trữ file hiệu suất cao của AWS, tối ưu cho các workload tính toán song song.
---

Bài viết được tham khảo và tổng hợp lại từ Jayendra's Blog, xem bài viết gốc ở đây: https://jayendrapatil.com/aws-fsx-for-lustre.

## Table of contents

# **Tổng quan**

- **FSx for Lustre** là dịch vụ **hoàn toàn quản lý**, giúp triển khai và vận hành hệ thống file **Lustre** hiệu suất cao một cách đơn giản và tiết kiệm chi phí.
- **Thiết kế cho ứng dụng yêu cầu lưu trữ tốc độ cao**, đảm bảo hiệu suất tương xứng với tài nguyên tính toán.
- **POSIX-compliant**, tương thích với các ứng dụng Linux hiện có mà không cần thay đổi.
- **Hỗ trợ read-after-write consistency và file locking**.
- **Tương thích với các AMI Linux phổ biến** như Amazon Linux, RHEL, CentOS, SUSE, Ubuntu.
- **Có thể truy cập từ EC2, EKS**, hoặc gắn kết vào Linux thông qua Lustre client.
- **Ứng dụng lý tưởng**: Machine learning, HPC, xử lý video, mô phỏng tài chính, giải trình tự gen, EDA.

# **FSx for Lustre - Các tùy chọn triển khai**

## **Scratch File Systems**

- **Dành cho lưu trữ tạm thời, xử lý dữ liệu ngắn hạn**.
- **Hiệu suất cao** với throughput có thể **tăng gấp 6 lần mức cơ bản (200 MBps/TiB)**.
- **Không nhân bản dữ liệu**, dữ liệu sẽ mất nếu file server gặp lỗi.
- **Lý tưởng cho workload xử lý nặng nhưng ngắn hạn** và tối ưu chi phí.

## **Persistent File Systems**

![1.png](@/assets/images/aws/storage/aws-fsx-for-lustre/1.png)

- **Dành cho lưu trữ dài hạn** và workload cần **tính sẵn sàng cao**.
- **Tự động sao chép dữ liệu trong cùng một AZ** để đảm bảo độ bền.
- File server tự động thay thế trong vòng vài phút nếu xảy ra lỗi.
- Giám sát liên tục lỗi phần cứng và tự động thay thế thành phần hạ tầng.
- Lý tưởng cho workload chạy lâu dài, cần tính ổn định và ít gián đoạn.

# **FSx for Lustre với S3**

- **Tích hợp liền mạch với Amazon S3**, giúp xử lý dữ liệu trên đám mây bằng hệ thống file Lustre hiệu suất cao.
- **Hiển thị dữ liệu S3 dưới dạng file** trong FSx for Lustre và cho phép ghi dữ liệu thay đổi ngược lại vào S3.
- **Có thể liên kết FSx for Lustre với một S3 bucket**, giúp truy cập dữ liệu S3 từ hệ thống file.
- **Tên và tiền tố (prefix) của đối tượng S3 hiển thị dưới dạng file và thư mục** trong hệ thống file.

## **Cách FSx for Lustre tải dữ liệu từ S3**

- Mặc định, S3 objects được tải theo cơ chế "**lazy-loading**".
  - Dữ liệu chỉ được tải từ S3 khi lần đầu tiên được ứng dụng truy cập.
  - Các lần truy cập sau sẽ đọc trực tiếp từ hệ thống file với độ trễ thấp, ổn định.
- **Hỗ trợ batch hydration** để tải dữ liệu từ S3 theo lô trước khi sử dụng.
- **Sử dụng kỹ thuật truyền dữ liệu song song**, giúp chuyển dữ liệu từ S3 với tốc độ lên đến **hàng trăm GB/s**.
- **File trong FSx for Lustre có thể được xuất ngược lại về S3 bucket** khi cần.

# **Bảo mật (Security)**

- Mặc định mã hóa dữ liệu tại chỗ (encryption at rest) cho hệ thống file và backup bằng AWS KMS.
- Mã hóa dữ liệu khi truyền (encryption in transit) nhưng chỉ khi truy cập từ EC2 instances được hỗ trợ.

# **Khả năng mở rộng (Scalability)**

- Hệ thống file **có thể mở rộng lên hàng trăm GB/s throughput** và **hàng triệu IOPS**.
- **Hỗ trợ truy cập đồng thời** vào cùng một file hoặc thư mục từ **hàng nghìn EC2 instances**.
- **Độ trễ dưới miliseconds ổn định** cho các thao tác trên file.

# **Khả dụng & Độ bền (Availability & Durability)**

- **Scratch file system**:
  - Không thay thế file server nếu bị lỗi và không sao lưu dữ liệu.
- **Persistent file system**:
  - Tự động thay thế file server trong vài phút nếu gặp sự cố.
- **Dữ liệu được lưu trữ trên nhiều network file servers**, giúp **tối ưu hiệu suất và giảm nghẽn cổ chai**.
- **Mỗi file server có nhiều đĩa lưu trữ**, tăng cường độ bền.
- **Tự động sao lưu hàng ngày** và hỗ trợ **backup thủ công** bất cứ lúc nào.
- **Backup có độ bền cao và đảm bảo nhất quán với hệ thống file**.
