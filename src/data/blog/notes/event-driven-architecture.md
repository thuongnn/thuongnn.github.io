---
author: thuongnn
pubDatetime: 2021-03-15T21:22:35Z
title: "[Series tự học] EVENT-DRIVEN Architecture"
featured: false
draft: false
tags:
  - Event Driven Architecture
  - Message Broker
  - Event Notification
  - Event Sourcing
  - Architecture
description: Tổng hợp và trình bày lại những hiểu biết của bản thân về kiến trúc Event Driven.
---

## Table of contents

# Giới thiệu

**Event-driven architecture** (EDA) là mẫu kiến trúc phần mềm (architecture software pattern) về cơ bản hệ thống được xây dựng xung quanh các thao tác như tạo, khám phá, tiêu thụ và đáp trả lại các sự kiện (event).

Hiểu đơn giản hơn, EDA là một dạng kiến trúc phần mềm được xây dựng trên luồng các event, sử dụng event như là phương tiện giao tiếp giữa các thành phần hệ thống.

**Một ví dụ đơn giản của EDA**

- Một module quản lý việc đăng nhập của user cần chứng thực thông tin của user vừa nhập xong nên tự phát sinh và gửi đi một event gọi là LoginEvent chứa thông tin user.

- Event này sau đó được một module có khả năng thao tác với dữ liệu như WebServer, Database… bắt lấy, thực hiện việc kiểm chứng và sau đó trả lời kết quả thông qua LoginResultEvent để module đăng nhập bắt lấy.

- Theo cách xử lý này thì module đăng nhập không cần biết module nào và sẽ làm thế nào để thực hiện việc kiểm tra, nó chỉ cần biết gửi yêu cầu và nhận kết quả sau khi kiểm tra và tất cả những gì nó quan tâm chỉ là các event được định nghĩa ở mức hệ thống.

- Hơn nữa, event kết quả trong trường hợp trên có thể được quan tâm bởi nhiều module khác như module đảm nhận ghi log và do đó làm cho hệ thống càng mềm dẻo hơn.

![](https://private-user-images.githubusercontent.com/33452221/448013751-0254a39d-daf4-4fc5-a8e8-a35bc103e7ec.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NDgzNjI0MjksIm5iZiI6MTc0ODM2MjEyOSwicGF0aCI6Ii8zMzQ1MjIyMS80NDgwMTM3NTEtMDI1NGEzOWQtZGFmNC00ZmM1LWE4ZTgtYTM1YmMxMDNlN2VjLnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNTA1MjclMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjUwNTI3VDE2MDg0OVomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPWNkNzgzZjFhODRiMTAwZTQ0YzM0MGExNTBlYmFiOTNkNTNmNWJmYjNmZWE5YTQ4OGIxYjY3NmEzNWY0ZGNlYjYmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0In0.foV73Afg2CR-v3zBQVIu5qPx0DCd4RXWKjU_LxDhJ1I)

# What / When / Why

Cũng giống như class, component cũng được thiết kế với tính _low coupling_ và _high cohesion_.

Khi các component cần phải cộng tác, giả sử một **Component A** cần kích hoạt một số logic trong **Component B**; cách tự nhiên để làm điều đó chỉ đơn giản là **A** sẽ gọi một method trong một object của **B**.

Tuy nhiên, nếu **A** biết về sự tồn tại của **B**, chúng đang _tigh coupling_ với nhau, **A** phụ thuộc vào **B**, làm cho hệ thống khó khăn hơn để thay đổi và duy trì.

Do đó, **Event Driven** có thể được sử dụng ngăn chặn tình trạng “dính chặt” vào nhau giữa các components.

Có 3 trường hợp nên dùng **Event Driven**

- Để tách các thành phần

- Để thực hiện các tác vụ async

- Để lưu vết các thay đổi (audit log)

## Để tách các thành phần

- Khi **Component A** thực hiện logic cần kích hoạt logic của **Component B**, thay vì gọi nó trực tiếp, chúng ta có thể kích hoạt một event gửi đến event dispatcher.

- **Component B** sẽ lắng nghe event cụ thể đó trong dispatcher và sẽ hành động bất cứ khi nào event xảy ra.

- Điều này có nghĩa là cả **A** và **B** sẽ tùy thuộc vào _event_ và _event dispatcher_, chúng không hề biết và phụ thuộc lẫn nhau nhau (decoupled).

Điều này có nghĩa là cả **A** và **B** sẽ tùy thuộc vào _event_ và _event dispatcher_, chúng không hề biết và phụ thuộc lẫn nhau nhau (decoupled).

- Có một số logic mà chúng ta muốn thực hiện, nhưng có thể mất một khoảng thời gian để thực hiện và chúng ta không muốn người dùng chờ nó kết thúc.

- **Ví dụ**, việc order hàng trên webshop phải được thực hiện đồng bộ, còn việc gửi email đến user sẽ được thực hiện bất đồng bộ.

- Trong những trường hợp này, cần phải kích hoạt một event, đưa nó vào hàng đợi và sẽ ngồi trong hàng đợi cho đến khi một worker có thể thực hiện nó (khi có tài nguyên).

**Ví dụ**, việc order hàng trên webshop phải được thực hiện đồng bộ, còn việc gửi email đến user sẽ được thực hiện bất đồng bộ. Trong những trường hợp này, cần phải kích hoạt một event, đưa nó vào hàng đợi và sẽ ngồi trong hàng đợi cho đến khi một worker có thể thực hiện nó (khi có tài nguyên).

## Để lưu vết các thay đổi

- Theo cách lưu trữ dữ liệu truyền thống, chúng ta có các entity lưu giữ một số dữ liệu. Khi dữ liệu trong các entity đó thay đổi, chúng ta chỉ cần cập nhật một row của table trong DB để phản ánh các giá trị mới.

- Vấn đề ở đây là chúng ta không lưu trữ được cái gì thay đổi và thời điểm thay đổi. Phần này sẽ liên quan nhiều tới **Event Sourcing**.

# PATTERNS

[Martin Fowler](https://martinfowler.com) định nghĩa ra 3 loại event patterns:

- Event Notification

- Event-Carried State Transfer

- Event-Sourcing

Tất cả pattern này đề có chung key concept:

- Event đại diện cho một cái gì đó đã xảy ra.

- Event sẽ được phát tán (broadcasted) đến tất cả những nơi đang lắng nghe (chờ đợi) event đó.

## Event Notification

- Giả sử chúng ta có một application core với các component được xác định rõ ràng. Lý tưởng nhất là các component này hoàn toàn tách rời nhau nhưng một số chức năng của chúng yêu cầu một số logic trong các component khác sẽ được thực hiện).

- Đây là TH điển hình nhất, được mô tả trước đó (**Để tách các thành phần**)

- Điều quan trọng cần lưu ý là, một đặc điểm của mô hình này là event chỉ nên chứa các dữ liệu tối thiểu. Nó chỉ mang đủ dữ liệu cho listener biết điều gì đã xảy ra và thực hiện logic của chúng, thường là các Entity ID và có thể ngày và giờ mà event được tạo ra.

### Ưu điểm

- Khả năng phục hồi cao hơn, nếu các sự kiện được xếp hàng đợi, component gốc có thể thực hiện logic ngay cả khi logic thứ cấp không thể được thực hiện tại thời điểm đó vì một lỗi (vì chúng được xếp hàng đợi, chúng có thể được thực hiện sau đó, khi lỗi được cố định).

- Giảm độ trễ, nếu sự kiện được xếp hàng đợi người sử dụng không cần phải chờ cho logic đó được thực hiện.

- Các team có thể phát triển các component độc lập, làm cho công việc của họ dễ dàng hơn, nhanh hơn, ít bị vấn đề hơn và hữu cơ hơn.

## Event-Carried State Transfer

- Hãy xem xét lại ví dụ trước của một core ứng dụng với các components được xác định rõ ràng. Lần này, đối với một số chức năng của chúng, chúng cần dữ liệu từ các components khác.

- Cách tự nhiên nhất để lấy dữ liệu là invoke các component khác, nhưng điều đó có nghĩa là các component sẽ phải coupled với nhau!

- Một cách khác để chia sẻ dữ liệu là sử dụng event được kích hoạt khi data trong component có sự thay đổi. Event sẽ chứa những thông tin mới nhất của data và các component quan tâm đến dữ liệu đó sẽ được notify bằng những event này và sẽ có cách thức để handle nó. Bằng cách này, các component sẽ không cần phải ask các component khác một cách trực tiếp nữa.

### Ưu điểm

- Đây là kiểu lắng nghe bị động, các component cần data vẫn có thể hoạt động được trong trường hợp component cung cấp data không hoạt động (vì có lỗi hoặc máy chủ từ xa không thể truy cập được)

- Giảm độ trễ (latency) vì sẽ không còn các lệnh remote call (trong trường hợp liên lạc giữa các component cần thông qua network).

- Chúng ta không phải lo lắng về việc tải trên các component cung cấp data để đáp ứng các truy vấn từ tất cả các component truy vấn (đặc biệt là nếu nó là một component từ xa)

### Nhược điểm

- Sẽ có rất nhiều phiên bản copy của data ở nhiều nơi, nếu bạn không lo lắng về storage thì đây cũng không phải vấn đề lớn.

- Các component truy vấn data cần phải có logic phức tạp để duy trì bản sao cục bộ của dữ liệu bên ngoài.

## Event Sourcing

Theo cách lưu trữ trạng thái truyền thống, các entity chỉ được lưu trong DB dưới dạng các row trong 1 table, và nó chỉ phản ảnh trạng thái sau cùng của entity đó.

### Transaction Log

- Nhu cầu cần biết quá trình mà 1 entity đạt được trạng thái đó từ khi bắt đầu đến thời điểm hiện tại chứ không phải chỉ là trạng thái cuối cùng của nó.

- **Lấy ví dụ**, chúng ta có một tài khoản ngân hàng, nếu theo cách lưu trữ truyền thống; chúng ta chỉ có thể xem số dư tại thời điểm hiện tại của tài khoản chúng ta. Và nếu ngân hàng không support sao kê, để xem tiền vào, tiền ra trong một khoảng thời gian nào đó; thậm chí là từ lúc mở toàn khoản đến giờ thì sẽ không có cách nào để kiểm tra liệu hệ thống tính toán, lưu trữ ở phía ngân hàng làm việc có chính xác hay không. “Sao kê“ ở đây chính là một ví dụ cho Event Sourcing.

- Sử dụng **Event Sourcing**, thay vì lưu trữ trạng thái Thực thể, chúng ta tập trung vào việc lưu trữ thay đổi trạng thái Thực thể và tính toán trạng thái Thực thể từ những thay đổi đó.

### Deletions

- Nếu người dùng “lỡ tay” và tạo ra một sự thay đổi trạng thái (event) không mong muốn, chúng ta không thể xóa event đó nó sẽ thay đổi lịch sử thay đổi trạng thái, và nó sẽ đi ngược lại toàn bộ ý tưởng của event sourcing.

- Thay vào đó, chúng ta tạo thêm 1 event để đảo ngược (reverse) trạng thái từ event không mong muốn trước đó. Quá trình này được gọi là một giao dịch đảo ngược (Reversal Transaction).

- Không chỉ mang thực thể trở về trạng thái mong muốn mà còn để lại một dấu vết cho thấy rằng đối tượng đã ở trạng thái đó tại một thời điểm nhất định.

### Snapshots

- Tuy nhiên, khi chúng ta có nhiều sự kiện trong một luồng sự kiện, việc tính toán trạng thái Entity sẽ tốn kém, harm performance.

- Để giải quyết điều này, sau một số lần sự kiện X xảy ra, chúng ta sẽ tạo một ảnh chụp nhanh trạng thái (Snapshots) Entity tại thời điểm đó.

- Bằng cách này, khi cần trạng thái của thực thể, chúng ta chỉ cần tính toán nó từ bản Snapshots cuối cùng. Thậm chí, chúng ta có thể giữ một bản chụp cập nhật vĩnh viễn của Thực thể tại thời điểm mới nhất để không mất công đi tính toán lại.

![](https://private-user-images.githubusercontent.com/33452221/448013883-3d84f476-9eb7-4d52-b25e-7ce224281c69.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NDgzNjI0MjksIm5iZiI6MTc0ODM2MjEyOSwicGF0aCI6Ii8zMzQ1MjIyMS80NDgwMTM4ODMtM2Q4NGY0NzYtOWViNy00ZDUyLWIyNWUtN2NlMjI0MjgxYzY5LnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNTA1MjclMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjUwNTI3VDE2MDg0OVomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPWY5M2M1MDczNTRkMDVkNjk3NjU4Mzk2N2MxZjUxNGE4ZjJhZGQ4NDZlOGMyZTlmMjJiYmQzOTM4OTU1NzE0MjEmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0In0.BQGC1dvKfcbAl6eutzJFcpZSSVjoXlQ64a9CNcwKwhg)

### Projections

- Trong event sourcing, chúng ta cũng có khái niệm về phép chiếu (Projections), đó là tính toán của các sự kiện trong luồng sự kiện, từ và đến các khoảnh khắc cụ thể.

- Đó là ảnh chụp nhanh (Snapshots) hoặc trạng thái hiện tại của một thực thể, phù hợp với định nghĩa của phép chiếu.

- Nhưng ý tưởng có giá trị nhất trong khái niệm Projections là chúng ta có thể phân tích “hành vi” của các thực thể trong các khoảng thời gian cụ thể, cho phép chúng ta dự đoán về tương lai (ví dụ, nếu trong 5 năm qua, một thực thể tăng cường hoạt động trong tháng 8, có khả năng là tháng 8 năm sau sẽ giống nhau), và đây có thể là một khả năng cực kỳ có giá trị cho doanh nghiệp.

## Ưu điểm

- Event sourcing có thể rất hữu ích cho cả doanh nghiệp và quá trình development.

- Chúng ta truy vấn các sự kiện này, hữu ích cho cả doanh nghiệp và development để hiểu người dùng và hành vi hệ thống (debug).

- Chúng ta cũng có thể sử dụng event log để tái tạo lại các trạng thái trong quá khứ, một lần nữa hữu ích cho cả doanh nghiệp lẫn development.

- Khám phá lịch sử thay thế bằng cách đưa vào (injecting) các sự kiện giả định khi phát lại.

# Message Broker là gì?

![](https://private-user-images.githubusercontent.com/33452221/448013944-770becbb-4aa4-45a2-9ff5-9ab21c0b8d51.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NDgzNjI0MjksIm5iZiI6MTc0ODM2MjEyOSwicGF0aCI6Ii8zMzQ1MjIyMS80NDgwMTM5NDQtNzcwYmVjYmItNGFhNC00NWEyLTlmZjUtOWFiMjFjMGI4ZDUxLnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNTA1MjclMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjUwNTI3VDE2MDg0OVomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPTg2MTVhOWU1MTZiYzAwOGM5NDQ5ZGM1YTY2MTAyOTkyNDcwYWIyMGEwYTAxNDc3MDczNTM4OTg3YTVjMGYwZWEmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0In0.8p5K6bJGjTQBeoevxSSCk558Z8aw7fOc5Smp1dQn3BQ)

Là ứng dụng của **Event Driven pattern**.

Một module trung gian trung chuyển _message_ từ người gửi đến người nhận; làm trung gian giữa các ứng dụng với nhau, tối giản hóa giao tiếp giữa các ứng dụng đó và để tăng hiệu quả tối đa cho việc tách ra các khối nhỏ hơn.

Phân loại giữa các hệ thống Message Queue

| Message Base  | Data Pipeline |
| :------------ | :------------ |
| RabitMQ       | Kafka         |
| ActiveMQ      | Kinesis       |
| SQS           | RocketMQ      |
| ZeroMQ        |               |
| MSMQ          |               |
| IronMQ        |               |
| Redis Pub/sub |               |

So sánh cách hoạt động của 2 loại

| Message Base                                                                                                          | Data Pipeline                                                                             |
| :-------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------- |
| Lưu trạng thái của các `consumer` nhằm đảm bảo tất cả các `consumer` đều nhận được _message_ từ topic mà đã subscribe | Không lưu trạng thái của `consumer`.                                                      |
| Sau khi tất cả các `consumer` nhận được _message_ thì _message_ đó sẽ bị xoá                                          | _Message_ được xoá sau một khoảng thời gian nhất định                                     |
| Khi có một _message_ mới, `consumer` chỉ có thể lấy được duy nhất một _message_ đó                                    | Khi có _message_ mới, `consumer` có thể tuỳ ý lựa chọn lấy về một danh sách các _message_ |

- **Message Base**: là những loại message queue truyền thống, thích hợp làm hệ thống trao đổi message giữa các service. Việc đảm bảo mỗi consumer đều nhận được message và duy nhất một lần là quan trọng nhất.

- **Data Pipeline**: có cách lưu trữ message cũng như truyền tải message đến consumer hoàn toàn khác với hệ thống message queue truyền thống. Việc đảm bảo mỗi consumer đều phải nhận được message và duy nhất một lần không phải là ưu tiên số một, mà thay vào đó là khả năng lưu trữ message vả tốc độ truyền tải message.

# Reference

[https://edwardthienhoang.wordpress.com/2018/08/20/event-driven-architecture](https://edwardthienhoang.wordpress.com/2018/08/20/event-driven-architecture)
