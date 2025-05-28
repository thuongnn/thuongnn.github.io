---
author: thuongnn
pubDatetime: 2021-03-14T20:20:35Z
title: "[Series tự học] Định nghĩa về Cloud Native App"
draft: false
tags:
  - Cloud Native App
  - The Twelve-Factor App
  - Microservices
  - CI/CD
  - Architecture
description: Bài viết đi tổng hợp và tự viết lại những hiểu biết về Cloud Native App của bản thân.
---

Có nhiều định nghĩa đặt ra cho CNA nhưng chỉ cần hiểu đơn giản CNA là một app _thuần_ cloud. Dưới góc nhìn high level, nó là app được thiết kế để chạy trên môi trường cloud.

Nhìn rộng ra thì nó có thể chạy được trên nhiều môi trường cloud, thậm chí có thể được triển khai theo kiến trúc phân tán (distributed) trên nhiều môi trường cloud để tận dụng tối đa các nguồn lực mà cloud mang lại.

CNA còn được định nghĩa trong Beyond the _twelve-factor app_ như sau:

> A cloud-native application is an application that has been designed and implemented to run on a Platform-as-a-Service installation and to embrace horizontal elastic scaling.

Các ứng dụng ngày càng trở nên phức tạp với nhu cầu ngày càng cao của người dùng; Người dùng mong đợi khả năng đáp ứng nhanh chóng, các tính năng hữu ích và không có _downtime_. Tốc độ và sự linh hoạt của CNA đến từ một số yếu tố sau:
![](https://private-user-images.githubusercontent.com/33452221/448012089-4da0be5a-f580-4778-ac0c-cbb97dfe8da0.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NDgzNjIxMzcsIm5iZiI6MTc0ODM2MTgzNywicGF0aCI6Ii8zMzQ1MjIyMS80NDgwMTIwODktNGRhMGJlNWEtZjU4MC00Nzc4LWFjMGMtY2JiOTdkZmU4ZGEwLnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNTA1MjclMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjUwNTI3VDE2MDM1N1omWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPTBkOTVmZGQ2NzQ0NmJjNjNlNjhhNGIzZGU3NjM3MTVlNzIwZDU2NzlkZDBlMGEwZTEzNzRmNmNhNTE0ZTdmMmImWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0In0.BnQDGWx6eQbb7rA2P0aj4VyIQOfMIfdMjj01dc1BdaA)

## Table of contents

# Microservices

![](https://private-user-images.githubusercontent.com/33452221/448012091-41451743-2b86-4fc6-84f5-06feb498b5cc.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NDgzNjIxMzcsIm5iZiI6MTc0ODM2MTgzNywicGF0aCI6Ii8zMzQ1MjIyMS80NDgwMTIwOTEtNDE0NTE3NDMtMmI4Ni00ZmM2LTg0ZjUtMDZmZWI0OThiNWNjLnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNTA1MjclMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjUwNTI3VDE2MDM1N1omWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPTAzMzVkYmNjN2E3YzY1MDJiYWM5ZmZhMTBhM2MyNDViZWUxYjYyMzUwYzYwNDAyMWZkMGQ0MTU3MGQxYzkzYzkmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0In0.fZdsEOihyNh7ZbVpUTmNPLa8g1AfWc1Djw4QUY3weIU)
Thiết kế các app theo kiến trúc microservices mang lại cho hệ thống rất nhiều lợi ích và cũng đang là xu hướng _thời thượng_ vì đơn giản rất nhiều sản phẩm của các hãng lớn đã và đang theo con đường này.

Một app dưới góc nhìn tổng quát chính là sự tổng hòa của một hoặc nhiều component. CNA cũng không ngoại lệ, để app phù hợp với môi trường cloud thì kiến trúc microservice là điều không thể tránh khỏi khi thiết kế CNA.

CNA cần phải được thiết kế theo kiến trúc microservice để phù hợp với môi trường cloud. Với các cloud app được phát triển trong thời gian gần đây, kiến trúc microservice luôn là sự lựa chọn tối ưu. Đối với các legacy app, việc cần làm là tách rời các component và tái thiết kế chúng theo kiến trúc microservice.

Một số lợi ích mà microservices mang lại:

- Mỗi microservice có một vòng đời riêng, có thể phát triển độc lập và deploy thường xuyên.
- Không cần phải đợi bản phát hành hàng quý để triển khai các tính năng hoặc bản cập nhật mới. Thay vào đó có thể cập nhật một phần nhỏ của một ứng dụng phức tạp với ít nguy cơ làm gián đoạn toàn bộ hệ thống hơn.
- Mỗi microservice có thể mở rộng quy mô độc lập. Thay vì mở rộng toàn bộ ứng dụng thành một đơn vị duy nhất, chỉ cần mở rộng quy mô những dịch vụ cần thiết (CPU, Memory, Network Bandwidth).
- Cách tiếp cận chi tiết để mở rộng quy mô này cung cấp khả năng kiểm soát hệ thống tốt hơn và giúp giảm chi phí tổng thể khi mở rộng quy mô các phần của hệ thống chứ không phải tất cả mọi thứ.

# Modern Design

Câu hỏi đặt ra là _Thiết kế một Cloud Native App như thế nào? Kiến trúc trong ứng dụng ra sao? Những nguyên tắc, pattern và phương pháp nào cần được tuân thủ?_

Một phương pháp được chấp nhận rộng rãi để xây dựng các Cloud Native App là The [Twelve-Factor App](https://12factor.net/). Nó mô tả một tập hợp các nguyên tắc và best practice mà các developers tuân theo để xây dựng các ứng dụng được tối ưu hóa trong _modern cloud_.

The _Twelve-Factor App_ có thể được áp dụng cho các ứng dụng được viết bằng bất kỳ ngôn ngữ lập trình nào và sử dụng bất kỳ sự kết hợp nào của các dịch vụ hỗ trợ (database, queue, memory cache, etc).

Dưới đây là các yếu tố được đề cập đến:
| | Factor | Giải thích |
|:--|:--|:--|
| 1 | Code Base | Code base duy nhất cho mỗi microservice, lưu trữ trong repository. Sử dụng _version control_ và có thể được triển khai cho nhiều môi trường (QA, Staging, Production). |
| 2 | Dependencies | Mỗi microservice sẽ cô lập và đóng gói với các dependencies của riêng nó, bao gồm các thay đổi mà không ảnh hưởng đến toàn bộ hệ thống. |
| 3 | Configurations | Thông tin các config được tách biệt khỏi microservice và lưu trữ bên ngoài thông qua một công cụ quản lý không liên quan gì tới code trong microservice. |
| 4 | Backing Services | Thành phần tài nguyên hỗ trợ cho microservice (data stores, caches, message brokers) phải được expose qua một _addressable URL_; tách được thành phần này ra khỏi ứng dụng, cho phép nó có thể hoán đổi cho nhau. |
| 5 | Build, Release, Run | Mỗi phiên bản release phải được phân tách qua các giai đoạn build, release, và run; mỗi version phải được đánh tag và hỗ trợ khả năng rollback khi cần. Áp dụng CI/CD để giải quyết yếu tố này. |
| 6 | Processes | Mỗi microservice phải thực thi trong quy trình riêng của nó, tách biệt với các dịch vụ đang chạy khác. Xây dựng app _"stateless"_ nhất có thể, đối với stateful service thì các data cần phải lưu trữ trong **Backing Services**. |
| 7 | Port Binding | Microservice được export thông qua _port binding_, làm như vậy giúp cách ly khỏi các microservices khác. Một app có thể trở thành **Backing Services** cho một app khác. |
| 8 | Concurrency | Các service mở rộng quy mô trên một số lượng lớn các quy trình nhỏ giống hệt nhau (bản sao) thay vì mở rộng quy mô một phiên bản lớn duy nhất trên máy cấu hình mạnh. (mở rộng theo chiều ngang hơn là chiều dọc) |
| 9 | Disposability | App có khả năng dùng một lần, có nghĩa là chúng có thể được khởi động hoặc dừng ngay lập tức. Thời gian khởi động ngắn mang lại sự nhanh nhẹn hơn cho quá trình release và mở rộng quy mô.|
| 10 | Dev/Prod Parity | Giữ các môi trường trong suốt vòng đời app càng giống nhau càng tốt, giảm thiểu chi phí chuyển giao từ dev sang prod environment. |
| 11 | Logging | Coi _treat logs_ được tạo bởi microservices như các _event streams_. Luồng này cần được lưu trữ và quản lý bởi các công cụ khác mang lại nhiều lợi ích. |
| 12 | Admin Processes | Các tác vụ quản trị, quản lý nên được chạy dưới dạng quy trình một lần, tách biệt với app. Các tác vụ có thể là: migrate database, cronjobs, report, etc. |

Tuy nhiên 12 yêu tố ban đầu (từ 2011) được đề cập ở trên vẫn chưa đủ đối với thiết kế Cloud Native App ngày nay. Thêm vào đó có 3 yếu tố được bổ sung thêm:
| | New Factor | Giải thích |
|:--|:--|:--|
| 13 | API First | Triển khai ứng dụng như một dịch vụ, hãy giải sử app được sử dụng bởi front-end client, gateway, third party services, etc. |
| 14 | Telemetry | Đảm bảo thiết kế hệ thống bao gồm việc thu thập dữ liệu giám sát, health/system data, etc. |
| 15 | Authentication/ Authorization | Nên thực hiện xác thực danh tính ngay từ ban đầu, sử dụng RBAC (role-based access control). |

Ngoài 15 yếu tố trên, còn có những cân nhắc quan trọng trong thiết kế CNA:

- **Communication** — Giao tiếp giữa các ứng dụng _front-end_ và _back-end_, internal services; khả năng kiểm soát bảo mật trong giao tiếp; xem xét việc kết nối trực tiếp hay tách rời (message broker).
- **Resiliency** — Khả năng phục hồi của các microservice; trong kiến trúc phân tán, điều gì sẽ xảy ra khi _Service B_ không phản hồi _Service A_, _Service C_ tạm thời gián đoạn khiến cho các service khác không thể kết nối.
- **Distributed Data** — Theo chuẩn kiến trúc microservice, mỗi microservice sẽ được đóng gói với database của chính nó. Xảy ra TH có nhiều microservice cần truy vấn dữ liệu hoặc thực hiện một giao dịch.
- **Identity** — Trong mạng lưới các microservice, các microservice có thực sự _“trust”_ nhau không? Một service làm thế nào để xác định ai đang yêu cầu truy cập và có quyền gì?

# Containers

![](https://marionoioso.com/wp-content/uploads/2019/07/traditional-VM-Container-1024x369.jpg)
Đây là thành phần không thể thiếu trong Cloud Native App, giúp cho việc đóng gói một microservice trở nên đơn giản hơn bao giờ hết. Các thành phần của một service app như code, dependencies,… sẽ được đóng gói vào trong một container image duy nhất và lưu trữ trong container registry.

Container image có thể chạy trên bất kỳ máy chủ (cài sẵn Docker) bằng cách kéo chúng về từ container registry. Sự thuận tiện này khiến cho Docker trở thành tiêu chuẩn thực tế để đóng gói, triển khai Cloud Native App.

## Container Orchestration

![](https://private-user-images.githubusercontent.com/33452221/448013114-a3eb41d0-ba15-4627-bd56-9585b834197c.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NDgzNjIyOTYsIm5iZiI6MTc0ODM2MTk5NiwicGF0aCI6Ii8zMzQ1MjIyMS80NDgwMTMxMTQtYTNlYjQxZDAtYmExNS00NjI3LWJkNTYtOTU4NWI4MzQxOTdjLnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNTA1MjclMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjUwNTI3VDE2MDYzNlomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPTI2Y2VkZGRjYmJhZmE1OTk1ZWUwOWM0ZmM5YmI5NDU2ZmY5OWE4MDE0OTg4MzFlODQzYjZlMDVmOWE1NmQ2NjMmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0In0.RiCrHm6DZJFSjv33JAyry7_HkEr5w1uVeL-0g8ng_b4)
Trong khi các công cụ như Docker tạo ra images và chạy các containers, Chúng ta cũng cần các công cụ để quản lý chúng. Quản lý container được thực hiện bằng một giải pháp được gọi là _container orchestrator_. Khi hoạt động ở quy mô lớn, việc điều phối container là điều cần thiết. Hiện nay có nhiều công cụ hỗ trợ điều phối container, tuy nhiên nổi bật về orchestration thì có 3 giải pháp đó là Docker Swarm, Kubernetes và Nomad.

Đa số các _Container Orchestration_ đều có nhiệm vụ và chức năng giống nhau:
| Tasks | Giải thích |
|:--|:--|
| Scheduling | Tự động lập lịch để chạy các container trên node phù hợp. |
| Affinity/anti-affinity | Xác định các điều kiện, chính sách chạy cho container, xác định mối quan hệ giữa các container. |
| Health monitoring | Tự động phát hiện các container bị lỗi; Thực hiện stop, restart hay xoá và tạo mới container. |
| Failover | Tự động phân bổ lại các container tạo mới bị thất bại trên một node phù hợp hơn. |
| Scaling | Tự động thêm hoặc xóa phiên bản container để đáp ứng nhu cầu sử dụng. |
| Networking | Quản lý network overlay cho kết nối giữa các container. |
| Service Discovery | Cho phép container có thể tìm thấy, xác định vị trí container khác. |
| Rolling Upgrades | Triển khai upgrade hệ thống với _zero downtime_. Tự động khôi phục các thay đổi khi có vấn đề. |

Có thể thấy 2 yếu tố được đặt ra trong The _Twelve-Factor App_ được áp dụng cho _Container Orchestration_ và sự liên quan của chúng:

- **Concurrency** — Các service mở rộng quy mô trên một số lượng lớn các quy trình nhỏ giống hệt nhau (bản sao) thay vì mở rộng quy mô một phiên bản lớn duy nhất trên máy cấu hình mạnh.
- **Disposability** — App có khả năng dùng một lần, có nghĩa là chúng có thể được khởi động hoặc dừng ngay lập tức. Thời gian khởi động ngắn mang lại sự nhanh nhẹn hơn cho quá trình release và mở rộng quy mô.

# Automation

Các hệ thống Cloud Native bao gồm các _microservices_, _containers_, _modern system design_ để đạt được tốc độ và sự linh hoạt. Nhưng vấn đề tiếp theo chính là cung cấp cơ sở hạ tầng để hệ thống chạy và triển khai nhanh chóng các tính năng bản cập nhật của ứng dụng.

Trong Cloud Native đề cập đến 2 thành phần tự động hoá quan trọng đó là:

- Tự động hoá cơ sở hạ tầng
- Tự động hoá triển khai

## Tự động hoá cơ sở hạ tầng

Khi triển khai Cloud Native App trên cloud, các thành phần cơ sở hạ tầng cần phải được tạo và cấu hình đầy đủ (ví dụ như storage, network, security group,…) để một ứng dụng có thể chạy được.

Đối với các nhà cung cấp public cloud (AWS, Azure, Google Cloud, etc) hay private cloud (được dựng bởi Openstack); việc tạo các tài nguyên sẽ phải tự làm bằng tay (truy cập vào UI console rồi click, config, cài cắm từng bước,…)

Tuy nhiên với giải pháp [IaC (Infrastructure as Code)](https://en.wikipedia.org/wiki/Infrastructure_as_code), việc cung cấp nền tảng, cơ sở hạ tầng cho ứng dụng sẽ hoàn toàn được tự động hoá.

Các công cụ trong giải pháp IaC phổ biến như Cloudformation (dùng cho AWS service) và Terraform (dùng cho mọi cloud) cho phép viết kịch bản khai báo cơ sở hạ tầng cloud; _resource name_, _location_, _storage_, _secret_, _etc_ được tham số hoá và tự động.

Các script cung cấp một cơ sở hạ tầng được nhất quán và có thể lặp lại trên các môi trường hệ thống, chẳng hạn như QA, staging và production. Với khả năng automate, IaC được tích hợp vào quy trình CI/CD để xây dựng hạ tầng một cách nhanh chóng. Chỉ cần start một Jenkins pipeline là infra được build lên.
![](https://devtron.ai/blog/content/images/2024/11/explanation-of-how-iac-works-1.jpg)

## Tự động hoá triển khai

![](https://blog.syncitgroup.com/wp-content/uploads/2020/07/jenkins-1-1024x485.png)

Yếu tố số 5 trong [The Twelve-Factor App](https://12factor.net/) được nhắc đến như sau:

> Mỗi phiên bản release phải được phân tách qua các giai đoạn build, release, và run; mỗi version phải được đánh tag và hỗ trợ khả năng rollback khi cần.

Triển khai hệ thống CI/CD sẽ giúp thực hiện nguyên tắc này. Thực hiện cung cấp các bước triển khai riêng biệt và giúp đảm bảo code chất lượng và nhất quán sẵn có cho người dùng.

Nhiều hệ thống đã chuyển từ release hàng quý sang _on-demand updates_. Mục đích là để phát hiện sớm các vấn đề trong chu kỳ phát triển, bớt tốn kém hơn để sửa chữa. Khoảng thời gian giữa các lần tích hợp càng dài, các vấn đề càng trở nên tốn kém hơn để giải quyết.

Với sự nhất quán trong quá trình tích hợp, các team có thể cam kết thay đổi code thường xuyên hơn, dẫn đến chất lượng phần mềm và cộng tác tốt hơn.

# Reference

- https://docs.microsoft.com/en-us/dotnet/architecture/cloud-native/definition
- https://edwardthienhoang.wordpress.com/2020/05/17/tan-man-ve-cloud-native/
