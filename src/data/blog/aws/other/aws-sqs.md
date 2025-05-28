---
author: thuongnn
pubDatetime: 2023-07-31T14:30:45Z
title: "[AWS] AWS Simple Queue Service – SQS"
folder: "aws"
draft: false
tags:
  - AWS
  - Amazon Web Services
description: Tìm hiểu về dịch vụ hàng đợi tin nhắn của AWS, giúp phân tách và mở rộng các thành phần phân tán.
---

Bài viết được tham khảo và tổng hợp lại từ Jayendra's Blog, xem bài viết gốc ở đây: https://jayendrapatil.com/aws-sqs.

## Table of contents

# **Tổng quan**

- **Simple Queue Service (SQS)** là hệ thống hàng đợi phân tán có tính sẵn sàng cao.
- Hàng đợi là kho lưu trữ tạm thời cho các tin nhắn đang chờ xử lý, đóng vai trò như bộ đệm giữa thành phần gửi (producer) và nhận (consumer).
- Là dịch vụ hàng đợi tin nhắn được sử dụng bởi các ứng dụng phân tán để trao đổi tin nhắn thông qua mô hình **polling**, giúp tách biệt các thành phần gửi và nhận.
- Được quản lý hoàn toàn, không yêu cầu chi phí quản trị và cấu hình đơn giản.
- Cung cấp hàng đợi lưu trữ tin nhắn đáng tin cậy, có khả năng mở rộng cao, dùng để truyền tin nhắn giữa các ứng dụng.
- Hỗ trợ kiến trúc không đồng bộ, linh hoạt, chịu lỗi và tách rời các thành phần phân tán của ứng dụng, cho phép gửi và nhận tin nhắn mà không yêu cầu các thành phần phải đồng thời sẵn sàng.
- Hỗ trợ **mã hóa tại chỗ** và **mã hóa trong quá trình truyền** bằng giao thức HTTP qua SSL (HTTPS) và Transport Layer Security (TLS).
- Cung cấp hai loại hàng đợi:
  - [Hàng đợi Chuẩn (Standard Queue)](https://jayendrapatil.com/aws-sqs-standard-queue/)
  - [Hàng đợi FIFO (FIFO Queue)](https://jayendrapatil.com/aws-sqs-fifo-queue/)

### **Hàng đợi Chuẩn (SQS Standard Queue)**

- Là loại hàng đợi mặc định.
- Hỗ trợ giao tin nhắn **ít nhất một lần (at-least-once)**. Tuy nhiên, do kiến trúc phân tán cao cho phép thông lượng gần như không giới hạn, đôi khi có thể giao nhiều bản sao của một tin nhắn hoặc giao không theo thứ tự.
- Hỗ trợ **số lượng gần như không giới hạn các cuộc gọi API mỗi giây** cho mỗi hành động API (SendMessage, ReceiveMessage, DeleteMessage).
- Cung cấp **sắp xếp tốt nhất có thể (best-effort ordering)**, đảm bảo tin nhắn thường được giao theo thứ tự gửi.

Xem chi tiết tại [SQS Standard Queue](https://jayendrapatil.com/aws-sqs-standard-queue/).

### **Hàng đợi FIFO (SQS FIFO Queue)**

- Hàng đợi **FIFO (First-In-First-Out)** cung cấp tin nhắn **theo thứ tự** và **giao chính xác một lần (exactly-once)**.
- Có tất cả các khả năng của hàng đợi chuẩn nhưng được thiết kế để cải thiện giao tiếp giữa các ứng dụng khi thứ tự của các thao tác và sự kiện là quan trọng, hoặc không chấp nhận trùng lặp.

Xem chi tiết tại [SQS FIFO Queue](https://jayendrapatil.com/aws-sqs-fifo-queue/).

# SQS Standard Queues vs SQS FIFO Queues

![1.png](@/assets/images/aws/other/aws-sqs/1.png)

# **SQS Use Cases**

- **Hàng đợi Công việc (Work Queues)**:
  - Tách biệt các thành phần của ứng dụng phân tán không xử lý cùng khối lượng công việc đồng thời.
- **Bộ đệm và Xử lý Hàng loạt (Buffer and Batch Operations)**:
  - Thêm khả năng mở rộng và độ tin cậy cho kiến trúc, làm mượt các đợt tăng lưu lượng tạm thời mà không mất tin nhắn hoặc tăng độ trễ.
- **Dời Yêu cầu (Request Offloading)**:
  - Chuyển các thao tác chậm ra khỏi các đường yêu cầu tương tác bằng cách đưa yêu cầu vào hàng đợi.
- **Phân tán (Fan-out)**:
  - Kết hợp SQS với SNS để gửi các bản sao giống hệt của một tin nhắn đến nhiều hàng đợi song song để xử lý đồng thời.
- **Tự động Mở rộng (Auto Scaling)**:
  - Sử dụng hàng đợi SQS để xác định tải ứng dụng, kết hợp với Auto Scaling để mở rộng hoặc thu hẹp các phiên bản EC2 tùy thuộc vào lưu lượng.

# **How SQS Queues Works**

- SQS cho phép **tạo, xóa hàng đợi** và **gửi/nhận tin nhắn** từ hàng đợi.
- Hàng đợi SQS lưu giữ tin nhắn trong **4 ngày theo mặc định**.
- Có thể cấu hình để lưu giữ tin nhắn từ **1 phút đến 14 ngày** sau khi tin nhắn được gửi.
- SQS có thể **xóa hàng đợi mà không thông báo** nếu không có hành động nào được thực hiện trên hàng đợi trong **30 ngày liên tiếp**.
- SQS cho phép xóa hàng đợi ngay cả khi còn tin nhắn trong đó.

# SQS Features & Capabilities

- **Thời gian Tạm Ẩn (Visibility Timeout)**:
  - Xác định khoảng thời gian SQS chặn khả năng hiển thị của tin nhắn, ngăn các thành phần tiêu thụ khác nhận và xử lý tin nhắn đó.
- **Hàng đợi Chết (Dead-Letter Queues - DLQ)**:
  - Giúp các hàng đợi nguồn ([Chuẩn](https://jayendrapatil.com/aws-sqs-standard-queue/) và [FIFO](https://jayendrapatil.com/aws-sqs-fifo-queue/)) chuyển các tin nhắn không thể xử lý (tiêu thụ) thành công.
- **Chính sách Chuyển lại DLQ (DLQ Redrive Policy)**:
  - Xác định hàng đợi nguồn, hàng đợi chết và các điều kiện để SQS chuyển tin nhắn từ hàng đợi nguồn sang hàng đợi chết nếu người tiêu thụ của hàng đợi nguồn không xử lý được tin nhắn sau số lần cố gắng quy định.
- **Polling Ngắn và Dài (Short and Long Polling)**:
  - Kiểm soát cách hàng đợi được thăm dò; polling dài giúp giảm các phản hồi rỗng.

# SQS Buffered Asynchronous Client

- **Amazon SQS Buffered Async Client** cho Java cung cấp triển khai của giao diện AmazonSQSAsyncClient với các tính năng quan trọng:
  - **Gộp tự động (Automatic Batching)**: Gộp nhiều yêu cầu _SendMessage_, _DeleteMessage_ hoặc _ChangeMessageVisibility_ mà không cần thay đổi ứng dụng.
  - **Tải trước (Prefetching)**: Tải trước tin nhắn vào bộ đệm cục bộ, cho phép ứng dụng xử lý tin nhắn ngay lập tức mà không cần đợi lấy tin nhắn từ SQS.
- Gộp tự động và tải trước tăng thông lượng, giảm độ trễ của ứng dụng, đồng thời giảm chi phí bằng cách thực hiện ít yêu cầu SQS hơn.

# SQS Security and reliability

- SQS lưu trữ tất cả hàng đợi và tin nhắn trong **một vùng AWS có tính sẵn sàng cao** với nhiều **Availability Zones (AZ)** dự phòng.
- Hỗ trợ giao thức **HTTP qua SSL (HTTPS)** và **Transport Layer Security (TLS)**.
- Hỗ trợ **Mã hóa Tại chỗ (Encryption at Rest)**: Mã hóa tin nhắn ngay khi SQS nhận được và giải mã chỉ khi gửi đến người tiêu thụ được ủy quyền.
- Hỗ trợ **quyền dựa trên tài nguyên**.

# **SQS Design Patterns**

### **Priority Queue Pattern**

![2.png](@/assets/images/aws/other/aws-sqs/2.png)

1. Sử dụng SQS để tạo nhiều hàng đợi cho các mức độ ưu tiên riêng lẻ.
2. Đặt các quy trình cần thực thi ngay lập tức (yêu cầu công việc) vào hàng đợi ưu tiên cao.
3. Chuẩn bị số lượng máy chủ hàng loạt để xử lý yêu cầu công việc của các hàng đợi, tùy thuộc vào mức độ ưu tiên.
4. Hàng đợi có chức năng **Gửi Trì hoãn (Delayed Send)**, có thể dùng để trì hoãn thời gian bắt đầu một quy trình.

### **SQS Job Observer Pattern**

![3.png](@/assets/images/aws/other/aws-sqs/3.png)

1. Đưa các yêu cầu công việc vào hàng đợi dưới dạng tin nhắn SQS.
2. Máy chủ hàng loạt lấy tin nhắn từ SQS và xử lý chúng.
3. Thiết lập Auto Scaling để tự động tăng hoặc giảm số lượng máy chủ hàng loạt, sử dụng số lượng tin nhắn SQS với CloudWatch làm yếu tố kích hoạt.

# SQS vs Kinesis Data Streams

![4.png](@/assets/images/aws/other/aws-sqs/4.png)
