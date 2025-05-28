---
author: thuongnn
pubDatetime: 2023-03-27T15:30:45Z
title: "[AWS] EC2 Placement Groups"
draft: false
tags:
  - AWS
  - Amazon Web Services
description: Tìm hiểu về các nhóm placement trong EC2, giúp kiểm soát vị trí vật lý của các instance.
---
Bài viết được tham khảo và tổng hợp lại từ Jayendra's Blog, xem bài viết gốc ở đây: https://jayendrapatil.com/aws-ec2-placement-groups. 

## Table of contents


AWS EC2 **Placement Groups** giúp kiểm soát vị trí của các phiên bản EC2 trong cùng một khu vực, tối ưu hóa hiệu suất, độ trễ, hoặc khả năng chịu lỗi tùy theo nhu cầu của ứng dụng. Có 3 loại Placement Groups chính:

### **Cluster Placement Group**

✅ **Mô tả:**

- Các phiên bản EC2 được đặt gần nhau trong cùng một AZ.
- Cung cấp **băng thông cao** và **độ trễ thấp** giữa các phiên bản.
- Phù hợp với **khối lượng công việc hiệu suất cao (HPC)**, điện toán lưới, phân tích dữ liệu lớn, và AI/ML.

✅ **Lưu ý:**

- Tốt nhất là dùng **Enhanced Networking (ENA)** hoặc **Elastic Fabric Adapter (EFA)** để tăng hiệu suất mạng.
- Có thể thêm nhiều phiên bản sau khi tạo nhóm, nhưng không đảm bảo đủ tài nguyên nếu cụm quá lớn.

### **Spread Placement Group**

✅ **Mô tả:**

- Đảm bảo rằng các phiên bản được đặt trên **phần cứng vật lý riêng biệt**, giảm nguy cơ mất tất cả phiên bản do lỗi phần cứng.
- Hỗ trợ tối đa **7 phiên bản EC2 trên mỗi AZ**.
- Dùng cho **ứng dụng quan trọng**, yêu cầu độ tin cậy cao.

✅ **Lưu ý:**

- Thích hợp cho các workload yêu cầu **tính sẵn sàng cao** như cơ sở dữ liệu, máy chủ quan trọng.
- Nếu cần nhiều hơn 7 instance, phải sử dụng nhiều AZ.

### **Partition Placement Group**

✅ **Mô tả:**

- Các phiên bản được nhóm thành **các Partition riêng biệt** trên phần cứng vật lý khác nhau.
- Nếu một Partition bị lỗi, các Partition khác không bị ảnh hưởng.
- Dùng cho **hệ thống phân tán lớn**, như Big Data (Hadoop, Cassandra, HDFS).

✅ **Lưu ý:**

- Hỗ trợ tối đa **7 Partitions trên mỗi AZ**.
- Các AZ khác nhau có thể có số Partition khác nhau.
- AWS quản lý cách đặt phiên bản trong mỗi Partition, không cần tự cấu hình.

### **So sánh các loại Placement Groups**

| Placement Group | Độ trễ thấp | Băng thông cao | Độ chịu lỗi cao | Sử dụng phổ biến |
| --- | --- | --- | --- | --- |
| **Cluster** | ✅ | ✅ | ❌ | HPC, AI/ML, phân tích dữ liệu |
| **Spread** | ❌ | ❌ | ✅ | Ứng dụng quan trọng, database |
| **Partition** | ❌ | ✅ | ✅ | Big Data, HDFS, Cassandra |

### **Tóm tắt**

- **Cluster Placement Group** → Tối ưu hiệu suất cao, băng thông lớn, độ trễ thấp.
- **Spread Placement Group** → Bảo vệ ứng dụng quan trọng, đảm bảo các phiên bản chạy trên phần cứng riêng biệt.
- **Partition Placement Group** → Phù hợp với hệ thống dữ liệu lớn, phân tán, có khả năng chịu lỗi cao.
