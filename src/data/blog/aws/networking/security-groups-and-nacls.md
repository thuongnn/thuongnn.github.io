---
author: thuongnn
pubDatetime: 2023-05-07T14:30:45Z
modDatetime: 2025-05-29T02:30:41Z
title: "[AWS] Security Groups and Network ACLs"
folder: "aws"
draft: false
tags:
  - AWS
  - Amazon Web Services
description: Tìm hiểu về hai lớp bảo mật mạng trong AWS, cách cấu hình và quản lý quyền truy cập vào tài nguyên.
ogImage: ../../../../assets/images/aws/networking/security-groups-and-nacls/1.png
---

Bài viết được tham khảo và tổng hợp lại từ Jayendra's Blog, xem bài viết gốc ở đây: https://jayendrapatil.com/aws-security-groups-and-nacls.

## Table of contents

# Giới thiệu

![1.png](@/assets/images/aws/networking/security-groups-and-nacls/1.png)

Trong một VPC, cả **Security Groups** và **Network ACLs (NACLs)** cùng hoạt động để xây dựng một lớp phòng thủ mạng đa tầng:

- **Security Groups**:
  - Đóng vai trò như một **virtual firewall** cho các **associated instances**.
  - Kiểm soát cả _inbound traffic_ và _outbound traffic_ ở cấp độ _instance_.
- **Network Access Control Lists (NACLs)**:
  - Hoạt động như một firewall cho các **associated subnets**.
  - Kiểm soát cả inbound và outbound traffic ở cấp độ _subnet_.

# **Security Groups**

- Hoạt động ở Instance level, không phải ở subnet level.
  - Mỗi instance trong một subnet có thể được gán một tập hợp Security Groups khác nhau.
  - Một instance có thể được gán tối đa 5 Security Groups, mỗi Security Group có thể chứa từ 50-60 rules.
- Hỗ trợ các rules riêng biệt cho inbound và outbound traffic, có thể thêm hoặc xóa các rules (ủy quyền hoặc thu hồi quyền truy cập) cho cả Inbound (ingress) và Outbound (egress) traffic đến instance.
  - Security Group **mặc định không cho phép traffic inbound từ bên ngoài** nhưng cho phép traffic inbound từ các instance có cùng Security Group.
  - Security Group **mặc định cho phép tất cả traffic outbound**.
  - New Security groups sẽ bắt đầu với một outbound rule cho phép tất cả traffic rời khỏi các instance.
- Chỉ có thể định nghĩa các **Allow rules**, không hỗ trợ **Deny rules**. Có thể cấp quyền truy cập cho một IP cụ thể, một dải CIDR, hoặc một Security Group khác trong VPC hoặc trong một peer VPC (yêu cầu VPC peering connection).
- Rule allow nhiều nhất sẽ được ưu tiên, Ví dụ: nếu có một rule allow truy cập TCP port 22 (SSH) từ IP 203.0.113.1 và một rule khác allow truy cập TCP port 22 từ mọi địa chỉ, thì mọi địa chỉ sẽ được quyền truy cập TCP port 22.
- **Mang tính chất Stateful**, phản hồi của traffic inbound đã được allow sẽ tự động được allow flow outbound mà không cần outbound rule, và ngược lại.
- Các instance được gán cùng một Security Group sẽ không thể giao tiếp với nhau trừ khi có allow traffic được add.
- Security Group được gán với ENI (network interfaces).
- Security Group được liên kết với instance và có thể thay đổi, thay đổi này sẽ áp dụng ngay lập tức cho tất cả các instance liên kết với Security Group đó.

# **Connection Tracking**

- Security Groups có tính chất Stateful vì chúng sử dụng Connection Tracking để theo dõi thông tin về traffic đến và đi từ instance.
- **Responses của inbound traffic được phép sẽ tự động flow outbound** từ instance mà không cần quy tắc outbound, và ngược lại.
- **Connection Tracking chỉ được duy trì khi không có Outbound rule rõ ràng cho một request Inbound** (và ngược lại).
- Tuy nhiên nếu có Outbound rule rõ ràng cho một request Inbound, traffic phản hồi sẽ được cho phép dựa trên quy tắc Outbound chứ không phải dựa vào thông tin Connection Tracking.
- **Tracking Flow trong trường hợp traffic không phải là giao thức TCP, UDP hay ICMP**:
  - Nếu một instance (host A) khởi tạo traffic đến host B và sử dụng giao thức khác ngoài TCP, UDP, hoặc ICMP. **Security Groups chỉ có thể theo dõi địa chỉ IP và protocol number** để cho phép traffic phản hồi từ phía host B.
  - Nếu host B khởi tạo traffic đến instance trong một request riêng biệt **trong vòng 600 giây** từ request hoặc response ban đầu, instance sẽ chấp nhận traffic này bất kể các quy tắc inbound của Security Group, vì nó được xem như traffic phản hồi.
  - Có thể kiểm soát hành vi này bằng cách sửa đổi các outbound rules của Security Group để chỉ cho phép một số loại traffic outbound nhất định. **Network ACLs (NACLs)** có thể được sử dụng thay thế ở cấp độ subnet. NACLs là **stateless**, vì vậy chúng không tự động cho phép traffic phản hồi.

# Network Access Control Lists – NACLs

- **Network ACLs (NACLs)** là một lớp bảo mật tùy chọn trong VPC, hoạt động như một firewall kiểm soát traffic vào và ra khỏi một hoặc nhiều subnet.
- NACLs được gán ở cấp **Subnet** và áp dụng cho tất cả các instance trong subnet đó.
- **Inbound và outbound rules riêng biệt**, mỗi rule có thể **Allow** hoặc **Deny traffic**.
  - **Default ACL** - mặc định cho phép tất cả traffic vào và ra.
  - **ACL mới tạo** - mặc định từ chối tất cả traffic vào và ra.
- **Cách gán NACL cho Subnet:**
  - Một subnet chỉ có thể được gán **1 NACL**.
  - Nếu không được gán rõ ràng, subnet sẽ tự động sử dụng **Default NACL**.
  - Một NACL có thể được gán cho nhiều subnet.
- **Cách hoạt động của NACLs**:
  - NACL là danh sách các rules được **đánh số thứ tự (Rule Number)**. Các rules được đánh giá theo thứ tự từ thấp đến cao.
    _Ví dụ: Nếu có **Rule No. 100** Allow All và **Rule No. 110** Deny All, thì Rule No. 100 sẽ được ưu tiên và traffic sẽ được Allow._
  - **Mang tính chất Stateless**, các phản hồi từ traffic được allow phải tuân theo outbound rule (và ngược lại).
    _Ví dụ: Nếu allow inbound SSH trên port 22 từ một địa chỉ IP cụ thể, bạn cần thêm một outbound rule để cho phép phản hồi từ traffic này._

# **Security Group vs NACLs**

![2.png](@/assets/images/aws/networking/security-groups-and-nacls/2.png)
