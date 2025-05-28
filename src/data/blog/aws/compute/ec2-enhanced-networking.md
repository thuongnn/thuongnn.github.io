---
author: thuongnn
pubDatetime: 2023-03-30T09:15:33Z
title: "[AWS] EC2 Enhanced Networking"
folder: "aws"
draft: false
tags:
  - AWS
  - Amazon Web Services
description: Tìm hiểu về các tính năng mạng nâng cao của EC2, giúp cải thiện hiệu suất và độ tin cậy của mạng.
---

Bài viết được tham khảo và tổng hợp lại từ Jayendra's Blog, xem bài viết gốc ở đây: https://jayendrapatil.com/aws-ec2-enhanced-networking.

## Table of contents

Enhanced Networking là tính năng giúp **tăng tốc độ mạng, giảm độ trễ và giảm tải CPU** cho EC2 instances bằng cách sử dụng **SR-IOV (Single Root I/O Virtualization)** hoặc **Elastic Network Adapter (ENA)**.

## **Lợi ích của Enhanced Networking**

- **Tăng băng thông mạng**: Lên đến **100 Gbps** trên các instance thế hệ mới.
- **Giảm độ trễ**: Cải thiện hiệu suất cho các ứng dụng yêu cầu truyền dữ liệu nhanh, như Big Data, AI/ML, và HPC.
- **Giảm tải CPU**: Xử lý mạng trực tiếp trên phần cứng, giảm áp lực lên CPU.
- **Tối ưu cho ứng dụng nhạy cảm về độ trễ**, như tài chính, gaming, và hệ thống phân tán.

## **Các tùy chọn Enhanced Networking trên AWS**

| **Công nghệ**                     | **Mô tả**                                           | **Băng thông tối đa** | **Dùng cho instance loại nào?**                         |
| --------------------------------- | --------------------------------------------------- | --------------------- | ------------------------------------------------------- |
| **Elastic Network Adapter (ENA)** | Hỗ trợ tốc độ **lên đến 100 Gbps**                  | 100 Gbps              | Hầu hết các instance thế hệ mới (C5, M5, R5, P3, I3, …) |
| **Intel 82599 VF (SR-IOV)**       | Hỗ trợ tối đa **10 Gbps**, sử dụng driver của Intel | 10 Gbps               | Instance cũ (C3, R3, I2, M4, D2)                        |

## **So sánh ENA và SR-IOV**

| **Tính năng**           | **ENA**               | **SR-IOV (Intel 82599 VF)** |
| ----------------------- | --------------------- | --------------------------- |
| **Băng thông tối đa**   | Lên đến **100 Gbps**  | Lên đến **10 Gbps**         |
| **Độ trễ**              | Rất thấp              | Thấp                        |
| **Tải CPU**             | Thấp                  | Trung bình                  |
| **Instance hỗ trợ**     | C5, M5, R5, P3, I3, … | C3, R3, I2, M4, D2          |
| **Hệ điều hành hỗ trợ** | Linux & Windows       | Linux & Windows             |

## **Kiểm tra Enhanced Networking trên EC2**

### **Kiểm tra xem instance có hỗ trợ Enhanced Networking không**

Chạy lệnh sau trên Linux để kiểm tra:

```bash
ethtool -i eth0
```

- Nếu **driver** là `ena` → Instance hỗ trợ **ENA**.
- Nếu **driver** là `ixgbevf` → Instance hỗ trợ **SR-IOV**.

Hoặc kiểm tra trên AWS bằng lệnh:

```bash
aws ec2 describe-instances --instance-id i-xxxxxxxxxxxxx --query 'Reservations[*].Instances[*].EnaSupport'
```

- Nếu trả về `true` → Instance hỗ trợ **ENA**.

## **Cách bật Enhanced Networking trên EC2**

- **Bật ENA (Elastic Network Adapter)**

  1. **Kiểm tra instance type**: Chỉ các instance thế hệ mới mới hỗ trợ ENA.
  2. **Dùng AMI hỗ trợ ENA**:
     - Amazon Linux 2
     - Ubuntu 18.04 trở lên
     - Windows Server 2016 trở lên
  3. **Chạy lệnh để bật ENA** trên Linux:

     ```bash
     sudo modprobe ena
     ```

  4. **Kích hoạt ENA trên AWS** (nếu chưa bật):

     ```bash
     aws ec2 modify-instance-attribute --instance-id i-xxxxxxxxxxxxx --ena-support
     ```

- **Bật SR-IOV (Intel 82599 VF)**

  1. **Dùng instance hỗ trợ SR-IOV** (C3, R3, M4, D2, v.v.).
  2. **Cài đặt driver Intel SR-IOV** nếu chưa có:

     ```bash
     sudo yum install ixgbevf
     ```

  3. **Kích hoạt trên AWS**:

     ```bash
     aws ec2 modify-instance-attribute --instance-id i-xxxxxxxxxxxxx --sriov-net-support simple
     ```

## **Khi nào nên dùng Enhanced Networking?**

| **Trường hợp sử dụng**                    | **Lý do chọn Enhanced Networking**              |
| ----------------------------------------- | ----------------------------------------------- |
| **Big Data (Apache Spark, Hadoop, etc.)** | Tăng tốc truyền dữ liệu giữa các node           |
| **Machine Learning (AI/ML)**              | Giảm độ trễ khi xử lý dữ liệu trên GPU          |
| **High-Performance Computing (HPC)**      | Tận dụng tốc độ cao của ENA                     |
| **Media Streaming & Gaming**              | Giảm giật lag, cải thiện trải nghiệm người dùng |
| **Financial Trading & Analytics**         | Độ trễ thấp giúp xử lý giao dịch nhanh hơn      |

# **Tổng kết**

- **Enhanced Networking giúp EC2 chạy nhanh hơn, ít tiêu tốn CPU hơn.**
- **ENA hỗ trợ tốc độ cao nhất (lên đến 100 Gbps), phù hợp với các instance mới.**
- **SR-IOV hỗ trợ tối đa 10 Gbps, dùng cho các instance cũ hơn.**
- **Có thể kiểm tra và bật Enhanced Networking bằng CLI hoặc AWS Console.**

Enhanced Networking là tính năng quan trọng để tối ưu hóa hiệu suất mạng trên AWS, đặc biệt cho các ứng dụng yêu cầu **tốc độ cao, độ trễ thấp và xử lý dữ liệu lớn**. 🚀
