---
author: thuongnn
pubDatetime: 2023-03-31T11:45:22Z
title: "[AWS] EC2 Networking"
folder: "aws"
draft: false
tags:
  - AWS
  - Amazon Web Services
description: Tìm hiểu về các tính năng mạng cơ bản của EC2, bao gồm VPC, subnets và network interfaces.
---

Bài viết được tham khảo và tổng hợp lại từ Jayendra's Blog, xem bài viết gốc ở đây: https://jayendrapatil.com/aws-ec2-networking.

## Table of contents

EC2 networking cung cấp các tùy chọn kết nối linh hoạt và bảo mật giữa các instance, dịch vụ AWS và các hệ thống bên ngoài. AWS sử dụng **Amazon Virtual Private Cloud (VPC)** làm nền tảng để quản lý mạng, cho phép bạn kiểm soát toàn bộ kiến trúc mạng của mình.

## **Các thành phần chính trong EC2 Networking**

| **Thành phần**                         | **Mô tả**                                                                                   |
| -------------------------------------- | ------------------------------------------------------------------------------------------- |
| **Amazon VPC (Virtual Private Cloud)** | Mạng ảo riêng biệt, nơi các EC2 instance được khởi chạy.                                    |
| **Subnet**                             | Phân đoạn nhỏ trong VPC, có thể là public (internet accessible) hoặc private (nội bộ).      |
| **Internet Gateway (IGW)**             | Cho phép các instance trong VPC truy cập internet.                                          |
| **Elastic IP (EIP)**                   | Địa chỉ IP tĩnh, có thể gán cho một EC2 instance.                                           |
| **Security Groups (SGs)**              | Firewall ở cấp độ instance, kiểm soát inbound và outbound traffic.                          |
| **Network ACLs (NACLs)**               | Firewall ở cấp độ subnet, quy định lưu lượng giữa các subnet và internet.                   |
| **Elastic Load Balancer (ELB)**        | Cân bằng tải lưu lượng giữa nhiều EC2 instances.                                            |
| **Amazon Route 53**                    | Dịch vụ DNS giúp quản lý tên miền và định tuyến lưu lượng.                                  |
| **NAT Gateway / NAT Instance**         | Cho phép instance trong private subnet truy cập internet mà không cần địa chỉ IP công khai. |
| **AWS PrivateLink**                    | Cho phép kết nối private với các dịch vụ AWS mà không qua internet.                         |
| **AWS Direct Connect**                 | Kết nối trực tiếp từ mạng on-premises đến AWS, giúp giảm độ trễ.                            |

## **Cấu trúc mạng của EC2 trong VPC**

Mỗi EC2 instance phải thuộc về một **VPC** và được đặt trong một **subnet**. Khi triển khai EC2, bạn cần cấu hình:

- **Public Subnet**: Dành cho các instance có thể truy cập trực tiếp từ internet.
- **Private Subnet**: Dành cho các instance chỉ có thể truy cập nội bộ trong VPC.
- **Route Table**: Xác định cách EC2 giao tiếp với internet và các subnet khác.
- **Security Group**: Quyết định lưu lượng nào được phép vào và ra khỏi EC2 instance.
- **Elastic IP (EIP)**: Cung cấp địa chỉ IP tĩnh, giúp instance duy trì địa chỉ cố định ngay cả khi khởi động lại.

## **Kết nối Internet cho EC2 Instance**

### **Public IP vs Elastic IP**

| **Loại IP**    | **Mô tả**                                               | **Khi nào dùng?**                        |
| -------------- | ------------------------------------------------------- | ---------------------------------------- |
| **Public IP**  | Được gán tự động cho instance, thay đổi khi restart.    | Khi không cần địa chỉ IP cố định.        |
| **Elastic IP** | IP tĩnh do AWS cung cấp, có thể gán cho nhiều instance. | Khi cần IP cố định để truy cập từ ngoài. |

### **Kết nối Internet với Internet Gateway (IGW)**

- Public EC2 instance có thể truy cập internet thông qua **Internet Gateway (IGW)**.
- Cần gán **Public IP hoặc Elastic IP** để truy cập từ bên ngoài.
- Route table của subnet phải có tuyến đường `0.0.0.0/0` trỏ đến IGW.

### **Kết nối Private Instance với Internet (NAT Gateway)**

- Instance trong **private subnet** không có IP công khai nên không thể trực tiếp truy cập internet.
- Dùng **NAT Gateway hoặc NAT Instance** để truy cập internet một chiều (ví dụ: tải cập nhật từ internet).
- Route table của private subnet cần có tuyến đường `0.0.0.0/0` trỏ đến NAT Gateway.

## **Bảo mật trong EC2 Networking**

### **Security Groups (SGs)**

- Firewall ở cấp **instance**, chỉ cho phép traffic theo quy tắc định sẵn.
- **Mặc định chặn tất cả inbound traffic** và cho phép tất cả outbound traffic.
- Có thể thiết lập theo IP, port, và protocol (TCP, UDP, ICMP).

### **Network ACLs (NACLs)**

- Firewall ở cấp **subnet**, áp dụng cho tất cả các instance trong subnet đó.
- Có thể cho phép hoặc chặn cả inbound và outbound traffic.
- Hữu ích khi cần chặn traffic từ một dải IP cụ thể.

| **Security Groups**                         | **Network ACLs**                                        |
| ------------------------------------------- | ------------------------------------------------------- |
| Áp dụng ở mức instance                      | Áp dụng ở mức subnet                                    |
| Chỉ có **Allow rules**                      | Có cả **Allow** và **Deny rules**                       |
| Kiểm soát lưu lượng vào và ra từng instance | Kiểm soát lưu lượng giữa các subnet                     |
| Dễ cấu hình, phù hợp với hầu hết use case   | Cần cấu hình thủ công, mạnh hơn trong kiểm soát bảo mật |

---

## **Kết nối giữa các EC2 Instances**

### **VPC Peering**

- Kết nối **private** giữa hai VPC, ngay cả khi chúng thuộc tài khoản AWS khác.
- Không cần đi qua internet hoặc VPN.
- Không hỗ trợ chuyển tiếp traffic (transitive routing).

### **AWS Transit Gateway**

- Cách tiếp cận **trung tâm** để kết nối nhiều VPC và on-premises networks.
- Hỗ trợ routing và kiểm soát tập trung.
- Có thể kết nối với VPN và Direct Connect.

### **AWS PrivateLink**

- Cho phép kết nối **private** đến các dịch vụ AWS như S3, DynamoDB mà không qua internet.
- Giúp tăng cường bảo mật, giảm độ trễ.

## **Kết nối On-Premises với AWS**

### **AWS Direct Connect**

- Kết nối vật lý giữa **data center on-premises** với AWS.
- Độ trễ thấp, ổn định hơn so với VPN.
- Dùng cho workload yêu cầu tốc độ cao và bảo mật mạnh.

### **AWS Site-to-Site VPN**

- Kết nối bảo mật giữa **VPC và on-premises network** bằng **IPsec VPN**.
- Hỗ trợ redundancy với **2 đường VPN** đến AWS.
- Phù hợp cho doanh nghiệp cần kết nối nhanh mà không đầu tư vào đường truyền vật lý.

## **Cân bằng tải với Elastic Load Balancer (ELB)**

**Elastic Load Balancer (ELB)** giúp phân phối lưu lượng đến nhiều EC2 instances để đảm bảo **tính sẵn sàng và hiệu suất cao**. Có 3 loại chính:

| **Loại Load Balancer**              | **Mô tả**                                                                             |
| ----------------------------------- | ------------------------------------------------------------------------------------- |
| **Application Load Balancer (ALB)** | Hoạt động ở lớp **7 (HTTP/HTTPS)**, hỗ trợ routing dựa trên URL, host, header.        |
| **Network Load Balancer (NLB)**     | Hoạt động ở lớp **4 (TCP/UDP)**, phù hợp với ứng dụng cần độ trễ thấp, hiệu suất cao. |
| **Classic Load Balancer (CLB)**     | Hỗ trợ cả **HTTP/HTTPS và TCP**, thích hợp với ứng dụng legacy.                       |

## **Tóm tắt kiến trúc mạng của AWS EC2**

- **VPC** là nền tảng mạng chính, chia thành **public và private subnet**.
- **EC2 instance có thể giao tiếp với internet** qua IGW (public) hoặc NAT Gateway (private).
- **Security Group bảo vệ cấp instance**, còn **Network ACL bảo vệ cấp subnet**.
- **Elastic Load Balancer giúp phân phối traffic** giữa nhiều instances.
- **AWS Direct Connect hoặc VPN giúp kết nối AWS với on-premises**.
- **AWS PrivateLink và VPC Peering giúp kết nối nội bộ giữa các dịch vụ AWS** mà không qua internet.

## **Khi nào dùng các giải pháp mạng AWS?**

| **Trường hợp**                                         | **Giải pháp AWS**                       |
| ------------------------------------------------------ | --------------------------------------- |
| Kết nối giữa các EC2 instances trong cùng VPC          | **Private IP, Security Groups**         |
| Kết nối private giữa các VPC khác nhau                 | **VPC Peering, Transit Gateway**        |
| Cân bằng tải giữa nhiều EC2 instances                  | **Elastic Load Balancer (ALB/NLB/CLB)** |
| Kết nối từ on-premises đến AWS                         | **AWS Direct Connect, VPN**             |
| Truy cập internet từ EC2 instance trong public subnet  | **Internet Gateway**                    |
| Truy cập internet từ EC2 instance trong private subnet | **NAT Gateway, NAT Instance**           |
| Truy cập private đến AWS services (S3, DynamoDB...)    | **AWS PrivateLink**                     |

Với các giải pháp trên, bạn có thể thiết kế hệ thống **bảo mật, linh hoạt và tối ưu hiệu suất** trên AWS. 🚀
