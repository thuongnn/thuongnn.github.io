---
author: thuongnn
pubDatetime: 2021-04-08T22:29:35Z
modDatetime: 2021-04-08T22:29:35Z
title: Hệ thống mã hoá sử dụng Public Key như thế nào?
draft: false
tags:
  - Security
  - Algorithms
description: Hiểu đơn giản về mã hoá (encryption), cách mã hoá hoạt động khi gửi một tin nhắn bí mật.
ogImage: https://github.com/user-attachments/assets/6a69fdfb-d498-484a-82ff-bfcf3666899d
---

Hiểu đơn giản về mã hoá (encryption), cách mã hoá hoạt động khi gửi một tin nhắn bí mật như sau:

- Một tin nhắn có nội dung “hello mum” được mã hóa thành một tin nhắn lộn xộn mà bất kỳ ai nhìn vào cũng không thể hiểu được ví dụ như “OhsieW5ge+osh1aehah6”.

- Tin nhắn mã hóa được gửi qua Internet, nơi những người khác nhìn thấy tin nhắn bị xáo trộn “OhsieW5ge+osh1aehah6”.

- Khi nó đến đích, người nhận dự định, và chỉ người nhận dự định, có một số cách giải mã nó trở lại thông điệp ban đầu là “hello mum”.

### Symmetric Encryption — gửi các thông điệp bí mật với một key duy nhất để mã hoá

Julia muốn gửi một thông điệp tới một người bạn của cô ấy là César rằng “Meet me in the garden”, nhưng cô ấy không muốn các bạn cùng lớp nhìn thấy nó.

Thông điệp này được đi qua một nhóm bạn trung gian trước khi đến César, mấy đứa nhiều chuyện có thể dễ dàng xem trộm hay sao chép thông điệp trước khi chuyển nó đi.

![](https://github.com/user-attachments/assets/6a69fdfb-d498-484a-82ff-bfcf3666899d)

Julia quyết định mã hoá thông điệp của mình bằng cách dịch chuyển các chữ cái trong thông điệp sang phải 3 đơn vị trong bảng chữ cái (key of 3). Nếu cả 2 sẽ dùng chung khoá đơn giản này (key of 3) để giải mã thì thông điệp này cũng rất dễ bị bẻ khoá. Đứa nào cục súc sẽ ngồi thử hết lần lượt các cách kết hợp để giải mã.

![](https://github.com/user-attachments/assets/e6a0ddbd-843f-4abd-a343-c755bab30e3b)

Phương pháp dịch chuyển bảng chữ cái là một ví dụ lịch sử về mã hoá được sử dụng bởi Julius Caesar: the Caesar cipher. Khi có một khoá để mã hoá và giải mã như trong ví dụ trên (key of 3) nó được gọi là mật mã đối xứng (symmetric cryptography).

Ngày nay mật mã đối xứng phức tạp và khó đoán hơn nhiều (một chuỗi khá lớn), tuy nhiên nó không giải quyết được vấn đề sau: điều gì sẽ xảy ra nếu ai đó biết được khoá giải mã của Julia và César? họ có thể ở những nơi khác nhau trên thế giới và không thể gặp mặt trực tiếp để trao đổi mật mã?

Làm thế nào César và Julia có thể giải quyết vấn đề này?

### Public Key Encryption

Chúng ta hãy xem xét vấn đề kỹ hơn: Làm thế nào để người gửi gửi mật mã đối xứng đến người nhận một cách an toàn khi họ ở rất xa nhau?

Public-key cryptography (còn được gọi là mật mã bất đối xứng) là một giải pháp cho vấn đề trên. Nó cho phép mỗi người trong một cuộc trò chuyện tạo ra hai khoá — public key và private key. Hiểu đơn giản thì public key dùng để mã hoá và private key dùng để giải mã, hai khoá này là khác nhau.

Chuyển về một ví dụ thực tế hơn, Julia và César sẽ sử dụng máy tính của họ để gửi các tin nhắn cho nhau. Các điểm trung gian lúc này là các nhà cung cấp dịch vụ internet, máy chủ email của họ,… thực tế tin nhắn của 2 người ở hai vị trí khác nhau trên thế giới sẽ phải đi qua rất nhiều điểm trung gian.

![](https://github.com/user-attachments/assets/165ef609-a811-4776-a30b-fa9a0f7d08a1)

Đầu tiên, Julia cần khóa công khai của César. César gửi public key (file) của mình qua một kênh không an toàn, chẳng hạn như email không được mã hóa. César không bận tâm nếu những điểm trung gian có quyền truy cập vào nó vì public key là thứ mà César có thể chia sẻ một cách tự do.

![](https://github.com/user-attachments/assets/786f6e72-521e-4f01-9085-2fb0947c40a8)

Julia nhận được public key và sử dụng nó để mã hóa một tin nhắn có nội dung là: “Meet me in the graden”. Sau đó Julia gửi tin nhắn đã được mã hóa trở lại cho César.

![](https://github.com/user-attachments/assets/28ddaa4f-d860-4770-83fa-6c480b561a82)

Tin nhắn được mã hoá bởi public key của César sẽ chỉ được giải mã bởi private key của César. Điều này có nghĩa rằng tin nhắn được mã hoá chỉ có người viết và người có private key hiểu được nội dung tin nhắn là gì.

Tóm lại như sau:

- Public key cho phép ai đó gửi khóa công khai của họ trong một kênh mở không an toàn (mạng internet).

- Có public key của một người bạn sẽ cho phép chúng ta mã hoá tin nhắn để gửi lại cho họ.

- Private key của bạn sẽ được sử dụng để giải mã các tin nhắn được mã hoá cho bạn.

- Các bên trung gian chẳng hạn như nhà cung cấp dịch vụ email, nhà cung cấp dịch vụ Internet,… luôn có thể xem thông tin metadata như ai đang gửi cái gì cho ai, khi nào, thời gian nhận được, dòng chủ đề là gì, nội dung tin nhắn được mã hóa, v.v.

### Vấn đề mạo danh

Giả sử rằng có một thằng hacker tham gia vào giữa đường truyền của Julia và César, nó có thể lừa Julia lấy nhầm public key không phải của César. Julia sẽ không thể nhận biết được rằng đây là public key thực sự của César hay không? (vấn đề chả khác gì lúc đầu đã đưa ra)

![](https://github.com/user-attachments/assets/6ca48721-684e-4b5d-9f35-d5755fb71a49)

Hacker thậm chí có thể quyết định thay đổi nội dung của tập tin trước khi chuyển nó cho César. Cách tấn công này được gọi là [man-in-the-middle attack](https://vi.wikipedia.org/wiki/T%E1%BA%A5n_c%C3%B4ng_xen_gi%E1%BB%AFa). May mắn là public key cryptography có một cách để ngăn chặn cuộc tấn công này là sử dụng “fingerprint verification” (còn gọi là public key fingerprint).

Cái được gọi là xác minh dấu vấn tay — dấu vân tay này được dùng để xác minh thân phận của bạn và nó dùng khi tạo ra public key. Trước khi tiếp tục các hành động thì nó sẽ hiển thị dấu vân tay lên để xác nhận, từ đây chúng ta sẽ tránh được TH giả mạo.

_Lưu ý: Dấu vân tay cần được trao đổi trực tiếp, qua tin nhắn viễn thông hay như đối với giao thức https thường dùng sẽ được một bên cơ quan thứ ba sẽ xác minh danh tính thay chúng ta._

### Private key

Khi chúng ta mã hóa một tin nhắn bằng một public key nhất định, thì nó chỉ có thể được giải mã bằng private key phù hợp. Nhưng điều ngược lại cũng đúng. Nếu một tin nhắn được ký bởi một private key nhất định, nó chỉ có thể được giải mã bằng public key phù hợp của nó. Điều này hữu ích như thế nào?

Giả sử bạn viết một tin nhắn có nội dung “I promise to pay Aazul $100” và sau đó ký nội dung đó bằng _private key_ của bạn. Bất kỳ ai cũng có thể giải mã tin nhắn đó — nhưng chỉ một người có thể viết nó: người có _private key_ của bạn.

Và nếu bạn giữ private key của bạn một cách an toàn, điều đó có nghĩa là bạn và chỉ có bạn mới có thể viết nó. Trên thực tế, bằng cách ký nội dung tin nhắn bằng private key của mình, bạn đã đảm bảo rằng nó chỉ có thể đến từ bạn.

Việc này thực sự rất hữu ích, nó giúp chúng ta chống được các tin nhắn giả mạo. Nếu ai đó cố gắng sửa nội dung tin nhắn từ “I promise to pay Aazul $100” thành “I promise to pay Ming $100” thì họ cần phải có private key để ký lại nội dung đó. Vì vậy, nội dung tin nhắn sẽ đảm bảo rằng nó có nguồn gốc từ một nguồn nhất định và không bị nhầm lẫn khi chuyển tiếp.
