---
author: thuongnn
pubDatetime: 2023-07-16T14:30:45Z
title: "[AWS] EC2 Instance Store"
draft: false
tags:
  - AWS
  - Amazon Web Services
description: Tìm hiểu về lưu trữ cục bộ của EC2 instance, phù hợp cho dữ liệu tạm thời và hiệu suất cao.
---
Bài viết được tham khảo và tổng hợp lại từ Jayendra's Blog, xem bài viết gốc ở đây: https://jayendrapatil.com/aws-ec2-instance-store. 

## Table of contents


# EC2 Instance Store

![1.png](@/assets/images/storage/ec2-instance-store-storage/1.png)

- Cung cấp bộ nhớ tạm thời (Ephemeral) dạng block-level cho EC2 instance.
- Được đặt trên các ổ đĩa vật lý gắn trực tiếp vào máy chủ.
- Bao gồm một hoặc nhiều instance store volumes được hiển thị dưới dạng block devices.
- Kích thước instance store thay đổi theo loại instance.
- Các volume instance store có tên dưới dạng `ephemeral[0-23]`, bắt đầu từ `ephemeral0`.
- Mỗi instance có instance store riêng, nhưng hệ thống đĩa được chia sẻ giữa các instance trên cùng một máy chủ.
- Phù hợp để lưu trữ tạm thời các dữ liệu thay đổi thường xuyên như bộ nhớ đệm (cache), dữ liệu tạm thời, hoặc dữ liệu được nhân bản trên nhiều instance như các web server load-balanced.
- Cung cấp hiệu suất I/O ngẫu nhiên rất cao và là lựa chọn tốt cho các ứng dụng cần độ trễ thấp nhưng không yêu cầu dữ liệu tồn tại sau khi instance bị terminate hoặc có thể tận dụng kiến trúc chịu lỗi (fault-tolerant).

# **Instance Store Lifecycle**

- Dữ liệu trong Instance Store phụ thuộc vào vòng đời của instance mà nó gắn vào.
- Dữ liệu vẫn tồn tại khi instance được reboot.
- **Dữ liệu sẽ mất** nếu:
    - Ổ đĩa vật lý bên dưới bị lỗi.
    - Instance bị terminate.
    - Instance hibernate.
    - Instance bị stop (trong trường hợp instance EBS-backed có gắn instance store volumes).
- Khi instance bị stop, hibernate hoặc terminate, toàn bộ dữ liệu trong instance store sẽ bị reset.
- Nếu tạo một AMI từ một instance có instance store volume, dữ liệu trong instance store **sẽ không được bảo toàn**.

# Instance Store Volumes

- **Dung lượng và phần cứng** của instance store phụ thuộc vào loại instance.
- Instance store volumes **đã bao gồm** trong chi phí theo giờ của instance.
- Một số loại instance sử dụng **SSD** để cung cấp hiệu suất I/O ngẫu nhiên cực cao.
- SSD là lựa chọn phù hợp khi cần **độ trễ thấp**, nhưng **không cần lưu trữ dữ liệu vĩnh viễn** hoặc hệ thống có kiến trúc chịu lỗi.

# So sánh **EBS** và **Instance Store**

| Đặc điểm | **EBS (Elastic Block Store)** | **Instance Store** |
| --- | --- | --- |
| **Loại lưu trữ** | Lưu trữ **bền vững** (Persistent) | Lưu trữ **tạm thời** (Ephemeral) |
| **Tính khả dụng** | **Độc lập** với vòng đời instance, có thể tách ra và gắn vào instance khác | Gắn cố định với instance, **mất dữ liệu khi instance bị dừng, hibernation hoặc terminate** |
| **Hiệu suất I/O** | Hiệu suất ổn định, có thể tăng dung lượng và điều chỉnh IOPS | IOPS rất cao, phù hợp với **low-latency storage** |
| **Khả năng mở rộng** | **Có thể mở rộng** bằng cách tăng dung lượng hoặc thay đổi loại volume | Không thể mở rộng, cố định theo loại instance |
| **Chi phí** | **Tính phí theo dung lượng sử dụng** (theo GB và IOPS) | **Bao gồm trong giá của instance** |
| **Tốc độ khởi tạo** | Khi tạo từ snapshot, dữ liệu sẽ được tải xuống từ S3 theo nhu cầu (lazy loading) | Sẵn sàng sử dụng ngay sau khi instance khởi chạy |
| **Hỗ trợ Snapshot** | **Có thể tạo snapshot**, giúp backup và restore dữ liệu dễ dàng | **Không hỗ trợ snapshot** |
| **Hỗ trợ Multi-Attach** | Hỗ trợ Multi-Attach trên **Provisioned IOPS SSD (io1, io2)** | Không hỗ trợ |
| **Dùng làm Boot Volume** | **Có thể làm boot volume** (root volume) | **Chỉ hỗ trợ một số AMI đặc biệt** |
| **Trường hợp sử dụng** | **Cần lưu trữ lâu dài**, như database, filesystem, logs, ứng dụng quan trọng | **Dữ liệu tạm thời, cache, buffer, swap space**, hoặc hệ thống có fault-tolerance |

👉 **Khi nào chọn EBS?**

- Khi cần lưu trữ **dữ liệu bền vững**, không mất khi reboot hoặc terminate instance.
- Khi cần **backup, restore**, hoặc **di chuyển dữ liệu giữa các AZ/Region**.
- Khi chạy database hoặc workload yêu cầu **IOPS ổn định**.

👉 **Khi nào chọn Instance Store?**

- Khi cần **hiệu suất đọc/ghi rất cao với độ trễ thấp**.
- Khi **dữ liệu không quan trọng** hoặc đã có cơ chế **replication giữa nhiều instance**.
- Khi dùng làm **cache, buffer, scratch data** hoặc hệ thống **load-balanced web servers**.
