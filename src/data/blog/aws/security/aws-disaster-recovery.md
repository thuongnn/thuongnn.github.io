---
author: thuongnn
pubDatetime: 2023-07-22T09:15:33Z
modDatetime: 2025-05-29T02:30:41Z
title: "[AWS] AWS Disaster Recovery"
folder: "aws"
draft: true
tags:
  - AWS
  - Amazon Web Services
description: Tìm hiểu về các chiến lược và dịch vụ phục hồi sau thảm họa của AWS, đảm bảo tính liên tục của doanh nghiệp.
ogImage: https://techblogbuilder.com/wp-content/uploads/sites/4/2021/06/techblogbuilder-home.png
---

Bài viết được tham khảo và tổng hợp lại từ Jayendra's Blog, xem bài viết gốc ở đây: https://jayendrapatil.com/aws-disaster-recovery.

AWS cung cấp các chiến lược và công cụ giúp tổ chức xây dựng kế hoạch phục hồi sau thảm họa (Disaster Recovery) để đảm bảo tính liên tục của hệ thống và giảm thiểu thời gian ngừng hoạt động. AWS Disaster Recovery giúp tổ chức xây dựng hệ thống sẵn sàng với chi phí hợp lý, hỗ trợ linh hoạt từ chiến lược đơn giản đến phức tạp, tùy thuộc vào nhu cầu cụ thể của doanh nghiệp.

## Table of contents

### **Khái niệm chính**

- **Disaster Recovery (DR)** là quá trình khôi phục hệ thống, ứng dụng và dữ liệu sau các sự cố không mong muốn như lỗi phần cứng, tấn công mạng, hoặc thiên tai.
- **RPO (Recovery Point Objective)** xác định lượng dữ liệu tối đa có thể bị mất trong trường hợp xảy ra thảm họa, thường đo bằng thời gian (ví dụ: 5 phút dữ liệu).
- **RTO (Recovery Time Objective)** là thời gian tối đa mà hệ thống cần để khôi phục sau sự cố và trở lại hoạt động bình thường.

### **Các chiến lược DR trên AWS**

- **Backup and Restore**
  - Phương pháp đơn giản nhất, dựa vào việc sao lưu dữ liệu định kỳ.
  - Phù hợp với ứng dụng không yêu cầu thời gian khôi phục nhanh.
  - Sử dụng các dịch vụ như Amazon S3, S3 Glacier, và AWS Backup.
- **Pilot Light**
  - Hệ thống tối thiểu luôn hoạt động để khởi động nhanh khi xảy ra thảm họa.
  - Dữ liệu và cấu hình quan trọng được đồng bộ hóa với môi trường DR.
  - Sử dụng dịch vụ như EC2, Auto Scaling và RDS để khởi động các tài nguyên cần thiết.
- **Warm Standby**
  - Một phiên bản nhỏ hơn của hệ thống chính luôn chạy ở trạng thái tối thiểu.
  - Khi có sự cố, hệ thống mở rộng tài nguyên để xử lý toàn bộ khối lượng công việc.
  - Sử dụng Elastic Load Balancer, Auto Scaling và RDS Multi-AZ.
- **Multi-Site Active-Active**
  - Nhiều vùng hoạt động đồng thời để chia sẻ tải và giảm thiểu rủi ro ngừng hoạt động.
  - Hệ thống có khả năng chuyển đổi nhanh chóng nếu một vùng bị lỗi.
  - Sử dụng Amazon Route 53, Elastic Load Balancing, và DynamoDB Global Tables.

### **Dịch vụ AWS hỗ trợ Disaster Recovery**

- **Amazon S3 và S3 Glacier** lưu trữ dữ liệu sao lưu với khả năng chịu lỗi cao và chi phí thấp.
- **AWS Backup** quản lý và tự động hóa các tác vụ sao lưu.
- **Amazon RDS** hỗ trợ Multi-AZ deployment để sao chép dữ liệu theo thời gian thực.
- **Amazon Route 53** cung cấp khả năng chuyển hướng lưu lượng thông minh giữa các vùng và địa điểm.
- **AWS Elastic Disaster Recovery (AWS DRS)** khôi phục nhanh chóng các ứng dụng bằng cách sao chép liên tục dữ liệu vào môi trường DR.
- **AWS CloudFormation và AWS Elastic Beanstalk** tự động triển khai lại cơ sở hạ tầng và ứng dụng trong môi trường DR.

### **Lợi ích của DR trên AWS**

- **Khả năng mở rộng và linh hoạt**: chỉ sử dụng tài nguyên khi cần, giảm chi phí vận hành so với các phương pháp truyền thống.
- **Khả năng tự động hóa**: sử dụng các công cụ như AWS Lambda, CloudFormation để tự động hóa quy trình DR.
- **Đảm bảo tính khả dụng cao**: AWS cung cấp các vùng sẵn sàng (Availability Zones) và vùng địa lý (Regions) trên toàn cầu.
- **Tích hợp dễ dàng**: hỗ trợ nhiều công cụ và dịch vụ giúp triển khai kế hoạch DR dễ dàng và hiệu quả.

### **Kế hoạch DR hiệu quả trên AWS**

- **Đánh giá và thiết kế**: phân tích nhu cầu kinh doanh, xác định RPO và RTO phù hợp.
- **Thử nghiệm thường xuyên**: kiểm tra khả năng DR định kỳ để đảm bảo kế hoạch hoạt động hiệu quả.
- **Tối ưu hóa chi phí**: kết hợp các chiến lược DR với dịch vụ phù hợp để giảm thiểu chi phí mà vẫn đảm bảo yêu cầu.

### **Ví dụ về kịch bản DR**

- **Sao lưu cơ sở dữ liệu**: dùng Amazon RDS với Multi-AZ hoặc sao lưu thủ công lên S3.
- **Lưu trữ tài liệu quan trọng**: sử dụng Amazon S3 với replication giữa các vùng địa lý.
- **Phục hồi ứng dụng web**: sử dụng Amazon Route 53 để chuyển hướng lưu lượng và Auto Scaling để khởi động nhanh hệ thống.
