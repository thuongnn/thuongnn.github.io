---
author: thuongnn
pubDatetime: 2023-07-19T15:30:45Z
modDatetime: 2023-07-19T15:30:45Z
title: "[AWS] Amazon DynamoDB"
folder: "aws"
draft: false
tags:
  - AWS
  - Amazon Web Services
description: Tìm hiểu về dịch vụ cơ sở dữ liệu NoSQL được quản lý hoàn toàn bởi AWS, cung cấp hiệu suất cao và khả năng mở rộng.
---

Bài viết được tham khảo và tổng hợp lại từ Jayendra's Blog, xem bài viết gốc ở đây: https://jayendrapatil.com/aws-dynamodb.

## Table of contents

## Giới thiệu về Amazon DynamoDB

Amazon DynamoDB là dịch vụ cơ sở dữ liệu NoSQL được quản lý hoàn toàn (fully managed) bởi AWS, nổi bật với hiệu suất cao, khả năng mở rộng linh hoạt và độ trễ thấp.

- **Đặc điểm chính**:
  - Là cơ sở dữ liệu kiểu key-value và document.
  - Đảm bảo độ trễ tính bằng mili giây (millisecond latency) ngay cả với khối lượng dữ liệu lớn.
  - Tự động mở rộng (scaling) theo nhu cầu mà không cần can thiệp thủ công.
  - Không cần quản lý server (serverless), giảm gánh nặng vận hành.
  - Hỗ trợ mã hóa dữ liệu (encryption at rest) bằng AWS KMS.
  - Được thiết kế để xử lý hàng triệu yêu cầu mỗi giây.
- **Ứng dụng thực tế**:
  - Ứng dụng web và mobile với lưu lượng truy cập cao (high-traffic).
  - Hệ thống trò chơi trực tuyến (gaming).
  - Ứng dụng IoT, phân tích dữ liệu thời gian thực, và thương mại điện tử.

## Các thành phần và khái niệm cơ bản

### Bảng (Tables), Mục (Items) và Thuộc tính (Attributes)

- **Bảng (Tables)**:
  - Là tập hợp các mục dữ liệu, tương tự bảng trong cơ sở dữ liệu quan hệ (RDBMS).
  - Ví dụ: Bảng `Users` chứa thông tin người dùng.
- **Mục (Items)**:
  - Một đơn vị dữ liệu trong bảng, giống như một hàng (row).
  - Là tập hợp các cặp key-value, không cần schema cố định.
  - Ví dụ: `{ "UserID": "123", "Name": "John", "Age": 30 }`.
- **Thuộc tính (Attributes)**:
  - Là các trường dữ liệu trong một mục, tương tự cột (column).
  - Hỗ trợ nhiều kiểu dữ liệu:
    - Chuỗi (String), Số (Number), Nhị phân (Binary).
    - Tập hợp (Set): String Set, Number Set, Binary Set.
    - Tài liệu lồng nhau (Nested Documents): List, Map.

### Khóa (Keys)

- **Khóa chính (Primary Key)**:
  - Dùng để định danh duy nhất mỗi mục trong bảng.
  - Có hai loại:
    - **Partition Key (Khóa phân vùng)**:
      - Một thuộc tính duy nhất (ví dụ: `UserID`).
      - Quyết định phân vùng vật lý nơi dữ liệu được lưu trữ.
    - **Composite Key (Khóa tổng hợp)**:
      - Gồm Partition Key và Sort Key (ví dụ: `UserID` + `OrderDate`).
      - Sort Key cho phép sắp xếp dữ liệu trong cùng phân vùng.
- **Khóa phụ (Secondary Indexes)**:
  - Dùng để truy vấn dữ liệu dựa trên các thuộc tính khác ngoài khóa chính.
  - **Local Secondary Index (LSI)**:
    - Chỉ áp dụng trong cùng Partition Key.
    - Cần tạo khi tạo bảng, không thể thêm sau.
    - Giới hạn: 5 LSI mỗi bảng.
    - Ví dụ: Truy vấn tất cả đơn hàng của `UserID` theo `OrderStatus`.
  - **Global Secondary Index (GSI)**:
    - Có thể truy vấn trên bất kỳ thuộc tính nào, không phụ thuộc Partition Key.
    - Có thể thêm hoặc xóa sau khi bảng được tạo.
    - Giới hạn: 20 GSI mỗi bảng (có thể yêu cầu AWS tăng).
    - Ví dụ: Truy vấn người dùng theo `Email` thay vì `UserID`.

### Dung lượng (Capacity)

- **Read Capacity Units (RCU)**:
  - Đo khả năng đọc:
    - 1 RCU = 1 lần đọc mạnh (strongly consistent read) 4KB/giây.
    - 1 RCU = 2 lần đọc cuối cùng (eventually consistent read) 4KB/giây.
- **Write Capacity Units (WCU)**:
  - Đo khả năng ghi:
    - 1 WCU = 1 lần ghi 1KB/giây.
- **Chế độ dung lượng**:
  - **Provisioned Mode**:
    - Người dùng tự xác định RCU và WCU.
    - Hỗ trợ Auto Scaling để tự động điều chỉnh theo tải.
  - **On-Demand Mode**:
    - Không cần cấu hình RCU/WCU trước.
    - Tự động mở rộng theo lưu lượng thực tế, tính phí dựa trên số lần đọc/ghi thực hiện.
- **Lưu ý**:
  - Nếu vượt quá dung lượng đã cấp (provisioned), yêu cầu sẽ bị từ chối (throttled) trừ khi bật Auto Scaling.

## Các thao tác trong DynamoDB (DynamoDB Operations)

### Thao tác cơ bản

- **PutItem**: Thêm hoặc ghi đè một mục vào bảng.
- **GetItem**: Lấy một mục cụ thể bằng khóa chính.
- **UpdateItem**: Cập nhật một mục (có thể thêm thuộc tính mới).
- **DeleteItem**: Xóa một mục dựa trên khóa chính.
- **Batch Operations**:
  - **BatchGetItem**: Lấy nhiều mục cùng lúc (tối đa 100 mục, 16MB).
  - **BatchWriteItem**: Ghi hoặc xóa nhiều mục cùng lúc (tối đa 25 yêu cầu, 16MB).

### Truy vấn và quét (Query & Scan)

- **Query**:
  - Truy vấn dữ liệu dựa trên Partition Key và (tùy chọn) Sort Key.
  - Hỗ trợ điều kiện lọc trên Sort Key (ví dụ: "OrderDate > 2023-01-01").
  - Hiệu quả hơn Scan, dùng LSI/GSI nếu cần truy vấn thuộc tính khác.
- **Scan**:
  - Quét toàn bộ bảng để tìm dữ liệu.
  - Ít hiệu quả hơn Query, tiêu tốn nhiều RCU.
  - Có thể dùng bộ lọc (filter) nhưng vẫn quét toàn bộ trước khi lọc.

### Tính nhất quán (Consistency)

- **Strongly Consistent Read**: Đảm bảo dữ liệu mới nhất sau khi ghi (dùng 1 RCU).
- **Eventually Consistent Read**: Có thể trả về dữ liệu cũ trong vài giây sau khi ghi (dùng 0.5 RCU).
- Mặc định: Eventually Consistent, cần chỉ định nếu muốn Strongly Consistent.

## Tính năng nổi bật của DynamoDB

### DynamoDB Streams

- Ghi lại mọi thay đổi trong bảng (thêm, sửa, xóa) theo thứ tự thời gian.
- Dữ liệu stream lưu trữ trong 24 giờ.
- **Cấu hình**:
  - Có thể chọn dữ liệu ghi lại: khóa, giá trị cũ, giá trị mới, hoặc cả hai.
- **Ứng dụng**:
  - Kích hoạt AWS Lambda khi có thay đổi.
  - Đồng bộ dữ liệu với hệ thống khác (ví dụ: Amazon Elasticsearch).

### Time to Live (TTL)

- Tự động xóa các mục hết hạn dựa trên thuộc tính timestamp.
- **Ví dụ**: Đặt TTL trên "ExpirationTime" để xóa phiên người dùng sau 24 giờ.
- **Lưu ý**:
  - Quá trình xóa không diễn ra ngay lập tức, có thể mất vài giờ.
  - Không tiêu tốn WCU khi xóa.

### DynamoDB Accelerator (DAX)

- Là lớp bộ nhớ đệm trong RAM (in-memory cache).
- Giảm độ trễ đọc xuống micro-giây (microseconds).
- Hỗ trợ GetItem, BatchGetItem, Query, Scan.
- **Ứng dụng**: Các hệ thống cần đọc nhanh, ít ghi (read-heavy workloads).

### Backup và Restore

- **On-Demand Backup**:
  - Tạo bản sao lưu toàn bộ bảng bất kỳ lúc nào.
  - Lưu trữ trên S3, có thể khôi phục thành bảng mới.
- **Point-in-Time Recovery (PITR)**:
  - Khôi phục bảng về bất kỳ thời điểm nào trong 35 ngày qua.
  - Cần bật trước, không thể kích hoạt sau khi cần.

### Global Tables

- Sao chép bảng trên nhiều vùng AWS (multi-region replication).
- Đảm bảo dữ liệu nhất quán toàn cầu với độ trễ thấp.
- **Yêu cầu**: Cần bật DynamoDB Streams.
- **Ứng dụng**: Ứng dụng đa khu vực (multi-region apps).

### Mã hóa (Encryption)

- Mã hóa dữ liệu tại nghỉ bằng AWS KMS (mặc định).
- Hỗ trợ mã hóa phía client nếu cần kiểm soát khóa riêng.

### Tính năng bổ sung (Additional Features)

- **Transactions**:
  - Hỗ trợ giao dịch (ACID) cho nhiều thao tác (tối đa 25 mục).
  - Ví dụ: Cập nhật "Inventory" và "Order" cùng lúc.
- **DynamoDB Auto Scaling**:
  - Tự động điều chỉnh RCU/WCU trong chế độ Provisioned dựa trên tải.
- **Tags**:
  - Gắn thẻ (tags) để quản lý chi phí và tài nguyên.

## So sánh DynamoDB với RDBMS

| **Tiêu chí**        | **DynamoDB (NoSQL)**                  | **RDBMS (SQL)**                   |
| ------------------- | ------------------------------------- | --------------------------------- |
| **Mô hình dữ liệu** | Key-value, Document                   | Quan hệ (tables, rows, columns)   |
| **Schema**          | Linh hoạt, không cần định nghĩa trước | Cố định, cần schema rõ ràng       |
| **Mở rộng**         | Theo chiều ngang (horizontal scaling) | Theo chiều dọc (vertical scaling) |
| **Hiệu suất**       | Cao với tải lớn, độ trễ thấp          | Phụ thuộc vào kích thước server   |
| **Truy vấn**        | Giới hạn, không hỗ trợ JOIN           | Hỗ trợ JOIN, GROUP BY, phức tạp   |
| **Quản lý**         | AWS quản lý hoàn toàn                 | Tự quản lý server                 |
| **Consistency**     | Eventually hoặc Strongly Consistent   | Strongly Consistent mặc định      |

## Hạn chế của DynamoDB

- **Giới hạn kích thước**:
  - Mỗi mục tối đa 400 KB (bao gồm key và value).
  - Batch operations giới hạn 16MB hoặc 25-100 mục.
- **Truy vấn**:
  - Không hỗ trợ JOIN, GROUP BY, hoặc các truy vấn SQL phức tạp.
  - Scan kém hiệu quả với bảng lớn.
- **Chi phí**:
  - Provisioned mode: Chi phí cao nếu dự đoán sai dung lượng.
  - On-Demand mode: Tiện lợi nhưng đắt hơn với tải lớn.
- **Streams**: Chỉ lưu trữ thay đổi trong 24 giờ.
- **LSI**: Không thể thêm sau khi tạo bảng.

## Khi nào nên sử dụng DynamoDB?

- **Nên dùng khi**:
  - Cần hiệu suất cao, độ trễ thấp với khối lượng dữ liệu lớn.
  - Ứng dụng yêu cầu mở rộng linh hoạt (web, mobile, gaming, IoT).
  - Không cần truy vấn quan hệ phức tạp.
  - Muốn giảm quản lý hạ tầng.
- **Không nên dùng khi**:
  - Ứng dụng cần truy vấn phức tạp (JOIN, aggregation).
  - Dữ liệu có cấu trúc cố định và ít thay đổi.

# AWS DynamoDB Accelerator (DAX)

![1.png](@/assets/images/aws/databases/aws-dynamodb/1.png)

### **Tổng quan về DAX**

- **DAX** (DynamoDB Accelerator) là một **in-memory cache** được quản lý hoàn toàn, có tính sẵn sàng cao, thiết kế dành riêng cho **Amazon DynamoDB**.
- Cải thiện hiệu suất đọc lên đến **10 lần**, giảm thời gian phản hồi từ **mili giây xuống micro giây**, hỗ trợ hàng triệu yêu cầu mỗi giây.
- Là dịch vụ được quản lý, DAX tự động xử lý:
  - **Cache invalidation** (xóa dữ liệu cũ).
  - **Data population** (điền dữ liệu vào cache).
  - **Quản lý cluster** (tự động mở rộng, vá lỗi, v.v.).

### **Đặc điểm chính**

- **Tương thích API với DynamoDB**: Chỉ cần chỉnh sửa tối thiểu mã ứng dụng để tích hợp DAX (sử dụng DAX SDK).
- **Hiệu quả chi phí**:
  - Giảm tải đọc (**Read Capacity Units - RCU**) trên DynamoDB, từ đó giảm chi phí.
  - Ngăn chặn vấn đề **hot partitions** (phân vùng quá tải do đọc nhiều).
- **Hỗ trợ ứng dụng đọc nhiều**: Lý tưởng cho ứng dụng cần hiệu suất đọc cao (read-intensive).
- **Chỉ hỗ trợ eventual consistency**: Yêu cầu **strong consistency** sẽ được chuyển trực tiếp đến DynamoDB, không qua cache.

### **Cấu trúc DAX**

- **DAX Cluster**:
  - Gồm **1 primary node** (xử lý cả đọc và ghi) và **0 hoặc nhiều read-replica nodes** (chỉ xử lý đọc).
  - **Khuyến nghị production**: Triển khai ít nhất **3 node**, mỗi node ở một **Availability Zone (AZ)** khác để đảm bảo **fault-tolerant** (chịu lỗi).
- **Hạn chế khu vực**: DAX cluster chỉ tương tác với bảng DynamoDB trong **cùng AWS Region**.

### **Cách hoạt động**

- **Cache hit**: Dữ liệu có sẵn trong DAX → trả về ngay, không cần truy cập DynamoDB.
- **Cache miss**: Dữ liệu không có trong DAX → chuyển yêu cầu đến DynamoDB → nhận kết quả → lưu vào cache → trả về ứng dụng.
- **Strong consistency**: Yêu cầu đọc strong consistency không lưu cache, được gửi trực tiếp đến DynamoDB.
- **Viết dữ liệu**:
  - Dữ liệu được ghi vào DynamoDB trước, sau đó xử lý trong DAX tùy theo chiến lược ghi (**Write-Through** hoặc **Write-Around**).
  - Giao dịch ghi chỉ thành công khi hoàn tất trên DynamoDB.

### **Loại cache trong DAX**

- **Item Cache**:
  - Lưu trữ kết quả từ các thao tác **GetItem** và **BatchGetItem**.
  - Tuân theo **TTL mặc định 5 phút** và thuật toán **LRU** (Least Recently Used).
- **Query Cache**:
  - Lưu trữ kết quả từ các yêu cầu **Query** và **Scan**.
  - Không ảnh hưởng đến item cache, có **TTL mặc định 5 phút**.
- **Ghi chú**: Viết vào item cache không ảnh hưởng đến query cache và ngược lại.

### Write Strategies

- **Write-Through**:
  ![2.png](@/assets/images/aws/databases/aws-dynamodb/2.png)
  - Dữ liệu được ghi vào **DynamoDB** trước, sau đó cập nhật **item cache** trên **primary node**.
  - Nếu có read-replica nodes, dữ liệu được nhân bản **bất đồng bộ** sang các node này.
  - **Ưu điểm**: Cache luôn phản ánh dữ liệu mới, phù hợp khi cần đọc dữ liệu ngay sau ghi.
  - **Nhược điểm**: Ghi chậm hơn do phải cập nhật cache; không giảm **Write Capacity Units (WCU)**.
- **Write-Around**:
  ![3.png](@/assets/images/aws/databases/aws-dynamodb/3.png)
  - Dữ liệu được ghi **trực tiếp vào DynamoDB**, **không cập nhật cache** ngay lập tức.
  - Cache chỉ được cập nhật khi có **cache miss** trong yêu cầu đọc sau đó.
  - **Ưu điểm**: Nhanh hơn Write-Through, giảm tải trên DAX cluster, phù hợp với ứng dụng ghi nhiều hoặc dữ liệu ít đọc lại.
  - **Nhược điểm**: Cache có thể chứa dữ liệu cũ (stale data) cho đến khi TTL hết hoặc cache miss, không tối ưu nếu cần đọc dữ liệu mới ngay.
- **Lưu ý chung**:
  - Cả hai chiến lược đều không giảm WCU trên DynamoDB.
  - Write-Through tốt cho ứng dụng cần đồng bộ nhanh (như giỏ hàng).
  - Write-Around phù hợp với hệ thống log hoặc ứng dụng ưu tiên tốc độ ghi.

### **Trường hợp sử dụng**

- **Không phù hợp**:
  - Ứng dụng cần **strong consistency**.
  - Ứng dụng **ghi nhiều** (write-intensive) hoặc đọc ít.
- **Phù hợp**:
  - Ứng dụng **đọc nhiều** (read-intensive) với dữ liệu ít thay đổi.
  - Cần phản hồi nhanh ở mức micro giây (ví dụ: real-time apps, gaming, thương mại điện tử).

### **Lưu ý kỹ thuật**

- **TLS Support**: Hỗ trợ mã hóa dữ liệu trong quá trình truyền (TLS) để tăng bảo mật.
- **Khả năng mở rộng**: Có thể thêm node hoặc dùng node lớn hơn để tăng hiệu suất.
- **Tích hợp VPC**: DAX chạy trong **Amazon VPC**, kiểm soát truy cập qua security groups.
- **Cấu hình**:
  - Không tự động có sẵn; phải tạo DAX cluster thủ công.
  - Cần chỉ định: node type, số lượng node, IAM role, subnet group, security group.
  - TTL cache (item/query) mặc định 5 phút, có thể tùy chỉnh qua parameter group.

### Chi phí sử dụng

- DynamoDB tính phí dựa trên:
  - **RCU / WCU**:
    - RCU: Chi phí cho mỗi đơn vị đọc (4KB dữ liệu mỗi giây).
    - WCU: Chi phí cho mỗi đơn vị ghi (1KB dữ liệu mỗi giây).
    - Có hai chế độ:
      - **On-demand**: Trả tiền theo yêu cầu thực tế, không cần cấu hình trước.
      - **Provisioned**: Cấu hình RCU/WCU cố định, rẻ hơn nếu dự đoán được lưu lượng.
  - **Lưu trữ dữ liệu**: Tính phí dựa trên dung lượng dữ liệu lưu trong bảng (GB/tháng).
  - **Tính năng bổ sung**: Global Tables, Streams, Backups, PITR có chi phí riêng.
- DAX là một dịch vụ **tách biệt**, nên khi bạn thêm DAX cluster, chi phí sẽ **cộng thêm** vào chi phí DynamoDB. DAX tính phí dựa trên:
  - **Loại node và số lượng node**:
    - Mỗi node trong DAX cluster (primary hoặc read-replica) có giá riêng, tùy thuộc vào **instance type** (ví dụ: `dax.r4.large`, `dax.r5.xlarge`).
    - Giá được tính **theo giờ** (hoặc theo giây, tùy region).
    - Ví dụ: Một node `dax.r4.large` có thể tốn khoảng `$0.171/giờ` (giá tham khảo tại US East, có thể thay đổi theo region và thời điểm).
  - **Số lượng node**:
    - Tối thiểu 1 node (primary), nhưng production thường cần 3+ node để chịu lỗi, nên chi phí tăng theo số node.
    - Ví dụ: 3 node `dax.r4.large` sẽ tốn khoảng `$0.171 × 3 = $0.513/giờ`.
  - **Không tính phí lưu trữ riêng**:
    - DAX là in-memory cache, không tính phí lưu trữ như DynamoDB, nhưng chi phí node đã bao gồm tài nguyên bộ nhớ.
- **DAX có giúp tiết kiệm chi phí DynamoDB không?**
  - Mặc dù DAX làm tăng tổng chi phí (do chi phí node), nó có thể **giảm chi phí DynamoDB** trong một số trường hợp:
    - **Giảm RCU**: DAX lưu trữ dữ liệu đọc thường xuyên trong cache, giảm số lượng yêu cầu đọc trực tiếp tới DynamoDB, từ đó giảm RCU cần thiết. RCU tiết kiệm được có thể bù đắp một phần chi phí DAX.
    - **Tối ưu hiệu suất**: Với ứng dụng đọc nhiều, DAX giúp giảm tải trên DynamoDB, tránh việc phải tăng RCU để xử lý **hot partitions** hoặc lưu lượng đọc cao.
  - Tuy nhiên, **tiết kiệm này không phải lúc nào cũng đủ bù chi phí DAX**, đặc biệt nếu:
    - Ứng dụng không đọc nhiều (ít cache hit).
    - Bạn cấu hình DAX cluster quá lớn (nhiều node hoặc instance type mạnh không cần thiết).
  - **Tóm lại**
    - Thêm DAX cluster sẽ **cộng thêm chi phí** (dựa trên số node và loại instance), không được cung cấp miễn phí.
    - DAX có thể giảm chi phí RCU của DynamoDB, nhưng tổng chi phí thường vẫn cao hơn trừ khi ứng dụng đọc rất nhiều và tận dụng tốt cache.
    - Để tối ưu, hãy **ước tính lưu lượng đọc** và **chọn cấu hình DAX hợp lý** (ít node nhất có thể, instance type vừa đủ)
