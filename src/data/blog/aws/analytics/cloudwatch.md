---
author: thuongnn
pubDatetime: 2023-01-16T14:30:45Z
modDatetime: 2023-01-16T14:30:45Z
title: "[AWS] Amazon CloudWatch"
folder: "aws"
draft: false
tags:
  - AWS
  - Amazon Web Services
description: Tìm hiểu về dịch vụ giám sát và quan sát tài nguyên AWS, giúp thu thập và theo dõi các metrics, logs và events.
---

Bài viết được tham khảo và tổng hợp lại từ Jayendra's Blog, xem bài viết gốc ở đây: https://jayendrapatil.com/aws-cloudwatch.

## Table of contents

- **CloudWatch** giám sát các tài nguyên và ứng dụng AWS theo thời gian thực.
- Có thể sử dụng CloudWatch để thu thập và theo dõi các **số liệu (metrics)**, là các biến được đo lường cho tài nguyên và ứng dụng.
- CloudWatch là một **kho lưu trữ số liệu**, nơi số liệu có thể được thêm vào và thống kê được truy xuất dựa trên các số liệu đó.
- Ngoài việc giám sát các số liệu tích hợp sẵn của AWS, CloudWatch còn hỗ trợ giám sát **số liệu tùy chỉnh**.
- CloudWatch cung cấp khả năng quan sát toàn diện về **sử dụng tài nguyên**, **hiệu suất ứng dụng** và **tình trạng vận hành**.
- Theo mặc định, **CloudWatch lưu trữ dữ liệu nhật ký vô thời hạn**, nhưng thời gian lưu trữ có thể được thay đổi cho mỗi nhóm nhật ký bất kỳ lúc nào.
- Có thể cấu hình **cảnh báo CloudWatch (alarms)** để:
  - Gửi thông báo, hoặc
  - Tự động thay đổi tài nguyên dựa trên các quy tắc đã định nghĩa.
- [CloudWatch Dashboards](https://jayendrapatil.com/aws-cloudwatch-overview/#CloudWatch_Dashboards) là các trang chủ tùy chỉnh trong bảng điều khiển CloudWatch, dùng để giám sát tài nguyên trong một giao diện duy nhất, kể cả khi tài nguyên nằm ở các Vùng (Regions) khác nhau.
- [CloudWatch Agent](https://jayendrapatil.com/aws-cloudwatch-agent/) hỗ trợ thu thập số liệu và nhật ký từ các phiên bản [EC2](https://jayendrapatil.com/aws-ec2-overview/) và máy chủ tại chỗ, sau đó đẩy chúng lên [CloudWatch](https://jayendrapatil.com/aws-cloudwatch-overview/).

# **CloudWatch Architecture**

![1.png](@/assets/images/aws/analytics/cloudwatch/1.png)

- CloudWatch thu thập các số liệu khác nhau từ nhiều tài nguyên.
- Các số liệu này, dưới dạng thống kê, có sẵn cho người dùng thông qua **Bảng điều khiển (Console)** hoặc **CLI**.
- CloudWatch cho phép tạo **cảnh báo** với các quy tắc đã định nghĩa để:
  - Thực hiện các hành động như tự động mở rộng (auto-scaling) hoặc dừng, khởi động, hoặc chấm dứt các phiên bản.
  - Gửi thông báo bằng các hành động SNS thay mặt người dùng.

# **CloudWatch Concepts**

## **Namespaces**

- Không gian tên CloudWatch là **kho chứa số liệu**.
- Các số liệu trong các không gian tên khác nhau được cách ly, đảm bảo số liệu từ các ứng dụng khác nhau không bị tổng hợp nhầm vào cùng một thống kê.
- Các không gian tên AWS tuân theo quy ước **AWS/<dịch vụ>**, _ví dụ: AWS/EC2, AWS/ELB_.
- Tên không gian tên phải dưới 256 ký tự.
- **Không có không gian tên mặc định. Mỗi phần tử dữ liệu đưa vào CloudWatch phải chỉ định một không gian tên**.

## Metrics

- Số liệu là khái niệm cơ bản trong CloudWatch.
- Được xác định duy nhất bởi **tên**, **không gian tên** và một hoặc nhiều **kích thước (dimensions)**.
- Đại diện cho một tập hợp các điểm dữ liệu được sắp xếp theo thời gian, được gửi đến CloudWatch.
- Mỗi điểm dữ liệu có một **dấu thời gian (timestamp)** và (tùy chọn) một **đơn vị đo lường**.
- Điểm dữ liệu có thể là số liệu tùy chỉnh hoặc số liệu từ các dịch vụ khác trong AWS.
- Có thể truy xuất **thống kê** về các điểm dữ liệu dưới dạng dữ liệu chuỗi thời gian có thứ tự trong một khoảng thời gian xác định.
- Khi yêu cầu thống kê, luồng dữ liệu trả về được xác định bởi không gian tên, tên số liệu, kích thước và (tùy chọn) đơn vị.
- Số liệu chỉ tồn tại trong **Vùng (Region)** mà chúng được tạo.
- CloudWatch lưu trữ dữ liệu số liệu trong **hai tuần**.
- Số liệu không thể xóa, nhưng chúng sẽ **tự động hết hạn sau 15 tháng** nếu không có dữ liệu mới được gửi đến.
- **Thời gian lưu trữ số liệu**:
  - Điểm dữ liệu có chu kỳ dưới 60 giây: có sẵn trong 3 giờ (số liệu tùy chỉnh độ phân giải cao).
  - Điểm dữ liệu có chu kỳ 60 giây (1 phút): có sẵn trong 15 ngày.
  - Điểm dữ liệu có chu kỳ 300 giây (5 phút): có sẵn trong 63 ngày.
  - Điểm dữ liệu có chu kỳ 3600 giây (1 giờ): có sẵn trong 455 ngày (15 tháng).

## Dimensions

- Kích thước là một cặp **tên/giá trị** xác định duy nhất một số liệu.
- Kích thước có thể được xem như **danh mục** cho các đặc điểm của số liệu.
- Kích thước giúp thiết kế cấu trúc cho kế hoạch thống kê.
- Kích thước là một phần của định danh duy nhất cho số liệu; mỗi khi thêm một cặp tên duy nhất vào số liệu, một số liệu mới sẽ được tạo.
- Kích thước có thể được sử dụng để **lọc** các tập hợp kết quả mà truy vấn CloudWatch trả về.
- Một số liệu có thể được gán tối đa **10 kích thước**.

## Timestamps

- Mỗi điểm dữ liệu số liệu phải được đánh dấu bằng một **dấu thời gian** để xác định điểm dữ liệu trên chuỗi thời gian.
- Dấu thời gian có thể cách hiện tại tối đa **hai tuần về quá khứ** và **hai giờ trong tương lai**.
- Nếu không cung cấp dấu thời gian, một dấu thời gian dựa trên thời điểm nhận dữ liệu sẽ được tạo.
- Tất cả thời gian đều phản ánh múi giờ **UTC** khi thống kê được truy xuất.

## Resolution

- Mỗi số liệu thuộc một trong hai loại:
  - **Độ phân giải tiêu chuẩn**: dữ liệu có độ chi tiết 1 phút.
  - **Độ phân giải cao**: dữ liệu có độ chi tiết 1 giây.

## Units

- Đơn vị biểu thị **đơn vị đo lường** của số liệu, _ví dụ: số lượng, byte, %, v.v._

## Statistics

- Thống kê là các **tổng hợp dữ liệu số liệu** trong một khoảng thời gian xác định.
- Tổng hợp được thực hiện dựa trên không gian tên, tên số liệu, kích thước và đơn vị đo lường của điểm dữ liệu trong khoảng thời gian được chỉ định.

## Periods

- Chu kỳ là khoảng thời gian liên quan đến một thống kê cụ thể.
- Mỗi thống kê đại diện cho tổng hợp dữ liệu số liệu được thu thập trong một khoảng thời gian xác định.
- Mặc dù chu kỳ được biểu thị bằng giây, **độ chi tiết tối thiểu cho một chu kỳ là 1 phút**.

## Aggregation

- CloudWatch tổng hợp thống kê theo độ dài chu kỳ được chỉ định trong các lệnh gọi _GetMetricStatistics_.
- Nhiều điểm dữ liệu có thể được gửi với dấu thời gian giống hoặc gần giống nhau. CloudWatch tổng hợp chúng theo độ dài chu kỳ khi thống kê về các điểm dữ liệu đó được yêu cầu.
- Thống kê tổng hợp chỉ có sẵn khi sử dụng **giám sát chi tiết**.
- Các phiên bản sử dụng **giám sát cơ bản** không được bao gồm trong tổng hợp.
- **CloudWatch không tổng hợp dữ liệu giữa các Vùng**.

## Alarms

- Cảnh báo có thể tự động thực hiện hành động thay mặt người dùng dựa trên các tham số được chỉ định.
- Cảnh báo theo dõi một số liệu duy nhất trong một khoảng thời gian xác định và thực hiện một hoặc nhiều hành động dựa trên giá trị số liệu so với ngưỡng đã cho trong một số chu kỳ thời gian.
- Cảnh báo chỉ kích hoạt hành động cho **các thay đổi trạng thái kéo dài**, tức là trạng thái phải thay đổi và được duy trì trong một số chu kỳ xác định.
- Hành động có thể là:
  - Thông báo SNS.
  - Chính sách Auto Scaling.
  - Hành động EC2 – dừng hoặc chấm dứt các phiên bản EC2.
- Sau khi cảnh báo kích hoạt hành động do thay đổi trạng thái, hành vi tiếp theo phụ thuộc vào loại hành động liên quan đến cảnh báo:
  - Với thông báo chính sách Auto Scaling, cảnh báo tiếp tục kích hoạt hành động cho mỗi chu kỳ mà cảnh báo duy trì ở trạng thái mới.
  - Với thông báo SNS, không có hành động bổ sung nào được kích hoạt.
- Cảnh báo có ba trạng thái:
  - **OK**: Số liệu nằm trong ngưỡng đã định nghĩa.
  - **ALARM**: Số liệu vượt ra ngoài ngưỡng đã định nghĩa.
  - **INSUFFICIENT_DATA**: Cảnh báo vừa được khởi động, số liệu không có sẵn, hoặc không đủ dữ liệu để xác định trạng thái cảnh báo.
- Cảnh báo chỉ tồn tại trong Vùng mà chúng được tạo.
- Hành động cảnh báo phải nằm trong cùng Vùng với cảnh báo.
- Lịch sử cảnh báo có sẵn trong **14 ngày** qua.
- Có thể kiểm tra cảnh báo bằng cách đặt nó vào bất kỳ trạng thái nào bằng API SetAlarmState (lệnh mon-set-alarm-state). Thay đổi trạng thái tạm thời này chỉ kéo dài cho đến khi so sánh cảnh báo tiếp theo xảy ra.
- Có thể vô hiệu hóa và kích hoạt cảnh báo bằng API DisableAlarmActions và EnableAlarmActions (lệnh mon-disable-alarm-actions và mon-enable-alarm-actions).

## Regions

- CloudWatch không tổng hợp dữ liệu giữa các Vùng. Do đó, số liệu hoàn toàn tách biệt giữa các Vùng.

# Custom Metrics

- CloudWatch cho phép gửi số liệu tùy chỉnh bằng lệnh CLI put-metric-data (hoặc API tương đương PutMetricData).
- CloudWatch tạo số liệu mới nếu put-metric-data được gọi với tên số liệu mới, nếu không, dữ liệu sẽ được liên kết với số liệu hiện có được chỉ định.
- Lệnh put-metric-data chỉ có thể gửi **một điểm dữ liệu mỗi lần gọi**.
- CloudWatch lưu trữ dữ liệu số liệu dưới dạng một chuỗi điểm dữ liệu, mỗi điểm có dấu thời gian liên quan.
- Khi tạo số liệu mới bằng lệnh put-metric-data, có thể mất đến **2 phút** để truy xuất thống kê về số liệu mới bằng lệnh get-metric-statistics và mất đến **15 phút** để số liệu mới xuất hiện trong danh sách số liệu được truy xuất bằng lệnh list-metrics.
- CloudWatch cho phép gửi:
  - **Điểm dữ liệu đơn lẻ**:
    - Có thể gửi điểm dữ liệu với dấu thời gian chi tiết đến một phần nghìn giây, nhưng CloudWatch tổng hợp dữ liệu với độ chi tiết tối thiểu là 1 phút.
    - CloudWatch ghi lại giá trị trung bình (tổng tất cả giá trị chia cho số lượng mục), số lượng mẫu, giá trị tối đa và giá trị tối thiểu cho mỗi khoảng thời gian 1 phút.
    - CloudWatch sử dụng ranh giới 1 phút khi tổng hợp điểm dữ liệu.
  - **Tập hợp điểm dữ liệu (statistics set)**:
    - Dữ liệu cũng có thể được tổng hợp trước khi gửi đến CloudWatch.
    - Tổng hợp dữ liệu giảm số lượng lệnh gọi xuống còn một lệnh gọi mỗi phút với tập hợp thống kê.
    - Thống kê bao gồm Tổng (Sum), Trung bình (Average), Tối thiểu (Minimum), Tối đa (Maximum), Số lượng mẫu (SampleCount).
- Nếu ứng dụng tạo ra dữ liệu không liên tục và có các khoảng thời gian không có dữ liệu liên quan, có thể gửi giá trị **0** hoặc không gửi giá trị nào.
- Tuy nhiên, việc gửi giá trị **0** thay vì không gửi giá trị có thể hữu ích để:
  - Theo dõi tình trạng ứng dụng, _ví dụ: cấu hình cảnh báo để thông báo nếu không có số liệu nào được gửi mỗi 5 phút_.
  - Theo dõi tổng số điểm dữ liệu.
  - Bao gồm các điểm dữ liệu có giá trị 0 trong các thống kê như giá trị tối thiểu và trung bình.

# CloudWatch Dashboards

- CloudWatch Dashboards là các trang chủ tùy chỉnh trong bảng điều khiển CloudWatch, dùng để giám sát tài nguyên trong một giao diện duy nhất, kể cả khi tài nguyên nằm ở các Vùng khác nhau.
- Dashboards có thể được sử dụng để tạo các giao diện tùy chỉnh cho số liệu và cảnh báo của tài nguyên AWS.
- Dashboards giúp:
  - Tạo một giao diện duy nhất cho các số liệu và cảnh báo được chọn để đánh giá tình trạng tài nguyên và ứng dụng trên một hoặc nhiều Vùng.
  - Xây dựng một sổ tay vận hành cung cấp hướng dẫn cho các thành viên nhóm trong các sự kiện vận hành về cách phản ứng với các sự cố cụ thể.
  - Tạo một giao diện chung cho các phép đo tài nguyên và ứng dụng quan trọng, có thể được chia sẻ giữa các thành viên nhóm để tăng tốc luồng giao tiếp trong các sự kiện vận hành.
- **CloudWatch Cross-account Observability** giúp giám sát và xử lý sự cố cho các ứng dụng trải rộng trên nhiều tài khoản trong một Vùng.
- Cross-account observability bao gồm tài khoản giám sát và tài khoản nguồn:
  - **Tài khoản giám sát** là tài khoản AWS trung tâm có thể xem và tương tác với dữ liệu quan sát được tạo từ các tài khoản nguồn.
  - **Tài khoản nguồn** là tài khoản AWS riêng lẻ tạo ra dữ liệu quan sát cho các tài nguyên trong đó.
  - Tài khoản nguồn chia sẻ dữ liệu quan sát với tài khoản giám sát, có thể bao gồm các loại dữ liệu đo từ xa (telemetry) sau:
    - Số liệu trong CloudWatch.
    - Nhóm nhật ký trong CloudWatch Logs.
    - Dấu vết (traces) trong AWS X-Ray.

# CloudWatch Agent

- **CloudWatch Agent** hỗ trợ thu thập số liệu và nhật ký từ các phiên bản [EC2](https://jayendrapatil.com/aws-ec2-overview/) và máy chủ tại chỗ, sau đó đẩy chúng lên CloudWatch.
- Nhật ký được thu thập bởi CloudWatch Agent được xử lý và lưu trữ trong **CloudWatch Logs**.

# CloudWatch Logs

Tham khảo bài viết dưới đây:

[CloudWatch Logs](CloudWatch%20EventBridge%201d63fa6ae48380329d0cd1aef89a09f4/CloudWatch%20Logs%201d73fa6ae48380599cf4edf6838a5e71.md)

# **CloudWatch Supported Services**

Tham khảo thông tin ở đây:

[**CloudWatch Monitoring Supported AWS Services**](CloudWatch%20EventBridge%201d63fa6ae48380329d0cd1aef89a09f4/CloudWatch%20Monitoring%20Supported%20AWS%20Services%201d73fa6ae483809fb091d96efdc177fd.md)

# Truy cập CloudWatch

- CloudWatch có thể được truy cập bằng:
  - Bảng điều khiển AWS CloudWatch.
  - CloudWatch CLI.
  - AWS CLI.
  - API CloudWatch.
  - AWS SDKs.
