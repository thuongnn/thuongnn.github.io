---
author: thuongnn
pubDatetime: 2023-04-02T10:20:15Z
modDatetime: 2025-05-29T02:30:41Z
title: "[AWS] EC2 Spot Instances"
folder: "aws"
draft: false
tags:
  - AWS
  - Amazon Web Services
description: Tìm hiểu về Spot Instances trong EC2, cách tận dụng công suất tính toán chưa sử dụng với chi phí thấp.
---

Bài viết được tham khảo và tổng hợp lại từ Jayendra's Blog, xem bài viết gốc ở đây: https://jayendrapatil.com/aws-ec2-spot-instances.

**Spot Instances** là một trong những tùy chọn mua **EC2 instance với giá rẻ hơn tới 90%** so với **On-Demand**, giúp tiết kiệm chi phí đáng kể cho các workload có tính linh hoạt. Tuy nhiên, **Spot Instances có thể bị AWS thu hồi bất cứ lúc nào** nếu nhu cầu tài nguyên tăng lên.

## Table of contents

# **Spot Instances là gì?**

- **Là các EC2 instance dư thừa trong AWS**, được bán đấu giá với giá rẻ hơn nhiều so với On-Demand.
- **Có thể bị AWS thu hồi nếu nhu cầu tăng lên** và giá Spot vượt quá giá thầu của bạn.
- **Chi phí thay đổi theo thời gian**, dựa trên cung-cầu tài nguyên của AWS.
- **Phù hợp với workload có thể chịu gián đoạn** như xử lý batch, AI/ML, Big Data.

## **Lợi ích của Spot Instances**

- ✅ **Tiết kiệm tới 90% chi phí so với On-Demand**.
- ✅ **Có thể mở rộng nhanh chóng với chi phí thấp**, phù hợp với workload đòi hỏi tài nguyên lớn.
- ✅ **Tích hợp dễ dàng với Auto Scaling, EC2 Fleet, Spot Fleet** để tăng khả năng chịu lỗi.
- ✅ **Hỗ trợ Spot Block (không bị gián đoạn trong 1 - 6 giờ)** nếu cần đảm bảo chạy liên tục trong thời gian ngắn.

## **Hạn chế của Spot Instances**

- ❌ **Có thể bị thu hồi bất cứ lúc nào** nếu giá vượt mức bạn đặt hoặc AWS cần tài nguyên.
- ❌ **Không phù hợp với ứng dụng yêu cầu chạy liên tục hoặc có trạng thái** (stateful applications).
- ❌ **Giá có thể biến động**, gây khó khăn trong việc dự đoán chi phí.

# **Cách AWS thu hồi Spot Instances**

- AWS sẽ **gửi thông báo trước 2 phút** trước khi thu hồi Spot Instance.
- Có thể sử dụng **EC2 Auto Scaling, Spot Fleet, hoặc Spot Placement Score** để hạn chế ảnh hưởng của việc thu hồi.
- **Có thể chuyển đổi sang On-Demand hoặc Reserved Instances** nếu cần duy trì workload ổn định.

# **Cách mua Spot Instances**

- **Spot Request (Yêu cầu Spot đơn lẻ)**
  ![1.png](@/assets/images/aws/compute/ec2-spot-instances/1.png)
  - Tạo **một Spot Instance** và AWS sẽ cấp phát nếu giá đấu thầu >= giá Spot hiện tại.
  - Nếu instance bị thu hồi, phải tạo yêu cầu mới để khởi động lại.
- **Spot Fleet (Nhóm Spot Instances)**
  - **Tự động quản lý một nhóm Spot Instances**, có thể kết hợp với On-Demand.
  - **Tự động thay thế các instance bị thu hồi** để đảm bảo workload luôn chạy.
  - **Hỗ trợ mix nhiều loại instance và AZ khác nhau** để tối ưu tài nguyên.
- **Spot Block (Spot với thời gian cố định)**
  - Giữ Spot Instance trong khoảng 1 - 6 giờ mà không bị thu hồi.
  - Phù hợp với workload cần chạy ngắn hạn nhưng không muốn bị gián đoạn.

# **Cách tránh gián đoạn khi dùng Spot Instances**

- 🔹 **Dùng Spot Fleet hoặc EC2 Auto Scaling** để thay thế Spot Instances bị thu hồi.
- 🔹 **Dùng tính năng Spot Placement Score** để chọn khu vực AWS có khả năng duy trì Spot Instance lâu hơn.
- 🔹 **Sử dụng Spot Block nếu workload chỉ cần chạy trong thời gian ngắn**.
- 🔹 **Kết hợp Spot với On-Demand hoặc Reserved Instances** nếu workload yêu cầu độ ổn định.

# **Khi nào nên dùng Spot Instances?**

- 📌 **Tốt nhất cho workload không yêu cầu chạy liên tục hoặc có thể tự động khôi phục**:
  - ✅ **Big Data, AI/ML, video rendering, genomic sequencing, batch processing**.
  - ✅ **CI/CD pipeline, distributed computing, web crawling, testing environments**.
  - ✅ **Ứng dụng serverless kết hợp với AWS Lambda hoặc Fargate để tối ưu chi phí**.
- 📌 **Không nên dùng nếu workload yêu cầu chạy liên tục hoặc có trạng thái (stateful applications)** như:
  - ❌ **Cơ sở dữ liệu quan trọng, web server chính, ứng dụng tài chính**.
  - ❌ **Ứng dụng đòi hỏi low-latency hoặc không thể bị gián đoạn**.

# **Kết luận**

| **Tính năng**         | **On-Demand**      | **Reserved Instances** | **Spot Instances**        |
| --------------------- | ------------------ | ---------------------- | ------------------------- |
| **Chi phí**           | Cao nhất           | Giảm tới 72%           | Rẻ hơn 90%                |
| **Cam kết**           | Không cần          | 1 hoặc 3 năm           | Không cam kết             |
| **Nguy cơ gián đoạn** | Không              | Không                  | Có thể bị thu hồi         |
| **Tính linh hoạt**    | Cao                | Thấp                   | Cao                       |
| **Workload phù hợp**  | Workload linh hoạt | Workload dài hạn       | Workload có thể gián đoạn |

👉 **Dùng Spot Instances nếu bạn cần tối ưu chi phí và có thể xử lý gián đoạn.**

👉 **Kết hợp Spot với On-Demand hoặc Reserved Instances để tối ưu chi phí và độ ổn định.**
