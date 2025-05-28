---
author: thuongnn
pubDatetime: 2023-01-15T09:15:22Z
title: "[AWS] AWS CloudTrail"
draft: false
tags:
  - AWS
  - Amazon Web Services
description: Tìm hiểu về dịch vụ ghi lại hoạt động của tài khoản AWS, giúp theo dõi và kiểm soát các thay đổi trong tài nguyên AWS.
---

Bài viết được tham khảo và tổng hợp lại từ Jayendra's Blog, xem bài viết gốc ở đây: https://jayendrapatil.com/aws-cloudtrail.

## Table of contents

- AWS CloudTrail giúp kích hoạt **quản trị**, **tuân thủ**, **vận hành** và **kiểm toán rủi ro** cho tài khoản AWS.
- CloudTrail hỗ trợ lấy **lịch sử các lệnh gọi API AWS** và các sự kiện liên quan cho tài khoản AWS.
- CloudTrail ghi lại các **hành động** do người dùng, vai trò hoặc dịch vụ AWS thực hiện.
- CloudTrail theo dõi bao gồm các lệnh gọi được thực hiện qua **AWS Management Console**, **AWS SDKs**, **Command-line tools (CLI)**, **APIs** và các dịch vụ AWS cấp cao (như [AWS CloudFormation](https://jayendrapatil.com/aws-cloudformation/)).
- CloudTrail giúp xác định **người dùng và tài khoản nào** đã gọi AWS, **địa chỉ IP nguồn** của các lệnh gọi và **thời điểm** các lệnh gọi xảy ra.
- CloudTrail được **bật** trên tài khoản AWS của bạn khi bạn tạo nó.
- CloudTrail hoạt động theo **từng tài khoản AWS** và **từng region** cho tất cả các dịch vụ được hỗ trợ.
- **Lịch sử lệnh gọi API AWS** của CloudTrail cho phép **phân tích bảo mật**, **theo dõi thay đổi tài nguyên** và **kiểm toán tuân thủ**.
- **CloudTrail event history** cung cấp bản ghi có thể **xem**, **tìm kiếm** và **tải xuống** của các sự kiện CloudTrail trong **90 ngày** qua.
- Nhật ký CloudTrail có thể được **mã hóa** bằng **S3 SSE-S3** mặc định hoặc **KMS**.
- [CloudTrail log file integrity](https://jayendrapatil.com/aws-cloudtrail/#CloudTrail_Log_File_Integrity) có thể được sử dụng để kiểm tra xem tệp nhật ký có bị **sửa đổi**, **xóa** hay **không thay đổi** sau khi CloudTrail gửi nó.
- CloudTrail tích hợp với [AWS Organizations](https://jayendrapatil.com/aws-organizations/) và cung cấp [**organization trail**](https://jayendrapatil.com/aws-cloudtrail/#CloudTrail_with_AWS_Organizations) cho phép gửi các sự kiện trong **tài khoản quản lý**, **tài khoản quản trị được ủy quyền** và **tất cả tài khoản thành viên** trong tổ chức đến cùng một **S3 bucket**, **CloudWatch Logs** và **CloudWatch Events**.
- **CloudTrail Insights** có thể được bật trên một trail để giúp **xác định** và **phản ứng** với **hoạt động bất thường**.
- **CloudTrail Lake** hỗ trợ chạy các **truy vấn SQL chi tiết** trên các sự kiện.

# CloudTrail Works

![1.png](@/assets/images/analytics/cloudtrail/1.png)

- AWS CloudTrail **ghi lại các lệnh gọi API AWS** và các sự kiện liên quan được thực hiện bởi hoặc thay mặt tài khoản AWS và gửi các tệp nhật ký đến một **S3 bucket** được chỉ định.
- [S3 lifecycle rules](https://jayendrapatil.com/aws-s3-object-lifecycle-management/) có thể được áp dụng để **lưu trữ** hoặc **xóa** các tệp nhật ký tự động.
- Các tệp nhật ký chứa các lệnh gọi API từ tất cả các [**dịch vụ hỗ trợ CloudTrail của tài khoản**](http://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-supported-services.html).
- Các tệp nhật ký từ tất cả các **regions** có thể được gửi đến một **S3 bucket** duy nhất và được **mã hóa mặc định** bằng **S3 server-side encryption (SSE)**. Mã hóa có thể được cấu hình với [AWS KMS](../Security%20e4866a84c8394a59a8b36134d185a247/AWS%20Key%20Management%20Service%20%E2%80%93%20KMS%201683fa6ae48380e89396ec86f8ad95be.md).
- CloudTrail **xuất bản các tệp nhật ký mới** nhiều lần mỗi giờ, thường khoảng **mỗi 5 phút**, và thường gửi các tệp nhật ký trong vòng **15 phút** sau một lệnh gọi API.
- CloudTrail có thể được cấu hình, tùy chọn, để gửi sự kiện đến một **log group** để được giám sát bởi [CloudWatch Logs](CloudWatch%20EventBridge%201d63fa6ae48380329d0cd1aef89a09f4/CloudWatch%20Logs%201d73fa6ae48380599cf4edf6838a5e71.md).
- [SNS](https://www.notion.so/1d63fa6ae48380c3aa39c7b1d8926498?pvs=21) **notifications** có thể được cấu hình để gửi mỗi khi một tệp nhật ký được gửi đến **bucket** của bạn.
- Một **Trail** là một cấu hình cho phép ghi lại **hoạt động API AWS** và gửi các sự kiện đến một **S3 bucket** được chỉ định.
- **Trail** có thể được tạo bằng **CloudTrail console**, **AWS CLI** hoặc **CloudTrail API**.
- Các sự kiện trong một trail cũng có thể được gửi và phân tích với [CloudWatch Logs](CloudWatch%20EventBridge%201d63fa6ae48380329d0cd1aef89a09f4/CloudWatch%20Logs%201d73fa6ae48380599cf4edf6838a5e71.md) và **EventBridge**.
- Một **Trail** có thể được áp dụng cho **tất cả regions** hoặc **một region** duy nhất:
  - Một **trail** áp dụng cho **tất cả regions**:
    - Khi một **trail** được tạo áp dụng cho **tất cả regions**, CloudTrail tạo cùng một **trail** ở mỗi **region**, ghi lại các tệp nhật ký ở mỗi **region** và gửi các tệp nhật ký đến **S3 bucket** được chỉ định (và tùy chọn đến **CloudWatch Logs log group**).
    - Là cấu hình mặc định khi một **trail** được tạo bằng **CloudTrail console**.
    - Một **SNS topic** duy nhất cho **notifications** và **CloudWatch Logs log group** cho các sự kiện là đủ cho **tất cả regions**.
    - **Lợi ích**:
      - **Cài đặt cấu hình** cho **trail** áp dụng **nhất quán** trên **tất cả regions**.
      - **Quản lý cấu hình trail** cho **tất cả regions** từ **một vị trí**.
      - **Nhận ngay các sự kiện** từ một **region mới**.
      - **Nhận các tệp nhật ký** từ **tất cả regions** trong một **S3 bucket** duy nhất và tùy chọn trong một **CloudWatch Logs log group**.
      - **Tạo trail** ở các **regions** ít sử dụng để **giám sát hoạt động bất thường**.
  - Một **trail** áp dụng cho **một region**:
    - Một **S3 bucket** có thể được chỉ định để nhận sự kiện chỉ từ **region** đó và nó có thể ở bất kỳ **region** nào bạn chỉ định.
    - Các **trail riêng lẻ bổ sung** được tạo áp dụng cho các **regions** cụ thể, các **trail** đó có thể gửi nhật ký sự kiện đến một **S3 bucket** duy nhất.
- **Turning on a trail** có nghĩa là **tạo một trail** và **bắt đầu ghi nhật ký**.
- CloudTrail hỗ trợ **5 trail** trên mỗi **region**. Một **trail** áp dụng cho **tất cả regions** được tính là **1 trail** ở mỗi **region**.
- [IAM](https://jayendrapatil.com/aws-iam-overview/) có thể kiểm soát **người dùng AWS** nào có thể **tạo**, **cấu hình** hoặc **xóa trail**, **bắt đầu** và **dừng ghi nhật ký**, và **truy cập các bucket** chứa thông tin nhật ký.
- **Log file integrity validation** có thể được bật để **xác minh** rằng các tệp nhật ký **không bị thay đổi** kể từ khi CloudTrail gửi chúng.
- **CloudTrail Lake** hỗ trợ chạy các **truy vấn SQL chi tiết** trên các sự kiện.

# **CloudTrail with AWS Organizations**

- Với [AWS Organizations](https://jayendrapatil.com/aws-organizations/), một **Organization trail** có thể được tạo để **ghi lại tất cả các sự kiện** cho **tất cả tài khoản AWS** trong tổ chức đó.
- **Organization trail** có thể áp dụng cho **tất cả AWS Regions** hoặc **một Region**.
- **Organization trail** phải được tạo trong **tài khoản quản lý**, và khi được chỉ định áp dụng cho một **tổ chức**, sẽ **tự động áp dụng** cho **tất cả tài khoản thành viên** trong tổ chức.
- Các **tài khoản thành viên** sẽ có thể **thấy organization trail**, nhưng **không thể sửa đổi hoặc xóa** nó.
- Theo mặc định, các **tài khoản thành viên** sẽ **không có quyền truy cập** vào các tệp nhật ký cho **organization trail** trong **S3 bucket**.

# **CloudTrail Events**

- Một **sự kiện** trong CloudTrail là **bản ghi hoạt động** trong tài khoản AWS.
- Các **sự kiện CloudTrail** cung cấp **lịch sử** của cả **hoạt động API** và **không phải API** được thực hiện qua **AWS Management Console**, **AWS SDKs**, **command line tools** và các dịch vụ AWS khác.
- CloudTrail có các **loại sự kiện** sau:
  - **Management Events**:
    - Các **Management Events** cung cấp thông tin về các thao tác **control plane** được thực hiện trên tài nguyên.
    - Bao gồm các sự kiện **tạo**, **sửa đổi** và **xóa** tài nguyên.
    - Theo mặc định, các **trail** ghi lại **tất cả Management Events** cho tài khoản AWS.
  - **Data Events**:
    - Các **Data Events** cung cấp thông tin về các thao tác **data plane** được thực hiện trên hoặc trong một tài nguyên.
    - Bao gồm các **Data Events** như **đọc** và **ghi** đối tượng trong **S3** hoặc các mục trong [DynamoDB](../Databases%202ff18f128b9144a18af06ffcbaec7210/AWS%20DynamoDB%201d03fa6ae48380d489a2f25505172f7a.md).
    - Theo mặc định, các **trail** **không ghi lại Data Events** cho tài khoản AWS.
  - **CloudTrail Insights Event**:
    - Các **CloudTrail Insights Events** ghi lại **hoạt động bất thường** về **tỷ lệ lệnh gọi API** hoặc **tỷ lệ lỗi** trong tài khoản AWS.
    - Một **Insights Event** là bản ghi của các **mức độ bất thường** trong hoạt động **write management API**, hoặc các **mức độ lỗi bất thường** được trả về trên hoạt động **management API**.
    - Theo mặc định, các **trail** **không ghi lại CloudTrail Insights Events**.
    - Khi được bật, CloudTrail **phát hiện hoạt động bất thường**, và các **Insights Events** được ghi vào một **thư mục hoặc tiền tố khác** trong **S3 bucket** đích cho **trail**.
    - Các **Insights Events** cung cấp **thông tin liên quan**, chẳng hạn như **API liên quan**, **mã lỗi**, **thời gian sự cố** và **thống kê**, giúp bạn **hiểu** và **hành động** với **hoạt động bất thường**.
    - Không giống như các **loại sự kiện khác** được ghi lại trong một **trail CloudTrail**, các **Insights Events** chỉ được ghi lại khi CloudTrail **phát hiện các thay đổi đáng kể** trong **việc sử dụng API** của tài khoản hoặc **ghi nhật ký tỷ lệ lỗi** khác biệt đáng kể so với **mẫu sử dụng điển hình** của tài khoản.

# Global Services Option

- Đối với hầu hết các dịch vụ, các **sự kiện** được gửi đến **region** nơi **hành động** xảy ra.
- Đối với các **dịch vụ toàn cầu** như [IAM](https://jayendrapatil.com/aws-iam-overview/), **AWS STS** và [CloudFront](../Networking%20ca0a21a6ceb64d3fbc7b62fe954794df/CloudFront%2015a3fa6ae48380209873f76872cef294.md), các **sự kiện** được gửi đến bất kỳ **trail** nào có bật **Include global services option**.
- Các **hành động** của AWS [OpsWorks](https://jayendrapatil.com/aws-opsworks/) và [Route 53](../Networking%20ca0a21a6ceb64d3fbc7b62fe954794df/Route%2053%2015a3fa6ae483804a9946f7a524624547.md) được ghi lại trong **region US East (N. Virginia)**.
- Để tránh nhận các **sự kiện dịch vụ toàn cầu trùng lặp**, hãy nhớ:
  - Các **sự kiện dịch vụ toàn cầu** luôn được gửi đến các **trail** có bật **Apply trail to all regions option**.
  - Các **sự kiện** được gửi từ một **region duy nhất** đến **bucket** cho **trail**. **Cài đặt** này **không thể thay đổi**.
  - **Nếu bạn có một trail một region, bạn nên bật Include global services option.**
  - **Nếu bạn có nhiều trail một region, bạn nên bật Include global services option chỉ trong một trong các trail.**
- Về các **sự kiện dịch vụ toàn cầu**:
  - Có **trail** với **Apply trail to all regions option** được bật.
  - Có **nhiều trail một region**.
  - **Không cần bật Include global services option** cho các **trail một region**. Các **sự kiện dịch vụ toàn cầu** được gửi cho **trail đầu tiên**.

# **CloudTrail Log File Integrity**

- Các **tệp nhật ký được xác thực** rất **quý giá** trong các **security và forensic investigations**.
- **CloudTrail log file integrity validation** có thể được sử dụng để kiểm tra xem tệp nhật ký có bị **sửa đổi**, **xóa** hay **không thay đổi** sau khi CloudTrail gửi nó.
- Tính năng **xác thực** được xây dựng bằng các **industry-standard algorithms**: **SHA-256** cho **băm** và **SHA-256 với RSA** cho **ký số**, khiến việc **sửa đổi**, **xóa** hoặc **giả mạo** các tệp nhật ký CloudTrail mà **không bị phát hiện** là **không khả thi về mặt tính toán**.
- Khi **log file integrity validation** được bật:
  - CloudTrail tạo một **băm** cho mỗi tệp nhật ký mà nó gửi.
  - **Mỗi giờ**, CloudTrail cũng tạo và gửi một **digest file** tham chiếu các tệp nhật ký cho **giờ trước** và chứa một **băm** của mỗi tệp.
  - CloudTrail **ký** mỗi **digest file** bằng **private key** của một **cặp khóa công khai và riêng**.
  - Sau khi gửi, **public key** có thể được sử dụng để **xác thực digest file**.
  - CloudTrail sử dụng các **cặp khóa khác nhau** cho mỗi **AWS region**.
  - Các **digest file** được gửi đến cùng **S3 bucket**, nhưng trong một **thư mục riêng**, liên quan đến **trail** cho các tệp nhật ký.
  - Việc **tách biệt các digest file và tệp nhật ký** cho phép thực thi các **chính sách bảo mật chi tiết** và cho phép các **giải pháp xử lý nhật ký hiện có** tiếp tục hoạt động mà **không cần sửa đổi**.
  - Mỗi **digest file** cũng chứa **chữ ký số** của **digest file trước đó** nếu có.
  - **Chữ ký** cho **digest file hiện tại** nằm trong **metadata properties** của **digest file S3 object**.
  - Các **tệp nhật ký** và **digest file** có thể được **lưu trữ** trong **S3** hoặc [Glacier](../Storage%2070aaf40d3b5b466d957e7eb24935e1fa/AWS%20S3%20Glacier%2073945293d15a4aa2af3cb39477817f6b.md) một cách **an toàn**, **bền vững** và **chi phí thấp** trong **thời gian không xác định**.
  - Để **tăng cường bảo mật** cho các **digest file** lưu trữ trong **S3**, **S3 MFA Delete** có thể được bật.

# **CloudTrail Enabled Use Cases**

- **Theo dõi thay đổi tài nguyên AWS**:
  - Có thể được sử dụng để **theo dõi việc tạo**, **sửa đổi** hoặc **xóa** tài nguyên AWS.
- **Hỗ trợ tuân thủ**:
  - **Dễ dàng chứng minh tuân thủ** với các **chính sách nội bộ** và **tiêu chuẩn quy định**.
- **Khắc phục sự cố vận hành**:
  - **Xác định các thay đổi** hoặc **hành động gần đây** để **khắc phục** bất kỳ **vấn đề** nào.
- **Phân tích bảo mật**:
  - Sử dụng các **tệp nhật ký** làm đầu vào cho các **công cụ phân tích nhật ký** để thực hiện **phân tích bảo mật** và **phát hiện các mẫu hành vi người dùng**.

# CloudTrail Processing Library (CPL)

- **CloudTrail Processing Library (CPL)** giúp xây dựng các **ứng dụng** để **hành động ngay lập tức** trên các **sự kiện** trong các tệp nhật ký CloudTrail.
- **CPL** hỗ trợ:
  - **Đọc các tin nhắn** được gửi đến **SNS** hoặc **SQS**.
  - **Tải xuống và đọc** các tệp nhật ký từ **S3** **liên tục**.
  - **Chuyển đổi** các sự kiện thành **POJO**.
  - Cho phép **triển khai logic tùy chỉnh** để **xử lý**.
  - **Chịu lỗi** và hỗ trợ **đa luồng**.

# **AWS CloudTrail vs AWS Config**

- [AWS Config](../Other%20862fb7a6d1454efda0b6564bc680f6bc/AWS%20Config%201d63fa6ae48380cdacf6d347ad59bb7b.md) báo cáo về **CÁI GÌ** đã **thay đổi**, trong khi CloudTrail báo cáo về **AI** đã thực hiện **thay đổi**, **KHI NÀO** và từ **VỊ TRÍ NÀO**.
- AWS Config tập trung vào **cấu hình** của các **tài nguyên AWS** và báo cáo với các **ảnh chụp chi tiết** về **CÁCH** tài nguyên đã **thay đổi**, trong khi CloudTrail tập trung vào các **sự kiện**, hoặc **lệnh gọi API**, thúc đẩy những **thay đổi** đó. Nó tập trung vào **người dùng**, **ứng dụng** và **hoạt động** được thực hiện trên **hệ thống**.
