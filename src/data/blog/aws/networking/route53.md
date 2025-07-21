---
author: thuongnn
pubDatetime: 2023-05-10T14:20:45Z
modDatetime: 2025-05-29T02:06:28Z
title: "[AWS] Amazon Route 53"
folder: "aws"
draft: true
tags:
  - AWS
  - Amazon Web Services
description: Tìm hiểu về dịch vụ DNS quản lý tên miền của AWS, cung cấp khả năng định tuyến và cân bằng tải toàn cầu.
ogImage: https://techblogbuilder.com/wp-content/uploads/sites/4/2021/06/techblogbuilder-home.png
---

Bài viết được tham khảo và tổng hợp lại từ Jayendra's Blog, xem bài viết gốc ở đây: https://jayendrapatil.com/aws-route53.

## Table of contents

# Giới thiệu

![1.png](@/assets/images/aws/networking/route53/1.png)

- **Route 53** là một dịch vụ **DNS** web có tính sẵn sàng cao và khả năng mở rộng.
- **Route 53** cung cấp ba chức năng chính:
  - **Domain registration**
  - **Domain Name System (DNS) service**
    - Ví dụ add record [**www.example.com**](http://www.example.com/) phân giải thành địa chỉ **IP** `192.0.2.1`.
    - Responds các DNS queries thông qua mạng lưới authoritative DNS servers toàn cầu, giúp giảm độ trễ.
    - Có thể chuyển hướng Internet traffic đến **CloudFront**, **Elastic Beanstalk**, **ELB** hoặc **S3**. Không tính phí đối với các DNS queries tới những tài nguyên này.
  - **Health Checking**
    - Có thể monitor sức khỏe của các tài nguyên như web và email servers.
    - Gửi các yêu cầu tự động qua Internet tới ứng dụng để kiểm tra xem nó có thể truy cập, có sẵn và hoạt động bình thường không.
    - Có thể cấu hình các cảnh báo **CloudWatch** cho các health checks để gửi thông báo khi tài nguyên không còn khả dụng.
    - Có thể được cấu hình để chuyển hướng Internet traffic ra khỏi các tài nguyên không còn khả dụng.
  - **Security**
    - Hỗ trợ cả **DNSSEC** cho domain registration và ký **DNSSEC signing**.

# Supported DNS Resource Record Types

- **A (Address) Format** là một IPv4 address theo dạng decimal notation, ví dụ: `192.0.2.1`.
- **AAAA Format** là một IPv6 address theo định dạng colon-separated hexadecimal.
- **CNAME Format** có cùng định dạng như một tên miền:
  - DNS protocol không cho phép tạo bản ghi **CNAME** cho top node trong DNS namespace, còn được gọi là **zone apex**. Ví dụ, với tên miền `example.com`, zone apex là `example.com`, không thể tạo bản ghi **CNAME** cho `example.com`, nhưng có thể tạo bản ghi **CNAME** cho `www.example.com`, `newproduct.example.com`, v.v.
  - Nếu một bản ghi **CNAME** được tạo cho một subdomain, thì không thể tạo bất kỳ bản ghi tài nguyên nào khác cho subdomain đó. Ví dụ, nếu tạo bản ghi **CNAME** cho `www.example.com`, không thể tạo các bản ghi tài nguyên khác có tên `www.example.com`.
- **MX (Mail Exchange)** **Format** chứa decimal number đại diện cho priority của bản ghi MX, và tên miền của email server.
- **NS (Name Server)** **Format** xác định name servers cho hosted zone. Giá trị của bản ghi **NS** là domain name of a name server.
- **PTR Format**: Giá trị của bản ghi **PTR** có định dạng giống như tên miền.
- **SOA (Start of Authority)** **Format** cung cấp thông tin về một tên miền và Amazon Route 53 hosted zone.
- **SPF (Sender Policy Framework)** **Format**:
  - Bản ghi **SPF** trước đây được sử dụng để xác minh danh tính của người gửi các tin nhắn email, tuy nhiên hiện nay không được khuyến khích sử dụng.
  - Thay vì sử dụng bản ghi **SPF**, nên sử dụng bản ghi **TXT** chứa giá trị áp dụng.
- **SRV** **Format**: Giá trị của bản ghi **SRV** bao gồm bốn giá trị phân tách bằng dấu cách. Ba giá trị đầu tiên là các số thập phân đại diện cho priority, weight và port. Giá trị thứ tư là tên miền, ví dụ: **`10 5 80 hostname.example.com`**.
- **TXT (Text)** **Forma** chứa một danh sách các chuỗi được bao bởi dấu ngoặc kép, phân tách bằng dấu cách. Mỗi chuỗi có tối đa 255 ký tự. Ngoài các ký tự được phép unescaped trong tên miền, dấu cách cũng được phép trong các chuỗi **TXT**.

# Alias Resource Record Sets

- **Route 53** hỗ trợ các alias resource record, cho phép định tuyến các truy vấn đến một CloudFront distribution, Elastic Beanstalk, ELB, một S3 bucket được cấu hình làm trang web tĩnh, hoặc một bản ghi tài nguyên Route 53 khác.
- Alias records không phải là chuẩn trong DNS RFC và là một phần mở rộng của **Route 53** đối với chức năng DNS.
- Alias records tương tự như bản ghi **CNAME** và luôn có loại **A** hoặc **AAAA**.
- Alias records có thể được tạo cả cho **root domain** hoặc **apex domain**, chẳng hạn như `example.com`, và cho các **subdomains**, chẳng hạn như `www.example.com`. Bản ghi **CNAME** chỉ có thể được sử dụng cho subdomains.
- **Route 53** tự động nhận diện các thay đổi trong các resource record mà alias records tham chiếu tới. Ví dụ, đối với một trang web trỏ đến một **load balancer**, nếu IP của **load balancer** thay đổi, các thay đổi đó sẽ tự động được phản ánh trong các DNS answers mà không cần thay đổi các resource record trong hosted zone.
- Alias resource record không hỗ trợ **TTL** hoặc **Time to Live** nếu nó trỏ đến [\*\*CloudFront](https://jayendrapatil.com/aws-cloudfront/) distribution**, **ELB**, hoặc **S3 bucket**. Thay vào đó, TTL của các tài nguyên này (như TTL của **CloudFront**, **ELB**, hoặc **S3\*\*) sẽ được sử dụng.
- Alias records miễn phí khi truy vấn và không phát sinh bất kỳ phí nào.
- Alias record supported targets:
  - **Elastic Load Balancers**
  - **CloudFront distributions**
  - **API Gateway**
  - **Elastic Beanstalk**
  - **S3 Website**
  - **Global Accelerator**
  - **VPC Interface Endpoints**
  - **Route 53 record trong cùng hosted zone**
- Alias record không được hỗ trợ cho:
  - **EC2 DNS**
  - **RDS endpoints**

# Route 53 Alias vs CNAME

![2.png](@/assets/images/aws/networking/route53/2.png)

# Route 53 Hosted Zone

- **Hosted Zone** là một container chứa các bản ghi, bao gồm thông tin về cách định tuyến traffic cho một domain (ví dụ như `example.com`) và tất cả các subdomain của nó (ví dụ như `www.example.com`, `retail.example.com`, và `seattle.accounting.example.com`).
- Một **Hosted Zone** có tên giống như tên miền tương ứng.
- **Routing Traffic to the Resources**:
  - Tạo một **hosted zone** với một trong hai loại hosted zone: **public hosted zone** hoặc **private hosted zone**:
    - **Public Hosted Zone** – dùng để định tuyến internet traffic đến các tài nguyên cho một domain cụ thể và các subdomain của nó.
    - **Private Hosted Zone** – dùng để định tuyến traffic trong một **VPC**.
  - Tạo các **record** trong hosted zone.
    - Các **record** xác định nơi để định tuyến traffic cho mỗi domain hoặc subdomain.
    - Tên của mỗi bản ghi trong hosted zone phải kết thúc bằng tên của hosted zone.
- Đối với các **public/private** và **private Hosted Zones** có thể có overlapping namespaces, **Route 53 Resolvers** sẽ định tuyến traffic tới bản ghi cụ thể nhất.
- **IAM permissions** chỉ áp dụng ở cấp độ **Hosted Zone**.

# Route 53 Health Checks

Đọc thêm [ở đây](https://jayendrapatil.com/aws-route-53/#:~:text=Hosted%20Zone%20level-,Route%2053%20Health%20Checks,-Route%2053%20health).

# Route 53 Routing Policies

AWS Route 53 cung cấp nhiều chính sách định tuyến DNS:

- **Simple Routing**: Định tuyến cơ bản cho một tài nguyên.
- **Weighted Routing**: Phân phối lưu lượng dựa trên trọng số.
- **Latency-based Routing**: Định tuyến tới vùng có độ trễ thấp nhất.
- **Failover Routing**: Hỗ trợ chuyển đổi dự phòng (active-passive).
- **Geolocation Routing**: Định tuyến theo vị trí người dùng.
- **Geoproximity Routing**: Định tuyến dựa trên khoảng cách giữa người dùng và tài nguyên.
- **Multivalue Routing**: Trả về nhiều IP đã được kiểm tra sức khỏe.

Chi tiết thêm tại: [AWS Route 53 Routing Policy](https://jayendrapatil.com/aws-route-53-routing-policy/).

# Route 53 Resolver

- **Route 53 Resolver** cung cấp khả năng phân giải DNS tự động trong VPC.
- **Mặc định**, Resolver trả lời các truy vấn DNS cho tên miền trong VPC như EC2 hay ELB.
- Resolver sẽ truy cập các **public name servers** bên ngoài AWS để tìm kiếm thông tin DNS nếu truy vấn không thuộc VPC hoặc không nằm trong phạm vi các dịch vụ AWS.
- **Hạn chế**: On-premises không thể phân giải DNS Route 53 và ngược lại.
- Có thể cấu hình phân giải DNS giữa VPC và on-premises qua **Direct Connect** hoặc **VPN**.
- Resolver mang tính **regional**.
- Sử dụng inbound/outbound forwarding, cần tạo **Resolver endpoint** trong VPC.
  Để chuyển tiếp DNS từ VPC vào hoặc ra khỏi mạng khác (ví dụ on-premises), cần tạo **Resolver endpoint** trong VPC. Endpoint này chỉ định IP để tiếp nhận hoặc gửi truy vấn DNS.
- Khi tạo Resolver endpoint, Resolver tự động thiết lập **Elastic Network Interfaces (ENI)** trên VPC. Mỗi ENI tương ứng với một IP được cấu hình và đóng vai trò trong việc chuyển tiếp truy vấn DNS

### **Inbound Endpoint – Forward DNS queries từ On-premise tới AWS**

![3.png](@/assets/images/aws/networking/route53/3.png)

- Các **DNS resolvers** trên mạng **on-premises** có thể chuyển tiếp truy vấn DNS đến **Resolver** trong một VPC được chỉ định.
- Điều này giúp các DNS resolvers dễ dàng **phân giải tên miền** cho tài nguyên AWS như **EC2 instances** hoặc các bản ghi trong **Route 53 private hosted zone**.

### Outbound Endpoint – forward queries từ AWS VPC tới **On**-premise

![4.png](@/assets/images/aws/networking/route53/4.png)

- **Route 53 Resolver** có thể được cấu hình để chuyển tiếp các truy vấn DNS nhận được từ **EC2 instances** trong VPC tới **DNS resolvers** trên **on-premises networks**.
  - Để chuyển tiếp các truy vấn cụ thể, tạo các **Resolver rules** để chỉ định:
    - **Tên miền** cho các truy vấn cần chuyển tiếp (ví dụ: `example.com`).
    - **Địa chỉ IP** của các DNS resolvers trên mạng on-premises.
  - Nếu truy vấn khớp với nhiều quy tắc (ví dụ: `example.com`, `acme.example.com`), **Resolver** sẽ chọn quy tắc khớp **chính xác nhất** (`acme.example.com`) và chuyển tiếp truy vấn đến IP tương ứng.

# Route 53 Split-view (Split-horizon) DNS

**Route 53 Split-view DNS** cho phép sử dụng **cùng một tên miền** để phân biệt phiên bản nội bộ và công khai của một trang web.

- Cả **private** và **public hosted zone** có thể được duy trì với cùng tên miền.
- Đảm bảo tính năng **DNS resolution** và **DNS hostnames** được enable trên source VPC.
- **Kết quả truy vấn** sẽ phụ thuộc vào nguồn yêu cầu:
  - **Từ trong VPC** sẽ trả về kết quả từ private hosted zone.
  - **Từ bên ngoài** sẽ trả về kết quả từ public hosted zone.

# Route 53 DNSSEC

- **DNSSEC** (Domain Name System Security Extensions) là một giao thức bảo mật DNS giúp bảo vệ tên miền khỏi các cuộc tấn công giả mạo DNS (man-in-the-middle).
- DNSSEC chỉ hoạt động cho các **public hosted zones**.
- Route 53 hỗ trợ DNSSEC signing và đăng ký DNSSEC cho tên miền.
- Khi bật DNSSEC, **Route 53** thiết lập một **chain of trust** từ TLD registry đến máy chủ tên chính thức.
- Route 53 tạo **key-signing key (KSK)** sử dụng khóa quản lý của khách hàng trong **AWS KMS**.
- Key phải đáp ứng các yêu cầu:
  - Phải ở khu vực **US East (N. Virginia)**.
  - Phải là khóa đối xứng **ECC_NIST_P256**.

# Route 53 Resolver DNS Firewall

- **Route 53 Resolver DNS Firewall** cung cấp bảo vệ cho các yêu cầu DNS ra ngoài từ VPC và có thể giám sát và kiểm soát các tên miền mà các ứng dụng có thể truy vấn.
- DNS Firewall có thể filter và điều chỉnh traffic DNS ra ngoài cho VPC.
- Các filtering rules có thể được tạo ra trong các DNS Firewall rule groups và liên kết với VPC.
- **DNS Firewall** giúp ngăn chặn việc **exfiltration dữ liệu DNS**, khi kẻ tấn công sử dụng truy vấn DNS để đưa dữ liệu ra ngoài VPC.
- Có thể cấu hình DNS Firewall để:
  - Từ chối truy cập vào các tên miền xấu và cho phép tất cả các truy vấn khác đi qua, hoặc
  - Từ chối tất cả các tên miền ngoại trừ những tên miền mà bạn tin cậy.
- DNS Firewall là tính năng của **Route 53 Resolver** và không yêu cầu cấu hình Resolver bổ sung.
- **Firewall Manager** có thể được sử dụng để cấu hình và quản lý các DNS Firewall rule group cho các VPC trong tổ chức.

# Route 53 Logging

- **DNS Query Logging** cung cấp thông tin như các yêu cầu domain hoặc subdomain, thời gian yêu cầu, loại bản ghi DNS, mã phản hồi DNS, và vùng Route 53 đã trả lời yêu cầu.
- **DNS Query Logs** được gửi tới CloudWatch Logs và chỉ có sẵn cho các hosted zones công khai.
- **Resolver Query Logging** ghi lại các truy vấn DNS từ VPC đã chỉ định, tài nguyên on-premises sử dụng endpoint Resolver inbound, và các truy vấn qua outbound Resolver endpoint.
- Các bản ghi sẽ được gửi tới CloudWatch Logs, S3, hoặc Kinesis Data Firehose.
