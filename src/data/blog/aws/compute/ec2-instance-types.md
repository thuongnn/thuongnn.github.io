---
author: thuongnn
pubDatetime: 2023-03-22T09:15:33Z
modDatetime: 2025-05-29T02:30:41Z
title: "[AWS] EC2 Instance Types"
folder: "aws"
draft: false
tags:
  - AWS
  - Amazon Web Services
description: Tìm hiểu về các loại instance EC2 khác nhau, từ tối ưu cho tính toán đến lưu trữ, và cách chọn loại instance phù hợp
---

Bài viết được tham khảo và tổng hợp lại từ Jayendra's Blog, xem bài viết gốc ở đây: https://jayendrapatil.com/aws-ec2-instance-types.

## Table of contents

## Giới thiệu

- EC2 instance là **máy chủ ảo trên AWS**, có thể được khởi chạy từ **Amazon Machine Image (AMI)**.
- AWS cung cấp **nhiều loại instance** được tối ưu hóa cho các trường hợp sử dụng khác nhau như **tính toán hiệu suất cao, lưu trữ, bộ nhớ, GPU...**
- Các thông số chính của một EC2 instance gồm:
  - ✅ **VCPU (Số lõi CPU ảo)**
  - ✅ **RAM (Bộ nhớ)**
  - ✅ **Loại lưu trữ (EBS hoặc Instance Store)**
  - ✅ **Băng thông mạng**
  - ✅ **Hỗ trợ tăng tốc phần cứng (GPU, FPGA)**

📌 **Chọn loại instance phù hợp sẽ giúp tối ưu hiệu suất và chi phí trên AWS.**

## **Các loại EC2 Instance chính**

AWS phân loại EC2 instances thành nhiều nhóm dựa trên mục đích sử dụng:

- **General Purpose (Đa dụng)**
  - Cân bằng giữa **CPU, RAM, và mạng**.
  - Phù hợp cho các ứng dụng web, server ứng dụng, cơ sở dữ liệu nhỏ, v.v.
  - Các dòng phổ biến:
    - ✅ **T-series (T3, T3a, T2):** Hỗ trợ "CPU burst", tối ưu chi phí cho tải công việc không liên tục.
    - ✅ **M-series (M7, M6, M5, M4):** Cân bằng giữa CPU và RAM, dùng cho ứng dụng doanh nghiệp, web server.
      📌 **Dùng cho: Web server, ứng dụng doanh nghiệp, database nhỏ.**

---

- **Compute Optimized (Tối ưu CPU)**
  - Cung cấp **hiệu suất tính toán cao**, CPU mạnh mẽ, ít bị giới hạn bởi RAM.
  - Phù hợp cho các ứng dụng **yêu cầu CPU cao như xử lý batch, media transcoding, high-performance computing (HPC)**.
  - Các dòng phổ biến:
    - ✅ **C7, C6, C5, C4:** Tối ưu cho hiệu suất xử lý cao, dùng cho khoa học dữ liệu, machine learning, video encoding.
      📌 **Dùng cho: Xử lý dữ liệu lớn, AI/ML, ứng dụng khoa học, game server.**

---

- **Memory Optimized (Tối ưu bộ nhớ)**
  - Cung cấp **dung lượng RAM lớn** để xử lý cơ sở dữ liệu lớn, caching, in-memory analytics.
  - Phù hợp cho ứng dụng cần **RAM lớn hơn CPU**, như **SAP HANA, Redis, Memcached, Big Data.**
  - Các dòng phổ biến:
    - ✅ **R7, R6, R5, R4:** Dùng cho database in-memory, caching, xử lý dữ liệu lớn.
    - ✅ **X2, X1, X1e:** Tối ưu cho SAP HANA, phân tích dữ liệu lớn.
    - ✅ **Z1d:** Hiệu suất CPU cao kèm bộ nhớ lớn.
      📌 **Dùng cho: SAP, Oracle, Redis, ElasticSearch, ứng dụng Big Data.**

---

- **Storage Optimized (Tối ưu lưu trữ)**
  - Được thiết kế cho ứng dụng **yêu cầu truy cập IOPS cao, đọc/ghi dữ liệu lớn**, như **Big Data, NoSQL, phân tích log.**
  - Các dòng phổ biến:
    - ✅ **I4, I3, I2:** Dùng **NVMe SSD** để cung cấp tốc độ truy cập nhanh.
    - ✅ **D3, D2:** Dùng **HDD**, phù hợp với lưu trữ dữ liệu khối lượng lớn.
    - ✅ **H1:** Kết hợp HDD với hiệu suất cao.
      📌 **Dùng cho: NoSQL DB, Big Data, phân tích log, data warehouse.**

---

- **Accelerated Computing (Tăng tốc phần cứng - GPU, FPGA)**
  - Hỗ trợ phần cứng tăng tốc như **GPU (NVIDIA), FPGA**, giúp xử lý nhanh hơn cho **AI/ML, Deep Learning, đồ họa, video rendering.**
  - Các dòng phổ biến:
    - ✅ **P4, P3, P2:** GPU NVIDIA Tesla, phù hợp với AI/ML, deep learning.
    - ✅ **G5, G4:** GPU NVIDIA, dùng cho video streaming, gaming.
    - ✅ **F1:** Dùng FPGA, tối ưu cho xử lý dữ liệu theo yêu cầu.
      📌 **Dùng cho: AI/ML, Deep Learning, Big Data, Video processing.**

---

## Các instance đặc biệt

AWS còn có một số loại instance đặc biệt như:

- **High Memory Instances (U-series):** Hỗ trợ bộ nhớ lên tới **24 TB**, dùng cho SAP HANA, database lớn.
- **Bare Metal Instances:** Chạy trực tiếp trên phần cứng vật lý mà không cần hypervisor.
- **Mac Instances:** Dùng để build, test ứng dụng iOS/macOS.

## **Chọn loại EC2 Instance phù hợp**

| **Loại Instance**                   | **Trường hợp sử dụng**                           |
| ----------------------------------- | ------------------------------------------------ |
| **General Purpose (M, T)**          | Ứng dụng web, server ứng dụng, cơ sở dữ liệu nhỏ |
| **Compute Optimized (C)**           | AI/ML, game server, video encoding               |
| **Memory Optimized (R, X, Z)**      | SAP HANA, Redis, database lớn                    |
| **Storage Optimized (I, D, H)**     | NoSQL DB, phân tích dữ liệu, Big Data            |
| **Accelerated Computing (P, G, F)** | AI/ML, Deep Learning, Video Processing           |

📌 **Luôn cân nhắc hiệu suất với chi phí khi chọn EC2 instance!**
