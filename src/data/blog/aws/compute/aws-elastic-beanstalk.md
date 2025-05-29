---
author: thuongnn
pubDatetime: 2023-03-24T14:30:45Z
modDatetime: 2023-03-24T14:30:45Z
title: "[AWS] AWS Elastic Beanstalk"
folder: "aws"
draft: false
tags:
  - AWS
  - Amazon Web Services
description: Tìm hiểu về dịch vụ PaaS của AWS, giúp triển khai và quản lý ứng dụng web một cách dễ dàng.
ogImage: ../../../../assets/images/aws/compute/aws-elastic-beanstalk/1.png
---

Bài viết được tham khảo và tổng hợp lại từ Jayendra's Blog, xem bài viết gốc ở đây: https://jayendrapatil.com/aws-elastic-beanstalk.

## Table of contents

### **AWS Elastic Beanstalk – Dịch vụ Triển Khai Ứng Dụng Tự Động**

AWS **Elastic Beanstalk** là dịch vụ **Platform as a Service (PaaS)** giúp triển khai, quản lý và mở rộng các ứng dụng web mà **không cần quản lý cơ sở hạ tầng**.

💡 **Tóm tắt:**

- Hỗ trợ nhiều ngôn ngữ: Python, Node.js, Java, .NET, PHP, Ruby, Go.
- Triển khai trên **EC2, ALB, Auto Scaling, RDS** mà không cần cấu hình thủ công.
- Cung cấp cả **Managed Updates, Monitoring, Scaling** tự động.
- Hỗ trợ **Docker Containers** và tích hợp với **CI/CD** như GitHub, CodePipeline.

## **Kiến trúc của AWS Elastic Beanstalk**

![1.png](@/assets/images/aws/compute/aws-elastic-beanstalk/1.png)

📌 **Application** – Ứng dụng chính chứa nhiều môi trường.

📌 **Environment** – Một phiên bản chạy của ứng dụng (Production, Staging).

📌 **Environment Tier:**

- **Web Server** (xử lý HTTP requests, chạy trên ALB hoặc NLB).
- **Worker** (xử lý background jobs, kết nối SQS).
  - 📌 **Instance & Load Balancer** – Elastic Beanstalk sử dụng EC2, ALB/NLB để phân phối tải.
  - 📌 **Database (RDS, DynamoDB)** – Cấu hình database trong ứng dụng.
  - 📌 **Monitoring & Logging** – CloudWatch, X-Ray, Beanstalk Logs.

## **Elastic Beanstalk Deployment Options**

🔹 **All at once** – Deploy tất cả instances cùng lúc (downtime cao).

🔹 **Rolling Update** – Update từng batch một (giảm downtime).

🔹 **Rolling with additional batch** – Giống rolling nhưng thêm instance mới.

🔹 **Immutable Deployment** – Tạo mới EC2 instances rồi chuyển traffic (an toàn nhất).

🔹 **Blue/Green Deployment** – Tạo một môi trường mới, swap DNS khi hoàn thành.

## **Tích hợp với Load Balancer & Auto Scaling**

✅ **Load Balancer**: Tích hợp với **ALB hoặc NLB** để phân phối traffic.

✅ **Auto Scaling**: Điều chỉnh số lượng EC2 instances tự động.

✅ **Health Monitoring**: Kiểm tra trạng thái instances.

## **Elastic Beanstalk Security**

🔐 **IAM Roles** – Cấp quyền cho EC2 instances.

🔐 **Security Groups** – Kiểm soát truy cập inbound/outbound.

🔐 **VPC Support** – Chạy Beanstalk trong một VPC riêng.

🔐 **Encryption** – Hỗ trợ AWS KMS cho mã hóa dữ liệu.

## **Monitoring & Logging trong Elastic Beanstalk**

📊 **AWS CloudWatch Metrics** – Giám sát CPU, Memory, Network.

📊 **AWS X-Ray** – Theo dõi và phân tích request flow.

📊 **Beanstalk Logs** – Lưu log của application và hệ thống.

## **Elastic Beanstalk So sánh với EC2, ECS, Lambda**

| Feature            | **Elastic Beanstalk** | **EC2**           | **ECS/Fargate**       | **Lambda**   |
| ------------------ | --------------------- | ----------------- | --------------------- | ------------ |
| **Quản lý Server** | Tự động               | Tự quản lý        | Tự động (ECS/Fargate) | Serverless   |
| **Scaling**        | Auto Scaling          | Phải tự cấu hình  | Auto Scaling          | Auto         |
| **Chi phí**        | Trung bình            | Cao hơn           | Tối ưu                | Rẻ nhất      |
| **Use Case**       | Web App, API          | Mọi loại workload | Microservices         | Event-driven |

## **Tổng kết**

- **Elastic Beanstalk giúp triển khai ứng dụng dễ dàng** mà không cần quản lý hạ tầng.
- **Tích hợp Auto Scaling, Load Balancer, Security, CI/CD** để tối ưu hiệu suất.
- **Phù hợp với Web Applications, REST APIs, Backend Services**.
- **Là giải pháp tốt cho DevOps** muốn tập trung vào ứng dụng mà không cần quản lý server.
- 🔥 **Tóm lại, nếu bạn muốn deploy nhanh chóng trên AWS mà không cần quản lý server, Elastic Beanstalk là lựa chọn hàng đầu!** 🚀
