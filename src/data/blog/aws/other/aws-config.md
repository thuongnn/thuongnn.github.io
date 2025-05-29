---
author: thuongnn
pubDatetime: 2023-08-01T09:15:33Z
modDatetime: 2025-05-29T02:30:41Z
title: "[AWS] AWS Config"
folder: "aws"
draft: false
ogImage: "../../../../assets/images/aws/other/aws-config/1.png"
tags:
  - AWS
  - Amazon Web Services
description: Tìm hiểu về dịch vụ theo dõi, quản lý thay đổi và đánh giá tuân thủ cấu hình tài nguyên AWS.
---

Bài viết được tham khảo và tổng hợp lại từ Jayendra's Blog, xem bài viết gốc ở đây: https://jayendrapatil.com/aws-config.

## Table of contents

# Giới thiệu

- **AWS Config** là một dịch vụ được quản lý hoàn toàn, cung cấp **danh sách tài nguyên AWS**, **lịch sử cấu hình**, và **thông báo thay đổi cấu hình** để hỗ trợ **bảo mật**, **tuân thủ**, và **quản trị**.
- Cung cấp cái nhìn chi tiết về **cấu hình** của các tài nguyên AWS trong **tài khoản AWS**.
- Là một dịch vụ theo **region**.
- Chỉ là một dịch vụ **phát hiện** và **không ngăn chặn thay đổi**, nhưng tích hợp với các dịch vụ AWS khác để **khắc phục**.
- Cung cấp trạng thái **tại một thời điểm** và **lịch sử**, cho phép người dùng xem các thay đổi theo **dòng thời gian**.
- Chỉ ghi lại **cấu hình mới nhất** của tài nguyên trong trường hợp có nhiều thay đổi cấu hình được thực hiện nhanh chóng (tức là trong vài phút); điều này thể hiện **tác động tích lũy** của toàn bộ các thay đổi đó.
- **Không hỗ trợ** tất cả các dịch vụ AWS, và đối với các dịch vụ không được hỗ trợ, quá trình quản lý cấu hình có thể được **tự động hóa** bằng **API** và **mã** để so sánh dữ liệu hiện tại và quá khứ.
- Cung cấp các **quy tắc có thể tùy chỉnh**, **được định nghĩa sẵn**, cũng như khả năng **xác định quy tắc tùy chỉnh**.
- Có thể hỗ trợ các việc sau:
  - **Đánh giá cấu hình tài nguyên AWS** để đạt được các cài đặt mong muốn.
  - Lấy **snapshot** của các cấu hình hiện tại của các tài nguyên được hỗ trợ liên quan đến **tài khoản AWS** của bạn.
  - **Truy xuất cấu hình** của một hoặc nhiều tài nguyên hiện có trong tài khoản.
  - **Truy xuất lịch sử cấu hình** của một hoặc nhiều tài nguyên.
  - Nhận **thông báo** bất cứ khi nào một tài nguyên được **tạo**, **sửa đổi**, hoặc **xóa**.
  - Xem **mối quan hệ** giữa các tài nguyên
    _Ví dụ: bạn có thể muốn tìm tất cả các tài nguyên sử dụng một security group cụ thể_.

# **AWS Config Use Cases**

- **Security Analysis & Resource Administration**:
  - Cho phép **giám sát liên tục** và **quản trị** cấu hình tài nguyên, giúp đánh giá chúng để phát hiện các **lỗ hổng bảo mật** hoặc **yếu điểm** do cấu hình sai.
- **Auditing & Compliance**:
  - Giúp duy trì một **danh sách đầy đủ** của tất cả các tài nguyên và **thuộc tính cấu hình** của chúng cũng như **lịch sử tại một thời điểm**.
  - Hỗ trợ **truy xuất cấu hình lịch sử**, rất hữu ích để đảm bảo **tuân thủ** và **kiểm toán** với các chính sách nội bộ và thực tiễn tốt nhất.
- **Change Management**:
  - Giúp **hiểu mối quan hệ** giữa các tài nguyên để có thể **đánh giá trước** tác động của thay đổi.
  - Có thể được cấu hình để **thông báo** bất cứ khi nào tài nguyên được **tạo**, **sửa đổi**, hoặc **xóa** mà không cần giám sát các thay đổi này bằng cách thăm dò các lệnh gọi được thực hiện cho mỗi tài nguyên.
- **Troubleshooting**:
  - Giúp **xác định nhanh chóng** và **khắc phục sự cố**, bằng cách sử dụng **cấu hình lịch sử** để so sánh **cấu hình hoạt động cuối cùng** với thay đổi gần đây gây ra sự cố.
- **Discovery**:
  - Giúp **khám phá** các tài nguyên hiện có trong tài khoản, dẫn đến việc **quản lý danh sách** và **tài sản** tốt hơn.
  - Lấy **snapshot** của các cấu hình hiện tại của các tài nguyên được hỗ trợ liên quan đến **tài khoản AWS**.

# **AWS Config Concepts**

![1.png](@/assets/images/aws/other/aws-config/1.png)

- **AWS Resources**:
  - Là các thực thể được **tạo** và **quản lý** _ví dụ: phiên bản EC2, Security groups_.
- **Resource Relationship**:
  - AWS Config **khám phá** các tài nguyên AWS trong **tài khoản** và sau đó tạo một **bản đồ mối quan hệ** giữa các tài nguyên AWS
    _Ví dụ: EBS volume liên kết với một phiên bản EC2_.
- **Configuration Items**:
  - Một **configuration item** thể hiện một **cái nhìn tại một thời điểm** của **tài nguyên AWS được hỗ trợ**.
  - Các thành phần của một **configuration item** bao gồm **metadata**, **thuộc tính**, **mối quan hệ**, **cấu hình hiện tại**, và **các sự kiện liên quan**.
- **Configuration Snapshot**:
  - Một **configuration snapshot** là một tập hợp các **configuration items** cho các tài nguyên được hỗ trợ hiện có trong tài khoản.
- **Configuration History**:
  - Một **configuration history** là một tập hợp các **configuration items** cho một tài nguyên nhất định trong bất kỳ khoảng thời gian nào.
- **Configuration Stream**:
  - **Configuration stream** là một danh sách được **cập nhật tự động** của tất cả các **configuration items** cho các tài nguyên mà AWS Config đang ghi lại.
- **Configuration Recorder**:
  - **Configuration recorder** lưu trữ các cấu hình của các tài nguyên được hỗ trợ trong tài khoản của bạn dưới dạng **configuration items**.
  - Cần **tạo** và **khởi động** một **configuration recorder** để ghi lại và theo mặc định ghi lại **tất cả các dịch vụ được hỗ trợ** trong **region**.
- **AWS Config Rules**:
  - **AWS Config Rules** giúp xác định các **cài đặt cấu hình mong muốn** cho các tài nguyên cụ thể hoặc cho **toàn bộ tài khoản**.
  - AWS Config **liên tục theo dõi** các thay đổi cấu hình tài nguyên so với các **quy tắc** và nếu vi phạm, đánh dấu tài nguyên là **non-compliant**.
  - Hỗ trợ **Managed Rules** và **Custom Rules**.
  - Hỗ trợ các chế độ đánh giá **Proactive** (trước khi cung cấp tài nguyên) và **Detective** (sau khi cung cấp tài nguyên).
  - Có thể được kích hoạt **định kỳ** hoặc **theo thay đổi cấu hình**.

# **AWS Config Flow**

![2.png](@/assets/images/aws/other/aws-config/2.png)

- Khi **AWS Config** được bật, nó **khám phá** các tài nguyên được hỗ trợ hiện có trong tài khoản và tạo một **configuration item** cho mỗi tài nguyên.
- Theo mặc định, AWS Config tạo **configuration items** cho **mọi tài nguyên được hỗ trợ** trong **region** nhưng có thể được tùy chỉnh để giới hạn ở các **loại tài nguyên** cụ thể.
- **AWS Config**:
  - Tạo **configuration items** khi **cấu hình** của một tài nguyên thay đổi, và nó duy trì **hồ sơ lịch sử** của các **configuration items** của các tài nguyên từ thời điểm **configuration recorder** được khởi động.
  - Theo dõi **tất cả các thay đổi** đối với các tài nguyên bằng cách gọi **Describe** hoặc **List API** cho mỗi tài nguyên cũng như các tài nguyên liên quan trong tài khoản.
  - Cũng theo dõi các **thay đổi cấu hình** không được khởi tạo bởi **API**. Nó **kiểm tra định kỳ** cấu hình tài nguyên và tạo **configuration items** cho các cấu hình đã thay đổi.
- **Configuration items** được gửi trong một **configuration stream** đến một **S3 bucket**.
- **AWS Config rules**, nếu được cấu hình:
  - Được **đánh giá liên tục** cho các cấu hình tài nguyên để đạt được **cài đặt mong muốn**.
  - Các tài nguyên được **đánh giá** hoặc theo **thay đổi cấu hình** hoặc **định kỳ**, tùy thuộc vào quy tắc.
  - Khi các tài nguyên được đánh giá, nó gọi **hàm Lambda** của quy tắc, chứa **logic đánh giá** cho quy tắc.
  - Hàm trả về **trạng thái tuân thủ** của các tài nguyên được đánh giá.
  - Nếu một tài nguyên vi phạm các điều kiện của một quy tắc, tài nguyên và quy tắc được đánh dấu là **non-compliant** và một **thông báo** được gửi đến **SNS topic**.

# **AWS Config Remediation**

![3.png](@/assets/images/aws/other/aws-config/3.png)

- **AWS Config** chỉ là một dịch vụ **phát hiện** và **không ngăn chặn thay đổi**, nhưng tích hợp với các dịch vụ AWS khác để **khắc phục**.
- Cho phép **khắc phục** các tài nguyên **non-compliant** được đánh giá bởi **config rules**.
- **Khắc phục** được áp dụng bằng các **Systems Manager Automation documents**, xác định các **hành động** sẽ được thực hiện trên các tài nguyên AWS **non-compliant**.
- Cung cấp một tập hợp các **automation documents được quản lý** với các hành động khắc phục.
- Các **automation documents tùy chỉnh** cũng có thể được tạo và liên kết với các **quy tắc**.

# **Multi-Account Multi-Region Data Aggregation**

- Một **aggregator** giúp thu thập **dữ liệu cấu hình** và **tuân thủ AWS Config** từ các nguồn sau:
  - **Nhiều tài khoản** và **nhiều regions**.
  - **Một tài khoản** và **nhiều regions**.
  - Một **tổ chức** trong [AWS Organizations](https://jayendrapatil.com/aws-organizations/) và **tất cả các tài khoản** trong tổ chức đó đã bật **AWS Config**.

# **AWS Config vs [CloudTrail](../Analytics%2039e8d9e64dba48e5ae035778f9e6131d/CloudTrail%201d63fa6ae483808c99c2cccb78cf4970.md)**

- **AWS Config** báo cáo về **CÁI GÌ** đã **thay đổi**, trong khi **CloudTrail** báo cáo về **AI** đã thực hiện **thay đổi**, **KHI NÀO** và từ **VỊ TRÍ NÀO**.
- **AWS Config** tập trung vào **cấu hình** của các **tài nguyên AWS** và báo cáo với các **ảnh chụp chi tiết** về **CÁCH** tài nguyên đã **thay đổi**, trong khi **CloudTrail** tập trung vào các **sự kiện**, hoặc **lệnh gọi API**, thúc đẩy những **thay đổi** đó. Nó tập trung vào **người dùng**, **ứng dụng** và **hoạt động** được thực hiện trên **hệ thống**.
