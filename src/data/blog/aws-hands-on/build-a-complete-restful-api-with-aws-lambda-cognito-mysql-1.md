---
author: thuongnn
pubDatetime: 2019-05-19T22:20:35Z
modDatetime: 2019-05-19T22:20:35Z
title: "[Phần 1] Xây dựng RESTful API hoàn chỉnh với AWS Lambda + Cognito + MySQL"
draft: false
tags:
  - AWS
  - Devops
  - Architecture
description: Triển khai kiến trúc serverless với AWS Cloud phần 1.
ogImage: https://github.com/user-attachments/assets/af00c828-7de7-42d3-bf7e-d56e3d6b28a2
---

Có một lần đi xem bảo vệ đồ án của một anh cùng phòng, mình đã tình cờ biết đến kiến trúc Serverless và Amazon AWS. Sau một thời gian tìm hiểu và vọc code, mình bắt đầu series này để chia sẻ lại những kiến thức mà mình tìm hiểu và tích lũy được.

Trong series bài viết này mình sẽ hướng dẫn mọi người cách sử dụng kiến trúc [Serverless](https://thuongnn.me) để xây dựng một RESTful API hoàn chỉnh trong một dự án. Để hiểu rõ hơn về các dịch vụ của [Amazon](https://aws.amazon.com/) được sử dụng trong series này thì mình sẽ đi tìm hiểu về nó trước đã nhé :3

## Table of contents

## Kiến trúc Serverless là gì?

![](https://github.com/user-attachments/assets/af00c828-7de7-42d3-bf7e-d56e3d6b28a2)

**“Serverless computing** là mô hình thực thi điện toán đám mây trong đó nhà cung cấp đám mây chạy máy chủ và tự động quản lý việc phân bổ tài nguyên máy. Giá cả được dựa trên lượng tài nguyên thực tế được sử dụng bởi một ứng dụng, thay vì dựa trên các đơn vị năng lực được mua trước — [\*wikipedia](https://en.wikipedia.org/wiki/Serverless_computing)_”_

**Serverless** được dùng để chỉ 2 khái niệm mô hình dịch vụ là: \*BaaS\*\* **— Backend as a Service\*** **và** **\*FaaS** \*_— Function as a Service_. Có khá nhiều bài viết về Serverless các bạn có thể tìm đọc thêm, ở đây mình sẽ chỉ tập trung vào _FaaS_.

Một số trường hợp khác, lập trình viên phải tự viết code để làm back-end. Với mô hình client-server thông thường, ta phải thuê server rồi deploy ứng dụng lên server. Với mô hình serverless, thay vì deploy code này lên server, ta **deploy nó đưới dạng một Function** (Function as a Service — FaaS). Hiện nay có 3 ông kẹ đang cung cấp mô hình dịch vụ _FaaS_ là Amazon ([Lambda Function](https://aws.amazon.com/vi/lambda/)), Microsoft ([Azure Function](https://azure.microsoft.com/en-us/services/functions/)), Gooogle ([Cloud Function](https://cloud.google.com/functions/)).

![Bảng so sánh 3 dịch vụ](https://github.com/user-attachments/assets/5eb50990-85fa-4825-be3c-5de4afd6f8c8)_Bảng so sánh 3 dịch vụ_

Thực tế thì mình chưa dùng hết cả 3 dịch vụ cung cấp trên nhưng mình thấy Amazon AWS ngoại trừ cái document như sh\*t thì thấy rất ổn, vì vậy series này mình sẽ làm việc với AWS Lambda như đã nói ở tiêu đề nhé. Trước hết thì mình sẽ nói thêm về các dịch vụ Amazon AWS sẽ được dùng trong dự án:

![Serverless Basic Web Reference Architecture](https://github.com/user-attachments/assets/7d25f613-5836-427a-b5d9-65cd37c0e4f2)_Serverless Basic Web Reference Architecture_

## API Gateway

**“Amazon API Gateway** là dịch vụ được quản lý hoàn toàn giúp các nhà phát triển dễ dàng tạo, phát hành, duy trì, giám sát và bảo vệ API ở mọi quy mô. Chỉ với vài cú nhấp chuột trên Bảng điều khiển quản lý AWS, bạn có thể tạo các API REST và WebSocket hoạt động giống như "cửa trước" để các ứng dụng truy cập dữ liệu, logic nghiệp vụ hoặc chức năng từ các dịch vụ phụ trợ — [Amazon](https://aws.amazon.com/vi/api-gateway/)".

Mọi người có thể hiểu _API Gateway_ là cái [cửa khẩu](https://vi.wikipedia.org/wiki/C%E1%BB%ADa_kh%E1%BA%A9u) quốc tế :3 bất cứ ai đi qua đều phải xuất trình [hộ chiếu](https://vi.wikipedia.org/wiki/H%E1%BB%99_chi%E1%BA%BFu) (_AWS Cognito_), tùy vào điểm đến bên trong có thể có những điểm đến (_Lambda Function_) cần phải bảo mật hoặc bị cấm với một số người không được phép đến những nơi đó :D

Thậm chí cái cửa khẩu quốc tế đặc biệt này còn làm được hơn thế nữa, nó tiếp nhận và xử lý lên đến hàng trăm nghìn người đi vào đồng thời bao gồm các công việc giám sát, xác thực và kiểm soát truy cập.

Chi phí để sử dụng *API Gateway *giống với _AWS Lambda_, với mỗi account thì sẽ được free 1 triệu request đầu tiên cho mỗi tháng. Có thể tìm hiểu thêm ở đây:[https://aws.amazon.com/vi/api-gateway/pricing/](https://aws.amazon.com/vi/api-gateway/pricing/)

## AWS Cognito

![](https://github.com/user-attachments/assets/16c9df38-ff63-4099-9b54-b22ecd91269a)

**"Amazon Cognito** cho phép bạn bổ sung tính năng đăng ký, đăng nhập và kiểm soát truy cập người dùng vào trang web và ứng dụng di động một cách nhanh chóng và dễ dàng. Amazon Cognito có quy mô lên tới hàng triệu người dùng và hỗ trợ đăng nhập thông qua các nhà cung cấp định danh mạng xã hội như Facebook, Google và Amazon, cũng như các nhà cung cấp định danh doanh nghiệp thông qua SAML 2.0 — [Amazon](https://aws.amazon.com/vi/cognito/)".

Đây chính là cái [hộ chiếu](https://vi.wikipedia.org/wiki/H%E1%BB%99_chi%E1%BA%BFu) của người dùng dùng để đi đến những điểm đến mà họ muốn :3 Chính xác thì *AWS Cognito *sẽ thay ta quản lý toàn bộ người dùng đăng nhập vào hệ thống, xác thực tin nhắn, định danh, phân quyền người dùng,… Và dễ dàng tích hợp vào hệ thống.

Điều quan trọng nhất mà mình quan tâm chính là chi phí, *AWS Cognito *sẽ free cho 50.000 người dùng đầu tiên và sẽ tính phí trên mỗi người dùng tiếp theo. Nếu dự án của mọi người không quá lớn thì với 50.000 người dùng là đủ dùng rồi. Mọi người cũng có thể tìm hiểu thêm về chi phí ở đây:
[https://aws.amazon.com/vi/cognito/pricing](https://aws.amazon.com/vi/cognito/pricing/)

## Amazon RDS for MySQL

**"Amazon Relational Database Service (Amazon RDS)** là một dịch vụ được quản lý giúp bạn dễ dàng thiết lập, vận hành và thay đổi quy mô cơ sở dữ liệu quan hệ trên đám mây. Dịch vụ này cung cấp tính năng hiệu quả về chi phí và có thể thay đổi quy mô, trong khi vẫn quản lý được các tác vụ quản trị cơ sở dữ liệu tiêu tốn nhiều thời gian, giúp bạn thoải mái tập trung vào các ứng dụng và công việc của bạn — [Amazon](https://aws.amazon.com/vi/rds/faqs/)".

_AWS RDS_ có hỗ trợ rất nhiều công cụ cơ sở dữ liệu ví dụ như: PostgreSQL, Oracle, MySQL, SQL Server,… Trong series này mình sẽ sử dụng [MySQL](https://aws.amazon.com/vi/rds/mysql/) làm cơ sở dữ liệu chính, đối với tài khoản AWS mới tạo mọi người có thể sử dụng miễn phí 1 năm với những option bị giới hạn (**db.t2.micro — 1 vCPU, 1 GiB RAM**). Sau 1 năm Amazon sẽ bắt đầu tính phí sử dụng dịch vụ, bạn có thể tìm hiểu thêm về chi phí sử dụng ở đây:
[https://aws.amazon.com/vi/rds/pricing](https://aws.amazon.com/vi/rds/pricing/)

## Tạo tài khoản Amazon AWS

Đã nói rất nhiều về mấy món dịch vụ ngon-bổ-miễn phí của Amazon ở trên, để được gói free này mọi người cần phải tạo một tài khoản AWS. Click vào link này để tới trang đăng kí:
[https://portal.aws.amazon.com/billing/signup#/start](https://portal.aws.amazon.com/billing/signup#/start)

![](https://github.com/user-attachments/assets/32ac90a4-dcdd-472c-bafa-dec8770dfbb7)

_Lưu ý: Để đăng ký được tài khoản **AWS** và nhận gói free trên thì bạn phải có một cái **thẻ VISA** thanh toán quốc tế, **debit** hay **credit** đều được. Và trong thẻ phải có ít nhất **$1** để Amazon xác nhận tài khoản, số tiền này sẽ được trả lại sau khi xác nhận xong._

Thường thì đối với sinh viên như mình thì lương chưa đủ điều kiện mở thẻ tín dụng **credit** :3 Nếu có ai đang dùng [TP Bank](https://tpb.vn/) thì có thể đăng kí dùng thẻ [e-money](https://tpb.vn/cn-the-ghi-no-the-phi-vat-ly) (đăng kí online xong họ sẽ cấp thẻ luôn cho mình nhé) rất tiện đỡ phải đi lại ra ngân hàng. Mọi người cần phải nạp vào thẻ 50k để cho Amazon AWS xác nhận nữa là xong :3

## Tổng kết

Vậy là mọi người cũng hiểu qua qua về kiến trúc Serverless, 1 vài dịch vụ của Amazon và tạo thành công tài khoản Amazon AWS rồi, trong phần tới mình sẽ hướng dẫn tạo trang đăng nhập sử dụng [AWS Cognito](https://aws.amazon.com/vi/cognito) và [Amplify](https://aws.amazon.com/vi/amplify). Cảm ơn mọi người đã bỏ chút thời gian xem bài viết của mình ❤

## Tài liệu tham khảo

- https://medium.com/tech-travelstart/using-kotlin-in-a-serverless-architecture-with-aws-lambda-part-3-designing-and-implementing-a-c6db62760c9a
- https://toidicodedao.com/2017/03/07/giai-thich-kien-truc-serverless
- https://en.wikipedia.org/wiki/Serverless_computing
