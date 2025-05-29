---
author: thuongnn
pubDatetime: 2023-05-14T11:45:22Z
modDatetime: 2023-05-14T11:45:22Z
title: "[AWS] VPC Endpoints"
folder: "aws"
draft: false
tags:
  - AWS
  - Amazon Web Services
description: Tìm hiểu về VPC Endpoints, cách kết nối an toàn đến các dịch vụ AWS mà không cần Internet Gateway.
ogImage: ../../../../assets/images/aws/networking/vpc-endpoints/1.png
---

Bài viết được tham khảo và tổng hợp lại từ Jayendra's Blog, xem bài viết gốc ở đây: https://jayendrapatil.com/aws-vpc-endpoints.

## Table of contents

# Giới thiệu

![1.png](@/assets/images/aws/networking/vpc-endpoints/1.png)

- VPC Endpoints cho phép tạo private connection giữa VPC và các dịch vụ AWS, VPC Endpoint services được cung cấp bởi PrivateLink thông qua địa chỉ IP riêng của nó.
- Endpoints không yêu cầu địa chỉ Public IP, truy cập qua Internet, thiết bị NAT, kết nối VPN, hoặc AWS Direct Connect.
- Traffic giữa VPC và các dịch vụ AWS không rời khỏi mạng của Amazon.
- Endpoints là các thiết bị ảo, được mở rộng theo chiều ngang, có tính dự phòng và sẵn sàng cao. Chúng cho phép giao tiếp giữa các phiên bản trong VPC và các dịch vụ AWS mà không gây rủi ro về tính sẵn sàng hoặc giới hạn băng thông cho lưu lượng mạng của bạn.
- Endpoints hiện tại không hỗ trợ các yêu cầu giữa các khu vực (cross-region), cần đảm bảo rằng endpoint được tạo trong cùng một khu vực với bucket S3.
- AWS hiện hỗ trợ các loại Endpoint sau:
  - **VPC Gateway Endpoints**
  - **VPC Interface Endpoints**

# AWS VPC Gateway Endpoints

- VPC Gateway Endpoint là một cổng được sử dụng làm đích cho một tuyến đường cụ thể trong bảng định tuyến (route table), dùng để xử lý lưu lượng truy cập hướng tới các dịch vụ AWS được hỗ trợ.
- VPC Gateway Endpoint hiện hỗ trợ các dịch vụ S3 và DynamoDB.
- VPC Gateway Endpoint không yêu cầu Internet Gateway hoặc thiết bị NAT cho VPC.
- Gateway Endpoint không kích hoạt tính năng AWS PrivateLink.
- Chính sách VPC Endpoint (VPC Endpoint policy) và chính sách dựa trên tài nguyên (Resource-based policies) có thể được sử dụng để kiểm soát chi tiết quyền truy cập.

![2.png](@/assets/images/aws/networking/vpc-endpoints/2.png)

### **Gateway Endpoint Configuration**

- Endpoint yêu cầu VPC và AWS Service sẽ được truy cập thông qua endpoint đó.
- Endpoint phải được liên kết với Route table. Route entry liên quan không thể bị xóa trực tiếp mà chỉ có thể bị xóa khi gỡ liên kết Endpoint khỏi bảng định tuyến.
- Truy cập vào tài nguyên trong các dịch vụ khác có thể được kiểm soát bằng các chính sách endpoint (endpoint policies).
- Các **Security groups** trong VPC cần được cấu hình lại để cho phép traffic **outbound** (từ VPC ra ngoài) tới dịch vụ được chỉ định trong **Endpoint**. Để thực hiện điều này, cần sử dụng service prefix list ID, ví dụ như `com.amazonaws.us-east-1.s3`, làm destination trong **outbound rule** của security groups.
- Có thể tạo nhiều VPC Endpoint trong một VPC, ví dụ, để kết nối với nhiều dịch vụ khác nhau như S3, DynamoDB, v.v.
- Có thể tạo nhiều Endpoint cho cùng một dịch vụ (ví dụ: S3), nhưng mỗi Endpoint sẽ phải được liên kết với các bảng định tuyến khác nhau.
- Không thể tạo nhiều route entry cho cùng một dịch vụ trong một Route table. Mỗi dịch vụ chỉ có thể có một Endpoint trong mỗi bảng định tuyến.

### Gateway Endpoint Limitations

- **Chỉ hỗ trợ trong cùng một khu vực (Region):** Endpoint chỉ có thể được tạo và sử dụng trong cùng một region, không thể tạo giữa một VPC và dịch vụ AWS ở region khác.
- **Chỉ hỗ trợ traffic IPv4:** Gateway Endpoint chỉ hỗ trợ traffic IPv4, không hỗ trợ IPv6.
- **Không thể chuyển từ VPC này sang VPC khác:** Gateway Endpoint không thể được chuyển từ một VPC sang VPC khác hoặc từ dịch vụ này sang dịch vụ khác.
- **Không thể mở rộng kết nối ra ngoài VPC:** Các kết nối qua VPN, VPC peering, hoặc Direct Connect không thể sử dụng Endpoint.

### **VPC Endpoint policy**

- **VPC Endpoint Policy** là một **IAM resource policy** được gắn vào một endpoint để kiểm soát quyền truy cập từ endpoint tới dịch vụ được chỉ định.
- **Mặc định**, Endpoint policy cho phép **toàn quyền truy cập** cho bất kỳ người dùng hoặc dịch vụ nào trong VPC, sử dụng thông tin đăng nhập từ bất kỳ tài khoản AWS nào, vào bất kỳ tài nguyên S3 nào; bao gồm cả tài nguyên S3 của tài khoản AWS khác với tài khoản mà VPC được liên kết.
- Endpoint policy **không thay thế hoặc ghi đè** các **IAM user policies** hoặc **service-specific policies** (như bucket policies của S3).
- **Endpoint policy** có thể được sử dụng để **giới hạn quyền truy cập** vào các tài nguyên cụ thể, ví dụ như chỉ cho phép truy cập vào một số tài nguyên S3 nhất định, thay vì toàn bộ tài nguyên.

**S3 Bucket Policies**

- **Không thể sử dụng IAM policy hoặc bucket policy để cho phép truy cập từ dải CIDR IPv4 của VPC**:
  - Dải CIDR của một VPC có thể bị **chồng lắp** hoặc **giống nhau** với dải CIDR của các VPC khác, đặc biệt khi có nhiều VPC trong cùng một tài khoản AWS hoặc khi bạn đang sử dụng VPC Peering hoặc Transit Gateway. Điều này có thể dẫn đến các vấn đề về xác định chính xác từ đâu các yêu cầu đến và có thể gây ra kết quả không mong muốn (ví dụ: cho phép truy cập không hợp lệ từ các VPC khác). Vì vậy, không thể sử dụng chính dải CIDR của VPC trong IAM policy hay bucket policy để cho phép truy cập.
- **Không thể sử dụng điều kiện `aws:SourceIp` trong IAM policy cho các yêu cầu đến S3 qua VPC endpoint**:
  - Khi sử dụng `aws:SourceIp` trong IAM policies để xác định các địa chỉ IP hợp lệ cho yêu cầu, nó thường được sử dụng để kiểm soát truy cập từ các địa chỉ IP cụ thể. Tuy nhiên, với VPC endpoint, các yêu cầu truy cập đến S3 được gửi từ một **endpoint riêng tư** trong VPC, không phải trực tiếp từ một địa chỉ IP công cộng hoặc một nguồn IP mà bạn có thể xác định rõ ràng. Vì vậy, **`aws:SourceIp` không thể áp dụng** khi truy cập S3 qua VPC endpoint.
- **S3 Bucket Policies có thể giới hạn quyền truy cập qua VPC Endpoint**:
  - Trong trường hợp này, bạn có thể sử dụng **bucket policy của S3** để kiểm soát và **giới hạn quyền truy cập vào S3** chỉ từ các yêu cầu đi qua một **VPC endpoint cụ thể**. Điều này có thể được thực hiện bằng cách sử dụng các điều kiện trong bucket policy để yêu cầu các yêu cầu đến S3 chỉ được phép thực hiện từ một VPC endpoint mà bạn chỉ định, giúp tăng cường bảo mật và kiểm soát truy cập.
    ```json
    {
      "Version": "2012-10-17",
      "Id": "Access-to-bucket-using-specific-endpoint",
      "Statement": [
        {
          "Sid": "Access-to-specific-VPCE-only",
          "Effect": "Deny",
          "Principal": "*",
          "Action": "s3:*",
          "Resource": [
            "arn:aws:s3:::example_bucket",
            "arn:aws:s3:::example_bucket/*"
          ],
          "Condition": {
            "StringNotEquals": {
              "aws:sourceVpce": "vpce-1a2b3c4d"
            }
          }
        }
      ]
    }
    ```

### VPC Gateway Endpoint Troubleshooting

- Verify the services are within the same region.
- DNS resolution must be enabled in the VPC
- Route table should have a route to S3 using the gateway VPC endpoint.
- Security groups should have outbound traffic allowed VPC endpoint.
- NACLs should allow inbound and outbound traffic.
- Gateway Endpoint Policy should define access to the resource
- Resource-based policies like the S3 bucket policy should allow access to the VPC endpoint or the VPC.
