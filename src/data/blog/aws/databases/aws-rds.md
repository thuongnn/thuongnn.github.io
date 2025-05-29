---
author: thuongnn
pubDatetime: 2023-09-15T15:30:45Z
modDatetime: 2025-05-29T02:30:41Z
title: "[AWS] Amazon Relational Database Service (RDS)"
folder: "aws"
draft: false
tags:
  - AWS
  - Amazon Web Services
description: Tìm hiểu về dịch vụ cơ sở dữ liệu quan hệ được quản lý hoàn toàn bởi AWS, hỗ trợ nhiều loại database engine phổ biến.
ogImage: https://techblogbuilder.com/wp-content/uploads/sites/4/2021/06/techblogbuilder-home.png
---

Bài viết được tham khảo và tổng hợp lại từ Jayendra's Blog, xem bài viết gốc ở đây: https://jayendrapatil.com/aws-rds.

Amazon RDS là một dịch vụ được quản lý giúp dễ dàng thiết lập, vận hành và mở rộng cơ sở dữ liệu quan hệ trên AWS. Dịch vụ này giúp tự động hóa các tác vụ quản trị như cung cấp cơ sở dữ liệu, vá lỗi phần mềm, sao lưu và phục hồi, cũng như hỗ trợ mở rộng linh hoạt.

## Table of contents

# Lợi ích chính của Amazon RDS

- **Quản lý tự động** - RDS giúp giảm gánh nặng vận hành bằng cách tự động quản lý:
  - Cấu hình cơ sở dữ liệu
  - Áp dụng bản vá và cập nhật phần mềm
  - Tự động sao lưu và khôi phục
  - Phát hiện lỗi và tự động chuyển đổi dự phòng
- **Hiệu suất cao**
  - **Chọn cấu hình phần cứng linh hoạt**: RDS hỗ trợ nhiều loại phiên bản EC2 khác nhau.
  - **Hỗ trợ SSD hiệu suất cao**: Chế độ lưu trữ **General Purpose SSD (gp3, gp2)** hoặc **Provisioned IOPS (io1, io2)** giúp tăng tốc độ đọc/ghi dữ liệu.
  - **Sao chép dữ liệu read-replica**: Giúp cải thiện hiệu suất đọc bằng cách phân bổ tải đọc qua nhiều bản sao.
- **Khả năng mở rộng linh hoạt**
  - Có thể thay đổi kích thước **CPU, RAM, dung lượng lưu trữ và IOPS** mà không cần gián đoạn hoạt động.
  - **Chế độ tự động mở rộng lưu trữ (Storage Auto Scaling)** giúp tăng dung lượng lưu trữ khi cần thiết.
- **Độ sẵn sàng cao và chuyển đổi dự phòng**
  - **Triển khai Multi-AZ**: Khi bật chế độ này, một bản sao dữ liệu sẽ được duy trì ở một vùng sẵn sàng (AZ) khác, giúp tăng tính sẵn sàng.
  - **Read Replicas**: Hỗ trợ sao chép dữ liệu sang nhiều vùng khác nhau để giảm tải đọc.
- **Bảo mật nâng cao**
  - **Mã hóa dữ liệu**: RDS hỗ trợ mã hóa dữ liệu khi lưu trữ (encryption at rest) và khi truyền tải (encryption in transit).
  - **Tích hợp với IAM**: Kiểm soát quyền truy cập dựa trên vai trò IAM.
  - **Định cấu hình bảo mật mạng**: Sử dụng **Amazon VPC**, **Security Groups** để giới hạn quyền truy cập.
- Các cơ sở dữ liệu được hỗ trợ - Amazon RDS hỗ trợ nhiều hệ quản trị cơ sở dữ liệu (DBMS), bao gồm:
  - **Amazon Aurora**: Dịch vụ DB tối ưu hóa cho AWS, có hiệu suất cao hơn MySQL/PostgreSQL tiêu chuẩn.
  - **MySQL**: Một trong những hệ quản trị phổ biến, hỗ trợ từ phiên bản 5.6 trở lên.
  - **PostgreSQL**: Cơ sở dữ liệu mã nguồn mở mạnh mẽ, hỗ trợ nhiều tính năng nâng cao.
  - **MariaDB**: Một nhánh của MySQL với hiệu suất và tính năng tối ưu hơn.
  - **Microsoft SQL Server**: Hỗ trợ từ phiên bản 2012 trở lên.
  - **Oracle Database**: Cơ sở dữ liệu thương mại mạnh mẽ, hỗ trợ nhiều tính năng doanh nghiệp.

# Cách hoạt động của Amazon RDS

- **Kiến trúc AWS RDS -** Một **RDS DB Instance** bao gồm các thành phần chính sau:
  - **Database Engine**: MySQL, PostgreSQL, SQL Server,...
  - **Compute (EC2 Instance)**: Máy chủ xử lý dữ liệu.
  - **Storage (EBS Volume)**: Dùng để lưu trữ cơ sở dữ liệu.
  - **Security Group**: Cấu hình tường lửa để kiểm soát quyền truy cập.
  - **VPC (Virtual Private Cloud)**: Mạng ảo để cô lập RDS trong hệ thống AWS.
- Cấu trúc triển khai RDS
  - **Single-AZ Deployment**:
    - Dữ liệu và ứng dụng nằm trong một vùng sẵn sàng duy nhất.
    - Phù hợp với môi trường phát triển và thử nghiệm.
  - **Multi-AZ Deployment**:
    - Tạo một bản sao dữ liệu ở một vùng sẵn sàng khác để dự phòng.
    - AWS tự động chuyển đổi nếu bản chính gặp sự cố.
    - Tăng cường độ tin cậy và khả năng chịu lỗi.
- Read Replicas (Bản sao chỉ đọc)
  - Hỗ trợ sao chép dữ liệu cho các phiên bản **MySQL, PostgreSQL, MariaDB và Aurora**.
  - Tăng cường khả năng mở rộng bằng cách phân tán tải đọc giữa nhiều bản sao.
  - Có thể đặt bản sao trong cùng một **vùng (Region)** hoặc trên các **vùng khác nhau (Cross-Region)**.

# Các thành phần quan trọng của Amazon RDS

- **DB Instances**
  - Là một môi trường cơ sở dữ liệu độc lập, chạy trên AWS.
  - Có thể được cấu hình với kích thước CPU, RAM, lưu trữ theo nhu cầu.
- **DB Parameter Groups**
  - Cho phép người dùng tùy chỉnh cấu hình cơ sở dữ liệu như bộ nhớ đệm, thời gian chờ, v.v.
- **DB Security Groups**
  - Kiểm soát quyền truy cập vào cơ sở dữ liệu dựa trên địa chỉ IP hoặc các nhóm bảo mật AWS khác.
- **Automated Backups & Snapshots**
  - **Automated Backups**: AWS tự động sao lưu dữ liệu hàng ngày.
  - **Manual Snapshots**: Người dùng có thể tạo ảnh chụp nhanh (snapshot) của dữ liệu để khôi phục khi cần.

# So sánh Amazon RDS và Amazon Aurora

| **Đặc điểm**         | **Amazon RDS**         | **Amazon Aurora**                     |
| -------------------- | ---------------------- | ------------------------------------- |
| **Hiệu suất**        | Tốt                    | Cao hơn MySQL 5 lần, PostgreSQL 3 lần |
| **Độ sẵn sàng**      | Multi-AZ, Read Replica | Multi-AZ, tự động sao chép 6 bản      |
| **Chi phí**          | Rẻ hơn Aurora          | Cao hơn RDS 20%–30%                   |
| **Khả năng mở rộng** | Scale CPU/RAM          | Scale theo cluster                    |
| **Sao lưu**          | Tự động mỗi ngày       | Liên tục, khôi phục theo thời gian    |

# Khi nào nên sử dụng Amazon RDS?

- ✔ Nếu bạn cần một dịch vụ cơ sở dữ liệu quan hệ được quản lý, hỗ trợ sao lưu tự động, bảo mật và mở rộng linh hoạt.
- ✔ Khi ứng dụng của bạn cần độ tin cậy cao với Multi-AZ hoặc Read Replicas.
- ✔ Nếu bạn không muốn tốn thời gian vận hành, cập nhật và bảo trì cơ sở dữ liệu.
- ✔ Nếu bạn sử dụng MySQL, PostgreSQL, MariaDB, SQL Server hoặc Oracle mà không cần tùy chỉnh sâu.

# **Hạn chế của Amazon RDS**

Mặc dù Amazon RDS mang lại nhiều lợi ích, nhưng có một số hạn chế cần lưu ý:

- **Không có quyền truy cập root (SSH) vào cơ sở dữ liệu**: Vì RDS là dịch vụ được quản lý, người dùng không thể truy cập trực tiếp vào hệ điều hành hoặc shell của máy chủ cơ sở dữ liệu. Điều này có nghĩa là bạn không thể tùy chỉnh hệ thống như trên các máy chủ tự quản lý.
- **Hạn chế với một số bảng hệ thống**: Một số thao tác nâng cao trên bảng hệ thống hoặc quyền DBA (Database Administrator) có thể bị giới hạn.
- **Chi phí cao hơn so với tự triển khai**: Mặc dù RDS giúp giảm tải công việc quản trị, nhưng chi phí có thể cao hơn so với việc tự cài đặt và quản lý một cơ sở dữ liệu trên EC2.
- **Hạn chế với một số tính năng DB gốc**: Một số tính năng gốc của MySQL, PostgreSQL, SQL Server, v.v., có thể không được hỗ trợ hoặc bị giới hạn trong RDS.
- **Phụ thuộc vào AWS**: Nếu bạn muốn di chuyển ra khỏi AWS, có thể gặp khó khăn khi xuất dữ liệu và cấu hình.

# **Tóm tắt**

- **Amazon RDS** giúp quản lý cơ sở dữ liệu dễ dàng hơn với các tính năng như tự động sao lưu, Multi-AZ, Read Replicas và tích hợp bảo mật cao.
- Hỗ trợ nhiều loại cơ sở dữ liệu, tối ưu cho doanh nghiệp muốn giảm tải quản trị.
- Khả năng mở rộng tốt, giúp tối ưu hóa hiệu suất mà không cần thay đổi kiến trúc ứng dụng.
- 📌 **Lưu ý:** Nếu cần hiệu suất cao hơn với sao chép dữ liệu nhanh chóng, **Amazon Aurora** có thể là một lựa chọn thay thế tốt hơn RDS tiêu chuẩn.
