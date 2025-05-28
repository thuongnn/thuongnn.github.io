---
author: thuongnn
pubDatetime: 2023-05-08T09:15:33Z
title: "[AWS] Amazon CloudFront Security"
folder: "aws"
draft: false
tags:
  - AWS
  - Amazon Web Services
description: Tìm hiểu về các tính năng bảo mật của CloudFront, bao gồm SSL/TLS, signed URLs và field-level encryption.
---

Bài viết được tham khảo và tổng hợp lại từ Jayendra's Blog, xem bài viết gốc ở đây: https://jayendrapatil.com/aws-cloudfront-security.

## Table of contents

CloudFront Security có nhiều tính năng, bao gồm:

- Hỗ trợ mã hóa khi lưu trữ và truyền tải dữ liệu.
- Ngăn chặn người dùng ở các vị trí địa lý cụ thể truy cập nội dung.
- Cấu hình kết nối HTTPS.
- Sử dụng URL hoặc cookie đã ký để hạn chế quyền truy cập cho người dùng được chọn.
- Hạn chế quyền truy cập vào nội dung trong các bucket S3 bằng cách sử dụng **origin access identity (OAI)**, ngăn người dùng sử dụng URL trực tiếp của tệp.
- Thiết lập mã hóa ở cấp trường cho các trường nội dung cụ thể.
- Sử dụng AWS WAF web ACLs để tạo danh sách kiểm soát truy cập web (web ACL) nhằm hạn chế quyền truy cập vào nội dung của bạn.
- Sử dụng geo-restriction, còn được gọi là geoblocking, để ngăn người dùng ở các vị trí địa lý cụ thể truy cập nội dung được phục vụ qua phân phối CloudFront.
- Tích hợp với AWS Shield để bảo vệ khỏi các cuộc tấn công DDoS.

# Data Protection

- CloudFront hỗ trợ cả **Encryption at Rest** và **in Transit**.
- CloudFront cung cấp **Encryption in Transit** và có thể được cấu hình
  - Yêu cầu người dùng phải sử dụng HTTPS để yêu cầu các tệp, để các kết nối được mã hóa khi CloudFront giao tiếp với người dùng.
  - Sử dụng HTTPS để lấy tệp từ origin, để các kết nối được mã hóa khi CloudFront giao tiếp với origin.
  - HTTPS có thể được áp dụng bằng cách sử dụng Viewer Protocol Policy và Origin Protocol Policy.
- CloudFront cung cấp **Encryption at Rest**
  - Sử dụng SSD được mã hóa cho các edge location points of presence (POPs), và các encrypted EBS volumes cho Regional Edge Caches (RECs).
  - Function code và cấu hình luôn được lưu trữ dưới dạng mã hóa trên các encrypted SSDs tại các edge location POPs, và trong các vị trí lưu trữ khác được CloudFront sử dụng.

# Restrict Viewer Access

### Serving Private Content

- Để phục vụ nội dung riêng tư một cách an toàn bằng CloudFront
  - Yêu cầu người dùng truy cập nội dung riêng tư bằng cách sử dụng các **special CloudFront signed URLs** hoặc **signed cookies** với các hạn chế sau:
    - end date-time, sau đó URL sẽ không còn hợp lệ.
    - start date-time, khi URL trở nên hợp lệ.
    - IP address hoặc range IP được phép truy cập URL.
  - Yêu cầu người dùng chỉ truy cập nội dung S3 qua URL của CloudFront, không phải URL của S3. Việc yêu cầu URL của CloudFront không phải là bắt buộc, nhưng được khuyến khích để ngăn người dùng vượt qua các hạn chế được chỉ định trong signed URLs hoặc signed cookies.
- Signed URLs hoặc signed cookies có thể được sử dụng với CloudFront khi sử dụng máy chủ HTTP làm origin. Nó yêu cầu nội dung phải có thể truy cập công khai và cần lưu ý không chia sẻ trực tiếp URL của nội dung.
- Các origin restriction có thể được áp dụng như sau:
  - Đối với S3, sử dụng **Origin Access Identity – OAI** để chỉ cấp quyền truy cập cho CloudFront thông qua các Bucket policies hoặc Object ACL, cho nội dung và loại bỏ bất kỳ quyền truy cập nào khác.
  - Đối với Load balancer hoặc HTTP server, có thể thêm các custom headers bởi CloudFront mà có thể được sử dụng tại Origin để xác minh yêu cầu đã đến từ CloudFront.
  - Các custom origins cũng có thể được cấu hình để chỉ cho phép traffic từ các địa chỉ IP của CloudFront. [CloudFront managed prefix list](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/LocationsOfEdgeServers.html) có thể được sử dụng để chỉ cho phép traffic đến từ các server của CloudFront, ngăn cản traffic không phải từ CloudFront tiếp cận origin.
- Trusted Signer
  - Để tạo signed URLs hoặc signed cookies, ít nhất một tài khoản AWS (trusted signer) cần có một active CloudFront key pair.
  - Khi tài khoản AWS được thêm vào trusted signer cho distribution, CloudFront sẽ yêu cầu người dùng sử dụng signed URLs hoặc signed cookies để truy cập các đối tượng.
  - Private key của trusted signer để ký một phần của URL hoặc cookie. Khi ai đó yêu cầu một restricted object, CloudFront sẽ so sánh phần đã ký của URL hoặc cookie với phần chưa ký để xác minh rằng URL hoặc cookie chưa bị thay đổi. CloudFront cũng xác minh URL hoặc cookie có hợp lệ hay không, ví dụ, ngày và giờ đã hết hạn chưa.
  - Mỗi tài khoản Trusted signer AWS được sử dụng để tạo signed URLs hoặc signed cookies CloudFront phải có một active CloudFront key pair và cặp khóa này cần được thay đổi thường xuyên.
  - Tối đa 5 trusted signers có thể được chỉ định cho mỗi hành vi cache hoặc RTMP distribution.

### Signed URLs vs Signed Cookies

- Signed URLs hoặc signed cookies của CloudFront giúp bảo mật nội dung và cung cấp quyền kiểm soát ai có thể truy cập nội dung đó.
- Sử dụng signed URLs trong các trường hợp sau:
  - Để hạn chế quyền truy cập vào các tệp cá nhân, ví dụ, một tệp tải về cài đặt ứng dụng.
  - Người dùng sử dụng một client, ví dụ, một _custom HTTP client_, không hỗ trợ cookie.
- Sử dụng signed cookies trong các trường hợp sau:
  - Cung cấp quyền truy cập vào nhiều tệp bị hạn chế, ví dụ, tất cả các tệp video ở định dạng HLS hoặc tất cả các tệp trong khu vực dành cho người đăng ký của một trang web.
  - Không muốn thay đổi các URL hiện tại.
- Signed URLs có quyền ưu tiên hơn signed cookies, nếu cả signed URLs hoặc signed cookies đều được sử dụng để kiểm soát quyền truy cập vào cùng một tệp và người xem sử dụng signed URLs để yêu cầu một tệp, CloudFront sẽ quyết định có trả lại tệp cho người xem hay không chỉ dựa trên signed URLs.

### Canned Policy vs Custom Policy

- Canned policy hoặc Custom policy là một policy statement, được sử dụng bởi các Signed URLs, giúp xác định các restrictions, ví dụ như ngày và giờ hết hạn.
  ![1.png](@/assets/images/aws/networking/cloudfront-security/1.png)
- CloudFront xác thực thời gian hết hạn khi bắt đầu event.
- Nếu người dùng đang tải xuống một đối tượng lớn và URL hết hạn, quá trình tải xuống vẫn sẽ tiếp tục, và điều này cũng áp dụng với RTMP distribution.
- Tuy nhiên, nếu người dùng đang sử dụng yêu cầu GET phạm vi (range GET requests), hoặc khi đang phát video và bỏ qua một vị trí khác có thể kích hoạt một sựevent khác, yêu cầu sẽ bị lỗi.

### S3 Origin Access Identity – OAI

![2.png](@/assets/images/aws/networking/cloudfront-security/2.png)

- **Origin Access Identity (OAI)** có thể được sử dụng để ngăn người dùng truy cập trực tiếp các **object** từ S3.
- Các **object** S3 gốc phải được cấp quyền đọc công khai, vì vậy các **object** này có thể được truy cập từ cả S3 và CloudFront.
- Mặc dù CloudFront không lộ URL S3, người dùng vẫn có thể biết nếu URL này được chia sẻ trực tiếp hoặc được sử dụng bởi các ứng dụng.
- Để sử dụng CloudFront signed URLs hoặc signed cookies, cần phải ngăn người dùng truy cập trực tiếp các **object** S3.
- Người dùng truy cập trực tiếp các **object** S3 sẽ:
  - Vượt qua các kiểm soát được cung cấp bởi CloudFront signed URLs hoặc signed cookies, ví dụ như kiểm soát ngày giờ mà người dùng không còn truy cập được nội dung và các địa chỉ IP có thể được sử dụng để truy cập nội dung.
  - CloudFront access logs sẽ ít hữu ích hơn vì chúng không đầy đủ.
- **Origin Access Identity (OAI)**, là một người dùng đặc biệt của CloudFront, có thể được tạo và liên kết với phân phối.
- Cần cấu hình quyền **bucket**/**object** S3 để chỉ cấp quyền truy cập cho **Origin Access Identity**.
- Khi người dùng truy cập **object** từ CloudFront, CloudFront sẽ sử dụng OAI để lấy nội dung thay mặt người dùng, trong khi quyền truy cập trực tiếp **object** S3 bị hạn chế.

# Custom Headers

- Các **Custom headers** có thể được CloudFront thêm vào, và các header này có thể được sử dụng tại Origin để xác thực yêu cầu đã đến từ CloudFront
  ![3.png](@/assets/images/aws/networking/cloudfront-security/3.png)
- Một viewer truy cập vào trang web hoặc ứng dụng và yêu cầu một hoặc nhiều tệp, chẳng hạn như tệp hình ảnh và tệp HTML.
- DNS sẽ chuyển hướng yêu cầu đến edge location của CloudFront có thể phục vụ yêu cầu tốt nhất – thường là edge location gần nhất về mặt độ trễ.
- Tại edge location, AWS WAF kiểm tra yêu cầu đến dựa trên các web ACL rules đã được cấu hình.
- Tại edge location, CloudFront kiểm tra bộ nhớ cache của mình để tìm nội dung yêu cầu.
  - Nếu nội dung có sẵn trong bộ nhớ cache, CloudFront sẽ trả lại nội dung cho người dùng.
  - Nếu nội dung không có trong bộ nhớ cache, CloudFront sẽ thêm `Custom header X-Origin-Verify`, với secret từ **Secrets Manager**, và chuyển tiếp yêu cầu đến origin.
- Tại origin ALB, các ALB rules hoặc AWS WAF kiểm tra `Custom header X-Origin-Verify`, và cho phép yêu cầu nếu giá trị chuỗi hợp lệ. Nếu header không hợp lệ, AWS WAF sẽ chặn yêu cầu.
- Vào các khoảng thời gian đã cấu hình, **Secrets Manager** sẽ tự động rotate giá trị của **Custom header** và cập nhật cấu hình AWS WAF và CloudFront tại origin.

# Geo-Restriction – Geoblocking

- Geo restriction có thể giúp cho phép hoặc ngăn chặn người dùng từ các quốc gia được chọn truy cập nội dung.
- CloudFront distribution có thể được cấu hình để cho phép người dùng từ:
  - **Whitelist** các quốc gia được chỉ định truy cập nội dung.
  - Từ chối người dùng từ **blacklist** các quốc gia được chỉ định truy cập nội dung.
- Geo restriction có thể được sử dụng để hạn chế quyền truy cập vào tất cả các tệp liên quan đến phân phối và hạn chế quyền truy cập ở cấp độ quốc gia.
- CloudFront phản hồi yêu cầu từ một người xem ở quốc gia bị hạn chế bằng mã trạng thái HTTP 403 (Forbidden).
- Sử dụng third-party geolocation service nếu quyền truy cập cần bị hạn chế đối với một tập con của các tệp liên kết với phân phối hoặc để hạn chế quyền truy cập ở mức độ chi tiết hơn mức quốc gia.

# Field Level Encryption Config

- CloudFront có thể thực thi an toàn end-to-end connections đến các origin servers bằng cách sử dụng HTTPS.
- Field-level encryption thêm một lớp bảo mật bổ sung giúp bảo vệ dữ liệu cụ thể trong suốt quá trình xử lý hệ thống, đảm bảo rằng chỉ các ứng dụng nhất định mới có thể nhìn thấy dữ liệu đó.
- Field-level encryption có thể được sử dụng để tải lên một cách an toàn thông tin nhạy cảm do người dùng gửi. Thông tin nhạy cảm do khách hàng cung cấp sẽ được mã hóa tại các điểm edge gần người dùng và vẫn được mã hóa trong toàn bộ application stack, đảm bảo rằng chỉ những ứng dụng cần dữ liệu – và có chứng chỉ giải mã – mới có thể giải mã và sử dụng dữ liệu đó.
