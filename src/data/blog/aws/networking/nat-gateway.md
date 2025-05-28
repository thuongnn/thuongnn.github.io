---
author: thuongnn
pubDatetime: 2023-05-15T15:30:45Z
title: "[AWS] NAT Gateway"
folder: "aws"
draft: false
tags:
  - AWS
  - Amazon Web Services
description: Tìm hiểu về NAT Gateway, dịch vụ cho phép các instance trong private subnet kết nối với internet.
---

Bài viết được tham khảo và tổng hợp lại từ Jayendra's Blog, xem bài viết gốc ở đây: https://jayendrapatil.com/aws-nat-gateway.

## Table of contents

- **AWS NAT (Network Address Translation)** là các thiết bị được triển khai trong public subnet, cho phép các instance trong private subnet kết nối với Internet nhưng ngăn chặn Internet khởi tạo kết nối với các instance.
- Các instance trong private subnet cần kết nối Internet để thực hiện cập nhật phần mềm hoặc truy cập các dịch vụ bên ngoài.
- Thiết bị NAT thực hiện cả chức năng dịch địa chỉ (address translation) và dịch cổng (port address translation - PAT).
- NAT instance giúp ngăn chặn các instance bị phơi bày trực tiếp ra Internet, tránh việc phải triển khai trong public subnet và gán Elastic IP cho tất cả các instance (Elastic IP là tài nguyên có giới hạn).
- Thiết bị NAT định tuyến lưu lượng từ private subnet tới Internet bằng cách thay thế địa chỉ IP nguồn bằng địa chỉ của nó và sau đó dịch ngược địa chỉ về địa chỉ IP private của các instance cho lưu lượng phản hồi.
- AWS cung cấp hai cách cấu hình NAT:
  - **NAT Gateway**: Dịch vụ do AWS quản lý.
  - **NAT Instance**: Tự cấu hình và quản lý.

# **NAT Gateway**

![1.png](@/assets/images/aws/networking/nat-gateway/1.png)

**NAT Gateway** là một dịch vụ NAT được AWS quản lý, cung cấp tính sẵn sàng cao hơn, băng thông lớn hơn, và yêu cầu ít nỗ lực quản trị hơn.

- Một NAT Gateway hỗ trợ băng thông 5 Gbps và tự động mở rộng lên đến 100 Gbps. Đối với các yêu cầu bùng nổ cao hơn, workload có thể được phân phối bằng cách chia tài nguyên vào nhiều subnet và tạo một NAT Gateway trong mỗi subnet.
- Public NAT Gateway được gắn với một địa chỉ Elastic IP duy nhất, và địa chỉ này không thể tách rời sau khi được tạo.
- Mỗi NAT Gateway được tạo trong một Availability Zone cụ thể và được triển khai với khả năng dự phòng trong zone đó.
- NAT Gateway hỗ trợ các giao thức TCP, UDP và ICMP.
- NAT Gateway không thể được liên kết với một Security Group. Bảo mật có thể được cấu hình trên các phiên bản trong các private subnet để kiểm soát lưu lượng.
- Network ACL (NACL) có thể được sử dụng để kiểm soát lưu lượng vào và ra khỏi subnet. NACL áp dụng cho lưu lượng của NAT Gateway, sử dụng các cổng từ 1024-65535.
- Khi được tạo, NAT Gateway sẽ nhận Elastic Network Interface, tự động được gán một địa chỉ IP riêng từ dải địa chỉ IP của subnet. Các thuộc tính của giao diện mạng này không thể thay đổi.
- NAT Gateway không thể gửi lưu lượng qua các VPC endpoints, VPN connections, AWS Direct Connect, hoặc VPC peering connections. Route table của private subnet cần được sửa đổi để định tuyến lưu lượng trực tiếp đến các thiết bị này.
- NAT Gateway sẽ ngắt kết nối nếu kết nối không hoạt động trong 350 giây hoặc lâu hơn. Để ngăn kết nối bị ngắt, cần tạo thêm lưu lượng trên kết nối hoặc bật tính năng TCP keepalive trên phiên bản với giá trị nhỏ hơn 350 giây.
- NAT Gateway hiện không hỗ trợ giao thức IPsec.
- NAT Gateway chỉ truyền lưu lượng từ một phiên bản trong subnet riêng tư ra internet.

# NAT Gateway vs NAT Instance

![2.png](@/assets/images/aws/networking/nat-gateway/2.png)
