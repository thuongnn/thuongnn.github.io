---
author: thuongnn
pubDatetime: 2023-04-01T15:30:45Z
modDatetime: 2025-05-29T02:30:41Z
title: "[AWS] EC2 Instance Lifecycle"
folder: "aws"
draft: true
tags:
  - AWS
  - Amazon Web Services
description: Tìm hiểu về vòng đời của EC2 instance, từ khởi tạo đến kết thúc và các trạng thái trung gian.
ogImage: ../../../../assets/images/aws/compute/ec2-instance-lifecycle/1.png
---

Bài viết được tham khảo và tổng hợp lại từ Jayendra's Blog, xem bài viết gốc ở đây: https://jayendrapatil.com/aws-ec2-instance-lifecycle.

![1.png](@/assets/images/aws/compute/ec2-instance-lifecycle/1.png)

AWS EC2 instances có vòng đời cụ thể với nhiều trạng thái khác nhau từ khi tạo đến khi bị xóa. Hiểu rõ về **vòng đời của EC2 instance** giúp bạn quản lý tài nguyên hiệu quả, tối ưu chi phí và đảm bảo hiệu suất ứng dụng.

## Table of contents

# **Các trạng thái trong vòng đời của EC2 Instance**

EC2 instance có thể trải qua nhiều trạng thái trong vòng đời, bao gồm:

| **Trạng thái**    | **Mô tả**                                       |
| ----------------- | ----------------------------------------------- |
| **Pending**       | Instance đang được khởi tạo.                    |
| **Running**       | Instance đang hoạt động và có thể nhận request. |
| **Stopping**      | Instance đang trong quá trình dừng.             |
| **Stopped**       | Instance đã dừng, có thể khởi động lại.         |
| **Shutting-down** | Instance đang bị xóa.                           |
| **Terminated**    | Instance đã bị xóa hoàn toàn.                   |

### **Chi tiết từng trạng thái:**

- 1️⃣ **Pending (Đang khởi tạo)**
  - Khi một EC2 instance được tạo, nó bắt đầu ở trạng thái **Pending**.
  - Trong trạng thái này, AWS đang **cấp phát tài nguyên**, như CPU, bộ nhớ, networking.
  - Khi instance sẵn sàng, nó chuyển sang **Running**.
- 2️⃣ **Running (Đang chạy)**
  - Instance đã được khởi động thành công và có thể bắt đầu nhận request.
  - Bạn có thể **kết nối SSH/RDP**, chạy ứng dụng và sử dụng tài nguyên AWS.
  - Trong trạng thái này, bạn **bị tính phí theo thời gian sử dụng**.
  - Có thể tắt instance bằng lệnh **Stop** hoặc **Terminate**.
- 3️⃣ **Stopping (Đang dừng)**
  - Khi một instance bị dừng, nó sẽ chuyển từ **Running** → **Stopping**.
  - AWS sẽ tắt hệ điều hành bên trong instance và đóng các kết nối.
  - Sau khi hoàn tất, instance chuyển sang trạng thái **Stopped**.
- 4️⃣ **Stopped (Đã dừng)**
  - Instance bị dừng sẽ không mất dữ liệu trên **EBS Volume** (nếu không được đánh dấu "Delete on Termination").
  - Bạn **không bị tính phí cho EC2 khi instance ở trạng thái này**, nhưng vẫn phải trả phí cho ổ đĩa EBS gắn kèm.
  - Instance có thể được khởi động lại bằng cách **Start**.
- 5️⃣ **Shutting-down (Đang xóa)**
  - Khi một instance bị xóa (Terminate), nó sẽ chuyển từ **Running** → **Shutting-down**.
  - AWS đang thực hiện quá trình thu hồi tài nguyên.
- 6️⃣ **Terminated (Đã bị xóa)**
  - Instance đã bị xóa hoàn toàn khỏi AWS.
  - **Không thể khôi phục instance đã bị Terminate**, trừ khi bạn có backup (AMI/Snapshot).

## **Tùy chọn dừng và xóa EC2 Instance**

| **Tùy chọn**           | **Mô tả**                                                                                      |
| ---------------------- | ---------------------------------------------------------------------------------------------- |
| **Stop Instance**      | Instance bị dừng nhưng vẫn giữ nguyên dữ liệu trên EBS. Có thể khởi động lại sau này.          |
| **Terminate Instance** | Instance bị xóa vĩnh viễn, không thể khôi phục, và mất dữ liệu trên EBS (nếu không có backup). |
| **Reboot Instance**    | Instance sẽ khởi động lại nhưng không mất dữ liệu.                                             |
| **Hibernate Instance** | Instance được tạm dừng và giữ nguyên trạng thái bộ nhớ RAM khi khởi động lại.                  |

### **Stop vs Terminate**

- Nếu bạn **Stop** một instance, bạn vẫn có thể **khởi động lại** mà không mất dữ liệu.
- Nếu bạn **Terminate**, instance sẽ **mất hoàn toàn**, bao gồm cả ổ đĩa EBS (nếu không có backup).

## **Hibernate Instance (Ngủ đông)**

**Hibernate** là trạng thái cho phép bạn tắt instance mà vẫn giữ nguyên trạng thái RAM khi khởi động lại.

- ✅ **Lợi ích:**
  - Instance không cần khởi động lại ứng dụng từ đầu.
  - Dữ liệu RAM được lưu vào EBS và khôi phục lại khi bật lên.
  - Giúp tiết kiệm chi phí khi không sử dụng, nhưng vẫn duy trì trạng thái ứng dụng.
- ❌ **Hạn chế:**
  - Chỉ hỗ trợ trên một số loại EC2 instance.
  - Yêu cầu EBS phải có đủ dung lượng để lưu trữ bộ nhớ RAM.
  - Không hỗ trợ Spot Instances.

## **Tóm tắt các trạng thái của EC2 Instance**

- **Khởi tạo**: `Pending` → `Running`
- **Dừng tạm thời**: `Stopping` → `Stopped` (có thể khởi động lại)
- **Xóa vĩnh viễn**: `Shutting-down` → `Terminated` (không thể khôi phục)
- **Ngủ đông**: `Hibernate` (giữ trạng thái RAM)

---

## **Khi nào nên Stop, Terminate hay Hibernate?**

| **Trường hợp**                                              | **Nên dùng Stop** | **Nên dùng Terminate** | **Nên dùng Hibernate** |
| ----------------------------------------------------------- | ----------------- | ---------------------- | ---------------------- |
| Cần tạm dừng để tiết kiệm chi phí nhưng vẫn giữ lại dữ liệu | ✅                | ❌                     | ✅                     |
| Cần xóa vĩnh viễn để giải phóng tài nguyên                  | ❌                | ✅                     | ❌                     |
| Muốn giữ nguyên trạng thái ứng dụng khi bật lại             | ❌                | ❌                     | ✅                     |
| Instance chỉ được dùng trong thời gian ngắn                 | ❌                | ✅                     | ❌                     |

👉 **Dùng Stop nếu muốn giữ lại dữ liệu để sử dụng sau này.**

👉 **Dùng Terminate nếu không cần nữa và muốn tiết kiệm chi phí.**

👉 **Dùng Hibernate nếu muốn bật lại nhanh mà không mất trạng thái ứng dụng.**
