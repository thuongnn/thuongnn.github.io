---
author: thuongnn
pubDatetime: 2023-07-25T10:20:15Z
title: "[AWS] Amazon GuardDuty"
folder: "aws"
draft: false
tags:
  - AWS
  - Amazon Web Services
description: Tìm hiểu về dịch vụ phát hiện mối đe dọa thông minh của AWS, sử dụng machine learning để bảo vệ tài khoản.
---

Bài viết được tham khảo và tổng hợp lại từ Jayendra's Blog, xem bài viết gốc ở đây: https://jayendrapatil.com/aws-guardduty.

## Table of contents

## Giới thiệu

- AWS GuardDuty là dịch vụ bảo mật được quản lý, cung cấp khả năng phát hiện và giám sát mối đe dọa liên tục để bảo vệ tài khoản AWS, khối lượng công việc và dữ liệu của bạn. Dịch vụ này sử dụng học máy, các luồng dữ liệu threat intelligence và phân tích hành vi để phát hiện các hoạt động bất thường hoặc độc hại.
- AWS GuardDuty là công cụ mạnh mẽ để bảo vệ tài khoản AWS khỏi các mối đe dọa bảo mật, cung cấp khả năng giám sát và phát hiện tự động với chi phí và nỗ lực tối thiểu.

## **Chức năng chính**

- **Phát hiện mối đe dọa thông minh:**
  - Sử dụng machine learning, phân tích hành vi và threat intelligence để xác định các mối đe dọa.
  - Tự động phát hiện các hành vi bất thường, chẳng hạn như truy cập trái phép hoặc các hoạt động không phù hợp với hành vi thông thường.
- **Giám sát liên tục:**
  - Tự động thu thập và phân tích dữ liệu từ nhiều nguồn AWS, bao gồm AWS CloudTrail, Amazon VPC Flow Logs, và DNS logs.
  - Giám sát liên tục mà không làm gián đoạn hệ thống hoặc yêu cầu triển khai phần mềm bổ sung.
- **Cảnh báo bảo mật chi tiết:**
  - Cung cấp các cảnh báo chi tiết về sự kiện bảo mật, phân loại mức độ nghiêm trọng (Low, Medium, High).
  - Gợi ý hành động khắc phục để giảm thiểu rủi ro.

## **Các nguồn dữ liệu tích hợp**

- **AWS CloudTrail Logs**: phân tích các hành động trong tài khoản AWS của bạn, bao gồm API và console activity.
- **VPC Flow Logs**: theo dõi lưu lượng mạng đến và đi trong Amazon VPC của bạn.
- **DNS Logs**: phân tích các truy vấn DNS để phát hiện hoạt động đáng ngờ.

## **Tính năng nổi bật**

- **Không cần cơ sở hạ tầng**: GuardDuty là dịch vụ hoàn toàn được quản lý, không cần triển khai, bảo trì hoặc cấu hình phần cứng hay phần mềm.
- **Tự động cập nhật**: sử dụng các luồng dữ liệu threat intelligence mới nhất từ AWS và đối tác để tự động cập nhật khả năng phát hiện mối đe dọa.
- **Tích hợp với các dịch vụ AWS khác:**
  - **AWS Security Hub:** Hợp nhất các cảnh báo từ GuardDuty và các công cụ bảo mật khác.
  - **Amazon EventBridge:** Tự động kích hoạt quy trình phản hồi dựa trên các cảnh báo.
  - **AWS Lambda:** Tự động thực hiện các hành động khắc phục dựa trên sự kiện được phát hiện.

## **Lợi ích**

- **Phát hiện nhanh chóng:** Xác định các mối đe dọa tiềm ẩn nhanh chóng, giúp giảm thiểu thiệt hại.
- **Giảm chi phí và công sức:** Không yêu cầu quản lý phần mềm, giảm chi phí vận hành bảo mật.
- **Khả năng mở rộng:** Phù hợp với mọi quy mô tổ chức, từ nhỏ đến lớn.
- **Đảm bảo bảo mật liên tục:** Phân tích liên tục các hoạt động để phát hiện sự cố bảo mật trong thời gian thực.

## **Chi phí**

GuardDuty tính phí dựa trên:

- **Khối lượng dữ liệu phân tích:** Bao gồm CloudTrail event logs, VPC Flow Logs và DNS logs.
- **Không có phí khởi tạo:** Chỉ trả tiền cho dữ liệu được phân tích, không yêu cầu phí đăng ký.

## **Trường hợp sử dụng**

- **Phát hiện truy cập trái phép:**
  Phát hiện và cảnh báo khi có nỗ lực đăng nhập từ các địa chỉ IP độc hại hoặc quốc gia bất thường.
- **Giám sát nội bộ:**
  Xác định các hành vi bất thường của người dùng nội bộ, chẳng hạn như hành vi truy cập hoặc thao tác dữ liệu không phù hợp.
- **Phát hiện lưu lượng độc hại:**
  Nhận diện lưu lượng mạng đáng ngờ, chẳng hạn như kết nối với các máy chủ điều khiển và kiểm soát (C&C) độc hại.
