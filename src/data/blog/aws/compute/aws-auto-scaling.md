---
author: thuongnn
pubDatetime: 2023-03-28T10:20:15Z
modDatetime: 2023-03-28T10:20:15Z
title: "[AWS] AWS Auto Scaling"
folder: "aws"
draft: false
tags:
  - AWS
  - Amazon Web Services
description: Tìm hiểu về dịch vụ tự động điều chỉnh quy mô của AWS, giúp tối ưu hóa hiệu suất và chi phí.
---

Bài viết được tham khảo và tổng hợp lại từ Jayendra's Blog, xem bài viết gốc ở đây: https://jayendrapatil.com/aws-auto-scaling.

## Table of contents

**AWS Auto Scaling** là dịch vụ tự động điều chỉnh số lượng phiên bản EC2 để đáp ứng nhu cầu ứng dụng, đảm bảo hiệu suất và tối ưu chi phí.

# **Thành phần chính của Auto Scaling**

- **Auto Scaling Groups (ASG):** Tập hợp các phiên bản EC2 có cấu hình giống nhau, hoạt động như một đơn vị logic để quản lý việc scaling. ASG yêu cầu:
  - **Launch Configuration hoặc Launch Template:** Xác định mẫu cấu hình EC2 để khởi chạy phiên bản.
  - **Số lượng tối thiểu và tối đa:** Giới hạn số phiên bản khi áp dụng chính sách scaling.
  - **Số lượng mong muốn:** Số phiên bản ASG cần duy trì.
  - **Vùng sẵn sàng hoặc Subnet:** Xác định nơi khởi chạy phiên bản.
  - **Metrics và Health Checks:** Xác định khi nào cần khởi chạy hoặc kết thúc phiên bản và kiểm tra tình trạng sức khỏe của chúng.
- **Launch Configuration:** Mẫu cấu hình phiên bản mà ASG sử dụng để khởi chạy EC2. Bao gồm AMI, loại phiên bản, nhóm bảo mật, dữ liệu người dùng, v.v. Lưu ý, Launch Configuration không thể chỉnh sửa sau khi tạo; nếu cần thay đổi, phải tạo mới và liên kết với ASG.

# Tính năng

- **Auto Scaling Policy**
  - **Target Tracking Scaling:** Tự động điều chỉnh số lượng phiên bản dựa trên giá trị mục tiêu của một metric cụ thể. Ví dụ, duy trì CPU ở mức 70%.
  - **Step Scaling:** Điều chỉnh số lượng phiên bản dựa trên mức độ vi phạm ngưỡng của alarm. Ví dụ, nếu CPU vượt 70%, thêm 2 phiên bản; nếu vượt 80%, thêm 3 phiên bản.
  - **Scheduled Scaling:** Điều chỉnh số lượng phiên bản tại thời điểm xác định trước, phù hợp với các sự kiện dự kiến như chiến dịch marketing.
- **Cooldown Period:** Khoảng thời gian để ASG ổn định sau một hoạt động scaling, ngăn chặn việc scaling liên tiếp không cần thiết. Thời gian mặc định là 300 giây.
- **Termination Policy:** Xác định cách ASG chọn phiên bản để kết thúc khi giảm scaling. Mặc định, ASG:
  - Chọn AZ có nhiều phiên bản nhất, giảm phân phối không đồng đều.
  - Trong AZ đó, chọn phiên bản được khởi chạy sớm nhất.
- **Instance Refresh:** Tính năng tự động thay thế các phiên bản trong ASG để cập nhật cấu hình hoặc bản vá bảo mật. Có thể kích hoạt thủ công hoặc theo lịch trình.
- **Instance Protection:** Ngăn chặn ASG tự động kết thúc một số phiên bản cụ thể trong quá trình scaling. Hữu ích khi cần duy trì các phiên bản quan trọng.
- **Standby State:** Cho phép đặt phiên bản vào trạng thái chờ để bảo trì hoặc khắc phục sự cố, trong khi vẫn là thành viên của ASG nhưng không xử lý lưu lượng.
- **Suspension:** Tạm dừng các hoạt động scaling trong ASG, hữu ích khi cần bảo trì hoặc tránh scaling trong các tình huống đặc biệt.
- **Auto Scaling Lifecycle:** Xác định cách các phiên bản được khởi chạy và kết thúc trong ASG. Bao gồm các trạng thái như Pending, InService, Terminating và Terminated.

# **Tích hợp với ELB**

![1.png](@/assets/images/aws/compute/aws-auto-scaling/1.png)

**AWS Auto Scaling và Elastic Load Balancing (ELB)** là hai dịch vụ quan trọng giúp ứng dụng của bạn đạt được khả năng mở rộng linh hoạt, độ sẵn sàng cao và phân phối tải hiệu quả. Khi kết hợp, chúng đảm bảo rằng lưu lượng truy cập được phân phối đồng đều và hệ thống tự động điều chỉnh để đáp ứng nhu cầu.

### **Tích hợp Auto Scaling với ELB**

- **Auto Scaling** tự động thêm hoặc giảm số lượng phiên bản EC2 dựa trên nhu cầu thực tế, đảm bảo hiệu suất và tối ưu chi phí.
- **ELB** phân phối lưu lượng truy cập đến các phiên bản EC2 trong một hoặc nhiều Vùng sẵn sàng (AZ), đảm bảo không có phiên bản nào bị quá tải.

Khi tích hợp:

- **ELB** hoạt động như một điểm truy cập duy nhất cho tất cả lưu lượng đến các phiên bản trong nhóm Auto Scaling.
- **Auto Scaling** tự động thêm các phiên bản mới vào ELB khi chúng được khởi chạy và loại bỏ chúng khi bị chấm dứt.

### **Cấu hình tích hợp**

- **Gắn/Dỡ bỏ ELB với Auto Scaling Group:**
  - Bạn có thể gắn một hoặc nhiều ELB vào nhóm Auto Scaling hiện có.
  - Khi ELB được gắn, nó tự động đăng ký các phiên bản trong nhóm và phân phối lưu lượng đến chúng.
  - Khi dỡ bỏ, ELB sẽ hủy đăng ký các phiên bản nhưng chúng vẫn tiếp tục chạy.
- **Đảm bảo tính sẵn sàng cao và dự phòng:**
  - **Auto Scaling** có thể mở rộng qua nhiều AZ trong cùng một khu vực.
  - Nếu một AZ gặp sự cố, Auto Scaling sẽ khởi chạy phiên bản mới trong AZ khác không bị ảnh hưởng.
  - **ELB** có thể được cấu hình để phân phối lưu lượng qua nhiều AZ, đảm bảo dự phòng địa lý và tăng độ tin cậy.

### **Kiểm tra tình trạng và Giám sát**

- **Kiểm tra tình trạng:**
  - **Auto Scaling** xác định trạng thái sức khỏe của mỗi phiên bản bằng cách kiểm tra định kỳ kết quả kiểm tra trạng thái của EC2.
  - **ELB** cũng thực hiện kiểm tra tình trạng trên các phiên bản EC2 đã đăng ký, đảm bảo rằng chỉ các phiên bản khỏe mạnh mới nhận lưu lượng.
  - Bạn có thể cấu hình **Auto Scaling** để sử dụng kết quả kiểm tra tình trạng của ELB cùng với kiểm tra trạng thái EC2 để xác định tình trạng của các phiên bản trong nhóm.
- **Giám sát:**
  - **ELB** gửi dữ liệu về các bộ cân bằng tải và phiên bản EC2 đến **CloudWatch**.
  - Sau khi đăng ký một hoặc nhiều ELB với nhóm Auto Scaling, bạn có thể cấu hình nhóm để sử dụng các số liệu của ELB (như độ trễ yêu cầu hoặc số lượng yêu cầu) để tự động điều chỉnh quy mô ứng dụng.
