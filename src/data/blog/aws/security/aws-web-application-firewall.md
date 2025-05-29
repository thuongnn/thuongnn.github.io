---
author: thuongnn
pubDatetime: 2023-07-27T09:15:33Z
modDatetime: 2023-07-27T09:15:33Z
title: "[AWS] AWS Web Application Firewall"
folder: "aws"
draft: false
ogImage: "../../../../assets/images/aws/security/aws-web-application-firewall/1.png"
tags:
  - AWS
  - Amazon Web Services
description: Tìm hiểu về Web Application Firewall của AWS, giúp bảo vệ ứng dụng web khỏi các cuộc tấn công phổ biến.
---

Bài viết được tham khảo và tổng hợp lại từ Jayendra's Blog, xem bài viết gốc ở đây: https://jayendrapatil.com/aws-waf.

## Table of contents

# **AWS Web Application Firewall (WAF)**

- **AWS WAF** là dịch vụ bảo vệ ứng dụng web khỏi các cuộc tấn công bằng cách cho phép cấu hình các quy tắc để cho phép, chặn hoặc giám sát (đếm) các yêu cầu web dựa trên các điều kiện đã định nghĩa.
- **Các tính năng chính của AWS WAF:**
  - **Bảo vệ khỏi các kỹ thuật tấn công phổ biến:**
    - **SQL Injection**
    - **Cross-Site Scripting (XSS)**
  - **Cấu hình điều kiện bảo vệ (Conditions):**
    - **Địa chỉ IP**: Có thể cấu hình để cho phép hoặc chặn yêu cầu từ các địa chỉ IP cụ thể.
    - **HTTP Headers**: Kiểm tra các header trong yêu cầu HTTP.
    - **HTTP Body**: Kiểm tra nội dung trong phần thân của yêu cầu HTTP.
    - **URI Strings**: Kiểm tra chuỗi URI trong yêu cầu.
  - **Tích hợp với các dịch vụ của AWS:**
    - **AWS WAF với Amazon CloudFront**:
      - **Chạy tại các Edge Locations của AWS trên toàn cầu**, giúp bảo vệ các yêu cầu web từ người dùng gần nhất.
      - **Chặn yêu cầu độc hại trước khi đến máy chủ web**.
      - **Hỗ trợ các nguồn tùy chỉnh ngoài AWS**, cho phép bảo vệ các tài nguyên không phải của AWS.
    - **AWS WAF với Application Load Balancer (ALB):**
      - **Chạy trong region**, có thể bảo vệ cả public và internal **Load Balancer**.
      - **Chặn yêu cầu độc hại** trước khi chúng tiếp cận các ứng dụng web.
    - **AWS WAF với API Gateway:**
      - **Bảo vệ các REST API**, giúp bảo vệ các ứng dụng và kiểm tra các yêu cầu HTTP hoặc HTTPS.
      - Cung cấp các **Managed Rules** để bảo vệ khỏi các mối đe dọa như các lỗ hổng ứng dụng (ví dụ như OWASP), bot, hoặc các lỗ hổng bảo mật và triển khai thông qua các quy tắc như Common Vulnerabilities and Exposures (CVE).
      - **Lưu trữ log**: Các log có thể được gửi đến **CloudWatch Logs**, **S3 bucket**, hoặc **Kinesis Data Firehose**.

# WAF Benefits

- **Bảo vệ bổ sung chống lại các cuộc tấn công web**:
  - Bằng cách định nghĩa các điều kiện như **địa chỉ IP**, **header yêu cầu**, **chuỗi trong yêu cầu**, và **dữ liệu độc hại** (SQL injection, XSS).
- **Quy tắc được quản lý sẵn (Managed Rules)**:
  - Giúp bạn bắt đầu dễ dàng và nhanh chóng với các quy tắc đã được cấu hình sẵn để bảo vệ ứng dụng khỏi các mối đe dọa phổ biến.
- **Quản lý dễ dàng**:
  - **API WAF** cho phép tự động hóa các tác vụ quản lý WAF.
  - **Quy tắc có thể tái sử dụng** cho nhiều ứng dụng web khác nhau.
- **Theo dõi thời gian thực**:
  - Cung cấp **thống kê theo thời gian thực** và **yêu cầu web mẫu** để giám sát hiệu quả bảo vệ và phát hiện các vấn đề bảo mật.
- **Linh hoạt trong việc xử lý các yêu cầu**:
  - **Chặn**, **cho phép**, hoặc **giám sát** các yêu cầu theo các quy tắc đã cấu hình, giúp bảo vệ ứng dụng khỏi các tấn công trên môi trường web.

# How WAF Works

AWS WAF (Web Application Firewall) cho phép kiểm soát hành vi của các yêu cầu web thông qua sự kết hợp của **conditions**, **rules** và **web access control lists (Web ACLs)**.

![1.png](@/assets/images/aws/security/aws-web-application-firewall/1.png)

## **Conditions**

Điều kiện xác định các đặc điểm cụ thể của các yêu cầu web mà AWS WAF sẽ theo dõi. Các điều kiện này có thể bao gồm:

- **Mã độc hại (XSS)**: Phát hiện các cuộc tấn công Cross-Site Scripting (XSS), trong đó kẻ tấn công nhúng mã script vào ứng dụng web để khai thác các lỗ hổng bảo mật.
- **Địa chỉ IP hoặc Dải Địa Chỉ IP**: Xác định địa chỉ IP hoặc dải địa chỉ IP mà yêu cầu web xuất phát từ đó.
- **Kích Thước**: Theo dõi độ dài của các phần cụ thể trong yêu cầu web, chẳng hạn như chuỗi truy vấn hoặc tiêu đề.
- **SQL Mã độc (SQL Injection)**: Phát hiện các cuộc tấn công SQL Injection, trong đó kẻ tấn công cố gắng chèn mã SQL độc hại vào yêu cầu web để truy xuất dữ liệu từ cơ sở dữ liệu.
- **Khớp Địa Lý**: Cho phép hoặc chặn các yêu cầu dựa trên quốc gia mà chúng xuất phát.
- **Khớp Chuỗi**: Tìm kiếm các chuỗi cụ thể trong yêu cầu, chẳng hạn như giá trị trong tiêu đề **User-Agent** hoặc văn bản chuỗi truy vấn.

Một số điều kiện có thể **nhận nhiều giá trị**, cho phép khớp phức tạp hơn.

## **Actions**

Dựa trên các điều kiện, AWS WAF có thể thực hiện một số hành động:

- **Cho phép**: Cho phép tất cả các yêu cầu ngoại trừ những yêu cầu khớp với các điều kiện cụ thể (danh sách đen).
- **Chặn**: Chặn tất cả các yêu cầu ngoại trừ những yêu cầu khớp với các điều kiện cụ thể (danh sách trắng).
- **Giám sát (Đếm)**: Đếm số lượng yêu cầu khớp với các đặc điểm cụ thể mà không chặn chúng. Điều này hữu ích khi kiểm tra các cấu hình mới để đảm bảo chúng không vô tình chặn lưu lượng hợp pháp.
- **CAPTCHA**: Kiểm tra CAPTCHA đối với các yêu cầu để xác minh xem chúng có đến từ bot hay người dùng thật.

## **Rules**

Các quy tắc AWS WAF xác định cách kiểm tra các yêu cầu HTTP(S) và hành động thực hiện khi yêu cầu khớp với các điều kiện cụ thể.

- Mỗi quy tắc có một hoặc nhiều top-level rule statement. Các statement này có thể bao gồm các statement lồng nhau để có logic phức tạp hơn.
- AWS WAF hỗ trợ các toán tử logic như **AND**, **OR**, và **NOT** để kết hợp nhiều điều kiện trong một quy tắc. Ví dụ, một quy tắc có thể yêu cầu:
  - Yêu cầu đến từ IP `192.0.2.44`
  - Chứa "BadBot" trong tiêu đề **User-Agent**
  - Bao gồm mã SQL độc hại trong chuỗi truy vấn.
  - Tất cả ba điều kiện phải được thỏa mãn (AND) để quy tắc được kích hoạt và hành động tương ứng được thực hiện.

## **Rule Groups**

**Rule Groups** là một tập hợp các quy tắc có thể được tái sử dụng và thêm vào Web ACL. Rule groups chia thành ba loại chính:

- Các rule do AWS Quản lý và các bên bán từ AWS Marketplace tạo ra và duy trì.
- Các rule do người dùng tạo và duy trì.
- Các rule do các dịch vụ khác như AWS Firewall Manager hoặc Shield Advanced quản lý.

## **Web ACLs (Web Access Control Lists)**

**Web ACL** cung cấp kiểm soát chi tiết đối với các yêu cầu web mà tài nguyên được bảo vệ phản hồi. Các tính năng chính của Web ACL bao gồm:

- Có thể kết hợp nhiều rule hoặc rule groups.
- Xác định hành động (cho phép, chặn hoặc đếm) cho mỗi rule.
- AWS WAF so sánh mỗi yêu cầu với các rule trong Web ACL, theo thứ tự đã được chỉ định. Nếu yêu cầu khớp với rule, hành động định sẵn cho rule đó được thực hiện, và việc đánh giá sẽ dừng lại.
- Nếu không có rule nào khớp với yêu cầu, hành động mặc định của Web ACL sẽ quyết định liệu yêu cầu có bị chặn hay cho phép. Điều này có thể dựa trên các tiêu chí như:
  - **Địa chỉ IP** nguồn
  - **Quốc gia xuất phát**
  - **Khớp Chuỗi hoặc Regex** trong các phần của yêu cầu
  - **Kích thước của một phần yêu cầu**
  - **Phát hiện SQL hay mã độc**
  - **Rule dựa trên tần suất yêu cầu** để phát hiện các cuộc tấn công DDoS.
- AWS WAF cũng hỗ trợ **rule dựa trên tần suất**, có thể tự động chặn các yêu cầu từ địa chỉ IP vượt quá ngưỡng yêu cầu trong một khoảng thời gian xác định. Điều này giúp bảo vệ chống lại các cuộc tấn công DDoS (Distributed Denial of Service)

# AWS WAF based Architecture

![2.png](@/assets/images/aws/security/aws-web-application-firewall/2.png)

Kiến trúc này mô tả cách AWS WAF tích hợp với AWS CloudFront, Lambda và S3 để cập nhật các quy tắc WAF động dựa trên các mẫu yêu cầu. Dưới đây là phân tích các thành phần và cách chúng tương tác:

## **1. CloudFront Nhận Các Yêu Cầu Web**

- **CloudFront** hoạt động như một mạng phân phối nội dung (CDN) xử lý các yêu cầu web thay mặt cho ứng dụng web của bạn.
- **Gửi yêu cầu** đến ứng dụng của bạn, lưu trữ nội dung và cung cấp quyền truy cập nhanh cho người dùng.
- **Ghi lại nhật ký truy cập**: CloudFront ghi lại chi tiết các yêu cầu mà nó xử lý và gửi chúng đến một **S3 bucket** để lưu trữ. Những nhật ký này chứa thông tin như địa chỉ IP, URL yêu cầu, mã trạng thái phản hồi, v.v.

## **2. S3 Bucket Lưu Trữ Nhật Ký Truy Cập**

- **S3 bucket** lưu trữ tất cả các nhật ký truy cập của CloudFront. Các nhật ký này có thể được Lambda function truy cập để xử lý.
- Mỗi khi một nhật ký mới được lưu trữ trong S3 bucket, một **Lambda function** sẽ được kích hoạt để xử lý các nhật ký.

## **3. Lambda Function Xử Lý Nhật Ký**

- **Phân tích Nhật Ký**: Lambda function được kích hoạt mỗi khi có nhật ký mới được thêm vào S3 bucket. Nó phân tích các tệp nhật ký để kiểm tra các mẫu yêu cầu và mã lỗi.
- **Xác định Các Yêu Cầu Xấu**: Lambda function tìm các yêu cầu gây ra mã lỗi HTTP như:
  - **400** (Yêu cầu không hợp lệ)
  - **403** (Cấm)
  - **404** (Không tìm thấy)
  - **405** (Phương thức không được phép)
- **Đếm Các Yêu Cầu Xấu**: Hàm Lambda đếm số lượng yêu cầu gây ra các lỗi này, xác định các địa chỉ IP có thể là yêu cầu xâm phạm hoặc sai sót.

## **4. Lưu Trữ Tạm Thời trong S3**

- Lambda function lưu trữ kết quả phân tích (như các bad IP Address) tạm thời trong S3 bucket. Điều này cho phép xử lý thêm và theo dõi các địa chỉ IP liên quan đến yêu cầu không mong muốn.

## **5. Cập Nhật Quy Tắc AWS WAF**

- **Cập Nhật Động**: Dựa trên phân tích các nhật ký truy cập, Lambda function cập nhật **quy tắc AWS WAF** để chặn các địa chỉ IP đã xác định.
- **Chặn Tạm Thời**: Lambda function có thể thiết lập **thời gian chặn tạm thời** cho các địa chỉ IP này (ví dụ: vài giờ hoặc vài ngày). Trong thời gian này, WAF sẽ chặn yêu cầu từ các IP này để giảm thiểu các cuộc tấn công hoặc hành vi xâm phạm.
- Sau khi hết thời gian chặn, **AWS WAF sẽ cho phép** các địa chỉ IP này truy cập lại vào ứng dụng của bạn nhưng vẫn tiếp tục theo dõi hoạt động của chúng.

## **6. Giám Sát và Thống Kê qua CloudWatch**

- **Thông Số Thực Thi**: Lambda function xuất bản các thông số thực thi vào **CloudWatch**, bao gồm:
  - Số lượng **yêu cầu** đã phân tích.
  - Số lượng **địa chỉ IP** đã bị chặn.
  - **Dữ liệu liên quan khác** (ví dụ: số lượng mã lỗi phát hiện được).
- Những thông số này giúp giám sát hiệu quả của Lambda function và các cập nhật của WAF.

## **7. Tích Hợp Thông Báo SNS**

- **Tích Hợp CloudWatch với SNS**: Các thông số từ CloudWatch có thể được tích hợp với **Simple Notification Service (SNS)** để gửi thông báo. Điều này giúp các quản trị viên nhận được cảnh báo khi các ngưỡng nhất định được đạt tới, chẳng hạn như:
  - Một số lượng yêu cầu nhất định gây ra mã lỗi.
  - Một số lượng địa chỉ IP nhất định bị chặn.
  - Các thông số hiệu suất hoặc bảo mật khác.

# Web Application Firewall Sandwich Architecture

![3.png](@/assets/images/aws/security/aws-web-application-firewall/3.png)

## **Các cuộc tấn công DDoS ở lớp ứng dụng và cách WAF giúp giảm thiểu**

Các cuộc tấn công DDoS ở lớp ứng dụng thường nhắm vào các ứng dụng web với lưu lượng thấp hơn so với các cuộc tấn công hạ tầng. **WAF** có thể được tích hợp như một phần của hạ tầng để giảm thiểu các cuộc tấn công này.

## **Cách WAF Hoạt Động**

WAF hoạt động như một bộ lọc áp dụng một tập hợp các quy tắc vào lưu lượng web, nhằm bảo vệ ứng dụng khỏi các lỗ hổng như **XSS** (Cross-Site Scripting) và **SQL Injection**. Bên cạnh đó, WAF cũng có thể giúp tăng cường khả năng chống lại các cuộc tấn công DDoS bằng cách giảm thiểu các cuộc tấn công **HTTP GET** hoặc **POST flood**.

## **Các Loại Tấn Công DDoS**

- **HTTP GET Floods**: Đây là kiểu tấn công yêu cầu một URL cụ thể với tần suất rất cao hoặc yêu cầu tất cả các đối tượng từ ứng dụng của bạn. Mục tiêu là làm quá tải các tài nguyên của ứng dụng bằng cách gửi nhiều yêu cầu.
- **HTTP POST Floods**: Tấn công này tìm các quá trình tốn kém trong ứng dụng, ví dụ như đăng nhập hoặc tìm kiếm trong cơ sở dữ liệu, và cố gắng kích hoạt chúng để làm quá tải ứng dụng.

## **Các Tính Năng của WAF để Ngăn Chặn Tấn Công DDoS**

- **Giới hạn tần suất HTTP**: WAF có thể giới hạn số lượng yêu cầu mà mỗi người dùng có thể gửi trong một khoảng thời gian nhất định. Khi vượt quá ngưỡng này, WAF có thể chặn hoặc lưu trữ các yêu cầu mới để đảm bảo người dùng khác vẫn có thể truy cập ứng dụng.
- **Kiểm tra các yêu cầu HTTP**: WAF có thể kiểm tra và nhận diện các yêu cầu không phù hợp với các mẫu thông thường.

## **Mô Hình "WAF Sandwich"**

Trong mô hình **"WAF sandwich"**, EC2 chạy phần mềm WAF (không phải AWS WAF) được đặt trong một nhóm **Auto Scaling** và nằm giữa hai **ELB** (Elastic Load Balancer).

- **Load balancer frontend**: Đây là một load balancer công cộng trong VPC mặc định, có nhiệm vụ phân phối tất cả lưu lượng vào EC2 chạy phần mềm WAF.
- Khi có lượng lưu lượng tăng đột biến, mô hình này cho phép tự động mở rộng và thêm các EC2 WAF mới để đáp ứng yêu cầu.

## **Quy Trình Hoạt Động**

1. **Lưu lượng đến WAF EC2**: Tất cả lưu lượng từ người dùng sẽ được chuyển đến EC2 chạy WAF thông qua load balancer phía trước.
2. **Kiểm tra và lọc lưu lượng**: Sau khi lưu lượng đã được kiểm tra và lọc, WAF EC2 sẽ chuyển lưu lượng đã lọc tới **load balancer backend**.
3. **Phân phối tới ứng dụng**: Load balancer nội bộ sẽ phân phối lưu lượng vào các **EC2 ứng dụng** của bạn.

## **Lợi Ích của Cấu Hình Này**

Cấu hình này cho phép các EC2 WAF có thể mở rộng và đáp ứng yêu cầu mà không ảnh hưởng đến khả năng sẵn có của ứng dụng EC2, giúp bảo vệ ứng dụng khỏi các cuộc tấn công mà vẫn duy trì hoạt động ổn định.
