---
author: thuongnn
pubDatetime: 2023-03-26T11:45:22Z
modDatetime: 2023-03-26T11:45:22Z
title: "[AWS] AWS Lambda"
folder: "aws"
draft: false
tags:
  - AWS
  - Amazon Web Services
description: Tìm hiểu về dịch vụ serverless của AWS, cho phép chạy code mà không cần quản lý server.
ogImage: https://techblogbuilder.com/wp-content/uploads/sites/4/2021/06/techblogbuilder-home.png
---

Bài viết được tham khảo và tổng hợp lại từ Jayendra's Blog, xem bài viết gốc ở đây: https://jayendrapatil.com/aws-lambda.

## Table of contents

### **AWS Lambda – Dịch vụ Serverless của AWS**

AWS Lambda là dịch vụ **serverless** giúp chạy mã nguồn mà **không cần quản lý server**. AWS Lambda tự động mở rộng theo nhu cầu, chỉ chạy khi cần và giúp tối ưu chi phí bằng cách **chỉ trả tiền cho thời gian thực thi**.

## **Tính năng chính của AWS Lambda**

✅ **Serverless** – Không cần quản lý hạ tầng, AWS tự động cung cấp tài nguyên.

✅ **Sự kiện kích hoạt (Event-driven)** – Kích hoạt từ S3, DynamoDB, API Gateway, SNS, SQS, v.v.

✅ **Tự động scale** – AWS Lambda tự động mở rộng theo số lượng request.

✅ **Thanh toán theo thời gian chạy thực tế** – Trả phí dựa trên số lần gọi và thời gian thực thi.

✅ **Hỗ trợ nhiều ngôn ngữ** – Python, Node.js, Java, C#, Go, Ruby, v.v.

✅ **Tích hợp với AWS Services** – S3, DynamoDB, API Gateway, Step Functions, SNS, SQS, v.v.

## **Kiến trúc và Cách hoạt động**

AWS Lambda hoạt động theo mô hình **sự kiện – phản hồi**, tức là một **event** sẽ kích hoạt một hàm Lambda thực thi.

🔹 **Trigger (Nguồn sự kiện)**: Các dịch vụ AWS hoặc HTTP/API Gateway có thể kích hoạt Lambda.

🔹 **Lambda Function**: Chứa mã nguồn để xử lý logic.

🔹 **Execution Role**: Lambda sử dụng IAM Role để có quyền truy cập các tài nguyên AWS khác.

🔹 **Destination (Kết quả xử lý)**: Kết quả có thể được lưu vào S3, DynamoDB, SNS, CloudWatch, v.v.

📌 **Ví dụ quy trình hoạt động**:

1. Người dùng tải file lên **S3**.
2. S3 kích hoạt Lambda Function.
3. Lambda xử lý file và lưu kết quả vào **DynamoDB** hoặc gửi thông báo qua **SNS**.

## **Cấu hình AWS Lambda**

Khi tạo một hàm Lambda, cần quan tâm đến các tham số sau:

🔹 **Memory (RAM)** – 128MB đến 10GB (ảnh hưởng đến CPU & hiệu suất).

🔹 **Timeout** – Thời gian tối đa để thực thi (tối đa 15 phút).

🔹 **Concurrency** – Số lượng thực thi đồng thời (mặc định 1.000, có thể tăng lên).

🔹 **Environment Variables** – Các biến môi trường để cấu hình ứng dụng.

🔹 **VPC Integration** – Cho phép Lambda truy cập tài nguyên trong VPC.

## **Các cách kích hoạt AWS Lambda**

🔹 **Synchronous Invocation (Gọi đồng bộ)** – Gọi trực tiếp và chờ phản hồi, ví dụ từ API Gateway hoặc SDK.

🔹 **Asynchronous Invocation (Gọi bất đồng bộ)** – Lambda xử lý trong nền, ví dụ từ S3, SNS.

🔹 **Event Source Mapping** – Lambda tự động nhận sự kiện từ SQS, DynamoDB Streams, Kinesis.

🔹 **Cron Jobs (Scheduled Events)** – Lambda có thể chạy theo lịch với EventBridge.

## **AWS Lambda Scaling & Concurrency**

AWS Lambda có khả năng **tự động mở rộng** dựa trên số lượng request.

🔹 **Concurrency Limit** – Mặc định 1.000 request đồng thời, có thể tăng lên theo nhu cầu.

🔹 **Provisioned Concurrency** – Dự trữ tài nguyên để đảm bảo độ trễ thấp.

🔹 **Throttling** – Nếu vượt giới hạn, Lambda sẽ bị giới hạn và có thể trả lỗi **429 Too Many Requests**.

🔹 **Retries & DLQ (Dead Letter Queue)** – Với lỗi bất đồng bộ, Lambda sẽ retry hoặc gửi lỗi vào **SQS hoặc SNS**.

## **AWS Lambda Security**

✅ **IAM Role** – Lambda cần **IAM Role** để truy cập các dịch vụ AWS khác.

✅ **VPC Support** – Lambda có thể chạy trong **VPC**, truy cập RDS hoặc tài nguyên private.

✅ **KMS Encryption** – Hỗ trợ mã hóa dữ liệu với **AWS KMS**.

✅ **Lambda Layer** – Chia sẻ thư viện hoặc code chung giữa nhiều hàm Lambda.

## **AWS Lambda Use Cases**

🔹 **Xử lý file** – Khi upload file vào S3, Lambda tự động resize ảnh, chuyển đổi định dạng video.

🔹 **API Backend** – Kết hợp với **API Gateway** để xây dựng API Serverless.

🔹 **IoT Data Processing** – Xử lý dữ liệu từ thiết bị IoT theo thời gian thực.

🔹 **ETL & Data Transformation** – Xử lý dữ liệu từ S3, DynamoDB, Redshift.

🔹 **Automated Scaling** – Kết hợp với Auto Scaling để tự động xử lý tác vụ nền.

🔹 **Chatbot & AI** – Kết hợp với Lex, Polly, SageMaker để triển khai AI.

📌 **Ví dụ Lambda xử lý file từ S3 và lưu kết quả vào DynamoDB**:

```python
import json
import boto3

s3 = boto3.client('s3')
dynamodb = boto3.client('dynamodb')

def lambda_handler(event, context):
    bucket = event['Records'][0]['s3']['bucket']['name']
    key = event['Records'][0]['s3']['object']['key']

    response = s3.get_object(Bucket=bucket, Key=key)
    content = response['Body'].read().decode('utf-8')

    dynamodb.put_item(
        TableName='MyTable',
        Item={'FileName': {'S': key}, 'Content': {'S': content}}
    )

    return {"statusCode": 200, "body": json.dumps("Success")}
```

## **Ưu điểm và Nhược điểm của AWS Lambda**

| **Ưu điểm** 🟢                 | **Nhược điểm** 🔴                        |
| ------------------------------ | ---------------------------------------- |
| Không cần quản lý server       | Giới hạn **timeout 15 phút**             |
| Tự động scale                  | Không thể chạy các ứng dụng **stateful** |
| Trả phí theo số request        | Cold Start có thể gây độ trễ             |
| Hỗ trợ nhiều ngôn ngữ          | Không phù hợp với workload lớn cần GPU   |
| Tích hợp với nhiều dịch vụ AWS | Dung lượng package bị giới hạn           |

## **Tổng kết**

- AWS Lambda là **dịch vụ Serverless**, giúp chạy code mà không cần quản lý server.
- **Tích hợp với nhiều dịch vụ AWS**, tự động scale và tối ưu chi phí.
- **Có nhiều cách kích hoạt Lambda**, từ API Gateway, S3, SNS, SQS, DynamoDB, v.v.
- **Có giới hạn về thời gian chạy (15 phút)** và yêu cầu **quản lý Cold Start** nếu không sử dụng **Provisioned Concurrency**.
- 📌 **Khi nào nên dùng AWS Lambda?**
  - ✅ Khi bạn muốn **xây dựng ứng dụng không cần quản lý server**.
  - ✅ Khi workload có **biến động cao** và cần tự động scale.
  - ✅ Khi cần xử lý **sự kiện từ S3, DynamoDB, API Gateway**.
  - ✅ Khi chỉ cần chạy **hàm nhỏ, thời gian chạy ngắn**.
- 📌 **Khi nào không nên dùng AWS Lambda?**
  - ❌ Khi cần **chạy ứng dụng liên tục** (nên dùng EC2, ECS, EKS).
  - ❌ Khi workload cần **thời gian chạy dài hơn 15 phút**.
  - ❌ Khi cần **cấu hình mạng phức tạp** hoặc **yêu cầu GPU**.
- 🔥 **Tóm lại, AWS Lambda là một giải pháp mạnh mẽ cho ứng dụng Serverless, giúp tối ưu chi phí, dễ dàng mở rộng và tích hợp tốt với hệ sinh thái AWS!** 🚀
