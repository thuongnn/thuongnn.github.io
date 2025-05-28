---
author: thuongnn
pubDatetime: 2023-07-24T15:30:45Z
title: "[AWS] Amazon Inspector"
draft: false
tags:
  - AWS
  - Amazon Web Services
description: Tìm hiểu về dịch vụ đánh giá bảo mật tự động của AWS, giúp phát hiện lỗ hổng và tuân thủ bảo mật.
---
Bài viết được tham khảo và tổng hợp lại từ Jayendra's Blog, xem bài viết gốc ở đây: https://jayendrapatil.com/aws-inspector. 

## Table of contents


![1.png](@/assets/images/security/aws-inspector/1.png)

Amazon Inspector là một công cụ bảo mật tự động đánh giá các tài nguyên AWS để phát hiện lỗ hổng và kiểm tra các cấu hình sai.

- **Chức năng chính**
    - Tự động quét các tài nguyên AWS như EC2 instances, container images (trong Amazon ECR), và Lambda functions.
    - Phát hiện các lỗ hổng bảo mật đã biết (CVE - Common Vulnerabilities and Exposures).
    - Kiểm tra cấu hình sai dẫn đến các rủi ro bảo mật.
    - Xếp hạng mức độ nghiêm trọng (Critical, High, Medium, Low) để ưu tiên xử lý.
- **Tính năng nổi bật**
    - Tự động quét khi tài nguyên được tạo hoặc thay đổi, đảm bảo bảo mật liên tục.
    - Báo cáo chi tiết với các đề xuất sửa lỗi cụ thể.
    - Hỗ trợ container và serverless (ví dụ: container images trong ECR và hàm Lambda).
    - Tích hợp với AWS Security Hub để quản lý bảo mật tập trung.
- **Lợi ích**
    - Cải thiện bảo mật bằng cách phát hiện sớm các lỗ hổng và cấu hình sai.
    - Giảm thiểu công việc thủ công và đảm bảo bảo mật liên tục.
    - Tuân thủ các tiêu chuẩn bảo mật như ISO 27001, PCI DSS, và HIPAA.
- **Cách hoạt động**
    - Phát hiện tự động các tài nguyên AWS và bắt đầu quét.
    - Sử dụng cơ sở dữ liệu CVE và các quy tắc bảo mật tiêu chuẩn để phân tích.
    - Cung cấp báo cáo chi tiết và tích hợp với CloudWatch hoặc Security Hub để giám sát.
