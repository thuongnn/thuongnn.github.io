---
author: thuongnn
pubDatetime: 2020-07-22T22:11:35Z
title: "[Computer Science] Kiến thức về Database cơ bản"
featured: false
draft: false
tags:
  - Database
  - Computer Science
description: Tổng hợp câu hỏi và trả lời về Database cơ bản.
---
Bài viết tổng hợp câu trả lời cho các câu hỏi về Database cơ bản trong computer science được fork từ repo: https://github.com/vietnakid/learning-material.git

## Table of contents

## Compare `Relational DB (SQL)` vs `NoSQL`

- **Relational DB (SQL)**
    - Là cơ sở dữ liệu quan hệ, lưu dữ liệu trong bảng (table) với cấu trúc cố định (schema) gồm cột và hàng, dùng SQL để truy vấn.
    - **Đặc điểm**:
        - Dữ liệu có cấu trúc (`structured`).
        - Hỗ trợ quan hệ (foreign key, join).
    - **Ví dụ**: MySQL, PostgreSQL, Oracle.
    - **Ưu điểm**:
        - Đảm bảo tính toàn vẹn (integrity).
        - Truy vấn phức tạp tốt (JOIN, GROUP BY).
    - **Nhược điểm**:
        - Khó mở rộng ngang (horizontal scaling).
        - Hiệu suất giảm với dữ liệu lớn.
- **NoSQL**
    - Là cơ sở sở dữ liệu phi quan hệ, không yêu cầu schema cố định, hỗ trợ nhiều loại dữ liệu (key-value, document, column-family, graph).
    - **Đặc điểm**:
        - Dữ liệu không cấu trúc hoặc bán cấu trúc (`unstructured`/`semi-structured`).
        - Linh hoạt, dễ mở rộng.
    - **Ví dụ**: MongoDB (document), Cassandra (column-family), Redis (key-value).
    - **Ưu điểm**:
        - Mở rộng ngang dễ (scale out).
        - Hiệu suất cao với dữ liệu lớn, phân tán.
    - **Nhược điểm**:
        - Không hỗ trợ JOIN tốt.
        - Tính nhất quán yếu hơn (eventual consistency).
- **NewSQL**
    - Kết hợp ưu điểm của SQL (ACID, truy vấn phức tạp) và NoSQL (mở rộng ngang, hiệu suất cao). Thường tự động phân mảnh (auto-sharding).
    - **Đặc điểm**:
        - Giữ SQL làm ngôn ngữ truy vấn.
        - Phân tán dữ liệu như NoSQL nhưng vẫn đảm bảo giao dịch mạnh.
    - **Ví dụ**: CockroachDB, Google Spanner, TiDB.
    - **Ưu điểm**:
        - Vừa scale tốt vừa giữ ACID.
        - Hỗ trợ truy vấn SQL phức tạp.
    - **Nhược điểm**:
        - Phức tạp hơn để triển khai.
        - Chưa phổ biến bằng SQL/NoSQL truyền thống.

---

### How these 2 things can scale up?

- **Relational DB (SQL)**
    - **Vertical Scaling (Scale Up)**:
        - Thêm tài nguyên (CPU, RAM, SSD) cho một server duy nhất.
        - **Ví dụ**: Nâng cấp server MySQL từ 8GB RAM lên 32GB.
    - **Hạn chế**:
        - Có giới hạn phần cứng (không thể tăng mãi).
        - Downtime khi nâng cấp, chi phí cao.
    - **Horizontal Scaling (Scale Out)**:
        - Khó vì dữ liệu tập trung. Cần thủ công chia nhỏ (sharding) hoặc dùng replication (master-slave).
        - **Ví dụ**: Master-slave replication trong MySQL, nhưng slave chỉ đọc, không ghi.
- **NoSQL**
    - **Horizontal Scaling (Scale Out)**:
        - Thêm server mới vào hệ thống phân tán, tự động chia dữ liệu (sharding).
        - **Ví dụ**: MongoDB dùng sharding để chia collection qua nhiều node.
    - **Ưu điểm**:
        - Linh hoạt, mở rộng dễ với dữ liệu lớn (big data).
        - Không cần server mạnh, chỉ cần thêm node rẻ.
    - **Hạn chế**:
        - Phức tạp trong quản lý phân tán.
- **NewSQL**
    - **Horizontal Scaling (Auto-Sharding)**:
        - Tự động phân mảnh dữ liệu qua nhiều node, vẫn giữ giao dịch toàn cục.
        - **Ví dụ**: CockroachDB tự chia dữ liệu thành range và phân phối qua cluster.
    - **Ưu điểm**:
        - Kết hợp scale out của NoSQL với tính toàn vẹn của SQL.
    - **Hạn chế**:
        - Cần cấu hình cluster ban đầu.

### How Transaction is handled?

- **Relational DB (SQL)**
    - **Cách xử lý**:
        - Hỗ trợ giao dịch đầy đủ theo **ACID** (Atomicity, Consistency, Isolation, Durability).
        - Dùng khóa (lock) hoặc multi-version concurrency control (MVCC) để đảm bảo an toàn.
    - **Ví dụ**:
        - Chuyển tiền:
          `UPDATE accounts SET balance = balance - 100 WHERE id = 1; và UPDATE accounts SET balance = balance + 100 WHERE id = 2;` trong một transaction → hoặc cả hai thành công, hoặc không.
- **NoSQL**
    - **Cách xử lý**:
        - Thường không hỗ trợ giao dịch đa tài nguyên (multi-document transaction) đầy đủ.
        - Một số (như MongoDB 4.0+) hỗ trợ giao dịch giới hạn, nhưng ưu tiên tốc độ hơn tính nhất quán.
    - **Ví dụ**:
        - MongoDB: Ghi document riêng lẻ nhanh, nhưng giao dịch phức tạp cần tự quản lý logic.
- **NewSQL**
    - **Cách xử lý**:
        - Hỗ trợ giao dịch ACID trên hệ thống phân tán, dùng giao thức như 2PC (Two-Phase Commit).
        - **Ví dụ**: CockroachDB đảm bảo giao dịch chuyển tiền thành công trên nhiều node.

### `ACID` of `SQL` and `BASE` of `NoSQL`? Why `NoSQL` is `eventual consistency`?

- **ACID (SQL)**
    - **Atomicity (Nguyên tử)**: Giao dịch hoàn tất toàn bộ hoặc không làm gì.
    - **Consistency (Nhất quán)**: Dữ liệu luôn đúng theo quy tắc (constraints, foreign key).
    - **Isolation (Cô lập)**: Giao dịch không ảnh hưởng lẫn nhau khi chạy song song.
    - **Durability (Bền vững)**: Dữ liệu ghi thành công được lưu vĩnh viễn dù hệ thống crash.
    - **Ví dụ**: PostgreSQL đảm bảo chuyển tiền không làm mất tiền hay tạo dữ liệu sai.
- **BASE (NoSQL)**
    - **Basically Available (Cơ bản khả dụng)**: Hệ thống luôn trả lời, dù dữ liệu có thể chưa nhất quán.
    - **Soft State (Trạng thái mềm)**: Dữ liệu có thể thay đổi theo thời gian, không cần luôn đúng.
    - **Eventual Consistency (Nhất quán cuối cùng)**: Dữ liệu sẽ đúng sau một thời gian, không ngay lập tức.
    - **Ví dụ**: Cassandra ghi dữ liệu vào một node, sau đó đồng bộ dần với node khác.
- Tại sao NoSQL là Eventual Consistency?
    - **Lý do**:
        - NoSQL ưu tiên **availability** (khả dụng) và **partition tolerance** (chịu phân vùng) theo CAP Theorem.
        - Để nhanh và phân tán, nó hy sinh **consistency** tức thời, chấp nhận dữ liệu "tạm sai" rồi đồng bộ sau (eventual).
    - **Ví dụ**: Người dùng thấy bài post mới trên node A trước node B → sau vài giây cả hai đồng bộ.

### `CAP` theorem in this case

![image.png](https://github.com/user-attachments/assets/46f9f062-9035-4da6-9a84-887d39444dec)

- **CAP**: Một hệ thống phân tán chỉ có thể đảm bảo tối đa 2 trong 3 đặc tính:
    - **Consistency (Nhất quán)**: Mọi node trả về dữ liệu giống nhau.
    - **Availability (Khả dụng)**: Hệ thống luôn phản hồi.
    - **Partition Tolerance (Chịu phân vùng)**: Hệ thống hoạt động dù mạng bị chia cắt.
- **SQL**
    - **Ưu tiên**: **CA** (Consistency + Availability).
    - **Chi tiết**:
        - Trong hệ thống đơn (non-distributed), SQL đảm bảo dữ liệu nhất quán và khả dụng.
        - Không chịu phân vùng tốt (P yếu) vì dữ liệu tập trung.
    - **Ví dụ**: MySQL master-slave: Nếu master chết, hệ thống không chịu được phân vùng.
- **NoSQL**
    - **Ưu tiên**: **AP** (Availability + Partition Tolerance) hoặc **CP**.
    - **Chi tiết**:
        - **AP** (như Cassandra): Luôn trả lời, chấp nhận dữ liệu chưa đồng bộ (eventual consistency).
        - **CP** (như MongoDB với replica): Đảm bảo nhất quán, nhưng có thể từ chối yêu cầu nếu mạng lỗi.
    - **Ví dụ**: Cassandra vẫn chạy khi một node mất kết nối, đồng bộ sau.
- **NewSQL**
    - **Ưu tiên**: **CP** hoặc **CA** trong phạm vi phân tán.
    - **Chi tiết**:
        - Cố gắng cân bằng cả 3, nhưng thường ưu tiên nhất quán (C) và chịu phân vùng (P), dùng giao thức phức tạp như Paxos hoặc Raft.
    - **Ví dụ**: Google Spanner dùng đồng hồ nguyên tử để đảm bảo C trong hệ thống phân tán.

## What is `parameterized statement` (in Java it's `prepared statement`)? How does it work **internally**?

- Định nghĩa
    - **Parameterized Statement** (trong Java gọi là `PreparedStatement`) là một loại câu truy vấn SQL được chuẩn bị trước (precompiled) với các tham số (parameters) thay vì giá trị cố định, giúp an toàn và hiệu quả hơn.
    - **Mục đích**:
        - Ngăn chặn SQL injection.
        - Tăng hiệu suất khi chạy cùng truy vấn nhiều lần.
- Cách Hoạt Động Nội Bộ
    - **Bước 1: Chuẩn bị (Prepare)**:
        - Truy vấn được gửi đến database với các placeholder (dấu `?`) thay cho giá trị thực.
        - Database **compile** truy vấn này thành một kế hoạch thực thi (execution plan), lưu trữ trên server.
        - Ví dụ: `SELECT * FROM users WHERE id = ? AND name = ?`.
    - **Bước 2: Gán tham số (Bind)**:
        - Giá trị thực được gán vào placeholder (qua `setInt`, `setString` trong Java).
        - Database không cần parse lại truy vấn, chỉ thay giá trị vào kế hoạch đã compile.
    - **Bước 3: Thực thi (Execute)**:
        - Database chạy kế hoạch thực thi với giá trị đã gán, trả kết quả.
- **Ví dụ (Java)**:

    ```java
    import java.sql.*;
    
    public class Main {
        public static void main(String[] args) throws SQLException {
            Connection conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/mydb", "user", "pass");
            String sql = "SELECT * FROM users WHERE id = ? AND name = ?";
            PreparedStatement stmt = conn.prepareStatement(sql); // Chuẩn bị
            stmt.setInt(1, 123); // Gán tham số 1
            stmt.setString(2, "Nam"); // Gán tham số 2
            ResultSet rs = stmt.executeQuery(); // Thực thi
            while (rs.next()) {
                System.out.println(rs.getString("name"));
            }
            conn.close();
        }
    }
    ```

    - Database (như MySQL) lưu kế hoạch thực thi dưới dạng **statement handle**.
    - Mỗi lần gọi execute, chỉ cần gửi tham số qua giao thức (như MySQL binary protocol), không cần parse lại SQL.

---

### What is `SQL injection`? how to avoid it?

- SQL Injection Là Gì?
    - **Định nghĩa**: Là một kỹ thuật tấn công mà kẻ xấu chèn mã SQL độc hại vào truy vấn, thường qua dữ liệu người dùng (như form nhập liệu).
    - **Ví dụ**:
        - Truy vấn: `SELECT * FROM users WHERE username = 'user' AND password = 'pass'`.
        - Nếu người dùng nhập pass là `' OR '1'='1`:
            - Truy vấn thành:
              `SELECT * FROM users WHERE username = 'user' AND password = '' OR '1'='1'`.
            - Kết quả: Đăng nhập thành công mà không cần mật khẩu đúng.
    - **Hậu quả**: Lộ dữ liệu, xóa database, hoặc chiếm quyền.
- Cách Tránh SQL Injection
    - **Dùng Parameterized Statement**:
        - Thay vì nối chuỗi (string concatenation), dùng placeholder (`?`) và gán giá trị qua API.
        - Database xử lý tham số riêng, không coi chúng là mã SQL → không thể chèn lệnh.
    - **Ví dụ an toàn**:

        ```java
        String sql = "SELECT * FROM users WHERE username = ? AND password = ?";
        PreparedStatement stmt = conn.prepareStatement(sql);
        stmt.setString(1, username);
        stmt.setString(2, password);
        ```

    - **Các cách khác**:
        - **Input Validation**: Kiểm tra dữ liệu đầu vào (ví dụ: chỉ cho phép ký tự chữ/số).
        - **ORM**: Dùng framework như Hibernate, tự động xử lý an toàn.

### How many "requests" you have to send to `Database` in a single `prepared statement` query?

- **Số lượng request gồm 2 request chính**:
    1. **Compile (Chuẩn bị)**: Gửi truy vấn với placeholder (`?`) để database parse và tạo execution plan.
    2. **Execute (Thực thi)**: Gửi tham số và yêu cầu chạy kế hoạch đã compile.
- **Chi tiết**:
    - Khi gọi `conn.prepareStatement(sql)`, một request được gửi để compile.
    - Khi gọi `stmt.executeQuery()`, một request khác gửi tham số và thực thi.
- **Ví dụ**:
    - `SELECT * FROM users WHERE id = ?`:
        - Request 1: Gửi truy vấn để compile.
        - Request 2: Gửi `id = 123` để thực thi.
- **Lưu ý**: Nếu tái sử dụng PreparedStatement, chỉ cần một lần compile, sau đó mỗi lần execute là một request.

### Can you reuse the `compiled` query multiple times?

- Câu trả lời là có, PreparedStatement được thiết kế để tái sử dụng.
- **Cách làm**: Sau khi compile truy vấn, mày có thể gọi execute nhiều lần với tham số khác nhau mà không cần compile lại.
- **Ví dụ**:

    ```java
    PreparedStatement stmt = conn.prepareStatement("INSERT INTO users (id, name) VALUES (?, ?)");
    stmt.setInt(1, 1);
    stmt.setString(2, "Nam");
    stmt.executeUpdate(); // Lần 1
    
    stmt.setInt(1, 2);
    stmt.setString(2, "Lan");
    stmt.executeUpdate(); // Lần 2, không cần compile lại
    ```

- Có Giúp Tăng Tốc Ứng Dụng Không?
    - Câu trả lời là có, tái sử dụng giúp tăng tốc đáng kể.
    - **Lý do**:
        1. **Giảm thời gian parse**: Database không cần phân tích cú pháp (parse) và tối ưu truy vấn mỗi lần.
        2. **Giảm request**: Chỉ gửi tham số, không gửi toàn bộ truy vấn.
        3. **Tối ưu giao thức**: Dùng giao thức nhị phân (binary protocol), nhanh hơn gửi chuỗi SQL.
    - **Ví dụ thực tế**: Thêm 10,000 người dùng:
        - Không dùng PreparedStatement: 10,000 lần parse → chậm.
        - Dùng PreparedStatement: 1 lần parse, 10,000 lần execute → nhanh hơn 2-3 lần.
    - **Lưu ý**: Hiệu quả rõ rệt khi truy vấn lặp lại nhiều lần (như batch insert).

## How indexing works internally?

- **Indexing** là kỹ thuật tạo cấu trúc dữ liệu (index) để tăng tốc độ truy vấn trong cơ sở dữ liệu, giúp tìm kiếm và truy cập dữ liệu nhanh hơn mà không cần quét toàn bộ bảng (full table scan).
- **Cách Hoạt Động Nội Bộ:**
    - **Tạo Index:** Khi tạo index trên một cột (hoặc nhiều cột), database xây dựng một cấu trúc dữ liệu riêng (thường là cây hoặc bảng băm) chứa giá trị của cột đó và con trỏ (pointer) đến hàng dữ liệu tương ứng trong bảng.
    - **Truy vấn:** Khi chạy truy vấn (như `SELECT * FROM users WHERE age = 5`), database không quét toàn bảng mà tra cứu trong index để tìm vị trí dữ liệu nhanh hơn.
    - **Cập nhật**: Mỗi khi dữ liệu trong bảng thay đổi (INSERT, UPDATE, DELETE), index cũng được cập nhật để giữ đồng bộ.
- **Ví dụ:**
    - Bảng `users`:

        ```
        id | name  | age
        1  | Nam   | 25
        2  | Lan   | 30
        3  | Hùng  | 25
        ```

    - Tạo index trên cột `age`:
        - Index lưu: `25 → [row 1, row 3], 30 → [row 2]`.
        - Truy vấn `WHERE age = 25` → database tra index, lấy ngay row 1 và 3.

### What algorithm and data structure `indexing` used? And why?

- **Cấu Trúc Dữ Liệu**
    - **B-Tree (hoặc B+ Tree)**:
        - **Phổ biến nhất**: Dùng trong hầu hết database quan hệ (MySQL, PostgreSQL).
        - **Cấu trúc**: Cây cân bằng, mỗi node chứa nhiều key và con trỏ.
        - **Tại sao?**:
            - Hỗ trợ tìm kiếm nhanh: O(log n).
            - Hỗ trợ phạm vi (range query): `WHERE age > 5`.
            - Tối ưu cho đĩa: Giảm số lần đọc/ghi (I/O) vì node chứa nhiều key.
    - **Hash Index**:
        - **Dùng cho**: Tìm kiếm chính xác (exact match), như `WHERE age = 5`.
        - **Cấu trúc**: Bảng băm (hash table), ánh xạ key thành vị trí.
        - **Tại sao?**:
            - Nhanh cho tìm kiếm chính xác: O(1).
            - Không tốt cho phạm vi (range query) vì không có thứ tự.
    - **Bitmap Index**:
        - **Dùng cho**: Cột có ít giá trị khác nhau (low cardinality), như `gender`.
        - **Cấu trúc**: Dùng bit để biểu diễn giá trị (0/1).
        - **Tại sao?**: Nhỏ gọn, tốt cho truy vấn phức tạp (AND, OR).
- **Thuật Toán**
    - **Tìm kiếm trên B-Tree**: Dùng thuật toán tìm kiếm nhị phân trong node, sau đó duyệt cây → O(log n).
    - **Hashing**: Dùng hàm băm (hash function) để ánh xạ key → O(1).
- **Tại Sao Chọn B-Tree?**
    - **Linh hoạt**: Hỗ trợ cả tìm kiếm chính xác (`=`) và phạm vi (`>`, `<`, `BETWEEN`).
    - **Hiệu quả**: Cân bằng giữa tốc độ và chi phí lưu trữ.
    - **Tối ưu I/O**: Database thường đọc dữ liệu từ đĩa, B-Tree giảm số lần I/O.

### How `composite indexing` works?

- **Composite Index** (index tổng hợp) là index trên nhiều cột (multi-column index), giúp tăng tốc truy vấn liên quan đến nhiều điều kiện.
- **Cách Hoạt Động**
    - **Tạo Index**:
        - Tạo index trên nhiều cột, ví dụ: `CREATE INDEX idx_composite ON users(age, name)`.
        - Database xây dựng B-Tree với key là **tuple** `(age, name)`.
    - **Sắp xếp**:
        - Index sắp xếp theo cột đầu tiên (`age`), sau đó trong mỗi giá trị `age`, sắp xếp theo cột thứ hai (`name`).
    - **Truy vấn**:
        - Hữu ích khi truy vấn dùng các cột trong index theo thứ tự từ trái sang phải.
        - Ví dụ: `WHERE age = 25 AND name = 'Nam'` → dùng index.
        - Nhưng `WHERE name = 'Nam'` → không dùng index (vì cột đầu không có).
- **Ví dụ**
    - Bảng `users`:

        ```
        id | name  | age
        1  | Nam   | 25
        2  | Lan   | 25
        3  | Hùng  | 30
        ```

    - Index trên `(age, name)`:
        - B-Tree: `(25, Lan) → row 2, (25, Nam) → row 1, (30, Hùng) → row 3`.
        - Truy vấn `WHERE age = 25 AND name = 'Nam'` → tìm `(25, Nam)` trong B-Tree → lấy row 1.

### How to know your query is using index?

- **Cách Kiểm Tra**
    - **Dùng EXPLAIN (hoặc EXPLAIN PLAN)**: Hầu hết database (MySQL, PostgreSQL) hỗ trợ lệnh EXPLAIN để xem kế hoạch thực thi (execution plan).
    - **Ví dụ (MySQL)**:

        ```sql
        EXPLAIN SELECT * FROM users WHERE age = 25;
        ```

    - Kết quả mẫu:

        ```
        id | select_type | table | type  | possible_keys | key     | rows | Extra
        1  | SIMPLE      | users | ref   | idx_age       | idx_age | 2    | Using where
        ```

        - `key: idx_age` → Truy vấn dùng index `idx_age`.
        - `type: ref` → Tìm kiếm chính xác (good).
        - Nếu `type: ALL` → Full table scan (không dùng index).
- **Dấu Hiệu Không Dùng Index**
    - Dùng hàm trên cột: `WHERE UPPER(name) = 'NAM'`.
    - Không dùng cột đầu trong composite index: `WHERE name = 'Nam'` (index là `(age, name)`).
    - Dùng toán tử không hỗ trợ: `WHERE age != 25` (ít database hỗ trợ).

### How index work in this case: `WHERE age = 5` and `Where age > 5`? The complexity to go to the next record?

- **Trường Hợp `WHERE age = 5`**
    - **Cách hoạt động**:
        - Index (B-Tree) tìm `age = 5` bằng cách duyệt cây: O(log n).
        - Sau khi tìm được, trả về tất cả bản ghi khớp (có thể nhiều bản ghi).
    - **Độ phức tạp**:
        - Tìm: O(log n).
        - Lấy bản ghi tiếp theo: O(1) (vì B-Tree lưu con trỏ liên tiếp).
- **Trường Hợp `WHERE age > 5`**
    - **Cách hoạt động**:
        - Index tìm giá trị nhỏ nhất lớn hơn 5: O(log n).
        - Sau đó, duyệt tuần tự qua các giá trị lớn hơn trong B-Tree.
    - **Độ phức tạp**:
        - Tìm giá trị đầu: O(log n).
        - Lấy bản ghi tiếp theo: O(1) (B-Tree có liên kết tuần tự trong lá).
    - **Ví dụ**:
        - Index: `5 → [row 1], 6 → [row 2], 7 → [row 3]`.
        - `WHERE age > 5` → Bắt đầu từ `6`, duyệt tiếp `7` → O(1) mỗi bước.
- Cả hai đều hiệu quả nhờ B-Tree, nhưng `age > 5` có thể trả về nhiều bản ghi hơn, cần duyệt thêm.

### Indexing with char?

- **Cách Hoạt Động**
    - **Tạo Index**:
        - Index trên cột `CHAR` hoặc `VARCHAR` cũng dùng B-Tree (hoặc Hash nếu chỉ tìm chính xác).
        - Chuỗi được so sánh theo thứ tự từ điển (lexicographical order).
    - **Ví dụ**:
        - Bảng `users`:

            ```
            id | name
            1  | Nam
            2  | Lan
            3  | Hùng
            ```

        - Index trên `name`:
            - B-Tree: `Hùng → row 3, Lan → row 2, Nam → row 1`.
            - Truy vấn `WHERE name = 'Nam'` → tìm trong B-Tree → O(log n).
- **Lưu Ý**
    - **Hiệu suất**:
        - Chuỗi dài làm tăng kích thước index, chậm hơn số (int).
        - Dùng **prefix index** để tiết kiệm: `CREATE INDEX idx_name ON users(name(10))` (chỉ index 10 ký tự đầu).
    - **So sánh**:
        - Database có thể dùng collation (quy tắc so sánh) để xử lý ký tự (như không phân biệt hoa/thường).
    - **Hạn chế**:
        - Truy vấn `LIKE '%text%'` không dùng index (vì bắt đầu bằng wildcard).
        - `LIKE 'text%'` có thể dùng index (vì bắt đầu cố định).

## The complexity of SQL query? How to measure it? How SQL optimize a query?

- **Độ Phức Tạp Của SQL**
    - **Định nghĩa**: Độ phức tạp của truy vấn SQL là số lượng tài nguyên (CPU, I/O, bộ nhớ) cần để thực thi truy vấn, thường đo bằng số hàng (rows) hoặc trang (pages) cần truy cập.
    - **Yếu tố ảnh hưởng**:
        - Kích thước bảng (số hàng, số cột).
        - Có index hay không.
        - Loại truy vấn (SELECT, JOIN, ORDER BY, v.v.).
- **Cách Đo Lường**
    - **Dùng EXPLAIN/EXPLAIN PLAN**:
        - Hiển thị kế hoạch thực thi (execution plan) của database.
        - Ví dụ (MySQL):

            ```sql
            EXPLAIN SELECT * FROM users WHERE age = 25;
            ```

          Kết quả: Cho biết số hàng dự kiến quét (`rows`), loại truy vấn (`type`), và index được dùng (`key`).

    - **Dùng Công Cụ Hiệu Suất:**
        - MySQL: `SHOW PROFILE` (xem thời gian CPU, I/O).
        - PostgreSQL: `EXPLAIN ANALYZE` (thời gian thực tế).
    - **Đo Thời Gian Thực Thi**:
        - Dùng `BENCHMARK` (MySQL) hoặc đo thủ công:

            ```sql
            SELECT BENCHMARK(1000, (SELECT * FROM users WHERE age = 25));
            ```

    - **Số I/O**:
        - Đo số trang (pages) đọc từ đĩa, vì I/O thường là yếu tố chậm nhất.
- **SQL Tối Ưu Hóa Truy Vấn Như Thế Nào?**
    - Query Optimizer là bộ tối ưu truy vấn (query optimizer) trong database (như MySQL, PostgreSQL) phân tích truy vấn và chọn kế hoạch thực thi tốt nhất.
    - **Cách hoạt động**
        1. **Parse**: Phân tích cú pháp truy vấn.
        2. **Rewrite**: Viết lại truy vấn để tối ưu (ví dụ: loại bỏ điều kiện dư thừa).
        3. **Optimize**: Chọn kế hoạch thực thi dựa trên:
            - Thống kê (statistics): Số hàng, phân bố dữ liệu.
            - Index: Có index nào dùng được không.
            - Chi phí (cost): Ước tính I/O, CPU.
        4. **Execute**: Thực thi kế hoạch.
    - **Ví Dụ Tối Ưu**
        - Truy vấn: `SELECT * FROM users WHERE age = 25 AND id > 100`.
        - **Không index**: Quét toàn bảng → O(n).
        - **Có index trên `age`**: Tìm `age = 25` qua B-Tree (O(log n)), sau đó lọc `id > 100`.

---

### Compare `WHERE id = 'a' AND id = 'b' AND id = 'c'` vs `WHERE id in (a, b, c)`?

- So Sánh
    - **Cú pháp**:
        - `WHERE id = 'a' AND id = 'b' AND id = 'c'`:
            - Điều kiện này **luôn sai** vì một cột không thể có nhiều giá trị cùng lúc (`id` không thể vừa là `'a'`, vừa là `'b'`, vừa là `'c'`).
            - Database tối ưu hóa: Nhận ra điều kiện không thể thỏa mãn → trả về 0 hàng mà không quét bảng.
        - `WHERE id IN ('a', 'b', 'c')`:
            - Tương đương với `WHERE id = 'a' OR id = 'b' OR id = 'c'`.
            - Database tìm các hàng có id khớp với bất kỳ giá trị nào trong danh sách.
- Độ Phức Tạp
    - **AND**:
        - Độ phức tạp: O(1) (vì điều kiện không thể thỏa mãn, database không quét bảng).
    - **IN**:
        - Có index trên `id`: Database tìm từng giá trị qua B-Tree → O(k log n), với `k` là số giá trị (ở đây `k = 3`).
        - Không index: Quét toàn bảng → O(n).
- Kết Luận
    - `AND` không có ý nghĩa thực tế (luôn trả về 0 hàng).
    - `IN` là cách đúng để kiểm tra nhiều giá trị, hiệu quả hơn nếu có index.

### Complexity of this query `SELECT * FROM abc ORDER BY name LIMIT 10 OFFSET 1000000`. SELECT 10 record from offset $10^6$ after sort by name (which is a char)? How to optimize it?

- **Giải thích truy Vấn**
    - Sắp xếp toàn bộ bảng `abc` theo cột `name` (kiểu `CHAR`).
    - Bỏ qua 1,000,000 bản ghi đầu (OFFSET), lấy 10 bản ghi tiếp theo (LIMIT).
- **Độ Phức Tạp**
    - **Sắp xếp**:
        - Database phải sắp xếp toàn bộ bảng trước: O(n log n), với `n` là số hàng.
        - Cột `name` là `CHAR`, so sánh chuỗi chậm hơn số (int).
    - **OFFSET và LIMIT**:
        - Database phải duyệt qua 1,000,000 bản ghi để bỏ qua → O(n).
        - Lấy 10 bản ghi: O(1).
    - **Tổng độ phức tạp**:
        - O(n log n) (sắp xếp) + O(n) (duyệt OFFSET) ≈ O(n log n).
    - **Vấn đề**:
        - OFFSET lớn (1,000,000) gây chậm vì phải duyệt qua tất cả bản ghi trước đó, dù không cần.
- **Cách Tối Ưu**
    - **Dùng Index**:
        - Tạo index trên `name`: `CREATE INDEX idx_name ON abc(name)`.
        - Index là B-Tree, đã sắp xếp sẵn → không cần `ORDER BY` toàn bảng.
        - Độ phức tạp: O(log n) để tìm vị trí OFFSET, O(1) để lấy 10 bản ghi.
    - **Tránh OFFSET lớn**:
        - Thay vì OFFSET, dùng điều kiện trên cột đã sắp xếp:

            ```sql
            SELECT * FROM abc WHERE name > (SELECT name FROM abc ORDER BY name LIMIT 1 OFFSET 999999) ORDER BY name LIMIT 10;
            ```

            - Tìm giá trị name tại vị trí 1,000,000 → O(log n) nếu có index.
            - Lấy 10 bản ghi tiếp theo → O(1).
- **Kết quả tối ưu**:
    - Độ phức tạp giảm từ O(n log n) xuống O(log n).

### What is the complexity of `COUNT(*)` query?

- **Độ Phức Tạp**
    - **Không index**:
        - Database quét toàn bảng để đếm số hàng → O(n).
    - **Có index**:
        - Nếu có index trên cột (như primary key), database dùng index để đếm → O(log n) (với B-Tree).
        - Một số database (như MySQL với InnoDB) lưu số hàng trong metadata → O(1).
    - **Ví dụ**: `SELECT COUNT(*) FROM users`:
        - Không index: Quét toàn bảng → O(n).
        - Có index trên id: Đếm qua B-Tree → O(log n).
- **Lưu Ý**
    - `COUNT(*)` nhanh hơn `COUNT(column)` vì không cần kiểm tra giá trị NULL.

### How to write query to avoid full table scan?

- Full Table Scan Là Gì? Database quét toàn bộ bảng (mọi hàng) → O(n), rất chậm với bảng lớn.
- Cách Tránh
    - **Dùng Index**:
        - Tạo index trên cột trong `WHERE`, `JOIN`, `ORDER BY`.
        - Ví dụ: `SELECT * FROM users WHERE age = 25` → index trên age.
    - **Hạn Chế Dữ Liệu**:
        - Dùng `WHERE` để lọc sớm: `SELECT * FROM users WHERE id > 100 AND id < 200`.
    - **Tránh Hàm Trên Cột**:
        - Sai: `WHERE UPPER(name) = 'NAM'` → không dùng index.
        - Đúng: `WHERE name = 'nam'` → dùng index (dùng collation nếu cần).
    - **Dùng LIMIT**:
        - Giới hạn số hàng trả về: `SELECT * FROM users LIMIT 10`.
    - **Tối Ưu JOIN**:
        - Đảm bảo cột trong `ON` có index: `SELECT * FROM users u JOIN orders o ON u.id = o.user_id`.

### Complexity of JOIN, INNER JOIN, OUTTER JOIN?

- **JOIN (Tổng Quát)**
    - **Cách hoạt động**: Kết hợp dữ liệu từ hai bảng dựa trên điều kiện (thường trong `ON`).
    - **Độ phức tạp**:
        - Phụ thuộc vào thuật toán JOIN:
            - **Nested Loop Join**: O(n * m) (n, m là số hàng của hai bảng).
            - **Hash Join**: O(n + m) (xây bảng băm cho bảng nhỏ, quét bảng lớn).
            - **Merge Join**: O($n \log n$ + $m \log m$) (sắp xếp trước, gộp).
- **INNER JOIN**
    - **Là gì?**: Chỉ lấy hàng khớp ở cả hai bảng.
    - **Độ phức tạp**:
        - Có index trên cột JOIN: O(n log m) (n là số hàng bảng nhỏ, m là số hàng bảng lớn).
        - Không index: O(n * m) (nested loop).
    - **Ví dụ**:
        - `SELECT * FROM users u INNER JOIN orders o ON u.id = o.user_id`:
            - Index trên `user_id`: O($n \log m$).
            - Không index: O(n * m).
- **OUTER JOIN (LEFT/RIGHT/FULL)**
    - **Là gì?**: Lấy tất cả hàng từ một bảng (hoặc cả hai), kể cả không khớp.
    - **Độ phức tạp**:
        - Tương tự INNER JOIN, nhưng thêm chi phí xử lý hàng không khớp.
        - Có index: O($n \log m$).
        - Không index: O(n * m).
    - **Lưu ý**:
        - OUTER JOIN thường chậm hơn INNER JOIN vì phải xử lý thêm hàng `NULL`.

## What is Database Replicating? When we need it?

- **Định nghĩa**
    - **Database Replication** (Sao chép cơ sở dữ liệu) là quá trình sao chép và đồng bộ dữ liệu từ một cơ sở dữ liệu chính (**Master**) sang một hoặc nhiều cơ sở dữ liệu phụ (**Slave**).
    - **Mục đích** tạo bản sao dữ liệu để tăng tính khả dụng (availability), chịu lỗi (fault tolerance), và hiệu suất (performance).
- **Khi Nào Cần Dùng?**
    - **Tăng hiệu suất đọc (Read Scalability)**:
        - Master xử lý ghi (write), Slave xử lý đọc (read) → giảm tải cho Master.
        - Ví dụ: Web app có nhiều truy vấn đọc (SELECT) → dùng Slave để phân tải.
    - **Chịu lỗi (High Availability)**:
        - Nếu Master gặp sự cố, Slave có thể thay thế (failover).
        - Ví dụ: Slave được dùng làm bản sao dự phòng (standby).
    - **Phân tích dữ liệu (Analytics)**:
        - Chạy báo cáo hoặc phân tích trên Slave để không ảnh hưởng Master.
        - Ví dụ: Báo cáo doanh thu hàng ngày chạy trên Slave.
    - **Sao lưu (Backup)**:
        - Slave giữ bản sao dữ liệu, dùng để khôi phục nếu Master mất dữ liệu.
    - **Phân tán địa lý (Geographic Distribution)**:
        - Slave ở gần người dùng hơn → giảm độ trễ (latency).
        - Ví dụ: Slave ở Việt Nam phục vụ người dùng VN, Master ở Mỹ.

---

### What is `bin log`? How `Master DB` sync with `Slave DB`?

- **Bin Log Là Gì?**
    - **Binary Log** (bin log) là file nhật ký nhị phân trong database (như MySQL), ghi lại mọi thay đổi dữ liệu (INSERT, UPDATE, DELETE) trên Master.
    - **Mục đích** dùng để sao chép (replication) và khôi phục (recovery).
    - **Nội dung**:
        - Ghi lại các sự kiện (event) như câu lệnh SQL hoặc thay đổi dữ liệu (row-level changes).
        - Ví dụ: `INSERT INTO users VALUES (1, 'Nam')` → bin log ghi sự kiện này.
- **Master DB Đồng Bộ Với Slave DB Như Thế Nào?**
    - **Quy trình (MySQL Replication)**:
        1. **Master Ghi Bin Log**:

           Mỗi thay đổi (INSERT, UPDATE, DELETE) được ghi vào bin log trên Master.

        2. **Slave Kết Nối Với Master**:

           Slave dùng tài khoản replication để kết nối Master, yêu cầu bin log.

        3. **Master Gửi Bin Log**:

           Master gửi các sự kiện bin log (từ vị trí cụ thể) qua mạng đến Slave.

        4. **Slave Lưu Relay Log**:

           Slave nhận bin log, lưu vào **relay log** (bản sao cục bộ).

        5. **Slave Áp Dụng Thay Đổi**:

           Slave đọc relay log, thực thi lại các sự kiện (replay) để đồng bộ dữ liệu.

    - **Ví dụ**:
        - Master: `INSERT INTO users VALUES (1, 'Nam')`.
        - Bin log ghi: `INSERT event`.
        - Slave nhận, chạy lại `INSERT` → dữ liệu đồng bộ.
    - Chi Tiết Kỹ Thuật
        - **Vị trí Bin Log**:
            - Bin log được đánh số (như `binlog.000001`) và có vị trí (position).
            - Slave theo dõi vị trí đã đọc để không bỏ sót sự kiện.
        - **Thread trên Slave**:
            - **I/O Thread**: Kết nối Master, nhận bin log, lưu vào relay log.
            - **SQL Thread**: Đọc relay log, áp dụng thay đổi.

### Can a `Slave DB` be a slave of another `Slave DB` (we do not need to sync from `Master DB` directly)?

- Đáp Án là Có, Slave DB có thể là Slave của một Slave khác. Đây gọi là **multi-level replication** hoặc **cascading replication**.
- **Cách Hoạt Động**
    - **Cấu trúc**:
        - Master → Slave 1 → Slave 2.
        - Slave 1 vừa là Slave của Master, vừa là Master của Slave 2.
    - **Quy trình**:
        1. Master gửi bin log đến Slave 1.
        2. Slave 1 áp dụng thay đổi, đồng thời ghi bin log của chính nó (nếu bật `log-slave-updates` trong MySQL).
        3. Slave 2 kết nối Slave 1, nhận bin log từ Slave 1, áp dụng thay đổi.
    - **Ví dụ**:
        - Master: `INSERT INTO users VALUES (1, 'Nam')`.
        - Slave 1 đồng bộ từ Master.
        - Slave 2 đồng bộ từ Slave 1.
- **Lợi Ích**
    - **Giảm tải Master**: Master không cần gửi bin log cho nhiều Slave, chỉ gửi cho Slave 1.
    - **Phân tán địa lý**: Slave 1 ở VN, Slave 2 ở Singapore → Slave 2 đồng bộ từ Slave 1 (gần hơn) thay vì Master (ở Mỹ).
- **Hạn Chế**
    - **Độ trễ tăng**: Dữ liệu từ Master → Slave 1 → Slave 2 → trễ hơn so với đồng bộ trực tiếp.
    - **Phức tạp**: Quản lý cấu hình khó hơn, dễ lỗi nếu Slave 1 gặp sự cố.

## What is Database Sharding? When we need it?

- **Định nghĩa**
    - **Database Sharding** (Phân mảnh cơ sở dữ liệu) là kỹ thuật chia dữ liệu trong một cơ sở dữ liệu thành các phần nhỏ (shards) và lưu trữ trên nhiều server (hoặc bảng) để tăng hiệu suất và khả năng mở rộng.
    - **Mục đích**: Phân tán dữ liệu để xử lý khối lượng lớn (big data) mà một server không thể đáp ứng.
- **Khi Nào Cần Dùng?**
    - **Dữ liệu quá lớn**:
        - Một bảng có hàng tỷ bản ghi → quét chậm, không đủ RAM/disk trên một server.
        - Ví dụ: Bảng `users` có 1 tỷ người dùng → chia thành 10 shard, mỗi shard 100 triệu.
    - **Tăng hiệu suất**:
        - Phân tải truy vấn (query) qua nhiều server → giảm thời gian phản hồi.
        - Ví dụ: Web app có 1 triệu truy vấn/giây → mỗi shard xử lý 100,000 truy vấn.
    - **Mở rộng ngang (Horizontal Scaling)**:
        - Thêm server mới để tăng dung lượng, thay vì nâng cấp server cũ (vertical scaling).
    - **Phân tán địa lý**:
        - Lưu shard gần người dùng để giảm độ trễ.
        - Ví dụ: Shard cho người dùng VN ở server VN, shard cho người dùng Mỹ ở server Mỹ.

---

### Which rule we can apply to DB Sharding?

- **Range Sharding (Phân mảnh theo phạm vi)**:
    - Chia dữ liệu theo phạm vi giá trị của một cột (shard key).
    - Ví dụ: Bảng `users`:
        - Shard 1: `id` từ 1 đến 1,000,000.
        - Shard 2: `id` từ 1,000,001 đến 2,000,000.
    - **Ưu**: Dễ triển khai, tốt cho truy vấn phạm vi (`WHERE id BETWEEN 500,000 AND 600,000`).
    - **Nhược**: Dễ mất cân bằng (hot shard) nếu dữ liệu tập trung vào một phạm vi.
- **Hash Sharding (Phân mảnh theo hàm băm)**:
    - Dùng hàm băm (hash function) trên shard key để quyết định shard.
    - Ví dụ: `shard = hash(id) % 4` → 4 shard.
    - **Ưu**: Phân bố đều, tránh hot shard.
    - **Nhược**: Khó truy vấn phạm vi (vì dữ liệu không theo thứ tự).
- **Directory-Based Sharding (Phân mảnh theo danh mục)**:
    - Dùng bảng ánh xạ (lookup table) để xác định shard.
    - Ví dụ: Bảng `users`:
        - Lookup: `user_id: 1 → shard 1, user_id: 2 → shard 2`.
    - **Ưu**: Linh hoạt, dễ thay đổi cách phân mảnh.
    - **Nhược**: Cần duy trì bảng ánh xạ, có thể là điểm nghẽn.
- **Geo Sharding (Phân mảnh theo địa lý)**:
    - Chia theo vị trí địa lý.
    - Ví dụ: Shard 1 cho người dùng VN, Shard 2 cho người dùng Mỹ.
    - **Ưu**: Giảm độ trễ.
    - **Nhược**: Khó xử lý nếu người dùng di chuyển.

### How to ensure `primary key` is globally unique when sharding?

- **Vấn Đề**: khi sharding, mỗi shard hoạt động độc lập → có thể tạo primary key trùng nhau (như id = 1 trên cả shard 1 và shard 2).
- **Cách Đảm Bảo**
    - **Dùng UUID (Universally Unique Identifier)**:
        - Tạo primary key dạng UUID (chuỗi 128-bit, gần như không trùng).
        - Ví dụ: `id = "550e8400-e29b-41d4-a716-446655440000"`.
        - **Ưu**: Độc lập, không cần phối hợp giữa các shard.
        - **Nhược**: Kích thước lớn (so với số), chậm hơn khi so sánh.
    - **Tăng Tự Động Với Offset (Auto-Increment with Offset)**:
        - Mỗi shard dùng dải `auto-increment` khác nhau.
        - Ví dụ:
            - Shard 1: `id` bắt đầu từ 1, tăng 1 (1, 2, 3, ...).
            - Shard 2: `id` bắt đầu từ 1,000,001, tăng 1 (1,000,001, 1,000,002, ...).
        - **Ưu**: Đơn giản, hiệu quả.
        - **Nhược**: Cần cấu hình trước, khó mở rộng nếu thêm shard.
    - **Dùng Dịch Vụ Tạo ID Toàn Cục**:
        - Dùng hệ thống trung tâm (như Snowflake ID) để tạo ID duy nhất.
        - Ví dụ: Snowflake ID kết hợp timestamp, machine ID, và sequence number.
        - **Ưu**: Đảm bảo duy nhất, hỗ trợ mở rộng.
        - **Nhược**: Phụ thuộc vào dịch vụ, có thể là điểm nghẽn.
    - **Kết Hợp Shard ID Với Primary Key**:
        - Thêm shard ID vào primary key.
        - Ví dụ: `id = (shard_id, local_id)` → `(1, 1)` trên shard 1, `(2, 1)` trên shard 2.
        - **Ưu**: Đơn giản, không cần dịch vụ bên ngoài.
        - **Nhược**: Cần thay đổi schema.

### How we can shard a table to multiple tables (same server) and multiple DB (multiple servers)?

- **Phân Mảnh Thành Nhiều Bảng (Cùng Server)**
    - **Cách làm**:
        - Chia bảng lớn thành nhiều bảng nhỏ dựa trên shard key.
        - Ví dụ: Bảng `users`:
            - Tạo `users_shard1` (id 1-1,000,000), `users_shard2` (id 1,000,001-2,000,000).
        - Dùng view hoặc logic ứng dụng để truy vấn đúng bảng.
    - **Ví dụ**:

        ```sql
        CREATE TABLE users_shard1 AS SELECT * FROM users WHERE id <= 1000000;
        CREATE TABLE users_shard2 AS SELECT * FROM users WHERE id > 1000000;
        ```

    - **Ưu**: Đơn giản, không cần nhiều server.
    - **Nhược**: Vẫn giới hạn bởi một server (không scale out).
- **Phân Mảnh Thành Nhiều DB (Nhiều Server)**
    - **Cách làm**:
        - Mỗi shard là một database riêng trên server riêng.
        - Ví dụ: Bảng `users`:
            - Shard 1: `users` trên server 1 (DB1).
            - Shard 2: `users` trên server 2 (DB2).
        - Ứng dụng (hoặc proxy) quyết định truy vấn shard nào.
    - **Ví dụ**:
        - Server 1: `mysql -h server1 -e "CREATE TABLE users (...)"`.
        - Server 2: `mysql -h server2 -e "CREATE TABLE users (...)"`.
    - **Ưu**: Scale out, tăng hiệu suất.
    - **Nhược**: Phức tạp hơn, cần quản lý nhiều server.

### How query can work when we sharding? for example query but the data is in different tables/dbs?

- Vấn Đề khi dữ liệu nằm ở nhiều shard (bảng hoặc DB), truy vấn như `SELECT * FROM users WHERE id = 123` cần biết shard nào chứa dữ liệu.
- **Cách Xử Lý**
    - **Ứng Dụng Quản Lý (Application-Level)**:

        ```java
        int shardId = hash(id) % 4;
        Connection conn = getConnectionForShard(shardId);
        PreparedStatement stmt = conn.prepareStatement("SELECT * FROM users WHERE id = ?");
        stmt.setInt(1, id);
        ```

        - Ứng dụng xác định shard dựa trên shard key.
        - Ví dụ: `shard = hash(id) % 4` → gửi truy vấn đến shard đúng.
    - **Dùng Proxy (Database Proxy)**:
        - Proxy (như MySQL Proxy, Vitess) đứng giữa ứng dụng và database, tự động định tuyến truy vấn.
        - Ví dụ: Vitess nhận `SELECT * FROM users WHERE id = 123`, tính shard, gửi đến server đúng.
    - **Truy Vấn Phân Tán (Distributed Query)**:
        - Nếu truy vấn cần dữ liệu từ nhiều shard (như `SELECT * FROM users ORDER BY name`), ứng dụng hoặc proxy gửi truy vấn đến tất cả shard, gộp kết quả.
        - Ví dụ:
            - Gửi `SELECT * FROM users` đến shard 1, shard 2.
            - Gộp kết quả, sắp xếp lại.
- **Hạn Chế**
    - **Truy vấn phức tạp**: `JOIN` giữa các shard khó, thường phải xử lý ở ứng dụng.
    - **Độ trễ**: Truy vấn nhiều shard → tăng thời gian (vì mạng, gộp kết quả).

## What is database transaction?

- **Định nghĩa**
    - **Database Transaction** (Giao dịch cơ sở dữ liệu) là một chuỗi thao tác (như INSERT, UPDATE, DELETE) được thực thi như một đơn vị công việc duy nhất, đảm bảo tính toàn vẹn dữ liệu.
    - **Mục đích**: Đảm bảo dữ liệu luôn ở trạng thái hợp lệ, ngay cả khi có lỗi xảy ra.
    - **Ví dụ**: Chuyển tiền: Trừ 100$ từ tài khoản A, cộng 100$ vào tài khoản B → cả hai thao tác phải thành công, hoặc không làm gì.
- **Cú pháp cơ bản (SQL)**

    ```sql
    BEGIN TRANSACTION;
    UPDATE accounts SET balance = balance - 100 WHERE id = 1;
    UPDATE accounts SET balance = balance + 100 WHERE id = 2;
    COMMIT; -- Xác nhận giao dịch
    -- Nếu lỗi: ROLLBACK; -- Hủy giao dịch
    ```


---

### How `rollback` works internally?

- **Rollback** là cơ chế hủy bỏ tất cả thay đổi trong giao dịch nếu có lỗi, đưa database về trạng thái trước khi giao dịch bắt đầu.
- **Cách Hoạt Động Nội Bộ**
    - **Ghi Log (Transaction Log)**:
        - Database ghi mọi thay đổi vào **transaction log** (write-ahead log) trước khi áp dụng lên dữ liệu thực.
        - Ví dụ: `UPDATE accounts SET balance = 900 WHERE id = 1` → log ghi: *"id=1, old_value=1000, new_value=900"*.
    - **Undo (Hoàn tác)**:
        - Khi rollback, database đọc log, áp dụng giá trị cũ (old value) để khôi phục.
        - Ví dụ: Rollback khôi phục `balance = 1000` cho `id=1`.
    - **Chi tiết kỹ thuật**:
        - Log được lưu trên đĩa (durable), đảm bảo không mất dữ liệu dù crash.
        - Database dùng **checkpoint** để đánh dấu trạng thái ổn định, giảm lượng log cần xử lý.
- Ví dụ

    ```sql
    BEGIN TRANSACTION;
    UPDATE accounts SET balance = 900 WHERE id = 1; -- Trừ 100
    -- Lỗi xảy ra
    ROLLBACK;
    ```

    - Log: *"id=1, old=1000, new=900"*.
    - Rollback: Đọc log, đặt lại `balance = 1000`.

### `ACID`? What is `dirty read`?

- **ACID** là tập hợp đặc tính đảm bảo giao dịch đáng tin cậy:
    - **Atomicity (Nguyên tử)**: Giao dịch là một đơn vị, hoặc hoàn tất toàn bộ, hoặc không làm gì.
        - Ví dụ: Chuyển tiền → cả trừ và cộng thành công, hoặc không làm gì.
    - **Consistency (Nhất quán)**: Giao dịch đưa database từ trạng thái hợp lệ sang trạng thái hợp lệ khác (tuân theo constraints, foreign key).
        - Ví dụ: `balance` không được âm.
    - **Isolation (Cô lập)**: Giao dịch chạy song song không ảnh hưởng lẫn nhau.
        - Ví dụ: Giao dịch A không thấy thay đổi của giao dịch B cho đến khi B commit.
    - **Durability (Bền vững)**: Sau khi commit, dữ liệu được lưu vĩnh viễn, dù hệ thống crash.
        - Ví dụ: Dùng transaction log để khôi phục sau crash.
- **Dirty Read Là Gì?**
    - **Dirty Read** xảy ra khi một giao dịch đọc dữ liệu chưa commit (uncommitted) từ giao dịch khác, và giao dịch kia sau đó rollback → dữ liệu đọc được là "bẩn" (không chính xác).
    - **Ví dụ**:
        - Giao dịch A: `UPDATE accounts SET balance = 900 WHERE id = 1` (chưa commit).
        - Giao dịch B: `SELECT balance FROM accounts WHERE id = 1` → thấy balance = 900.
        - Giao dịch A rollback → `balance` quay lại 1000 → B đã đọc dữ liệu sai.
    - **Cách tránh**: Dùng mức cô lập cao hơn (Isolation Level) như **Read Committed** hoặc **Serializable**.

### How transaction work when there are many concurrent requests?

- **Cách Hoạt Động**
    - **Concurrency Control (Kiểm soát đồng thời)**: Database dùng cơ chế để quản lý nhiều giao dịch đồng thời, đảm bảo tính cô lập (Isolation).
    - **Cơ chế phổ biến**:
        - **Locking (Khóa)**:
            - Giao dịch khóa tài nguyên (hàng, bảng) để ngăn giao dịch khác truy cập.
            - Ví dụ: Giao dịch A khóa hàng `id=1` → giao dịch B đợi.
        - **Multi-Version Concurrency Control (MVCC)**:
            - Tạo bản sao (version) của dữ liệu cho mỗi giao dịch.
            - Ví dụ (PostgreSQL): Giao dịch A sửa `balance`, giao dịch B đọc phiên bản cũ → không cần đợi.
    - **Isolation Levels**:
        - **Read Uncommitted**: Cho phép dirty read (ít cô lập nhất).
        - **Read Committed**: Chỉ đọc dữ liệu đã commit.
        - **Repeatable Read**: Đảm bảo dữ liệu không đổi trong giao dịch.
        - **Serializable**: Cô lập hoàn toàn, như chạy tuần tự.
- **Ví dụ** 100 yêu cầu đồng thời `UPDATE accounts SET balance = balance - 10 WHERE id = 1`:
    - **Locking**: Mỗi giao dịch khóa hàng `id=1`, thực thi lần lượt.
    - **MVCC**: Mỗi giao dịch thấy phiên bản riêng, database gộp thay đổi sau.

### How to avoid `race condition` in DB? `Read/Write` lock?

- **Race Condition Là Gì?**
    - **Định nghĩa**: Race condition xảy ra khi nhiều giao dịch truy cập cùng dữ liệu đồng thời, dẫn đến kết quả không mong muốn.
    - **Ví dụ**:
        - Giao dịch A: Đọc `balance = 1000`, trừ 100 → `balance = 900`.
        - Giao dịch B: Đọc `balance = 1000` (trước khi A commit), trừ 200 → `balance = 800`.
        - Kết quả: `balance = 800`, nhưng đúng phải là 700 (1000 - 100 - 200).
- **Cách Tránh Race Condition**
    - **Dùng Lock**:
        - **Read Lock (Shared Lock)**: Nhiều giao dịch có thể đọc cùng lúc, nhưng không ghi.
        - **Write Lock (Exclusive Lock)**: Chỉ một giao dịch được ghi, chặn cả đọc và ghi khác.
        - Ví dụ: Giao dịch A lấy write lock trên `id=1` → B đợi.
    - **Optimistic Locking**:
        - Không khóa trước, kiểm tra trước khi commit.
        - Ví dụ: Thêm cột `version`:

            ```sql
            UPDATE accounts SET balance = balance - 100, version = version + 1
            WHERE id = 1 AND version = 1;
            ```

          Nếu `version` thay đổi (do giao dịch khác), giao dịch thất bại → thử lại.

    - **Serializable Isolation**: Đảm bảo giao dịch chạy như tuần tự, tránh race condition.
    - **Dùng Transaction**: Đảm bảo toàn bộ thao tác trong giao dịch là nguyên tử.
- **Ví dụ truy vấn an toàn:**

    ```sql
    BEGIN TRANSACTION;
    SELECT balance FROM accounts WHERE id = 1 FOR UPDATE; -- Khóa hàng
    UPDATE accounts SET balance = balance - 100 WHERE id = 1;
    COMMIT;
    ```


### `Distributed transaction`? How to make a transaction when a query needs to access multiple DB?

- **Distributed Transaction Là Gì?**
    - **Định nghĩa**: Giao dịch phân tán là giao dịch liên quan đến nhiều cơ sở dữ liệu (thường trên nhiều server), cần đảm bảo tính toàn vẹn (ACID) trên toàn hệ thống.
    - **Ví dụ**: Chuyển tiền từ tài khoản A (DB1) sang tài khoản B (DB2).
- **Cách Thực Hiện (Two-Phase Commit - 2PC)**
    1. **Phase 1 (Prepare)**:
    - Coordinator (bộ điều phối) yêu cầu tất cả DB tham gia chuẩn bị (prepare) giao dịch.
    - Mỗi DB ghi log, khóa tài nguyên, trả lời "OK" hoặc "FAIL".
    1. **Phase 2 (Commit/Rollback)**:
    - Nếu tất cả DB trả "OK", coordinator yêu cầu commit.
    - Nếu có DB trả "FAIL", coordinator yêu cầu rollback.
- **Ví dụ**:
    - DB1: Trừ 100$ từ tài khoản A.
    - DB2: Cộng 100$ vào tài khoản B.
    - 2PC đảm bảo cả hai DB commit hoặc rollback cùng lúc.
- **Hạn Chế**
    - **Chậm**: Cần nhiều bước, tăng độ trễ (latency).
    - **Điểm lỗi**: Nếu coordinator crash giữa Phase 1 và 2, hệ thống có thể bị treo.
    - **Khóa lâu**: Tài nguyên bị khóa trong suốt 2PC, giảm hiệu suất.
- **Giải Pháp Thay Thế**
    - **Eventual Consistency**:
        - Không dùng 2PC, chấp nhận dữ liệu không nhất quán tạm thời.
        - Ví dụ: Dùng message queue (Kafka) để đồng bộ DB1 và DB2.
    - **Saga Pattern**:
        - Chia giao dịch thành các bước nhỏ, mỗi bước có thể rollback riêng.
        - Ví dụ: Trừ tiền → gửi message → cộng tiền → nếu lỗi, chạy bù trừ (compensating transaction).