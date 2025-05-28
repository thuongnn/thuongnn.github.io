---
author: thuongnn
pubDatetime: 2023-07-20T10:20:15Z
title: "[AWS] Amazon Aurora Serverless"
folder: "aws"
draft: false
tags:
  - AWS
  - Amazon Web Services
description: Tìm hiểu về phiên bản serverless của Aurora, tự động mở rộng theo nhu cầu và chỉ tính phí khi sử dụng.
---

Bài viết được tham khảo và tổng hợp lại từ Jayendra's Blog, xem bài viết gốc ở đây: https://jayendrapatil.com/aws-aurora-serverless.

## Table of contents

Amazon Aurora Serverless là một cấu hình **tự động điều chỉnh theo nhu cầu** cho các phiên bản Aurora tương thích với MySQL và PostgreSQL, giúp tự động khởi động, tắt và điều chỉnh công suất dựa trên nhu cầu của ứng dụng, loại bỏ việc quản lý thủ công các instance cơ sở dữ liệu.

# **Kiến trúc của Aurora Serverless**

![1.png](@/assets/images/aws/databases/aws-aurora-serverless/1.png)

- **Tách biệt giữa lưu trữ và tính toán**: Aurora Serverless tách biệt hai thành phần này, cho phép mở rộng hoặc thu hẹp công suất tính toán mà không ảnh hưởng đến lưu trữ.
- **Proxy fleet**: Khi tạo một endpoint cơ sở dữ liệu, nó kết nối đến một **proxy fleet** chịu trách nhiệm định tuyến tải công việc đến các tài nguyên tính toán, giúp quản lý kết nối tự động và duy trì kết nối liên tục khi Aurora Serverless tự động điều chỉnh tài nguyên.
- **Aurora Capacity Units (ACUs)**: Công suất được đo bằng ACU, mỗi ACU bao gồm tài nguyên xử lý và bộ nhớ. Người dùng có thể thiết lập giới hạn tối thiểu và tối đa cho ACU, và Aurora Serverless sẽ tự động điều chỉnh trong phạm vi này dựa trên nhu cầu thực tế.

**Tự động tạm dừng và tiếp tục hoạt động**

- **Tự động tạm dừng**: Aurora Serverless hỗ trợ tính năng tự động tạm dừng sau một khoảng thời gian không hoạt động (mặc định là 5 phút), giúp giảm chi phí tính toán xuống 0, chỉ còn tính phí lưu trữ.
- **Tự động tiếp tục**: Khi có yêu cầu kết nối đến cơ sở dữ liệu đã tạm dừng, Aurora Serverless sẽ tự động khởi động lại và phục vụ các yêu cầu đó.

# **Khả năng chịu lỗi và chuyển đổi dự phòng**

- **Lưu trữ đa AZ**: Mặc dù lớp tính toán của Aurora Serverless nằm trong một AZ duy nhất, nhưng lớp lưu trữ được phân tán qua nhiều AZ, đảm bảo dữ liệu luôn sẵn sàng ngay cả khi một AZ gặp sự cố.
- **Chuyển đổi dự phòng tự động**: Nếu instance hoặc AZ gặp sự cố, Aurora sẽ tự động tái tạo instance trong một AZ khác. Tuy nhiên, thời gian chuyển đổi dự phòng có thể lâu hơn so với các cụm Aurora Provisioned truyền thống và phụ thuộc vào nhu cầu và công suất sẵn có trong các AZ khác.

# **Tự động mở rộng**

- **Dựa trên tải công việc**: Aurora Serverless tự động mở rộng dựa trên các chỉ số như **sử dụng CPU** hoặc **số lượng kết nối**. Tuy nhiên, trong một số trường hợp, việc mở rộng có thể không đủ nhanh để đáp ứng các thay đổi đột ngột của tải công việc, chẳng hạn như một lượng lớn giao dịch mới.
- **Điểm mở rộng (scaling point)**: Khi bắt đầu một hoạt động mở rộng, Aurora Serverless cố gắng tìm một "điểm mở rộng" an toàn để thực hiện việc mở rộng. Nếu có các truy vấn hoặc giao dịch dài hạn đang diễn ra, hoặc các bảng tạm thời hoặc khóa bảng đang được sử dụng, việc tìm điểm mở rộng có thể bị trì hoãn hoặc không thể thực hiện.
- **Thời gian chờ sau mở rộng**: Sau khi mở rộng, Aurora Serverless có **thời gian chờ 15 phút** trước khi thực hiện thu hẹp công suất, nhằm đảm bảo ổn định cho hệ thống.

# **Trường hợp sử dụng phù hợp**

- **Ứng dụng ít sử dụng hoặc không thường xuyên**: Giảm chi phí bằng cách tự động tạm dừng khi không hoạt động.
- **Ứng dụng mới**: Khi chưa xác định rõ nhu cầu và kích thước instance phù hợp.
- **Tải công việc biến đổi và không thể dự đoán**: Tự động mở rộng theo nhu cầu.
- **Môi trường phát triển và thử nghiệm**: Giảm chi phí bằng cách tự động tạm dừng khi không sử dụng.
- **Ứng dụng đa người thuê (multi-tenant)**: Tự động điều chỉnh công suất để đáp ứng nhu cầu của nhiều người dùng.

# **Hạn chế**

- **Chỉ khả dụng cho Aurora MySQL 5.6**: Hiện tại, Aurora Serverless chỉ hỗ trợ phiên bản Aurora MySQL 5.6.
- **Không hỗ trợ public IP**: Cụm cơ sở dữ liệu không có địa chỉ IP công cộng và chỉ có thể truy cập từ trong VPC dựa trên dịch vụ VPC.
- **Thời gian chuyển đổi dự phòng không xác định**: Thời gian chuyển đổi dự phòng phụ thuộc vào nhu cầu và công suất sẵn có trong các AZ khác, có thể lâu hơn so với các cụm Aurora Provisioned truyền thống.
