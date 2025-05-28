---
author: thuongnn
pubDatetime: 2023-05-09T11:45:22Z
title: "[AWS] Elastic Load Balancing"
folder: "aws"
draft: false
tags:
  - AWS
  - Amazon Web Services
description: Tìm hiểu về dịch vụ cân bằng tải của AWS, giúp phân phối lưu lượng truy cập đến các instance một cách hiệu quả.
---

Bài viết được tham khảo và tổng hợp lại từ Jayendra's Blog, xem bài viết gốc ở đây: https://jayendrapatil.com/aws-elastic-load-balancing.

## Table of contents

# AWS Application Load Balancer -ALB

![1.png](@/assets/images/aws/networking/load-balancer/1.png)

- Application Load Balancer hoạt động ở layer 7 (application layer) cho phép định nghĩa các routing rules dựa trên nội dung giữa nhiều dịch vụ hoặc container chạy trên một hoặc nhiều EC2 instances.
- Load balancer có thể tự động scale khi traffic truy cập đến ứng dụng thay đổi theo thời gian.
- Hỗ trợ health checks, được sử dụng để giám sát tình trạng của các registered targets, đảm bảo load balancer chỉ gửi yêu cầu đến các healthy targets.

## Application Load Balancer Components

![2.png](@/assets/images/aws/networking/load-balancer/2.png)

**Application Load Balancer (ALB) Components trong AWS** bao gồm các thành phần chính sau:

### 1. **Load Balancer**

- Đây là điểm đầu vào (entry point) cho tất cả traffic.
- ALB phân phối traffic đến các mục tiêu (targets) như EC2 instances, containers, hoặc địa chỉ IP dựa trên các quy tắc (rules) được thiết lập.
- Hỗ trợ giao thức **HTTP** và **HTTPS**.

### 2. **Listener**

- Là thành phần chịu trách nhiệm lắng nghe các yêu cầu trên một **port** cụ thể và **protocol** được chỉ định.
- Listener chứa các quy tắc (rules) để định tuyến traffic đến target group dựa trên các điều kiện như URL path, HTTP header, hoặc method.

### 3. **Target Group**

- Là nhóm các mục tiêu (targets) mà ALB gửi traffic đến, chẳng hạn như EC2 instances, IP addresses, hoặc containers.
- Một target group có thể được liên kết với một hoặc nhiều listeners.
- Health checks được thiết lập trên từng target group để đảm bảo chỉ các healthy targets nhận traffic.

### 4. **Targets (Mục tiêu)**

- Là các tài nguyên nhận traffic từ ALB, bao gồm EC2 instances, IP addresses, hoặc ECS tasks.
- Targets phải được đăng ký trong một target group để nhận traffic từ ALB.
- Một target có thể được sử dụng trong nhiều target groups.

### 5. **Rules (Quy tắc)**

- Các quy tắc được xác định trong listener, cho phép định tuyến traffic dựa trên các điều kiện cụ thể. Các điều kiện có thể bao gồm:
  - `host-header`
  - `http-request-method`
  - `path-pattern`
  - `source-ip`
  - `http-header`
  - `query-string`
- Một listener có thể có nhiều quy tắc và mỗi quy tắc sẽ định tuyến traffic đến một target group cụ thể.

### 6. **Health Checks**

- ALB thực hiện các health checks để kiểm tra tình trạng của các targets trong target group.
- Nếu một target không vượt qua health check, ALB sẽ ngừng gửi traffic đến target đó.
- Health checks có thể được cấu hình riêng cho từng target group với các thông số như **timeout**, **interval**, và **unhealthy threshold**.

## Application Load Balancer Benefits

- **Hỗ trợ định tuyến dựa trên đường dẫn (Path-based routing)**:
  Các quy tắc của listener có thể được cấu hình để chuyển tiếp yêu cầu dựa trên URL trong yêu cầu. Điều này cho phép cấu trúc ứng dụng thành các dịch vụ nhỏ hơn (microservices) và định tuyến yêu cầu đến đúng dịch vụ dựa trên nội dung của URL.
- **Hỗ trợ định tuyến yêu cầu đến nhiều dịch vụ trên một EC2 instance**:
  Điều này được thực hiện bằng cách đăng ký instance với nhiều port sử dụng **Dynamic Port Mapping**.
- **Hỗ trợ containerized applications**:
  Dịch vụ EC2 Container Service (ECS) có thể chọn một port chưa được sử dụng khi sắp xếp một task và đăng ký task đó với target group sử dụng cổng này, giúp sử dụng hiệu quả cụm máy chủ.
- **Hỗ trợ giám sát trạng thái của từng dịch vụ một cách độc lập**:
  Các health checks được định nghĩa ở mức target group và nhiều số liệu của CloudWatch cũng được báo cáo ở mức target group.
- **Tích hợp với Auto Scaling**:
  Gắn một target group vào Auto Scaling group cho phép mở rộng hoặc thu nhỏ từng dịch vụ một cách linh hoạt dựa trên nhu cầu.

# Application Load Balancer Features

- **Hỗ trợ giao thức**:
  - Cân bằng tải cho các ứng dụng sử dụng giao thức HTTP và HTTPS (Secure HTTP).
  - Hỗ trợ **HTTP/2** với khả năng tích hợp sẵn; các client hỗ trợ HTTP/2 có thể kết nối qua TLS.
  - Hỗ trợ **WebSockets** và **Secure WebSockets**.
- **Request Tracing**:
  - Tự động hỗ trợ request tracing để theo dõi yêu cầu HTTP từ client đến target hoặc các dịch vụ khác.
  - ALB thêm hoặc cập nhật header `X-Amzn-Trace-Id` khi nhận yêu cầu từ client, và các dịch vụ khác cũng có thể cập nhật header này.
- **Sticky Sessions (Session Affinity)**:
  - Hỗ trợ sticky sessions bằng cách sử dụng cookies do ALB tạo ra, giúp định tuyến các yêu cầu từ cùng một client đến cùng một target.
- **SSL Termination**:
  - Hỗ trợ SSL Termination trên ALB trước khi chuyển yêu cầu đến target.
  - Có thể cài đặt SSL certificate trên ALB.
  - Hỗ trợ nhiều SSL certificate cho cùng một miền.
- **Tính năng Layer 7**:
  - Hỗ trợ các header **X-Forwarded-For** để xác định địa chỉ IP, cổng và giao thức thực của client.
- **Khả năng mở rộng và hiệu suất**:
  - Tự động mở rộng khả năng xử lý yêu cầu theo lưu lượng traffic đến.
  - Hỗ trợ **Hybrid Load Balancing**, cho phép thêm các targets từ cả VPC và on-premises vào cùng một target group.
- **Khả dụng cao (High Availability)**:
  - Cho phép cấu hình nhiều Availability Zones (AZs) để phân phối traffic, đảm bảo tính sẵn sàng cao.
- **Bảo mật**:
  - Tích hợp với **AWS Certificate Manager (ACM)** để dễ dàng quản lý SSL/TLS certificate.
  - Hỗ trợ **Security Groups** để kiểm soát traffic đến và đi từ ALB.
  - Tích hợp với **AWS WAF** để bảo vệ ứng dụng web khỏi các cuộc tấn công.
- **Logging và monitoring**:
  - Cung cấp **Access Logs**, lưu trữ trên S3 để phân tích.
  - Tích hợp với **CloudWatch** để cung cấp các số liệu như **request counts**, **error counts**, **error types** và **request latency**.
  - Tích hợp với **CloudTrail** để theo dõi lịch sử các API calls liên quan đến ALB.
- **Tính năng khác**:
  - **Cross-zone Load Balancing**: Hỗ trợ cân bằng tải giữa các AZ theo mặc định.
  - **IPv6**: Hỗ trợ địa chỉ IPv6 cho ALB hướng ra Internet.
  - **Connection Idle Timeout**: Đóng kết nối nếu không có dữ liệu gửi hoặc nhận trong thời gian chờ (idle timeout).
  - **Delete Protection**: Ngăn ngừa việc xóa ALB nhầm lẫn.
- **Hạn chế**:
  - **Back-end Server Authentication (MTLS)** không được hỗ trợ.

# Application Load Balancer Listeners

- Listener là một quá trình kiểm tra các yêu cầu kết nối, sử dụng giao thức và cổng đã cấu hình.
- Listener hỗ trợ giao thức HTTP và HTTPS với các cổng từ 1 đến 65535.
- **SSL Termination**:
  - ALB hỗ trợ **SSL Termination** cho các listener HTTPS, giúp giảm tải công việc mã hóa và giải mã, để các target có thể tập trung vào công việc chính của chúng.
  - Listener HTTPS phải có ít nhất một SSL certificate trên listener.
- **WebSockets và HTTP/2**:
  - Hỗ trợ **WebSockets** cho cả listener HTTP và HTTPS (Secure WebSockets).
  - Hỗ trợ **HTTP/2** cho các listener HTTPS.
  - Có thể gửi tối đa **128 requests** song song qua một kết nối HTTP/2.
  - ALB chuyển đổi các yêu cầu **HTTP/2** này thành các yêu cầu **HTTP/1.1** riêng biệt và phân phối chúng tới các healthy target trong target group sử dụng thuật toán round-robin.
  - **HTTP/2** sử dụng front-end connections hiệu quả hơn, giúp giảm số lượng kết nối giữa client và load balancer.
  - Tính năng **server-push** của HTTP/2 không được hỗ trợ.
- **Listener Rules**:
  - Mỗi listener có một **quy tắc mặc định**, và có thể tùy chọn định nghĩa thêm các quy tắc khác.
  - Mỗi quy tắc bao gồm **priority**, **action**, **host condition** (tùy chọn) và **path condition** (tùy chọn).
    - **Priority** - Các quy tắc được đánh giá theo thứ tự ưu tiên, từ giá trị thấp nhất đến cao nhất. Quy tắc mặc định có độ ưu tiên thấp nhất
    - **Action** - Mỗi hành động quy tắc có một loại và một target group. Hiện tại, loại hành động duy nhất được hỗ trợ là **forward**, điều này giúp chuyển tiếp yêu cầu tới target group. Có thể thay đổi target group cho một quy tắc bất cứ lúc nào.
    - **Condition** - Có hai loại điều kiện quy tắc: **host** và **path**. Khi điều kiện của một quy tắc được thỏa mãn, hành động của quy tắc sẽ được thực hiện.
  - **Host Condition (Định tuyến theo tên miền)**:
    - Các **host condition** có thể được sử dụng để định nghĩa các quy tắc chuyển tiếp yêu cầu tới các target group khác nhau dựa trên tên miền trong **host header**.
    - Điều này cho phép hỗ trợ nhiều tên miền sử dụng một ALB, ví dụ: `orders.example.com`, `images.example.com`, `registration.example.com`.
    - Mỗi **host condition** có một tên miền duy nhất.
  - **Path Condition (Định tuyến theo đường dẫn)**:
    - Các **path condition** có thể được sử dụng để định nghĩa các quy tắc chuyển tiếp yêu cầu tới các target group khác nhau dựa trên URL trong yêu cầu.
    - Mỗi path condition có một mẫu đường dẫn duy nhất, ví dụ: `example.com/orders, example.com/images`, `example.com/registration`.
    - Nếu URL trong yêu cầu trùng khớp hoàn toàn với path pattern trong listener rule, yêu cầu sẽ được định tuyến theo quy tắc đó.

# Application Load Balancer Pricing

- **Phí được tính theo mỗi giờ hoặc phần giờ mà ALB đang chạy và số lượng Load Balancer Capacity Units (LCU) được sử dụng mỗi giờ.**
- **LCU** là một chỉ số mới để xác định mức giá của ALB.
- **LCU** định nghĩa tài nguyên tối đa mà ALB sử dụng trong bất kỳ một trong các chiều (new connections, active connections, bandwidth và rule evaluations) khi xử lý lưu lượng truy cập.

# AWS Classic Load Balancer vs Application Load Balancer vs Network Load Balancer

![3.png](@/assets/images/aws/networking/load-balancer/3.png)

- Elastic Load Balancing hỗ trợ 3 loại load balancer sau:
  - Classic Load Balancer – CLB
  - Application Load Balancer – ALB
  - Network Load Balancer – NLB
- Usage patterns
  - **Classic Load Balancer**
    - Cung cấp khả năng cân bằng tải cơ bản giữa nhiều EC2 instance và hoạt động ở cả Layer 4 và Layer 7.
    - Được thiết kế cho các ứng dụng được xây dựng trong mạng EC2-Classic.
    - Lý tưởng cho việc cân bằng tải đơn giản traffic giữa nhiều EC2 instance.
  - **Application Load Balancer**
    - Phù hợp với kiến trúc microservices hoặc container-based, nơi cần định tuyến traffic đến nhiều dịch vụ hoặc cân bằng tải qua nhiều cổng trên cùng một EC2 instance.
    - Hoạt động ở Layer 7, định tuyến traffic đến các mục tiêu – EC2 instances, containers, IP address và Lambda functions – dựa trên nội dung của request.
    - Lý tưởng cho việc cân bằng tải nâng cao của traffic HTTP và HTTPS, cung cấp khả năng định tuyến yêu cầu tiên tiến phục vụ cho các kiến trúc ứng dụng hiện đại, bao gồm microservices và container-based applications.
    - Đơn giản hóa và cải thiện tính bảo mật của ứng dụng bằng cách đảm bảo luôn sử dụng các cipher và giao thức SSL/TLS mới nhất.
  - **Network Load Balancer**
    - Hoạt động ở Layer 4, định tuyến traffic đến các mục tiêu – EC2 instances, microservices và containers – trong VPC dựa trên IP protocol data.
    - Lý tưởng cho việc cân bằng tải của cả traffic TCP và UDP.
    - Có khả năng xử lý hàng triệu yêu cầu mỗi giây trong khi duy trì độ trễ cực thấp.
    - Được tối ưu hóa để xử lý các mẫu traffic đột ngột và biến động, đồng thời sử dụng một **static IP address** duy nhất cho mỗi AZ (Availability Zone).
    - Tích hợp với các dịch vụ AWS phổ biến khác như Auto Scaling, ECS, CloudFormation và AWS Certificate Manager (ACM).
  ***
  - **Khuyến nghị của AWS:**
    - Sử dụng **Application Load Balancer** cho Layer 7.
    - Sử dụng **Network Load Balancer** cho Layer 4 khi làm việc với VPC.
      ![4.png](@/assets/images/aws/networking/load-balancer/4.png)

## Tính năng chung

### Giải thích một số term

- **Slow Start**
  - Slow Start cho phép các backend targets nhận dần dần request traffic, thay vì nhận ngay lập tức toàn bộ traffic sau khi được đăng ký vào target group. Điều này giúp hệ thống "khởi động" một cách ổn định.
  - **Lợi ích**
    - Giảm áp lực tải đột ngột cho các backend servers.
    - Đặc biệt hữu ích cho các ứng dụng cần "warm-up" (nạp trước dữ liệu hoặc cache).
- **Static IP & Elastic IP**
  - **`Static IP`**: **NLB** cung cấp một **Static IP** cho mỗi Availability Zone (AZ). Static IP này không thay đổi, giúp đơn giản hóa cấu hình DNS và firewall rules.
  - **`Elastic IP`**: \***\*Với **NLB\*\*, bạn có thể chỉ định Elastic IP cho mỗi AZ. Elastic IP là một địa chỉ IP cố định, có thể gán lại cho các resources khác nếu cần.
- **Connection Draining**
  - Connection Draining đảm bảo các yêu cầu đang xử lý (in-flight requests) được hoàn thành trước khi backend target bị loại bỏ khỏi target group.
  - **Lợi ích**
    - Tránh gián đoạn dịch vụ khi bạn cập nhật hoặc gỡ bỏ backend servers.
    - Cho phép backend servers xử lý xong các kết nối hiện tại.
- **Zonal Isolation**
  - Zonal Isolation đảm bảo rằng một **Availability Zone (AZ)** có thể hoạt động độc lập mà không bị ảnh hưởng bởi các AZ khác.
  - Hỗ trợ của NLB
    - Chỉ **NLB** hỗ trợ Zonal Isolation.
    - Nếu một AZ gặp sự cố, NLB tự động chuyển lưu lượng sang các AZ khác khỏe mạnh.

### Tổng hợp chung

| **Tính năng**                 | **Classic ELB**        | **ALB**                | **NLB**               |
| ----------------------------- | ---------------------- | ---------------------- | --------------------- |
| **Host-based Routing**        | ❌                     | ✅                     | ❌                    |
| **Path-based Routing**        | ❌                     | ✅                     | ❌                    |
| **Slow Start**                | ❌                     | ✅                     | ❌                    |
| **Static & Elastic IP**       | ❌                     | ❌                     | ✅                    |
| **Connection Draining**       | ✅                     | ✅                     | ✅                    |
| **Idle Connection Timeout**   | 60 giây (có chỉnh sửa) | 60 giây (có chỉnh sửa) | Không chỉnh sửa được  |
| **PrivateLink**               | ❌                     | ❌                     | ✅                    |
| **Zonal Isolation**           | ❌                     | ❌                     | ✅                    |
| **Deletion Protection**       | ❌                     | ✅                     | ✅                    |
| **Preserve Source IP**        | ❌                     | ❌                     | ✅ (native support)   |
| **Health Checks**             | ✅                     | Có cải tiến            | ✅                    |
| **WebSockets**                | ❌                     | ✅                     | ✅                    |
| **Cross-zone Load Balancing** | Tắt mặc định           | Bật mặc định           | Tắt mặc định (có phí) |
| **Sticky Sessions**           | ✅ (cookie)            | ✅ (cookie)            | ✅ (hash table)       |

## **Bảo mật**

| **Tính năng**                      | **Classic ELB** | **ALB** | **NLB** |
| ---------------------------------- | --------------- | ------- | ------- |
| **SSL Termination/Offloading**     | ✅              | ✅      | ✅      |
| **Server Name Indication (SNI)**   | ❌              | ✅      | ✅      |
| **Back-end Server Authentication** | ✅              | ❌      | ❌      |

## **Tích hợp**

| **Tính năng**          | **Classic ELB** | **ALB**                 | **NLB** |
| ---------------------- | --------------- | ----------------------- | ------- |
| **CloudWatch Metrics** | ✅              | Thêm chỉ số bổ sung     | ✅      |
| **Access Logs**        | ✅              | Thêm thuộc tính bổ sung | ✅      |
