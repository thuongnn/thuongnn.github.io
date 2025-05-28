---
author: thuongnn
pubDatetime: 2022-10-06T23:40:22Z
title: "[Google Cloud] Tìm hiểu về Internet Network Endpoint Groups (NEG)"
featured: false
draft: false
tags:
  - Google Cloud
description: Tìm hiểu về Internet Network Endpoint Groups (NEG) trong Google Cloud.
---

## Table of contents

# Internet Network Endpoint Groups (NEG)

Internet NEG là tính năng giúp người dùng tập hợp nhiều network endpoints lại với nhau để tận dụng khả năng của Google Load Balancer, Cloud CDN hay Cloud Armor,..

Và hiện tại NEG đã hỗ trợ khách hàng cấu hình các backends dữ liệu nằm bên ngoài hệ thống Google Cloud như On-Premise hoặc các Cloud khác. Điều này giúp khách hàng có thể tận dụng để thiết kế đa dạng các mô hình hệ thống theo yêu cầu.

![](https://storage.googleapis.com/gweb-cloudblog-publish/images/Hybrid_Cloud.max-1000x1000.jpg)

Internet NEG hỗ trợ người dùng

- Tận dụng các hạ tầng Edge Network của Google Cloud để cung cấp tốc độ phản hồi nhanh nhất cho các users từ nhiều vị trí địa lý
- Điều hướng truy cập của người dùng đến các backend chỉ định của khách hàng theo các tham số host, path, query parameter hoặc header.
- Tận dụng Cloud CDN để caching data giúp giảm tải cho hệ thống và tăng tốc độ phản hồi đến người dùng.
- Bảo vệ hệ thống khách hàng trên Google Cloud hoặc On-Premise với Cloud Armor policy.

### **Mô hình #1: Tận dụng Cloud CDN cho caching On-Premise**

![cloud_cdn.gif](https://github.com/user-attachments/assets/b3654de3-2a4b-4b2b-98a1-6259fede83df)

Internet NEGs hỗ trợ người dùng cấu hình Cloud CDN phục vụ caching dữ liệu cho các hệ thống như video, hình ảnh, nội dung text,… đang nằm trong hệ thống Google Cloud, dưới hệ thống On-premise hoặc các Cloud khác của khách hàng.

Điều này sẽ giúp việc phản hồi dữ liệu trả về đến người dùng cuối nhanh chóng và bảo mật nhờ tận dụng hệ thống network của Google (hỗ trợ cả QUIC và TLS 1.3).

### **Mô hình #2: Load Balancing cho toàn bộ hệ thống Hybrid Cloud.**

Khi Internet NEG đã hỗ trợ cấu hình đối với những backend nằm bên ngoài hệ thống Google Cloud thì đồng nghĩa khách hàng sẽ có thể sử dụng được Cloud Armor (WAF, DDoS Prevention) để nâng cao khả năng bảo mật truy cập dữ liệu cho các backend đó.

Các On-Premise backend của khách hàng lúc này sẽ được Google bảo vệ trước những cuộc tấn công DDoS, có khả năng phục vụ một lượng lớn người dùng đầu cuối tăng đột ngột và giúp khách hàng nhanh chóng đạt được mục tiêu về Business đã đặt ra khi chuyển đổi lên Google Cloud.

*Bài viết được lược dịch từ:* [Google Cloud Blog](https://cloud.google.com/blog/products/networking/enabling-hybrid-deployments-with-cloud-cdn-and-load-balancing)

# Types of NEGs

Use the following tables to decide which type of NEG you need for your deployment.

- [Zonal NEG](https://cloud.google.com/load-balancing/docs/negs#zonal-neg)
- [Internet NEG](https://cloud.google.com/load-balancing/docs/negs#internet-neg)
- [Serverless NEG](https://cloud.google.com/load-balancing/docs/negs#serverless-neg)
- [Hybrid connectivity NEG](https://cloud.google.com/load-balancing/docs/negs#hybrid-neg)
- [Private Service Connect NEG](https://cloud.google.com/load-balancing/docs/negs#psc-neg)