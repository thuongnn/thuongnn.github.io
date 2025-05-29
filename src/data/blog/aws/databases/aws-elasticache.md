---
author: thuongnn
pubDatetime: 2023-07-18T11:45:22Z
modDatetime: 2023-07-18T11:45:22Z
title: "[AWS] Amazon ElastiCache"
folder: "aws"
draft: false
tags:
  - AWS
  - Amazon Web Services
description: Tìm hiểu về dịch vụ cache được quản lý hoàn toàn bởi AWS, hỗ trợ Redis và Memcached.
---

Bài viết được tham khảo và tổng hợp lại từ Jayendra's Blog, xem bài viết gốc ở đây: https://jayendrapatil.com/aws-elasticache.

## Table of contents

## **Tổng quan về AWS ElastiCache**

- **AWS ElastiCache** là dịch vụ **in-memory caching** được quản lý hoàn toàn, hỗ trợ hai engine: **Memcached** và **Redis**.
- **Mục đích**:
  - Cải thiện hiệu suất ứng dụng bằng cách lưu trữ dữ liệu trong bộ nhớ (in-memory), giảm độ trễ so với cơ sở dữ liệu dựa trên đĩa (như DynamoDB, RDS).
  - Giảm tải đọc cho cơ sở dữ liệu, tiết kiệm chi phí mở rộng.
- **Lợi ích chính**:
  - **Hiệu suất cao**: Độ trễ truy xuất dưới mili giây (sub-millisecond).
  - **Quản lý dễ dàng**: Tự động hóa vá phần mềm, phát hiện lỗi, khôi phục, sao lưu (Redis), và quản lý cụm.
  - **Tính bền bỉ**: Tự động phát hiện và thay thế node lỗi, giảm nguy cơ quá tải cơ sở dữ liệu.
  - **Tích hợp AWS**: Hoạt động với EC2, CloudWatch, CloudTrail, SNS, và chạy trong Amazon VPC.
- **Engine hỗ trợ**:
  - **Memcached**: Mô hình đơn giản, tập trung vào lưu trữ đối tượng, dễ mở rộng ngang, không hỗ trợ bền vững hoặc sao chép.
  - **Redis**: Hỗ trợ kiểu dữ liệu phức tạp (string, hash, list, set, sorted set, bitmap), bền vững dữ liệu, sao chép, Multi-AZ, backup/restore, và tính năng nâng cao như pub/sub.

## **Tính năng chính của ElastiCache**

### **Hiệu suất**

- Lưu trữ dữ liệu tạm thời (transient) hoặc bản sao của dữ liệu bền vững (durable) trong bộ nhớ.
- Cải thiện thời gian tải trang và phản hồi truy vấn, đặc biệt cho ứng dụng đọc nhiều (read-intensive).
- **Ví dụ**: Cache kết quả truy vấn SQL hoặc dữ liệu DynamoDB để giảm độ trễ.

### **Tích hợp và quản lý**

- **Tích hợp AWS**:
  - Kết nối với **EC2** (chạy ứng dụng), **CloudWatch** (theo dõi hiệu suất), **CloudTrail** (ghi log API), **SNS** (thông báo sự kiện).
  - **Amazon VPC**: Cụm ElastiCache chạy trong VPC, kiểm soát truy cập qua security groups.
- **Quản lý tự động**:
  - **Vá phần mềm**: Cập nhật engine Memcached/Redis trong khung giờ bảo trì.
  - **Phát hiện lỗi**: Tự động phát hiện node lỗi và thay thế.
  - **Sao lưu (Redis)**: Tạo snapshot để khôi phục dữ liệu.
  - **Auto Discovery (Memcached)**: Client tự động phát hiện node mới khi thêm/xóa khỏi cụm, sử dụng **ElastiCache Auto Discovery Client**.
- **Cấu hình**:
  - Chọn engine, instance type (ví dụ: `cache.t3.micro`, `cache.r5.xlarge`), số node, và region.
  - **Subnet group**: Chỉ định subnets trong VPC để triển khai cụm.
  - **Parameter group**: Tùy chỉnh tham số engine (như kích thước cache, timeout).
  - **Maintenance Window**: Khung giờ 60 phút/tuần để bảo trì (mặc định hoặc tùy chỉnh).

### Bảo mật

- **Mã hóa**:
  - **At rest**: Redis hỗ trợ mã hóa dữ liệu lưu trữ (bật khi tạo cụm, không thể thay đổi sau).
  - **In transit**: Hỗ trợ **TLS** cho kết nối client-cụm và giữa các node trong cụm.
- **Xác thực**:
  - **Redis**:
    - **Redis AUTH**: Yêu cầu mật khẩu cho client (phiên bản Redis < 6).
    - **RBAC (Role-Based Access Control)**: Quản lý quyền truy cập chi tiết (Redis 6+).
  - **Memcached**: Không hỗ trợ xác thực, chỉ dựa vào security group và VPC.
- **IAM**:
  - Kiểm soát quyền quản lý cụm (tạo, xóa, sửa) qua IAM policies.
  - Không kiểm soát truy cập dữ liệu trong cache (dựa vào Redis AUTH/RBAC).
- **Security Groups**:
  - Giới hạn truy cập vào cụm ElastiCache, chỉ cho phép từ EC2 hoặc Lambda được phép.

### **Độ bền và chịu lỗi**

- **Tự động thay thế node lỗi**:
  - ElastiCache phát hiện node lỗi và thay thế bằng node mới.
  - **Hiệu suất tạm giảm**: Node mới cần thời gian khởi tạo và làm đầy cache (cache warming).
- **Redis Multi-AZ**:
  - **Cấu trúc**:
    - Một **replication group** gồm 1 primary node (đọc/ghi) và tối đa 5 read replicas (chỉ đọc).
    - Các node được đặt ở **các Availability Zones (AZ) khác nhau** trong cùng region để tăng khả năng chịu lỗi.
  - **Automatic Failover**:
    - Nếu primary node lỗi, ElastiCache tự động:
      1. Phát hiện lỗi (thường trong vài giây).
      2. Chọn read replica có **độ trễ sao chép thấp nhất** (dựa trên dữ liệu đồng bộ).
      3. Nâng cấp replica thành primary mới.
      4. Tạo replica mới để thay thế replica vừa được nâng cấp.
    - **Thời gian failover**: Thường vài phút, phụ thuộc vào tình trạng cụm.
  - **Không bật Auto Failover**:
    - Nếu primary lỗi, ElastiCache tạo primary mới và đồng bộ với replica hiện có.
    - Manual intervention cần thiết nếu không có replica.
  - **Yêu cầu**:
    - Phải có ít nhất 1 read replica để bật Multi-AZ.
    - Chỉ hỗ trợ Redis, không áp dụng cho Memcached.
  - **Lợi ích**:
    - Tăng tính sẵn sàng cao (high availability), giảm nguy cơ gián đoạn dịch vụ.
    - Đảm bảo ứng dụng tiếp tục hoạt động khi một AZ lỗi.
- **Memcached**:
  - Không hỗ trợ Multi-AZ hoặc sao chép.
  - Nếu node lỗi, dữ liệu trên node đó mất, cần làm đầy lại cache.

### Backup và Restore (Redis)

- **Backup (Snapshot)**:
  - Redis hỗ trợ tạo **snapshot** (bản sao dữ liệu tại thời điểm cụ thể).
  - **Loại snapshot**:
    - **Tự động**: Cấu hình lịch sao lưu hàng ngày trong khung giờ backup (mặc định hoặc tùy chỉnh).
    - **Thủ công**: Người dùng kích hoạt qua AWS Console, CLI, hoặc SDK.
  - **Lưu trữ**:
    - Snapshot được lưu trong **Amazon S3**, tính phí riêng dựa trên dung lượng.
    - Có thể sao chép snapshot giữa các region để disaster recovery.
  - **Thời gian backup**:
    - Phụ thuộc vào kích thước dữ liệu, có thể ảnh hưởng hiệu suất nếu cụm nhỏ.
    - Chỉ backup primary node, không ảnh hưởng replicas.
- **Restore**:
  - Khôi phục dữ liệu từ snapshot để tạo **cụm mới** (không ghi đè cụm hiện tại).
  - **Quy trình**:
    1. Chọn snapshot từ S3.
    2. Tạo cụm mới với cấu hình tương tự (hoặc khác).
    3. Dữ liệu được khôi phục vào primary node, sau đó sao chép sang replicas (nếu có).
  - **Trường hợp sử dụng**:
    - Phục hồi sau lỗi dữ liệu (xóa nhầm, hỏng dữ liệu).
    - Tạo cụm thử nghiệm từ dữ liệu sản xuất.
    - Di chuyển dữ liệu sang region khác.
- **Lưu ý**:
  - Memcached **không hỗ trợ backup/restore** (dữ liệu tạm thời, mất khi node lỗi).
  - Backup không lưu trạng thái pub/sub hoặc cấu hình cụm, chỉ lưu dữ liệu.
  - Cần bật **persistence** (RDB hoặc AOF) để đảm bảo snapshot đáng tin cậy.

### Cluster Mode (Redis)

- **Redis Cluster Mode Enabled**:
  - Chia dữ liệu thành **nhiều shard** (phân vùng), mỗi shard có primary node và tối đa 5 replicas.
  - **Mỗi cụm** hỗ trợ tối đa **90 node** (shard + replicas).
  - **Slot phân phối**: Dữ liệu được chia thành 16,384 slot, mỗi shard quản lý một phần.
  - **Lợi ích**:
    - Tăng dung lượng lưu trữ và thông lượng (throughput) bằng cách phân phối dữ liệu.
    - Hỗ trợ workload lớn hơn so với cụm không bật Cluster Mode (non-clustered).
  - **Mở rộng**:
    - **Thêm shard**: Tăng dung lượng và thông lượng.
    - **Thêm replica**: Tăng khả năng đọc và chịu lỗi.
    - **Resharding**: Tự động tái phân phối slot khi thêm/xóa shard, không gián đoạn dịch vụ.
  - **Hạn chế**:
    - Không hỗ trợ **Global Datastore** (chỉ Cluster Mode Disabled hỗ trợ).
    - Một số lệnh Redis (như multi-key operations) có thể phức tạp hơn.
- **Redis Cluster Mode Disabled**:
  - Một primary node và tối đa 5 replicas, không chia shard.
  - Phù hợp với workload nhỏ hơn, quản lý đơn giản hơn.
  - Hỗ trợ **Global Datastore** và tất cả tính năng Redis (pub/sub, Lua scripts).
- **Lựa chọn**:
  - **Cluster Mode Enabled**: Workload lớn, cần dung lượng/thông lượng cao.
  - **Cluster Mode Disabled**: Workload nhỏ, cần tính năng nâng cao hoặc Global Datastore.

### **Mở rộng và toàn cầu hóa**

- **Scaling**:
  - **Memcached**:
    - **Mở rộng ngang**: Thêm node vào cụm, client tự quản lý phân phối dữ liệu.
    - **Không mở rộng dọc**: Không đổi instance type.
  - **Redis**:
    - **Mở rộng ngang**: Thêm read replicas (tối đa 5/shard) hoặc shard (Cluster Mode Enabled).
    - **Mở rộng dọc**: Thay đổi instance type (ví dụ: từ cache.t3.micro sang cache.r5.large).
    - **Online scaling**: Redis hỗ trợ thêm/xóa replica/shard mà không gián đoạn (Cluster Mode Enabled).
  - **Lưu ý**:
    - Scaling có thể gây giảm hiệu suất tạm thời do làm đầy cache.
    - Redis yêu cầu đồng bộ dữ liệu khi thêm replica.
- **Global Datastore (Redis, Cluster Mode Disabled)**:
  - Sao chép dữ liệu qua **nhiều AWS Region** (primary region và tối đa 2 secondary regions).
  - **Cách hoạt động**:
    - Primary region xử lý đọc/ghi, secondary regions chỉ đọc.
    - Dữ liệu được sao chép **bất đồng bộ** từ primary sang secondary.
    - **Failover toàn cầu**: Nếu primary region lỗi, nâng cấp secondary region thành primary.
  - **Lợi ích**:
    - Đọc với độ trễ thấp ở nhiều khu vực.
    - Hỗ trợ disaster recovery giữa các region.
  - **Chi phí**: Tính phí sao chép dữ liệu giữa region.
- **Cross-Region Read Replicas (Redis)**:
  - Tạo cụm replica ở region khác, đồng bộ bất đồng bộ từ primary.
  - **Trường hợp sử dụng**:
    - Đọc cục bộ ở region xa.
    - Phục hồi khi region chính lỗi.
  - **Hạn chế**: Không tự động failover như Global Datastore.

## **So sánh Memcached và Redis**

| **Tiêu chí**           | **Memcached**                             | **Redis**                                                                  |
| ---------------------- | ----------------------------------------- | -------------------------------------------------------------------------- |
| **Mô hình**            | Đơn giản, tập trung vào lưu trữ đối tượng | Hỗ trợ kiểu dữ liệu phức tạp (string, hash, list, set, sorted set, bitmap) |
| **Mở rộng**            | Mở rộng ngang (thêm node)                 | Mở rộng ngang (replica) và dọc (instance lớn hơn)                          |
| **Bền vững dữ liệu**   | Không hỗ trợ                              | Hỗ trợ persistence (RDB, AOF)                                              |
| **Sao chép**           | Không hỗ trợ                              | Hỗ trợ primary-replica, Multi-AZ, failover                                 |
| **Tính năng nâng cao** | Không có                                  | Pub/sub, xếp hạng, backup/restore                                          |
| **Xác thực**           | Không hỗ trợ                              | Redis AUTH, RBAC                                                           |
| **Phù hợp**            | Lưu trữ đối tượng đơn giản, tải cao       | Ứng dụng phức tạp, cần bền vững, pub/sub                                   |

- **Memcached**:
  - Phù hợp khi cần mô hình cache đơn giản, chạy trên node lớn với nhiều core/thread.
  - Lý tưởng để giảm tải cơ sở dữ liệu bằng cách lưu trữ đối tượng.
- **Redis**:
  - Phù hợp cho ứng dụng cần kiểu dữ liệu phức tạp, bền vững dữ liệu, hoặc tính năng như xếp hạng, pub/sub.
  - Hỗ trợ backup/restore, sao chép, và failover tự động.

## **Caching Strategies**

- **Lazy Loading**:
  - Dữ liệu chỉ được lưu vào cache khi **cache miss**:
    1. Ứng dụng yêu cầu dữ liệu.
    2. ElastiCache kiểm tra cache.
    3. Nếu miss, lấy từ cơ sở dữ liệu, lưu vào cache, trả về ứng dụng.
  - **Ưu điểm**:
    - Đơn giản, chỉ lưu dữ liệu cần thiết.
    - Tiết kiệm bộ nhớ cache.
  - **Nhược điểm**:
    - Cache miss gây độ trễ cao (do truy cập cơ sở dữ liệu).
    - Dữ liệu cũ (stale data) nếu TTL chưa hết.
- **Write-Through**:
  - Ghi dữ liệu vào cache đồng thời khi ghi vào cơ sở dữ liệu.
  - **Ưu điểm**:
    - Cache luôn có dữ liệu mới, giảm cache miss.
    - Tốt cho ứng dụng đọc ngay sau ghi.
  - **Nhược điểm**:
    - Tăng độ trễ ghi (do ghi vào cả cache và cơ sở dữ liệu).
    - Lãng phí bộ nhớ nếu dữ liệu ít đọc.
- **TTL (Time-to-Live)**:
  - Đặt thời gian sống cho mỗi mục trong cache (ví dụ: 5 phút, 1 giờ).
  - Dữ liệu tự động xóa khi hết TTL, giảm nguy cơ stale data.
  - **Cấu hình**:
    - Redis: Dùng lệnh EXPIRE hoặc cấu hình mặc định.
    - Memcached: Đặt TTL khi lưu mục (không tự động gia hạn).
  - **Lưu ý**:
    - TTL quá ngắn → cache miss nhiều.
    - TTL quá dài → stale data hoặc tốn bộ nhớ.
- **Tối ưu hiệu suất**:
  - Tăng **cache hit ratio** (tỷ lệ truy cập cache thành công) bằng cách:
    - Chọn chiến lược phù hợp (Lazy Loading cho dữ liệu ít đọc, Write-Through cho dữ liệu thường xuyên đọc).
    - Điều chỉnh TTL dựa trên tần suất cập nhật dữ liệu.
  - Theo dõi hiệu suất qua CloudWatch (cache hits, misses, CPU, memory).

## **Trường hợp sử dụng**

- **Session Management**:
  - Lưu trạng thái phiên người dùng (như thông tin đăng nhập, giỏ hàng).
  - **Redis**: Bền vững, hỗ trợ pub/sub cho cập nhật thời gian thực.
  - **Memcached**: Nhẹ, phù hợp cho session tạm thời.
- **Database Caching**:
  - Cache kết quả truy vấn từ DynamoDB, RDS, hoặc cơ sở dữ liệu tự quản.
  - **Ví dụ**: Cache danh sách sản phẩm, bài viết, hoặc kết quả tìm kiếm.
- **Real-time Analytics**:
  - Redis hỗ trợ pub/sub, sorted set cho bảng xếp hạng, đếm lượt xem.
  - **Ví dụ**: Bảng xếp hạng game, thống kê mạng xã hội.
- **Queue Management**:
  - Redis dùng list để tạo hàng đợi nhẹ (như xử lý tác vụ).
  - **Ví dụ**: Hàng đợi tin nhắn hoặc tác vụ xử lý nền.
- **Disaster Recovery**:
  - Redis Global Datastore và Cross-Region Replicas hỗ trợ đọc cục bộ và khôi phục region.
- **Tính toán nặng**:
  - Cache kết quả tính toán phức tạp (như gợi ý sản phẩm, phân tích dữ liệu).

## **Chi phí sử dụng**

- **Tính phí dựa trên**:
  - **Loại node**: Ví dụ, `cache.t3.micro` rẻ hơn `cache.r5.xlarge`.
  - **Số lượng node**: Cụm càng nhiều node, chi phí càng cao.
  - **Thời gian chạy**: Tính phí theo giờ hoặc giây (tùy region).
- **Không tính phí lưu trữ riêng**: Chi phí node đã bao gồm tài nguyên CPU, bộ nhớ, và mạng.
- **Tính năng bổ sung**:
  - **Backup (Redis)**: Phí lưu trữ snapshot trong S3.
  - **Global Datastore/Cross-Region Replicas**: Phí truyền dữ liệu giữa region
- **Tiết kiệm chi phí**:
  - **Reserved Instances**: Cam kết 1-3 năm để giảm chi phí (lên đến 70%).
  - **Giảm tải cơ sở dữ liệu**: Cache hiệu quả giảm RCU (DynamoDB) hoặc IOPS (RDS).
  - **Chọn instance type hợp lý**: Dùng node nhỏ cho workload nhẹ, node lớn cho workload nặng.
- **So với DAX**:
  - ElastiCache thường rẻ hơn DAX (DAX node đắt hơn, ví dụ: `dax.r4.large` ~$0.171/giờ).
  - DAX tối ưu riêng cho DynamoDB, trong khi ElastiCache linh hoạt hơn (hỗ trợ RDS, cơ sở dữ liệu tự quản, v.v.).

## **Lưu ý kỹ thuật**

- **Cấu hình cụm**:
  - **Engine**: Chọn Memcached hoặc Redis (phiên bản cụ thể, ví dụ: Redis 7.x).
  - **Node type**: Tùy thuộc vào CPU, bộ nhớ, và mạng (xem AWS Pricing).
  - **Số node**: Memcached tối đa 100 node, Redis tối đa 90 node (Cluster Mode Enabled).
  - **VPC**: Cụm chạy trong subnets được chỉ định, cần security group phù hợp.
- **Bảo trì**:
  - **Maintenance Window**: Cấu hình khung giờ bảo trì (60 phút/tuần) để vá hoặc nâng cấp.
  - **Impact**: Redis Multi-AZ giảm gián đoạn; Memcached có thể mất dữ liệu tạm thời.
- **Monitoring**:
  - **CloudWatch Metrics**:
    - **Cache hit/miss**: Đo hiệu quả cache.
    - **CPU/Memory**: Theo dõi tải node.
    - **Network**: Kiểm tra băng thông.
    - **Errors**: Phát hiện lỗi kết nối, timeout.
  - **CloudTrail**: Ghi log thao tác quản lý (tạo/xóa cụm, snapshot).
  - **SNS Notifications**: Cảnh báo khi node lỗi, failover, hoặc bảo trì.
- **Hiệu suất**:
  - **Memcached**:
    - Client quản lý phân phối dữ liệu (hashing) giữa các node.
    - Cần cấu hình client (như libmemcached) để tận dụng Auto Discovery.
  - **Redis**:
    - Tự động quản lý phân phối dữ liệu (Cluster Mode Enabled).
    - Hỗ trợ lệnh nâng cao (Lua scripts, transactions) cho ứng dụng phức tạp.
- **Bảo mật**:
  - Bật mã hóa at rest/in transit cho Redis.
  - Dùng **Redis AUTH** hoặc **RBAC** để kiểm soát truy cập dữ liệu.
  - Giới hạn kết nối qua security group (ví dụ: chỉ cho phép từ EC2 trong VPC).
- **Hạn chế**:
  - **Memcached**:
    - Không bền vững, không sao chép, không backup.
    - Phụ thuộc client để quản lý node.
  - **Redis**:
    - Cluster Mode Enabled giới hạn một số lệnh multi-key.
    - Snapshot có thể gây giảm hiệu suất trên cụm nhỏ.

## **Trường hợp sử dụng cụ thể**

- **Session Management**:
  - **Redis**: Lưu session bền vững, hỗ trợ pub/sub để đồng bộ trạng thái (như trạng thái đăng nhập).
  - **Memcached**: Lưu session tạm thời, nhẹ và nhanh.
- **Database Caching**:
  - Cache kết quả truy vấn từ DynamoDB, RDS, Aurora, hoặc cơ sở dữ liệu tự quản.
  - **Ví dụ**: Cache danh mục sản phẩm, bài viết, hoặc dữ liệu người dùng.
- **Real-time Analytics**:
  - Redis dùng sorted set cho bảng xếp hạng, pub/sub cho cập nhật thời gian thực.
  - **Ví dụ**: Bảng xếp hạng game, đếm lượt xem bài viết.
- **Queue Management**:
  - Redis dùng list để tạo hàng đợi nhẹ, thay thế SQS trong một số trường hợp.
  - **Ví dụ**: Xử lý tác vụ nền, hàng đợi tin nhắn.
- **Disaster Recovery**:
  - Redis Global Datastore và Cross-Region Replicas đảm bảo dữ liệu khả dụng khi region lỗi.
  - **Ví dụ**: Cache toàn cầu cho ứng dụng thương mại điện tử.
- **Tính toán nặng**:
  - Cache kết quả tính toán phức tạp (như gợi ý sản phẩm, ML inference).
  - **Ví dụ**: Lưu trữ kết quả phân tích dữ liệu để tái sử dụng.
