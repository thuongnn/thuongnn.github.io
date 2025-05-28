---
author: thuongnn
pubDatetime: 2023-05-11T10:20:15Z
title: "[AWS] Amazon CloudFront"
draft: false
tags:
  - AWS
  - Amazon Web Services
description: Tìm hiểu về dịch vụ CDN của AWS, giúp phân phối nội dung với hiệu suất cao và độ trễ thấp.
---
Bài viết được tham khảo và tổng hợp lại từ Jayendra's Blog, xem bài viết gốc ở đây: https://jayendrapatil.com/aws-cloudfront. 

## Table of contents


- CloudFront là fully managed, fast content delivery network (CDN), giúp tăng tốc phân phối nội dung tĩnh, động trên web hoặc nội dung phát trực tuyến đến người dùng cuối.
- CloudFront phân phối nội dung thông qua mạng lưới trung tâm dữ liệu toàn cầu được gọi là **edge locations** hoặc **Point of Presence (POP)**.
- CloudFront cung cấp dữ liệu, video, ứng dụng và API một cách an toàn cho khách hàng trên toàn cầu với độ trễ thấp, tốc độ truyền tải cao.
- CloudFront mang đến cho các doanh nghiệp và application developers một cách dễ dàng và tiết kiệm chi phí để phân phối nội dung với độ trễ thấp và tốc độ truyền tải dữ liệu cao.
- CloudFront tăng tốc phân phối nội dung bằng cách định tuyến từng yêu cầu của người dùng đến **edge location** có khả năng phục vụ nội dung tốt nhất, từ đó cung cấp độ trễ thấp nhất.
- CloudFront sử dụng **AWS backbone network**, giúp giảm đáng kể network hops mà yêu cầu của người dùng cần đi qua, từ đó cải thiện hiệu suất, giảm độ trễ và tăng tốc độ truyền dữ liệu.
- CloudFront là một lựa chọn tốt cho việc phân phối nội dung tĩnh được truy cập thường xuyên, như hình ảnh, video, tệp phương tiện phổ biến trên trang web, hoặc các tệp phần mềm tải xuống, vốn được hưởng lợi từ việc phân phối qua **edge delivery**.

# **CloudFront Benefits**

- CloudFront loại bỏ chi phí và sự phức tạp khi vận hành một mạng lưới các máy chủ cache ở nhiều địa điểm trên internet, đồng thời loại bỏ nhu cầu dự phòng quá mức về năng lực để xử lý các đợt tăng đột biến về lưu lượng truy cập.
- CloudFront cũng cung cấp độ tin cậy và khả năng sẵn sàng cao hơn nhờ các bản sao của đối tượng được lưu trữ tại nhiều **edge locations** trên toàn thế giới.
- CloudFront duy trì các kết nối lâu dài với origin servers để có thể truy xuất các tệp từ origin servers một cách nhanh nhất.
- CloudFront sử dụng các kỹ thuật như hợp nhất các yêu cầu đồng thời của người xem tại một **edge location** đối với cùng một tệp thành một yêu cầu duy nhất đến máy chủ gốc, giúp giảm tải cho máy chủ gốc.
- CloudFront cung cấp các tính năng bảo mật bao gồm field-level encryption và hỗ trợ HTTPS.
- CloudFront tích hợp liền mạch với AWS Shield, AWS Web Application Firewall (WAF) và Route 53 để bảo vệ chống lại nhiều loại tấn công, bao gồm các cuộc tấn công DDoS ở cấp mạng và cấp ứng dụng.

# **Edge Locations & Regional Edge Caches**

![1.png](@/assets/images/networking/cloudfront/1.png)

- CloudFront **Edge Locations** hay **POPs** đảm bảo rằng nội dung phổ biến có thể được phục vụ nhanh chóng đến người xem.
- CloudFront cũng có **Regional Edge Caches**, giúp đưa nhiều nội dung lại gần hơn với người xem, ngay cả khi nội dung đó không đủ phổ biến để duy trì tại một POP, từ đó cải thiện hiệu suất cho nội dung đó.
- **Regional Edge Caches** được triển khai toàn cầu, gần với người xem, và nằm giữa các máy chủ gốc và các **Edge Locations**.
- **Regional Edge Caches** hỗ trợ nhiều **Edge Locations** và có kích thước bộ nhớ cache lớn hơn, giúp các đối tượng lưu trữ lâu hơn tại các địa điểm **Regional Edge Cache** gần nhất.
- **Regional Edge Caches** hỗ trợ tất cả các loại nội dung, đặc biệt là các nội dung có xu hướng trở nên ít phổ biến theo thời gian.

# Configuration & Content Delivery

![2.png](@/assets/images/networking/cloudfront/2.png)

### **Configuration**

- Các **origin servers** cần được cấu hình để lấy các tệp cho việc phân phối. Một **origin server** lưu trữ phiên bản gốc, xác thực của các đối tượng và có thể là một dịch vụ được lưu trữ trên AWS, ví dụ như S3, EC2, hoặc một máy chủ tại chỗ (on-premise server).
- Tệp hoặc đối tượng có thể được thêm lên hoặc tải lên các Origin servers với quyền đọc công khai hoặc quyền hạn chế cho Origin Access Identity (OAI). Tạo một CloudFront distribution, giúp CloudFront biết từ các origin servers nào sẽ lấy các tệp khi người dùng yêu cầu chúng.
- CloudFront gửi cấu hình phân phối đến tất cả các edge locations. Trang web có thể được sử dụng với tên miền do CloudFront cung cấp hoặc tên miền thay thế tùy chỉnh.
- Một origin server có thể được cấu hình để limit access protocols, caching behaviour, hay thêm các headers vào các tệp để thêm TTL hoặc expiration time.

### **Content delivery to Users**

- Khi người dùng truy cập trang web, tệp hoặc đối tượng – DNS sẽ chuyển hướng yêu cầu đến **CloudFront edge location** có thể phục vụ yêu cầu của người dùng nhanh nhất với độ trễ thấp nhất.
- CloudFront sẽ trả lại đối tượng ngay lập tức nếu đối tượng yêu cầu có sẵn trong bộ nhớ cache tại **Edge location.**
- Nếu đối tượng yêu cầu không có trong bộ nhớ cache tại **edge location**, POP thường sẽ đi đến **regional edge cache** gần nhất để lấy nó. Nếu đối tượng có trong **regional edge cache**, CloudFront sẽ chuyển tiếp nó đến **POP** đã yêu cầu.
- Đối với các đối tượng không có trong bộ nhớ cache tại cả **POP** lẫn **regional edge cache**, các đối tượng sẽ được yêu cầu từ **origin server** và trả lại cho người dùng thông qua **regional edge cache** và **POP**.
- CloudFront bắt đầu chuyển đối tượng đến người dùng ngay khi byte đầu tiên đến từ **regional edge cache**.
- CloudFront cũng sẽ thêm đối tượng vào bộ nhớ cache tại **regional edge cache** ngoài **POP** để lần yêu cầu tiếp theo của người xem được phục vụ nhanh hơn. Khi đối tượng hết thời gian hết hạn, đối với các yêu cầu mới, CloudFront sẽ kiểm tra với **origin server** để xem có phiên bản mới nhất không, nếu có nó sẽ sử dụng đối tượng đó. Nếu **origin server** có phiên bản mới nhất, phiên bản đó sẽ được lấy, phục vụ cho người dùng và lưu vào bộ nhớ cache

# **CloudFront Origins**

- Mỗi origin có thể là một **S3 bucket**, một **MediaStore container**, một **MediaPackage channel**, hoặc một **custom origin** như một **EC2 instance** hoặc một **HTTP server**.
- Đối với **S3 bucket**, bạn sử dụng URL của bucket hoặc URL của **static website endpoint**, và các tệp cần phải có quyền đọc công khai hoặc được bảo vệ bằng **OAI (Origin Access Identity)**.
- **Origin restrict access**, chỉ đối với **S3**, có thể được cấu hình thông qua **Origin Access Identity** để ngăn chặn việc truy cập trực tiếp vào các đối tượng S3.
- Đối với **HTTP server** làm origin, tên miền của tài nguyên cần phải được ánh xạ và các tệp phải có quyền đọc công khai.
- Một **Distribution** có thể có nhiều origin cho mỗi bucket với một hoặc nhiều **cache behaviors** để chuyển hướng yêu cầu đến từng origin. **Path pattern** trong một **cache behavior** xác định yêu cầu nào sẽ được chuyển hướng đến **origin** (S3 bucket) liên kết với **cache behavior** đó.

# **CloudFront Origin Groups**

![3.png](@/assets/images/networking/cloudfront/3.png)

- **Origin Groups** có thể được sử dụng để chỉ định hai origins nhằm cấu hình **origin failover** cho tính năng **high availability**.
- **Origin failover** có thể được sử dụng để chỉ định một **primary origin** và một **secondary origin**, mà CloudFront sẽ tự động chuyển sang khi **primary origin** trả về mã lỗi HTTP cụ thể.
- CloudFront sẽ chuyển hướng tất cả các yêu cầu đến **primary origin**, ngay cả khi một yêu cầu trước đó đã failover sang **secondary origin**. CloudFront chỉ gửi yêu cầu đến **secondary origin** sau khi một yêu cầu bị lỗi từ **primary origin**.
- CloudFront chỉ failover sang **secondary origin** khi **HTTP method** của yêu cầu người dùng là **GET**, **HEAD**, hoặc **OPTIONS** và không failover khi người dùng gửi một phương thức HTTP khác (ví dụ **POST**, **PUT**, v.v.).

# **CloudFront Delivery Methods**

### **Web distributions**

- Hỗ trợ cả nội dung tĩnh và động như HTML, CSS, JS, hình ảnh, v.v. thông qua HTTP hoặc HTTPS.
- Hỗ trợ nội dung đa phương tiện theo yêu cầu thông qua **progressive download** và **Apple HTTP Live Streaming (HLS)**.
- Hỗ trợ các sự kiện trực tiếp, như cuộc họp, hội nghị, hoặc buổi hòa nhạc, trong thời gian thực. Đối với live streaming, phân phối có thể được tạo tự động bằng cách sử dụng **AWS CloudFormation stack**.
- Các **origin servers** có thể là **S3 bucket** hoặc một **HTTP server**, ví dụ như một **web server** hoặc **AWS ELB**, v.v.

# **Cache Behavior Settings**

### **Path Patterns**

- **Path Patterns** giúp xác định đường dẫn nào sẽ áp dụng cho **Cache behavior**
- Một pattern mặc định (*) được tạo ra và có thể thêm nhiều **cache distributions** với các patterns khác nhau, các pattern này sẽ có ưu tiên cao hơn so với đường dẫn mặc định.

### **Viewer Protocol Policy (Viewer -> CloudFront)**

- **Viewer Protocol Policy** có thể được cấu hình để xác định giao thức truy cập được phép.
- Giữa CloudFront và người dùng, phân phối cache có thể được cấu hình để hỗ trợ:
    - **HTTPS only** – chỉ hỗ trợ HTTPS.
    - **HTTP and HTTPS** – hỗ trợ cả HTTP và HTTPS.
    - **HTTP redirected to HTTPS** – HTTP sẽ tự động chuyển hướng sang HTTPS.

### Origin Protocol Policy (CloudFront -> Origin)

- Giữa CloudFront và Origin, phân phối cache có thể được cấu hình với các tùy chọn sau:
    - **HTTP only** (dành cho S3 static website) – chỉ sử dụng HTTP.
    - **HTTPS only** – CloudFront lấy các đối tượng từ origin bằng cách sử dụng HTTPS.
    - **Match Viewer** – CloudFront sử dụng giao thức mà người dùng đã sử dụng để yêu cầu các đối tượng.
- Đối với S3 làm origin:
    - **Đối với website**, giao thức phải là HTTP vì HTTPS không được hỗ trợ.
    - **Đối với S3 bucket**, chính sách giao thức mặc định giữa CloudFront và Origin là **Match Viewer** và không thể thay đổi. Do đó, khi CloudFront được cấu hình yêu cầu HTTPS giữa viewer và CloudFront, nó tự động sử dụng HTTPS để giao tiếp với S3

### **HTTPS Connection**

CloudFront có thể được cấu hình để làm việc với HTTPS cho các tên miền thay thế bằng hai phương pháp sau:

- **Sử dụng Địa Chỉ IP Riêng Biệt**
    - CloudFront liên kết một **tên miền thay thế** với một **địa chỉ IP riêng biệt**.
    - **Chứng chỉ SSL/TLS** được liên kết với địa chỉ IP khi có yêu cầu từ máy chủ DNS cho địa chỉ IP đó.
    - Địa chỉ IP được CloudFront sử dụng để xác định phân phối, và chứng chỉ SSL/TLS sẽ được trả về cho người dùng.
    - Phương pháp này hoạt động cho mọi yêu cầu HTTPS, bất kể trình duyệt hay người dùng sử dụng. Việc sử dụng địa chỉ IP riêng biệt sẽ phát sinh chi phí khoảng **600 USD/tháng**.
    - Địa chỉ IP riêng biệt cho phép CloudFront phục vụ nhiều tên miền trên cùng một IP mà không bị nhầm lẫn.
- **Sử dụng Server Name Indication (SNI)**
    - **SNI (Server Name Indication)** là một phần mở rộng của giao thức TLS cho phép nhiều tên miền được phục vụ từ cùng một địa chỉ IP.
    - CloudFront sử dụng **SNI Custom SSL** để ánh xạ tên miền thay thế tới một địa chỉ IP mà không yêu cầu địa chỉ IP riêng biệt.
    - **SNI** gửi tên miền trong **TLS handshake** tới CloudFront, sau đó CloudFront sẽ sử dụng tên miền để chọn chứng chỉ SSL/TLS phù hợp.
    - **SNI** cho phép CloudFront phục vụ HTTPS cho nhiều tên miền sử dụng cùng một địa chỉ IP.
    - **SNI Custom SSL** có sẵn mà không phải trả thêm chi phí ngoài các khoản phí chuyển dữ liệu và yêu cầu của CloudFront.
    - SNI được hỗ trợ bởi hầu hết các trình duyệt hiện tại, nhưng các trình duyệt cũ hơn có thể không hỗ trợ, điều này có thể gây vấn đề cho người dùng sử dụng trình duyệt cũ.
- **End-to-End HTTPS connections** - để đảm bảo mã hóa toàn bộ (HTTPS) cho việc phân phối nội dung, chứng chỉ SSL/TLS cần được áp dụng cả giữa:
    - **HTTPS giữa viewers và CloudFront**
        - Chứng chỉ được cấp bởi trusted certificate authority (CA) ví dụ như Comodo, DigiCert, or Symantec.
        - Chứng chỉ được cấp bởi [AWS Certificate Manager](https://jayendrapatil.com/aws-certificate-manager-acm/) (ACM).
    - **HTTPS giữa CloudFront và the Custom Origin**
        - Nếu origin không phải là **Elastic Load Balancer (ELB)**, chứng chỉ phải được cấp bởi trusted CA như Comodo, DigiCert, or Symantec.
        - Nếu origin là **ELB**, chứng chỉ có thể được cấp bởi **ACM**.
        - **Self-signed certificates** **không thể** được sử dụng cho kết nối HTTPS giữa CloudFront và origin.
- **ACM certificate**
    - Nếu sử dụng **ACM** cho CloudFront, chứng chỉ **phải được requested hoặc imported** ở region **US East (N. Virginia)**.
    - Các ACM certificate ở region **US East (N. Virginia)** sẽ được **phân phối** tới tất cả các vị trí địa lý liên kết với phân phối CloudFront.

### **Allowed HTTP methods**

- CloudFront hỗ trợ các phương thức HTTP để thực hiện các tác vụ khác nhau với các đối tượng, bao gồm GET, HEAD, OPTIONS, PUT, POST, PATCH, DELETE.
    - GET, HEAD
    - GET, HEAD, OPTIONS
    - GET, HEAD, OPTIONS, PUT, POST, PATCH, DELETE
- CloudFront chỉ **cache** các phản hồi từ các yêu cầu **GET** và **HEAD** và, nếu cần, có thể cache các phản hồi từ yêu cầu **OPTIONS**. Các phương thức **PUT, POST, PATCH, DELETE** không được cache bởi CloudFront và luôn được chuyển tiếp đến **Origin**.
- **PUT, POST, HTTP method** có thể giúp **tăng tốc quá trình tải nội dung**. Khi sử dụng các phương thức này, yêu cầu sẽ được chuyển đến **Origin** (ví dụ như S3) qua **vị trí edge của CloudFront**, giúp cải thiện hiệu suất và giảm độ trễ. Quá trình này cũng giúp ứng dụng tận dụng các kết nối **kiểm soát liên tục và giám sát** mà CloudFront duy trì giữa các vị trí edge và các máy chủ origin.

# CloudFront Edge Caches

- Kiểm soát `max-age` của bộ nhớ đệm
    - Để tăng tỷ lệx2 **cache hit** (tỷ lệ truy cập thành công từ bộ nhớ đệm), máy chủ gốc (origin) có thể được cấu hình để thêm chỉ thị `Cache-Control: max-age` vào các object.
    - Khoảng thời gian càng dài, object sẽ càng ít được truy xuất từ máy chủ gốc.
- Bộ nhớ đệm dựa trên **Query String Parameters**
    - **CloudFront** có thể được cấu hình để caching dựa trên query parameters:
        - **None (Improves Caching)**
            - Sử dụng khi máy chủ gốc (origin) trả về cùng một phiên bản của object **bất kể** giá trị của các tham số query string.
            - Điều này cải thiện hiệu suất bộ nhớ đệm vì CloudFront chỉ lưu trữ một phiên bản duy nhất.
        - **Forward all, cache based on whitelist**
            - Sử dụng khi máy chủ gốc trả về **các phiên bản khác nhau** của object dựa trên một hoặc nhiều tham số query string.
            - Bạn cần chỉ định các tham số muốn CloudFront sử dụng làm cơ sở để caching trong trường **Query String Whitelist**.
        - **Forward all, cache based on all**
            - Sử dụng khi máy chủ gốc trả về **các phiên bản khác nhau** của object cho **tất cả các tham số query string**.
    - Cải thiện hiệu suất bộ nhớ đệm bằng cách:
        - Đảm bảo rằng **chỉ các tham số thực sự ảnh hưởng đến kết quả trả về từ máy chủ gốc** mới được chuyển tiếp.
        - Sử dụng **cùng một kiểu chữ** cho giá trị của các tham số. Ví dụ: Nếu giá trị tham số là `A` hoặc `a`, CloudFront sẽ caching hai yêu cầu khác nhau, ngay cả khi phản hồi hoặc object trả về giống hệt nhau.
        - Sử dụng **cùng một thứ tự tham số**. Ví dụ: Với yêu cầu `a=x&b=y` và `b=y&a=x`, CloudFront sẽ caching hai yêu cầu khác nhau, mặc dù phản hồi hoặc object trả về giống hệt nhau.
- Bộ nhớ đệm dựa trên **Cookie Values**
    - CloudFront có thể được cấu hình để caching dựa trên giá trị cookie.
    - Theo mặc định, CloudFront không xem xét cookie khi lưu trữ bộ nhớ đệm trên các edge location.
    - Cải thiện hiệu suất bộ nhớ đệm bằng cách:
        - **Cấu hình CloudFront chỉ chuyển tiếp các cookie cụ thể thay vì chuyển tiếp tất cả cookie:**
        *Ví dụ: nếu yêu cầu có 2 cookie với 3 giá trị có thể, CloudFront sẽ lưu trữ tất cả các tổ hợp có thể xảy ra ngay cả khi phản hồi chỉ phụ thuộc vào một cookie.*
        - **Tên và giá trị của cookie có phân biệt chữ hoa và chữ thường:** Do đó, nên sử dụng một quy tắc thống nhất về kiểu chữ để tránh tạo ra các bản sao không cần thiết.
        - **Tạo các cache behavior riêng biệt cho nội dung tĩnh và động, và chỉ cấu hình CloudFront chuyển tiếp cookie đến origin cho nội dung động:**
            
            *Ví dụ: đối với các tệp CSS, cookie không có ý nghĩa vì nội dung không thay đổi dựa trên giá trị cookie.*
            
        - **Nếu có thể, tạo các cache behavior riêng biệt cho nội dung động mà cookie có giá trị duy nhất cho mỗi người dùng (như ID người dùng) và nội dung động thay đổi dựa trên số lượng giá trị duy nhất nhỏ hơn.**
        *Ví dụ như một ID người dùng duy nhất. Trong trường hợp này, mỗi yêu cầu sẽ có một giá trị cookie khác nhau, dẫn đến việc CloudFront phải lưu trữ một phiên bản riêng cho từng người dùng. Điều này làm tăng số lượng bản sao trong bộ nhớ đệm và giảm hiệu suất.*
- Bộ nhớ đệm dựa trên **Request Headers**
    - CloudFront có thể được cấu hình để caching dựa trên các giá trị của request headers.
    - Theo mặc định, CloudFront không xem xét các header khi lưu trữ object trong các edge location.
    - Khi cấu hình CloudFront để caching dựa trên request headers, điều này không thay đổi các header mà CloudFront chuyển tiếp, mà chỉ xác định xem CloudFront có caching các đối tượng dựa trên giá trị của header hay không.
    - Cải thiện hiệu suất bộ nhớ đệm bằng cách:
        - Cấu hình CloudFront để chuyển tiếp và caching dựa trên các header cụ thể thay vì dựa trên tất cả các header.
        - Tránh caching dựa trên các request header có quá nhiều giá trị duy nhất.
        - Khi CloudFront được cấu hình để chuyển tiếp tất cả header đến origin, CloudFront sẽ không caching các object liên kết với cache behavior này. Thay vào đó, mọi yêu cầu sẽ được gửi đến origin.
        - Khi CloudFront caching dựa trên giá trị của header, nó không phân biệt chữ hoa và chữ thường của **tên header** nhưng có xét đến **chữ hoa và chữ thường** của **giá trị header**.

# Object Caching & Expiration

- Thời gian hết hạn của object xác định khoảng thời gian các object được lưu trữ trong bộ nhớ đệm của CloudFront trước khi nó truy xuất lại từ Origin.
- Thời gian hết hạn ngắn giúp phục vụ nội dung thay đổi thường xuyên, trong khi thời gian hết hạn dài giúp cải thiện hiệu suất và giảm tải cho origin.
- Theo mặc định, mỗi object sẽ tự động hết hạn sau 24 giờ.
- Sau khi hết hạn, CloudFront sẽ kiểm tra xem phiên bản mới nhất có sẵn không:
    - Nếu bộ nhớ đệm đã có phiên bản mới nhất, origin sẽ trả về mã trạng thái **304** (Not Modified).
    - Nếu bộ nhớ đệm của CloudFront không có phiên bản mới nhất, origin sẽ trả về mã trạng thái **200** (OK) kèm theo phiên bản mới nhất của object.
- Nếu một object trong edge location không được yêu cầu thường xuyên, CloudFront có thể loại bỏ object đó trước thời gian hết hạn để dành không gian cho các object được yêu cầu gần đây hơn.
- Đối với Web distributions, hành vi mặc định có thể thay đổi như sau:
    - **Cho toàn bộ đường dẫn**: Cache behavior có thể được cấu hình bằng cách thiết lập các giá trị **Minimum TTL**, **Maximum TTL**, và **Default TTL**.
    - **Cho từng object riêng lẻ**: Origin có thể được cấu hình để thêm `Cache-Control max-age`, `Cache-Control s-maxage`, hoặc trường header `Expires` cho object.
    - AWS khuyến nghị sử dụng `Cache-Control max-age` thay vì trường header `Expires` để kiểm soát hành vi lưu đệm của object.
    - CloudFront chỉ sử dụng giá trị của `Cache-Control max-age` nếu cả `Cache-Control max-age` và `Expires` đều được chỉ định.
    - Các trường header `HTTP Cache-Control` hoặc `Pragma` trong yêu cầu **GET** từ viewer không thể ép buộc CloudFront truy xuất lại object từ origin server.
    - Theo mặc định, khi origin trả về mã trạng thái HTTP **4xx** hoặc **5xx**, CloudFront sẽ lưu đệm các phản hồi lỗi này trong vòng **5 phút**, sau đó gửi yêu cầu tiếp theo đến origin để kiểm tra xem object đã sẵn có hay sự cố đã được khắc phục hay chưa.

# CloudFront Origin Shield

- **CloudFront Origin Shield** cung cấp một lớp bổ sung trong hạ tầng bộ nhớ đệm của CloudFront giúp giảm tải cho origin, cải thiện khả năng sẵn sàng và giảm chi phí vận hành của nó.
- **Origin Shield** cung cấp một lớp bộ nhớ đệm tập trung giúp tăng **cache hit ratio** để giảm tải cho origin.
- **Origin Shield** giảm chi phí vận hành của origin bằng cách hợp nhất các yêu cầu qua các khu vực, sao cho chỉ có một yêu cầu duy nhất được gửi đến origin cho mỗi object.
- **Origin Shield** có thể được cấu hình bằng cách chọn **Regional Edge Cache** gần nhất với origin để trở thành **Origin Shield Region**.
- **CloudFront Origin Shield** có lợi cho nhiều trường hợp sử dụng như:
    - Các viewer phân bố ở các vùng địa lý khác nhau.
    - Các origin cung cấp đóng gói theo yêu cầu cho phát trực tiếp hoặc xử lý ảnh động.
    - Các origin on-premises có giới hạn về công suất hoặc băng thông.
    - Các workloads sử dụng nhiều content delivery networks (CDNs).

# Serving Compressed Files

- **CloudFront** có thể được cấu hình để tự động nén các tệp của một số loại nhất định và phục vụ các tệp đã nén khi yêu cầu của viewer bao gồm `Accept-Encoding` trong tiêu đề yêu cầu.
- Việc nén nội dung giúp tải xuống nhanh hơn vì các tệp nhỏ hơn, đồng thời cũng giúp giảm chi phí vì chi phí chuyển dữ liệu của **CloudFront** dựa trên tổng lượng dữ liệu được phục vụ.
- **CloudFront** có thể nén các đối tượng bằng các định dạng nén **Gzip** và **Brotli**.
- Nếu phục vụ từ một custom origin, nó có thể được cấu hình để:
    - Có thể chọn liệu tệp có được nén bởi **CloudFront** hay không. Nếu muốn, chúng ta có thể để origin tự nén tệp trước khi gửi về **CloudFront**, hoặc để **CloudFront** tự nén tệp khi nó nhận được yêu cầu từ viewer.
    - Mặc dù **CloudFront** hỗ trợ nén nhiều loại tệp (như HTML, CSS, JS...), nhưng một số loại tệp không được **CloudFront** tự động nén.
- Nếu origin trả về một tệp đã nén, **CloudFront** sẽ phát hiện sự nén qua giá trị tiêu đề `Content-Encoding` và không nén lại tệp đó.
- **CloudFront** phục vụ nội dung bằng cách nén như sau:
    1. Một phân phối **CloudFront** được tạo ra và cấu hình để nén nội dung.
    2. Một viewer yêu cầu một tệp đã nén bằng cách thêm tiêu đề `Accept-Encoding` bao gồm `gzip`, `br` hoặc cả hai vào yêu cầu.
    3. Tại edge location, **CloudFront** kiểm tra cache để tìm phiên bản nén của tệp được tham chiếu trong yêu cầu.
    4. Nếu tệp đã nén có sẵn trong bộ nhớ đệm, **CloudFront** trả lại tệp cho viewer và bỏ qua các bước còn lại.
    5. Nếu tệp nén không có trong bộ nhớ đệm, **CloudFront** chuyển yêu cầu đến máy chủ origin (S3 bucket hoặc custom origin).
    6. Ngay cả khi **CloudFront** có phiên bản chưa nén của tệp trong bộ nhớ đệm, nó vẫn chuyển yêu cầu đến origin.
    7. Máy chủ origin trả về phiên bản chưa nén của tệp yêu cầu.
    8. **CloudFront** xác định xem tệp có thể nén được hay không:
        - Tệp phải thuộc loại mà **CloudFront** có thể nén.
        - Kích thước tệp phải nằm trong khoảng từ 1,000 đến 10,000,000 byte.
        - Phản hồi phải bao gồm tiêu đề `Content-Length` để xác định kích thước trong giới hạn nén hợp lệ. Nếu thiếu tiêu đề `Content-Length`, **CloudFront** sẽ không nén tệp.
        - Giá trị của tiêu đề `Content-Encoding` trên tệp phải không phải là `gzip`, tức là origin đã nén tệp.
        - Phản hồi phải có nội dung (body).
        - Mã trạng thái HTTP của phản hồi phải là 200, 403 hoặc 404.
    9. Nếu tệp có thể nén, **CloudFront** sẽ nén tệp, trả lại tệp nén cho viewer và caching.
    10. Viewer giải nén tệp.

# Distribution Details

### Price Class

- CloudFront có các edge locations trên toàn thế giới và chi phí cho mỗi edge locations khác nhau, đồng thời mức giá tính cho việc phục vụ các yêu cầu cũng khác nhau.
- Các edge locations của CloudFront được nhóm thành các khu vực địa lý, và các khu vực này đã được nhóm thành các lớp giá:
    - **Price Class** – Bao gồm tất cả các khu vực.
    - **Price Class 200** – Bao gồm tất cả các khu vực ngoại trừ Nam Mỹ và Australia & New Zealand.
    - **Price Class 100** – Bao gồm các khu vực có giá rẻ nhất (Khu vực Bắc Mỹ và Châu Âu).
- Price class có thể được chọn để giảm chi phí, nhưng điều này sẽ đi kèm với việc giảm hiệu suất (độ trễ cao hơn), vì CloudFront sẽ chỉ phục vụ yêu cầu từ các edge locations trong lớp giá đã chọn.
- Đôi khi, CloudFront có thể phục vụ yêu cầu từ một khu vực không nằm trong lớp giá, tuy nhiên, bạn sẽ bị tính phí theo mức giá của khu vực có chi phí thấp nhất trong lớp giá đã chọn.

### WAF Web ACL

- AWS WAF có thể được sử dụng để cho phép hoặc chặn các yêu cầu dựa trên các tiêu chí đã chỉ định, chọn web ACL để liên kết với phân phối này.

### Alternate Domain Names (CNAMEs)

- Mặc định, CloudFront gán một tên miền cho phân phối, ví dụ: `d111111abcdef8.cloudfront.net`
- Một tên miền thay thế, còn được gọi là CNAME, có thể được sử dụng để sử dụng tên miền tùy chỉnh của riêng bạn cho các liên kết đến các object.
- CloudFront hỗ trợ * wildcard ở đầu domain thay vì chỉ định các subdomain riêng lẻ.
- Tuy nhiên, wildcard không thể thay thế một phần của subdomain, ví dụ: `*domain.example.com`, hoặc không thể thay thế một subdomain ở giữa tên miền, ví dụ: `subdomain.**.example.com`.

# **CloudFront Security**

[**CloudFront Security**](CloudFront%2015a3fa6ae48380209873f76872cef294/CloudFront%20Security%2015f3fa6ae483809b8756da834e09d270.md)

# Access Logs

- CloudFront có thể được cấu hình để tạo các tệp log chứa thông tin chi tiết về mỗi yêu cầu người dùng mà CloudFront nhận được.
- Các log truy cập có sẵn cho cả web và RTMP distributions.
- Khi logging được bật, có thể chỉ định một S3 bucket nơi CloudFront sẽ lưu trữ các tệp log.
- CloudFront sẽ cung cấp các log truy cập cho một distribution theo định kỳ, có thể lên đến vài lần mỗi giờ.
- Thông thường, CloudFront sẽ cung cấp tệp log cho khoảng thời gian đó tới S3 bucket trong vòng một giờ kể từ khi các sự kiện xuất hiện trong log. Tuy nhiên, cần lưu ý rằng một số hoặc tất cả các mục log của một khoảng thời gian có thể bị trì hoãn lên đến 24 giờ.

# CloudFront Cost

Phí CloudFront được tính dựa trên việc sử dụng thực tế của dịch vụ trong 4 yếu tố sau:

- Chi phí truyền dữ liệu ra ngoài Internet (Data Transfer Out to Internet)
    - Phí được áp dụng cho khối lượng dữ liệu chuyển ra từ các CloudFront edge locations, tính theo GB.
    - Việc truyền dữ liệu từ nguồn AWS (ví dụ: S3, EC2, v.v.) đến CloudFront không còn bị tính phí nữa. Điều này áp dụng cho việc truyền dữ liệu từ tất cả các vùng AWS đến tất cả các global CloudFront edge locations.
- HTTP/HTTPS Requests
    - Số lượng yêu cầu HTTP/HTTPS được thực hiện cho nội dung.
- Invalidation Requests
    - Tính phí theo từng đường dẫn trong invalidation request.
    - Một đường dẫn trong invalidation request đại diện cho URL (hoặc nhiều URL nếu đường dẫn chứa ký tự wildcard) của đối tượng mà bạn muốn invalidation request khỏi bộ nhớ đệm CloudFront.
- Dedicated IP Custom SSL certificates
    - $600 mỗi tháng cho mỗi custom SSL certificate liên kết với một hoặc nhiều CloudFront distributions sử dụng Dedicated IP version của custom SSL certificate, tính theo tỷ lệ theo giờ.
