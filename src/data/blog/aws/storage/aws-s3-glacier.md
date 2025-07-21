---
author: thuongnn
pubDatetime: 2023-07-14T15:30:45Z
modDatetime: 2023-07-14T15:30:45Z
title: "[AWS] Amazon S3 Glacier"
folder: "aws"
draft: true
tags:
  - AWS
  - Amazon Web Services
description: Tìm hiểu về dịch vụ lưu trữ dữ liệu lưu trữ dài hạn với chi phí thấp của AWS.
ogImage: https://techblogbuilder.com/wp-content/uploads/sites/4/2021/06/techblogbuilder-home.png
---

Bài viết được tham khảo và tổng hợp lại từ Jayendra's Blog, xem bài viết gốc ở đây: https://jayendrapatil.com/aws-s3-glacier.

## Table of contents

### Giới thiệu

**S3 Glacier** là dịch vụ lưu trữ **tối ưu cho dữ liệu lưu trữ lâu dài** (archival) hoặc **dữ liệu truy cập không thường xuyên** ("cold data").

### **Tính năng chính**

- **Cực kỳ bảo mật, bền vững và chi phí thấp** cho lưu trữ dài hạn.
- **Độ bền dữ liệu cao**: 99.999999999% (11 số 9).
- **Lưu trữ dữ liệu dư thừa** tại **nhiều cơ sở hạ tầng AWS** và **trên nhiều thiết bị** trong mỗi cơ sở.
- **Tự động kiểm tra và tự phục hồi dữ liệu** để đảm bảo tính toàn vẹn.
- **Không cần quản lý hạ tầng, sao lưu, phục hồi hoặc mở rộng dung lượng** – AWS xử lý toàn bộ.

### **S3 Glacier storage classes**

| **Storage classes**                                       | **Mô tả**                                                                                                                          |
| --------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| S3 Glacier Instant Retrieval                              | **Truy xuất dữ liệu trong milliseconds**. Phù hợp với dữ liệu lưu trữ lâu dài nhưng vẫn cần truy xuất nhanh.                       |
| S3 Glacier Flexible Retrieval _(trước đây là S3 Glacier)_ | **Truy xuất trong vài phút đến vài giờ**, có 3 tùy chọn: - **Expedited**: 1-5 phút. - **Standard**: 3-5 giờ. - **Bulk**: 5-12 giờ. |
| S3 Glacier Deep Archive                                   | **Chi phí thấp nhất**, nhưng **truy xuất mặc định 12 giờ**. Phù hợp với dữ liệu lưu trữ dài hạn hiếm khi cần truy xuất.            |

📌 **Lưu ý:**

- **S3 Glacier Flexible Retrieval** và **S3 Glacier Deep Archive** **không hỗ trợ truy cập theo thời gian thực**.
- Nếu **cần truy cập nhanh và thường xuyên**, nên sử dụng **Amazon S3 tiêu chuẩn** thay vì Glacier.

### Tương tác với S3 Glacier

- **AWS Management Console**: chỉ hỗ trợ **tạo và xóa Vaults**.
- **CLI, SDK hoặc REST API**: cần sử dụng để **upload, download dữ liệu và truy xuất dữ liệu**.

### **Ứng dụng của S3 Glacier**

- **Lưu trữ tài liệu số** (_digital media archives_).
- **Lưu trữ dữ liệu tuân thủ quy định** (_regulatory compliance_).
- **Dữ liệu tài chính, hồ sơ y tế**.
- **Lưu trữ dữ liệu gen** (_raw genomic sequence data_).
- **Sao lưu cơ sở dữ liệu dài hạn**.

# S3 Glacier Storage Classes

| Storage classes                             | **S3 Glacier Instant Retrieval**                                                          | **S3 Glacier Flexible Retrieval**                                                          | **S3 Glacier Deep Archive**                                                                     |
| ------------------------------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------- |
| **Thiết kế cho**                            | Dữ liệu lưu trữ lâu dài, truy cập mỗi quý với thời gian truy xuất tính bằng milliseconds. | Dữ liệu lưu trữ lâu dài, truy cập mỗi năm với thời gian truy xuất từ vài phút đến vài giờ. | Dữ liệu lưu trữ lâu dài, truy cập ít hơn một lần mỗi năm với thời gian truy xuất tính bằng giờ. |
| **Độ bền**                                  | 99.999999999% (11 số 9)                                                                   | 99.999999999% (11 số 9)                                                                    | 99.999999999% (11 số 9)                                                                         |
| **Khả dụng**                                | 99.9%                                                                                     | 99.99% (sau khi khôi phục dữ liệu)                                                         | 99.99% (sau khi khôi phục dữ liệu)                                                              |
| **Vùng khả dụng (AZ)**                      | ≥ 3                                                                                       | ≥ 3                                                                                        | ≥ 3                                                                                             |
| **Thời gian lưu trữ tối thiểu**             | 90 ngày                                                                                   | 90 ngày                                                                                    | 180 ngày                                                                                        |
| **Kích thước đối tượng tối thiểu tính phí** | 128 KB                                                                                    | 40 KB                                                                                      | 40 KB                                                                                           |
| **Lưu ý khác**                              | Tính phí truy xuất theo GB.                                                               | Tính phí truy xuất theo GB. Phải khôi phục dữ liệu trước khi truy cập.                     | Tính phí truy xuất theo GB. Phải khôi phục dữ liệu trước khi truy cập.                          |

- **S3 Glacier Instant Retrieval**
  - Dùng để lưu trữ dữ liệu hiếm khi được truy cập nhưng cần thời gian truy xuất tính bằng milliseconds.
- **S3 Glacier Flexible Retrieval (S3 Glacier Storage Class)**
  - Dùng để lưu trữ dữ liệu có thể cần truy xuất một phần trong vài phút.
  - Thời gian lưu trữ tối thiểu: **90 ngày**.
  - Có thể truy xuất trong **1-5 phút** bằng cách sử dụng chế độ **Expedited Retrieval**.
  - Có thể sử dụng **Bulk Retrieval miễn phí**, thời gian khôi phục **5-12 giờ**.
  - Hỗ trợ tối đa **1.000 yêu cầu khôi phục/giây** cho mỗi tài khoản AWS.
- **S3 Glacier Deep Archive**
  - Dùng để lưu trữ dữ liệu rất hiếm khi cần truy cập.
  - Là **tùy chọn lưu trữ có chi phí thấp nhất** trên AWS.
  - Chi phí truy xuất có thể giảm hơn nữa bằng **Bulk Retrieval** (dữ liệu được trả về trong **48 giờ**).
  - Thời gian lưu trữ tối thiểu: **180 ngày**.
  - Thời gian truy xuất mặc định: **12 giờ**.
  - Hỗ trợ tối đa **1.000 yêu cầu khôi phục/giây** cho mỗi tài khoản AWS.

# S3 Glacier Flexible Data Retrievals Options

S3 Glacier cung cấp **ba tùy chọn** truy xuất dữ liệu với **thời gian truy cập** và **chi phí khác nhau**:

- **Expedited Retrievals (Truy xuất nhanh)**
- **Standard Retrievals (Truy xuất tiêu chuẩn)**
- **Bulk Retrievals (Truy xuất hàng loạt)**

### **Expedited Retrievals (Truy xuất nhanh)**

- Dành cho các yêu cầu **khẩn cấp** cần truy xuất một phần dữ liệu.
- Thời gian lưu trữ tối thiểu: **90 ngày**.
- Dữ liệu thường được truy xuất **trong 1-5 phút**.
- Có **hai loại**:
  - **On-Demand**: Tương tự EC2 On-Demand, có sẵn hầu hết thời gian.
  - **Provisioned**: Đảm bảo có sẵn khi cần thiết.

### **Standard Retrievals (Truy xuất tiêu chuẩn)**

- Cho phép truy xuất **tất cả các kho lưu trữ** trong vài giờ.
- Thời gian truy xuất thường hoàn tất **trong 3-5 giờ**.

### **Bulk Retrievals (Truy xuất hàng loạt)**

- **Lựa chọn có chi phí thấp nhất**, phù hợp để truy xuất **khối lượng dữ liệu lớn** (hàng petabyte).
- Thời gian truy xuất thường hoàn tất **trong 5-12 giờ**.

# S3 Glacier Data Model

S3 Glacier có các thành phần chính trong mô hình dữ liệu, bao gồm: **Vaults, Archives, Jobs và Notification Configuration.**

### **Vault**

- Là **nơi chứa các tệp lưu trữ (archives)**.
- Mỗi vault có một **địa chỉ duy nhất**, bao gồm:
  - **Vùng AWS (Region)** nơi vault được tạo.
  - **Tên vault** trong khu vực đó và tài khoản AWS.
  - Ví dụ địa chỉ:
    ```bash
    https://glacier.us-west-2.amazonaws.com/111122223333/vaults/examplevault
    ```
- Một tài khoản AWS có thể tạo **tối đa 1.000 vaults mỗi vùng**.
- Vault có thể chứa **không giới hạn số lượng archives**.

### **Archive**

- Là **đơn vị lưu trữ cơ bản** trong Glacier (có thể là ảnh, video, tài liệu, v.v.).
- Mỗi archive có một **ID duy nhất** và **mô tả tùy chọn** khi tải lên.
- Glacier sẽ gán **ID duy nhất** cho mỗi archive trong một khu vực AWS.
- Archive có thể được tải lên theo **một lần** hoặc sử dụng **Multipart Upload** cho tệp lớn.
- Kích thước tối đa của một archive: **40TB**.

### **Jobs**

- **Job** được sử dụng để **truy xuất dữ liệu hoặc danh sách inventory của vault**.
- **Truy xuất dữ liệu là một thao tác bất đồng bộ**, yêu cầu **xếp hàng chờ** và có thể **mất đến 4 giờ** để hoàn tất.
- Một **Job ID** sẽ được gán khi tạo, giúp theo dõi tiến trình công việc.
- Các thông tin của Job có thể được truy vấn, bao gồm:
  - **Loại công việc**
  - **Mô tả**
  - **Ngày tạo**
  - **Ngày hoàn thành**
  - **Trạng thái**
- Sau khi hoàn tất, dữ liệu có thể được tải xuống **toàn bộ hoặc từng phần** bằng cách chỉ định một khoảng byte cụ thể.

### **Notification Configuration**

- Vì các job trong Glacier **diễn ra bất đồng bộ**, Glacier hỗ trợ **cấu hình thông báo qua SNS (Simple Notification Service)** khi công việc hoàn thành.
- Chủ đề SNS có thể được chỉ định:
  - Khi gửi yêu cầu job.
  - Hoặc gán sẵn cho vault để áp dụng cho mọi job trong vault đó.
- Glacier lưu trữ **cấu hình thông báo** dưới dạng **tài liệu JSON**.

# S3 Glacier Vault Lock

- **S3 Glacier Vault Lock** giúp triển khai và thực thi **các quy tắc tuân thủ (compliance controls)** cho từng vault trong S3 Glacier.
- Cho phép thiết lập **vault lock policy** để kiểm soát dữ liệu, chẳng hạn như:
  - **"Write Once Read Many" (WORM)** – dữ liệu chỉ được ghi một lần và không thể chỉnh sửa hoặc xóa.
- Sau khi khóa, **chính sách không thể thay đổi** trong tương lai.

# S3 Glacier Security

- **Mã hóa dữ liệu trong quá trình truyền** sử dụng **SSL (Secure Sockets Layer)** hoặc **mã hóa phía client**.
- **Mã hóa dữ liệu phía máy chủ (Server-side encryption)**:
  - AWS Glacier quản lý **khóa mã hóa và bảo vệ khóa**.
  - Sử dụng thuật toán **AES-256**, một trong những thuật toán mã hóa mạnh nhất hiện nay.
- **S3 Glacier đạt các chứng chỉ bảo mật và tuân thủ**:
  - **SOC** (System and Organization Controls)
  - **HIPAA** (Health Insurance Portability and Accountability Act)
  - **PCI DSS** (Payment Card Industry Data Security Standard)
  - **FedRAMP** (Federal Risk and Authorization Management Program)
