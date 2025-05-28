---
author: thuongnn
pubDatetime: 2023-07-26T14:30:45Z
title: "[AWS] AWS Shield"
draft: false
tags:
  - AWS
  - Amazon Web Services
description: Tìm hiểu về dịch vụ bảo vệ DDoS của AWS, giúp bảo vệ ứng dụng khỏi các cuộc tấn công từ chối dịch vụ.
---

Bài viết được tham khảo và tổng hợp lại từ Jayendra's Blog, xem bài viết gốc ở đây: https://jayendrapatil.com/aws-shield.

## Table of contents

AWS Shield là một dịch vụ được thiết kế để bảo vệ các ứng dụng AWS khỏi các cuộc tấn công DDoS, cung cấp các biện pháp tự động giảm thiểu tác động mà không cần sự can thiệp thủ công.

- **Phiên bản AWS Shield Standard**
  - Tự động kích hoạt trên tất cả các dịch vụ AWS và miễn phí.
  - Bảo vệ trước các cuộc tấn công DDoS phổ biến ở Layer 3 (Mạng) và Layer 4 (Giao vận).
  - Kết hợp với các dịch vụ như Amazon CloudFront, AWS Global Accelerator, và Amazon Route 53 để tăng cường khả năng bảo vệ.
- **Phiên bản AWS Shield Advanced**
  - Cung cấp bảo vệ chuyên sâu hơn cho các ứng dụng quan trọng.
  - Bảo vệ khỏi các cuộc tấn công DDoS phức tạp (bao gồm Layer 7 - Ứng dụng).
  - Tích hợp với đội ngũ AWS DDoS Response Team (DRT) để hỗ trợ trực tiếp trong các tình huống khẩn cấp.
  - Bảo vệ tài chính với chính sách hoàn tiền chi phí tăng đột biến do các cuộc tấn công DDoS.
  - Cung cấp báo cáo chi tiết về các cuộc tấn công, bao gồm xu hướng và phân tích lưu lượng.
  - Chi phí: **3.000 USD/tháng**, cộng với phí sử dụng tài nguyên.
- **Tích hợp và hoạt động**
  - Kết hợp hiệu quả với Amazon CloudFront, AWS WAF, và Amazon Route 53 để bảo vệ toàn diện.
  - AWS WAF bổ sung khả năng bảo vệ Layer 7 với các quy tắc tùy chỉnh để lọc lưu lượng độc hại.
