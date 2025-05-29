---
author: thuongnn
pubDatetime: 2023-05-10T15:30:45Z
modDatetime: 2023-05-10T15:30:45Z
title: "[AWS] AWS Global Accelerator"
folder: "aws"
draft: false
tags:
  - AWS
  - Amazon Web Services
description: Tìm hiểu về dịch vụ tăng tốc toàn cầu của AWS, giúp cải thiện hiệu suất và độ tin cậy của ứng dụng.
---

Bài viết được tham khảo và tổng hợp lại từ Jayendra's Blog, xem bài viết gốc ở đây: https://jayendrapatil.com/aws-global-accelerator.

## Table of contents

- **AWS Global Accelerator** là một networking service giúp cải thiện độ khả dụng và hiệu suất của các ứng dụng đối với người dùng toàn cầu.
- **AWS Global Accelerator** tối ưu hóa đường dẫn đến ứng dụng để giữ packet loss, độ trễ và độ jitter luôn ở mức thấp.
- Dịch vụ này giúp cải thiện hiệu suất của ứng dụng bằng cách giảm độ trễ byte đầu tiên (the round trip time for a packet to go from a client to your endpoint and back again) và jitter, đồng thời tăng thông lượng (amount of data transferred in a second) so với public internet.
- **Global Accelerator** sử dụng AWS global network rộng lớn, được giám sát kỹ lưỡng, không bị tắc nghẽn và có tính dự phòng để chuyển hướng traffic TCP và UDP đến healthy application endpoint gần nhất trong **AWS Region** gần người dùng.
- Đây là một dịch vụ toàn cầu hỗ trợ các endpoints trong nhiều **AWS Region**.
- Hỗ trợ các **AWS application endpoints**, chẳng hạn như **ALB**, **NLB**, **EC2 Instances** và **Elastic IP** mà không cần thay đổi phía người dùng.
- Cung cấp hai **global static public IPs**, đóng vai trò là entry point cố định cho ứng dụng được lưu trữ trong một hoặc nhiều **AWS Region**, cải thiện khả năng truy cập.
- Giúp phân phối các **static IP addresses** từ **AWS edge network**, là giao diện phía trước của các ứng dụng.
- Việc sử dụng **static IP addresses** đảm bảo bạn không cần thay đổi phía khách hàng hay cập nhật bản ghi **DNS** khi bạn thay đổi hoặc thay thế các endpoints.
- Cho phép bạn mang địa chỉ **IP của riêng mình (BYOIP)** và sử dụng chúng như một entry point cố định cho các application endpoints.
- **Global Accelerator** cấp phát hai **static IPv4 addresses** được phục vụ bởi các network zones độc lập, mỗi khu vực có bộ cơ sở hạ tầng vật lý và địa chỉ **IP dịch vụ** riêng biệt từ **unique IP subnet**.
  - Nếu một địa chỉ **IP** từ một network zone trở nên không khả dụng do sự cố mạng hoặc địa chỉ **IP** bị chặn bởi các mạng khách hàng nhất định, ứng dụng của khách hàng có thể thử lại bằng **healthy static IP address** từ network zone khác.
- Hiện tại, dịch vụ này hỗ trợ **IPv4 addresses**.
- Liên tục giám sát tình trạng của các application endpoints bằng các kiểm tra **TCP**, **HTTP**, và **HTTPS** **health checks**.
- Tự động chuyển hướng traffic đến healthy available endpoint gần nhất để giảm thiểu endpoint failure.
- Terminates các TCP connections từ khách hàng tại các **AWS edge locations** và gần như đồng thời thiết lập một **TCP connection** mới với các endpoints của bạn. Điều này giúp giảm thời gian phản hồi (giảm độ trễ) và tăng throughput.
- Hỗ trợ **Client Affinity**, giúp xây dựng các stateful applications.
- Hỗ trợ bảo vệ địa chỉ **IP** của khách hàng ngoại trừ các **NLBs** và **EIPs** endpoints.
- Tích hợp với **AWS Shield Standard**, giúp giảm thiểu thời gian ngừng hoạt động và độ trễ từ các cuộc tấn công **DDoS** bằng cách sử dụng giám sát traffic mạng luôn bật và giảm thiểu tự động.
- **Không hỗ trợ on-premises endpoints**. Tuy nhiên, một **NLB** có thể được cấu hình để xử lý các on-premises endpoints trong khi **Global Accelerator** chỉ đến **NLB**.
  ![1.png](@/assets/images/aws/networking/global-accelerator/1.png)

# AWS CloudFront vs Global Accelerator

![2.png](@/assets/images/aws/networking/global-accelerator/2.png)

- **Global Accelerator** và **CloudFront** đều sử dụng **AWS global network** và các **edge locations** của nó trên khắp thế giới.
- Cả hai dịch vụ đều tích hợp với **AWS Shield** để bảo vệ khỏi **DDoS**.
- **Hiệu suất**
  - **CloudFront** cải thiện hiệu suất cho cả nội dung có thể lưu vào bộ đệm (như hình ảnh và video) và dynamic content (như tăng tốc **API** và phân phối dynamic site).
  - **Global Accelerator** cải thiện hiệu suất cho nhiều loại applications qua **TCP** hoặc **UDP** bằng cách chuyển tiếp các gói tin tại các **edge locations** đến các ứng dụng chạy trong một hoặc nhiều **AWS Region**.
- **Các trường hợp sử dụng**
  - **CloudFront** phù hợp với các trường hợp sử dụng **HTTP**.
  - **Global Accelerator** phù hợp với các trường hợp sử dụng không phải **HTTP**, chẳng hạn như **gaming** (**UDP**), **IoT** (**MQTT**), hoặc **VoIP**, cũng như các trường hợp sử dụng **HTTP** yêu cầu địa chỉ **IP tĩnh** hoặc chuyển vùng nhanh chóng, có thể dự đoán.
- **Lưu vào bộ đệm**
  - **CloudFront** hỗ trợ **Edge caching**.
  - **Global Accelerator** không hỗ trợ **Edge Caching**.
