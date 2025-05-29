---
author: thuongnn
pubDatetime: 2023-05-05T14:20:45Z
modDatetime: 2025-05-29T02:05:26Z
title: "[AWS] Amazon Virtual Private Cloud (VPC)"
folder: "aws"
draft: false
tags:
  - AWS
  - Amazon Web Services
description: Tìm hiểu về dịch vụ mạng riêng ảo của AWS, cho phép tạo và quản lý mạng riêng biệt trong AWS Cloud.
---

Bài viết được tham khảo và tổng hợp lại từ Jayendra's Blog, xem bài viết gốc ở đây: https://jayendrapatil.com/aws-vpc.

## Table of contents

# VPC là gì?

![1.png](@/assets/images/aws/networking/vpc/1.png)

AWS VPC (Virtual Private Cloud) là một mạng ảo dành riêng cho tài khoản AWS, được cô lập logic với các mạng ảo khác trong môi trường AWS Cloud. Đây là một dịch vụ cung cấp nền tảng mạng ảo tùy chỉnh, với những điểm nổi bật sau:

- **Dịch vụ theo khu vực (Regional Service)**:
    - VPC là dịch vụ theo khu vực, có nghĩa là nó hoạt động trên tất cả các **Availability Zones (AZ)** trong một **Region**. Trong một VPC, bạn có thể tạo các **subnet**. Mỗi subnet phải gắn liền với một AZ cụ thể.
    - **Availability Zones** là các địa điểm độc lập và cô lập trong một **Region**, giúp tăng tính sẵn sàng và khả năng chịu lỗi cho các tài nguyên triển khai trong VPC.
- **Kiểm soát hoàn toàn**: VPC cho phép người dùng tự do quản lý môi trường mạng ảo của mình, bao gồm:
    - Lựa chọn phạm vi địa chỉ IP.
    - Tạo các subnet (mạng con).
    - Cấu hình bảng định tuyến (route tables) và cổng mạng (network gateways).
- **Hỗ trợ IPv4 và IPv6**: VPC hỗ trợ cả địa chỉ IPv4 và IPv6, giúp đảm bảo truy cập tài nguyên và ứng dụng một cách dễ dàng và an toàn hơn.
- **Kích thước VPC**
    - VPC cần một tập hợp địa chỉ IP dưới dạng **CIDR block** (Classless Inter-Domain Routing). Ví dụ: `10.0.0.0/16`, cho phép sử dụng 2^{16} = 65,536 địa chỉ IP.
    - Kích thước CIDR block được phép:
        - **/28 netmask** (tối thiểu, với 2^4 = 16 địa chỉ IP khả dụng)
        - **/16 netmask** (tối đa, với 2^{16} = 65,536 địa chỉ IP khả dụng)
    - CIDR block có thể được gán từ các địa chỉ IP **riêng (không thể định tuyến công khai)** như sau:
        - `10.0.0.0 – 10.255.255.255` (tiền tố `10/8`).
        - `172.16.0.0 – 172.31.255.255` (tiền tố `172.16/12`).
        - `192.168.0.0 – 192.168.255.255` (tiền tố `192.168/16`).
    - CIDR block sau khi được gán cho VPC **không thể thay đổi**.
      **Lưu ý**: Hiện tại, AWS đã hỗ trợ tính năng thay đổi kích thước VPC
    - Mỗi VPC là **riêng biệt** với các VPC khác được tạo bằng cùng một CIDR block, ngay cả khi chúng nằm trong cùng một tài khoản AWS.
- Kết nối giữa VPC và mạng công ty có thể được thiết lập. Tuy nhiên, các CIDR blocks không được phép trùng lặp. Ví dụ, VPC với CIDR `10.0.0.0/16` có thể giao tiếp với mạng công ty có CIDR `10.1.0.0/16`, nhưng kết nối sẽ bị ngắt nếu nó cố gắng kết nối với mạng công ty có CIDR `10.0.37.0/16` do địa chỉ IP bị trùng lặp.
- VPC cho phép bạn thiết lập các tùy chọn quyền sở hữu (tenancy) cho các instance được khởi chạy trong nó. Mặc định, tùy chọn quyền sở hữu là chia sẻ (shared). Nếu chọn tùy chọn dành riêng (dedicated), tất cả các instance trong VPC sẽ được khởi chạy trên phần cứng riêng biệt, ghi đè cài đặt quyền sở hữu của từng instance.
- Chỉ có thể xóa VPC sau khi:
    - Dừng tất cả các instance trong VPC.
    - Xóa tất cả các thành phần trong VPC, ví dụ: subnet, security group, network ACL, route table, Internet gateway, kết nối VPC peering, và tùy chọn DHCP.
- **VPC Peering** cung cấp một kết nối mạng giữa hai VPC (cùng hoặc khác tài khoản và khu vực) cho phép định tuyến lưu lượng giữa chúng bằng cách sử dụng địa chỉ IPv4 riêng tư hoặc địa chỉ IPv6.
- **NAT Gateway** cho phép các instance trong một subnet riêng kết nối với Internet nhưng ngăn chặn việc Internet khởi tạo kết nối với các instance.
- **VPC endpoints** cho phép tạo kết nối riêng tư giữa VPC và các dịch vụ AWS được hỗ trợ, cũng như các dịch vụ VPC endpoint do PrivateLink cung cấp, sử dụng địa chỉ IP riêng của nó.

# Subnet
## **Định nghĩa Subnet và phạm vi hoạt động**

- **Subnet chỉ thuộc một Availability Zone (AZ):**
    - Một AZ là một vị trí độc lập, được thiết kế để giảm thiểu ảnh hưởng của lỗi từ các AZ khác.
    - Subnet **không thể trải dài qua nhiều AZ**.
- Subnet có thể được cấu hình với **Internet Gateway (IGW)** để cho phép giao tiếp qua Internet hoặc với **Virtual Private Gateway (VPN)** để kết nối với mạng nội bộ của công ty.
- Subnet có thể là **Public** hoặc **Private**, tùy thuộc vào việc nó có kết nối Internet hay không, nghĩa là nó có thể định tuyến lưu lượng tới Internet thông qua IGW.
- Các instance trong **Subnet Public** cần được gán **Public IP** hoặc **Elastic IP** để có thể giao tiếp với Internet.
- Đối với các Subnet **không kết nối với Internet** nhưng định tuyến lưu lượng qua Virtual Private Gateway, chúng được gọi là **VPN-only Subnet**.
- Subnet có thể được cấu hình để tự động gán **Public IP** cho tất cả các instance được tạo bên trong nó theo mặc định. Tuy nhiên, cài đặt này có thể được thay đổi trong quá trình tạo instance.

## **Kích thước Subnet (Subnet Sizing)**

- **CIDR block** được gán cho Subnet có thể giống với CIDR của VPC. Trong trường hợp này, bạn chỉ có thể tạo một Subnet duy nhất trong VPC của mình.
- **CIDR block** được gán cho Subnet có thể là một **phân đoạn con** (subset) của CIDR VPC, điều này cho phép bạn tạo nhiều Subnet trong VPC.
- **CIDR block** gán cho Subnet không được phép **chồng lặp (overlapping)** với các CIDR khác.
- **Kích thước CIDR block** cho phép nằm trong khoảng:
    - **/28 netmask** (tối thiểu, với $2^4$ = 16 địa chỉ IP khả dụng)
    - **/16 netmask** (tối đa, với $2^{16}$ = 65,536 địa chỉ IP khả dụng)
- AWS **dự trữ 5 địa chỉ IP** (4 địa chỉ đầu tiên và 1 địa chỉ cuối cùng) trong mỗi Subnet. Những địa chỉ này không thể được sử dụng và không thể gán cho bất kỳ instance nào. Ví dụ, với một Subnet có **CIDR block** là `10.0.0.0/24`, 5 địa chỉ sau sẽ bị dự trữ:
    - `10.0.0.0`: Địa chỉ mạng.
    - `10.0.0.1`: Được AWS dự trữ cho router của VPC.
    - `10.0.0.2`: Được AWS dự trữ cho ánh xạ DNS do Amazon cung cấp.
    - `10.0.0.3`: Được AWS dự trữ cho mục đích sử dụng trong tương lai.
    - `10.0.0.255`: Địa chỉ phát sóng mạng. AWS không hỗ trợ phát sóng trong VPC, vì vậy địa chỉ này bị dự trữ.

## **Routing trong Subnet**

- Mỗi Subnet được liên kết với một **Route Table**:
    - Route Table kiểm soát lưu lượng vào/ra Subnet.
    - Ví dụ:
        - Subnet Public sẽ có một route để gửi lưu lượng ra Internet Gateway.
        - Subnet Private sẽ gửi lưu lượng qua NAT Gateway hoặc Virtual Private Gateway.

## **Bảo mật Subnet**

- **Security Groups**:
    - Hoạt động ở cấp độ instance.
    - Kiểm soát lưu lượng đến và đi dựa trên các quy tắc.
- **Network ACLs (NACLs)**:
    - Hoạt động ở cấp độ Subnet.
    - Kiểm soát lưu lượng vào/ra Subnet dựa trên các quy tắc cụ thể.

# VPC & Subnet Sizing
![2.png](@/assets/images/aws/networking/vpc/2.png)

- VPC hỗ trợ địa chỉ IPv4 và IPv6. Có kích thước CIDR block khác nhau cho mỗi loại.
- IPv6 CIDR block có thể tuỳ chọn liên kết với VPC.
- IPv4 CIDR block không thể thay đổi khi đã tạo (có thể tăng nhưng không thể giảm)
- Hạn chế:
    - Cho phép CIDR block size giữa `/28` netmask và `/16` netmask
    - CIDR block không được trùng lặp với bất kỳ CIDR block nào đã được liên kết với VPC.
    - CIDR block không được giống hoặc lớn hơn phạm vi CIDR của một tuyến trong bất kỳ bảng định tuyến VPC nào. Ví dụ, đối với CIDR block `10.0.0.0/24`, chỉ có thể liên kết các CIDR block nhỏ hơn như `10.0.0.0/25`.

# IP Addresses
Các instance được khởi tạo trong VPC có thể được gán các địa chỉ **Private IP**, **Public IP** và **Elastic IP**, và chúng là thuộc tính của **ENI** (Elastic Network Interface).

**Private IP:**

- **Private IP** không thể truy cập từ Internet và chỉ có thể được sử dụng để giao tiếp giữa các instance trong VPC.
- Tất cả các instance đều được gán một **Private IP**, trong phạm vi địa chỉ IP của **subnet**, cho **network interface** mặc định.
- **Primary IP** được liên kết với **network interface** suốt vòng đời của instance, ngay cả khi instance bị dừng và khởi động lại, và chỉ bị giải phóng khi instance bị xóa.
- Các địa chỉ **Private IP** bổ sung, được gọi là **secondary private IP**, có thể được gán cho các instance và có thể được chuyển từ **network interface** này sang **network interface** khác.

**Public IP:**

- **Public IP** có thể truy cập qua Internet và có thể được sử dụng để giao tiếp giữa các instance và Internet, hoặc với các dịch vụ AWS khác có public endpoints.
- Việc gán **Public IP** cho instance phụ thuộc vào việc tính năng cấp phát **Public IP addressing** có được bật cho **subnet** hay không.
- **Public IP** cũng có thể được gán cho instance bằng cách bật tính năng cấp phát **Public IP** khi tạo instance, điều này sẽ ghi đè thuộc tính cấp phát **Public IP** của **subnet**.
- **Public IP** được cấp phát từ nhóm địa chỉ IP của AWS và không liên kết với tài khoản AWS, do đó, nó sẽ được giải phóng khi instance bị dừng và khởi động lại hoặc bị xóa.

**Elastic IP:**

- **Elastic IP** là địa chỉ Public IP tĩnh, bền vững, có thể được gán và hủy gán cho instance khi cần.
- **Elastic IP** được cấp phát cho **VPC** và thuộc về tài khoản trừ khi bị giải phóng.
- Một **Network Interface** có thể được gán một **Public IP** hoặc một **Elastic IP**. Nếu bạn gán một instance đã có **Public IP** một **Elastic IP**, **Public IP** sẽ bị giải phóng.
- **Elastic IP** có thể được chuyển từ một instance sang instance khác, có thể ở cùng một **VPC** hoặc **VPC** khác trong cùng một tài khoản.
- **Elastic IP** sẽ bị tính phí nếu không sử dụng, tức là nếu nó không được gán hoặc được gán cho một instance đã dừng hoặc một **Network Interface** chưa gắn.

# Elastic Network Interface (ENI)

- Mỗi Instance được gắn với một **Elastic Network Interface** mặc định (Network Interface chính `eth0`) và không thể tách rời khỏi instance đó.
- ENI có thể bao gồm các thuộc tính sau:
    - Địa chỉ IP riêng chính (Primary private IP address)
    - Một hoặc nhiều địa chỉ IP riêng phụ (Secondary private IP addresses)
    - Một Elastic IP cho mỗi địa chỉ IP riêng
    - Một địa chỉ Public IP, có thể được tự động gán cho network interface của `eth0` khi bạn khởi tạo một instance, nhưng chỉ khi bạn tạo một network interface cho `eth0` thay vì sử dụng một ENI đã có sẵn.
    - Một hoặc nhiều **Security groups**
    - Địa chỉ MAC (MAC address)
    - Cờ kiểm tra nguồn/đích (Source/destination check flag)
    - Mô tả (Description)
- Các thuộc tính của ENI sẽ theo ENI khi nó được gắn hoặc tách khỏi một instance và được gắn lại với một instance khác. Khi một ENI được chuyển từ instance này sang instance khác, lưu lượng mạng sẽ được chuyển hướng đến instance mới.
- Nhiều ENI có thể được gắn với một instance và điều này hữu ích trong các trường hợp sử dụng sau:
    - Tạo một mạng quản lý.
    - Sử dụng các thiết bị mạng và bảo mật trong VPC của bạn.
    - Tạo các instance hai mạng với các workload/vai trò trên các subnet khác nhau.
    - Tạo giải pháp với ngân sách thấp nhưng có tính khả dụng cao.

# Route Tables

Bảng định tuyến (Route table) xác định các quy tắc, được gọi là các **routes**, quyết định lưu lượng mạng từ subnet sẽ được định tuyến đến đâu.

- Mỗi VPC có một bộ định tuyến ngầm định để định tuyến lưu lượng mạng.
- Mỗi VPC có một **Main Route table** (Bảng định tuyến chính) và có thể có nhiều bảng định tuyến tùy chỉnh (custom route tables) được tạo ra.
- Mỗi **Subnet** trong một VPC phải được liên kết với một bảng định tuyến duy nhất tại một thời điểm, trong khi một bảng định tuyến có thể có nhiều subnet được liên kết với nó.
- Nếu một **Subnet** không được liên kết rõ ràng với một bảng định tuyến, nó sẽ được liên kết ngầm định với bảng định tuyến chính.
- Mỗi bảng định tuyến đều chứa một **route local** cho phép giao tiếp trong một VPC và không thể sửa đổi hay xóa.
- Ưu tiên của các route được xác định bằng cách tìm kiếm route cụ thể nhất trong bảng định tuyến phù hợp với lưu lượng mạng.
- Các bảng định tuyến cần được cập nhật để xác định các route cho **Internet gateways**, **Virtual Private gateways**, **VPC Peering**, **VPC Endpoints**, **NAT Devices**, v.v.

# Internet Gateways – IGW

- **Internet gateway** là một thành phần VPC có khả năng mở rộng theo chiều ngang, dư thừa và có tính sẵn sàng cao, cho phép giao tiếp giữa các instance trong VPC và Internet.
- IGW không tạo ra rủi ro về tính sẵn sàng hoặc giới hạn băng thông đối với lưu lượng mạng.
- **Internet gateway** có hai mục đích:
    - Cung cấp một điểm đến trong các bảng định tuyến VPC cho lưu lượng mạng có thể định tuyến tới Internet.
    - Thực hiện dịch vụ **Network Address Translation (NAT)** cho các instance không được cấp **public IP address**.
- Để kích hoạt quyền truy cập Internet cho một Instance, cần thực hiện:
    - Gắn **Internet gateway** vào VPC.
    - Subnet cần có bảng định tuyến được liên kết với route trỏ tới Internet gateway.
    - Instance cần có **Public IP** hoặc **Elastic IP** được gán.
    - Các **Security Groups** và **NACLs** liên kết với Instance cần cho phép lưu lượng mạng liên quan. 

# Egress-only Internet gateway

- Egress-only Internet gateway hoạt động như một NAT gateway, nhưng dành cho lưu lượng IPv6.
- Egress-only Internet gateway là một thành phần VPC có khả năng mở rộng theo chiều ngang, dư thừa và có tính sẵn sàng cao, cho phép giao tiếp ra ngoài qua IPv6 từ các instance trong VPC tới Internet, và ngăn chặn Internet khởi tạo kết nối IPv6 với các instance.
- Egress-only Internet gateway chỉ được sử dụng cho lưu lượng IPv6. Để kích hoạt giao tiếp Internet chỉ outbound qua IPv4, sử dụng NAT gateway thay thế.

# Shared VPCs

- **Shared VPCs** cho phép nhiều tài khoản AWS tạo các tài nguyên ứng dụng của họ, chẳng hạn như EC2 instances, cơ sở dữ liệu RDS, Redshift clusters và AWS Lambda functions, vào các VPC được quản lý tập trung và chia sẻ.
- Trong mô hình này, tài khoản sở hữu VPC (chủ sở hữu) chia sẻ một hoặc nhiều subnet với các tài khoản khác (người tham gia) thuộc cùng tổ chức từ AWS Organizations.
- Sau khi subnet được chia sẻ, người tham gia có thể xem, tạo, chỉnh sửa và xóa các tài nguyên ứng dụng trong các subnet đã được chia sẻ với họ. Người tham gia không thể xem, chỉnh sửa hoặc xóa các tài nguyên thuộc về các người tham gia khác hoặc chủ sở hữu VPC.

# VPC Peering

![3.png](@/assets/images/aws/networking/vpc/3.png)

- VPC peering là một phương thức kết nối hai Virtual Private Cloud (VPC) lại với nhau trong cùng một môi trường hoặc giữa các tài khoản AWS khác nhau. Kết nối này cho phép các tài nguyên trong hai VPC giao tiếp trực tiếp với nhau qua các địa chỉ Private IP (IPv4 hoặc IPv6), mà không cần sử dụng internet, cổng VPN, hay thiết bị mạng vật lý.
- VPC peering connection
    - Có thể thiết lập giữa các VPC trong cùng tài khoản của bạn hoặc với một VPC thuộc tài khoản AWS khác, trong cùng hoặc khác region.
    - Là mối quan hệ **1-1** giữa hai VPC.
    - Hỗ trợ intra và inter-region peering connections.
- Với VPC peering:
    - Các instance trong mỗi VPC có thể giao tiếp với nhau như thể chúng nằm trong cùng một mạng.
    - AWS sử dụng hạ tầng sẵn có của VPC để tạo kết nối peering; đây không phải là gateway hay kết nối VPN, và không phụ thuộc vào phần cứng vật lý riêng biệt.
    - Không có **single point of failure** hoặc **bandwidth bottleneck** trong quá trình giao tiếp.
    - Tất cả inter-region traffic đều được mã hóa, không có single point of failure hoặc bandwidth bottleneck. Traffic luôn được truyền qua mạng nội bộ toàn cầu của AWS (**AWS Global Backbone**) và không đi qua public internet, giúp giảm thiểu các mối đe dọa như khai thác lỗ hổng thông thường và tấn công DDoS.
- **VPC Peering** không phát sinh bất kỳ chi phí riêng nào cho việc thiết lập kết nối. Tuy nhiên, có **tính** **phí truyền dữ liệu** (data transfer charges) áp dụng cho lưu lượng truyền qua kết nối VPC Peering.

## **VPC Peering Connectivity**

- Để tạo một kết nối VPC Peering, Owner của **requester VPC** sẽ gửi một yêu cầu đến Owner của **accepter VPC**. **Accepter VPC** có thể thuộc cùng tài khoản hoặc ở tài khoản AWS khác.
- Sau khi **Accepter VPC** chấp nhận yêu cầu kết nối peering, kết nối sẽ được kích hoạt.
- Cần **cập nhật thủ công route table** trên cả hai VPC để cho phép traffic truyền qua.
- Các **security groups** trên các instance phải được cấu hình để cho phép traffic đến và đi từ các VPC đã kết nối.

## VPC Peering Limitations & Rules

- Kết nối VPC Peering không thể được thiết lập nếu các VPC có các dải địa chỉ IPv4 hoặc IPv6 **trùng lặp hoặc khớp nhau**.
- Một VPC không có quyền truy cập vào bất kỳ VPC nào khác mà VPC được peering với nó có kết nối, ngay cả khi các kết nối đó nằm trong cùng một tài khoản AWS.
- Không hỗ trợ định tuyến **edge-to-edge** thông qua gateway hoặc Private Connection.
- Trong một kết nối VPC Peering, các VPC không có quyền truy cập vào bất kỳ kết nối nào khác mà VPC được peering có, và ngược lại. Những kết nối mà VPC được peering có thể bao gồm:
    - **Kết nối VPN** hoặc **AWS Direct Connect** tới mạng doanh nghiệp.
    - **Kết nối internet** thông qua Internet Gateway.
    - **Kết nối internet** trong private subnet thông qua [NAT device](https://www.notion.so/1593fa6ae483806fb810c213765ec338?pvs=21).
    - **Kết nối ClassicLink** tới một EC2-Classic instance.
    - **Endpoint của VPC** tới một dịch vụ AWS, ví dụ: Endpoint tới S3.
- Kết nối VPC Peering bị giới hạn về số lượng **active** và **pending** peering connections mà bạn có thể thiết lập trên mỗi VPC.
- Chỉ có thể thiết lập **một kết nối peering** giữa cùng hai VPC tại một thời điểm (phải tạo kết nối peering riêng biệt cho mỗi cặp VPC, không thể thiết lập nhiều kết nối peering giữa cùng một cặp VPC cùng lúc.)
- **Jumbo frames** (là các gói dữ liệu mạng có kích thước lớn hơn gói dữ liệu chuẩn) được hỗ trợ cho các kết nối peering trong cùng một region.
- Một **placement group** có thể trải rộng qua các VPC đã peering trong cùng một region. Tuy nhiên, bạn sẽ không có **full-bisection bandwidth** giữa các instance trong các VPC đã peering.
- Inter-region VPC peering connections:
    - **Maximum Transmission Unit (MTU)** qua một kết nối peering giữa các khu vực là 1500 byte. **Jumbo frames** không được hỗ trợ.
    - Không thể tạo **security group rule** tham chiếu đến **security group** của VPC peer.

## VPC Peering Troubleshooting

- Kiểm tra để đảm bảo kết nối VPC Peering đã được kích hoạt và đang hoạt động.
- Đảm bảo rằng các **route table** được cập nhật đúng để kết nối với dải địa chỉ IP của các VPC đã peering qua cổng gateway thích hợp.
- Kiểm tra bảng NACL để đảm bảo các quy tắc ALLOW cho phép traffic mạng cần thiết.
- Kiểm tra các rule trong security group của các VPC để đảm bảo chúng cho phép giao tiếp mạng giữa các VPC đã peering.
- Kiểm tra VPC flow logs để đảm bảo lưu lượng không bị từ chối vì các quyền của security groups hoặc network ACLs.
- Sử dụng các công cụ như **traceroute** (Linux) hoặc **tracert** (Windows) để kiểm tra các firewall rules như **iptables** (Linux) hoặc **Windows Firewall** (Windows).

## VPC Peering Architecture

![4.png](@/assets/images/aws/networking/vpc/4.png)

- Việc sử dụng **VPC Peering** có thể giúp **tạo một single point of contact** cho các dịch vụ giữa các VPC. Điều này rất hữu ích khi chúng ta cần kết nối và chia sẻ tài nguyên giữa các VPC mà không cần phải thiết lập nhiều kết nối VPN riêng biệt.
- VPC Peering cũng có thể giúp **giới hạn số lượng kết nối VPN** bằng cách chỉ sử dụng một **kết nối VPN duy nhất** cho toàn bộ kết nối đến một **tài khoản** hoặc **VPC**. Điều này làm giảm độ phức tạp trong việc quản lý kết nối và cải thiện tính bảo mật khi không cần mở nhiều kết nối VPN.

## **VPC Peering vs Transit Gateway**

| **Tiêu chí** | **VPC Peering** | **Transit VPC** | **Transit Gateway** |
| --- | --- | --- | --- |
| Kiến trúc | Full mesh - One-to-One mapping | VPN dựa trên hub và spoke | VPN dựa trên hub và spoke, có thể kết nối với các TGW khác |
| Kết nối Hybrid | Không hỗ trợ - Chỉ VPC đến VPC | Hỗ trợ | Hỗ trợ |
| Độ phức tạp | Tăng theo số lượng VPC | Khách hàng cần duy trì instance EC2/HA | AWS quản lý dịch vụ, tăng theo số lượng Transit Gateway |
| Transitive Routing | Không hỗ trợ | Hỗ trợ | Hỗ trợ |
| Khả năng mở rộng | 125 kết nối Peers/VPC (thay đổi theo thời gian) | Phụ thuộc vào virtual router/EC2 | 5000 kết nối mỗi Region |
| Segmentation | Security groups | Customer managed | Transit Gateway route tables |
| Độ trễ | Thấp nhất | Thêm độ trễ do mã hóa VPN | Thêm độ trễ do các hops Transit Gateway |
| Giới hạn băng thông | Không có giới hạn | Phụ thuộc vào băng thông của instance EC2 | Đến 50 Gbps (burst/attachment) |
| Visibility | VPC Flow Logs | VPC Flow Logs và CloudWatch Metrics | Transit Gateway Network Manager, VPC Flow Logs, CloudWatch Metrics |
| Cross-referencing Security Group | Hỗ trợ | Không hỗ trợ | Không hỗ trợ |
| Chi phí | Data transfer | Chi phí theo EC2 instance, VPN tunnels và dữ liệu | Chi phí theo từng kết nối và dữ liệu chuyển |

# VPC Security

- Trong một VPC, cả *Security Groups* và *Network ACLs (NACLs)* cùng nhau giúp xây dựng một lớp phòng thủ mạng.
- **Security Groups**: Hoạt động như một tường lửa ảo cho các *instances* được liên kết, kiểm soát cả traffic *inbound* và *outbound* ở cấp độ *instance*.
- **Network Access Control Lists (NACLs)**: Hoạt động như một tường lửa cho các *subnets* được liên kết, kiểm soát cả traffic *inbound* và *outbound* ở cấp độ *subnet*.

# VPC Flow logs

- **VPC Flow Logs** giúp thu thập thông tin về IP traffic đi đến và từ các *network interfaces* trong VPC và có thể hỗ trợ giám sát traffic hoặc xử lý các vấn đề kết nối.
- Dữ liệu *Flow log* có thể được đẩy lên *CloudWatch Logs*, S3, và *Kinesis Data Firehose*.
- Flow log có thể được tạo cho toàn bộ VPC, các *subnets*, hoặc mỗi *network interface*. Nếu được kích hoạt, toàn bộ các *network interfaces* trong tài nguyên đó sẽ được giám sát.
- Flow log có thể được cấu hình để thu thập loại traffic (accepted traffic, rejected traffic, hoặc tất cả traffic).
- Flow logs không thu thập các luồng log thời gian thực cho các *network interfaces*.
- Dữ liệu *Flow log* được thu thập ngoài đường truyền traffic mạng, vì vậy không ảnh hưởng đến network throughput hoặc độ trễ mạng.
- Flow logs có thể được tạo cho các *network interfaces* được tạo bởi các dịch vụ AWS khác, ví dụ như ELB, RDS, ElastiCache, Redshift, và WorkSpaces.
- **Flow logs không thu thập traffic sau:**
    - Traffic được tạo ra bởi các instances khi chúng liên lạc với máy chủ DNS của Amazon.
    - Traffic được tạo ra bởi một instance Windows cho việc kích hoạt giấy phép Amazon Windows.
    - Traffic đến và đi từ địa chỉ IP `169.254.169.254` cho *instance metadata*.
    - Traffic đến và đi từ địa chỉ IP `169.254.169.123` cho *Amazon Time Sync Service*.
    - DHCP traffic.
    - Mirrored traffic.
    - Traffic đến và đi từ địa chỉ IP dự phòng cho VPC router mặc định.
    - Traffic giữa *endpoint network interface* và *Network Load Balancer network interface*.
- **Xử lý sự cố traffic flow:**
    - Nếu *ACCEPT* theo sau bởi *REJECT*, lưu lượng vào đã được chấp nhận bởi *Security Groups* và *ACLs*, nhưng bị từ chối bởi *NACLs* ở phía outbound.
    - Nếu *REJECT*, lưu lượng vào đã bị từ chối bởi *Security Groups* hoặc *NACLs*.
