---
author: thuongnn
pubDatetime: 2023-01-17T10:45:33Z
title: "[AWS] Amazon Kinesis"
draft: false
tags:
  - AWS
  - Amazon Web Services
description: Tìm hiểu về dịch vụ xử lý dữ liệu streaming thời gian thực, giúp thu thập, xử lý và phân tích dữ liệu theo thời gian thực.
---
Bài viết được tham khảo và tổng hợp lại từ Jayendra's Blog, xem bài viết gốc ở đây: https://jayendrapatil.com/aws-kinesis. 

## Table of contents


# AWS Kinesis Data Streams – KDS

- **Amazon Kinesis Data Streams** là một dịch vụ dữ liệu streaming cho phép xử lý dữ liệu theo thời gian thực ở quy mô lớn.
- Kinesis Streams hỗ trợ xây dựng các ứng dụng tùy chỉnh để xử lý hoặc phân tích dữ liệu streaming cho các nhu cầu chuyên biệt.
- **Đặc điểm của Kinesis Streams**:
    - Quản lý việc cung cấp, triển khai, bảo trì phần cứng, phần mềm hoặc các dịch vụ khác cho luồng dữ liệu.
    - Quản lý cơ sở hạ tầng, lưu trữ, mạng và cấu hình cần thiết để truyền dữ liệu ở mức thông lượng yêu cầu.
    - Sao chép dữ liệu đồng bộ qua ba Vùng Khả dụng (AZ) trong một Vùng AWS, đảm bảo tính sẵn sàng cao và độ bền dữ liệu.
    - Lưu trữ bản ghi của luồng trong tối đa 24 giờ theo mặc định, có thể tăng lên 7 ngày bằng cách bật tính năng lưu trữ dữ liệu mở rộng.
- Dữ liệu như luồng nhấp chuột, nhật ký ứng dụng, mạng xã hội, v.v. có thể được thêm từ nhiều nguồn và sẵn sàng để xử lý trong vài giây.
- Kinesis đảm bảo thứ tự bản ghi, cũng như khả năng đọc và/hoặc **phát lại** bản ghi theo cùng thứ tự cho nhiều ứng dụng.
- Kinesis được thiết kế để xử lý dữ liệu lớn streaming, với mô hình giá hỗ trợ tỷ lệ PUT cao.
- Nhiều ứng dụng Kinesis Data Streams có thể tiêu thụ dữ liệu từ một luồng, cho phép thực hiện nhiều hành động như lưu trữ và xử lý đồng thời, độc lập.
- Ứng dụng Kinesis Data Streams có thể bắt đầu tiêu thụ dữ liệu từ luồng gần như ngay lập tức sau khi dữ liệu được thêm vào, với độ trễ put-to-get thường dưới 1 giây.
- Kinesis Streams hữu ích để nhanh chóng di chuyển dữ liệu từ các nhà sản xuất dữ liệu và xử lý liên tục dữ liệu, bao gồm:
    - **Tiếp nhận nhật ký và luồng dữ liệu nhanh**: Nhà sản xuất dữ liệu có thể đẩy dữ liệu vào luồng Kinesis ngay khi được tạo, tránh mất dữ liệu và sẵn sàng xử lý trong vài giây.
    - **Báo cáo và số liệu thời gian thực**: Trích xuất số liệu và tạo báo cáo từ dữ liệu theo thời gian thực.
    - **Phân tích dữ liệu thời gian thực**: Chạy phân tích dữ liệu streaming thời gian thực.
    - **Xử lý luồng phức tạp**: Tạo Đồ thị Có hướng Không vòng (DAGs) của các ứng dụng Kinesis và luồng dữ liệu, với ứng dụng Kinesis thêm dữ liệu vào luồng Kinesis khác để xử lý tiếp, cho phép các giai đoạn xử lý luồng liên tiếp.
- **Giới hạn của Kinesis**:
    - Lưu trữ bản ghi luồng tối đa 24 giờ theo mặc định, có thể mở rộng đến 365 ngày.
    - Kích thước tối đa của một blob dữ liệu (dữ liệu trước khi mã hóa Base64) trong một bản ghi là 1 MB.
    - Mỗi shard hỗ trợ tối đa 1000 bản ghi PUT mỗi giây.
- **S3** là cách lưu trữ dữ liệu tiết kiệm chi phí, nhưng không được thiết kế để xử lý luồng dữ liệu theo thời gian thực.

# **Kinesis Data Streams Terminology**

![1.png](@/assets/images/analytics/kinesis/1.png)

- **Bản ghi Dữ liệu (Data Record)**:
    - Là đơn vị dữ liệu được lưu trữ trong luồng dữ liệu Kinesis.
    - Bao gồm số thứ tự (sequence number), khóa phân vùng (partition key) và blob dữ liệu (chuỗi byte không thay đổi).
    - Kích thước tối đa của blob dữ liệu là 1 MB.
    - **Khóa phân vùng (Partition Key)**:
        - Được sử dụng để phân tách và định tuyến bản ghi đến các shard khác nhau của luồng.
        - Nhà sản xuất dữ liệu chỉ định khóa phân vùng khi thêm dữ liệu vào luồng Kinesis.
    - **Số thứ tự (Sequence Number)**:
        - Là định danh duy nhất cho mỗi bản ghi.
        - Kinesis gán số thứ tự khi nhà sản xuất dữ liệu gọi thao tác *PutRecord* hoặc *PutRecords* để thêm dữ liệu vào luồng.
        - Số thứ tự cho cùng khóa phân vùng thường tăng theo thời gian; khoảng thời gian giữa các yêu cầu PutRecord hoặc PutRecords càng dài, số thứ tự càng lớn.
- **Luồng Dữ liệu (Data Stream)**:
    - Đại diện cho một nhóm bản ghi dữ liệu.
    - Bản ghi dữ liệu trong luồng được phân phối vào các shard.
- **Shard**:
    - Là chuỗi bản ghi dữ liệu được xác định duy nhất trong luồng.
    - Luồng được tạo thành từ các shard, là đơn vị thông lượng cơ bản của luồng Kinesis, vì **giá được tính dựa trên mỗi shard**.
    - Mỗi shard hỗ trợ tối đa 5 giao dịch đọc mỗi giây, với tốc độ đọc dữ liệu tối đa 2 MB/giây, và tối đa 1000 bản ghi ghi mỗi giây, với tốc độ ghi dữ liệu tối đa 1 MB/giây (bao gồm khóa phân vùng).
    - Mỗi shard cung cấp một đơn vị dung lượng cố định. Nếu vượt quá giới hạn, hoặc do thông lượng dữ liệu hoặc số lượng bản ghi PUT, lệnh gọi dữ liệu sẽ bị từ chối với ngoại lệ *ProvisionedThroughputExceeded*.
    - Có thể xử lý bằng:
        - Triển khai thử lại ở phía nhà sản xuất dữ liệu nếu do tăng tạm thời tỷ lệ dữ liệu đầu vào của luồng.
        - Tăng hoặc giảm số lượng shard (resharding) để cung cấp đủ dung lượng cho các lệnh gọi dữ liệu thành công liên tục.
- **Chế độ Dung lượng (Capacity Mode)**:
    - Xác định giá cả và cách quản lý dung lượng.
    - Kinesis Data Streams hiện hỗ trợ hai chế độ: chế độ theo yêu cầu (on-demand) và chế độ cung cấp (provisioned).
        - **Chế độ theo yêu cầu**:
            - KDS tự động quản lý các shard để cung cấp thông lượng cần thiết.
            - Chỉ tính phí dựa trên thông lượng thực tế sử dụng, KDS tự động điều chỉnh theo nhu cầu thông lượng của khối lượng công việc.
        - **Chế độ cung cấp**:
            - Phải chỉ định số lượng shard cho luồng dữ liệu.
            - Tổng dung lượng của luồng là tổng dung lượng của các shard.
            - Có thể tăng hoặc giảm số lượng shard theo nhu cầu, tính phí dựa trên số lượng shard theo giờ.
- **Thời gian Lưu trữ (Retention Period)**:
    - Mọi dữ liệu được lưu trữ trong 24 giờ theo mặc định, có thể tăng lên tối đa 8760 giờ (365 ngày).
- **Nhà sản xuất (Producers)**:
    - Đưa bản ghi dữ liệu vào luồng Kinesis.
    - Để đưa dữ liệu vào luồng, cần chỉ định tên luồng, khóa phân vùng và blob dữ liệu.
    - Khóa phân vùng xác định shard mà bản ghi dữ liệu được thêm vào.
- **Người tiêu dùng (Consumers)**:
    - Là ứng dụng được xây dựng để đọc và xử lý bản ghi dữ liệu từ luồng Kinesis.

# **Kinesis Security**

- Hỗ trợ **mã hóa phía máy chủ** bằng [Key Management Service (KMS)](../Security%20e4866a84c8394a59a8b36134d185a247/AWS%20Key%20Management%20Service%20%E2%80%93%20KMS%201683fa6ae48380e89396ec86f8ad95be.md) để mã hóa dữ liệu tại chỗ.
- Hỗ trợ ghi dữ liệu mã hóa vào luồng bằng cách [mã hóa và giải mã phía máy khách](https://aws.amazon.com/blogs/big-data/encrypt-and-decrypt-amazon-kinesis-records-using-aws-kms/).
- Hỗ trợ mã hóa trong quá trình truyền tải bằng các điểm cuối HTTPS.
- Hỗ trợ [Interface VPC endpoint](../Networking%20ca0a21a6ceb64d3fbc7b62fe954794df/VPC%20PrivateLink%2015a3fa6ae4838020b831e523c33546a3.md) để giữ lưu lượng giữa VPC và Kinesis Data Streams trong mạng Amazon, không yêu cầu IGW, thiết bị NAT, VPN hoặc Direct Connect.
- Tích hợp với [IAM](https://jayendrapatil.com/aws-iam-overview/) để kiểm soát truy cập vào tài nguyên Kinesis Data Streams.
- Tích hợp với [CloudTrail](https://jayendrapatil.com/aws-cloudtrail/), cung cấp bản ghi các hành động do người dùng, vai trò hoặc dịch vụ AWS thực hiện trong Kinesis Data Streams.

# **Kinesis Producer**

Dữ liệu có thể được thêm vào Kinesis Data Streams qua các thao tác API/SDK (*PutRecord* và *PutRecords*), [Kinesis Producer Library (KPL)](http://docs.aws.amazon.com/kinesis/latest/dev/developing-producers-with-kpl.html) hoặc [Kinesis Agent](http://docs.aws.amazon.com/kinesis/latest/dev/writing-with-agents.html).

- **API**:
    - Các thao tác [PutRecord](https://docs.aws.amazon.com/kinesis/latest/APIReference/API_PutRecords.html) và [PutRecords](https://docs.aws.amazon.com/kinesis/latest/APIReference/API_PutRecord.html) là **đồng bộ**, gửi một hoặc nhiều bản ghi đến luồng mỗi yêu cầu HTTP.
    - Sử dụng PutRecords để đạt thông lượng cao hơn cho mỗi nhà sản xuất dữ liệu.
    - Hỗ trợ quản lý nhiều khía cạnh của Kinesis Data Streams (bao gồm tạo luồng, resharding, đưa và lấy bản ghi).
- **Kinesis Agent**:
    - Là ứng dụng Java được xây dựng sẵn, cung cấp cách dễ dàng để thu thập và gửi dữ liệu đến luồng Kinesis.
    - Có thể cài đặt trên các môi trường máy chủ dựa trên Linux như máy chủ web, máy chủ nhật ký và máy chủ cơ sở dữ liệu.
    - Có thể cấu hình để giám sát các tệp nhất định trên đĩa và liên tục gửi dữ liệu mới đến luồng Kinesis.
- **Kinesis Producer Library (KPL)**:
    - Là thư viện dễ sử dụng và có thể cấu hình cao, hỗ trợ đưa dữ liệu vào luồng Kinesis.
    - Cung cấp lớp trừu tượng dành riêng cho **tiếp nhận dữ liệu**.
    - Cung cấp giao diện đơn giản, **không đồng bộ** và đáng tin cậy, giúp đạt thông lượng cao với tài nguyên máy khách tối thiểu.
    - **Gộp** tin nhắn, vì nó **tổng hợp** bản ghi để tăng kích thước tải và cải thiện thông lượng.
    - Thu thập bản ghi và sử dụng PutRecords để ghi nhiều bản ghi vào nhiều shard mỗi yêu cầu.
    - Ghi vào một hoặc nhiều luồng Kinesis với **cơ chế thử lại tự động và có thể cấu hình**.
    - Tích hợp mượt mà với Kinesis Client Library (KCL) để giải gộp các bản ghi được gộp ở phía người tiêu dùng.
    - Gửi số liệu đến CloudWatch để cung cấp khả năng quan sát hiệu suất.
- **Bên thứ ba và mã nguồn mở**:
    - Log4j appender.
    - Apache Kafka.
    - Flume, fluentd, v.v.

# **Kinesis Consumers**

- Ứng dụng Kinesis là data consumer, đọc và xử lý dữ liệu từ luồng Kinesis, có thể được xây dựng bằng API Kinesis hoặc Kinesis Client Library (KCL).
- Các shard trong luồng cung cấp thông lượng đọc 2 MB/giây mỗi shard theo mặc định, được chia sẻ bởi tất cả người tiêu dùng đọc từ shard đó.
- **Kinesis Client Library (KCL)**:
    - Là thư viện được xây dựng sẵn với hỗ trợ nhiều ngôn ngữ.
    - Gửi tất cả bản ghi cho một khóa phân vùng nhất định đến cùng một bộ xử lý bản ghi.
    - Giúp dễ dàng xây dựng nhiều ứng dụng đọc từ cùng một luồng, *ví dụ: để thực hiện đếm, tổng hợp và lọc*.
    - Xử lý các vấn đề phức tạp như thích nghi với thay đổi khối lượng luồng, cân bằng tải dữ liệu streaming, phối hợp các dịch vụ phân tán và xử lý dữ liệu với khả năng chịu lỗi.
    - Sử dụng bảng [DynamoDB](https://jayendrapatil.com/aws-dynamodb/) duy nhất để theo dõi trạng thái ứng dụng, vì vậy **nếu ứng dụng Kinesis Data Streams gặp ngoại lệ vượt quá thông lượng được cấp, hãy tăng thông lượng được cấp cho bảng DynamoDB**.
- [Kinesis Connector Library](https://github.com/awslabs/amazon-kinesis-connectors):
    - Là thư viện được xây dựng sẵn, giúp dễ dàng tích hợp Kinesis Streams với các dịch vụ AWS khác và công cụ bên thứ ba.
    - Yêu cầu Kinesis Client Library.
    - Là thư viện cũ và có thể được thay thế bằng [Lambda](https://jayendrapatil.com/aws-lambda/) hoặc [Kinesis Data Firehose](https://jayendrapatil.com/aws-kinesis-data-firehose/).
- [Kinesis Storm Spout](https://github.com/awslabs/kinesis-storm-spout) là thư viện được xây dựng sẵn, giúp dễ dàng tích hợp Kinesis Streams với [Apache Storm](https://storm.incubator.apache.org/).
- AWS Lambda, Kinesis Data Firehose và Kinesis Data Analytics cũng hoạt động như người tiêu dùng cho Kinesis Data Streams.

# Kinesis Enhanced Fan-out

![2.png](@/assets/images/analytics/kinesis/2.png)

- Cho phép khách hàng mở rộng số lượng người tiêu dùng đọc từ luồng dữ liệu song song, duy trì hiệu suất cao mà không tranh chấp thông lượng đọc với các người tiêu dùng khác.
- Cung cấp các đường ống thông lượng logic 2 MB/giây giữa người tiêu dùng và shard cho người tiêu dùng Kinesis Data Streams.

# **Kinesis Data Streams Sharding**

- **Resharding** giúp tăng hoặc giảm số lượng shard trong luồng để thích nghi với thay đổi tỷ lệ dữ liệu chảy qua luồng.
- Các thao tác resharding hỗ trợ chia shard và hợp shard:
    - **Chia shard**: Chia một shard thành hai shard, tăng dung lượng và chi phí.
    - **Hợp shard**: Kết hợp hai shard thành một shard, giảm dung lượng và chi phí.
- Resharding luôn diễn ra **theo cặp** và luôn liên quan đến hai shard.
- Shard hoặc cặp shard mà thao tác resharding tác động được gọi là **shard cha**. Shard hoặc cặp shard kết quả từ thao tác resharding được gọi là **shard con**.
- Kinesis Client Library theo dõi các shard trong luồng bằng bảng DynamoDB, phát hiện các shard mới và điền các hàng mới vào bảng.
- KCL đảm bảo rằng bất kỳ dữ liệu nào tồn tại trong shard trước khi resharding được xử lý trước dữ liệu từ shard mới, từ đó bảo toàn thứ tự bản ghi dữ liệu được thêm vào luồng cho một khóa phân vùng cụ thể.
- Bản ghi dữ liệu trong shard cha có thể truy cập được từ thời điểm chúng được thêm vào luồng cho đến thời gian lưu trữ hiện tại.

# Kinesis Data Streams so với Kinesis Firehose

Tham khảo bài viết @ [Kinesis Data Streams vs Kinesis Firehose](https://jayendrapatil.com/aws-kinesis-data-streams-vs-kinesis-firehose/)

![3.png](@/assets/images/analytics/kinesis/3.png)

# Kinesis Data Streams so với SQS

Tham khảo bài viết @ [Kinesis Data Streams vs SQS](https://jayendrapatil.com/aws-kinesis-data-streams-vs-sqs/)

# Kinesis so với S3

![4.png](@/assets/images/analytics/kinesis/4.png)
