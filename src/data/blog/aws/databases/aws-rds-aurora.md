---
author: thuongnn
pubDatetime: 2023-07-21T14:30:45Z
modDatetime: 2025-05-29T01:52:06Z
title: "[AWS] Amazon RDS Aurora"
folder: "aws"
draft: false
tags:
  - AWS
  - Amazon Web Services
description: Tìm hiểu về Aurora, cơ sở dữ liệu quan hệ được tối ưu hóa cho cloud của AWS, tương thích với MySQL và PostgreSQL.
---

Bài viết được tham khảo và tổng hợp lại từ Jayendra's Blog, xem bài viết gốc ở đây: https://jayendrapatil.com/aws-aurora.

## Table of contents

Amazon Aurora là dịch vụ cơ sở dữ liệu quan hệ được AWS quản lý hoàn toàn, kết hợp hiệu suất cao, độ tin cậy của các cơ sở dữ liệu thương mại với sự đơn giản và chi phí tối ưu của cơ sở dữ liệu mã nguồn mở.

- **Hiệu suất cao**: Nhanh hơn **MySQL 5 lần** và **PostgreSQL 3 lần**.
- **Tương thích với MySQL & PostgreSQL**: cho phép các ứng dụng phát triển trên các nền tảng này chuyển sang Aurora mà không cần thay đổi nhiều.
- **Tự động mở rộng**: Hỗ trợ đến **128 TiB** mà không cần cấu hình trước.
- **Độ sẵn sàng cao**: Multi-AZ với tối đa **15 read replicas**.
- **Chi phí thấp hơn** so với các hệ quản trị cơ sở dữ liệu thương mại truyền thống.

# **Kiến trúc của Amazon Aurora**

![1.png](@/assets/images/aws/databases/aws-rds-aurora/1.png)

Amazon Aurora sử dụng **kiến trúc cluster** gồm:

- **Primary DB Instance (Writer Instance)**
  - Hỗ trợ đọc và ghi dữ liệu.
  - Toàn bộ thay đổi được đồng bộ vào **Aurora Storage**.
- **Aurora Replicas (Read Instances)**
  - Chỉ hỗ trợ đọc, giúp phân tải truy vấn.
  - Tối đa **15 Aurora Replicas** trong cùng một vùng (Region).
  - Khi Primary Instance gặp lỗi, Aurora tự động **failover** sang một Replica.
- **Aurora Storage Engine**
  - Tự động nhân bản **6 bản sao dữ liệu** trên **3 Availability Zones (AZs)**.
  - Khả năng **tự phục hồi** khi có lỗi đĩa.
  - Tự động mở rộng **10 GB → 128 TiB** mà không cần cấu hình trước.

# **Các loại Endpoint trong Aurora**

Aurora cung cấp nhiều loại endpoint giúp quản lý kết nối:

| **Loại Endpoint**                  | **Mô tả**                                                       |
| ---------------------------------- | --------------------------------------------------------------- |
| Cluster Endpoint (Writer Endpoint) | Trỏ đến **Primary DB Instance**, dùng cho cả đọc & ghi.         |
| Reader Endpoint                    | Cân bằng tải giữa **Aurora Replicas**, chỉ dùng để đọc dữ liệu. |
| Custom Endpoint                    | Cho phép nhóm các DB Instances tùy chỉnh.                       |
| Instance Endpoint                  | Trỏ trực tiếp vào một DB Instance cụ thể.                       |

# **Khả năng mở rộng & hiệu suất**

- ✔ **Tự động mở rộng lưu trữ**: Không cần dự đoán dung lượng trước, Aurora tự động mở rộng từ **10 GB đến 128 TiB**.
- ✔ **Tăng/giảm số lượng read replicas linh hoạt**: Hỗ trợ tối đa **15 replicas** mà không làm gián đoạn ứng dụng.
- ✔ **Sao chép dữ liệu nhanh**: Mọi thay đổi được ghi vào **Aurora Storage**, giúp tốc độ read replica nhanh hơn so với MySQL/PostgreSQL thông thường.

# **Bảo mật trong Amazon Aurora**

- ✔ **Mã hóa dữ liệu**
  - Hỗ trợ mã hóa dữ liệu **tại chỗ (at rest)** bằng **AWS KMS**.
  - Mã hóa dữ liệu **khi truyền tải (in transit)** bằng **TLS/SSL**.
- ✔ **Kiểm soát truy cập với IAM**
  - Quản lý quyền bằng **AWS Identity & Access Management (IAM)**.
  - Hỗ trợ xác thực bằng **IAM Database Authentication**.
- ✔ **Cấu hình bảo mật mạng**
  - Định cấu hình trong **Amazon VPC**.
  - Giới hạn truy cập bằng **Security Groups**.

# **Cơ chế sao lưu & khôi phục**

- ✔ **Sao lưu tự động**
  - Aurora tự động sao lưu liên tục vào **Amazon S3**.
  - Cho phép khôi phục dữ liệu về bất kỳ thời điểm nào trong vòng **35 ngày**.
- ✔ **Snapshot thủ công**
  - Người dùng có thể tạo snapshot thủ công để sao lưu dữ liệu dài hạn.
- ✔ **Backtrack (chỉ có trong Aurora MySQL)**
  - Khôi phục dữ liệu về một thời điểm gần đây mà không cần khôi phục từ backup.

# **Các biến thể của Amazon Aurora**

## **Aurora Serverless**

- ✔ **Không cần cấu hình trước dung lượng** → AWS tự động tăng/giảm tài nguyên.
- ✔ **Chỉ trả phí khi có truy vấn** → Giúp tiết kiệm chi phí đáng kể.
- ✔ **Hoạt động theo ACU (Aurora Capacity Unit)** → Điều chỉnh tài nguyên dựa theo tải thực tế.
- 📌 **Dùng khi nào?**
  - Ứng dụng có tải biến động, không liên tục.
  - Dev/Test môi trường, không cần chạy 24/7.
- ❌ **Hạn chế**:
  - **Thời gian scale-up có độ trễ** → Không ngay lập tức khi tải tăng cao.
  - **Không hỗ trợ Multi-AZ cho bản Serverless v1**.
  - **Không tương thích với một số tính năng của Aurora tiêu chuẩn** như Global Database.

## **Aurora Global Database**

- ✔ **Đồng bộ dữ liệu giữa các khu vực (Region) chỉ trong ~1 giây**.
- ✔ **Hỗ trợ tối đa 5 khu vực chỉ đọc (read-only region)**.
- ✔ **Dữ liệu có thể đọc ở mọi nơi với độ trễ thấp**.
- 📌 **Dùng khi nào?**
  - Ứng dụng toàn cầu cần độ trễ thấp.
  - Cần khả năng phục hồi thảm họa nhanh chóng.
- ❌ **Hạn chế**:
  - **Chi phí cao** → Phải trả phí cho nhiều cụm Aurora chạy ở các region khác nhau.
  - **Region chỉ đọc không thể ghi dữ liệu** → Chỉ có thể đọc, mọi thay đổi phải thực hiện trên region chính.
  - **Chuyển đổi Region chính (failover) không tự động** → Cần thao tác thủ công hoặc dùng AWS Managed Failover.

## **Aurora Cloning**

- ✔ **Tạo bản sao nhanh chóng**: Nhân bản cơ sở dữ liệu chỉ trong vài phút mà không cần sao chép toàn bộ dữ liệu.
- ✔ **Tiết kiệm dung lượng lưu trữ**: Bản clone **chia sẻ dữ liệu gốc** và chỉ tạo bản sao của dữ liệu khi có thay đổi.
- ✔ **Không ảnh hưởng hiệu suất**: Nhờ cơ chế **Copy-on-Write (COW)**, việc tạo và sử dụng clone không làm giảm hiệu suất của database gốc.
- 📌 **Dùng khi nào?**
  - Cần môi trường **Dev/Test** mà không ảnh hưởng đến database chính.
  - **Phân tích dữ liệu** trên bản sao để tránh tác động đến hệ thống production.
  - **Debug & Troubleshooting**, thử nghiệm các thay đổi mà không ảnh hưởng đến dữ liệu gốc.
- ❌ **Hạn chế**:
  - **Không thể clone giữa các tài khoản AWS khác nhau**.
  - **Không thể clone giữa các Region khác nhau** → Clone chỉ hoạt động trong cùng một AWS Region.
  - **Dung lượng có thể tăng nhanh nếu dữ liệu thay đổi nhiều** → Nếu có nhiều thay đổi, bản clone sẽ nhanh chóng tiêu tốn nhiều dung lượng lưu trữ hơn mong đợi.

## **Aurora Parallel Query**

- **Mô tả**: Tính năng **Aurora Parallel Query** cho phép **phân tán tải tính toán của một truy vấn đơn lẻ** trên hàng nghìn CPU trong tầng lưu trữ của Aurora. Thay vì thực thi toàn bộ truy vấn trên một instance duy nhất, Aurora đẩy một phần tải công việc xuống tầng lưu trữ, giúp tăng hiệu suất đáng kể.
- **Lợi ích**:
  - **Hiệu suất nhanh hơn**: Có thể tăng tốc các truy vấn phân tích lên đến **2 bậc độ lớn**.
  - **Đơn giản hóa vận hành và dữ liệu luôn cập nhật**: Cho phép thực thi truy vấn trực tiếp trên dữ liệu giao dịch hiện tại trong cụm Aurora.
  - **Kết hợp tải công việc giao dịch và phân tích trên cùng một cơ sở dữ liệu**: Giúp Aurora duy trì thông lượng giao dịch cao cùng lúc với các truy vấn phân tích đồng thời.
- **Sử dụng**: Có thể bật hoặc tắt **Parallel Query** một cách linh hoạt ở cả mức toàn cục và phiên làm việc bằng cách sử dụng tham số `aurora_pq`.
- **Hạn chế**:
  - Chỉ khả dụng cho phiên bản Aurora tương thích với **MySQL 5.6**.

## **Aurora Scaling**

- **Mô tả**: Aurora cung cấp khả năng **tự động mở rộng lưu trữ** và **mở rộng tính toán** để đáp ứng nhu cầu ứng dụng mà không ảnh hưởng đến hiệu suất.
- **Các hình thức mở rộng**:
  - **Mở rộng lưu trữ**: Aurora tự động tăng dung lượng lưu trữ lên đến **128 TiB** (giới hạn mềm) theo từng bước **10 GB**, mà không cần cấu hình trước và không ảnh hưởng đến hiệu suất cơ sở dữ liệu.
  - **Mở rộng tính toán**:
    - **Mở rộng instance**: Thay đổi lớp DB Instance để tăng hoặc giảm tài nguyên CPU và bộ nhớ.
    - **Mở rộng đọc**: Hỗ trợ mở rộng ngang với **tối đa 15 read replicas** để phân tải các hoạt động đọc.
    - **Tự động mở rộng**: Thiết lập chính sách tự động thêm read replicas dựa trên các điều kiện như CPU hoặc số lượng kết nối, với số lượng replica tối thiểu và tối đa được xác định trước.

## **Aurora Backtrack**

- **Mô tả**: **Aurora Backtrack** cho phép **"quay ngược" cụm cơ sở dữ liệu** về một thời điểm cụ thể mà không cần phải khôi phục từ bản sao lưu, giúp khắc phục nhanh chóng các lỗi không mong muốn.
- **Đặc điểm**:
  - **Thực hiện khôi phục tại chỗ**: Không tạo instance mới, mà "quay ngược" trạng thái của cụm cơ sở dữ liệu về thời điểm đã chọn với **thời gian downtime tối thiểu**.
  - **Không thay thế cho sao lưu**: Backtrack không thay thế việc sao lưu cụm cơ sở dữ liệu để khôi phục về một thời điểm.
- **Cấu hình**:
  - **Cửa sổ backtrack mục tiêu**: Là khoảng thời gian bạn **muốn** cụm cơ sở dữ liệu có thể backtrack, tối đa là **72 giờ**.
  - **Cửa sổ backtrack thực tế**: Là khoảng thời gian thực tế mà cụm cơ sở dữ liệu **có thể** backtrack, có thể nhỏ hơn cửa sổ mục tiêu, dựa trên khối lượng công việc và dung lượng lưu trữ dành cho việc lưu trữ thông tin về các thay đổi của cơ sở dữ liệu (gọi là **change records**).
- **Lưu ý**:
  - **Cụm cơ sở dữ liệu với backtracking được bật sẽ tạo ra change records**. Aurora giữ lại các change records cho cửa sổ backtrack mục tiêu và tính phí theo giờ cho việc lưu trữ chúng.
  - **Cả cửa sổ backtrack mục tiêu và khối lượng công việc trên cụm cơ sở dữ liệu đều xác định số lượng change records được lưu trữ**.
- **Hạn chế**:
  - Chỉ khả dụng cho Aurora với khả năng tương thích MySQL.

# **Khi nào nên sử dụng Amazon Aurora?**

- ✔ Ứng dụng cần hiệu suất cao hơn MySQL/PostgreSQL truyền thống.
- ✔ Cần khả năng mở rộng tự động mà không bị gián đoạn.
- ✔ Ứng dụng toàn cầu cần độ trễ thấp (dùng Aurora Global Database).
- ✔ Muốn tận dụng các tính năng tự động hóa của AWS như sao lưu, failover.
- ✔ Ứng dụng serverless với tải không liên tục (dùng Aurora Serverless).

# **Hạn chế của Amazon Aurora**

- ❌ **Chi phí cao hơn so với RDS tiêu chuẩn**.
- ❌ **Không hỗ trợ quyền root SSH hoặc truy cập hệ điều hành**.
- ❌ **Không tương thích hoàn toàn 100% với MySQL/PostgreSQL** → Một số tính năng bị giới hạn.
- ❌ **Khó di chuyển ra ngoài AWS** vì đây là công nghệ độc quyền.

# **Tổng kết**

- **Amazon Aurora** là lựa chọn tối ưu cho **ứng dụng doanh nghiệp**, **ứng dụng cần hiệu suất cao**, hoặc **ứng dụng toàn cầu**.
- Nếu cần cơ sở dữ liệu **tự động mở rộng** mà không phải lo về quản lý, **Aurora Serverless** là giải pháp tiết kiệm chi phí.
- Nếu muốn cơ sở dữ liệu có độ trễ thấp trên toàn cầu, **Aurora Global Database** là lựa chọn phù hợp.
- Tuy nhiên, **chi phí cao hơn** so với Amazon RDS, nên cần đánh giá kỹ trước khi triển khai.
