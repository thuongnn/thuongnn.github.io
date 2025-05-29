---
author: thuongnn
pubDatetime: 2023-07-29T15:30:45Z
modDatetime: 2023-07-29T15:30:45Z
title: "[AWS] IAM Role, Identity Providers and Federation"
folder: "aws"
draft: false
tags:
  - AWS
  - Amazon Web Services
description: Tìm hiểu về vai trò IAM, nhà cung cấp danh tính và liên kết trong AWS, giúp quản lý quyền truy cập hiệu quả.
---

Bài viết được tham khảo và tổng hợp lại từ Jayendra's Blog, xem bài viết gốc ở đây: https://jayendrapatil.com/aws-iam-role-identity-providers-and-federation.

## Table of contents

- Nhà cung cấp nhận dạng (Identity Provider - IdP) có thể được sử dụng để cấp quyền truy cập tài nguyên AWS cho người dùng bên ngoài mà không cần phải tạo tài khoản người dùng trong AWS của bạn.
- Nhận dạng người dùng bên ngoài có thể được xác thực thông qua hệ thống xác thực của tổ chức hoặc thông qua các nhà cung cấp nhận dạng phổ biến như Amazon, Google, v.v.
- Các nhà cung cấp nhận dạng giúp bảo mật tài khoản AWS mà không cần phân phối hoặc nhúng thông tin xác thực dài hạn vào ứng dụng.
- Để sử dụng một IdP, một thực thể nhà cung cấp nhận dạng IAM có thể được tạo ra để thiết lập mối quan hệ tin cậy giữa tài khoản AWS và IdP.
- IAM hỗ trợ các IdP tương thích với OpenID Connect (OIDC) hoặc SAML 2.0 (Security Assertion Markup Language 2.0).

# Web Identity Federation without Cognito

![1.png](@/assets/images/aws/security/iam-role-identity-providers-and-federation/1.png)

1. Mobile hoặc Web Application cần được cấu hình với IdP, nơi mỗi ứng dụng sẽ có một ID hoặc client ID duy nhất (còn gọi là audience)
2. Tạo một thực thể Nhà cung cấp nhận dạng (IdP) cho IdP tương thích với OIDC trong IAM.
3. Tạo một IAM role và xác định:
   - **Trust policy** – chỉ định IdP (như Amazon) là Principal (thực thể tin cậy), và bao gồm điều kiện khớp với ID ứng dụng được gán cho IdP.
   - **Permission policy**– chỉ định quyền mà ứng dụng có thể giả định.
4. Ứng dụng gọi giao diện đăng nhập của IdP để đăng nhập.
5. IdP xác thực người dùng và trả về một mã thông báo xác thực (OAuth access token hoặc OIDC ID token) chứa thông tin về người dùng cho ứng dụng.
6. Ứng dụng sau đó thực hiện một cuộc gọi chưa ký đến dịch vụ STS với hành động `AssumeRoleWithWebIdentity` để yêu cầu các thông tin xác thực tạm thời.
7. Ứng dụng truyền mã thông báo xác thực của IdP cùng với Amazon Resource Name (ARN) cho IAM role đã tạo cho IdP.
8. AWS xác minh mã thông báo có tin cậy và hợp lệ không, nếu đúng, sẽ trả về các thông tin xác thực tạm thời (access key, secret access key, session token, thời gian hết hạn) cho ứng dụng có quyền với role mà bạn chỉ định trong yêu cầu.
9. Phản hồi của STS cũng bao gồm dữ liệu về người dùng từ IdP, chẳng hạn như ID người dùng duy nhất mà IdP liên kết với người dùng đó.
10. Ứng dụng thực hiện các yêu cầu đã ký với AWS sử dụng thông tin xác thực tạm thời.
11. Thông tin ID người dùng từ IdP có thể giúp phân biệt người dùng trong ứng dụng, ví dụ: các đối tượng có thể được lưu vào các thư mục S3 với ID người dùng là tiền tố hoặc hậu tố. Điều này cho phép bạn tạo các chính sách kiểm soát quyền truy cập để khóa thư mục sao cho chỉ người dùng có ID đó mới có thể truy cập.
12. Ứng dụng có thể lưu trữ các thông tin xác thực tạm thời và làm mới chúng trước khi hết hạn. Mặc định, các thông tin xác thực tạm thời có hiệu lực trong một giờ.

# **Mobile or Web Identity Federation with Cognito**

![2.png](@/assets/images/aws/security/iam-role-identity-providers-and-federation/2.png)

- **Amazon Cognito** là một dịch vụ trung gian danh tính được khuyến nghị cho hầu hết các trường hợp liên kết danh tính web. Đây là giải pháp dễ sử dụng và cung cấp các khả năng bổ sung như quyền truy cập ẩn danh (không xác thực).
- Cognito hỗ trợ người dùng ẩn danh, xác thực đa yếu tố (MFA) và cũng giúp đồng bộ hóa dữ liệu người dùng giữa các thiết bị và nhà cung cấp khác nhau.

# SAML 2.0-based Federation

![3.png](@/assets/images/aws/security/iam-role-identity-providers-and-federation/3.png)

- AWS hỗ trợ liên kết danh tính với SAML 2.0 (Security Assertion Markup Language 2.0), một tiêu chuẩn mở được sử dụng bởi nhiều nhà cung cấp dịch vụ danh tính (IdPs).
- Tính năng liên kết dựa trên SAML 2.0 cho phép đăng nhập một lần (SSO), vì vậy người dùng có thể đăng nhập vào AWS Management Console hoặc gọi các API AWS mà không cần phải tạo người dùng IAM cho tất cả mọi người trong tổ chức.
- SAML giúp đơn giản hóa quá trình cấu hình liên kết với AWS bằng cách sử dụng dịch vụ của IdP thay vì phải viết mã proxy danh tính tùy chỉnh.
- Điều này hữu ích đối với các tổ chức đã tích hợp hệ thống danh tính của họ (chẳng hạn như Windows Active Directory hoặc OpenLDAP) với phần mềm có thể tạo ra các tuyên bố SAML để cung cấp thông tin về danh tính và quyền của người dùng (chẳng hạn như Active Directory Federation Services hoặc Shibboleth).

### Mô tả luồng

- Tạo SAML provider entity trong AWS sử dụng SAML metadata document do IdP của Tổ chức cung cấp để thiết lập "mối quan hệ tin cậy" giữa tài khoản AWS của bạn và IdP
- SAML metadata document bao gồm tên người phát hành, ngày tạo, ngày hết hạn và các khóa mà AWS có thể sử dụng để xác minh các phản hồi xác thực (assertions) từ tổ chức của bạn.
- Tạo các vai trò IAM định nghĩa:
  - **Trust policy** thiết lập mối quan hệ tin cậy giữa tổ chức và AWS.
  - **Permission policy** xác định những gì người dùng từ tổ chức có thể làm trong AWS.
- Tin cậy SAML được hoàn thành bằng cách cấu hình IdP của tổ chức với thông tin về AWS và các vai trò mà bạn muốn người dùng liên kết sử dụng. Điều này được gọi là cấu hình tin cậy bên thứ ba giữa IdP của bạn và AWS.
- Ứng dụng gọi giao diện đăng nhập của IdP của Tổ chức để đăng nhập.
- IdP xác thực người dùng và tạo phản hồi xác thực SAML bao gồm các assertions xác định người dùng và bao gồm các thuộc tính về người dùng.
- Ứng dụng sau đó thực hiện một yêu cầu chưa ký với dịch vụ STS sử dụng hành động **AssumeRoleWithSAML** để yêu cầu thông tin xác thực tạm thời.
- Ứng dụng truyền ARN của nhà cung cấp SAML, ARN của vai trò cần đảm nhận, assertion SAML về người dùng hiện tại được IdP trả về và thời gian mà thông tin xác thực có hiệu lực. Tham số chính sách IAM tùy chọn có thể được cung cấp để hạn chế thêm quyền của người dùng.
- AWS xác minh rằng assertion SAML là tin cậy và hợp lệ, nếu đúng, sẽ trả về thông tin xác thực tạm thời (khóa truy cập, khóa bí mật, mã phiên, thời gian hết hạn) cho ứng dụng có quyền sử dụng vai trò đã nêu trong yêu cầu.
- Phản hồi STS cũng bao gồm siêu dữ liệu về người dùng từ IdP, chẳng hạn như ID người dùng duy nhất mà IdP gán cho người dùng.
- Sử dụng thông tin xác thực tạm thời, ứng dụng thực hiện các yêu cầu đã ký với AWS để truy cập các dịch vụ.
- Ứng dụng có thể lưu trữ thông tin xác thực tạm thời và làm mới chúng trước khi hết hạn theo yêu cầu. Mặc định, thông tin xác thực tạm thời có hiệu lực trong một giờ.

# AWS SSO with SAML

![4.png](@/assets/images/aws/security/iam-role-identity-providers-and-federation/4.png)

- Liên kết theo chuẩn SAML 2.0 cũng có thể được sử dụng để cấp quyền truy cập cho người dùng liên kết vào AWS Management Console.
- Điều này yêu cầu sử dụng AWS SSO endpoint thay vì gọi trực tiếp API **AssumeRoleWithSAML**.
- Endpoint này sẽ gọi API cho người dùng và trả về một URL tự động chuyển hướng trình duyệt của người dùng đến AWS Management Console.

### Mô tả luồng

- Người dùng truy cập vào portal của tổ chức và chọn tùy chọn để vào AWS Management Console.
- Portal thực hiện chức năng của nhà cung cấp danh tính (IdP) xử lý việc trao đổi quyền tin cậy giữa tổ chức và AWS.
- Portal xác minh danh tính của người dùng trong tổ chức.
- Portal tạo một phản hồi xác thực SAML bao gồm các tuyên bố xác định người dùng và thông tin về người dùng.
- Portal gửi phản hồi này đến trình duyệt của khách hàng.
- Trình duyệt của khách hàng được chuyển hướng đến AWS SSO endpoint và gửi yêu cầu xác nhận SAML.
- AWS SSO endpoint xử lý yêu cầu hành động **AssumeRoleWithSAML** thay mặt người dùng, yêu cầu thông tin chứng chỉ tạm thời từ STS và tạo một URL đăng nhập vào Console sử dụng các chứng chỉ đó.
- AWS gửi URL đăng nhập trở lại trình duyệt của khách hàng dưới dạng một liên kết chuyển hướng.
- Trình duyệt của khách hàng được chuyển hướng đến AWS Management Console. Nếu phản hồi xác thực SAML bao gồm các thuộc tính ánh xạ đến nhiều vai trò IAM, người dùng sẽ được yêu cầu chọn vai trò cần sử dụng để truy cập vào console.

# Custom Identity Broker Federation

![5.png](@/assets/images/aws/security/iam-role-identity-providers-and-federation/5.png)

- Nếu tổ chức không hỗ trợ IdP tương thích với SAML, một Custom Identity Broker có thể được sử dụng để cung cấp quyền truy cập.
- Custom Identity Broker cần thực hiện các bước sau:
  - Xác minh rằng người dùng đã được xác thực bởi hệ thống danh tính cục bộ.
  - Gọi API **AWS STS AssumeRole** (khuyến nghị) hoặc **GetFederationToken** (mặc định có thời gian hết hạn là 36 giờ) để lấy chứng chỉ bảo mật tạm thời cho người dùng.
  - Chứng chỉ tạm thời giới hạn quyền truy cập của người dùng vào tài nguyên AWS.
  - Gọi điểm cuối AWS federation và cung cấp chứng chỉ bảo mật tạm thời để nhận mã thông báo đăng nhập.
  - Xây dựng URL cho console bao gồm mã thông báo.
  - URL mà federation endpoint cung cấp sẽ hợp lệ trong vòng 15 phút sau khi được tạo.
  - Cung cấp URL cho người dùng hoặc gọi URL thay mặt người dùng.
