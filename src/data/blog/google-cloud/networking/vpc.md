---
author: thuongnn
pubDatetime: 2022-10-05T20:11:22Z
title: "[Google Cloud] Tìm hiểu về VPC trong Networking"
featured: false
draft: false
tags:
  - Google Cloud
description: Tìm hiểu về VPC trong Google Cloud.
---

## Table of contents

# Giới thiệu - VPC là gì?

- Có thể hiểu đây là một mạng được tạo ra riêng biệt dành cho mỗi khách hàng trên Google Cloud, Network traffic bên trong VPC thì được tách biệt và nó không thể bị đọc được (not visible) bởi các VPC khác trong Google Cloud.
- Chúng ta có thể cấu hình được toàn bộ traffic đến và đi ra khỏi VPC.
- **(Best Practice)** Tạo toàn bộ tài nguyên GCP (ví dụ như compute, storage, databases) **trong một VPC**.
  - Đảm bảo an toàn các resources khỏi các truy cập chưa được xác thực
  - Bật secure communication giữa các cloud resources.
- VPC là **global resource** và chứa các subnets mạng của một hay nhiều Region. VPC resources có thể ở trong bất kỳ Region hay Zone.

## **VPC Subnets**

![](https://github.com/user-attachments/assets/1cba89d9-c306-4c81-a90f-38e71a1d54d8)

- Chúng ta có thể tạo các subnets khác nhau để dùng cho các public hay private resources trên GCP
  - Resources trong một public subnet thì có thể truy cập được từ bên ngoài internet.
  - Resources trong một private subnet thì không thể truy cập. từ bên ngoài internet.
  - Nhưng resources ở trong public subnet thì có thể nói chuyện được với các resouces khác trong private subnet.
- Mỗi một subnet mạng sẽ được tạo cho một Region.
- Ví dụ: **VPC** - demo-vpc ⇒ Subnets - region us-central1, europe-west1 hoặc us-west1,…

### Tạo các **VPCs và Subnets trên GCP**

- Mặc định trên mọi Projects trong GCP sẽ có một VPC gọi là **default VPC**.
- Chúng ta có thể tự tạo riêng một VPCs bằng cách sau:
  - **OPTION 1**: Auto mode VPC network:
    - Subnets mạng sẽ được tạo tự động trên mỗi Region.
    - Default VPC được tạo ra trên mỗi Project bởi chế độ Auto mode này.
  - **OPTION 2**: Custom mode VPC network:
    - Không có Subnets mạng nào được tự động tạo trong chế độ này.
    - Chúng ta hoàn toàn có thể control được Subnet và các range IP của nó.
    - Chế độ này được khuyến nghị cho môi trường Production.
- Lựa chọn khi tạo một subnet mạng:
  - Enable **Private Google Access** - cho phép VM kết nối tới các Google API sử dụng Private IP.
  - Enable **FlowLogs** - dùng để troubleshoot bất kỳ các issues nào liên quan đến network trong VPC.

### **CIDR (Classless Inter-Domain Routing) Blocks**

- Các resources trong một network sẽ sử dụng các địa chỉ IP tuần tự để có thể định tuyến một cách dễ dàng:
  - Ví dụ các resources trong một network cụ thể có thể sử dụng địa chỉ IP từ `69.208.0.0` đến `69.208.0.15`.
- Một **CIDR block** sẽ bao gồm một **starting IP address(`69.208.0.0`)** và một **range(`/28`)**
  - Ví dụ CIDR block `69.208.0.0/28` sẽ thể hiện cho các địa chỉ IP từ `69.208.0.0` đến `69.208.0.15` - tổng cộng có 16 địa chỉ IP.

### **Recommended CIDR Blocks - VPC Subnets**

- **Recommended CIDR Blocks**
  - Các địa chỉ Private IP thuộc tiêu chuẩn **RFC 1918**: `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`
  - Shared address space **RFC 6598**: `100.64.0.0/10`
  - IETF protocol assignments **RFC 6890**: `192.0.0.0/24`
- Các dải địa chỉ IP hạn chế - chúng ta không thể sử dụng các CIDR cho các VPC Subnets dưới đây:
  - Private Google Access-specific virtual IP addresses: `199.36.153.4/30`, `199.36.153.8/30`
  - Current (local) network **RFC 1122**: `0.0.0.0/8`
  - Local host **RFC 1122**: `127.0.0.0/8`
- (**REMEMBER**) Chúng ta có thể mở rộng CIDR Block của một Subnet (Secondary CIDR Block)

# **Firewall Rules**

Cấu hình Firewall Rules để control traffic ra vào của network, nó có những đặc điểm sau đây:

- Stateful
- Mỗi một Firewall Rule có thể cấu hình độ ưu tiên từ 0-65535 gán cho nó.
- 0 là độ ưu tiên cao nhất, 65535 là độ ưu tiên thấp nhất.
- Sẽ có các Firewall Rules mặc định với độ ưu tiên thấp nhất (65535):
  - Allow all egress
  - Deny all ingress
  - Các rules mặc định thì không thể bị xoá đi, thay vào đó chúng ta có thể đè rule đó bằng các định nghĩa mới rule mới có độ ưu tiên cao hơn (0-65534)
- Đối với Default VPC, sẽ có 04 rules được gán mặc định với độ ưu tiên 65534 là
  - Allow incoming traffic from VM instances in same network (**default-allow-internal**)
  - Allow Incoming TCP traffic on port 22 (SSH) **default-allow-ssh**
  - Allow Incoming TCP traffic on port 3389 (RDP) **default-allow-rdp**
  - Allow Incoming ICMP from any source on the network **default-allow-icmp**

## **Ingress and Egress Rules**

- **Ingress Rules**: Incoming traffic from outside to GCP targets
  - **Target (defines the destination)**: All instances or instances with TAG/SA
  - **Source (defines where the traffic is coming from)**: CIDR or All instances or instances with TAG/SA
- **Egress Rules**: Outgoing traffic to destination from GCP targets
  - **Target (defines the source)**: All instances or instances with TAG/SA
  - **Destination**: CIDR Block
- Chúng ta có thể định nghĩa thêm cho mỗi Firewall Rule:
  - **Priority** - Lower the number, higher the priority
  - **Action on match** - Allow or Deny traffic
  - **Protocol** - ex. TCP or UDP or ICMP
  - **Port** - Which port?
  - **Enforcement status** - Enable or Disable the rule

# **Shared VPC**

- Thường sử dụng trong kịch bản một tổ chức có nhiều GCP Projects, và chúng ta muốn các resources trong các Project khác nhau đó có thể nói chuyện được với nhau.
- Làm sao có thể cấu hình các resources ở những Projects khác nhau nói chuyện với nhau bằng Internal IPs một cách an toàn và hiệu quả? câu trả lời là **Shared VPC**
  - Tạo một organization hoặc shared folder level (Quyền truy cập cần thiết: Shared VPC Admin)
  - Cho phép VCP Network có thể được chia sẻ giữa các Projects trong cùng một organization.
  - Shared VPC sẽ bao gồm host project và nhiều service projects:
    - **Host Project** - bao gồm shared VPC network
    - **Service Projects** - được gắn tới host projects
- Lúc này Network administrators có trách nhiệm đối với Host project và các resources được quản lý bởi các người dùng khác trong các Service Projects.

# **VPC Peering**

- Thường được áp dụng trong kịch bản kết nối các VPC networks ở các organization khác nhau.
  - Các networks trong cùng một Project, ở các Projects khác nhau hay các Project ở các organizations khác nhau có thể được peering với nhau.
  - Tất cả các kết nối lúc này sẽ sử dụng địa chỉ internal IP
    - Đạt được hiệu quả cao bởi vì tất cả các kết nối lúc này nằm trong **Google network**.
    - Độ an toàn cao nhất bởi vì chúng **không thể truy cập được từ bên ngoài internet**.
    - **Không bị tính phí cho các data transfer** giữa các services.
  - (**REMEMBER**) Network administration không bị thay đổi khi peering:
    - Admin của một VPC sẽ không tự động gán Admin cho một peered network.

# **VPC Flow Logs**

- Đây là tính năng của VPC cho phép ghi lại toàn bộ network flow ra vào VM instances, bao gồm cả các instances được sử dụng như một GKE node.
- Các thông tin logs này có thể được sử dụng cho network monitoring, forensics, real-time security analysis, tối ưu,…
- Bật tính năng này lên bằng cách add thêm tham số `--enable-flow-logs` vào command khi tạo subnet.
