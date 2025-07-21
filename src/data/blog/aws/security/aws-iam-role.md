---
author: thuongnn
pubDatetime: 2023-08-30T11:20:33Z
modDatetime: 2025-05-29T02:30:41Z
title: "[AWS] AWS Identity and Access Management (IAM) Roles"
folder: "aws"
draft: true
ogImage: "../../../../assets/images/aws/security/aws-iam-role/1.png"
tags:
  - AWS
  - Amazon Web Services
description: Tìm hiểu về vai trò IAM trong AWS, cách quản lý quyền truy cập và xác thực cho các dịch vụ và tài nguyên AWS.
---

Bài viết được tham khảo và tổng hợp lại từ Jayendra's Blog, xem bài viết gốc ở đây: https://jayendrapatil.com/aws-iam-roles.

## Table of contents

# Giới thiệu

- **IAM Role** rất giống với một user, vì nó cũng là một danh tính với các permission policies xác định những gì danh tính đó có thể và không thể làm trong AWS.
- IAM Role không được thiết kế để gắn cố định với một người dùng, nhóm, hoặc dịch vụ cụ thể mà được tạo ra để bất kỳ ai cần đều có thể giả định (assume).
- IAM Role không có mật khẩu hoặc khóa truy cập (access keys) cố định.
- Người hoặc dịch vụ giả định vai trò (assume the role) sẽ được cấp thông tin xác thực tạm thời và động (dynamic temporary credentials).
- Role giúp phân quyền, cho phép ai đó truy cập tài nguyên mà bạn kiểm soát.
- Role có thể giúp ngăn chặn việc truy cập hoặc thay đổi nhầm lẫn đối với tài nguyên nhạy cảm.
- **Role có thể được sửa đổi bất kỳ lúc nào và thay đổi sẽ được áp dụng ngay lập tức cho tất cả các thực thể liên kết với Role đó.**
- **Các tình huống quan trọng sử dụng IAM Role:**
  - Ví dụ một ứng dụng chạy trên EC2 cần truy cập các dịch vụ AWS khác.
  - Cho phép người dùng từ tài khoản AWS khác truy cập tài nguyên trong tài khoản của bạn mà không cần tạo người dùng mới.
  - Identity Providers & Federation
    - Công ty sử dụng cơ chế xác thực nội bộ và không muốn người dùng phải đăng nhập hai lần hoặc tạo tài khoản trùng lặp trong AWS.
    - Các ứng dụng cho phép đăng nhập thông qua các cơ chế xác thực bên ngoài như Amazon, Facebook, Google, v.v.
- Ai có thể giả định IAM Role?
  - Người dùng IAM trong cùng tài khoản AWS.
  - Người dùng IAM từ tài khoản AWS khác.
  - Dịch vụ AWS ví dụ: EC2, EMR, v.v., cần tương tác với các dịch vụ AWS khác.
  - Người dùng bên ngoài được xác thực bởi **external identity provider (IdP)**. External identity provider phải tương thích với SAML 2.0, OpenID Connect (OIDC), hoặc một custom-built identity broker.
- IAM Role bao gồm hai chính sách:
  - **Trust Policy**
    - Xác định **ai** có thể giả định IAM Role.
    - Trust Policy thiết lập mối quan hệ tin cậy giữa tài khoản sở hữu tài nguyên (trusting account) và tài khoản sở hữu người dùng cần truy cập tài nguyên (trusted account).
  - **Permissions policy**
    - Xác định **những gì** có thể truy cập.
    - Permissions Policy quyết định quyền hạn, cho phép người dùng của Role thực hiện các tác vụ mong muốn trên tài nguyên.
- **Liên kết danh tính (Federation):**
  - Federation tạo mối quan hệ tin cậy giữa AWS và một **external identity provider (IdP)**.
  - Người dùng có thể đăng nhập vào hệ thống danh tính doanh nghiệp tương thích với SAML. Người dùng cũng có thể đăng nhập thông qua nhà cung cấp danh tính web như Login with Amazon, Facebook, Google, hoặc bất kỳ IdP nào tương thích với OpenID Connect (OIDC).
  - Khi sử dụng OIDC hoặc SAML 2.0 để thiết lập mối quan hệ tin cậy, người dùng sẽ được gán một IAM Role và nhận thông tin xác thực tạm thời để truy cập tài nguyên AWS.

# AWS STS & Temporary Credentials

- AWS Security Token Service (STS) giúp tạo và cung cấp thông tin xác thực bảo mật tạm thời cho người dùng đáng tin cậy, nhằm kiểm soát quyền truy cập vào tài nguyên AWS.
  - STS là một dịch vụ toàn cầu với một endpoint duy nhất: `https://sts.amazonaws.com`.
  - Các lệnh gọi API của AWS STS có thể được thực hiện đến endpoint toàn cầu hoặc một trong các endpoint khu vực (regional endpoint).
  - Endpoint khu vực có thể giúp giảm độ trễ (latency) và cải thiện hiệu suất của các lệnh gọi API.
- Thông tin xác thực tạm thời (Temporary Credentials) tương tự như thông tin xác thực dài hạn, nhưng có các điểm khác biệt sau:
  - Thời gian ngắn hạn, chỉ tồn tại trong một thời gian ngắn và được xoay vòng thường xuyên.
  - Thời gian tồn tại linh hoạt, có thể được cấu hình để tồn tại từ vài phút đến vài giờ.
  - Không cần phải nhúng vào mã nguồn hoặc phân phối cho người dùng.
  - Không được lưu trữ hoặc gắn cố định với người dùng, mà được tạo ra động và cung cấp cho người dùng khi cần thiết.
- **Tóm lại:** AWS STS và thông tin xác thực tạm thời (Temporary Credentials) giúp tăng cường bảo mật và tính linh hoạt trong việc quản lý quyền truy cập vào tài nguyên AWS, đồng thời giảm thiểu rủi ro liên quan đến thông tin xác thực dài hạn.

# AWS Service Roles

Một số dịch vụ AWS cần tương tác với các dịch vụ AWS khác, ví dụ như EC2 tương tác với S3, SQS, v.v. **Giải pháp**:

- Nên gán các dịch vụ này với **IAM Role** thay vì nhúng hoặc truyền thông tin xác thực của IAM User trực tiếp vào một instance.
- Việc phân phối và xoay vòng thông tin xác thực dài hạn cho nhiều instance rất khó quản lý và tiềm ẩn rủi ro bảo mật.
- AWS tự động cung cấp thông tin xác thực bảo mật tạm thời cho các dịch vụ này, ví dụ: EC2 instance sử dụng thông tin xác thực thay mặt cho ứng dụng của nó.
- **Lưu ý** xóa một **Role** hoặc **Instance Profile** đang được liên kết với một EC2 instance đang chạy sẽ làm gián đoạn hoạt động của các ứng dụng trên instance đó.

## **Complete Process Flow**

1. **Tạo một IAM Role:**
   - Chỉ định các dịch vụ sẽ sử dụng Role (ví dụ: EC2 là một thực thể tin cậy).
   - Xác định các permission policies phù hợp với quyền truy cập mà dịch vụ cần.
2. **Liên kết Role với EC2 (Instance Profile):**
   - Role được liên kết với dịch vụ EC2 (thực chất là Instance Profile) khi instance được khởi chạy.
3. **Cung cấp thông tin xác thực tạm thời:**
   - Các thông tin xác thực bảo mật tạm thời được cung cấp trên instance và tự động xoay vòng trước khi hết hạn, đảm bảo luôn có thông tin hợp lệ.
4. **Truy xuất thông tin xác thực:**
   - Ứng dụng có thể lấy thông tin xác thực tạm thời bằng cách:
     - Truy cập **Instance Metadata** trực tiếp.
     - Sử dụng AWS SDK.
5. **Sử dụng quyền hạn trong Role:**
   - Các ứng dụng chạy trên EC2 instance sử dụng quyền hạn được xác định trong IAM Role để truy cập các tài nguyên AWS khác.
6. **Xử lý thông tin xác thực trong ứng dụng:**
   - Nếu ứng dụng lưu trữ tạm thời thông tin xác thực, cần đảm bảo sử dụng thông tin chính xác trước khi chúng hết hạn.

## **Instance Profile**

- **Instance Profile** là một container cho một IAM Role, được sử dụng để truyền thông tin Role đến một EC2 instance khi instance khởi động.
- **Tạo Instance Profile tự động**: nếu một Role được tạo cho EC2 instance hoặc bất kỳ dịch vụ nào khác sử dụng EC2 thông qua **AWS Management Console**, AWS sẽ tự động tạo Instance Profile với cùng tên như Role.
- **Tạo Instance Profile thủ công**: nếu Role được tạo qua **CLI**, bạn cần tạo Instance Profile một cách thủ công.
- **Số lượng Role trong Instance Profile:**
  - Một Instance Profile chỉ có thể chứa một IAM Role duy nhất.
  - Tuy nhiên, một IAM Role có thể được liên kết với nhiều Instance Profile khác nhau.

# Service-linked Roles

- **Service-linked Role** là một loại IAM Role đặc biệt được liên kết trực tiếp với một dịch vụ AWS.
- **Quyền hạn được định nghĩa trước**: các vai trò này được dịch vụ định nghĩa sẵn và bao gồm tất cả các quyền cần thiết để dịch vụ có thể gọi các dịch vụ AWS khác thay mặt bạn.
- **Hiển thị trong tài khoản IAM:**
  - Các Service-linked Roles xuất hiện trong tài khoản IAM của bạn và thuộc quyền sở hữu của dịch vụ AWS.
  - **Quản trị viên IAM** có thể xem, nhưng không thể chỉnh sửa các quyền của Service-linked Roles.

# Cross-Account access Roles

- **Cấp quyền chuyển đổi Role:**
  - IAM Users có thể được cấp quyền để chuyển đổi sang các Role trong cùng một tài khoản AWS hoặc sang các Role được định nghĩa trong các tài khoản AWS khác mà bạn sở hữu.
  - Role cũng có thể được sử dụng để ủy quyền cho IAM Users từ các tài khoản AWS do bên thứ ba sở hữu.
    - Cần phải phải cấp quyền rõ ràng cho người dùng để họ có thể đảm nhận (assume) Role và người dùng cần phải chủ động chuyển sang Role thông qua **AWS Management Console**.
    - **Bảo mật MFA (Multi-factor Authentication)**: có thể bật bảo vệ bằng **MFA** cho Role, chỉ cho phép người dùng đăng nhập bằng thiết bị MFA mới có thể đảm nhận Role.
- **Quyền hạn chỉ áp dụng một lần:**
  - Chỉ một tập hợp quyền được áp dụng tại một thời điểm. Khi người dùng đảm nhận một Role, họ tạm thời từ bỏ quyền hạn ban đầu và sử dụng quyền hạn của Role đó.
  - Khi người dùng thoát hoặc ngừng sử dụng Role, các quyền ban đầu của người dùng sẽ được khôi phục.
- **Complete Process Flow**
  ![1.png](@/assets/images/aws/security/aws-iam-role/1.png)
  1. **Tạo IAM Role trong tài khoản tin tưởng (Trusting Account):**
     - Tạo một **Trust policy** định nghĩa tài khoản tin cậy (Trusted Account) là principal có thể truy cập tài nguyên.
     - Tạo một **Permissions policy** để định nghĩa tài nguyên nào mà người dùng trong tài khoản tin cậy có thể truy cập.
  2. **Cung cấp thông tin Role:**
     - Tài khoản tin tưởng cung cấp **Account ID** và tên Role (hoặc ARN của Role) cho tài khoản tin cậy.
     - Nếu tài khoản tin tưởng thuộc bên thứ ba, có thể cung cấp thêm **External ID** (khuyến nghị để tăng cường bảo mật), được sử dụng để xác định duy nhất tài khoản tin cậy và thêm vào Trust policy như một điều kiện.
  3. **Tạo IAM User trong tài khoản tin cậy (Trusted Account):**
     - Tạo một **IAM User** có quyền gọi API **AssumeRole** của AWS Security Token Service (AWS STS) để đảm nhận Role hoặc chuyển đổi sang Role.
  4. **Chuyển đổi sang Role (Switch Role):**
     - IAM User trong tài khoản tin cậy chuyển đổi sang Role hoặc đảm nhận Role và truyền ARN của Role.
     - Nếu tài khoản tin cậy thuộc bên thứ ba, IAM User cũng truyền **External ID** được ánh xạ với tài khoản tin tưởng.
  5. **Xác minh từ AWS STS:**
     - **AWS STS** xác minh yêu cầu với ARN của Role, External ID (nếu có), và kiểm tra xem yêu cầu có phù hợp với Trust policy của Role hay không.
     - Sau khi xác minh thành công, **AWS STS** trả về thông tin xác thực tạm thời (temporary credentials).
  6. **Truy cập tài nguyên:**
     - Thông tin xác thực tạm thời cho phép IAM User truy cập tài nguyên thuộc tài khoản tin tưởng.
  7. **Thoát Role:**
     - Khi người dùng thoát Role, quyền hạn của họ sẽ được khôi phục về quyền ban đầu trước khi chuyển đổi sang Role.

# External ID and Confused Deputy Problem

## **Confused Deputy Problem**

![2.png](@/assets/images/aws/security/aws-iam-role/2.png)

- **Confused Deputy Problem** xảy ra khi một hệ thống (đại diện) thực hiện hành động thay mặt cho người khác, nhưng vì thiếu kiểm soát hoặc xác thực đúng đắn, hệ thống đó lại vô tình cho phép một bên không có quyền truy cập thực sự vào tài nguyên hoặc dữ liệu của mình.
- Trong bối cảnh trên:
  - **Example Corp** là đại diện, có thể truy cập các tài nguyên từ nhiều tài khoản AWS khác nhau. Trong khi làm việc với tài nguyên của bạn, họ có quyền đảm nhận một **IAM Role** trong tài khoản của bạn, và điều này cho phép họ truy cập vào các tài nguyên mà bạn đã cấp quyền.
  - **ARN** của bạn (Role ARN) xác định quyền truy cập này. Tuy nhiên, nếu một tài khoản AWS khác (không phải của bạn) có thể biết được **ARN** này, họ có thể cung cấp ARN này cho **Example Corp**.
  - **Example Corp** sau đó có thể sử dụng ARN của bạn để truy cập tài nguyên của bạn và thực hiện các tác vụ, nhưng có thể **Example Corp** lại chia sẻ dữ liệu với tài khoản AWS khác mà bạn không muốn cấp quyền truy cập.
- Điều này tạo ra tình huống **confused deputy**: **Example Corp** (đại diện) không biết rằng họ đang trao quyền cho một bên không được phép truy cập vào tài nguyên của bạn, do sự thiếu kiểm tra và xác thực của hệ thống. Vấn đề này có thể dẫn đến việc một tổ chức hoặc người dùng không đáng tin cậy có thể truy cập vào tài nguyên hoặc dữ liệu của bạn mà không có sự cho phép rõ ràng từ bạn.

## **Giải pháp cho Confused Deputy Problem dùng External ID**

![3.png](@/assets/images/aws/security/aws-iam-role/3.png)

- Để giải quyết vấn đề này, **External ID** được sử dụng như một công cụ để xác định chính xác **ai** là người yêu cầu quyền truy cập.
- Example Corp tạo ra một **External ID** duy nhất cho từng khách hàng, chỉ có khách hàng đó biết. Mỗi lần một tài khoản muốn yêu cầu quyền truy cập, Example Corp sẽ yêu cầu tài khoản đó cung cấp **External ID** của mình.
- **Cách hoạt động của giải pháp:**
  - **Trust policy** trong role được thiết lập để yêu cầu **External ID** này như một điều kiện. Khi Example Corp yêu cầu quyền truy cập vào tài nguyên của bạn, họ sẽ cung cấp **ARN** của role cùng với **External ID** của khách hàng cụ thể.
  - Nếu yêu cầu đến từ tài khoản AWS khác mà không cung cấp **External ID** chính xác (mà Example Corp đã cấp cho bạn), yêu cầu đó sẽ không khớp với điều kiện trong **Trust policy** của role. Điều này khiến yêu cầu bị từ chối, ngay cả khi ARN có thể hợp lệ, ngăn chặn việc **Confused Deputy** có thể xảy ra.
  - Chức năng chính của **External ID** là giải quyết và ngăn chặn vấn đề **"confused deputy"**.
