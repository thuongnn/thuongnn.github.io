---
author: thuongnn
pubDatetime: 2023-08-02T11:45:22Z
title: "[AWS] AWS CloudFormation"
folder: "aws"
draft: false
tags:
  - AWS
  - Amazon Web Services
description: Tìm hiểu về dịch vụ Infrastructure as Code của AWS, giúp tạo và quản lý tài nguyên AWS một cách tự động.
---

Bài viết được tham khảo và tổng hợp lại từ Jayendra's Blog, xem bài viết gốc ở đây: https://jayendrapatil.com/aws-cloudformation.

## Table of contents

- AWS CloudFormation cung cấp cho các nhà phát triển và quản trị viên hệ thống một cách dễ dàng để **tạo** và **quản lý** một tập hợp các tài nguyên AWS liên quan, cung cấp và cập nhật chúng một cách **có thứ tự** và **dễ đoán**.
- CloudFormation bao gồm:
  - **Template**:
    - Là một **biểu đồ kiến trúc** và cung cấp các **tài nguyên logic**.
    - Là một tệp văn bản định dạng **JSON** hoặc **YAML**, mô tả tất cả các **tài nguyên AWS** cần thiết để triển khai và chạy ứng dụng.
  - **Stack**:
    - Là **kết quả cuối cùng** của biểu đồ đó và cung cấp các **tài nguyên vật lý** được ánh xạ tới các tài nguyên logic.
    - Là tập hợp các **tài nguyên AWS** được **tạo** và **quản lý** như một **đơn vị duy nhất** khi CloudFormation khởi tạo một **template**.
- **Template CloudFormation** có thể được sử dụng để thiết lập các tài nguyên một cách **nhất quán** và **lặp lại** nhiều lần trên nhiều **regions**.
- Các tài nguyên có thể được **cập nhật**, **xóa** và **sửa đổi** một cách **kiểm soát** và **dễ đoán**, thực chất là áp dụng **kiểm soát phiên bản** cho cơ sở hạ tầng giống như đối với mã phần mềm.
- **Template CloudFormation** bao gồm các yếu tố:
  - **Danh sách các tài nguyên AWS** và các giá trị cấu hình của chúng.
  - Một **số phiên bản định dạng tệp template** tùy chọn.
  - Một **danh sách các tham số template** tùy chọn (các giá trị đầu vào được cung cấp khi tạo stack).
  - Một **danh sách các giá trị đầu ra** tùy chọn như địa chỉ IP công khai sử dụng hàm **`Fn:GetAtt`**.
  - Một **danh sách các bảng dữ liệu** tùy chọn dùng để tra cứu các giá trị cấu hình tĩnh _ví dụ: tên AMI theo AZ_.
- CloudFormation hỗ trợ tích hợp **Chef** & **Puppet** để triển khai và cấu hình xuống tận tầng ứng dụng.
- CloudFormation cung cấp một tập hợp các **tập lệnh khởi động ứng dụng** cho phép bạn cài đặt **gói**, **tệp** và **dịch vụ** trên các phiên bản **EC2** bằng cách đơn giản mô tả chúng trong **template CloudFormation**.
- Theo mặc định, tính năng **automatic rollback on error** được bật, sẽ khiến tất cả các **tài nguyên AWS** mà CloudFormation đã tạo thành công cho một **stack** cho đến thời điểm xảy ra lỗi sẽ bị **xóa**.
- Trong trường hợp **automatic rollback**, **phí** vẫn sẽ được áp dụng cho các tài nguyên trong khoảng thời gian chúng hoạt động.
- CloudFormation cung cấp tài nguyên **WaitCondition** hoạt động như một **rào cản**, ngăn chặn việc tạo các tài nguyên khác cho đến khi nhận được **tín hiệu hoàn thành** từ một nguồn bên ngoài _ví dụ: ứng dụng hoặc hệ thống quản lý_.
- CloudFormation cho phép định nghĩa **deletion policies** cho các tài nguyên trong **template** _ví dụ: tài nguyên được giữ lại hoặc snapshot có thể được tạo trước khi xóa, hữu ích để bảo vệ S3 buckets khi stack bị xóa_.

# Các khái niệm CloudFormation

Trong **AWS CloudFormation**, bạn làm việc với **templates** và **stacks**.

# Templates

- Hoạt động như **bản thiết kế** để xây dựng các **tài nguyên AWS**.
- Là một tệp văn bản định dạng **JSON** hoặc **YAML**, được lưu với bất kỳ phần mở rộng nào, chẳng hạn như **.json**, **.yaml**, **.template**, hoặc **.txt**.
- Có khả năng bổ sung để xây dựng các tập hợp tài nguyên phức tạp và tái sử dụng các **templates** trong nhiều ngữ cảnh
  _Ví dụ: sử dụng input parameters để tạo các templates chung và có thể tái sử dụng_.
- Tên được sử dụng cho một tài nguyên trong **template** là **tên logic**, nhưng khi CloudFormation tạo tài nguyên, nó tạo ra một **tên vật lý** dựa trên sự kết hợp của **tên logic**, **tên stack** và một **ID duy nhất**.

# Stacks

- **Stacks** quản lý các **tài nguyên liên quan** như một **đơn vị duy nhất**.
- Tập hợp các tài nguyên có thể được **tạo**, **cập nhật** và **xóa** bằng cách **tạo**, **cập nhật** và **xóa stacks**.
- Tất cả các tài nguyên trong một **stack** được định nghĩa bởi **template CloudFormation** của **stack** đó.
- CloudFormation thực hiện các **lệnh gọi dịch vụ** cơ bản tới AWS để **cung cấp** và **cấu hình** các tài nguyên trong **stack** và chỉ có thể thực hiện các hành động mà **người dùng** có **quyền** thực hiện.

# Change Sets

![1.png](@/assets/images/aws/other/cloudformation/1.png)

- **Change Sets** cung cấp một **tóm tắt** hoặc **xem trước** các thay đổi được đề xuất mà CloudFormation sẽ thực hiện khi một **stack** được cập nhật.
- **Change Sets** giúp kiểm tra cách các thay đổi có thể **ảnh hưởng** đến các tài nguyên đang chạy, đặc biệt là các tài nguyên quan trọng, trước khi thực hiện chúng.
- CloudFormation chỉ thực hiện các thay đổi cho **stack** khi **change set** được thực thi, cho phép bạn quyết định **tiếp tục** với các thay đổi được đề xuất hoặc **khám phá** các thay đổi khác bằng cách tạo một **change set** khác.
- **Change Sets** không cho biết liệu CloudFormation sẽ **cập nhật stack thành công** _ví dụ: nếu vượt giới hạn tài khoản hoặc người dùng không có quyền_.

# Custom Resources

- **Custom resources** giúp viết **logic cung cấp tùy chỉnh** trong **templates** mà CloudFormation chạy bất cứ khi nào các **stacks** được **tạo**, **cập nhật** hoặc **xóa**.
- **Custom resources** giúp bao gồm các tài nguyên **không có sẵn** dưới dạng **loại tài nguyên CloudFormation** và vẫn có thể được quản lý trong một **stack** duy nhất.
- AWS khuyến nghị sử dụng **CloudFormation Registry** thay vì **custom resources**.

# Nested Stacks

- **Nested stacks** là các **stacks** được tạo như một phần của các **stacks** khác.
- Một **nested stack** có thể được tạo trong một **stack** khác bằng cách sử dụng tài nguyên **`AWS::CloudFormation::Stack`**.
- **Nested stacks** có thể được sử dụng để định nghĩa các **mẫu lặp lại phổ biến** và các **thành phần**, tạo các **templates chuyên dụng** sau đó có thể được gọi từ các **stacks** khác.
- **Root stack** là **stack cấp cao nhất** mà tất cả các **nested stacks** cuối cùng thuộc về. **Nested stacks** có thể chứa các **nested stacks** khác, dẫn đến một **hệ thống phân cấp stacks**.
- Ngoài ra, mỗi **nested stack** có một **parent stack trực tiếp**. Đối với **nested stacks** cấp đầu tiên, **root stack** cũng là **parent stack**.
- Một số thao tác **stack**, chẳng hạn như **cập nhật stack**, nên được khởi tạo từ **root stack** thay vì thực hiện trực tiếp trên **nested stacks**.

# Drift Detection

- **Drift detection** cho phép bạn phát hiện liệu **cấu hình thực tế** của một **stack** có **khác biệt**, hay đã **drifted**, so với **cấu hình mong đợi** của nó.
- **Drift detection** giúp xác định các **tài nguyên stack** mà các thay đổi cấu hình đã được thực hiện **ngoài sự quản lý của CloudFormation**.
- **Drift detection** có thể phát hiện **drift** trên toàn bộ **stack** hoặc trên các **tài nguyên riêng lẻ**.
- Có thể thực hiện **hành động khắc phục** để đảm bảo các tài nguyên **stack** đồng bộ lại với các định nghĩa trong **template stack**, chẳng hạn như **cập nhật trực tiếp** các tài nguyên **drifted** để chúng khớp với định nghĩa **template** của chúng.
- **Giải quyết drift** giúp đảm bảo **tính nhất quán cấu hình** và các **thao tác stack** thành công.
- CloudFormation phát hiện **drift** trên các **tài nguyên AWS** hỗ trợ **drift detection**. Các tài nguyên **không hỗ trợ drift detection** được gán trạng thái **`NOT_CHECKED`**.
- **Drift detection** có thể được thực hiện trên các **stacks** với các trạng thái sau: **`CREATE_COMPLETE`**, **`UPDATE_COMPLETE`**, **`UPDATE_ROLLBACK_COMPLETE`** và **`UPDATE_ROLLBACK_FAILED`**.
- CloudFormation **không phát hiện drift** trên bất kỳ **nested stacks** thuộc về **stack** đó. Thay vào đó, bạn có thể khởi tạo một thao tác **drift detection** trực tiếp trên **nested stack**.

# Cấu trúc Template CloudFormation

![2.png](@/assets/images/aws/other/cloudformation/2.png)

- **Resources** (required):
  - Chỉ định các **tài nguyên stack** và **thuộc tính** của chúng, chẳng hạn như một phiên bản **EC2** hoặc một **S3 bucket** sẽ được tạo.
  - Các **tài nguyên** có thể được tham chiếu trong các phần **Resources** và **Outputs**.
- **Parameters** (optional):
  - Truyền các **giá trị** vào **template** tại thời điểm chạy (trong quá trình **tạo** hoặc **cập nhật stack**).
  - Các **Parameters** có thể được tham chiếu từ các phần **Resources** và **Outputs**.
  - Có thể được tham chiếu bằng **Fn::Ref** hoặc **!Ref**.
- **Mappings** (optional):
  - Một ánh xạ của các **khóa** và **giá trị liên quan** được sử dụng để chỉ định các giá trị tham số có điều kiện, tương tự như một **bảng tra cứu**.
  - Có thể được tham chiếu bằng **Fn::FindInMap** hoặc **!FindInMap**.
- **Outputs** (optional):
  - Mô tả các **giá trị** được trả về bất cứ khi nào bạn xem **thuộc tính stack**.
- **Format Version** (optional):
  - Phiên bản **template CloudFormation** mà **template** tuân thủ.
- **Description** (optional):
  - Một chuỗi văn bản mô tả **template**. Phần này phải luôn theo sau phần **phiên bản định dạng template**.
- **Metadata** (optional):
  - Các đối tượng cung cấp **thông tin bổ sung** về **template**.
- **Rules** (optional):
  - Xác thực một **tham số** hoặc **kết hợp các tham số** được truyền vào **template** trong quá trình **tạo** hoặc **cập nhật stack**.
- **Conditions** (optional):
  - Các **điều kiện** kiểm soát liệu một số **tài nguyên** có được **tạo** hay không hoặc liệu một số **thuộc tính tài nguyên** có được gán giá trị trong quá trình **tạo** hoặc **cập nhật stack**.
- **Transform** (optional):
  - Đối với các **ứng dụng serverless** (còn gọi là ứng dụng dựa trên Lambda), chỉ định **phiên bản** của **AWS Serverless Application Model (AWS SAM)** để sử dụng.
  - Khi bạn chỉ định một **transform**, bạn có thể sử dụng **cú pháp AWS SAM** để khai báo các tài nguyên trong **template**. Mô hình này định nghĩa **cú pháp** mà bạn có thể sử dụng và cách nó được **xử lý**.

# **CloudFormation Access Control**

- **IAM**:
  - **IAM** có thể được áp dụng với CloudFormation để kiểm soát truy cập cho người dùng, liệu họ có thể **xem template stack**, **tạo stack**, hoặc **xóa stack**.
  - **Quyền IAM** cần được cung cấp cho **người dùng** đối với các **dịch vụ AWS** và **tài nguyên** được cung cấp khi **stack** được tạo.
  - Trước khi một **stack** được tạo, **AWS CloudFormation** xác thực **template** để kiểm tra các **tài nguyên IAM** mà nó có thể tạo.
- **Service Role**:
  - Một **service role** là một **vai trò AWS IAM** cho phép **AWS CloudFormation** thực hiện các lệnh gọi tới các tài nguyên trong một **stack** thay mặt cho **người dùng**.
  - Theo mặc định, **AWS CloudFormation** sử dụng một **phiên tạm thời** được tạo từ **thông tin xác thực của người dùng** cho các thao tác **stack**.
  - Đối với một **service role**, **AWS CloudFormation** sử dụng **thông tin xác thực của vai trò**.
  - Khi một **service role** được chỉ định, **AWS CloudFormation** luôn sử dụng vai trò đó cho tất cả các thao tác được thực hiện trên **stack** đó.

# **Template Resource Attributes**

- **CreationPolicy Attribute**:
  - Được gọi trong quá trình **tạo tài nguyên** liên quan.
  - Có thể được liên kết với một **tài nguyên** để ngăn trạng thái của nó đạt **create complete** cho đến khi CloudFormation nhận được một số lượng **tín hiệu thành công** được chỉ định hoặc **thời gian chờ** bị vượt quá.
  - Giúp **đợi** các hành động cấu hình tài nguyên trước khi **tạo stack** tiếp tục
    _Ví dụ: cài đặt phần mềm trên một phiên bản EC2_.
- **DeletionPolicy Attribute**:
  - **Bảo vệ** hoặc (trong một số trường hợp) **sao lưu** một tài nguyên khi **stack** của nó bị xóa.
  - CloudFormation **xóa tài nguyên** nếu một tài nguyên không có **DeletionPolicy attribute**, theo mặc định.
  - Để giữ một tài nguyên khi **stack** của nó bị xóa:
    - Mặc định, **Delete** sẽ khiến các tài nguyên bị xóa.
    - Chỉ định **Retain** cho tài nguyên đó, để ngăn việc xóa.
    - Chỉ định **Snapshot** để tạo một **snapshot** trước khi xóa tài nguyên, nếu khả năng **snapshot** được hỗ trợ _ví dụ: RDS, EC2 volume, v.v._.
- **DependsOn Attribute**:
  - Giúp xác định **thứ tự phụ thuộc** và chỉ định rằng việc **tạo** một tài nguyên cụ thể phải theo sau một tài nguyên khác.
  - Tài nguyên được **tạo** chỉ sau khi **tạo** tài nguyên được chỉ định trong **DependsOn attribute**.
- **Metadata Attribute**:
  - Cho phép **liên kết dữ liệu có cấu trúc** với một tài nguyên.
- **UpdatePolicy Attribute**:
  - Xác định cách **AWS CloudFormation** xử lý các **cập nhật** cho các tài nguyên.
  - Đối với các tài nguyên **`AWS::AutoScaling::AutoScalingGroup`**, CloudFormation gọi một trong ba **chính sách cập nhật** tùy thuộc vào **loại thay đổi** hoặc liệu một **scheduled action** có được liên kết với **Auto Scaling group** hay không:
    - Các chính sách **AutoScalingReplacingUpdate** và **AutoScalingRollingUpdate** áp dụng chỉ khi bạn thực hiện một hoặc nhiều thao tác sau:
      - Thay đổi **`AWS::AutoScaling::LaunchConfiguration`** của **Auto Scaling group**.
      - Thay đổi **VPCZoneIdentifier property** của **Auto Scaling group**.
      - Thay đổi **LaunchTemplate property** của **Auto Scaling group**.
      - Cập nhật một **Auto Scaling group** chứa các phiên bản không khớp với **LaunchConfiguration** hiện tại.
    - Chính sách **AutoScalingScheduledAction** áp dụng khi bạn cập nhật một **stack** bao gồm một **Auto Scaling group** với một **scheduled action** liên quan.
  - Đối với các tài nguyên **`AWS::Lambda::Alias`**, CloudFormation thực hiện triển khai **CodeDeploy** khi **version** thay đổi trên **alias**.

# CloudFormation Termination Protection

- **Termination protection** giúp ngăn một **stack** bị **xóa vô tình**.
- **Termination protection** trên **stacks** bị **tắt** theo mặc định.
- **Termination protection** có thể được bật khi **tạo stack**.
- **Termination protection** có thể được thiết lập trên một **stack** với bất kỳ trạng thái nào ngoại trừ **`DELETE_IN_PROGRESS`** hoặc **`DELETE_COMPLETE`**.
- Việc **bật** hoặc **tắt termination protection** trên một **stack** cũng thiết lập nó cho bất kỳ **nested stacks** thuộc về **stack** đó. Bạn không thể **bật** hoặc **tắt termination protection** trực tiếp trên một **nested stack**.
- Nếu một **người dùng** cố gắng **xóa trực tiếp** một **nested stack** thuộc về một **stack** có bật **termination protection**, thao tác sẽ **thất bại** và **nested stack** vẫn **không thay đổi**.
- Nếu một **người dùng** thực hiện **cập nhật stack** dẫn đến việc xóa **nested stack**, **AWS CloudFormation** sẽ **xóa nested stack** tương ứng.

# CloudFormation Stack Policy

- **Stack policy** có thể ngăn các **tài nguyên stack** bị **cập nhật** hoặc **xóa không mong muốn** trong quá trình **cập nhật stack**.
- Theo mặc định, tất cả các **hành động cập nhật** đều được phép trên tất cả các **tài nguyên** và bất kỳ ai có **quyền cập nhật stack** có thể cập nhật tất cả các **tài nguyên** trong **stack**.
- Trong quá trình **cập nhật**, một số tài nguyên có thể yêu cầu **gián đoạn** hoặc được **thay thế hoàn toàn**, dẫn đến **ID vật lý mới** hoặc **lưu trữ hoàn toàn mới** và do đó cần được ngăn chặn.
- Một **stack policy** là một tài liệu **JSON** xác định các **hành động cập nhật** có thể được thực hiện trên các **tài nguyên được chỉ định**.
- Sau khi bạn thiết lập một **stack policy**, tất cả các **tài nguyên** trong **stack** được **bảo vệ** theo mặc định.
- Các **cập nhật** trên các **tài nguyên cụ thể** có thể được thêm vào bằng một câu lệnh **Allow** rõ ràng cho các tài nguyên đó trong **stack policy**.
- Chỉ có thể định nghĩa **một stack policy** cho mỗi **stack**, nhưng **nhiều tài nguyên** có thể được bảo vệ trong một **policy** duy nhất.
- Một **stack policy** áp dụng cho tất cả **người dùng CloudFormation** cố gắng cập nhật **stack**. Bạn không thể liên kết các **stack policies** khác nhau với các **người dùng** khác nhau.
- Một **stack policy** chỉ áp dụng trong quá trình **cập nhật stack**. Nó không cung cấp **kiểm soát truy cập** như một **IAM policy**.

# CloudFormation StackSets

![3.png](@/assets/images/aws/other/cloudformation/3.png)

- **CloudFormation StackSets** mở rộng chức năng của **stacks** bằng cách cho phép bạn **tạo**, **cập nhật** hoặc **xóa stacks** trên **nhiều tài khoản** và **Regions** với một **thao tác duy nhất**.
- Sử dụng một **tài khoản quản trị**, một **template CloudFormation** có thể được **định nghĩa**, **quản lý** và sử dụng làm cơ sở để **cung cấp stacks** vào các **tài khoản mục tiêu** được chọn trên các **AWS Regions** được chỉ định.

# CloudFormation Registry

- **CloudFormation Registry** giúp quản lý các **extensions**, cả **public** và **private**, chẳng hạn như **tài nguyên**, **modules** và **hooks** có sẵn để sử dụng trong **tài khoản AWS** của bạn.
- **CloudFormation Registry** cung cấp một số **lợi thế** so với **custom resources**:
  - Hỗ trợ **mô hình hóa**, **cung cấp** và **quản lý** các **tài nguyên ứng dụng bên thứ ba**.
  - Hỗ trợ các thao tác **Create**, **Read**, **Update**, **Delete** và **List** (**CRUDL**).
  - Hỗ trợ **drift detection** trên các **loại tài nguyên private** và **bên thứ ba**.

# CloudFormation Helper Scripts

Tham khảo ở đây:

[AWS CloudFormation Helper Scripts](CloudFormation%201d63fa6ae483802e842bd36dbfc8b4ae/AWS%20CloudFormation%20Helper%20Scripts%201d73fa6ae48380159915f26cf8a42b3f.md)

# CloudFormation Best Practices

Tham khảo ở đây:

[CloudFormation Best Practices](CloudFormation%201d63fa6ae483802e842bd36dbfc8b4ae/CloudFormation%20Best%20Practices%201d73fa6ae48380fd8fc1c75588dcc7a0.md)
