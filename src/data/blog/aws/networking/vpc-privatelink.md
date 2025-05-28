---
author: thuongnn
pubDatetime: 2023-05-13T09:15:33Z
title: "[AWS] VPC PrivateLink"
draft: false
tags:
  - AWS
  - Amazon Web Services
description: Tìm hiểu về PrivateLink, dịch vụ cho phép kết nối an toàn giữa VPC và các dịch vụ AWS.
---

Bài viết được tham khảo và tổng hợp lại từ Jayendra's Blog, xem bài viết gốc ở đây: https://jayendrapatil.com/aws-vpc-privatelink.

## Table of contents

![1.png](@/assets/images/networking/vpc-privatelink/1.png)

- **VPC Interface Endpoint** là một cách triển khai cụ thể của AWS PrivateLink trong VPC. Nếu bạn sử dụng PrivateLink để kết nối đến dịch vụ AWS (như CloudWatch) hoặc endpoint services của đối tác, bạn sẽ cần thiết lập một **VPC Interface Endpoint**.
  - **AWS PrivateLink**: Công nghệ để tạo kết nối riêng tư.
  - **VPC Interface Endpoint**: Một loại endpoint dựa trên PrivateLink, dùng để thực thi kết nối đó trong VPC
    Nói cách khác, mọi VPC Interface Endpoint đều dựa trên PrivateLink, nhưng PrivateLink không chỉ giới hạn ở Interface Endpoint.
- VPC Interface Endpoints cung cấp khả năng kết nối đến các dịch vụ được hỗ trợ bởi AWS PrivateLink. Các dịch vụ này bao gồm:
  - Các dịch vụ AWS như CloudTrail, CloudWatch, v.v.
  - Dịch vụ được lưu trữ bởi khách hàng hoặc đối tác AWS khác trong VPC của họ (gọi là **endpoint services**).
  - Các dịch vụ đối tác từ **AWS Marketplace**.
- VPC Interface Endpoints **chỉ cho phép lưu lượng từ tài nguyên trong VPC đến các endpoints** và **không có chiều ngược lại**.
- Endpoints PrivateLink có thể được truy cập qua: VPC peering (trong cùng hoặc khác region), Direct Connect, VPN connection.
- VPC Interface Endpoints thường sử dụng địa chỉ như `vpce-svc-01234567890abcdef.us-east-1.vpce.amazonaws.com`. Điều này đòi hỏi phải cập nhật ứng dụng để trỏ đến endpoint.
- Private DNS Name
  - Tính năng này cho phép sử dụng **tên public DNS mặc định của AWS** để trỏ đến private VPC endpoint service.
  - Điều này giúp ứng dụng không cần thay đổi cấu hình DNS.
- Tạo ứng dụng tùy chỉnh trong VPC với Interface Endpoints
  - **VPC Interface Endpoint** không chỉ kết nối tài nguyên trong VPC đến các dịch vụ AWS, mà còn cho phép bạn xây dựng **custom applications** bên trong VPC.
  - Bạn có thể biến ứng dụng đó thành một **PrivateLink-powered service**, tức là một dịch vụ được hỗ trợ bởi AWS PrivateLink.
  - Dịch vụ này sẽ được phơi bày thông qua **Network Load Balancer (NLB)**.
  - **Ví dụ**: Một ứng dụng web API được triển khai trong VPC có thể được cấu hình thành một dịch vụ PrivateLink. Người dùng hoặc đối tác có thể sử dụng VPC Interface Endpoint để kết nối đến dịch vụ này mà không cần đi qua Internet.
  - **Lợi ích**: Đảm bảo kết nối an toàn, riêng tư mà không cần đi qua Public Internet.

# VPC Endpoint policy

- **VPC Endpoint Policy** là một IAM resource policy được gắn với một **VPC Endpoint** để kiểm soát quyền truy cập từ Endpoint đến dịch vụ được chỉ định.
- Mặc định, Endpoint policy **cho phép truy cập toàn bộ** từ bất kỳ người dùng hoặc dịch vụ nào trong VPC:
  - Sử dụng thông tin xác thực từ bất kỳ tài khoản AWS nào.
  - Đến bất kỳ tài nguyên S3 nào, kể cả tài nguyên thuộc tài khoản AWS khác với tài khoản chứa VPC.
- Endpoint policy không ghi đè hoặc thay thế các IAM user policies hay các service-specific policies (ví dụ S3 bucket policies).
- Endpoint policy có thể được sử dụng để giới hạn những tài nguyên cụ thể có thể được truy cập thông qua VPC Endpoint.
  ```json
  {
    "Sid": "AccessToSpecificBucket",
    "Effect": "Allow",
    "Principal": "*",
    "Action": ["s3:ListBucket", "s3:GetObject"],
    "Resource": ["arn:aws:s3:::example-bucket", "arn:aws:s3:::example-bucket/*"]
  }
  ```

# Interface Endpoint Limitations

- Mỗi interface endpoint chỉ cho phép chọn **một subnet trong mỗi Availability Zone (AZ)**.
- Chỉ hỗ trợ **TCP traffic**, không hỗ trợ UDP hoặc các giao thức khác.
- Endpoint chỉ hoạt động trong **cùng một region**, không hỗ trợ cross region.
- Chỉ hỗ trợ **IPv4 traffic**, không có khả năng sử dụng IPv6.
- Mặc định, mỗi endpoint hỗ trợ **lên đến 10 Gbps mỗi AZ**, tự động mở rộng lên **40 Gbps**. Để tăng thêm băng thông, cần liên hệ với AWS Support.
- Network ACLs của subnet có thể giới hạn traffic ra/vào endpoint và cần được cấu hình phù hợp để tránh chặn traffic cần thiết.
- Interface endpoint **không thể chuyển giữa các VPC** hoặc chuyển đổi sang dịch vụ khác.
