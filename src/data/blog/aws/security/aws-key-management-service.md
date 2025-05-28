---
author: thuongnn
pubDatetime: 2023-07-28T11:45:22Z
title: "[AWS] AWS KMS"
draft: false
tags:
  - AWS
  - Amazon Web Services
description: Tìm hiểu về dịch vụ quản lý khóa mã hóa của AWS, giúp tạo và kiểm soát các khóa mã hóa.
---
Bài viết được tham khảo và tổng hợp lại từ Jayendra's Blog, xem bài viết gốc ở đây: https://jayendrapatil.com/aws-kms. 

## Table of contents


**AWS Key Management Service – KMS** là một dịch vụ mã hóa được quản lý, cho phép tạo và kiểm soát các khóa mã hóa nhằm hỗ trợ mã hóa dữ liệu.

- **Cung cấp giải pháp lưu trữ, quản lý và theo dõi khóa bảo mật có tính sẵn sàng cao** để mã hóa dữ liệu trên các dịch vụ AWS và trong các ứng dụng.
- **Sử dụng các module bảo mật phần cứng (HSMs)** được bảo vệ và xác thực thông qua chương trình FIPS 140-2 Cryptographic Module Validation.
- **Tích hợp liền mạch với nhiều dịch vụ AWS**, giúp dễ dàng mã hóa dữ liệu trong các dịch vụ đó.
- **Được tích hợp với AWS CloudTrail**, cung cấp nhật ký sử dụng khóa mã hóa nhằm hỗ trợ yêu cầu kiểm toán, tuân thủ và quy định.
- **Thực thi các chính sách sử dụng và quản lý**, kiểm soát người dùng IAM, vai trò trong tài khoản, hoặc tài khoản khác có thể quản lý và sử dụng các khóa.

### Quản lý và tạo khóa:

- Tạo, chỉnh sửa, và xem khóa đối xứng (symmetric keys) và khóa bất đối xứng (asymmetric keys), bao gồm cả khóa HMAC.
- Kiểm soát truy cập khóa thông qua các chính sách khóa (key policies), chính sách IAM (IAM policies), và các cấp quyền (grants). Chính sách có thể được tùy chỉnh chi tiết hơn bằng cách sử dụng các khóa điều kiện (condition keys).
- Hỗ trợ **quản lý truy cập dựa trên thuộc tính (ABAC)**.
- Tạo, xóa, liệt kê, và cập nhật các bí danh (aliases) cho các khóa.
- Gắn thẻ (tags) vào các khóa để nhận diện, tự động hóa, và theo dõi chi phí.
- Kích hoạt và vô hiệu hóa các khóa.
- Bật và tắt tính năng **xoay vòng tự động** cho các vật liệu mật mã trong khóa.
- Xóa các khóa để hoàn tất vòng đời khóa.

### Các hoạt động mã hóa được hỗ trợ:

- Mã hóa, giải mã, và mã hóa lại (re-encrypt) dữ liệu bằng khóa đối xứng hoặc bất đối xứng.
- Ký và xác minh thông điệp bằng khóa bất đối xứng.
- Tạo các khóa dữ liệu đối xứng có thể xuất (exportable symmetric data keys) và cặp khóa dữ liệu bất đối xứng (asymmetric data key pairs).
- Tạo và xác minh mã HMAC.
- Tạo số ngẫu nhiên phù hợp cho các ứng dụng mã hóa.

### Các tính năng mở rộng:

- **Hỗ trợ khóa đa vùng (multi-region keys)**, hoạt động như các bản sao của cùng một khóa KMS ở các vùng AWS khác nhau và có thể sử dụng thay thế lẫn nhau.
- **Hỗ trợ điểm cuối riêng (private endpoint) của VPC**, cho phép kết nối KMS từ một VPC một cách riêng tư.
- **Hỗ trợ khóa trong kho khóa CloudHSM**, được sao lưu bởi cụm CloudHSM.

# Envelope encryption

**Các dịch vụ đám mây AWS tích hợp với AWS KMS** sử dụng một phương pháp gọi là **envelope encryption** để bảo vệ dữ liệu.

**Envelope encryption** là một phương pháp tối ưu hóa việc mã hóa dữ liệu bằng cách sử dụng hai loại khóa khác nhau (**Master Key** và **Data Key**).

Với **envelope encryption**:

- **Data Key** được tạo ra và được dịch vụ AWS sử dụng để mã hóa từng phần dữ liệu hoặc tài nguyên. **Data Key** sau đó được mã hóa dưới **Master Key** đã định nghĩa.
- **Data Key đã mã hóa** được lưu trữ bởi dịch vụ AWS. Khi cần giải mã dữ liệu, **Data Key đã mã hóa** sẽ được dịch vụ AWS gửi đến KMS để giải mã bằng **Master Key** ban đầu. Sau đó, dịch vụ sẽ sử dụng **Data Key** đã giải mã để giải mã dữ liệu.

### Lợi ích của e**nvelope encryption**:

1. **Hiệu suất vượt trội:**
    - Khi mã hóa dữ liệu trực tiếp với KMS, dữ liệu phải được truyền qua mạng.
    - Với **envelope encryption**, KMS chỉ hỗ trợ mã hóa dữ liệu có kích thước dưới 4 KB, giúp giảm tải xử lý dữ liệu lớn.
2. **Giảm tải mạng:**
    - Ứng dụng hoặc dịch vụ đám mây AWS chỉ cần truyền yêu cầu và nhận lại **Data Key**, thay vì truyền toàn bộ dữ liệu qua mạng, giúp giảm tải mạng đáng kể

# **KMS Service Concepts**

![1.png](@/assets/images/security/aws-key-management-service/1.png)

### **KMS Keys hoặc Customer Master Keys (CMKs)**

- Đây là một biểu diễn logic (không phải là một tệp hoặc giá trị trực tiếp) của một khóa mã hóa được quản lý trong **AWS Key Management Service (KMS)**.
- **Loại khóa được hỗ trợ:**
    - **Khóa đối xứng (symmetric key):** Dùng để mã hóa/giải mã dữ liệu bằng một khóa duy nhất (AES 256-bit).
    - **Khóa bất đối xứng (asymmetric key):** Gồm một cặp khóa **khóa công khai (public key)** và **khóa riêng (private key)**, dùng để mã hóa hoặc ký số.
    - **HMAC keys:** Dùng để tạo và xác minh mã HMAC, thường dùng trong bảo mật dữ liệu và xác thực.
- **Symmetric keys và private keys (của asymmetric key)** không bao giờ rời khỏi AWS KMS ở trạng thái **plaintext**. Điều này đảm bảo khóa luôn được bảo vệ, tránh rủi ro bị lộ ra ngoài.
- Một **KMS key** bao gồm metadata, như **Key ID**, **Key Spec**, **Key Usage**, ngày tạo, mô tả, trạng thái khóa, và tham chiếu đến **Key Material** được sử dụng để thực hiện các hoạt động mã hóa với **KMS key**.

# Customer Keys and AWS Keys

![2.png](@/assets/images/security/aws-key-management-service/2.png)

### AWS Managed Keys

- Là các khóa được **AWS tạo, quản lý và sử dụng thay mặt bạn** trong tài khoản AWS của bạn.
- **Tự động xoay vòng mỗi năm (~365 ngày)** và không thể thay đổi lịch xoay vòng này.
- Có thể:
    - Xem các khóa được quản lý bởi AWS trong tài khoản của mình.
    - Xem các chính sách khóa (key policies).
    - Theo dõi việc sử dụng khóa trong **CloudTrail logs**.
- Không thể:
    - Quản lý hoặc xoay vòng khóa.
    - Thay đổi chính sách khóa (key policies).
    - Sử dụng trực tiếp trong các hoạt động mã hóa; thay vào đó, dịch vụ AWS sẽ sử dụng chúng thay bạn.

### **Customer Managed Keys**

- Là các khóa **do bạn tạo và quản lý** để mã hóa tài nguyên trong tài khoản của mình.
- **Xoay vòng tự động là tùy chọn**: Nếu bật, khóa sẽ được xoay vòng tự động mỗi năm.
- Bạn có toàn quyền kiểm soát, bao gồm:
    - Xây dựng và duy trì **key policies, IAM policies** và **grants**.
    - Bật và tắt các khóa.
    - Xoay vòng vật liệu mã hóa (cryptographic material).
    - Gắn thẻ (tags) hoặc tạo bí danh (aliases) tham chiếu đến KMS keys.
    - Lên lịch xóa các khóa.

### **AWS Owned Keys**

- Là một tập hợp các khóa **thuộc sở hữu và quản lý bởi dịch vụ AWS** để sử dụng trong nhiều tài khoản AWS.
- Các khóa này **không nằm trong tài khoản AWS của bạn**.
- Dịch vụ AWS có thể sử dụng các khóa này để bảo vệ tài nguyên trong tài khoản của bạn.
- Không thể: Xem, sử dụng, theo dõi, hoặc kiểm tra các khóa này.

# Key Material

- Các KMS key chứa một tham chiếu đến **key material**, được sử dụng để mã hóa và giải mã dữ liệu.
- Mặc định, AWS KMS sẽ tự động tạo **key material** khi một KMS key mới được tạo.
- KMS key có thể được tạo mà không có key material. Sau đó, bạn có thể:
    - **Nhập key material của riêng bạn**.
    - Hoặc **tạo key material** trong cụm AWS CloudHSM được liên kết với AWS KMS Custom Key Store.
- Không thể trích xuất, xuất, xem hoặc quản lý key material.
- Key material không thể xóa riêng lẻ; để xóa key material, bạn phải xóa toàn bộ KMS key.

# Key Material Origin

**Key Material Origin** là thuộc tính của KMS key xác định origin của key material được sử dụng trong KMS key. Các giá trị key material origin bao gồm:

1. **`AWS_KMS`:**
    - AWS KMS tạo và quản lý key material cho KMS key trong AWS KMS.
2. **`EXTERNAL`:**
    - Key được sử dụng có key material nhập từ bên ngoài.
    - Khách hàng chịu trách nhiệm quản lý và bảo mật key.
    - **Chỉ hỗ trợ symmetric keys**.
    - Không hỗ trợ tự động xoay vòng và cần xoay vòng thủ công.
3. **`AWS_CLOUDHSM`:**
    - AWS KMS tạo key material trong cụm AWS CloudHSM liên kết với custom key store.
4. **`EXTERNAL_KEY_STORE`:**
    - Key material là khóa mật mã trong một trình quản lý khóa bên ngoài (external key manager) nằm ngoài AWS.
    - Giá trị này **chỉ hỗ trợ cho KMS keys** trong một external key store.

# Data Keys

- **Data keys** là các khóa mã hóa được sử dụng để mã hóa dữ liệu, bao gồm:
    - Lượng dữ liệu lớn.
    - Các khóa mã hóa dữ liệu khác.
- Không giống **KMS keys**, AWS KMS **không lưu trữ**, **quản lý**, hay **theo dõi** các **data keys**.
- Data keys chủ yếu được sử dụng bởi các dịch vụ bên ngoài AWS KMS.
- **Data keys** được tạo thông qua AWS KMS nhưng không được lưu lại trong hệ thống KMS.
- Các ứng dụng hoặc dịch vụ bên ngoài AWS KMS chịu trách nhiệm sử dụng **data keys** để mã hóa và giải mã dữ liệu.
- Thường được sử dụng trong **Envelope Encryption** để mã hóa dữ liệu khối lượng lớn:
    - Dữ liệu được mã hóa bằng **data keys**.
    - **Data keys** lại được mã hóa bởi **KMS keys** để tăng cường bảo mật.

# **Encryption Context**

- **Encryption context** là một tập hợp tùy chọn các cặp **key–value** chứa thông tin ngữ cảnh bổ sung liên quan đến dữ liệu.
- AWS KMS sử dụng **encryption context** như **Authenticated Additional Data (AAD)** để hỗ trợ mã hóa có xác thực.
- Encryption context không được mã hóa và hiển thị dưới dạng **plaintext** trong CloudTrail Logs.
- Không nên thêm các thông tin nhạy cảm trong encryption context.
- Dùng để **phân loại** và **xác định** các hoạt động mã hóa/giải mã trong CloudTrail Logs.
- Ứng dụng:
    - Giúp xác minh thêm rằng dữ liệu được mã hóa và giải mã trong đúng ngữ cảnh.
    - Cải thiện bảo mật bằng cách sử dụng thêm một lớp xác thực không bí mật.

# KMS Access Control

- Cách chính để quản lý quyền truy cập vào các KMS keys trong AWS là sử dụng các policy.
- Quyền truy cập vào KMS keys có thể được kiểm soát thông qua:
    - **Key Policies**
        - **Là các policy dựa trên tài nguyên (resource-based policies).**
        - **Mỗi KMS key đều có một key policy.**
        - Là cơ chế chính để kiểm soát quyền truy cập vào một key.
        - Có thể được sử dụng độc lập để kiểm soát quyền truy cập vào các keys.
    - **IAM Policies**
        - Sử dụng các **IAM policies** kết hợp với **Key Policies** để kiểm soát quyền truy cập vào các keys.
        - Hữu ích để quản lý tất cả các quyền cho các danh tính IAM (IAM identities) trong IAM.
    - Grants
        - Sử dụng **grants** kết hợp với **Key Policies** và **IAM Policies** để cho phép truy cập vào các keys.
        - Hữu ích để cấp quyền truy cập vào các keys đã được cấp quyền trong key policy và cho phép người dùng ủy quyền quyền truy cập của họ cho những người khác.
- Để cho phép truy cập vào một KMS CMK, **Key Policy** **PHẢI** được sử dụng, dù là sử dụng độc lập hoặc kết hợp với **IAM Policies** hoặc **Grants**.
- **IAM Policies** không đủ để cho phép truy cập vào các keys, mặc dù chúng có thể được sử dụng kết hợp với **Key Policies**.
- IAM user tạo một KMS key không được coi là chủ sở hữu key và họ không tự động có quyền sử dụng hoặc quản lý KMS key mà họ tạo ra.

### **Key Policies**

- **Vai trò chính:** Xác định ai có quyền sử dụng và quản lý các KMS keys.
- Với **Customer-managed key**, bạn có thể thêm, xóa, hoặc thay đổi quyền bất kỳ lúc nào.
- Không thể chỉnh sửa **Key Policy** cho các **AWS-owned** hoặc **AWS-managed keys**.

### **Grants**

- Cung cấp quyền, là một giải pháp thay thế cho **Key Policy** và **IAM Policy**, cho phép các **AWS principals** sử dụng KMS keys.
- Thường dùng để cấp quyền **tạm thời** vì có thể tạo, sử dụng và xóa grant mà không cần thay đổi **Key Policy** hoặc **IAM Policy**.
- Quyền được chỉ định trong grant có thể không có hiệu lực ngay lập tức do cơ chế **eventual consistency**.

### **Grant Tokens**

- **Mục đích:** Giảm thiểu độ trễ khi sử dụng grants.
- Dùng **grant token** nhận được từ phản hồi của API `CreateGrant` để quyền trong grant có hiệu lực ngay lập tức.

### **Alias**

- Là một **tên thân thiện** (friendly name) dành cho KMS keys, giúp dễ dàng tham chiếu.
- Alias là tài nguyên độc lập, không phải thuộc tính của KMS key.
- Alias có thể thêm, thay đổi, hoặc xóa mà không ảnh hưởng đến KMS key liên quan.
- **Ứng dụng:**
    - Alias có thể tham chiếu đến các KMS keys khác nhau trong từng **AWS Region**.
    - Có thể chuyển alias sang KMS key khác mà không cần thay đổi mã nguồn.
    - Alias giúp cho phép hoặc từ chối quyền truy cập dựa trên alias mà không cần chỉnh sửa policy hoặc quản lý grants.

# Key Rotation trong AWS KMS

- **Key rotation** là quá trình thay đổi **key material** để tăng cường bảo mật trong các hoạt động mã hóa. Key material mới được sử dụng cho các yêu cầu mã hóa tiếp theo, trong khi key material cũ vẫn được lưu trữ để giải mã dữ liệu đã mã hóa trước đó.
- Các Loại Key Rotation:
    - Automatic Key Rotation
        - Hỗ trợ cho **symmetric encryption KMS keys** với key material do AWS KMS tạo.
        - **AWS Managed Keys t**ự động xoay vòng mỗi năm và Không thể tùy chỉnh.
        - **Customer Managed Keys m**ặc định tắt, cần kích hoạt thủ công. Xoay vòng mỗi năm.
        - **Không hỗ trợ** Asymmetric keys, HMAC keys, keys trong custom key stores, keys với key material được nhập.
        - Lợi ích:
            - Không thay đổi các thuộc tính của key như ID, ARN, và policy.
            - Các ứng dụng hoặc alias liên kết không cần cập nhật.
            - Không ảnh hưởng đến việc sử dụng key trong các dịch vụ AWS.
    - Manual Key Rotation
        - Người dùng tạo key mới và cập nhật ứng dụng hoặc alias để sử dụng key này.
        - Không giữ lại ID, ARN, hoặc policy của key cũ.
        - Thích hợp với các keys không hỗ trợ xoay vòng tự động (Asymmetric, HMAC, custom key store, imported material).
        - Ưu điểm là linh hoạt kiểm soát tần suất xoay vòng, phù hợp khi cần tần suất xoay vòng dưới 1 năm.
        - Nhược điểm là có thể cần mã hóa lại dữ liệu tùy thuộc vào cấu hình ứng dụng.

# KMS Key Deletion

- **KMS key deletion** là quá trình xóa key material và tất cả metadata liên quan đến key. Đây là một hành động **không thể hoàn tác**.
- Các đặc điểm chính:
    - **Không thể phục hồi dữ liệu:**
        - Dữ liệu được mã hóa bởi key đã bị xóa **không thể khôi phục**.
        - Vì lý do này, **AWS khuyến nghị vô hiệu hóa key** trước khi thực hiện xóa.
    - **Loại Key có thể xóa:**
        - **Customer Managed Keys**: Có thể được lên lịch để xóa.
        - **AWS Managed và Owned Keys**: **Không thể xóa.**
    - **Thời gian chờ bắt buộc:**
        - Người dùng phải đặt thời gian chờ từ **7 đến 30 ngày** trước khi key bị xóa.
        - Trong thời gian này, trạng thái của key là **Pending deletion**.
    - **Trạng thái và hoạt động trong thời gian chờ:**
        - Key với trạng thái **Pending deletion**:
            - **Không thể sử dụng** cho các hoạt động mã hóa hay giải mã.
            - Key material không được xoay vòng.
    - **Chỉ xóa khi được lên lịch:**
        - AWS **không bao giờ tự động xóa key**. Việc xóa chỉ được thực hiện khi bạn **chủ động lên lịch** và thời gian chờ đã kết thúc.

# **KMS Multi-Region Keys**

- **KMS Multi-Region Keys** là một tính năng trong AWS KMS hỗ trợ tạo các key có thể sử dụng **(multi-region)**, cho phép mã hóa và giải mã dữ liệu ở các AWS Region khác nhau mà không cần gọi KMS qua các vùng hoặc mã hóa lại dữ liệu.
- Các đặc điểm chính:
    - **Tương tác linh hoạt giữa các Region:**
        - **Cùng key material và key ID:**
            - Các multi-region key trong các vùng khác nhau có cùng **key material** và **key ID**.
        - **Khả năng mã hóa/giải mã multi-region:**
            - Dữ liệu được mã hóa ở một AWS Region có thể giải mã ở một AWS Region khác mà **không cần mã hóa lại**.
    - **Bảo mật cao:**
        - Multi-Region keys **không bao giờ rời khỏi AWS KMS ở trạng thái không được mã hóa**.
        - Bảo mật dữ liệu được duy trì chặt chẽ trong mọi giao dịch.
    - **Không phải là global key:**
        - Mỗi multi-region key phải được **tạo bản sao (replicated)** và quản lý độc lập ở từng Region.
        - Chúng không phải là **global key**, tức là không tự động áp dụng trên toàn bộ hệ thống AWS.
- Lợi ích
    - **Hiệu suất: g**iảm độ trễ khi sử dụng KMS trong các ứng dụng yêu cầu mã hóa/giải mã trên nhiều Region.
    - **Tiện lợi: k**hông cần thực hiện mã hóa lại khi dữ liệu di chuyển giữa các Region.
    - **Tăng cường bảo mật và tuân thủ: d**ữ liệu luôn được mã hóa khi truyền và lưu trữ, phù hợp với các yêu cầu bảo mật.
- Lưu ý quan trọng
    - Việc quản lý và sao chép multi-region key cần thực hiện **thủ công**, đòi hỏi sự cẩn thận trong việc đồng bộ giữa các Region.
    - Chỉ nên sử dụng multi-region key khi thực sự cần thiết, ví dụ trong các hệ thống phân tán toàn cầu.

# KMS vs CloudHSM

![3.png](@/assets/images/security/aws-key-management-service/3.png)
