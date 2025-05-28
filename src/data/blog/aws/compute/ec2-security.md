---
author: thuongnn
pubDatetime: 2023-03-29T14:30:45Z
title: "[AWS] EC2 Security"
folder: "aws"
draft: false
tags:
  - AWS
  - Amazon Web Services
description: Tìm hiểu về các tính năng bảo mật của EC2, bao gồm security groups, IAM roles và encryption.
---

Bài viết được tham khảo và tổng hợp lại từ Jayendra's Blog, xem bài viết gốc ở đây: https://jayendrapatil.com/aws-ec2-security.

## Table of contents

# **Bảo mật trên AWS EC2**

## **Security Groups (Nhóm bảo mật)**

- **Tường lửa ảo** kiểm soát lưu lượng đến và đi của các EC2 instances.
- Hoạt động ở **cấp độ instance**, áp dụng cho tất cả các giao diện mạng (ENI) liên kết với instance.
- **Chỉ hỗ trợ quy tắc cho phép (allow)**, không có quy tắc chặn (deny).
- Mỗi instance có thể liên kết với **nhiều security groups**.
- Mỗi security group có thể chứa **nhiều quy tắc inbound và outbound**:
  - **Inbound rules**: Quy định lưu lượng có thể đến instance.
  - **Outbound rules**: Quy định lưu lượng có thể đi từ instance.

## **Network Access Control Lists (NACLs)**

- **Tường lửa cấp subnet**, áp dụng cho tất cả các instances trong subnet.
- Hỗ trợ **cả allow và deny rules** để kiểm soát lưu lượng vào và ra subnet.
- Được áp dụng theo **thứ tự ưu tiên của rules** (rule number thấp được xử lý trước).
- **Tự động áp dụng** cho tất cả các instances trong subnet.

## **Key Pairs (Cặp khóa)**

- Dùng để xác thực truy cập SSH vào EC2 instances.
- AWS lưu **public key** trong instance, còn **private key** do người dùng giữ.
- Nếu mất private key, **không thể khôi phục**, chỉ có thể tạo key mới và thay thế key cũ bằng cách truy cập thông qua user khác hoặc tạo một instance mới.

## **IAM Roles cho EC2**

- Cho phép instances **tương tác với các dịch vụ AWS** mà không cần lưu trữ credentials trong instance.
- Cung cấp **quyền IAM tạm thời** thông qua AWS STS (Security Token Service).
- Role có thể được gán cho instance **bất kỳ lúc nào** mà không cần khởi động lại.

## **Instance Metadata Service (IMDS)**

- EC2 cung cấp metadata và user data thông qua địa chỉ **http://169.254.169.254**.
- **IMDSv2** giúp tăng cường bảo mật bằng cách yêu cầu token xác thực.
- Nên sử dụng IMDSv2 thay vì IMDSv1 để giảm nguy cơ tấn công SSRF (Server Side Request Forgery).

## **Encryption (Mã hóa)**

- **Dữ liệu khi lưu trữ**:
  - EBS hỗ trợ mã hóa với **AWS KMS**.
  - Snapshot EBS có thể được mã hóa hoặc sao chép thành snapshot mã hóa.
- **Dữ liệu khi truyền**:
  - Hỗ trợ mã hóa bằng **TLS (Transport Layer Security)**.
- **Dữ liệu trong S3**:
  - EC2 có thể đọc/ghi dữ liệu từ S3 bằng cách sử dụng **S3 Server-side encryption (SSE)**.

## **AWS Systems Manager (SSM)**

- Quản lý và truy cập instances mà **không cần mở SSH/RDP**.
- **Session Manager** giúp đăng nhập vào instance mà không cần key pair, giảm thiểu rủi ro bảo mật.
- Cho phép **chạy lệnh trên nhiều instances cùng lúc**.

## **Bastion Host**

- Là một instance chuyên dụng để truy cập EC2 instances **trong private subnet**.
- Thường triển khai trong **public subnet** với chỉ các **IP cho phép** mới được truy cập.
- Có thể kết hợp với **AWS Systems Manager Session Manager** để tăng cường bảo mật.

## **AWS Shield & AWS WAF**

- **AWS Shield**: Dịch vụ bảo vệ chống DDoS cho EC2, ELB, CloudFront.
- **AWS WAF**: Firewall ứng dụng web bảo vệ EC2 khỏi các tấn công như SQL Injection, XSS.

## **AWS Inspector**

- Quét lỗ hổng bảo mật trong EC2 instances.
- Kiểm tra **cấu hình bảo mật, quyền hệ thống, phần mềm lỗi thời**.

## **AWS Trusted Advisor**

- Đưa ra khuyến nghị bảo mật cho tài nguyên EC2.
- Kiểm tra **cấu hình bảo mật, quyền truy cập, các lỗ hổng tiềm ẩn**.
