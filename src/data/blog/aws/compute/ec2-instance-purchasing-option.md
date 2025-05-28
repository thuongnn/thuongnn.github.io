---
author: thuongnn
pubDatetime: 2023-03-23T10:20:15Z
title: "[AWS] EC2 Instance Purchasing Options"
draft: false
tags:
  - AWS
  - Amazon Web Services
description: Tìm hiểu về các tùy chọn mua instance EC2, bao gồm On-Demand, Reserved, Spot và Dedicated Hosts.
---
Bài viết được tham khảo và tổng hợp lại từ Jayendra's Blog, xem bài viết gốc ở đây: https://jayendrapatil.com/aws-ec2-instance-purchasing-options. 

## Table of contents


### **Các tùy chọn mua EC2 Instance trên AWS**

AWS cung cấp nhiều **tùy chọn mua EC2 instance** để giúp tối ưu hóa chi phí theo nhu cầu sử dụng. Mỗi tùy chọn có **ưu điểm và hạn chế** riêng, phù hợp với từng loại workload khác nhau.

## **On-Demand Instances (Theo yêu cầu)**

- **Trả tiền theo giờ hoặc theo giây** mà không cần cam kết dài hạn.
- Phù hợp cho **ứng dụng có tải không ổn định hoặc thử nghiệm ngắn hạn**.
- **Ưu điểm**:
    - ✅ Không có cam kết dài hạn, linh hoạt thay đổi instance khi cần.
    - ✅ Phù hợp với workload ngắn hạn, đột biến, thử nghiệm.
- **Hạn chế**:
    - ❌ **Chi phí cao nhất** so với các tùy chọn khác.

📌 **Dùng cho**: Ứng dụng thử nghiệm, workload không ổn định, startup cần linh hoạt.

## **Reserved Instances (RI - Cam kết trước)**

- **Giảm giá tới 72%** so với On-Demand nếu cam kết sử dụng **1 hoặc 3 năm**.
- Có 2 loại chính:
    - ✅ **Standard RI**: Giảm giá cao nhất nhưng ít linh hoạt.
    - ✅ **Convertible RI**: Linh hoạt thay đổi loại instance nhưng giảm giá thấp hơn.
- **Ưu điểm**:
    - ✅ Tiết kiệm chi phí lớn nếu sử dụng lâu dài.
    - ✅ Phù hợp với workload ổn định, chạy liên tục.
- **Hạn chế**:
    - ❌ Phải cam kết trước, ít linh hoạt nếu workload thay đổi.

📌 **Dùng cho**: Web server, database, ứng dụng ổn định, workload dài hạn.

## **Spot Instances (Đấu giá)**

- **Chi phí rẻ hơn 90%** so với On-Demand nhưng có thể bị AWS thu hồi nếu giá thay đổi.
- Phù hợp cho **workload linh hoạt, không yêu cầu chạy liên tục**.
- **Ưu điểm**:
    - ✅ Tiết kiệm chi phí cực lớn.
    - ✅ Phù hợp với xử lý batch, AI/ML, Big Data, ứng dụng có khả năng tự động khôi phục.
- **Hạn chế**:
    - ❌ **Instance có thể bị AWS thu hồi bất cứ lúc nào**.
    - ❌ Không phù hợp cho ứng dụng yêu cầu **độ ổn định cao**.

📌 **Dùng cho**: Big Data, AI/ML, Batch Processing, CI/CD pipeline.

---

## **Savings Plans (Kế hoạch tiết kiệm)**

- **Cam kết trả phí theo giờ trong 1 hoặc 3 năm** để **giảm giá tới 72%** như Reserved Instance.
- Linh hoạt hơn RI vì **không bị ràng buộc vào loại instance cụ thể**.
- Có 2 loại:
    - ✅ **Compute Savings Plans**: Linh hoạt thay đổi loại instance, OS, khu vực AWS.
    - ✅ **EC2 Instance Savings Plans**: Chỉ giảm giá cho một loại instance nhất định.
- **Ưu điểm**:
    - ✅ Tiết kiệm như RI nhưng linh hoạt hơn.
    - ✅ Có thể áp dụng cho cả EC2, Fargate, Lambda.
- **Hạn chế**:
    - ❌ Cần cam kết sử dụng lâu dài để có lợi ích.

📌 **Dùng cho**: Workload dài hạn nhưng cần linh hoạt hơn RI.

---

## **Dedicated Hosts (Máy chủ vật lý riêng)**

- **Cung cấp toàn bộ máy chủ vật lý** dành riêng cho một khách hàng.
- **Phù hợp cho doanh nghiệp có yêu cầu bảo mật cao** hoặc cần tuân thủ quy định như PCI, HIPAA.
- **Ưu điểm**:
    - ✅ Kiểm soát toàn bộ phần cứng, phù hợp với yêu cầu bảo mật.
    - ✅ Có thể tận dụng các license phần mềm hiện có.
- **Hạn chế**:
    - ❌ **Chi phí cao** hơn so với các tùy chọn khác.

📌 **Dùng cho**: Doanh nghiệp cần kiểm soát phần cứng, yêu cầu bảo mật cao.

---

## **Dedicated Instances**

- **Chạy trên phần cứng vật lý riêng biệt**, nhưng **không kiểm soát toàn bộ máy chủ** như Dedicated Hosts.
- **Ưu điểm**:
    - ✅ Tăng cường bảo mật, cô lập workload với khách hàng khác.
    - ✅ Phù hợp với yêu cầu tuân thủ dữ liệu nghiêm ngặt.
- **Hạn chế**:
    - ❌ Không thể kiểm soát toàn bộ phần cứng như Dedicated Hosts.

📌 **Dùng cho**: Ứng dụng yêu cầu cô lập tài nguyên nhưng không cần Dedicated Hosts.

---

## **Capacity Reservations (Dự trữ tài nguyên)**

- **Giữ trước tài nguyên EC2 trong một khu vực AWS** để đảm bảo khả năng triển khai ngay lập tức.
- **Ưu điểm**:
    - ✅ Đảm bảo có đủ tài nguyên ngay cả khi nhu cầu cao.
    - ✅ Có thể kết hợp với RI hoặc Savings Plans để tiết kiệm chi phí.
- **Hạn chế**:
    - ❌ Trả phí ngay cả khi không sử dụng tài nguyên.

📌 **Dùng cho**: Ứng dụng quan trọng, cần đảm bảo tài nguyên luôn có sẵn.

---

# **Kết luận: Nên chọn loại nào?**

| **Tùy chọn** | **Ưu điểm** | **Nhược điểm** | **Dùng cho** |
| --- | --- | --- | --- |
| **On-Demand** | Linh hoạt, không cam kết | Giá cao nhất | Workload ngắn hạn, thử nghiệm |
| **Reserved Instances (RI)** | Giảm tới 72%, tối ưu chi phí | Ít linh hoạt, phải cam kết | Workload dài hạn, ổn định |
| **Spot Instances** | Rẻ hơn 90% | Có thể bị thu hồi bất cứ lúc nào | Big Data, AI/ML, batch processing |
| **Savings Plans** | Linh hoạt hơn RI, giảm tới 72% | Cần cam kết trước | Workload dài hạn nhưng cần thay đổi instance |
| **Dedicated Hosts** | Toàn quyền kiểm soát phần cứng | Chi phí cao | Doanh nghiệp cần bảo mật cao |
| **Dedicated Instances** | Cô lập với khách hàng khác | Không kiểm soát toàn bộ phần cứng | Ứng dụng cần bảo mật |
| **Capacity Reservations** | Đảm bảo tài nguyên có sẵn | Trả phí ngay cả khi không dùng | Ứng dụng quan trọng, high-availability |

📌 **Tóm lại:**

✅ **Dùng On-Demand nếu cần linh hoạt.**

✅ **Dùng Reserved Instances hoặc Savings Plans nếu workload ổn định để tiết kiệm chi phí.**

✅ **Dùng Spot Instances nếu workload không quan trọng và có thể bị gián đoạn.**

✅ **Dùng Dedicated Hosts hoặc Dedicated Instances nếu cần bảo mật cao.**
