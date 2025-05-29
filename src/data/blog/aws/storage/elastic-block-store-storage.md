---
author: thuongnn
pubDatetime: 2023-07-17T09:15:33Z
modDatetime: 2025-05-29T01:52:06Z
title: "[AWS] Amazon Elastic Block Store (EBS)"
folder: "aws"
draft: false
tags:
  - AWS
  - Amazon Web Services
description: Tìm hiểu về dịch vụ lưu trữ block của AWS, cung cấp dịch vụ lưu trữ cho EC2 instance.
---

Bài viết được tham khảo và tổng hợp lại từ Jayendra's Blog, xem bài viết gốc ở đây: https://jayendrapatil.com/aws-ebs.

## Table of contents

# **EC2 Elastic Block Storage – EBS**

- **Elastic Block Storage (EBS)** cung cấp các volume lưu trữ cấp khối có độ khả dụng cao, đáng tin cậy và bền vững, có thể gắn vào một instance EC2.
- EBS được khuyến nghị sử dụng làm thiết bị lưu trữ chính cho dữ liệu yêu cầu cập nhật thường xuyên và chi tiết, chẳng hạn như cơ sở dữ liệu hoặc hệ thống tệp.
- Một EBS volume có các đặc điểm sau:
  - Hoạt động như một thiết bị khối bên ngoài, chưa được định dạng, có thể gắn vào một instance EC2 tại một thời điểm.
  - Tồn tại độc lập với vòng đời của instance.
  - Là tài nguyên cấp vùng (Zonal), có thể gắn vào bất kỳ instance nào trong cùng **Availability Zone** và được sử dụng như một ổ cứng vật lý thông thường.
  - Đặc biệt phù hợp để làm **lưu trữ chính** cho hệ thống tệp, cơ sở dữ liệu hoặc các ứng dụng yêu cầu cập nhật dữ liệu chi tiết và truy cập vào lưu trữ cấp khối chưa định dạng.

# **Tính năng của Elastic Block Storage (EBS)**

- **Khả dụng trong Availability Zone (AZ):** EBS volumes được tạo trong một AZ cụ thể và có thể gắn vào bất kỳ instance nào trong cùng AZ đó.
- **Sao lưu bằng Snapshot:**
  - Volumes có thể được sao lưu bằng cách tạo **snapshot**, được lưu trữ trong **Amazon S3**.
  - Snapshot có thể được sử dụng để tạo volume mới và gắn vào một instance khác trong cùng khu vực (**Region**).
  - Để sử dụng volume ngoài AZ ban đầu, có thể tạo snapshot và khôi phục nó thành volume mới ở bất kỳ đâu trong khu vực đó.
  - Snapshots có thể được sao chép sang các **Region** khác và khôi phục thành volume mới, hỗ trợ **mở rộng địa lý, di chuyển trung tâm dữ liệu và khôi phục thảm họa**.
- **Mã hóa dữ liệu:**
  - Hỗ trợ **mã hóa EBS**, bảo vệ **dữ liệu khi lưu trữ (at rest), dữ liệu khi truyền tải (disk I/O), và các snapshots**.
  - **Mã hóa xảy ra trên instance EC2**, đảm bảo dữ liệu được bảo mật trong quá trình truyền từ EC2 sang EBS.
- **Elastic Volumes:**
  - Cho phép **tăng dung lượng, điều chỉnh hiệu suất, và thay đổi loại volume** một cách **động** mà không gây gián đoạn hoặc ảnh hưởng đến hiệu suất.
  - Có thể thay đổi kích thước, điều chỉnh **Provisioned IOPS**, và đổi loại volume ngay trên hệ thống đang chạy.
- **Hiệu suất của EBS Volumes:**
  - **General Purpose (SSD)** hỗ trợ tới **16,000 IOPS** và băng thông **250 MB/s**.
  - **Provisioned IOPS (SSD)** hỗ trợ tới **64,000 IOPS** và băng thông **1,000 MB/s**.

# **Lợi ích của EBS**

- Khả dụng dữ liệu (Data Availability)
  - Dữ liệu trong EBS được **tự động sao chép trong cùng một Availability Zone** để ngăn chặn mất dữ liệu do lỗi phần cứng.
- Tính bền vững của dữ liệu (Data Persistence)
  - **Tồn tại độc lập** với vòng đời của một EC2 instance.
  - **Dữ liệu vẫn được giữ nguyên** khi instance bị **dừng, khởi động lại hoặc reboot**.
  - **Root volume** mặc định sẽ bị xóa khi **instance bị terminate**, nhưng có thể thay đổi hành vi này bằng cách sử dụng **DeleteOnTermination flag**.
  - **Các volumes gắn kèm (attached volumes)** sẽ vẫn tồn tại ngay cả khi instance bị terminate.
- Mã hóa dữ liệu (Data Encryption)
  - EBS có thể được mã hóa bằng **EBS encryption feature**.
  - Sử dụng **mã hóa 256-bit AES-256** với **hạ tầng quản lý khóa (KMS) của Amazon**.
  - **Mã hóa xảy ra trên server EC2**, đảm bảo dữ liệu được mã hóa khi truyền từ EC2 sang EBS.
  - **Snapshots của các volumes được mã hóa cũng sẽ tự động được mã hóa**.
- Snapshots (Sao lưu dữ liệu)
  - Hỗ trợ **tạo snapshot (bản sao lưu)** cho bất kỳ EBS volume nào, lưu trữ trên **S3** với khả năng sao lưu dự phòng trên nhiều **Availability Zones**.
  - **Snapshots có thể dùng để tạo volume mới, mở rộng dung lượng hoặc nhân bản dữ liệu giữa các AZ hoặc Region**.
  - Là **bản sao lưu gia tăng (incremental backup)**, chỉ lưu lại dữ liệu đã thay đổi kể từ snapshot trước đó.
  - **Dung lượng snapshot có thể nhỏ hơn dung lượng volume** do dữ liệu được nén trước khi lưu trên S3.
  - **Chỉ cần giữ lại snapshot gần nhất** để có thể khôi phục volume đầy đủ.

# **EBS Volume Types**

![1.png](@/assets/images/aws/storage/elastic-block-store-storage/1.png)%201743fa6ae4838071ae93f555536b3400/image.png)

# **EBS Volume**

- **Tạo mới EBS Volume (EBS Volume Creation)**
  - Có thể tạo mới hoàn toàn **từ AWS Console hoặc qua dòng lệnh (CLI)** và gắn vào một EC2 instance trong cùng **Availability Zone**.
- **Khôi phục volume từ Snapshot (Restore Volume from Snapshots)**
  - Có thể tạo volume mới từ các **snapshots đã có**.
  - Volume được tải dữ liệu **một cách tự động và từ từ (lazy loading)**, không cần chờ tải toàn bộ dữ liệu từ **S3** trước khi sử dụng.
  - Nếu instance truy cập phần dữ liệu chưa tải về, EBS sẽ **tải ngay phần dữ liệu đó từ S3** và tiếp tục tải dữ liệu còn lại trong nền.
  - **Volumes từ snapshot được mã hóa sẽ luôn được mã hóa theo mặc định**.
  - Volumes có thể được tạo và gắn vào một **EC2 instance đang chạy** bằng cách **chỉ định block device mapping**.
- **Gỡ bỏ EBS Volume (EBS Volume Detachment)**
  - Volumes có thể bị gỡ khỏi instance **thủ công** hoặc khi **instance bị terminate**.
  - **Root volume** có thể được tháo bằng cách **dừng (stop) instance**.
  - **Data volumes** gắn vào một **instance đang chạy** phải được **gỡ bỏ (unmount) trước khi tháo**.
  - Nếu tháo volume mà không unmount, volume có thể bị **kẹt ở trạng thái bận (busy state)**, có nguy cơ làm hỏng hệ thống tệp hoặc mất dữ liệu.
  - Có thể **Force Detach**, nhưng có nguy cơ **mất dữ liệu hoặc làm hỏng hệ thống tệp**, do instance không có cơ hội **xóa cache hoặc metadata của hệ thống tệp**.
  - **Vẫn phải trả phí** cho volume ngay cả khi đã tháo khỏi instance.
- **Xóa EBS Volume (EBS Volume Deletion)**
  - **Xóa EBS Volume sẽ xóa hoàn toàn dữ liệu** và volume đó **không thể gắn vào bất kỳ instance nào khác**.
  - Có thể **sao lưu dữ liệu bằng snapshot** trước khi xóa để tránh mất dữ liệu.
- **Thay đổi kích thước và cấu hình EBS (EBS Volume Resize)**
  - **Elastic Volumes** cho phép **tăng dung lượng, thay đổi loại volume hoặc điều chỉnh hiệu suất** mà **không cần tháo volume hoặc khởi động lại instance** (nếu instance hỗ trợ Elastic Volumes).

# **EBS Volume Snapshots**

### Multi-Volume Snapshots – Snapshot nhiều volume cùng lúc

- Hỗ trợ **backup đồng bộ nhiều volume cùng lúc**, phù hợp với **các workload quan trọng như cơ sở dữ liệu lớn hoặc hệ thống tệp phức tạp**.
- Đảm bảo **tính nhất quán (crash-consistent snapshots)** mà **không cần dừng instance hoặc đồng bộ thủ công**.

### **Cách tạo EBS Snapshot**

- **Snapshots có thể được tạo định kỳ, ghi lại trạng thái dữ liệu tại một thời điểm (point-in-time snapshots)**.
- Snapshot **được thực hiện bất đồng bộ**: bản snapshot được tạo ngay lập tức, trong khi các block dữ liệu **được tải lên S3 dần dần**.
- **Snapshot có thể được tạo từ volume đang sử dụng**, nhưng chỉ ghi lại dữ liệu đã ghi vào volume tại thời điểm snapshot, **không bao gồm dữ liệu được cache bởi ứng dụng hoặc hệ điều hành**.

### **EBS Volume từ Snapshot**

- Volume mới **là bản sao y hệt của volume gốc tại thời điểm tạo snapshot**.
- **Dữ liệu được tải về nền (lazy loading)**, giúp volume có thể sử dụng ngay lập tức.
- Nếu truy cập phần dữ liệu chưa tải, volume **sẽ ngay lập tức tải phần đó từ S3**.

### **Xóa EBS Snapshot**

- Khi xóa snapshot, **chỉ dữ liệu duy nhất của snapshot đó bị xóa**, còn dữ liệu chung với các snapshot khác vẫn được giữ lại.
- Xóa snapshot cũ **không ảnh hưởng đến khả năng phục hồi dữ liệu từ các snapshot sau đó**.
- Không thể xóa snapshot của **root volume được sử dụng bởi AMI đã đăng ký**, cần **hủy đăng ký AMI trước** khi xóa snapshot.

### **Sao chép EBS Snapshot (Snapshot Copy)**

- **Snapshots chỉ có thể được sử dụng trong cùng một Region** nếu không sao chép chúng.
- **Snapshot có thể được sao chép sang Region khác** để mở rộng hệ thống, di chuyển dữ liệu hoặc phục hồi thảm họa.
- AWS sử dụng **mã hóa AES-256 để bảo vệ snapshot** khi sao chép.
- **Lần đầu sao chép snapshot sang Region khác sẽ là bản sao đầy đủ**, các lần sau chỉ sao chép gia tăng.
- Khi sao chép snapshot, có thể:
  - **Mã hóa snapshot không được mã hóa**.
  - **Sử dụng key mã hóa khác với bản gốc** (tạo snapshot mã hóa mới).

### **Chia sẻ EBS Snapshot (Snapshot Sharing)**

- Có thể chia sẻ snapshot với tài khoản AWS khác hoặc **công khai** bằng cách điều chỉnh quyền truy cập.
- **Không thể chia sẻ snapshot đã mã hóa công khai**, chỉ có thể chia sẻ với tài khoản AWS khác nếu **chia sẻ cả key mã hóa**.
- AWS **không cho phép chia sẻ snapshot mã hóa với key mặc định**.
- Người được chia sẻ snapshot có thể **sao chép và tạo volume mới từ snapshot đó** mà không ảnh hưởng đến bản gốc.

### **Mã hóa EBS Snapshot (Snapshot Encryption)**

- Snapshots của volume mã hóa sẽ luôn được mã hóa.
- Volume tạo từ snapshot mã hóa sẽ tự động được mã hóa.
- Dữ liệu di chuyển giữa EC2 và EBS luôn được mã hóa.
- Snapshots không mã hóa có thể được mã hóa trong quá trình sao chép.
- Snapshots đã mã hóa có thể được mã hóa lại với key khác trong quá trình sao chép.
- Snapshot đầu tiên của volume mã hóa từ snapshot không mã hóa luôn là snapshot đầy đủ.

# **Amazon EBS Multi-Attach**

- **EBS Multi-Attach** cho phép **một volume Provisioned IOPS SSD (io1 hoặc io2) được gắn vào nhiều EC2 instance cùng AZ**.
- Một **hoặc nhiều volume Multi-Attach** có thể được gắn vào **một hoặc nhiều instance**.
- **Tất cả các instance được gắn volume đều có quyền đọc và ghi đầy đủ**.
- **Tăng tính khả dụng của ứng dụng** cho các **ứng dụng Linux dạng cluster**, giúp quản lý các tác vụ ghi đồng thời.

### **Giới hạn và Lưu ý của Multi-Attach**

- Chỉ hỗ trợ trên Provisioned IOPS SSD (io1 hoặc io2).
- Gắn tối đa 16 instance Nitro cùng AZ.
- Hỗ trợ Windows, nhưng hệ điều hành không nhận diện dữ liệu được chia sẻ, gây mất nhất quán dữ liệu.
- Mỗi instance chỉ có thể gắn Multi-Attach volume vào một block device mapping.
- Nếu instance cuối cùng bị xóa và được cấu hình xóa volume, volume cũng sẽ bị xóa.
- Không thể tạo Multi-Attach volume làm boot volume.
- Không thể bật Multi-Attach khi khởi tạo instance bằng EC2 Console hoặc API RunInstances.
- Không hỗ trợ I/O fencing – giao thức kiểm soát truy cập ghi trong môi trường lưu trữ chia sẻ.
- Không thể bật/tắt Multi-Attach khi volume đang gắn vào instance.
- Tính năng Multi-Attach bị vô hiệu hóa theo mặc định.
