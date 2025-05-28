---
author: thuongnn
pubDatetime: 2021-06-09T14:29:35Z
title: "[ACID vs BASE] So sánh các mô hình Database Transaction"
draft: false
tags:
  - SQL
  - NoSQL
  - ACID
  - Database
description: Quyết định lựa chọn một hệ thống quản lý cơ sở dữ liệu phù hợp (DBMS)...
---

Quyết định lựa chọn một hệ thống quản lý cơ sở dữ liệu phù hợp (DBMS) có thể là một nhiệm vụ khó khăn. Có rất nhiều các tuỳ chọn DBMS có sẵn vậy nên trước khi bắt đầu tìm kiếm một giải pháp cơ sở dữ liệu phù hợp, hãy xem xét lại các yêu cầu hệ thống của bạn.

Trong bài viết này, chúng ta sẽ tìm hiểu về hai mô hình Database Transaction phổ biến nhất: **ACID** và **BASE**.

## Sự khác nhau giữa mô hình database transaction ACID và BASE

[Định lý CAP](https://en.wikipedia.org/wiki/CAP_theorem) nói rằng không thể đạt được cả tính nhất quán và tính khả dụng trong một hệ thống phân tán (partition tolerant distributed system) — tức là một hệ thống tiếp tục hoạt động trong trường hợp xảy ra sự cố giao tiếp tạm thời.

![](https://github.com/user-attachments/assets/46f9f062-9035-4da6-9a84-887d39444dec)

**Consistency -** Tính nhất quán ở đây mang ý nghĩa dữ liệu trả về phải được đồng nhất cho dù chúng được trả về từ các node khác nhau. Khi cập nhất dữ liệu vào một node thì các node khác cũng phải cập nhật theo, tránh dữ liệu trả về lệch lạc nhau trên các node.

**Availability -** Tính sẵn sàng được hiểu rằng bất cứ khi nào client gửi request, họ đều sẽ nhận được response. Thậm chí một hoặc vài node bị down. (giống như trong microservices, khi một node hoặc một service con down, các service khác vẫn có thể hoạt động độc lập).

**Partition Tolerance -** Partition tolerance means that the cluster must continue to work despite any number of communication breakdowns between nodes in the system. (Trạng thái hoạt động của hệ thống khi đường kết nối (mạng) giữa các node bị đứt, hệ thống vẫn phải hoạt động bình thường cho dù các kết nối của các node trong hệ thống bị đứt gãy).

### Vậy tại sao lại nói không thể đạt được cùng lúc cả 3 tính chất trên trong hệ thống phân tán?

Khi hệ thống đạt được tính chất _Consistency_ và _Availability_ sẽ không thể thoả mãn thêm tính chất _Partition Tolerance_ bởi khi đường kết nối (mạng) giữa các node không được đảm bảo dẫn đến việc các node sẽ không được update dữ liệu cùng một thời điểm, điều này dẫn tới việc một vài node dữ liệu sẽ bị out-of-date do chưa được cập nhật dữ liệu từ đó vi phạm tính _Consistency_.

Trường hợp khi hệ thống đạt được tính _Consistency_ và _Partition Tolerance_ thì không thể đạt được tính _Availability_ bởi hệ thống cần phải ngừng phục vụ nhữg node bị out-of-date (TH kể trên) cho tới khi nó được update dữ liệu đầy đủ, nhưng việc này lại vi phạm tính _Availability_ của hệ thống.

Thông thường, người ta thường đánh đổi yếu tố _Consistency_ để lấy hai yếu tố _Availability_ và _Partition Tolerance_. Khi đó họ sẽ thay thế _Consistency_ thành _Eventually Consistency_ (tính nhất quán có độ trễ), làm như thế hệ thống sẽ có hiệu năng tốt hơn.

Ngoài ra sự khác biệt cơ bản giữa các mô hình cơ sở dữ liệu ACID và BASE là cách chúng đối phó với hạn chế này.

- Mô hình ACID cung cấp một hệ thống nhất quán.

- Mô hình BASE cung cấp tính khả dụng cao.

### ACID Model

Mô hình ACID đảm bảo rằng một giao dịch đã thực hiện luôn được nhất quán. Mô hình này phù hợp với các doanh nghiệp _xử lý giao dịch trực tuyến_ (ví dụ: các tổ chức tài chính) không được phép có sai xót cho các trạng thái không hợp lệ. Chúng ta sẽ tìm hiểu về 4 thuộc tính quan trọng khi xử lý bất kỳ giao dịch nào của mô hình ACID:

- **Atomic**: Một giao dịch có nhiều thao tác khác biệt thì hoặc là toàn bộ các thao tác hoặc là không một thao tác nào được hoàn thành. Chẳng hạn việc chuyển tiền có thể thành công hay trục trặc vì nhiều lý do nhưng tính nguyên tố bảo đảm rằng một tài khoản sẽ không bị trừ tiền nếu như tài khoản kia chưa được cộng số tiền tương ứng.

- **Consistent** : Một giao dịch hoặc là sẽ tạo ra một trạng thái mới và hợp lệ cho dữ liệu, hoặc trong trường hợp có lỗi sẽ chuyển toàn bộ dữ liệu về trạng thái trước khi thực thi giao dịch.

- **Isolated**: Một giao dịch đang thực thi và chưa được xác nhận phải bảo đảm tách biệt khỏi các giao dịch khác.

- **Durable** : Dữ liệu được xác nhận sẽ được hệ thống lưu lại sao cho ngay cả trong trường hợp hỏng hóc hoặc có lỗi hệ thống, dữ liệu vẫn đảm bảo trong trạng thái chuẩn xác.

_Nguồn: [wikipedia](https://vi.wikipedia.org/wiki/ACID)_

**Ví dụ**: Các tổ chức tài chính hầu như sẽ chỉ sử dụng cơ sở dữ liệu ACID. Chuyển tiền phụ thuộc vào các tính chất của mô hình ACID. Một giao dịch bị gián đoạn không được xóa ngay lập tức khỏi cơ sở dữ liệu có thể gây ra rất nhiều vấn đề. Tiền có thể được ghi nợ từ một tài khoản và do lỗi, không bao giờ được ghi có vào tài khoản khác.

Một DBMS đảm bảo tuân thủ các nguyên tắc ACID là một hệ thống quản lý cơ sở dữ liệu có quan hệ (relational database management system). Ví dụ như MySQL, PostgreSQL, Oracle, SQLite và Microsoft SQL Server.

### BASE Model

Sự phát triển của cơ sở dữ liệu NoSQL cung cấp một cách linh hoạt và dễ dàng thao tác dữ liệu. BASE là viết tắt của:

- **Basically Available**: Thay vì thực thi tính nhất quán ngay lập tức, cơ sở dữ liệu NoSQL theo mô hình BASE sẽ đảm bảo tính khả dụng của dữ liệu bằng cách trải rộng và sao chép nó qua các nút của cụm cơ sở dữ liệu.

- **Soft State**: Do thiếu tính nhất quán tức thì, các giá trị dữ liệu có thể thay đổi theo thời gian. Mô hình BASE phá vỡ với khái niệm cơ sở dữ liệu thực thi tính nhất quán của chính nó, giao trách nhiệm đó cho các nhà phát triển.

- **Eventually Consistent**: Khi dữ liệu được thêm vào hệ thống, trạng thái của hệ thống dần dần được sao chép trên tất cả các nút. Ví dụ, trong Hadoop, khi một tệp được ghi vào HDFS, bản sao của các khối dữ liệu được tạo trong các nút dữ liệu khác nhau sau khi các khối dữ liệu gốc đã được ghi. Trong khoảng thời gian ngắn trước khi các khối được sao chép, trạng thái của hệ thống tệp không nhất quán.

### Nguồn tham khảo

- [ACID vs BASE: Comparison of Database Transaction Models](https://phoenixnap.com/kb/acid-vs-base)
- [Visual Guide to NoSQL Systems](https://blog.nahurst.com/visual-guide-to-nosql-systems)
