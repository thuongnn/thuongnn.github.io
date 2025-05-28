---
author: thuongnn
pubDatetime: 2020-10-12T23:11:35Z
title: "[Computer Science] Kiến thức về Security cơ bản"
featured: false
draft: false
tags:
  - Security
  - Computer Science
description: Tổng hợp câu hỏi và trả lời về Security cơ bản.
---

Bài viết tổng hợp câu trả lời cho các câu hỏi về Security cơ bản trong computer science được fork từ repo: https://github.com/vietnakid/learning-material.git

## Table of contents

## Hash vs Encrypt vs Encode

- **Hash**
  - **Định nghĩa**: Hash là quá trình ánh xạ dữ liệu (bất kỳ kích thước) thành một giá trị cố định (hash value) bằng hàm băm (hash function). Không thể đảo ngược (one-way).
  - **Mục đích**:
    - Kiểm tra tính toàn vẹn (integrity).
    - Lưu mật khẩu (password hashing).
  - **Đặc điểm**:
    - Một chiều (không thể giải mã).
    - Kích thước đầu ra cố định (ví dụ: SHA-256 luôn cho 256-bit).
  - **Ví dụ**:
    - `SHA-256("hello") = 2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824.`
    - Thay đổi nhỏ → hash thay đổi lớn (avalanche effect).
- **Encrypt**
  - **Định nghĩa**: Mã hóa (encryption) là quá trình chuyển đổi dữ liệu thành dạng không đọc được (ciphertext) bằng khóa (key), có thể giải mã (reversible) nếu có khóa.
  - **Mục đích**: Bảo mật dữ liệu (confidentiality).
  - **Đặc điểm**:
    - Hai chiều (có thể giải mã).
    - Cần khóa (key) để mã hóa và giải mã.
  - **Ví dụ**: AES: `encrypt("hello", key) = "a1b2c3d4"`, `decrypt("a1b2c3d4", key) = "hello"`.
- **Encode**
  - **Định nghĩa**: Mã hóa (encoding) là quá trình chuyển đổi dữ liệu sang định dạng khác để lưu trữ hoặc truyền tải, không nhằm bảo mật, có thể đảo ngược dễ dàng.
  - **Mục đích**: Chuẩn hóa dữ liệu (ví dụ: chuyển nhị phân thành text).
  - **Đặc điểm**:
    - Không bảo mật, chỉ thay đổi biểu diễn.
    - Không cần khóa.
  - **Ví dụ**: Base64: `encode("hello") = "aGVsbG8="`, `decode("aGVsbG8=") = "hello"`.
- **So Sánh**

  | **Tiêu chí**  | **Hash**               | **Encrypt**     | **Encode**           |
  | ------------- | ---------------------- | --------------- | -------------------- |
  | **Mục đích**  | Toàn vẹn, lưu mật khẩu | Bảo mật dữ liệu | Chuẩn hóa dữ liệu    |
  | **Đảo ngược** | Không                  | Có (với key)    | Có (dễ dàng)         |
  | **Cần key**   | Không                  | Có              | Không                |
  | **Ví dụ**     | SHA-256                | AES, RSA        | Base64, URL encoding |

---

### Are there any way we can crack `Hash`

- **Có Thể Crack Hash Không?**
  - **Lý thuyết**: Hash là một chiều, không thể đảo ngược để lấy dữ liệu gốc.
  - **Thực tế**: Có thể "crack" bằng các kỹ thuật tấn công, nhưng không phải giải mã trực tiếp.
- **Cách Tấn Công Hash**
  - **Brute Force**:
    - Thử tất cả giá trị đầu vào, so sánh hash.
    - Ví dụ: Hash mật khẩu `"123"` → thử `"000"`, `"001"`, ... cho đến khi khớp.
    - **Hạn chế**: Chậm với mật khẩu dài, phức tạp.
  - **Rainbow Table**:
    - Dùng bảng tra cứu (lookup table) chứa cặp (input, hash) được tính trước.
    - Ví dụ: Rainbow table có `SHA-256("password")` → tìm ngay input.
    - **Hạn chế**: Không hiệu quả nếu dùng **salt** (chuỗi ngẫu nhiên thêm vào trước khi hash).
  - **Dictionary Attack**:
    - Thử các giá trị phổ biến (như "password123").
    - **Hạn chế**: Không hiệu quả với mật khẩu phức tạp.
  - **Collision Attack**:
    - Tìm hai input khác nhau cho cùng hash (không cần tìm input gốc).
    - Ví dụ: MD5 dễ bị collision → không an toàn.
- **Cách Bảo Vệ**
  - **Dùng Salt**:
    - Thêm chuỗi ngẫu nhiên vào input trước khi hash.
    - Ví dụ: `hash("password" + "salt123")` → rainbow table vô dụng.
  - **Dùng Hàm Hash Mạnh**:
    - Dùng SHA-256, bcrypt thay vì MD5, SHA-1 (đã lỗi thời).
  - **Hàm Hash Chậm**:
    - Dùng hàm chậm như bcrypt, Argon2 để làm brute force khó hơn.

### symmetric vs asymmetric encryption? AES vs RSA?

- **Symmetric Encryption**
  - **Định nghĩa**: Dùng cùng một khóa (key) để mã hóa và giải mã.
  - **Đặc điểm**:
    - Nhanh, phù hợp cho dữ liệu lớn.
    - Cần chia sẻ khóa an toàn.
  - **Ví dụ**: AES (Advanced Encryption Standard).
    - AES-256: Khóa 256-bit, mã hóa khối (block cipher).
    - `encrypt("hello", key) → "a1b2c3"`, `decrypt("a1b2c3", key) → "hello"`.
- **Asymmetric Encryption**
  - **Định nghĩa**: Dùng cặp khóa: public key (mã hóa) và private key (giải mã).
  - **Đặc điểm**:
    - Chậm, phù hợp cho dữ liệu nhỏ (như khóa, chữ ký).
    - Không cần chia sẻ khóa an toàn.
  - **Ví dụ**: RSA (Rivest-Shamir-Adleman).
    - `encrypt("hello", public_key) → "xyz"`, `decrypt("xyz", private_key) → "hello"`.
- **AES vs RSA**

  | **Tiêu chí** | **AES (Symmetric)**         | **RSA (Asymmetric)**      |
  | ------------ | --------------------------- | ------------------------- |
  | **Tốc độ**   | Nhanh (phù hợp dữ liệu lớn) | Chậm (dữ liệu nhỏ)        |
  | **Khóa**     | Một khóa                    | Cặp khóa (public/private) |
  | **Ứng dụng** | Mã hóa file, VPN            | Trao đổi khóa, chữ ký số  |
  | **Ví dụ**    | AES-256                     | RSA-2048                  |

- **Ứng Dụng Thực Tế**

  - **Kết hợp**: Dùng RSA để trao đổi khóa AES an toàn, sau đó dùng AES mã hóa dữ liệu.

    Ví dụ: HTTPS → RSA trao đổi khóa, AES mã hóa dữ liệu.

### Fast Hash vs Slow Hash?

- **Fast Hash**
  - **Định nghĩa**: Hàm hash được thiết kế để nhanh, dùng cho kiểm tra toàn vẹn.
  - **Ví dụ**: MD5, SHA-1, SHA-256.
  - **Đặc điểm**:
    - Tốc độ cao (hàng triệu hash/giây).
    - Dễ bị tấn công brute force (vì nhanh).
  - **Ứng dụng**:
    - Kiểm tra file: `SHA-256(file)` để so sánh.
    - Không dùng cho mật khẩu (vì dễ crack).
- **Slow Hash**
  - **Định nghĩa**: Hàm hash được thiết kế chậm, dùng để lưu mật khẩu.
  - **Ví dụ**: bcrypt, Argon2, PBKDF2.
  - **Đặc điểm**:
    - Chậm (cố ý), ví dụ: bcrypt mất 0.1s để hash.
    - Khó brute force (vì chậm).
    - Thường tích hợp salt.
  - **Ứng dụng**:
    - Lưu mật khẩu: `bcrypt("password")`.
- **So Sánh**

  | **Tiêu chí** | **Fast Hash** | **Slow Hash** |
  | ------------ | ------------- | ------------- |
  | **Tốc độ**   | Nhanh         | Chậm          |
  | **Ứng dụng** | Toàn vẹn      | Lưu mật khẩu  |
  | **Ví dụ**    | SHA-256       | bcrypt        |

### When we use Encode?

- **Khi Nào Dùng?**
  - **Chuẩn hóa dữ liệu**:
    - Chuyển dữ liệu sang định dạng phù hợp để lưu trữ / truyền tải.
    - Ví dụ: Base64 encode dữ liệu nhị phân thành text để gửi qua email.
  - **Truyền tải an toàn qua giao thức**:
    - URL encoding: Chuyển ký tự đặc biệt thành dạng an toàn.
    - Ví dụ: `encode("hello world") = "hello%20world"`.
  - **Không dùng để bảo mật**:
    - Encode không che giấu dữ liệu, chỉ thay đổi biểu diễn.
- **Ví dụ**
  - Base64: `encode("hello") = "aGVsbG8="` → dùng trong JSON, email.
  - URL Encoding: `encode("name=John Doe") = "name%3DJohn%20Doe"` → dùng trong HTTP query.

### What is the perfect hash function?

- **Định nghĩa**
  - **Perfect Hash Function** là hàm băm không gây va chạm (collision), tức là mỗi input ánh xạ duy nhất đến một output.
  - **Đặc điểm**:
    - Không có hai input khác nhau cho cùng hash.
    - Thường chỉ khả thi với tập input cố định (static set).
- **Ví dụ**:
  - Tập input: `{"cat", "dog", "bird"}`.
  - Perfect hash: `hash("cat") = 1, hash("dog") = 2, hash("bird") = 3` → không va chạm.
- **Ứng dụng**:
  - Tối ưu bảng băm (hash table) trong compiler, database.
- **Hạn chế**:
  - Khó xây dựng cho tập input lớn, động (dynamic).

### What is the load factor of hashing?

- **Load Factor** (Hệ số tải) là tỷ lệ giữa số phần tử trong bảng băm (hash table) và kích thước bảng.
- **Công thức**:

  ```
  Load Factor = Số phần tử (n) / Kích thước bảng (m)
  ```

- **Ý nghĩa**:
  - Đo độ "đầy" của bảng băm.
  - Load factor cao → nhiều va chạm → chậm.
- **Ví dụ**:
  - Bảng băm có 10 slot (m = 10), chứa 7 phần tử (n = 7).
  - Load factor = 7/10 = 0.7 (70%).
- **Ngưỡng**:
  - Thường giữ load factor < 0.7 (70%) để tránh va chạm.
  - Nếu vượt ngưỡng, tăng kích thước bảng (resize) và rehash.

## SSL/TLS

- Định nghĩa
  - **SSL (Secure Sockets Layer)** và **TLS (Transport Layer Security)** là giao thức mã hóa để bảo mật kết nối mạng, đảm bảo tính bảo mật (confidentiality), toàn vẹn (integrity), và xác thực (authentication).
  - **TLS** là phiên bản hiện đại của SSL (SSL đã lỗi thời, TLS 1.3 là chuẩn mới nhất).
- **Mục đích**
  - Bảo vệ dữ liệu truyền qua mạng (như HTTPS, email, VPN).
  - Xác thực danh tính server (và đôi khi client).
  - Ngăn chặn tấn công nghe lén (eavesdropping), giả mạo (man-in-the-middle).
- **Cách hoạt động (TLS Handshake)**
  1. **Client Hello**: Client gửi danh sách cipher suites hỗ trợ, phiên bản TLS.
  2. **Server Hello**: Server chọn cipher suite, gửi chứng chỉ (certificate).
  3. **Xác minh chứng chỉ**: Client kiểm tra chứng chỉ của server.
  4. **Trao đổi khóa**: Client và server tạo khóa chung (dùng asymmetric encryption).
  5. **Mã hóa dữ liệu**: Dùng symmetric encryption (như AES) để truyền dữ liệu an toàn.

---

### How to verify a certificate? How many kinds of certificates are there?

- **Làm Sao Xác Minh Một Chứng Chỉ?**
  1. **Kiểm tra chữ ký số**:
     - Chứng chỉ được ký bởi CA (Certificate Authority) bằng private key của CA.
     - Client dùng public key của CA để kiểm tra chữ ký → đảm bảo chứng chỉ không bị giả mạo.
  2. **Kiểm tra chuỗi chứng chỉ (Chain of Trust)**:
     - Chứng chỉ của server được ký bởi CA trung gian (Intermediate CA), CA trung gian được ký bởi CA gốc (Root CA).
     - Client kiểm tra toàn bộ chuỗi đến Root CA (được tin cậy, lưu trong hệ điều hành/trình duyệt).
  3. **Kiểm tra thời hạn**:
     - Chứng chỉ có thời gian hiệu lực (valid from/to) → nếu hết hạn, không hợp lệ.
  4. **Kiểm tra danh sách thu hồi (CRL/OCSP)**:
     - Kiểm tra xem chứng chỉ có bị thu hồi (revoked) không qua CRL (Certificate Revocation List) hoặc OCSP (Online Certificate Status Protocol).
  5. **Kiểm tra tên miền**:
     - Chứng chỉ phải khớp với tên miền (domain) của server (Common Name hoặc Subject Alternative Name).
- **Có Bao Nhiêu Loại Chứng Chỉ?**
  - **Theo mức độ xác minh**:
    1. **Domain Validated (DV)**:
       - Chỉ xác minh quyền sở hữu tên miền.
       - Rẻ, nhanh (dùng cho blog, web nhỏ).
       - Ví dụ: Let’s Encrypt.
    2. **Organization Validated (OV)**:
       - Xác minh tổ chức sở hữu tên miền.
       - Dùng cho doanh nghiệp.
    3. **Extended Validation (EV)**:
       - Xác minh kỹ lưỡng (tổ chức, pháp lý).
       - Hiển thị thanh xanh trên trình duyệt (dùng cho ngân hàng, thương mại điện tử).
  - **Theo mục đích sử dụng**:
    1. **Server Certificate**: Dùng cho HTTPS (web server).
    2. **Client Certificate**: Xác thực client (ít dùng).
    3. **Code Signing Certificate**: Ký mã nguồn (đảm bảo phần mềm không bị giả mạo).
    4. **Email Certificate**: Ký và mã hóa email (S/MIME).

### What is CA? how to verify certificate of a CA?

- **CA Là Gì?**
  - **Certificate Authority (CA)** là tổ chức đáng tin cậy, phát hành và ký chứng chỉ số để xác thực danh tính của server, tổ chức, hoặc cá nhân.
  - **Ví dụ**: DigiCert, GlobalSign, Let’s Encrypt.
  - **Vai trò**:
    - Ký chứng chỉ bằng private key của CA.
    - Cung cấp public key để client kiểm tra.
- **Làm Sao Xác Minh Chứng Chỉ Của CA?**
  - **Chuỗi tin cậy (Chain of Trust)**:
    - Chứng chỉ của CA (Intermediate CA) được ký bởi CA gốc (Root CA).
    - Root CA được tin cậy mặc định (public key của Root CA lưu trong trình duyệt/hệ điều hành).
  - **Quy trình**:
    1. Client nhận chứng chỉ của server, thấy nó được ký bởi Intermediate CA.
    2. Client kiểm tra chứng chỉ của Intermediate CA, thấy nó được ký bởi Root CA.
    3. Client dùng public key của Root CA (đã có sẵn) để kiểm tra chữ ký → nếu hợp lệ, tin tưởng.
  - **Ví dụ**:
    - Server: `example.com` → chứng chỉ ký bởi DigiCert (Intermediate CA).
    - DigiCert được ký bởi VeriSign (Root CA).
    - Trình duyệt có public key của VeriSign → xác minh toàn bộ chuỗi.

### What is `public`/`private` key? what is symmetric `key`

- **Public / Private Key**
  - **Định nghĩa**:
    - **Public Key** và **Private Key** là cặp khóa trong mã hóa bất đối xứng (asymmetric encryption).
    - Public key: Dùng để mã hóa, ai cũng có thể biết.
    - Private key: Dùng để giải mã, chỉ chủ sở hữu biết.
  - **Ứng dụng**:
    - Xác thực: Server gửi public key qua chứng chỉ, client mã hóa dữ liệu → server giải mã bằng private key.
    - Chữ ký số: Server ký dữ liệu bằng private key, client kiểm tra bằng public key.
  - **Ví dụ**:
    - RSA: Client mã hóa khóa AES bằng public key của server → server giải mã bằng private key.
- **Symmetric Key**
  - **Định nghĩa**:
    - **Symmetric Key** là khóa duy nhất dùng cho cả mã hóa và giải mã trong mã hóa đối xứng (symmetric encryption).
  - **Ứng dụng**:
    - Mã hóa dữ liệu lớn (nhanh hơn asymmetric).
    - Ví dụ: AES-256 dùng symmetric key để mã hóa dữ liệu trong TLS.
  - **Hạn chế**:
    - Cần chia sẻ khóa an toàn (thường dùng asymmetric để trao đổi symmetric key).
- **So Sánh**

  | **Tiêu chí**    | **Public/Private Key** | **Symmetric Key** |
  | --------------- | ---------------------- | ----------------- |
  | **Loại mã hóa** | Bất đối xứng           | Đối xứng          |
  | **Số khóa**     | Cặp (public/private)   | Một khóa          |
  | **Tốc độ**      | Chậm                   | Nhanh             |
  | **Ứng dụng**    | Trao đổi khóa, chữ ký  | Mã hóa dữ liệu    |

### What is digital signature? What is `HMAC`?

- **Digital Signature**
  - **Digital Signature** (Chữ ký số) là kỹ thuật dùng private key để ký dữ liệu, đảm bảo tính toàn vẹn (integrity) và xác thực (authentication).
  - **Cách hoạt động**:
    1. Server hash dữ liệu: `hash = SHA-256(data)`.
    2. Server mã hóa hash bằng private key: `signature = encrypt(hash, private_key)`.
    3. Client nhận dữ liệu và signature, giải mã bằng public key: `hash = decrypt(signature, public_key)`.
    4. Client hash lại dữ liệu, so sánh → nếu khớp, dữ liệu không bị thay đổi.
  - **Ứng dụng**:
    - Xác minh chứng chỉ trong TLS.
    - Ký phần mềm (code signing).
- **HMAC**
  - **HMAC (Hash-based Message Authentication Code)** là kỹ thuật dùng symmetric key và hàm hash để tạo mã xác thực, đảm bảo toàn vẹn và xác thực.
  - **Cách hoạt động**:
    1. Dùng symmetric key và dữ liệu: `HMAC = hash(key + data)`.
    2. Client/server đều có key, tính lại HMAC để so sánh.
  - **Ví dụ**: `HMAC-SHA256("hello", key) = "abc123"`.
  - **Ứng dụng**:
    - Xác thực API (như AWS API signature).
    - Bảo vệ cookie (tránh giả mạo).
- So Sánh

  | **Tiêu chí**    | **Digital Signature**  | **HMAC**      |
  | --------------- | ---------------------- | ------------- |
  | **Loại mã hóa** | Bất đối xứng           | Đối xứng      |
  | **Khóa**        | Public/private         | Symmetric key |
  | **Tốc độ**      | Chậm                   | Nhanh         |
  | **Ứng dụng**    | Chứng chỉ, ký phần mềm | API, cookie   |

## How to store credential information efficiency?

### Nguyên Tắc Cơ Bản Khi Lưu Trữ Thông Tin Nhạy Cảm

- **Không lưu trữ dạng plaintext**: Không bao giờ lưu mật khẩu, khóa bí mật dưới dạng văn bản thô (plaintext) → dễ bị lộ nếu hệ thống bị tấn công.
- **Dùng mã hóa mạnh**: Mã hóa dữ liệu nhạy cảm trước khi lưu trữ.
- **Hạn chế truy cập**: Chỉ cho phép các thành phần cần thiết truy cập thông tin nhạy cảm.
- **Kiểm tra và giám sát**: Theo dõi truy cập, ghi log để phát hiện hành vi bất thường.
- **Luân chuyển khóa (key rotation)**: Thay đổi khóa định kỳ để giảm rủi ro nếu khóa bị lộ.

### **Cách Lưu Trữ Các Loại Thông Tin Nhạy Cảm**

#### **Mật Khẩu Người Dùng (User Password)**

- **Phương pháp**
  - Hash với Salt:
    - Dùng hàm hash chậm (slow hash) như **bcrypt**, **Argon2**, hoặc **PBKDF2**.
    - Thêm **salt** (chuỗi ngẫu nhiên) để chống tấn công rainbow table.
  - **Lý do**:
    - Hash là một chiều, không thể đảo ngược → an toàn hơn plaintext.
    - Salt đảm bảo mỗi mật khẩu có hash khác nhau, dù mật khẩu giống nhau.
- **Ví dụ (Python với bcrypt):**

  ```python
  import bcrypt

  password = "mysecretpassword".encode('utf-8')
  salt = bcrypt.gensalt()  # Tạo salt ngẫu nhiên
  hashed = bcrypt.hashpw(password, salt)  # Hash mật khẩu
  print(hashed)

  # Kiểm tra mật khẩu
  if bcrypt.checkpw(password, hashed):
      print("Mật khẩu đúng!")
  ```

- **Lưu trữ**:
  - Lưu `hashed` và `salt` vào database (thường trong cùng cột hoặc cột riêng).
- **Hiệu suất**:
  - bcrypt chậm (cố ý) → chống brute force, nhưng đủ nhanh cho đăng nhập (0.1-0.5s).

#### **Khóa Cấu Hình (Config Key) và Khóa Bí Mật (Secret Key)**

- **Phương pháp**
  - **Dùng Secret Management Service**:
    - Sử dụng dịch vụ quản lý bí mật như **AWS Secrets Manager**, **HashiCorp Vault**, **Azure Key Vault**.
    - Lưu trữ khóa trong dịch vụ này, ứng dụng truy cập qua API an toàn.
  - **Mã hóa trước khi lưu**:
    - Nếu phải lưu trong file hoặc database, mã hóa khóa bằng **symmetric encryption** (như AES-256).
    - Lưu khóa mã hóa (master key) ở nơi an toàn (như HSM - Hardware Security Module).
- **Ví dụ (Mã hóa với AES trong Python)**:

  ```python
  from cryptography.fernet import Fernet

  key = Fernet.generate_key()  # Tạo khóa AES
  cipher = Fernet(key)
  secret = "my_api_key".encode('utf-8')
  encrypted = cipher.encrypt(secret)  # Mã hóa
  print(encrypted)

  decrypted = cipher.decrypt(encrypted)  # Giải mã
  print(decrypted.decode('utf-8'))
  ```

- **Lưu trữ**:
  - Lưu `encrypted` vào file cấu hình hoặc database.
  - Lưu `key` trong secret manager hoặc HSM.
- **Hiệu suất**:
  - AES nhanh (microseconds), phù hợp cho ứng dụng thời gian thực.

#### **Thông Tin Cơ Sở Dữ Liệu (Database Credentials)**

- **Phương pháp**
  - **Không lưu trong mã nguồn**
    - Tránh lưu `username`, `password` trong file mã nguồn (như [config.py](http://config.py/)).
  - **Dùng biến môi trường (Environment Variables)**
    - Lưu trong biến môi trường, ứng dụng đọc lúc runtime.
  - **Secret Management**
    - Dùng AWS Secrets Manager hoặc HashiCorp Vault để lưu và truy xuất.
  - **Mã hóa nếu lưu trong file**
    - Nếu lưu trong file (như `config.json`), mã hóa bằng AES.
- **Ví dụ (Biến môi trường trong Python):**

  ```python
  import os

  db_user = os.getenv("DB_USER")
  db_pass = os.getenv("DB_PASS")
  print(f"Database credentials: {db_user}:{db_pass}")
  ```

- **Hiệu suất**:
  - Đọc biến môi trường nhanh (milliseconds), không cần mã hóa/giải mã.

#### **Thông Tin Người Dùng (User Information)**

- **Phương pháp**
  - **Chỉ lưu dữ liệu cần thiết**
    - Tránh lưu thông tin nhạy cảm không cần thiết (như số thẻ tín dụng)
  - **Mã hóa dữ liệu nhạy cảm**
    - Dùng AES để mã hóa thông tin như số CMND, địa chỉ
  - **Phân quyền truy cập**
    - Dùng cơ chế kiểm soát truy cập (RBAC) để giới hạn ai được đọc dữ liệu.
- **Ví dụ**:

  - Lưu `email` dạng plaintext (vì không nhạy cảm).
  - Lưu `ssn` (số an sinh xã hội) dạng mã hóa:

    ```sql
    INSERT INTO users (email, ssn) VALUES ('user@example.com', AES_ENCRYPT('123-45-6789', 'secret_key'));
    ```

- **Hiệu suất**:
  - Mã hóa/giải mã AES nhanh, nhưng cần quản lý khóa cẩn thận.

#### **Khóa Bí Mật (Secret Key) và Các Thông Tin Khác**

- **Phương pháp**
  - **Hardware Security Module (HSM)**
    - Lưu khóa trong HSM (thiết bị phần cứng chuyên dụng) → an toàn cao.
  - **Secret Management Service**
    - Dùng HashiCorp Vault để lưu trữ và luân chuyển khóa.
  - **Mã hóa nếu lưu cục bộ**
    - Mã hóa bằng AES, lưu master key trong HSM.
- **Hiệu suất**:
  - Truy xuất từ Vault/HSM chậm hơn (vài milliseconds), nhưng an toàn hơn.

### **Best Practices Để Lưu Trữ Hiệu Quả**

#### Bảo Mật

- **Dùng thuật toán mạnh**:
  - Hash: bcrypt, Argon2.
  - Mã hóa: AES-256, RSA.
- **Luân chuyển khóa**:
  - Thay đổi khóa định kỳ (ví dụ: mỗi 90 ngày).
- **Kiểm tra truy cập**:
  - Dùng IAM (Identity and Access Management) để giới hạn quyền.

#### Hiệu Suất

- **Tối ưu mã hóa**:
  - Dùng symmetric encryption (AES) cho dữ liệu lớn, asymmetric (RSA) cho trao đổi khóa.
- **Caching**:
  - Cache thông tin không nhạy cảm (như `user_id`) trong Redis để giảm truy cập database.
- **Truy xuất nhanh**:
  - Dùng biến môi trường hoặc secret manager có hỗ trợ caching.

#### Quản Lý

- **Tập trung hóa**:
  - Dùng secret manager để quản lý tất cả credentials.
- **Tự động hóa**:
  - Dùng CI/CD để tự động luân chuyển khóa.
- **Giám sát**:
  - Ghi log truy cập, phát hiện bất thường.

### So Sánh Các Phương Pháp Lưu Trữ

| **Loại thông tin**       | **Phương pháp**                | **Lưu trữ**        | **Hiệu suất**   | **Bảo mật**    |
| ------------------------ | ------------------------------ | ------------------ | --------------- | -------------- |
| **Mật khẩu người dùng**  | Hash (bcrypt)                  | Database           | Chậm (0.1-0.5s) | Cao (với salt) |
| **Khóa cấu hình**        | Secret Manager/AES             | Vault, file mã hóa | Nhanh (ms)      | Cao            |
| **DB Credentials**       | Biến môi trường/Secret Manager | Hệ điều hành/Vault | Rất nhanh (ms)  | Trung bình-Cao |
| **Thông tin người dùng** | Mã hóa (AES)                   | Database           | Nhanh (ms)      | Cao            |
| **Khóa bí mật**          | HSM/Secret Manager             | HSM, Vault         | Trung bình (ms) | Rất cao        |

## Describe a way to defense DDOS?

### DDoS Là Gì? Các Loại DDoS

- **Định nghĩa**
  - **DDoS (Distributed Denial of Service)** là cuộc tấn công từ nhiều nguồn (botnet) nhằm làm quá tải hệ thống, khiến dịch vụ không khả dụng (unavailable) cho người dùng hợp pháp.
  - **Mục tiêu**:
    - Làm gián đoạn dịch vụ (web, API, game, v.v.).
    - Gây thiệt hại tài chính, uy tín.
- **Các Loại DDoS**
  - **Volumetric Attack (Tấn công băng thông)**:
    - Làm ngập băng thông mạng bằng lưu lượng giả (fake traffic).
    - Ví dụ: UDP flood, ICMP flood.
    - Mục tiêu: Làm tắc nghẽn mạng (network bandwidth).
  - **Protocol Attack (Tấn công giao thức)**:
    - Tận dụng lỗ hổng giao thức mạng (layer 3/4).
    - Ví dụ: SYN flood (gửi nhiều SYN packet nhưng không hoàn tất handshake).
    - Mục tiêu: Làm cạn kiệt tài nguyên xử lý (CPU, memory) của server/firewall.
  - **Application Layer Attack (Tấn công tầng ứng dụng)**:
    - Tấn công tầng ứng dụng (layer 7), nhắm vào logic ứng dụng.
    - Ví dụ: HTTP flood (gửi nhiều request GET/POST).
    - Mục tiêu: Làm quá tải web server, database.
  - **Memory/CPU Exhaustion Attack (Tấn công cạn kiệt tài nguyên)**:
    - Làm cạn kiệt bộ nhớ hoặc CPU.
    - Ví dụ: Slowloris (giữ kết nối HTTP mở lâu, không gửi dữ liệu).
    - Mục tiêu: Làm server không xử lý được yêu cầu mới.
  - **Hybrid Attack (Tấn công kết hợp)**:
    - Kết hợp nhiều loại trên để tăng hiệu quả.

### Cách Phòng Thủ DDoS: Chiến Lược Tổng Quát

Phòng thủ DDoS đòi hỏi nhiều lớp bảo vệ (defense-in-depth), vì mỗi loại tấn công nhắm vào các tầng khác nhau (network, application, infrastructure). Dưới đây là các phương pháp:

#### **Phòng Thủ Tầng Mạng (Network Layer Defense)**

- **Mục tiêu**
  - Ngăn chặn Volumetric và Protocol Attack (layer 3/4).
- **Phương pháp**
  - **Tăng băng thông (Overprovisioning)**:
    - Cung cấp băng thông lớn hơn mức cần thiết để chịu được lưu lượng giả.
    - **Hạn chế**: Tốn kém, không hiệu quả với tấn công lớn.
  - **Dùng CDN (Content Delivery Network)**:
    - Phân tán lưu lượng qua nhiều server toàn cầu (như Cloudflare, Akamai).
    - Ví dụ: Cloudflare hấp thụ lưu lượng DDoS, chỉ gửi yêu cầu hợp pháp đến server gốc.
    - **Ưu**: Giảm tải server gốc, phân tán địa lý.
  - **Bộ lọc lưu lượng (Traffic Filtering)**:
    - Dùng firewall hoặc router để lọc lưu lượng bất thường.
    - Ví dụ: Chặn IP nguồn giả (spoofed IP) bằng **BGP FlowSpec**.
  - **Rate Limiting (Giới hạn tốc độ)**:
    - Giới hạn số yêu cầu từ một IP trong khoảng thời gian.
    - Ví dụ: Chỉ cho phép 100 request/phút từ một IP.
  - **Blackholing/DNS Sinkholing**:
    - Chuyển hướng lưu lượng tấn công đến "hố đen" (blackhole) để bảo vệ server.
    - **Hạn chế**: Có thể chặn cả lưu lượng hợp pháp.

#### Phòng Thủ Tầng Giao Thức (Protocol Layer Defense)

- **Mục tiêu**
  - Ngăn chặn Protocol Attack (như SYN flood).
- **Phương pháp**

  - **Tối ưu TCP Stack**:

    - Tăng backlog queue (hàng đợi kết nối) để xử lý nhiều SYN packet.
    - Dùng **SYN Cookies**:
      - Server không lưu trạng thái cho SYN packet, chỉ trả lời SYN-ACK với cookie.
      - Client hợp pháp gửi ACK → server xác minh cookie → kết nối.
    - Ví dụ: Cấu hình Linux:

      ```bash
      sysctl -w net.ipv4.tcp_syncookies=1
      ```

  - **Firewall Rules**:
    - Chặn các giao thức không cần thiết (như ICMP nếu không dùng).
    - Ví dụ: `iptables -A INPUT -p icmp -j DROP`.
  - **Load Balancer**:
    - Phân tải kết nối qua nhiều server, giảm áp lực lên một server.

#### **Phòng Thủ Tầng Ứng Dụng (Application Layer Defense)**

- **Mục tiêu**
  - Ngăn chặn HTTP flood, Slowloris (layer 7).
- **Phương pháp**

  - **Web Application Firewall (WAF)**:
    - Lọc yêu cầu HTTP dựa trên quy tắc (như chặn user-agent bất thường).
    - Ví dụ: Cloudflare WAF chặn yêu cầu từ bot.
  - **Rate Limiting (Tầng ứng dụng)**:

    - Giới hạn số request HTTP từ một IP hoặc session.
    - Ví dụ: Nginx:

      ```
      limit_req_zone $binary_remote_addr zone=mylimit:10m rate=10r/s;
      server {
          location / {
              limit_req zone=mylimit burst=20;
          }
      }
      ```

  - **CAPTCHA**:
    - Yêu cầu người dùng giải CAPTCHA để xác minh (chống bot).
    - Ví dụ: Google reCAPTCHA.
  - **Tối ưu ứng dụng**:
    - Cache nội dung tĩnh (dùng Redis, Memcached) để giảm tải database.
    - Ví dụ: Cache trang chủ trong Redis → trả về ngay, không truy vấn DB.
  - **Timeout ngắn:**

    - Đặt timeout thấp cho kết nối HTTP để chống Slowloris.
    - Ví dụ: Nginx:

      ```
      client_body_timeout 5s;
      client_header_timeout 5s;
      ```

#### Phòng Thủ Tầng Tài Nguyên (Memory/CPU Defense)

- **Mục tiêu**
  - Ngăn chặn cạn kiệt tài nguyên (memory, CPU).
- **Phương pháp**

  - **Tăng tài nguyên (Overprovisioning)**:
    - Cung cấp CPU, RAM dư thừa để chịu tải.
    - **Hạn chế**: Tốn kém.
  - **Tối ưu hệ thống**:

    - Giới hạn số kết nối đồng thời.
    - Ví dụ: Nginx:

      ```
      worker_connections 1024;
      ```

  - **Giám sát và tự động mở rộng (Autoscaling)**:
    - Dùng AWS Auto Scaling để thêm server khi CPU/memory vượt ngưỡng.
  - **Chặn kết nối bất thường**:
    - Phát hiện và chặn kết nối giữ lâu (như Slowloris) bằng WAF hoặc firewall.

#### **Phòng Thủ Tổng Quát (General Defense)**

- **Giám sát và phát hiện (Monitoring)**:
  - Dùng công cụ như **Prometheus**, **Grafana** để theo dõi lưu lượng, CPU, memory.
  - Phát hiện bất thường (spike) → kích hoạt biện pháp phòng thủ.
- **Dịch vụ chống DDoS**:
  - Dùng dịch vụ chuyên dụng như **Cloudflare**, **AWS Shield**, **Imperva**.
  - Họ có hạ tầng lớn, tự động hấp thụ và lọc lưu lượng DDoS.
- **Kế hoạch ứng phó (Incident Response Plan)**:
  - Chuẩn bị trước: Có đội ngũ, quy trình xử lý khi bị tấn công.
  - Ví dụ: Chuyển DNS sang Cloudflare khi bị tấn công.
- **Phân tán tài nguyên**:
  - Dùng nhiều server, nhiều vùng (regions) để tránh single point of failure.

### **Ví Dụ Thực Tế: Phòng Thủ DDoS Cho Web App**

- **Hạ tầng**:
  - Web app chạy trên AWS EC2, dùng Nginx làm web server.
- **Phòng thủ**:
  1. **CDN**: Dùng Cloudflare để phân tán lưu lượng, lọc bot.
  2. **WAF**: Cấu hình Cloudflare WAF chặn HTTP flood.
  3. **Rate Limiting**: Giới hạn 100 request/phút/IP trên Nginx.
  4. **Autoscaling**: AWS Auto Scaling thêm EC2 instance khi CPU > 80%.
  5. **SYN Cookies**: Bật `tcp_syncookies` trên Linux.
  6. **Monitoring**: Dùng Prometheus để theo dõi lưu lượng, kích hoạt cảnh báo.
- **Kết quả**:
  - Volumetric Attack: Cloudflare hấp thụ.
  - HTTP Flood: WAF và rate limiting chặn.
  - SYN Flood: SYN cookies xử lý.

### Hạn Chế và Thách Thức

- **Tấn công tinh vi**:
  - DDoS tầng ứng dụng khó phát hiện (như yêu cầu hợp lệ nhưng số lượng lớn).
- **Chi phí**:
  - Dịch vụ như Cloudflare, AWS Shield tốn kém.
- **False Positives**:
  - Rate limiting, WAF có thể chặn người dùng hợp pháp.
- **Zero-Day DDoS**:
  - Tấn công mới, chưa có biện pháp phòng thủ → cần cập nhật liên tục.
