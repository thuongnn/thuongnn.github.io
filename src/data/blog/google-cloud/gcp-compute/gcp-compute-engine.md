---
author: thuongnn
pubDatetime: 2022-09-14T22:36:35Z
modDatetime: 2022-09-14T22:36:35Z
title: "[Google Cloud] GCP Compute Engine"
folder: "gcp"
draft: false
tags:
  - Google Cloud
description: Tìm hiểu về Compute Engine trong Google Cloud.
ogImage: https://github.com/user-attachments/assets/633b8074-63b6-4272-8896-1bfb4c063639
---

## Table of contents

## Overview

![Untitled](https://github.com/user-attachments/assets/633b8074-63b6-4272-8896-1bfb4c063639)

## Virtual **Machine Types**

Google Compute Engine hỗ trợ nhiều họ Machine khác nhau phục vụ cho những trường hợp cụ thể khác nhau.

### **General-purpose workloads**

- Cost-optimized (E2)
  - Day-to-day computing với chi phí thấp.
  - Trường hợp sử dụng
    - Web serving
    - App serving
    - Back office apps
    - Small-medium databases
    - Microservices
    - Virtual desktops
    - Development environments
- Balanced (N2, N2D, N1)
  - Loại VM cân bằng giữa giá cả và hiệu năng.
  - Trường hợp sử dụng
    - Web serving
    - App serving
    - Back office apps
    - Medium-large databases
    - Cache
    - Media/streaming
- Scale-out optimized (Tau T2D, Tau T2D)
  - Loại VM có hiệu năng với chi phí tốt phù hợp cho các scale-out workloads.
  - Trường hợp sử dụng
    - Scale-out workloads
    - Web serving
    - Containerized microservices
    - Media transcoding
    - Large-scale Java applications

### **Optimized workloads**

- Memory-optimized (M2, M1)
  - Loại VM này thường dùng cho những workload đặc thù cần nhiều RAM
  - Trường hợp sử dụng
    - Medium-large in-memory databases such as SAP HANA
    - In-memory databases and in-memory analytics
    - Microsoft SQL Server and similar databases
- Compute-optimized (C2, C2D)
  - VM có hiệu năng CPU cực cao chuyên dùng cho các workload cần tính toán nhiều.
  - Trường hợp sử dụng
    - Compute-bound workloads
    - High-performance web serving
    - Gaming (AAA game servers)
    - Ad serving
    - High-performance computing (HPC)
    - Media transcoding
    - AI/ML
- Accelerator-optimized (A2)
  - Sử dụng cho những workload đặc thù cần hiệu năng GPU cao.
  - Trường hợp sử dụng
    - CUDA-enabled ML training and inference
    - HPC
    - Massive parallelized computation

### Customize workloads

- Trong một số trường hợp chúng ta có thể tuỳ chỉnh VM instance mà chúng ta muốn tạo, Google Compute có thể hỗ trợ việc này.
- Trường hợp sử dụng
  - Chúng ta muốn một VM instance phù hợp với yêu cầu hệ thống hiện tại mà các loại workload ở trên không đáp ứng được.
  - Một hệ thống đặc thù cần mở rộng nhiều RAM, CPU hơn với các options ở trên.
- Một số yêu cầu tuỳ chỉnh của RAM và CPU
  - vCPU chọn ít nhất là 1vCPU hoặc lớn hơn thì phải là số chẵn
  - Dung lượng RAM sẽ limit theo số lượng CPU được chọn, thông thường là **0.9GB RAM / 1 vCPU** và **có thể nâng lên tối đa 6.5GB RAM / 1vCPU**.
  - Tổng dung lượng RAM phải là bội số của 256MB

## Virtual **Machine Configure**

### Image

- Phải có image khi khởi tạo một VM trên Google Cloud, trong image thì chứa OS và các phần mềm đã được cài đặt sẵn trên đó tuỳ từng loại image khác nhau.
- Phân biệt 02 loại image:
  - **Public Images** - được cung cấp và bảo trì bởi Google hoặc các image được tạo ra bởi các tổ chức vendor khác, cộng đồng Open source.
    - Linux (CentOS, CoreOS, Debian, **RHEL**, **SUSE**, Ubuntu, openSUSE, and FreeBSD)
    - Windows (Windows Server 2019, 2016, 2012-r2; SQL Server pre-installed on Windows)
  - **Custom Images** - chúng ta có thể tự tạo riêng một image để sử dụng.

### **Internal and External IP Addresses**

- Địa chỉ **External** (Public) IP là địa chỉ có thể được truy cập bởi mạng internet công khai, bất cứ ai cũng có thể truy cập được.
- Địa chỉ **Internal** (Private) IP là địa chỉ nội bộ nằm trong subnet mạng của VPC.
- Địa chỉ External IP thì không thể bị trùng khi tạo VM, còn Internal IP thì có thể bị trùng trong một số trường hợp (nằm ở 02 VPC khác nhau hoặc On-Premise với Google Cloud VPC)
- Tất cả các VM instances đều phải có ít nhất 01 địa chỉ Internal IP.
- Địa chỉ External IP là tuỳ chọn khi khởi tạo Virtual Machine, có thể disable nếu không dùng đến. Chú ý là địa chỉ External IP nếu không cấu hình Static IP thì nó sẽ bị mất và thay đổi mỗi lần Start/Stop VM.

**`Static IP Addresses`**

- Tạo một địa chỉ Static IP trong trường hợp muốn giữ địa chỉ này không bị mất hay thay đổi trong quá trình Start/Stop VM instance, một Static IP Address thì có thể được gán sang một VM instance khác nhau trong cùng một GCP Project.
- Static IP Address vẫn sẽ được gán vào một VM instance ngay cả khi nó đã bị Stop, chúng ta có thể bỏ gán nó ra bằng cách manual configure.
- Khi tạo ra Static IP Address thì đã bị tính tiền rồi, ngay cả khi không sử dụng nó.

### VM instance Lifecycle | **Bootstrapping with Startup script**

![Untitled](https://github.com/user-attachments/assets/823cd240-a1a4-48c0-845e-b7ad75b56696)

- GCP hỗ trợ cấu hình Startup hoặc Shutdown Script dùng để thực thi khi có sự kiện tương ứng (tham khảo trong hình trên)
- Ví dụ một Startup Script:

  ```bash
  #!/bin/bash
  apt update
  apt -y install apache2
  echo "Hello world from $(hostname) $(hostname -I)" > /var/www/html/index.html
  ```

  Tự động cập nhật OS và cài đặt Apache Web server lên trên OS này.

### VM Instance Template

- Nôm na là tạo một template sẵn để có thể tạo dễ dàng các VM instances với những tham số đã định nghĩa trong template, có thể sử dụng để tạo mới một VM instance hoặc tạo managed instance groups (MIGs).
- Trong Instance templates có thể định nghĩa **machine type**, **boot disk image** hoặc **container image**, **labels**, **startup script**, và nhiều properties khác nữa. Hướng dẫn tạo VM Instance Template [ở đây](https://cloud.google.com/compute/docs/instance-templates/create-instance-templates).
- **Không thể cập nhật VM Instance Template**, thay vào đó thì có thể clone ra để chỉnh sửa nó.

## Bài toán tiết kiệm chi phí sử dụng

- Chúng ta sẽ bị tính tiền cho mỗi phút chạy của VM instance, sau khoảng thời gian tối thiểu là 1 phút.
- Không bị tính tiền khi con VM instance bị stop, tuy nhiên các tài nguyên khác như Storage hay Static IP thì vẫn bị tính tiền như thường (tính tiền riêng theo biểu đồ chi phí tài nguyên đó).
- **`RECOMMENDATION`** là luôn luôn tạo **Budget alerts** để cảnh báo mức chi phí sử dụng VM instances.
- Để tiết kiệm chi phí hơn thì có mấy cách sau:
  - Ước lượng và lựa chọn loại machine phù hợp nhất với nhu cầu để tránh lãng phí tài nguyên.
  - Phương án discount của GCP
    - Sustained use discounts
    - Committed use discounts
    - Discounts for preemptible VM instances

### **Sustained use discounts**

![Untitled](https://github.com/user-attachments/assets/0655be92-c940-4632-bdb4-3382d6b918d3)

- **Tự động giảm giá thành sử dụng VM instances** khi sử dụng liên tục trong tháng, discount sẽ tự động trừ vào hoá đơn hàng tháng.
  - Ví dụ nếu như sử dụng loại machine là N1, N2 với thời gian sử dụng hơn 25% tổng thời gian của một tháng, chúng ta có thể nhận ưu đãi 20-50% giá thành được tính cho mỗi phút cộng dồn tiếp theo.
  - Sử dụng liên tục càng lâu thì giảm giá càng sâu, như đồ thị ở trên.
  - Không cần phải cấu hình gì cả, GCP sẽ tự động giảm giá sử dụng VM instance.
- Có thể áp dụng cho các instances được tạo bởi **Google Kubernetes Engine** và **Compute Engine**.
- **KHÔNG** được áp dụng cho một số loại machine (Ví dụ như E2 và A2).
- **KHÔNG** được áp dụng cho VMs được tạo bởi App Engine và Dataflow.

### **Committed use discounts**

- Phù hợp cho những loại workloads mà chúng ta dự trù được tài nguyên cũng như thời gian sử dụng.
- Cam kết sử dụng liên tục trong vòng 1 hoặc 3 năm.
- Có thể được giảm giá thành sử dụng lên tới 70% tuỳ theo từng loại machine và GPUs.
- Có thể áp dụng cho các instances được tạo bởi **Google Kubernetes Engine** và **Compute Engine**.
- **KHÔNG** được áp dụng cho VMs được tạo bởi App Engine và Dataflow.

### **Preemptible VM**

- Là các phiên bản VM được sử dụng trong thời gian ngắn nhưng có thể tiết kiệm chi phí lên tới 80%. Tuy nhiên sẽ có một số đặc điểm sau:
  - Có thể bị dừng bất cứ lúc nào bởi GCP (force stop) trong vòng 24h.
  - Instances sẽ nhận được 30s cảnh báo trước khi bị force stop (thời gian này có thể thực hiện lưu lại những gì cần thiết của workload)
- Sử dụng Preemptible VM trong các trường hợp sau:
  - Ứng dụng chịu lỗi tốt bởi VM sẽ bị force stop bất cứ lúc nào, ứng dụng chấp nhận việc đó và không bị ảnh hưởng gì.
  - Ứng dụng chạy những workload không phải ngay lập tức, kiểu như rảnh lúc chạy cũng được.
  - Ví dụ như các batch processing jobs không cần chạy ngay lập tức.
  - Tất nhiên lý do chủ yếu là để tiết kiệm chi phí, nếu dư giả tài chính thì không nên sử dụng thằng này.
- Một số hạn chế:
  - Không phải lúc nào cũng khả dụng để chạy, có những lúc GCP không dư giả những VM kiểu như này cho để chạy.
  - Không đảm bảo SLA, không thể migrate sang loại VM thông thường.
  - Không tự động restarts.
  - Không áp dụng cho Free Tier credits.

## Tổng kết

### Một số chú ý đối với Virtual Machine

- Loại tài nguyên này được gắn với Project.
- Machine type thì có thể khả dụng hay không tuỳ theo Region hoặc Zone khác nhau.
- Chúng ta **không thể thay đổi Machine type** của một VM instance đang running.
- Có thể lọc các VM instances dự trên nhiều thuộc tính khác nhau như: _Name, Zone, Machine Type, Internal/External IP, Network, Labels etc_
- VM instances là tài nguyên Zonal (đại loại là nó được chạy trong một Zone cụ thể trong một Region cụ thể)
  - Image thì là Global (nôm na là chúng ta có thể truy cập vào một image từ nhiều Project khác nhau)
  - Instance templates cũng là Global (trừ một số trường hợp cấu hình Instance template chỉ chạy trong một Zone cụ thể)
- Tự động được cấu hình theo dõi một số thông số cơ bản:
  - **Các metrics mặc định**: CPU utilization, Network Bytes (in/out), Disk Throughput/IOPS
  - Đối với **Memory Utilization** & **Disk Space Utilization** thì cần cài đặt Agent.

### **Virtual Machine - Best Practices**

- Lựa chọn **Zone** và **Region** dự trên:
  - Chi phí, quy định, mức độ khả dụng cần thiết, độ trễ và yêu cầu Hardware cụ thể.
  - Triển khai VM instances phân tán trên nhiều Zones và Regions để đạt độ khả dụng cao.
- Lựa chọn Machine type sao cho phù hợp:
  - Nên chạy thử nghiệm ứng dụng trên các loại Machine type để lấy thêm đánh giá.
  - Sử dụng GPUs cho trường hợp ứng dụng cần tính toán chuyên sâu và đồ hoạ.
- Ước lượng và lên plan cho các workloads chạy dài hạn để áp dụng **"committed use discounts"** cho tiết kiệm chi phí.
- Sử dụng **preemptible instances** cho các ứng dụng chịu lỗi tốt (fault-tolerant), chạy bất cứ lúc nào cũng được (ứng dụng không cần chạy ngay lập tức)
- Sử dụng **labels** để đánh nhãn theo môi trường triển khai, team dự án, loại business,… để phân loại quản lý.
