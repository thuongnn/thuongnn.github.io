---
author: thuongnn
pubDatetime: 2023-03-25T09:15:33Z
title: "[AWS] Amazon Elastic Container Service (ECS)"
draft: false
tags:
  - AWS
  - Amazon Web Services
description: Tìm hiểu về dịch vụ quản lý container của AWS, cho phép chạy và quản lý các ứng dụng containerized.
---

Bài viết được tham khảo và tổng hợp lại từ Jayendra's Blog, xem bài viết gốc ở đây: https://jayendrapatil.com/aws-ecs.

## Table of contents

AWS **Elastic Container Service (ECS)** là dịch vụ **quản lý container** giúp chạy, dừng và quản lý các container trên cụm **EC2** hoặc **AWS Fargate**. ECS hỗ trợ **Docker** và tích hợp sâu với hệ sinh thái AWS.

## **ECS Kiến Trúc & Thành Phần Chính**

📌 **ECS Cluster** – Nhóm tài nguyên để chạy container (EC2 hoặc Fargate).

📌 **Task Definition** – Định nghĩa cấu hình container (image, CPU, RAM, network, volumes).

📌 **Task** – Một đơn vị triển khai container, chạy một hoặc nhiều container theo Task Definition.

📌 **Service** – Quản lý và scale số lượng Task theo yêu cầu.

📌 **Container Agent** – Chạy trên EC2 để kết nối với ECS và quản lý container.

📌 **Launch Type** – Cách chạy container:

- **EC2 Launch Type** – Chạy container trên EC2 instances.
- **Fargate Launch Type** – Chạy container mà không cần quản lý server.

## **ECS Cluster**

🔹 ECS Cluster là **nhóm tài nguyên compute** để chạy container.

🔹 Có thể sử dụng **EC2** (do người dùng quản lý) hoặc **Fargate** (AWS quản lý).

🔹 Cluster có thể chứa **nhiều loại instances khác nhau** để tối ưu tài nguyên.

## **ECS Task & Task Definition**

🔹 **Task Definition**: Định nghĩa container (image, CPU, RAM, volumes, network).

🔹 **Task**: Một instance của Task Definition, có thể chứa nhiều container.

📌 **Ví dụ Task Definition JSON**:

```json
{
  "family": "my-task",
  "containerDefinitions": [
    {
      "name": "my-container",
      "image": "nginx",
      "memory": 512,
      "cpu": 256,
      "portMappings": [
        {
          "containerPort": 80,
          "hostPort": 80
        }
      ]
    }
  ]
}
```

## **ECS Service**

🔹 **Service** giúp chạy và duy trì số lượng Task theo yêu cầu.

🔹 Hỗ trợ **Auto Scaling**, **Load Balancer**, **Deployment Strategy** (Rolling Update, Blue/Green).

## **ECS Networking & Load Balancing**

🔹 ECS hỗ trợ **Bridge, Host, AWS VPC Networking Mode**.

🔹 Có thể dùng **Application Load Balancer (ALB)** hoặc **Network Load Balancer (NLB)**.

## **ECS Scaling & Auto Scaling**

🔹 **Service Auto Scaling** – Tự động scale số lượng Task theo CPU, Memory, hoặc custom metric.

🔹 **Cluster Auto Scaling** – Tự động scale số lượng EC2 instances.

🔹 **Spot Instances** – Giảm chi phí bằng cách chạy ECS trên Spot Instances.

## **ECS Security**

🔹 **IAM Roles** – ECS cần IAM Role để quản lý quyền truy cập tài nguyên AWS.

🔹 **Security Groups** – Kiểm soát truy cập inbound/outbound traffic.

🔹 **Encryption** – Hỗ trợ AWS KMS để mã hóa dữ liệu.

## **ECS Logging & Monitoring**

🔹 **Amazon CloudWatch Logs** – Lưu logs của container.

🔹 **AWS X-Ray** – Theo dõi request flow trong ứng dụng.

🔹 **CloudWatch Metrics** – Giám sát CPU, RAM, network.

## **ECS Use Cases – Ứng Dụng Thực Tế**

✅ **Microservices** – ECS giúp deploy các microservices với scaling linh hoạt.

✅ **Machine Learning** – Chạy container để xử lý dữ liệu AI/ML.

✅ **Big Data Processing** – Kết hợp với S3, Kinesis để xử lý dữ liệu lớn.

✅ **Continuous Deployment** – ECS kết hợp với CodePipeline để triển khai CI/CD.

## **So sánh ECS vs EKS vs Fargate**

| **Feature**          | **ECS (EC2 Launch Type)**  | **ECS (Fargate)**          | **EKS (Kubernetes)** |
| -------------------- | -------------------------- | -------------------------- | -------------------- |
| **Quản lý Server**   | Tự quản lý EC2             | AWS quản lý                | Tự quản lý EC2       |
| **Scaling**          | Auto Scaling               | Auto Scaling               | Kubernetes Scaling   |
| **Tích hợp AWS**     | Rất tốt                    | Rất tốt                    | Hạn chế hơn          |
| **Chi phí**          | Cao hơn (phải quản lý EC2) | Chỉ trả tiền cho container | Tốn phí quản lý EKS  |
| **Quản lý phức tạp** | Dễ                         | Rất dễ                     | Phức tạp hơn         |

## **🔹 Tổng Kết**

- **ECS là dịch vụ quản lý container mạnh mẽ** trên AWS.
- Hỗ trợ **EC2 (tự quản lý) và Fargate (serverless)**.
- **Tích hợp tốt với AWS**, dễ triển khai, giám sát, và bảo mật.
- **Phù hợp cho microservices, batch jobs, AI/ML, CI/CD workflows**.
- **Cân nhắc giữa ECS, EKS và Fargate** tùy vào nhu cầu quản lý, chi phí, và tích hợp.
- 🔥 **Tóm lại, AWS ECS giúp đơn giản hóa việc chạy container, tối ưu chi phí, và dễ dàng mở rộng trên AWS!** 🚀
