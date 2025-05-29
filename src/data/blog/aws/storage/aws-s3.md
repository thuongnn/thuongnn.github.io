---
author: thuongnn
pubDatetime: 2023-07-10T13:45:28Z
modDatetime: 2023-07-10T13:45:28Z
title: "[AWS] Amazon Simple Storage Service (S3)"
folder: "aws"
draft: false
tags:
  - AWS
  - Amazon Web Services
description: Tìm hiểu về dịch vụ lưu trữ đối tượng có khả năng mở rộng cao của AWS, cung cấp khả năng lưu trữ và truy xuất dữ liệu từ bất kỳ đâu.
---

Bài viết được tham khảo và tổng hợp lại từ Jayendra's Blog, xem bài viết gốc ở đây: https://jayendrapatil.com/aws-s3.

## Table of contents

Amazon Simple Storage Service (S3) là dịch vụ lưu trữ đối tượng của Amazon Web Services (AWS). Nó cho phép các tổ chức lưu trữ và truy xuất lượng dữ liệu khổng lồ từ bất kỳ đâu trên thế giới thông qua giao diện web đơn giản. S3 cung cấp một nền tảng với độ bền cao, dễ sử dụng và dễ quản lý, phù hợp với nhiều ứng dụng từ sao lưu dữ liệu, đến phân phối nội dung.

### **Các tính năng chính của AWS S3**

- **Lưu trữ đối tượng:**
  AWS S3 lưu trữ dữ liệu dưới dạng các đối tượng, mỗi đối tượng bao gồm dữ liệu thực tế và siêu dữ liệu. Mỗi đối tượng có một khóa duy nhất trong một bucket.
- **Độ bền và khả năng phục hồi cao:**
  Với độ bền 99.999999999% (11.9s), Amazon S3 đảm bảo dữ liệu của bạn sẽ được bảo vệ khỏi sự cố phần cứng, và các sự cố khác.
- **Khả năng mở rộng tự động:**
  S3 có thể mở rộng quy mô linh hoạt và tự động, giúp bạn dễ dàng lưu trữ một lượng dữ liệu lớn mà không cần lo lắng về cơ sở hạ tầng.
- **Quản lý dữ liệu dễ dàng:**
  S3 cung cấp các công cụ mạnh mẽ để quản lý dữ liệu, bao gồm hỗ trợ versioning, tagging, và lifecycle policies. Các tính năng này giúp tối ưu hóa việc lưu trữ và giảm thiểu chi phí.

### **Các lớp lưu trữ (Storage Classes) của AWS S3**

- **S3 Standard:** Lớp lưu trữ cho dữ liệu truy cập thường xuyên, phù hợp với các ứng dụng có tần suất truy cập cao.
- **S3 Intelligent-Tiering:** Lớp lưu trữ tự động chuyển đổi giữa các lớp lưu trữ khác nhau, phù hợp cho dữ liệu có tần suất truy cập thay đổi.
- **S3 Glacier:** Dành cho lưu trữ dài hạn và dữ liệu không cần truy cập thường xuyên. Thời gian khôi phục dữ liệu khá lâu.
- **S3 Glacier Deep Archive:** Lớp lưu trữ chi phí thấp nhất, dành cho dữ liệu không truy cập và có thể khôi phục trong vài giờ.
- **S3 One Zone-IA:** Phù hợp cho dữ liệu ít truy cập và có thể chịu mất mát dữ liệu trong một khu vực duy nhất.

### **Tính năng bảo mật và kiểm soát truy cập**

- **Bucket Policies:**
  Chính sách quyền truy cập bucket giúp kiểm soát quyền truy cập vào các đối tượng trong từng bucket.
- **IAM Policies:**
  Cho phép bạn quản lý quyền truy cập đến các tài nguyên của AWS thông qua Identity and Access Management (IAM).
- **Mã hóa:**
  Amazon S3 hỗ trợ mã hóa cả khi lưu trữ (server-side encryption) và khi truyền tải (client-side encryption). Bạn có thể chọn mã hóa dữ liệu với AWS Key Management Service (KMS) hoặc các khóa mà bạn tự tạo.
- **Access Logs:**
  Lưu lại các nhật ký truy cập để theo dõi và kiểm tra các yêu cầu đến các đối tượng trong S3, từ đó hỗ trợ việc phát hiện các mối đe dọa bảo mật.

### **Quản lý dữ liệu trong S3**

- **Versioning:**
  Cho phép lưu trữ nhiều phiên bản của đối tượng trong cùng một bucket, giúp phục hồi dữ liệu khi bị thay đổi hoặc xóa.
- **Lifecycle Management:**
  Chính sách quản lý vòng đời tự động chuyển các đối tượng giữa các lớp lưu trữ hoặc xóa đối tượng khi không còn cần thiết.
- **Replication:**
  Hỗ trợ sao chép dữ liệu từ một bucket này sang một bucket khác, có thể sao chép trong cùng một khu vực hoặc giữa các khu vực khác nhau của AWS.
- **Event Notifications:**
  S3 có thể gửi thông báo khi có sự thay đổi đối với đối tượng, giúp tích hợp với các dịch vụ AWS khác như AWS Lambda để thực hiện các hành động tự động.

### **Các ứng dụng phổ biến của AWS S3**

- **Sao lưu và phục hồi:**
  S3 là giải pháp lý tưởng cho việc sao lưu dữ liệu, phục hồi khi có sự cố hoặc thảm họa xảy ra.
- **Lưu trữ và phân phối nội dung tĩnh:**
  Các tệp như hình ảnh, video, tài liệu có thể được lưu trữ và truy cập trực tiếp từ web. Điều này giúp tối ưu hóa việc phân phối nội dung đến người dùng.
- **Phân phối nội dung phương tiện:**
  Amazon S3 hỗ trợ lưu trữ và phân phối các tệp video, hình ảnh và âm thanh cho các ứng dụng truyền thông hoặc nền tảng truyền hình trực tuyến.
- **Phân tích dữ liệu lớn:**
  S3 kết hợp với các dịch vụ phân tích dữ liệu của AWS như Athena, Amazon Redshift, và EMR để giúp xử lý và phân tích khối lượng dữ liệu lớn.

### **Chi phí sử dụng AWS S3**

AWS S3 tính phí dựa trên các yếu tố sau:

- **Lưu trữ:**
  Phí tính theo dung lượng lưu trữ thực tế trong các lớp lưu trữ S3, và mức phí có thể thay đổi tùy thuộc vào loại lớp lưu trữ bạn chọn.
- **Lưu lượng mạng:**
  Phí tính cho việc truyền tải dữ liệu vào và ra khỏi các bucket của S3.
- **Yêu cầu API:**
  Phí cho các yêu cầu API như PUT, GET, LIST, DELETE. Các yêu cầu khác nhau có mức phí khác nhau.
- **Quản lý dữ liệu:**
  Phí liên quan đến việc di chuyển dữ liệu giữa các lớp lưu trữ hoặc sao chép dữ liệu.

### **Ưu điểm của AWS S3**

- **Độ bền và khả năng phục hồi:** Với độ bền 99.999999999%, dữ liệu của bạn sẽ được bảo vệ tốt nhất khỏi sự cố phần cứng và các sự cố ngoài ý muốn.
- **Khả năng mở rộng và linh hoạt:** S3 có thể dễ dàng mở rộng để lưu trữ lượng dữ liệu lớn mà không cần phải lo lắng về cơ sở hạ tầng.
- **Bảo mật mạnh mẽ:** Các tính năng bảo mật như mã hóa và kiểm soát truy cập giúp bảo vệ dữ liệu khỏi các mối đe dọa.
- **Chi phí linh hoạt:** Bạn chỉ phải trả tiền cho dung lượng và các yêu cầu mà bạn thực sự sử dụng, giúp tiết kiệm chi phí đáng kể, đặc biệt khi sử dụng các lớp lưu trữ như Glacier.

# Pre-Signed URLs

- **Khái niệm**:
  - **Pre-Signed URLs** (URL đã ký trước) là các liên kết đặc biệt được tạo ra để cho phép người dùng tải lên hoặc tải xuống một đối tượng từ Amazon S3 mà không cần phải có quyền truy cập AWS hay thông tin xác thực từ người dùng.
  - URL này chỉ có thể truy cập đối tượng mà nó chỉ định, miễn là người tạo URL đó có quyền truy cập vào đối tượng trong bucket.
- **Chức năng**:
  - **Tải lên và Tải xuống**: URL đã ký trước cho phép người dùng tải lên (PUT) hoặc tải xuống (GET) một đối tượng từ S3 mà không cần thông tin xác thực AWS. Nó cho phép chia sẻ quyền truy cập đối tượng trong một khoảng thời gian hạn chế.
  - **Bảo mật**: Được tạo ra bởi người có quyền truy cập đối tượng và có thời gian hết hạn. Sau thời gian này, URL không còn hợp lệ nữa.
- **Quy trình tạo Pre-Signed URL**:
  - **Thông tin cần có**: Người tạo URL cần cung cấp:
    - Chứng thực bảo mật (AWS credentials).
    - Tên bucket chứa đối tượng.
    - Khóa đối tượng (object key).
    - Phương thức HTTP (GET cho tải xuống và PUT cho tải lên).
    - Thời gian hết hạn của URL.
  - **Thời gian hết hạn**: URL chỉ có hiệu lực đến thời gian hết hạn được chỉ định. Sau đó, bất kỳ yêu cầu nào với URL sẽ bị từ chối.
- **Lợi ích**:
  - **Truy cập tạm thời**: Cho phép người dùng có thể tải lên hoặc tải xuống đối tượng mà không cần cấp toàn quyền truy cập vào toàn bộ bucket.
  - **Quản lý quyền truy cập**: Giúp quản lý quyền truy cập chi tiết và linh hoạt cho các đối tượng, rất hữu ích trong các tình huống yêu cầu quyền truy cập hạn chế hoặc chia sẻ tạm thời.
- **Ứng dụng**:
  - Sử dụng URL đã ký trước cho phép người dùng tải xuống các file từ S3 mà không cần có thông tin xác thực AWS.
  - Chia sẻ tạm thời quyền truy cập với người khác mà không cần phải chia sẻ thông tin xác thực của tài khoản AWS.
- **Hạn chế**:
  - **Hết hạn**: URL chỉ có hiệu lực trong một khoảng thời gian ngắn (thường là vài phút đến vài giờ), khiến người dùng không thể truy cập đối tượng mãi mãi.
  - **Phụ thuộc vào quyền của người tạo**: Quyền truy cập đối tượng của URL sẽ chỉ có nếu người tạo URL có quyền truy cập đối tượng đó.
- Tóm lại, Pre-Signed URLs là công cụ mạnh mẽ để cung cấp quyền truy cập tạm thời vào các đối tượng trong S3 mà không cần phải chia sẻ thông tin xác thực AWS, đồng thời giữ bảo mật cho các tài nguyên trong dịch vụ lưu trữ.

# Multipart Upload

- **Khái niệm**:
  - **Multipart Upload** cho phép người dùng tải lên một đối tượng lớn (hơn giới hạn tải lên thông thường) dưới dạng nhiều phần nhỏ.
  - Mỗi phần của đối tượng là một phần dữ liệu liên tục và có thể được tải lên độc lập và song song với các phần khác.
- **Lợi ích**:
  - **Tăng tốc độ tải lên**: Tải lên nhiều phần cùng lúc giúp cải thiện băng thông và hiệu suất.
  - **Khôi phục nhanh chóng**: Nếu có lỗi trong quá trình tải lên, chỉ cần tải lại phần bị lỗi mà không ảnh hưởng đến các phần khác.
  - **Tạm dừng và tiếp tục**: Có thể tạm dừng quá trình tải lên và tiếp tục vào lúc khác mà không mất dữ liệu.
  - **Tải lên trước khi biết kích thước cuối cùng của đối tượng**: Cho phép tải lên các phần của đối tượng trong khi nó vẫn đang được tạo ra.
- **Giới hạn**:
  - **Số phần**: Hỗ trợ tối đa 10,000 phần.
  - **Kích thước phần**: Mỗi phần có thể có kích thước từ 5MB đến 5GB, với phần cuối cùng có thể nhỏ hơn 5MB.
  - **Kích thước tối đa của đối tượng**: 5TB.
- **Quy trình Multipart Upload**:
  - **Khởi tạo Multipart Upload**: Bước đầu tiên là khởi tạo yêu cầu tải lên nhiều phần, AWS S3 sẽ trả về một **ID duy nhất** cho quá trình tải lên này. ID này sẽ được sử dụng để theo dõi và xử lý các phần tải lên.
  - **Tải lên các phần**: Sau khi khởi tạo, các phần của đối tượng sẽ được tải lên sử dụng ID duy nhất này. Mỗi phần được chỉ định bằng một số phần từ 1 đến 10,000.
  - **Hoàn thành Multipart Upload**: Sau khi tất cả các phần được tải lên, yêu cầu hoàn thành được gửi để AWS S3 ghép các phần lại với nhau và tạo đối tượng hoàn chỉnh.
  - **Hủy bỏ Multipart Upload**: Nếu quá trình tải lên bị hủy, yêu cầu hủy bỏ sẽ xóa các phần đã tải lên và không tính phí lưu trữ cho các phần này.
- **Quản lý tải lên**:
  - **Ghi đè**: Nếu một phần với số thứ tự giống nhau được tải lên, phần trước đó sẽ bị ghi đè.
  - **ETag**: Sau mỗi phần tải lên thành công, S3 sẽ trả về một **ETag** (mã nhận diện phần) trong phản hồi, người dùng cần lưu lại mã này để sử dụng trong quá trình hoàn thành.
- **Các bước cụ thể trong Multipart Upload**:
  - **Bước 1: Khởi tạo tải lên**: Gửi yêu cầu đến S3 để bắt đầu quá trình tải lên nhiều phần và nhận ID duy nhất.
  - **Bước 2: Tải lên các phần**: Các phần được tải lên độc lập, mỗi phần có thể có kích thước khác nhau và có thể được tải lên song song.
  - **Bước 3: Hoàn thành hoặc hủy bỏ**: Sau khi tất cả các phần được tải lên, yêu cầu hoàn thành hoặc hủy bỏ sẽ được gửi. Hoàn thành sẽ kết hợp tất cả các phần lại thành một đối tượng, còn hủy bỏ sẽ xóa các phần và không tính phí lưu trữ.
- **Các tình huống sử dụng**:
  - **Dữ liệu lớn**: Khi tải lên các đối tượng có kích thước rất lớn (từ hàng GB đến TB).
  - **Tăng cường hiệu suất**: Tải lên nhiều phần giúp giảm thời gian truyền tải và khôi phục nhanh chóng từ lỗi mạng.
- Tóm lại, **Multipart Upload** trong S3 là một phương pháp mạnh mẽ và linh hoạt để tải lên các đối tượng lớn một cách hiệu quả, cho phép tải lên song song, quản lý các phần độc lập và đảm bảo khả năng phục hồi nhanh chóng từ các lỗi trong quá trình tải lên.

# **S3 Transfer Acceleration (Tăng tốc truyền tải S3)**

- **Mô tả**: S3 Transfer Acceleration giúp việc truyền tải tệp tin giữa máy khách và bucket S3 trở nên nhanh chóng, dễ dàng và an toàn, ngay cả khi truyền tải qua khoảng cách dài.
- **Cách thức hoạt động**: Tính năng này tận dụng các vị trí edge phân phối toàn cầu của CloudFront. Khi dữ liệu đến một vị trí edge, nó sẽ được chuyển tiếp đến S3 qua một đường truyền tối ưu.
- **Phí sử dụng**: S3 Transfer Acceleration sẽ tính thêm phí, trong khi việc tải lên dữ liệu qua Internet công cộng sẽ miễn phí.

# **S3 Batch Operations (Thao tác hàng loạt trên S3)**

- **Mô tả**: S3 Batch Operations hỗ trợ thực hiện các thao tác hàng loạt quy mô lớn trên các đối tượng trong S3. Bạn có thể thực hiện một thao tác cụ thể trên một danh sách các đối tượng S3 được chỉ định.
- **Khả năng thực hiện**: Một công việc có thể thực hiện thao tác đã chỉ định trên hàng tỷ đối tượng, với dữ liệu có thể lên đến exabyte.
- **Quản lý**: S3 theo dõi tiến độ, gửi thông báo và lưu trữ báo cáo hoàn thành chi tiết của tất cả các hành động, cung cấp một trải nghiệm hoàn toàn được quản lý, có thể kiểm tra và không cần máy chủ.
- **Tích hợp với S3 Inventory**: Batch Operations có thể được sử dụng kết hợp với S3 Inventory để lấy danh sách các đối tượng và sử dụng S3 Select để lọc các đối tượng.
- **Các thao tác hỗ trợ**: Batch Operations có thể được sử dụng để sao chép đối tượng, sửa đổi metadata của đối tượng, áp dụng ACLs (Access Control Lists), mã hóa đối tượng, chuyển đổi đối tượng, kích hoạt hàm lambda tùy chỉnh, v.v.

# **Virtual Hosted Style vs Path-Style Request trong S3**

- **Virtual Hosted Style Request**:
  - **Cách thức**: Trong phương thức này, tên bucket là một phần của tên miền (domain name) trong URL.
  - **Cấu trúc URL**: `https://<bucket-name>.s3.amazonaws.com/<object-key>`
  - **Ví dụ**: `https://my-bucket.s3.amazonaws.com/my-file.txt`
  - **Ưu điểm**: Phù hợp với các yêu cầu mới nhất từ AWS. Thường được khuyến nghị vì tính linh hoạt và khả năng mở rộng cao.
  - **Lý do sử dụng**: Sử dụng phương thức này giúp giảm thiểu sự phụ thuộc vào các giới hạn về tên miền (domain name) và cho phép sử dụng các tính năng như CloudFront và S3 Transfer Acceleration dễ dàng hơn.
- **Path-Style Request**:
  - **Cách thức**: Trong phương thức này, tên bucket là một phần của đường dẫn (path) trong URL.
  - **Cấu trúc URL**: `https://s3.amazonaws.com/<bucket-name>/<object-key>`
  - **Ví dụ**: `https://s3.amazonaws.com/my-bucket/my-file.txt`
  - **Nhược điểm**: Trước đây, đây là phương thức mặc định nhưng hiện tại AWS khuyến khích sử dụng Virtual Hosted Style.
  - **Lý do sử dụng**: Phương thức này chủ yếu được sử dụng trong những tình huống cần hỗ trợ các bucket cũ hoặc khi có những giới hạn về tên miền. Tuy nhiên, nó không hỗ trợ một số tính năng mới của AWS, như S3 Transfer Acceleration.
- **Sự khác biệt chính**:
  - **Tên miền**: Trong Virtual Hosted Style, tên bucket nằm trong phần tên miền của URL, trong khi trong Path-Style Request, tên bucket là một phần của đường dẫn.
  - **Khả năng tương thích**: Virtual Hosted Style được ưu tiên hơn và hỗ trợ nhiều tính năng hiện đại hơn, bao gồm việc sử dụng với các tính năng như CloudFront và S3 Transfer Acceleration.
  - **Hỗ trợ**: AWS đang dần ngừng hỗ trợ Path-Style Request đối với các bucket mới và yêu cầu sử dụng Virtual Hosted Style.

Tóm lại, **Virtual Hosted Style** được khuyến khích và hỗ trợ các tính năng mới nhất, trong khi **Path-Style Request** là phương thức cũ hơn, chủ yếu được sử dụng trong những tình huống tương thích ngược với các bucket cũ.
