---
author: thuongnn
pubDatetime: 2023-07-15T10:20:15Z
modDatetime: 2025-05-29T02:30:41Z
title: "[AWS] Amazon Elastic File System (EFS)"
folder: "aws"
draft: false
tags:
  - AWS
  - Amazon Web Services
description: Tìm hiểu về dịch vụ lưu trữ file của AWS, cho phép chia sẻ file giữa nhiều EC2 instance.
ogImage: ../../../../assets/images/aws/storage/elastic-file-store/1.png
---

Bài viết được tham khảo và tổng hợp lại từ Jayendra's Blog, xem bài viết gốc ở đây: https://jayendrapatil.com/aws-efs.

## Table of contents

# Giới thiệu

- **Dịch vụ lưu trữ file serverless**, được AWS quản lý hoàn toàn.
- **Tự động mở rộng** từ gigabytes đến petabytes, không cần provisioning trước.
- **Hỗ trợ giao thức NFSv4.0 & NFSv4.1**, có thể **mount trên nhiều EC2 thuộc nhiều AZ**.
- **Tính khả dụng cao**, dữ liệu được **sao chép across multiple AZs trong cùng một region**.
- **Tự động tăng/giảm dung lượng**, không cần quản lý provisioning thủ công.
- **Hỗ trợ POSIX-compliant file system**, tương thích với tất cả Linux-based AMI.
- **Không hỗ trợ Windows** (chỉ dành cho hệ thống Linux).
- **Mã hóa dữ liệu**:
  - **Encryption at rest** (sử dụng AWS KMS).
  - **Encryption in transit** (sử dụng TLS).
- **Truy cập từ on-premises** thông qua **AWS Direct Connect hoặc VPN**.
- **Có thể truy cập đồng thời** từ cả on-premises servers và EC2 trong AWS VPC.
- Khi nào nên sử dụng Amazon EFS?
  - Khi cần **chia sẻ dữ liệu giữa nhiều EC2 instances trong nhiều AZ**.
  - Khi cần **hệ thống file POSIX-compliant** có khả năng mở rộng tự động.
  - Khi workload yêu cầu **throughput cao**, có thể truy cập từ nhiều nguồn cùng lúc.
  - Khi cần **dữ liệu có độ bền cao, sẵn sàng cao**, được sao chép across multiple AZs.
  - Khi muốn **truy cập từ on-premises** và từ AWS đồng thời.

# EFS Storage Classes

| **Storage class**                         | **Designed for**                                                                        | Durability                     | Availability | **Availability zones** | **Lưu ý khác**                                                 |
| ----------------------------------------- | --------------------------------------------------------------------------------------- | ------------------------------ | ------------ | ---------------------- | -------------------------------------------------------------- |
| **EFS Standard**                          | Dữ liệu được truy cập thường xuyên, yêu cầu độ bền và khả dụng cao nhất.                | 99.999999999% (11 số 9)        | 99.99%       | >= 3                   | Không có                                                       |
| **EFS Standard – Infrequent Access (IA)** | Dữ liệu lâu dài, ít được truy cập, nhưng vẫn yêu cầu độ bền và khả dụng cao nhất.       | 99.999999999% (11 số 9)        | 99.99%       | >= 3                   | Áp dụng phí truy xuất trên mỗi GB.                             |
| **EFS One Zone**                          | Dữ liệu được truy cập thường xuyên nhưng không yêu cầu mức độ bền và khả dụng cao nhất. | 99.999999999% (11 số 9)**`*`** | 99.90%       | 1                      | Không chịu được mất một AZ.                                    |
| **EFS One Zone-IA**                       | Dữ liệu lâu dài, ít được truy cập, nhưng không yêu cầu mức độ bền và khả dụng cao nhất. | 99.999999999% (11 số 9)**`*`** | 99.90%       | 1                      | Không chịu được mất một AZ. Áp dụng phí truy xuất trên mỗi GB. |

(**`*`**) Độ bền thiết kế cao nhưng do chỉ có một AZ, không chống chịu được mất mát AZ.

### Standard storage classes

![1.png](@/assets/images/aws/storage/elastic-file-store/1.png)

- **EFS Standard**
  - **Lưu trữ cấp vùng (regional storage class)** dành cho dữ liệu được truy cập thường xuyên.
  - Cung cấp **mức độ khả dụng và độ bền cao nhất** bằng cách lưu trữ dữ liệu tệp hệ thống dự phòng trên **nhiều Vùng sẵn sàng (AZs)** trong một khu vực AWS.
  - **Lý tưởng** cho các active file system workloads, chỉ **trả tiền cho dung lượng lưu trữ** đã sử dụng hàng tháng.
- **EFS Standard – Infrequent Access (Standard-IA)**
  - **Lưu trữ cấp vùng (regional storage class) chi phí thấp**, được tối ưu hóa cho các tệp ít được truy cập (tức là không phải ngày nào cũng truy cập).
  - Cung cấp **mức độ khả dụng và độ bền cao nhất** bằng cách lưu trữ dữ liệu tệp hệ thống dự phòng trên **nhiều Vùng sẵn sàng (AZs)** trong một khu vực AWS.
  - **Chi phí lưu trữ thấp hơn**, nhưng có **phí truy xuất dữ liệu** khi truy cập tệp.

### One Zone storage classes

![2.png](@/assets/images/aws/storage/elastic-file-store/2.png)

- **EFS One Zone**
  - Dành cho **các tệp được truy cập thường xuyên**, được lưu trữ **dự phòng trong một Vùng sẵn sàng (AZ)** trong một khu vực AWS.
  - **Tiết kiệm chi phí hơn** so với EFS Standard do chỉ lưu trữ trong một AZ.
  - Chỉ cần **một điểm gắn kết (mount target)** trong cùng AZ với hệ thống tệp.
- **EFS One Zone – Infrequent Access (One Zone-IA)**
  - **Lớp lưu trữ chi phí thấp hơn**, dành cho các **tệp ít được truy cập**, được lưu trữ **dự phòng trong một AZ** trong một khu vực AWS.
  - **Tiết kiệm đáng kể chi phí**, nhưng có **phí truy xuất dữ liệu** khi truy cập tệp.
  - **Không chịu lỗi AZ**, nếu AZ gặp sự cố, dữ liệu có thể bị mất.

# EFS Lifecycle Management

- **Tự động quản lý lưu trữ tệp hiệu quả về chi phí** cho các hệ thống tệp EFS.
- Khi được **bật**, tính năng này sẽ **di chuyển các tệp không được truy cập trong một khoảng thời gian nhất định** sang lớp lưu trữ truy cập không thường xuyên **(Standard-IA hoặc One Zone-IA)**.
  _Ví dụ: Có thể thiết lập chính sách để **di chuyển tệp sang EFS IA sau 14 ngày không được truy cập**._
- **Cách hoạt động:**
  - Sử dụng **bộ đếm thời gian nội bộ** để theo dõi lần cuối tệp được truy cập (không phải thuộc tính POSIX có thể xem công khai).
  - Mỗi lần một tệp trong **Standard hoặc One Zone** được truy cập, **bộ đếm thời gian sẽ được đặt lại**.
  - Sau khi một tệp được chuyển vào lớp lưu trữ IA, **tệp sẽ ở đó vô thời hạn**, trừ khi **EFS Intelligent-Tiering** được bật để tự động di chuyển lại.

# EFS Access Points

- **EFS Access Points** là **điểm truy cập dành riêng cho ứng dụng** vào hệ thống tệp EFS, giúp **quản lý quyền truy cập vào dữ liệu dùng chung dễ dàng hơn**.
- **Quyền hạn của Access Points:**
  - **Ép buộc danh tính người dùng** (bao gồm cả nhóm POSIX) cho mọi yêu cầu truy cập hệ thống tệp thông qua access point.
  - **Định nghĩa thư mục gốc khác nhau** cho từng access point, giúp **hạn chế quyền truy cập của ứng dụng vào một thư mục cụ thể** và các thư mục con của nó.
- **Bảo mật với IAM:**
  - **Chính sách AWS IAM** có thể được sử dụng để **buộc ứng dụng sử dụng một access point cụ thể**.
  - **Kết hợp IAM và Access Points** giúp **đảm bảo truy cập dữ liệu an toàn** và **chỉ các ứng dụng được ủy quyền mới có quyền truy cập vào dữ liệu cụ thể**.
