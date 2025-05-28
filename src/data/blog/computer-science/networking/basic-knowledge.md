---
author: thuongnn
pubDatetime: 2020-06-24T20:29:35Z
title: "[Computer Science] Kiến thức về networking cơ bản"
featured: false
draft: false
tags:
  - Networking
  - Computer Science
description: Tổng hợp câu hỏi và trả lời về networking cơ bản.
---
Bài viết tổng hợp câu trả lời cho các câu hỏi networking cơ bản trong computer science được fork từ repo: https://github.com/vietnakid/learning-material.git

## Table of contents

## Concept of TCP

- **How TCP open a connection? what does it need to open a connection?**

  TCP mở kết nối thông qua một quá trình gọi là **3-way handshake** (bắt tay 3 bước). Để mở kết nối, nó cần:

    - Địa chỉ IP nguồn và đích (**source**/**destination IP**).
    - Cổng nguồn và đích (**source**/**destination port**).
    - Một số trình tự ban đầu (**initial sequence number**) để theo dõi thứ tự các gói tin.
      Quá trình bắt đầu khi một bên (client) gửi yêu cầu kết nối đến bên kia (server).
- **Why there are 3 way handshakes but not 2 way?**

  **3-way handshake** (`SYN` → `SYN-ACK` → `ACK`) là cần thiết để đảm bảo cả hai bên (client và server) đều sẵn sàng và đồng bộ với nhau trước khi truyền dữ liệu.

  Nếu chỉ có 2 bước (ví dụ: `SYN` → `ACK`), sẽ thiếu sự xác nhận từ client rằng nó đã nhận được phản hồi từ server, dẫn đến khả năng một bên không biết trạng thái của bên kia. Cụ thể:

    - Bước 1 (`SYN`) - Client gửi yêu cầu kết nối.
    - Bước 2 (`SYN-ACK`) - Server xác nhận đã nhận yêu cầu và đồng ý kết nối.
    - Bước 3 (`ACK`) - Client xác nhận lại rằng nó đã nhận phản hồi từ server.

  Với 3 bước, cả hai bên đều chắc chắn rằng kết nối đã được thiết lập đúng, tránh trường hợp một bên gửi dữ liệu mà bên kia chưa sẵn sàng.

- **What is syn, ack mean?**
    - **`SYN`** (Synchronize): Là cờ trong gói tin TCP, dùng để yêu cầu bắt đầu một kết nối và đồng bộ số thứ tự (sequence number) giữa hai bên.
    - **`ACK`** (Acknowledge): Là cờ xác nhận rằng một gói tin đã được nhận thành công. Nó thường đi kèm với số thứ tự của gói tin tiếp theo mà bên nhận mong đợi.
    - Ví dụ:
        - Client gửi SYN: "Tao muốn kết nối, đây là số thứ tự ban đầu của tao."
        - Server trả SYN-ACK: "OK, tao đồng ý, đây là số thứ tự của tao, và tao xác nhận số thứ tự của mày."
        - Client trả ACK: "Tao xác nhận số thứ tự của mày, giờ bắt đầu được rồi."
- **Why they have to send 2 "random" sequence numbers? The purpose of this sequence number?**
    - **Tại sao 2 số ngẫu nhiên?**: Mỗi bên (client và server) chọn một số thứ tự ban đầu (initial sequence number - ISN) ngẫu nhiên để bắt đầu quá trình đếm gói tin. Điều này tránh xung đột nếu có kết nối cũ chưa đóng hoàn toàn (do mạng trễ hoặc lỗi), đảm bảo các gói tin thuộc về kết nối hiện tại chứ không phải kết nối trước đó.
    - **Mục đích của số thứ tự (sequence number)**:
        - Đánh dấu từng byte dữ liệu trong luồng truyền để theo dõi thứ tự.
        - Đảm bảo dữ liệu được gửi và nhận đúng thứ tự.
        - Giúp phát hiện gói tin bị mất hoặc trùng lặp.
    - Ví dụ: Nếu client gửi 100 byte bắt đầu từ số thứ tự 1000, server sẽ biết byte tiếp theo phải là 1100.
- **What if the 3rd handshake fail? How the server can detect it and what does it do in this case?**
    - **Nếu bước 3 (ACK) thất bại**: Server đã gửi SYN-ACK nhưng không nhận được ACK từ client, nghĩa là kết nối không được hoàn tất.
    - **Server phát hiện thế nào**: Server đặt một bộ đếm thời gian (timeout) sau khi gửi SYN-ACK. Nếu không nhận được ACK trong thời gian này, nó cho rằng kết nối thất bại.
    - **Server làm gì**: Server sẽ bỏ qua kết nối đó (hủy trạng thái chờ) và giải phóng tài nguyên. Client có thể thử lại bằng cách gửi SYN mới.
- **How TCP handles the connection?**
    - **Theo dõi trạng thái**: Dùng các trạng thái như **LISTEN**, **SYN_SENT**, **ESTABLISHED**, v.v., để biết kết nối đang ở giai đoạn nào.
    - **Số thứ tự và xác nhận**: Đảm bảo dữ liệu được gửi/nhận đúng thứ tự qua sequence number và ACK.
    - **Kiểm soát luồng**: Điều chỉnh tốc độ gửi dữ liệu dựa trên khả năng xử lý của bên nhận (dùng cơ chế "sliding window").
    - **Xử lý lỗi**: Phát hiện và sửa lỗi (xem câu hỏi tiếp theo).
- **What happens if some bits are wrong due to connection errors? How to detect them and fix them?**
    - **Phát hiện lỗi**: TCP dùng **checksum** (tổng kiểm tra) trong header của gói tin. Checksum được tính từ dữ liệu và so sánh ở đầu nhận. Nếu không khớp, gói tin bị coi là lỗi.
    - **Sửa lỗi**: TCP không sửa trực tiếp mà yêu cầu gửi lại gói tin bị lỗi. Bên nhận gửi ACK với số thứ tự của gói tin mong đợi tiếp theo, báo cho bên gửi biết gói nào bị mất hoặc hỏng để gửi lại.
- **How the timeout is handled? what if the timeout is expired?**
    - **Xử lý timeout**: TCP đặt thời gian chờ cho mỗi gói tin. Nếu không nhận được ACK trong thời gian này, bên gửi cho rằng gói tin bị mất và gửi lại.
    - **Nếu hết timeout**:
        - Bên gửi gửi lại gói tin với cùng số thứ tự.
        - Nếu timeout lặp lại nhiều lần, TCP có thể cho rằng kết nối bị đứt và đóng nó.
    - Thời gian timeout thường được điều chỉnh động dựa trên độ trễ mạng (RTT - Round Trip Time).
- **What will happen if some "packet" is missing on the way?**
    - **Phát hiện**: Bên nhận thấy số thứ tự của gói tin tiếp theo không liên tục (ví dụ: nhận 1000, rồi 1200 thay vì 1100).
    - **Xử lý**: Bên nhận gửi ACK với số thứ tự của gói tin bị mất (ví dụ: ACK 1100), báo cho bên gửi gửi lại gói đó. Đây là cơ chế **retransmission**.
- **How to detect the appropriate number of packets to send (speed of sending packet)?**

  TCP dùng cơ chế **congestion control** (kiểm soát tắc nghẽn) và **sliding window**:

    - **Sliding window**: Quy định số byte tối đa có thể gửi trước khi cần ACK. Cửa sổ này tăng giảm tùy theo khả năng của mạng và bên nhận.
    - **Congestion control**: Dùng các thuật toán như Slow Start, Congestion Avoidance để tăng dần tốc độ gửi, tránh làm tắc mạng. Nếu phát hiện mất gói, tốc độ giảm xuống.
- **How TCP close the connection?**

  TCP đóng kết nối bằng **4-way handshake**:

    1. Bên muốn đóng (A) gửi **`FIN`** (Finish).
    2. Bên kia (B) trả **`ACK`** để xác nhận.
    3. B gửi **`FIN`** khi sẵn sàng đóng.
    4. A trả **`ACK`** để hoàn tất.

  Sau đó, cả hai vào trạng thái **TIME_WAIT** để đảm bảo không còn gói tin lạc hậu nào.

- **What if the internet is dropped in the middle of the connection? Or in case one peer is crash?**
    - **Mạng ngắt**: Nếu không nhận được ACK trong thời gian dài (qua nhiều lần timeout), TCP cho rằng kết nối bị mất và đóng nó.
    - **Một bên crash**: Bên còn lại sẽ không nhận phản hồi (ACK hoặc FIN). Sau nhiều lần thử gửi lại không thành, bên sống sót sẽ đóng kết nối.
- **How long you can keep a TCP connection alive?**
    - Không có giới hạn cố định về thời gian tối đa một kết nối TCP có thể tồn tại, miễn là hai bên vẫn gửi/nhận dữ liệu hoặc giữ kết nối mở (dùng gói **keep-alive** nếu cần).
    - Tuy nhiên, trong thực tế, thời gian phụ thuộc vào:
        - Cấu hình hệ điều hành (timeout mặc định).
        - Ứng dụng (có thể tự đóng sau thời gian không hoạt động).
        - NAT/firewall (có thể ngắt kết nối nếu không có hoạt động).

## What are the differences between TCP and UDP? And in which case we use which?

| **Tiêu chí** | **`TCP` (Transmission Control Protocol)** | **`UDP` (User Datagram Protocol)** |
| --- | --- | --- |
| Định nghĩa | **TCP** là giao thức truyền tải đáng tin cậy, đảm bảo dữ liệu được gửi và nhận chính xác, theo đúng thứ tự. | **UDP** là giao thức truyền tải nhanh nhưng không đảm bảo dữ liệu đến đúng thứ tự hay thậm chí là đến được. |
| Kiểu kết nối | Có kết nối (connection-oriented). Trước khi gửi dữ liệu, nó thiết lập một kết nối giữa hai thiết bị (qua quá trình bắt tay 3 bước - three-way handshake). | Không có kết nối (connectionless). Dữ liệu được gửi trực tiếp mà không cần thiết lập trước. |
| Độ tin cậy | Đảm bảo độ tin cậy cao nhờ cơ chế kiểm tra lỗi, sắp xếp lại thứ tự gói tin nếu cần, và gửi lại nếu dữ liệu bị mất. | Không có cơ chế kiểm tra lỗi hay gửi lại. Nếu gói tin bị mất, nó không được khôi phục. |
| Tốc độ | Chậm hơn do phải xử lý kiểm tra lỗi và đảm bảo thứ tự. | Nhanh hơn vì không có các bước kiểm tra bổ sung. |
| Kiểm soát lỗi | Có checksum, phát hiện lỗi và gửi lại nếu cần. | Có checksum nhưng không gửi lại nếu lỗi. |
| Kiểm soát luồng | Có (flow control) để tránh quá tải. | Không có. |
| Kiểm soát tắc nghẽn | Có (congestion control) để điều chỉnh tốc độ mạng. | Không có. |
| Header size | Lớn hơn (20 bytes tối thiểu). | Nhỏ hơn (8 bytes). |
| Cách truyền dữ liệu | Truyền dữ liệu dạng luồng (stream), đảm bảo dữ liệu liên tục và không bị ngắt quãng. | Truyền dữ liệu dạng gói tin (datagram), từng gói độc lập với nhau. |
| Trường hợp sử dụng | HTTP/HTTPS, FTP, SMTP (email), SSH. | DNS, DHCP, video streaming, game online. |

## How Ping command works? What is TTL?? How does TTL will be changed??

- **How Ping command works?**
    - **Ping** là một công cụ dùng để kiểm tra kết nối mạng giữa hai thiết bị (thường là máy tính của bạn và một máy chủ). Nó gửi các gói tin nhỏ và đo thời gian phản hồi.
    - **Cách hoạt động**:
        1. Máy của bạn gửi một gói tin **ICMP Echo Request** (Internet Control Message Protocol) tới địa chỉ IP đích.
        2. Nếu thiết bị đích nhận được, nó trả lại một gói tin **ICMP Echo Reply**.
        3. Ping tính thời gian từ lúc gửi đến lúc nhận được phản hồi (thường tính bằng mili-giây, ms) và báo cáo kết quả.
    - **Kết quả ping cho biết**: thời gian phản hồi, số gói tin bị mất (nếu có), và tình trạng kết nối.
- **What is TTL?**
    - **TTL (Time To Live)**: Là một giá trị trong gói tin IP, biểu thị số lần tối đa gói tin có thể "sống" (được chuyển tiếp qua các router) trước khi bị hủy.
    - **Ý nghĩa**: Ngăn gói tin bị "lạc" mãi trong mạng nếu không tìm được đích (tránh vòng lặp vô hạn).
    - **Đơn vị**: TTL không tính bằng thời gian mà bằng số "hops" (số router mà gói tin đi qua).
    - **Mục đích**: Ngăn gói tin "lang thang" vô hạn trong mạng nếu không tìm được đích (ví dụ: do vòng lặp định tuyến).
- **How does TTL will be changed?**
    - **Ban đầu**: Khi gói tin được gửi, TTL được thiết lập một giá trị khởi đầu (thường là 32, 64, 128 hoặc 255, tùy hệ điều hành).
    - **Quá trình**:
        1. Mỗi khi gói tin đi qua một router, router giảm TTL đi **1 đơn vị**.
        2. Nếu TTL giảm xuống **0** trước khi đến đích, gói tin bị hủy và router gửi thông báo **"TTL Exceeded"** về máy gửi (thường thấy trong lỗi "Time out").
        3. Nếu gói tin đến đích mà TTL vẫn lớn hơn 0, nó được xử lý bình thường.
    - **Ví dụ**:
        - Gửi gói tin với TTL = 64.
        - Qua 3 router: TTL lần lượt là 63 → 62 → 61.
        - Nếu đích ở router thứ 4, TTL cuối cùng là 60 khi đến nơi.
- **Ứng dụng thực tế**
    - **Ping**: Giúp bạn thấy thời gian phản hồi và biết thiết bị đích có "sống" không.
    - **TTL**: Dùng để phân tích đường đi của gói tin (như trong lệnh **tracert** hoặc **traceroute**), vì mỗi lần TTL giảm cho biết gói tin đã qua bao nhiêu router.

## How HTTP works?

- **How HTTP works?**
    - **HTTP (HyperText Transfer Protocol)** là giao thức truyền dữ liệu giữa client (trình duyệt) và server.
    - **Cách hoạt động**:
        1. Client gửi **request** (yêu cầu) tới server (ví dụ: GET để lấy dữ liệu, POST để gửi data).
        2. Server xử lý và trả về **response** (dữ liệu, mã trạng thái như 200 OK, 404 Not Found).
        3. Kết nối thường đóng ngay sau khi hoàn tất (trừ khi dùng persistent connection).
- **Why did people say that HTTP is stateless? The reason they make it stateless?**
    - **Stateless nghĩa là gì?**: Mỗi request là độc lập, server không tự nhớ thông tin từ request trước đó.
    - **Lý do**:
        - **Đơn giản hóa**: Server không cần lưu trữ trạng thái, giảm tải bộ nhớ và xử lý.
        - **Mở rộng dễ dàng**: Dễ triển khai trên nhiều server (load balancing) vì không cần đồng bộ trạng thái.
    - **Hạn chế**: Client phải gửi lại toàn bộ thông tin cần thiết trong mỗi request (ví dụ: cookie, token).
- **Can we make a persistent HTTP connection? pros and cons of this way?**
    - **Có thể**: HTTP/1.1 hỗ trợ **persistent connection** (keep-alive), không đóng kết nối ngay sau 1 request.
    - **Ưu điểm**:
        - Giảm thời gian thiết lập kết nối (TCP handshake) cho nhiều request.
        - Tăng tốc độ tải trang (như tải nhiều file HTML, CSS, JS).
    - **Nhược điểm**:
        - Server phải giữ kết nối mở, tăng tải nếu có nhiều client.
        - Có thể gây nghẽn nếu không quản lý tốt.
- **Why HTTP require cookie each time we send the request?**
    - Vì HTTP stateless, server không nhớ client giữa các request. **Cookie** chứa thông tin (như ID phiên, trạng thái đăng nhập) để server nhận diện client.
    - **Cách hoạt động**: Client gửi cookie trong header của mỗi request, server dùng nó để "nhớ" ngữ cảnh.
- **Can someone use your cookie and log in your Facebook account? How to migrate this?**
    - **Có thể**: Nếu ai đó lấy được cookie (ví dụ: qua mạng không an toàn), họ có thể giả mạo bạn (gọi là **session hijacking**).
    - **Giảm thiểu**:
        - Dùng **HTTPS**: Mã hóa dữ liệu, ngăn chặn nghe lén.
        - Cookie với thuộc tính **HttpOnly** và **Secure**: Không cho truy cập qua JavaScript và chỉ gửi qua HTTPS.
        - Thời hạn cookie ngắn và dùng **token** thay vì chỉ dựa vào cookie.
- **What is HTTP session? How does authentication work in HTTP?**
    - **HTTP session**: Là cách theo dõi trạng thái giữa client và server (dù HTTP stateless), thường dùng cookie chứa **session ID**.
    - **Xác thực**:
        1. Client gửi thông tin đăng nhập (username/password).
        2. Server kiểm tra, tạo session ID, gửi lại trong cookie.
        3. Client gửi session ID trong mỗi request để chứng minh danh tính.
    - **Ví dụ**: Đăng nhập website, session giữ bạn "đăng nhập" đến khi hết hạn.
- **What is JWT?**
    - **JWT (JSON Web Token)**: Là token mã hóa chứa thông tin (header, payload, signature) để xác thực.
    - **Cách hoạt động**:
        1. Server tạo JWT sau khi đăng nhập, gửi cho client.
        2. Client gửi JWT trong header (thường là Authorization: Bearer <token>) mỗi request.
        3. Server kiểm tra chữ ký để xác nhận token hợp lệ.
    - **Ưu điểm**: Không cần lưu session trên server, dễ mở rộng.
- **Which type of "data" HTTP can help us to get or push?**
    - HTTP truyền được hầu hết mọi loại dữ liệu:
        - **Binary file**: File nhị phân (zip, exe).
        - **Image**: JPG, PNG, GIF.
        - **Text file**: TXT, JSON, XML.
        - **Video file**: MP4, AVI.
        - **Music file**: MP3, WAV.
    - **Cách truyền**: Dùng header Content-Type để chỉ định loại dữ liệu (ví dụ: image/png, application/json).
- **REST/RESTful?**
    - **REST (Representational State Transfer)**: Là phong cách thiết kế API dùng HTTP để giao tiếp.
    - **Đặc điểm RESTful**:
        - Dùng các phương thức HTTP: GET (lấy), POST (gửi), PUT (cập nhật), DELETE (xóa).
        - Tài nguyên định danh qua URL (ví dụ: /users/123).
        - Stateless: Mỗi request chứa đủ thông tin cần thiết.
    - **Ví dụ**: API lấy danh sách user: GET /api/users.
- **AJAX technique?**
    - **AJAX (Asynchronous JavaScript and XML)**: Là cách gửi request HTTP từ trình duyệt mà không cần tải lại trang.
    - **Cách hoạt động**:
        1. JavaScript gửi request (thường dùng fetch hoặc XMLHttpRequest).
        2. Server trả về dữ liệu (JSON, XML).
        3. Trang web cập nhật động (ví dụ: tải thêm bài viết mà không refresh).
    - **Ứng dụng**: Tăng trải nghiệm người dùng (như chat, autocomplete).
- **How HTTPs work?**
    - **HTTPS**: HTTP + SSL/TLS (mã hóa).
    - **Cách hoạt động**:
        1. Client và server thiết lập kết nối an toàn qua **TLS handshake**.
        2. Dữ liệu được mã hóa trước khi gửi, chỉ bên nhận mới giải mã được.
    - **Mục đích**: Bảo mật, ngăn nghe lén, giả mạo.
- **Learn about some useful headers**
    - **Request Headers**:
        - User-Agent: Thông tin trình duyệt/OS.
        - Authorization: Token/xác thực (ví dụ: Bearer JWT).
        - Content-Type: Loại dữ liệu gửi (ví dụ: application/json).
    - **Response Headers**:
        - Content-Type: Loại dữ liệu trả về.
        - Set-Cookie: Gửi cookie cho client.
        - Cache-Control: Điều khiển bộ đệm (ví dụ: no-cache).

## When you type "google.com" into your browser, that will happen when you type enter till everything is displayed on your screen?

Thường sẽ có các bước chính sau đây:

1. **DNS Lookup**: Trình duyệt tìm địa chỉ IP của "google.com".
2. **Thiết lập kết nối**: Trình duyệt dùng IP để kết nối tới server qua TCP (hoặc UDP).
3. **Gửi HTTP/HTTPS Request**: Yêu cầu nội dung từ server.
4. **Nhận Response**: Server trả về HTML, sau đó tải thêm tài nguyên như JS, hình ảnh.
5. **Hiển thị**: Trình duyệt render nội dung lên màn hình.

---

- **DNS Lookup**
    - **Trường hợp đã truy cập google.com trước**:
        - Trình duyệt kiểm tra **browser cache** xem có IP của "google.com" chưa. Nếu có, dùng ngay IP đó.
        - Nếu không, kiểm tra **hệ điều hành cache** (ví dụ: Windows DNS cache).
        - Nếu vẫn không có, gửi yêu cầu DNS đến resolver (thường là DNS server của ISP hoặc công cộng như `8.8.8.8`).
    - **Trường hợp không biết IP**:
        - Trình duyệt gửi yêu cầu DNS qua hệ thống phân giải tên miền (DNS resolution):
            1. **Local Resolver:** Hỏi DNS server cục bộ (thường do ISP cung cấp).
            2. **Root Server:** Nếu resolver không biết, nó hỏi root DNS server để tìm TLD (Top-Level Domain) ".com".
            3. **TLD Server:** Root server trả về địa chỉ của server quản lý ".com".
            4. **Authoritative Server:** TLD server chỉ đến server DNS của "google.com".
            5. **IP Returned:** Server DNS của Google trả về địa chỉ IP (ví dụ: `142.250.190.14`).
- **Which protocol DNS use and why?**
    - DNS chủ yếu dùng **UDP** (port 53) vì:
        - **Tốc độ nhanh:** UDP không cần thiết lập kết nối (connectionless), phù hợp với yêu cầu nhỏ và nhanh như tra cứu DNS.
        - **Hiệu quả:** Gói tin DNS thường nhỏ (< 512 bytes), không cần cơ chế phức tạp của TCP.
    - Tuy nhiên, DNS cũng có thể dùng **TCP** trong trường hợp:
        - Gói tin lớn (DNS qua TCP khi trả về bản ghi lớn, như DNSSEC).
        - Cần độ tin cậy cao hơn (TCP đảm bảo dữ liệu không mất mát).
- **The other of place to look up DNS**
    - **Local Cache**: Trình duyệt hoặc OS (Windows, macOS).
    - **Router Cache**: Router gia đình lưu IP từ lần truy cập trước.
    - **ISP DNS Server**: Nhà cung cấp dịch vụ Internet thường lưu cache DNS.
    - **Public DNS**: Google (`8.8.8.8`), Cloudflare (`1.1.1.1`).
- **TCP or UDP will be used in this case? why?**
    - Sau khi có IP từ DNS:
        - **TCP** được dùng để kết nối với server "google.com".
        - Lý do: HTTP/HTTPS yêu cầu độ tin cậy cao (dữ liệu phải đến đúng thứ tự, không mất mát), mà TCP cung cấp qua 3-way handshake, kiểm soát lỗi, và tái truyền.
    - UDP không được dùng ở đây vì nó không đảm bảo thứ tự hay độ tin cậy, không phù hợp với giao thức web.
- **How to know "[google.com](http://google.com/)" require HTTP or https? how browser can know and redirect from HTTP to HTTPs?**
    - **Ban đầu:** Nếu bạn nhập "google.com", trình duyệt mặc định thử **HTTPS** (cổng 443) vì hầu hết website lớn hiện nay dùng HTTPS.
    - **HSTS (HTTP Strict Transport Security):**
        - Google gửi header HSTS trong lần truy cập trước, yêu cầu trình duyệt luôn dùng HTTPS cho "google.com".
        - Trình duyệt lưu danh sách HSTS, tự động chuyển sang HTTPS mà không thử HTTP.
    - **Redirect**:
        - Nếu thử HTTP (cổng 80), server Google trả về mã trạng thái **301 Moved Permanently** hoặc **307 Temporary Redirect** với URL HTTPS ([https://google.com](https://google.com/)).
        - Trình duyệt theo URL mới và gửi lại yêu cầu qua HTTPS.
- **After you get the `HTML content` for "google.com" how to get the `*.js` and `image` files?**
    - Trình duyệt phân tích HTML:
        - Tìm các thẻ như `<script src="example.js">`, `<img src="image.jpg">`, hoặc `<link rel="stylesheet" href="style.css">`.
    - Gửi yêu cầu HTTP/HTTPS riêng cho từng tài nguyên (JS, ảnh, CSS) dựa trên URL trong thẻ.
    - Server trả về nội dung tương ứng (file JS, ảnh, v.v.).
- **When getting `*.js` or `image` files do why use another `TCP connection` or use the same one as in the get `HTML content`? How DNS lookup work in this case*?***
    - **TCP Connection:**
        - **HTTP/1.1:** Có thể dùng lại kết nối TCP ban đầu (Keep-Alive) để tải JS, ảnh, tiết kiệm thời gian thiết lập.
        - **HTTP/2 hoặc HTTP/3:** Dùng một kết nối TCP (hoặc UDP với HTTP/3) để tải đồng thời nhiều tài nguyên qua multiplexing.
        - Nếu tài nguyên nằm trên domain khác (ví dụ: "static.google.com"), cần TCP connection mới.
    - **DNS Lookup:**
        - Nếu tài nguyên trên cùng "google.com", không cần DNS lookup lại (đã có IP).
        - Nếu trên domain khác (ví dụ: "cdn.google.com"), trình duyệt thực hiện DNS lookup riêng cho domain đó.
- **After your browser display "[google.com](http://google.com/)" fully, is there any connection open?**
    - Nếu dùng **Keep-Alive** (HTTP/1.1) hoặc HTTP/2:
        - Kết nối TCP vẫn mở trong một khoảng thời gian (timeout, thường vài giây đến vài phút) để tái sử dụng nếu mày tải thêm nội dung.
    - Nếu không có Keep-Alive hoặc server đóng kết nối:
        - Kết nối TCP đóng sau khi tải hết (4-way handshake: FIN → ACK).
- **Caching can apply to which steps? How caching applied?**
    - **DNS Lookup:**
        - **Áp dụng:** Browser, OS, router, hoặc ISP cache IP của "google.com".
        - **Cách hoạt động:** Lưu cặp domain-IP với thời gian sống (TTL) từ DNS response, tránh lookup lại.
    - **HTML/JS/CSS/Images:**
        - **Áp dụng:** Browser cache nội dung dựa trên header HTTP như `Cache-Control`, `Expires`, hoặc `ETag`.
        - **Cách hoạt động:** Nếu tài nguyên còn trong cache và chưa hết hạn, trình duyệt dùng bản local thay vì tải lại.
    - **HSTS**:
        - **Áp dụng:** Cache chính sách HTTPS trong browser.
        - **Cách hoạt động:** Trình duyệt nhớ dùng HTTPS mà không thử HTTP.

## What is the connection pool?

- **Connection Pool** là một tập hợp các kết nối (thường là tới cơ sở dữ liệu, server, hoặc dịch vụ khác) được tạo sẵn, duy trì và tái sử dụng thay vì mở/m đóng kết nối mới mỗi lần cần.
- **Ý tưởng**: Thay vì mỗi yêu cầu mạng tạo một kết nối mới (tốn thời gian và tài nguyên), chương trình lấy kết nối từ "hồ chứa" (pool), dùng xong thì trả lại.
- Ưu điểm của Connection Pool
    - **Hiệu suất cao:**
        - Giảm thời gian thiết lập kết nối (như TCP handshake hoặc xác thực database).
        - Tái sử dụng kết nối tiết kiệm tài nguyên CPU và bộ nhớ.
    - **Quản lý tài nguyên** - giới hạn số kết nối tối đa, tránh quá tải server/database
    - **Tăng khả năng mở rộng** - hỗ trợ nhiều yêu cầu đồng thời mà không cần tạo kết nối mới mỗi lần
    - **Ổn định** - tránh tình trạng "connection leak" (quên đóng kết nối) nếu được quản lý tốt.
- Nhược điểm của Connection Pool
    - **Tốn tài nguyên ban đầu** - cần khởi tạo và duy trì một số kết nối ngay cả khi không dùng.
    - **Quản lý phức tạp** - phải xử lý timeout, kết nối "chết", hoặc hết kết nối trong pool.
    - **Rủi ro nghẽn** - nếu pool quá nhỏ và tất cả kết nối bị chiếm dụng, các yêu cầu mới phải đợi.
    - **Cấu hình khó tối ưu** - số lượng kết nối tối đa/thiểu, thời gian chờ... cần điều chỉnh phù hợp với ứng dụng

### How to implement connection pool in your programing language?

**Đối với Java**

1. Nếu dùng Maven, thêm vào pom.xml

    ```xml
    <dependency>
        <groupId>com.zaxxer</groupId>
        <artifactId>HikariCP</artifactId>
        <version>5.0.1</version>
    </dependency>
    ```

2. Cấu hình Connection Pool

    ```java
    import com.zaxxer.hikari.HikariConfig;
    import com.zaxxer.hikari.HikariDataSource;
    import java.sql.Connection;
    import java.sql.SQLException;
    
    public class DatabaseConnectionPool {
        private static HikariDataSource dataSource;
    
        static {
            // Cấu hình pool
            HikariConfig config = new HikariConfig();
            config.setJdbcUrl("jdbc:mysql://localhost:3306/your_database"); // URL database
            config.setUsername("your_username");
            config.setPassword("your_password");
            config.setMaximumPoolSize(10); // Số kết nối tối đa
            config.setMinimumIdle(5);      // Số kết nối tối thiểu khi không hoạt động
            config.setIdleTimeout(30000);  // Thời gian chờ trước khi đóng kết nối nhàn rỗi (ms)
            
            // Khởi tạo pool
            dataSource = new HikariDataSource(config);
        }
    
        // Lấy kết nối từ pool
        public static Connection getConnection() throws SQLException {
            return dataSource.getConnection();
        }
    
        // Đóng pool (khi ứng dụng tắt)
        public static void closePool() {
            if (dataSource != null && !dataSource.isClosed()) {
                dataSource.close();
            }
        }
    }
    ```

3. Sử dụng trong chương trình

    ```java
    import java.sql.Connection;
    import java.sql.PreparedStatement;
    import java.sql.ResultSet;
    
    public class Main {
        public static void main(String[] args) {
            try (Connection conn = DatabaseConnectionPool.getConnection()) {
                PreparedStatement stmt = conn.prepareStatement("SELECT * FROM users");
                ResultSet rs = stmt.executeQuery();
                while (rs.next()) {
                    System.out.println("User: " + rs.getString("name"));
                }
            } catch (SQLException e) {
                e.printStackTrace();
            } finally {
                DatabaseConnectionPool.closePool(); // Đóng pool khi xong
            }
        }
    }
    ```


**Đối với ngôn ngữ khác**

- **Python**: Dùng thư viện như `sqlalchemy` với `pool_size` :

    ```python
    from sqlalchemy import create_engine
    engine = create_engine("mysql+pymysql://user:pass@localhost/db", pool_size=5, max_overflow=10)
    ```

- **Node.js**: Dùng `mysql2` với pool:

    ```jsx
    const mysql = require('mysql2');
    const pool = mysql.createPool({
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'mydb',
        connectionLimit: 10
    });
    pool.query("SELECT * FROM users", (err, results) => { console.log(results); });
    ```

- **Golang** dùng gói `database/sql` để quản lý pool tự động. Dưới đây là ví dụ kết nối tới MySQL:

    ```go
    package main
    
    import (
        "database/sql"
        _ "github.com/go-sql-driver/mysql" // Driver MySQL
        "log"
    )
    
    func main() {
        // Khởi tạo connection pool
        db, err := sql.Open("mysql", "user:password@tcp(127.0.0.1:3306)/your_database")
        if err != nil {
            log.Fatal("Error opening database:", err)
        }
        defer db.Close() // Đóng pool khi chương trình kết thúc
    
        // Cấu hình pool
        db.SetMaxOpenConns(10)      // Số kết nối tối đa
        db.SetMaxIdleConns(5)       // Số kết nối nhàn rỗi tối đa
        db.SetConnMaxLifetime(30e9) // Thời gian sống tối đa của mỗi kết nối (30 giây, tính bằng nanosecond)
    
        // Kiểm tra kết nối
        err = db.Ping()
        if err != nil {
            log.Fatal("Error pinging database:", err)
        }
        log.Println("Connected to database!")
    
        // Sử dụng kết nối từ pool
        rows, err := db.Query("SELECT id, name FROM users")
        if err != nil {
            log.Fatal("Error querying:", err)
        }
        defer rows.Close()
    
        // Duyệt kết quả
        for rows.Next() {
            var id int
            var name string
            if err := rows.Scan(&id, &name); err != nil {
                log.Fatal("Error scanning:", err)
            }
            log.Printf("ID: %d, Name: %s\n", id, name)
        }
    }
    ```


## What is socket?

- **Socket** là một điểm cuối (endpoint) để giao tiếp hai chiều giữa hai chương trình qua mạng (hoặc trong cùng một máy). Nó giống như một `port` để gửi/nhận dữ liệu.
- Trong lập trình, socket là giao diện trừu tượng giữa ứng dụng và tầng mạng (TCP/IP, UDP).

---

- **Why socket is a "file" in linux?**
    - **Why do we need socket?**
        - Socket cho phép giao tiếp mạng (network communication) giữa client và server, hoặc giữa các tiến trình (inter-process communication - IPC).
        - Nó trừu tượng hóa các chi tiết giao thức (như TCP, UDP) để lập trình viên dễ dàng gửi/nhận dữ liệu mà không cần xử lý tầng thấp (như IP header).
    - **Why socket is a "file" in Linux?**
        - Trong Linux (và các hệ thống Unix), mọi thứ được biểu diễn như một "file" (philosophy "`everything is a file`"). Socket là một loại file đặc biệt (socket file descriptor) trong hệ thống file.
        - Điều này cho phép dùng các hàm I/O chung như `read()`, `write()`, `close()` để thao tác với socket, tương tự file thông thường.
        - Khi tạo socket bằng `socket()` trong C, nó trả về một file descriptor (số nguyên), được kernel quản lý giống như file.
- **What is `src port` when you create a connection to a "server"?**
    - **Src port (Source Port)**: Là cổng nguồn, được hệ điều hành client gán ngẫu nhiên (ephemeral port) khi khởi tạo kết nối tới server.
    - Cách hoạt động:
        - Khi client (ví dụ: trình duyệt) mở kết nối TCP đến server (như "[google.com:80](http://google.com/)"), hệ điều hành chọn một cổng nguồn tạm thời (ephemeral port) từ dải cổng cao (thường 1024-65535).
        - Cặp `(src IP, src port, dest IP, dest port)` tạo thành một định danh duy nhất cho kết nối (TCP tuple).
    - Ví dụ: Trình duyệt kết nối đến [google.com:443](http://google.com:443/), hệ điều hành có thể gán `src port = 54321`. Kết nối sẽ là `(client_IP:54321, google_IP:443)`.
- **What one server can handle multiple connections to the same port?**
    - Server dùng **multiplexing** để xử lý nhiều kết nối trên cùng một cổng:
        - Khi client kết nối đến server (ví dụ: port 80), server chấp nhận kết nối qua socket lắng nghe (listening socket) và tạo một socket mới (connected socket) cho mỗi client.
        - Mỗi kết nối được phân biệt bằng **tuple** `(src IP, src port, dest IP, dest port)`, nên dù cùng `dest port` (port 80), các kết nối vẫn khác nhau do `src IP` hoặc `src port` khác.
    - Công cụ:
        - **select(), poll(), epoll()** (trong Linux) hoặc **I/O completion ports** (Windows) để quản lý nhiều socket cùng lúc.
        - **Multithreading** hoặc **goroutines** (Go) để xử lý từng kết nối riêng biệt.
    - **Ví dụ**: 100 client kết nối tới port 80, server phân biệt nhờ src port khác nhau từ mỗi client.
- **What is the maximum number of connections a server can handle? (if it has unlimited resource) (in case of the same client and in case of multiple clients)**
    - Trường hợp lý thuyết (vô hạn tài nguyên):
        - Một server lắng nghe trên 1 port (ví dụ: 80) có thể xử lý tối đa **$2^{32}$ (src IP) × $2^{16}$ (src port)** = $2^{48}$ **kết nối** (khoảng 281 nghìn tỷ), vì:
            - src IP: 32 bit (IPv4).
            - src port: 16 bit (0-65535).
        - Tuy nhiên, thực tế bị giới hạn bởi tài nguyên (CPU, RAM, hệ điều hành) và số file descriptor tối đa (thường 1024 hoặc cấu hình cao hơn).
    - **Same client:**
        - Từ 1 client (1 src IP), tối đa là **65,535 kết nối** (do src port từ 0-65535). Thực tế thấp hơn vì hệ điều hành dành một số cổng cho mục đích khác.
    - **Multiple clients**:
        - Với nhiều client, giới hạn tăng lên, nhưng vẫn phụ thuộc vào cấu hình server (số socket mở, băng thông)
- **When you open multiple tabs on your chrome, how OS knows which packet (both sending and receiving) correspond to which tab? (how about in case you open many tabs to the same page "for eg: google.com")**
    - **Cách OS phân biệt:**
        - Mỗi tab trong Chrome tạo một kết nối TCP riêng, với **src port** khác nhau (dù cùng **src IP** và **dest IP/port**).
        - OS dùng tuple `(src IP, src port, dest IP, dest port)` để ánh xạ gói tin đến socket tương ứng.
        - Chrome quản lý socket trong tiến trình của nó và gắn kết quả với tab cụ thể.
    - **Trường hợp nhiều tab tới [google.com](http://google.com/):**
        - Các kết nối vẫn khác nhau do `src port` ngẫu nhiên. Ví dụ: `(client_IP:54321, google_IP:443)` và `(client_IP:54322, google_IP:443)`.
        - OS không quan tâm tab, chỉ chuyển gói tin đến socket, còn Chrome xử lý nội bộ để hiển thị đúng tab.
- **What are the maximum numbers of connection your machine can connect to "google.com" (if you have unlimited resource)**
    - Từ 1 máy (1 src IP) đến "[google.com](http://google.com/)" (1 dest IP, port 443):
        - Tối đa là **65,535 kết nối**, vì giới hạn bởi số cổng nguồn (ephemeral ports) từ 0-65535.
    - Thực tế:
        - Hệ điều hành giới hạn số file descriptor (thường 1024, có thể tăng bằng `ulimit`).
        - Chrome cũng có giới hạn nội bộ (thường 6 kết nối đồng thời đến cùng domain với HTTP/1.1).
- **Can two processes listen to the same port on your machine? Why? How?**
    - **Không thể (mặc định):**
        - Trong TCP/UDP, chỉ một tiến trình được phép bind (lắng nghe) trên một cổng cụ thể của một địa chỉ IP, vì kernel không biết chuyển gói tin đến đâu nếu có xung đột.
        - Lỗi: `Address already in use`.
    - **Ngoại lệ (có thể):**
        - Dùng tùy chọn `SO_REUSEADDR` hoặc `SO_REUSEPORT` (trong Linux).
            - `SO_REUSEADDR`: Cho phép tái sử dụng cổng nếu kết nối cũ đang ở trạng thái `TIME_WAIT`.
            - `SO_REUSEPORT`: (Linux 3.9+) Cho phép nhiều tiến trình bind cùng port, kernel phân phối gói tin (dùng cho load balancing).
        - Code **Golang** ví dụ:

            ```go
            ln, err := net.Listen("tcp", ":8080")
            ln.(*net.TCPListener).SetReusePort(true)
            ```

    - **Ứng dụng:** Web server như Nginx dùng `SO_REUSEPORT` để nhiều worker lắng nghe cùng port.
- **What is `buffer`? why we always need buffer when working with "file"?**
    - **Buffer**: Là vùng bộ nhớ tạm để lưu dữ liệu trước khi ghi/đọc từ file hoặc socket.
    - Tại sao cần?:
        - **Hiệu suất**: Đọc/ghi trực tiếp từng byte vào file/socket rất chậm. Buffer gom dữ liệu thành khối lớn, giảm số lần gọi hệ thống (system call).
        - **Đồng bộ**: Socket/file hoạt động bất đồng bộ, buffer giúp điều hòa tốc độ giữa sender/receiver.
        - **Giảm tải:** Tránh truy cập phần cứng (đĩa, mạng) liên tục.
        - Ví dụ: Đọc 1MB từ file mà không buffer sẽ chậm hơn đọc vào buffer rồi xử lý.
- **What is `unix socket`? When to use it?**
    - Unix Socket (Unix Domain Socket):
        - Unix socket (hoặc Unix domain socket) là cơ chế giao tiếp giữa các tiến trình (IPC) trên cùng một máy, không qua mạng.
        - Nó dùng file trong hệ thống file (ví dụ: `/tmp/mysocket.sock`) làm điểm kết nối thay vì IP/port.
    - Khi nào dùng?
        - **IPC cục bộ:** Khi hai tiến trình trên cùng máy cần giao tiếp nhanh (ví dụ: Nginx và PHP-FPM).
        - **Hiệu suất:** Nhanh hơn TCP vì không qua tầng mạng (network stack).
        - **Bảo mật:** Chỉ hoạt động trong máy, không tiếp xúc mạng bên ngoài.
        - Ví dụ: Giao tiếp giữa server Nginx và ứng dụng backend.
    - Ưu điểm
        - Nhanh hơn TCP (không qua stack mạng).
        - Bảo mật hơn (chỉ trong máy).
    - Code **Golang** ví dụ:

        ```go
        ln, err := net.Listen("unix", "/tmp/mysocket")
        conn, err := ln.Accept()
        ```


## What is TCP proxy? reverse proxy? and VPN?

- **TCP Proxy**:
    - Là một máy trung gian chuyển tiếp dữ liệu TCP giữa client và server.
    - Hoạt động ở tầng giao vận (layer 4), không quan tâm nội dung dữ liệu.
    - Ví dụ: Chuyển gói tin từ client tới server qua port cụ thể.
- **Reverse Proxy**:
    - Là proxy đứng trước server, nhận request từ client và chuyển đến server phù hợp.
    - Hoạt động ở tầng ứng dụng (layer 7), có thể phân tích HTTP (header, URL).
    - Ví dụ: Nginx nhận request và gửi tới backend server.
- **VPN (Virtual Private Network)**:
    - Tạo đường hầm mã hóa giữa client và server qua mạng công cộng (Internet).
    - Giả lập mạng riêng, dùng để bảo mật và truy cập tài nguyên nội bộ.
    - Ví dụ: OpenVPN mã hóa dữ liệu từ máy bạn tới server công ty.

---

- **How your router at your home works?**
    - **Router** là thiết bị kết nối mạng nội bộ (LAN - Local Area Network) của mày với mạng bên ngoài (WAN - Wide Area Network, như Internet).
    - **Cách hoạt động cơ bản**:
        1. **Kết nối WAN**: Router nhận IP công cộng (public IP) từ ISP (nhà cung cấp Internet) qua modem (thường dùng DHCP hoặc PPPoE).
        2. **Tạo LAN**: Router tạo mạng nội bộ (LAN) bằng cách gán IP riêng (private IP) cho các thiết bị trong nhà (như `192.168.1.x`) qua DHCP.
        3. **Chuyển tiếp gói tin**:
            - Router dùng **NAT (Network Address Translation)** để chuyển gói tin từ LAN ra WAN và ngược lại.
            - Khi mày gửi yêu cầu (ví dụ: vào "google.com"), router thay đổi địa chỉ nguồn (src IP) thành public IP của nó, rồi gửi đi.
            - Khi nhận phản hồi, router chuyển gói tin về đúng thiết bị trong LAN dựa trên bảng NAT.
        4. **Định tuyến**: Router đọc header IP của gói tin (src IP, dst IP) để quyết định gửi gói tin đi đâu (LAN hay WAN).
    - **Ví dụ**:
        - Máy tính (`192.168.1.100`) gửi yêu cầu đến Google (`142.250.190.14`).
        - Router thay src IP thành public IP (ví dụ: `203.0.113.1`), gửi đi.
        - Google trả lời về `203.0.113.1`, router dùng NAT để gửi lại cho `192.168.1.100`.
- **Inside LAN network, it uses IP or MAC address? Why?**
    - Trong LAN: Router (và các thiết bị khác) dùng **cả IP và MAC address**, nhưng ở các tầng khác nhau:
        - **MAC address:** Dùng ở tầng liên kết dữ liệu (Data Link Layer - Layer 2).
        - **IP address:** Dùng ở tầng mạng (Network Layer - Layer 3).
    - **Tại sao dùng cả hai?**
        - **MAC address**:
            - Là địa chỉ phần cứng duy nhất của thiết bị (như card mạng), dùng để giao tiếp trực tiếp trong cùng mạng LAN.
            - Khi gửi gói tin trong LAN, giao thức **ARP (Address Resolution Protocol)** ánh xạ IP sang MAC để tìm đúng thiết bị.
            - Ví dụ: Máy A (`192.168.1.100`) muốn gửi gói tin đến Máy B (`192.168.1.101`), nó dùng ARP để lấy MAC của Máy B và gửi qua switch.
        - **IP address**:
            - Dùng để định tuyến gói tin giữa các mạng khác nhau (LAN → WAN).
            - Router cần IP để biết gói tin đi ra ngoài (WAN) hay ở lại trong LAN.
    - Tóm lại trong LAN: **MAC** để gửi gói tin giữa các thiết bị qua switch, **IP** để router quyết định có chuyển ra ngoài không.
- **How does it know which packet comes from (or arrive at) which machine?**
    - Gửi từ máy trong LAN ra ngoài - Router dùng **NAT table**:
        - Khi máy (`192.168.1.100:54321`) gửi gói tin ra Google (`142.250.190.14:443`), router thay src IP thành public IP (`203.0.113.1`) và ghi lại trong bảng NAT.

            ```
            Private IP:Port       Public IP:Port       Dest IP:Port
            192.168.1.100:54321   203.0.113.1:54321    142.250.190.14:443
            ```

        - Router giữ thông tin này để biết gói tin thuộc về máy nào.
    - Nhận từ ngoài vào LAN:
        - Khi Google trả lời (dst IP: `203.0.113.1:54321`), router tra bảng NAT:
            - Thấy `203.0.113.1:54321` ánh xạ về `192.168.1.100:54321`.
            - Router thay dst IP thành `192.168.1.100` và gửi gói tin vào LAN.
        - Trong LAN, switch dùng MAC address để chuyển gói tin đến đúng máy.
    - **Kết luận:** Router dựa vào bảng NAT (IP/port mapping) để biết gói tin thuộc về máy nào.
- **What is the difference between Hub and Switch inside LAN?**


    | Tiêu chí | Hub | Switch |
    | --- | --- | --- |
    | Tầng hoạt động | Layer 1 (Physical) | Layer 2 (Data Link) |
    | Cách xử lý | Phát tất cả gói tin đến mọi cổng | Chuyển gói tin đến đúng cổng (MAC) |
    | Hiệu suất | Thấp, dễ tắc nghẽn (collision) | Cao, không collision |
    | Thông minh | Không, chỉ khuếch đại tín hiệu | Có, lưu bảng MAC để định tuyến |
    | Ví dụ | Cũ, hiếm dùng | Phổ biến trong LAN hiện đại |
    - **Hub**: Như "ổ cắm điện", nhận gói tin từ một máy rồi gửi đồng thời đến tất cả máy khác → lãng phí băng thông, dễ xung đột.
    - **Switch**: "Thông minh", học địa chỉ MAC của từng cổng (MAC table), chỉ gửi gói tin đến đúng đích → hiệu quả hơn.
- **How `src IP/PORT` and `dst IP/PORT` change on the way to the server?**
    - Trong LAN → Router:
        - Src IP: IP cục bộ (`192.168.1.x`).
        - Src Port: Port ngẫu nhiên của client.
        - Dst IP: IP server (`142.250.190.78`).
        - Dst Port: Port server (80/443).
    - Router → Server (qua NAT):
        - Src IP: IP công cộng của router.
        - Src Port: Port tạm (do NAT gán).
        - Dst IP/Port: Không đổi.
    - **Trở về**: Router dùng bảng NAT để ánh xạ lại IP/Port về máy trong LAN.
- **How `load-balancer` works?**
    - **Load Balancer**:
        - Phân phối request từ client tới nhiều server backend.
        - Ngược với router (chuyển gói tin ra ngoài), load balancer gom traffic vào và phân phối.
    - **Cách hoạt động**:
        1. Nhận request từ client (qua IP công cộng của load balancer).
        2. Chọn server backend dựa trên thuật toán (round-robin, least connections, IP hash).
        3. Chuyển tiếp request tới server được chọn.
- **When we send a packet to a `load-balancer` how does it forward to the desired server?**
    - **Cách chuyển tiếp** - Load balancer có hai cách chính để chuyển gói tin:
        1. NAT (Network Address Translation)
            - LB thay đổi **dst IP** của gói tin từ VIP (IP của LB) thành IP của server backend.
            - Ví dụ:
                - Client gửi: `src: 192.168.1.100:54321`, `dst: 142.250.190.14:80`.
                - LB thay đổi: `dst: 10.0.0.1:80` (IP backend).
            - LB lưu ánh xạ trong bảng NAT để biết cách gửi phản hồi về client.
        2. Proxy (Application Layer)
            - LB đóng vai trò trung gian, nhận toàn bộ yêu cầu, rồi tạo kết nối mới đến server backend.
            - LB đọc nội dung (như HTTP header) để chọn server (content-based routing).
            - Ví dụ: LB thấy header `Host: [api.example.com](http://api.example.com/)` → gửi đến server API.
    - **Có giữ dữ liệu trong bộ nhớ không?**
        - **Có**, LB cần lưu một số thông tin trong RAM:
            - **Bảng NAT:** Nếu dùng NAT, LB lưu ánh xạ giữa client (`src IP:port`) và server backend (`dst IP:port`).
            - **Session state:** Để duy trì "stickiness" (gửi yêu cầu từ cùng client đến cùng server), LB lưu session ID hoặc cookie.
            - **Danh sách backend:** LB giữ danh sách server (IP, trạng thái hoạt động) và thống kê (số kết nối, tải).
        - Thông tin này thường nhỏ (vài KB mỗi kết nối), nhưng với hàng triệu kết nối, RAM có thể tăng đáng kể.
- **When the server wants to send data back to the client, does the connection need to go through the `load-balancer`?**
    - Tuỳ theo cấu hình:
        - Qua load balancer (Symmetric):
            - Server gửi phản hồi về LB (src: backend IP, dst: VIP).
            - LB thay đổi src IP thành VIP, rồi gửi về client.
            - Cách này phổ biến với NAT hoặc proxy, đảm bảo client chỉ thấy VIP.
            - Ví dụ:
                - Backend gửi: src: `10.0.0.1:80`, `dst: 192.168.1.100:54321`.
                - LB thay đổi: src: `142.250.190.14:80`, `dst: 192.168.1.100:54321`.
        - Trực tiếp đến client (Direct Server Return - DSR):
            - Server gửi thẳng phản hồi về client, bỏ qua LB.
            - LB chỉ xử lý chiều đi (client → server), còn chiều về (server → client) đi thẳng.
            - Cần cấu hình đặc biệt (backend phải biết VIP và giả lập nó).
            - Ưu điểm: Giảm tải cho LB, nhưng phức tạp hơn.
    - **Thường gặp:** Phản hồi đi qua LB để đơn giản hóa quản lý và giữ tính nhất quán
- **What is different between `reverse proxy` and `load-balancer`?**


    | Tiêu chí | **Reverse Proxy** | **Load Balancer** |
    | --- | --- | --- |
    | Mục đích chính | Chuyển tiếp yêu cầu đến backend | Phân phối yêu cầu đến nhiều server |
    | Tầng hoạt động | Thường Layer 7 (Application - HTTP) | Layer 4 (Transport - TCP) hoặc Layer 7 |
    | Logic | Dựa trên nội dung (URL, header) | Dựa trên thuật toán (round-robin, v.v.) |
    | Chức năng bổ sung | Cache, SSL termination, nén dữ liệu | Chỉ tập trung phân phối tải |
    | Ví dụ | Nginx làm reverse proxy | HAProxy, AWS ELB làm load balancer |
    - **Reverse Proxy**:
        - Tập trung vào tầng ứng dụng (layer 7), xử lý HTTP (caching, SSL termination).
        - Có thể làm load balancing, nhưng không phải chức năng chính.
    - **Load Balancer**:
        - Tập trung phân phối tải, có thể hoạt động ở Layer 4 (TCP) hoặc Layer 7 (HTTP).
        - Không nhất thiết làm proxy, có thể chỉ dùng NAT.
    - **Giống nhau:** Cả hai đều đứng trước backend, che giấu server thật từ client.
- **Can `load-balancer` be a bottleneck? (Because it is the end-point of too many requests) (bottleneck about RAM or CPU or Network?)**
    - **Có, LB có thể là bottleneck** - Vì LB là điểm tập trung lưu lượng (single point of entry), nếu không đủ tài nguyên, nó sẽ giới hạn hiệu suất hệ thống.
    - **Các loại bottleneck**:
        - `RAM`
            - LB lưu bảng NAT, session state, danh sách backend → với hàng triệu kết nối, RAM có thể cạn kiệt.
            - Ví dụ: 1 triệu kết nối, mỗi kết nối 1KB → cần 1GB RAM chỉ cho bảng NAT.
        - `CPU`
            - Xử lý NAT, kiểm tra header (Layer 7), mã hóa SSL (nếu có) đòi hỏi CPU cao.
            - Với lưu lượng lớn, CPU yếu sẽ không xử lý kịp.
        - `Network`
            - LB nhận toàn bộ traffic vào/ra → băng thông NIC (network interface card) có thể bị bão hòa.
            - Ví dụ: NIC 1Gbps không đủ cho 10Gbps lưu lượng.
    - **Giải pháp tránh bottleneck**:
        - **Scale horizontally:** Dùng nhiều LB (ví dụ: DNS round-robin hoặc LB cấp cao hơn).
        - **Scale vertically:** Tăng RAM, CPU, băng thông cho LB.
        - **DSR:** Để server gửi phản hồi trực tiếp, giảm tải mạng cho LB.
        - **Hardware LB:** Dùng thiết bị chuyên dụng (F5, Citrix) thay vì phần mềm.