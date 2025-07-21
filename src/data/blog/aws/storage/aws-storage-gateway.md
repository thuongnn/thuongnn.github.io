---
author: thuongnn
pubDatetime: 2023-07-13T11:45:22Z
modDatetime: 2025-05-29T02:30:41Z
title: "[AWS] AWS Storage Gateway"
folder: "aws"
draft: true
tags:
  - AWS
  - Amazon Web Services
description: Tìm hiểu về dịch vụ kết nối môi trường on-premises với lưu trữ AWS Cloud một cách liền mạch.
ogImage: ../../../../assets/images/aws/storage/aws-storage-gateway/1.png
---

Bài viết được tham khảo và tổng hợp lại từ Jayendra's Blog, xem bài viết gốc ở đây: https://jayendrapatil.com/aws-storage-gateway.

## Table of contents

# Giới thiệu

- **AWS Storage Gateway** kết nối **các thiết bị lưu trữ tại chỗ (on-premises storage appliances)** với **AWS cloud storage**, giúp tích hợp liền mạch với các tính năng bảo mật dữ liệu.
- Đây là **dịch vụ lưu trữ hybrid cloud**, cho phép truy cập dữ liệu tại chỗ với **khả năng mở rộng gần như vô hạn** trên AWS.
- Lưu trữ dữ liệu trên **AWS cloud** giúp **giảm chi phí, mở rộng linh hoạt**, đồng thời **duy trì tính bảo mật**.
- Có thể triển khai dưới hai dạng:
  - **Tại chỗ (on-premises)**: Chạy như **máy ảo (VM appliance)**.
  - **Trên AWS**: Chạy như **EC2 instance** để **phục hồi sau thảm họa (disaster recovery)**, **sao chép dữ liệu (data mirroring)**, hoặc cung cấp **bộ lưu trữ cho ứng dụng EC2**.
- Bảo mật dữ liệu:
  - **Mã hóa dữ liệu trong quá trình truyền (data-in-transit encryption)** bằng **SSL**.
  - **Mã hóa dữ liệu lưu trữ (data-at-rest encryption)** trong **S3 hoặc Glacier** bằng **AES-256**.
- Các loại Storage Gateway
  - **File Gateway** 🗂️: Cung cấp lưu trữ file trên AWS S3 với giao diện NFS/SMB.
  - **Volume Gateway** 📦: Cung cấp **iSCSI block storage**, có thể chạy ở chế độ cached hoặc stored.
  - **Tape Gateway** 📼: Cung cấp **virtual tape library - VTL** để sao lưu và lưu trữ dữ liệu trên S3 Glacier.

# S3 File Gateway

![1.png](@/assets/images/aws/storage/aws-storage-gateway/1.png)

- **Cung cấp giao diện file** để lưu trữ và truy xuất dữ liệu trên **AWS S3**.
- **Hỗ trợ các giao thức tiêu chuẩn** như **NFS (v3 & v4.1)** và **SMB (v2 & v3)** để truy xuất dữ liệu.
- **Triển khai dưới dạng phần mềm ảo (VM appliance)** trên **VMware ESXi hoặc Microsoft Hyper-V**.
- **Tích hợp S3 như một file system mount**, cho phép truy cập dữ liệu trong S3 dưới dạng **file hoặc file share mount points**.
- **Lưu trữ metadata kiểu POSIX** (quyền sở hữu, quyền truy cập, timestamp) trong S3 như **object user metadata**.
- **Cung cấp giải pháp thay thế tiết kiệm chi phí** so với lưu trữ tại chỗ (on-premises storage).
- **Hỗ trợ caching cục bộ (local caching) để giảm độ trễ truy cập dữ liệu**.
- **Quản lý truyền dữ liệu thông minh**:
  - Giảm tắc nghẽn mạng
  - Tối ưu hóa băng thông
  - Truyền dữ liệu song song
- **Tích hợp dễ dàng với các dịch vụ AWS khác** như **IAM, KMS, CloudWatch, CloudTrail**.

# **Volume Gateway (AWS Storage Gateway)**

- Cung cấp các volume lưu trữ có thể gắn kết (mount) như thiết bị iSCSI trên các máy chủ ứng dụng on-premises.
- **Tất cả dữ liệu được lưu trữ an toàn trên AWS**, với **cách tiếp cận linh hoạt** về lượng dữ liệu lưu trữ tại chỗ.
- Cung cấp giao diện iSCSI để tích hợp dễ dàng với các ứng dụng backup hiện có.
- **Đóng vai trò như một ổ đĩa khác** trên hệ thống on-premises.
- **Sao lưu dữ liệu theo từng phần (incremental backup)** bằng **EBS snapshots trong S3**.
- Snapshot có thể được:
  - Khôi phục thành volume lưu trữ trên gateway
  - Tạo EBS volume mới để gắn vào EC2 instance.

### **Gateway Cached Volumes**

![2.png](@/assets/images/aws/storage/aws-storage-gateway/2.png)

- **Dữ liệu được lưu trữ chính trên S3**, trong khi **các dữ liệu được truy cập gần đây sẽ được giữ lại** on-premises để **giảm độ trễ (low latency access)**.
- Tiết kiệm chi phí lưu trữ chính, giảm nhu cầu mở rộng bộ nhớ on-premises.
- Dữ liệu được mã hóa trên S3 bằng Server-Side Encryption (SSE), không thể truy cập bằng S3 API hoặc các công cụ khác.
- **Hỗ trợ tối đa 32 volumes/gateway**, mỗi volume **từ 1 GiB đến 32 TiB**, tổng tối đa **1 PiB (1,024 TiB)**.
- Gateway VM có thể gán hai loại ổ đĩa chính:
  - **Cache Storage**
    - Lưu trữ dữ liệu tạm thời trước khi tải lên S3.
    - Lưu trữ dữ liệu được truy cập gần đây để tăng tốc truy xuất.
  - **Upload Buffer**
    - Hoạt động như vùng đệm trước khi dữ liệu được tải lên S3.
    - Dữ liệu được tải lên S3 qua kết nối SSL mã hóa an toàn.

### Gateway Stored Volumes

![3.png](@/assets/images/aws/storage/aws-storage-gateway/3.png)

- Lưu trữ toàn bộ dữ liệu ở on-premises để đảm bảo truy xuất với độ trễ thấp (low latency access).
- Sao lưu dữ liệu theo từng thời điểm (point-in-time snapshots) lên **Amazon S3** dưới dạng **EBS snapshots** để đảm bảo **bảo mật và lưu trữ bền vững**.
- **Hỗ trợ khôi phục dữ liệu về trung tâm dữ liệu on-premises hoặc EC2**, giúp **đáp ứng nhanh trong trường hợp thảm họa (disaster recovery)**.
- **Hỗ trợ tối đa 32 volumes/gateway**, mỗi volume **từ 1 GiB đến 16 TiB**, tổng dung lượng **tối đa 512 TiB**.
- Gateway VM có thể gán hai loại ổ đĩa chính:
  - **Volume Storage**
    - Lưu trữ dữ liệu thực tế.
    - Có thể ánh xạ với bộ nhớ DAS (Direct-Attached Storage) hoặc SAN (Storage Area Network) on-premises.
  - **Upload Buffer**
    - Hoạt động như vùng đệm trước khi dữ liệu được tải lên S3.
    - Dữ liệu được tải lên S3 qua kết nối SSL mã hóa an toàn.

# Tape Gateway – Gateway-Virtual Tape Library (VTL)

![4.png](@/assets/images/aws/storage/aws-storage-gateway/4.png)

- Cung cấp giải pháp lưu trữ bền vững và tiết kiệm chi phí cho nhu cầu lưu trữ dữ liệu dài hạn.
- **Hỗ trợ giao diện VTL (Virtual Tape Library)**, cho phép tận dụng hạ tầng sao lưu tapes hiện có để lưu trữ dữ liệu trên **Virtual Tape Cartridges**.
- **Mỗi Tape Gateway được cấu hình sẵn với một Media Changer và các Tape Drive**, có thể sử dụng như thiết bị **iSCSI** trên các ứng dụng sao lưu hiện có.
- Hỗ trợ tối đa 1.500 tapes, tổng dung lượng tối đa 1 PiB (Petabyte).
- **Dữ liệu trên Virtual Tape Library được lưu trữ trên S3, còn băng từ được lưu trữ dài hạn trên Glacier** để tối ưu chi phí.

### **Thành phần chính của Tape Gateway**

- **Virtual Tape**
  - Giống như băng từ vật lý nhưng dữ liệu được lưu trên AWS.
  - Hỗ trợ băng từ có dung lượng từ 100 GiB đến 2.5 TiB.
- **Virtual Tape Library (VTL)**
  - Tương tự như thư viện băng từ vật lý, nhưng thay thế Tape Drives bằng VTL Tape Drive và Robot Arms bằng Media Changer.
  - Dữ liệu sao lưu sẽ được ghi vào Gateway, lưu trữ cục bộ (on-premises), rồi tải lên băng từ ảo trong S3.
- **Virtual Tape Shelf (VTS)**
  - Giống như kho lưu trữ băng từ ngoài site (offsite tape storage).
  - Các băng từ trong VTL sẽ được sao lưu lên Glacier để tiết kiệm chi phí.
  - VTS nằm trong cùng Region với Gateway và mỗi Region chỉ có một VTS duy nhất.

### **Quy trình lưu trữ và khôi phục băng từ**

- **Lưu trữ (Archiving Tapes)**: Khi phần mềm sao lưu **eject** băng từ, Gateway sẽ chuyển băng từ sang VTS để lưu trữ dài hạn.
- **Khôi phục (Retrieving Tapes)**: Để sử dụng lại băng từ trong VTS, trước tiên cần khôi phục về VTL. Quá trình này mất khoảng **24 giờ**.

### **Gateway VM có thể gán hai loại ổ đĩa chính**

- **Cache Storage**
  - Lưu trữ cục bộ dữ liệu trước khi tải lên S3.
  - Lưu dữ liệu đã truy xuất gần đây để giảm độ trễ khi truy cập lại.
- **Upload Buffer**
  - Làm vùng đệm trước khi tải dữ liệu lên băng từ ảo (Virtual Tape).
  - Dữ liệu được tải lên AWS qua kết nối SSL mã hóa an toàn và lưu trữ trên S3.
