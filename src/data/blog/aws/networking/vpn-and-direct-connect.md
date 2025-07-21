---
author: thuongnn
pubDatetime: 2023-05-12T14:30:45Z
modDatetime: 2025-05-29T02:30:41Z
title: "[AWS] VPN and Direct Connect"
folder: "aws"
draft: true
tags:
  - AWS
  - Amazon Web Services
description: Tìm hiểu về các phương thức kết nối an toàn đến AWS, bao gồm VPN và Direct Connect.
ogImage: ../../../../assets/images/aws/networking/vpn-and-direct-connect/1.png
---

Bài viết được tham khảo và tổng hợp lại từ Jayendra's Blog, xem bài viết gốc ở đây: https://jayendrapatil.com/aws-vpn-and-direct-connect.

## Table of contents

# Giới thiệu

- Các kết nối **VPN AWS** được sử dụng để **mở rộng các on-premises data centers tới AWS**. Kết nối VPN cung cấp các kết nối IPSec an toàn giữa data center hoặc branch office và các tài nguyên AWS.
- AWS Site-to-Site VPN, AWS Hardware VPN hoặc AWS Managed VPN
  - Kết nối có thể được thiết lập bằng cách tạo kết nối VPN IPSec, hardware VPN connection giữa VPC và remote network.
  - Ở phía AWS của kết nối VPN, một **Virtual Private Gateway (VGW)** cung cấp hai VPN endpoints cho việc chuyển đổi tự động khi gặp sự cố.
  - Ở phía khách hàng, một **customer gateway (CGW)** cần được cấu hình, đây là thiết bị vật lý hoặc ứng dụng phần mềm ở phía mạng từ xa của kết nối VPN.
- **AWS Client VPN**
  - AWS Client VPN là dịch vụ VPN quản lý dựa trên khách hàng, cho phép truy cập an toàn vào các tài nguyên AWS và tài nguyên ở on-premises network.
- **AWS VPN CloudHub:**
  - Đối với nhiều hơn một remote network, ví dụ như nhiều văn phòng chi nhánh, có thể tạo nhiều AWS hardware VPN connections qua VPC để enable giao tiếp giữa các mạng này.
- **AWS Software VPN:**
  - Một kết nối VPN có thể được tạo đến remote network bằng cách sử dụng một EC2 instance trong VPC chạy phần mềm VPN của bên thứ ba.
  - AWS không cung cấp hoặc duy trì các thiết bị phần mềm VPN của bên thứ ba. Tuy nhiên, có nhiều sản phẩm được cung cấp bởi các đối tác và cộng đồng mã nguồn mở.
- **AWS Direct Connect** cung cấp một dedicated private connection từ remote network tới VPC. Direct Connect có thể được kết hợp với một AWS hardware VPN connection để tạo ra một kết nối mã hóa IPSec.

# **VPN Components**

![1.png](@/assets/images/aws/networking/vpn-and-direct-connect/1.png)

- **Virtual Private Gateway – VGW**
  - Virtual Private Gateway (VGW) là thiết bị tập trung VPN ở phía AWS của kết nối VPN.
- **Customer Gateway – CGW**
  - Customer Gateway (CGW) là thiết bị vật lý hoặc ứng dụng phần mềm ở phía khách hàng của kết nối VPN.
  - Khi một kết nối **VPN tunnel** được tạo ra, VPN sẽ được kích hoạt khi có lưu lượng truy cập từ phía remote network của kết nối VPN.
  - Mặc định, VGW không phải là initiator; CGW phải kích hoạt các tunnels cho kết nối **Site-to-Site VPN** bằng cách tạo traffic và khởi xướng quá trình đàm phán **Internet Key Exchange (IKE)**.
  - Nếu kết nối VPN trải qua một khoảng thời gian không có hoạt động, thường là 10 giây (tùy theo cấu hình), tunnel có thể bị ngừng hoạt động. Để ngăn chặn điều này, có thể sử dụng network monitoring tool để tạo các gói keepalive, _ví dụ như sử dụng IP SLA_.
- **Transit Gateway**
  - Transit Gateway là một transit hub có thể được sử dụng để kết nối các VPC và on-premises networks.
  - Kết nối **VPN Site-to-Site** trên Transit Gateway có thể hỗ trợ traffic IPv4 hoặc IPv6 bên trong các VPN tunnels.
- Kết nối VPN Site-to-Site cung cấp **02** **VPN tunnel** giữa VGW hoặc Transit Gateway ở phía AWS và CGW ở phía on-premises.

# VPN Routing Options

- Đối với một kết nối VPN, bảng định tuyến (route table) của các subnet cần được cập nhật với loại định tuyến (static hoặc dynamic) mà bạn dự định sử dụng.
- Bảng định tuyến xác định nơi traffic mạng sẽ được chuyển hướng. Traffic dành cho các kết nối VPN phải được định tuyến đến virtual private gateway.
- Loại định tuyến có thể phụ thuộc vào cấu hình và kiểu máy của thiết bị CGW
  - **Static Routing**
    - Nếu thiết bị của bạn không hỗ trợ BGP, hãy chỉ định định tuyến tĩnh.
    - Sử dụng static routing, các routes (IP prefixes) có thể được chỉ định và định tuyến tới virtual private gateway.
    - Các thiết bị không hỗ trợ BGP cũng có thể thực hiện kiểm tra tình trạng thiết bị để hỗ trợ chuyển tiếp (failover) sang tunnel thứ hai khi cần.
  - **BGP Dynamic Routing**
    - Nếu thiết bị VPN hỗ trợ Border Gateway Protocol (BGP), hãy chỉ định dynamic routing cho kết nối VPN.
    - Khi sử dụng BGP device, không cần chỉ định các static routes cho kết nối VPN vì thiết bị sử dụng BGP để tự động phát hiện và quảng bá các routes của nó tới virtual private gateway.
    - Các thiết bị hỗ trợ BGP được khuyến khích vì giao thức BGP cung cấp các kiểm tra liveness mạnh mẽ có thể hỗ trợ chuyển tiếp (failover) sang VPB tunnel thứ hai nếu tunnel đầu tiên bị ngừng hoạt động.
- Chỉ các IP prefixes đã được virtual private gateway biết đến, thông qua việc quảng bá BGP hoặc static route entry, mới có thể nhận traffic từ VPC.
- Virtual private gateway không định tuyến bất kỳ traffic nào khác ngoài các quảng bá BGP, static route entry hoặc CIDR của attached VPC.

# VPN Route Priority

- Áp dụng quy tắc _Longest prefix match_.
- Nếu các prefixes giống nhau, VGW sẽ ưu tiên các routes theo thứ tự sau, từ ưu tiên cao nhất đến thấp nhất:
  - Các routes được quảng bá BGP từ kết nối AWS Direct Connect.
  - Các static routes được thêm thủ công cho kết nối VPN Site-to-Site.
  - Các routes được quảng bá BGP từ kết nối VPN Site-to-Site.
  - Prefix có AS PATH ngắn nhất sẽ được ưu tiên khi các prefixes giống nhau và mỗi kết nối VPN Site-to-Site sử dụng BGP.
  - Đường dẫn có giá trị multi-exit discriminator (MED) thấp nhất sẽ được ưu tiên khi AS PATH có độ dài bằng nhau và nếu AS đầu tiên trong AS_SEQUENCE là giống nhau trên các đường dẫn khác nhau.

# VPN Limitations

- Chỉ hỗ trợ IPSec tunnel mode. Transport mode hiện tại không được hỗ trợ.
- Chỉ hỗ trợ một VGW có thể được gắn vào một VPC tại một thời điểm.
- Không hỗ trợ lưu lượng IPv6 trên virtual private gateway.
- Không hỗ trợ Path MTU Discovery.
- Không hỗ trợ các CIDR block chồng lấn cho các mạng. Khuyến nghị sử dụng các CIDR block không chồng lấn.
- Không hỗ trợ transitive routing. Vì vậy, đối với traffic từ on-premises tới AWS thông qua virtual private gateway:
  - **Không hỗ trợ** kết nối Internet qua Internet Gateway
  - **Không hỗ trợ** kết nối Internet qua [NAT Gateway](https://www.notion.so/1593fa6ae483806fb810c213765ec338?pvs=21)
  - **Không hỗ trợ** truy cập tài nguyên VPC qua [VPC Peering](Virtual%20Private%20Network%20%E2%80%93%20VPC%201593fa6ae483806eaa13c20dcc38aafb/VPC%20Peering%2015a3fa6ae483803784d6ebf9712b44bf.md)
  - **Không hỗ trợ** truy cập S3, DynamoDB qua [VPC Gateway Endpoint](https://www.notion.so/15a3fa6ae48380a2a1d8f3e987f1a989?pvs=21)
  - Tuy nhiên, kết nối Internet qua NAT instance và VPC Interface Endpoint hoặc dịch vụ PrivateLink là có thể truy cập.
- Hiện tại AWS cung cấp băng thông tới 1.25Gbps.

# VPN Monitoring

- AWS Site-to-Site VPN tự động gửi thông báo đến AWS Health Dashboard.
- AWS Site-to-Site VPN được tích hợp với CloudWatch với các metrics sau:
  - **TunnelState**: Trạng thái của các tunnels.
    - Đối với các static VPNs, giá trị 0 chỉ ra DOWN và 1 chỉ ra UP.
    - Đối với VPN BGP, giá trị 1 chỉ ra ESTABLISHED và 0 được sử dụng cho tất cả các trạng thái khác.
    - Đối với cả hai loại VPN, các giá trị từ 0 đến 1 chỉ ra ít nhất một tunnel không UP.
  - **TunnelDataIn**: byte nhận ở phía AWS của kết nối qua VPN tunnel từ customer gateway.
  - **TunnelDataOut**: byte gửi từ phía AWS của kết nối qua VPN tunnel đến customer gateway

# VPN Connection Redundancy

![2.png](@/assets/images/aws/networking/vpn-and-direct-connect/2.png)

- **Kết nối VPN** được sử dụng để kết nối mạng của khách hàng với VPC.
- Mỗi kết nối VPN có hai _tunnel_ để đảm bảo kết nối trong trường hợp một trong các kết nối VPN không khả dụng, với mỗi _tunnel_ sử dụng một địa chỉ _Public IP_ của _virtual private gateway_ (VGW) duy nhất.
- Cả hai _tunnel_ nên được cấu hình để đảm bảo tính _redundant_.
- Khi một _tunnel_ không khả dụng, ví dụ khi đang bảo trì, _traffic_ sẽ tự động được chuyển hướng đến _tunnel_ còn lại của kết nối VPN cụ thể đó.
- Để bảo vệ khỏi mất kết nối trong trường hợp _customer gateway_ không khả dụng, có thể thiết lập một kết nối VPN thứ hai đến VPC và VGW thông qua một _customer gateway_ thứ hai.
- Bằng cách sử dụng các redundant VPN connections và CGWs, việc bảo trì trên một trong các _customer gateway_ có thể được thực hiện trong khi _traffic_ tiếp tục chảy qua kết nối VPN của _customer gateway_ thứ hai.
- **Kết nối VPN định tuyến động** sử dụng Giao thức Border Gateway (BGP) được khuyến nghị nếu có sẵn, để trao đổi thông tin định tuyến giữa các _customer gateway_ và _virtual private gateway._
- **Kết nối VPN định tuyến tĩnh** yêu cầu phải nhập các tuyến tĩnh cho mạng vào phía _customer gateway._
- Thông tin định tuyến được quảng bá qua BGP và các tuyến được nhập tĩnh cho phép các gateway ở cả hai phía xác định các _tunnel_ nào có sẵn và chuyển hướng _traffic_ nếu có sự cố xảy ra.

# Multiple Site-to-Site VPN Connections

![3.png](@/assets/images/aws/networking/vpn-and-direct-connect/3.png)

- VPC có một attached _virtual private gateway_ và remote network bao gồm một _customer gateway_, cần được cấu hình để kích hoạt kết nối VPN.
- Cần thiết lập định tuyến để mọi _traffic_ từ VPC hướng đến remote network được định tuyến tới _virtual private gateway_.
- Mỗi kết nối VPN có hai _tunnel_ liên kết với nó, có thể được cấu hình trên bộ định tuyến của customer, vì vậy không có _single point of failure_.
- Có thể tạo nhiều kết nối VPN tới một VPC duy nhất, và có thể cấu hình một _customer gateway_ thứ hai để tạo redundant connection tới cùng một địa điểm bên ngoài hoặc để tạo các kết nối VPN tới nhiều vị trí địa lý khác nhau.

# VPN CloudHub

- _VPN CloudHub_ có thể được sử dụng để cung cấp kết nối an toàn giữa nhiều on-premises sites nếu bạn có nhiều kết nối VPN.
- _VPN CloudHub_ hoạt động theo mô hình **hub-and-spoke** đơn giản, sử dụng _Virtual Private Gateway_ ở detached mode có thể sử dụng mà không cần VPC.
- Thiết kế này phù hợp với khách hàng có nhiều văn phòng chi nhánh và kết nối Internet hiện có, những người muốn triển khai một mô hình hub-and-spoke thuận tiện, có thể là chi phí thấp cho kết nối chính hoặc dự phòng giữa các văn phòng từ xa này.

![4.png](@/assets/images/aws/networking/vpn-and-direct-connect/4.png)

- Kiến trúc _VPN CloudHub_ với các đường chấm màu xanh chỉ ra việc định tuyến _traffic_ giữa các remote sites qua các kết nối VPN của chúng.
- _AWS VPN CloudHub_ yêu cầu một _virtual private gateway_ với nhiều _customer gateway._ Mỗi _customer gateway_ phải sử dụng một _Border Gateway Protocol (BGP)_ Autonomous System Number (ASN) duy nhất.
- Các _customer gateway_ quảng bá các routes thích hợp (BGP prefixes) qua các kết nối VPN của chúng. Các quảng bá routes được nhận và tái quảng bá tới mỗi _BGP peer_, cho phép mỗi site gửi và nhận dữ liệu từ các site khác. Các routes cho mỗi _spoke_ phải có ASN duy nhất và các site không được có các dải IP chồng lấn.
- Mỗi site cũng có thể gửi và nhận dữ liệu từ VPC như thể chúng đang sử dụng một kết nối VPN tiêu chuẩn.
- Các site sử dụng kết nối _AWS Direct Connect_ tới _virtual private gateway_ cũng có thể là một phần của _AWS VPN CloudHub._
- **Cấu hình AWS VPN CloudHub**
  - Có thể tạo nhiều _customer gateway_, mỗi cái với địa chỉ _public IP_ duy nhất của gateway và ASN.
  - Một kết nối VPN có thể được tạo từ mỗi _customer gateway_ tới một _virtual private gateway_ chung.
  - Mỗi kết nối VPN phải quảng bá các BGP routes cụ thể của mình. Điều này được thực hiện thông qua các câu lệnh mạng trong các tệp cấu hình VPN cho kết nối VPN.

# [**VPN vs Direct Connect**](https://jayendrapatil.com/aws-direct-connect-vs-vpn/)

![5.png](@/assets/images/aws/networking/vpn-and-direct-connect/5.png)
