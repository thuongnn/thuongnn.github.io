---
author: thuongnn
pubDatetime: 2023-07-30T10:20:15Z
title: "[AWS] Simple Notification Service – SNS"
folder: "aws"
draft: false
tags:
  - AWS
  - Amazon Web Services
description: Tìm hiểu về dịch vụ thông báo đơn giản của AWS, giúp gửi thông báo đến nhiều người dùng và dịch vụ.
---

Bài viết được tham khảo và tổng hợp lại từ Jayendra's Blog, xem bài viết gốc ở đây: https://jayendrapatil.com/aws-sns.

## Table of contents

# **Tổng quan**

![1.png](@/assets/images/aws/other/aws-sns/1.png)

- **Simple Notification Service (SNS)** là dịch vụ web quản lý và điều phối việc gửi hoặc phân phối tin nhắn đến các điểm cuối hoặc ứng dụng khách đã đăng ký.
- SNS cho phép tạo **Chủ đề (Topic)**, là một điểm truy cập logic và kênh giao tiếp.
- Mỗi chủ đề có **tên duy nhất**, xác định điểm cuối SNS để các nhà xuất bản đăng tin nhắn và các thuê bao đăng ký nhận thông báo.
- Nhà sản xuất (Producers) và người tiêu dùng (Consumers) giao tiếp **bất đồng bộ** với các thuê bao bằng cách gửi và xuất bản tin nhắn trên một chủ đề.
- Nhà sản xuất đẩy tin nhắn đến chủ đề mà họ đã tạo hoặc có quyền truy cập, và SNS khớp chủ đề với danh sách các thuê bao đã đăng ký, sau đó phân phối tin nhắn đến từng thuê bao.
- Các thuê bao nhận **tất cả tin nhắn** được xuất bản trên các chủ đề mà họ đã đăng ký, và tất cả thuê bao của một chủ đề nhận được **cùng tin nhắn**.
- Thuê bao (như máy chủ web, địa chỉ email, hàng đợi [SQS](https://jayendrapatil.com/aws-sqs-simple-queue-service/), hàm [AWS Lambda](https://jayendrapatil.com/aws-lambda/)) nhận tin nhắn hoặc thông báo qua một trong các giao thức được hỗ trợ (SQS, HTTP/S, email, SMS, Lambda) khi họ đăng ký vào chủ đề.

# **Accessing SNS**

- **Amazon Management Console**:
  - Giao diện người dùng dựa trên web để quản lý SNS.
- **AWS CLI**:
  - Cung cấp lệnh cho nhiều sản phẩm AWS, hỗ trợ trên Windows, Mac và Linux.
- **Công cụ AWS cho Windows PowerShell**:
  - Cung cấp lệnh cho các sản phẩm AWS dành cho người dùng lập trình trong môi trường PowerShell.
- **API Truy vấn SNS (AWS SNS Query API)**:
  - Cho phép gửi yêu cầu HTTP hoặc HTTPS sử dụng các động từ HTTP như GET hoặc POST với tham số truy vấn tên là **Action**.
- **Thư viện AWS SDK**:
  - AWS cung cấp các thư viện cho nhiều ngôn ngữ lập trình, tự động hóa các tác vụ như ký mật yêu cầu, thử lại yêu cầu và xử lý phản hồi lỗi.

# **SNS Supported Transport Protocols**

- **HTTP, HTTPS**:
  - Thuê bao chỉ định URL khi đăng ký; thông báo sẽ được gửi qua yêu cầu HTTP POST đến URL được chỉ định.
- **Email, Email-JSON**:
  - Tin nhắn được gửi đến địa chỉ đã đăng ký dưới dạng email. Email-JSON gửi thông báo dưới dạng đối tượng JSON, trong khi Email gửi email dạng văn bản.
- **SQS**:
  - Người dùng có thể chỉ định hàng đợi SQS làm điểm cuối; SNS sẽ đưa thông báo vào hàng đợi được chỉ định (thuê bao có thể xử lý bằng các API SQS như ReceiveMessage, DeleteMessage, v.v.).
- **SMS**:
  - Tin nhắn được gửi đến số điện thoại đã đăng ký dưới dạng tin nhắn văn bản SMS.

# **SNS Supported Endpoints**

- **Thông báo Email**:
  - SNS cho phép gửi thông báo qua email.
- **Mobile Push Notifications**:
  - SNS hỗ trợ gửi tin nhắn thông báo đẩy trực tiếp đến ứng dụng trên thiết bị di động. Thông báo đẩy có thể hiển thị trong ứng dụng di động dưới dạng cảnh báo tin nhắn, cập nhật huy hiệu hoặc âm thanh.
  - Các dịch vụ thông báo đẩy được hỗ trợ:
    - Amazon Device Messaging (ADM)
    - Apple Push Notification Service (APNS)
    - Google Cloud Messaging (GCM)
    - Windows Push Notification Service (WNS) cho Windows 8+ và Windows Phone 8.1+
    - Microsoft Push Notification Service (MPNS) cho Windows Phone 7+
    - Baidu Cloud Push cho thiết bị Android tại Trung Quốc
- **Hàng đợi SQS**:
  - SNS kết hợp với SQS cho phép tin nhắn được gửi đến các ứng dụng cần thông báo tức thời về sự kiện, đồng thời lưu trữ trong hàng đợi SQS để các ứng dụng khác xử lý sau.
  - SNS cho phép ứng dụng gửi tin nhắn quan trọng theo cơ chế **đẩy (push)**, loại bỏ nhu cầu kiểm tra định kỳ hoặc **thăm dò (poll)** để cập nhật.
  - SQS được sử dụng trong các ứng dụng phân tán để trao đổi tin nhắn qua mô hình **thăm dò (polling)**, tách biệt các thành phần gửi và nhận mà không yêu cầu chúng phải đồng thời sẵn sàng.
- **Thông báo SMS**:
  - SNS hỗ trợ gửi và nhận thông báo SMS đến các điện thoại di động và điện thoại thông minh hỗ trợ SMS.
- **Điểm cuối HTTP/HTTPS**:
  - SNS cho phép gửi tin nhắn thông báo đến một hoặc nhiều điểm cuối HTTP hoặc HTTPS. Khi đăng ký điểm cuối vào chủ đề, xuất bản thông báo đến chủ đề sẽ khiến SNS gửi yêu cầu HTTP POST chứa nội dung thông báo đến điểm cuối đã đăng ký.
- **AWS Lambda**:
  - SNS tích hợp với Lambda để gọi hàm Lambda bằng thông báo SNS.
  - Khi tin nhắn được xuất bản đến chủ đề có hàm Lambda đăng ký, hàm Lambda được gọi với nội dung của tin nhắn đã xuất bản.
- **Kinesis Data Firehose**:
  - Gửi sự kiện đến các luồng phân phối để lưu trữ và phân tích.
  - Thông qua các luồng phân phối, sự kiện có thể được gửi đến các đích AWS như S3, [Redshift](https://jayendrapatil.com/aws-redshift/), [OpenSearch](https://jayendrapatil.com/amazon-opensearch/), hoặc các đích bên thứ ba như Datadog, New Relic, MongoDB và Splunk.
