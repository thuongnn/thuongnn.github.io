---
author: thuongnn
pubDatetime: 2023-07-23T11:45:22Z
title: "[AWS] AWS Secrets Manager"
folder: "aws"
draft: false
tags:
  - AWS
  - Amazon Web Services
description: Tìm hiểu về dịch vụ quản lý bí mật của AWS, giúp bảo vệ thông tin nhạy cảm và tự động luân chuyển.
---

Bài viết được tham khảo và tổng hợp lại từ Jayendra's Blog, xem bài viết gốc ở đây: https://jayendrapatil.com/aws-secrets-manager.

## Table of contents

AWS Secrets Manager là dịch vụ quản lý thông tin nhạy cảm như mật khẩu, khóa API, và thông tin cấu hình với khả năng mã hóa, tự động hóa và bảo mật.

- **Chức năng chính**
  - Lưu trữ và mã hóa các thông tin nhạy cảm bằng AWS KMS.
  - Hỗ trợ tự động thay đổi (rotate) thông tin nhạy cảm như mật khẩu cơ sở dữ liệu hoặc khóa API.
  - Cung cấp endpoint API để truy xuất thông tin bí mật từ ứng dụng.
  - Ghi lại và theo dõi các hành động thông qua AWS CloudTrail.
- **Tính năng nổi bật**
  - Tự động xoay vòng mật khẩu, hỗ trợ sẵn cho các dịch vụ như Amazon RDS.
  - Tích hợp liền mạch với các dịch vụ AWS như Lambda, EC2, ECS, và EKS.
  - Kiểm soát quyền truy cập chi tiết thông qua AWS IAM.
  - Dễ dàng tích hợp với các ứng dụng thông qua API hoặc AWS SDK.
- **Lợi ích**
  - Tăng cường bảo mật bằng cách mã hóa thông tin và quản lý quyền truy cập.
  - Giảm rủi ro do lộ lọt thông tin bằng cách tự động xoay vòng định kỳ.
  - Đơn giản hóa quản lý thông tin nhạy cảm từ một nơi tập trung.
  - Hỗ trợ tuân thủ các tiêu chuẩn bảo mật như GDPR, HIPAA, và PCI DSS.
- **So sánh với AWS Systems Manager Parameter Store**
  - Secrets Manager có khả năng xoay vòng tự động, trong khi Parameter Store không hỗ trợ.
  - Secrets Manager tính phí cao hơn nhưng phù hợp với các yêu cầu bảo mật phức tạp.
- **Chi phí**
  - Phí lưu trữ: 0.40 USD/secret/tháng.
  - Phí API: 0.05 USD/10.000 yêu cầu.
