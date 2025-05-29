---
author: thuongnn
pubDatetime: 2022-10-05T21:11:22Z
modDatetime: 2022-10-05T21:21:11Z
title: "[Google Cloud] Tìm hiểu về VPC Service Controls"
folder: "gcp"
draft: false
tags:
  - Google Cloud
description: Tìm hiểu về VPC Service Controls trong Google Cloud.
ogImage: https://github.com/user-attachments/assets/9435b6ea-f8d7-4665-badb-26e6d0f413e7
---

## Table of contents

# What is **VPC Service Controls?**

- Đây là tính năng giảm thiểu nguy cơ xâm nhập dữ liệu của các dịch vụ của Google Cloud như Cloud Storage, BigQuery.
- Chúng ta có thể sử dụng VPC Service Controls để tạo ra **perimeters** (đại loại là danh giới) bảo vệ **resources và data của services** được chỉ định rõ ràng.
- VPC Service Controls có thể làm được những gì?
  - Clients trong vùng **perimeters** sẽ có quyền truy cập riêng (private access) vào các resources của vùng này, còn những truy cập ngoài vùng này sẽ không có quyền truy cập (kể cả là các resources của Project trong hệ sinh thái GCP còn gọi là Unauthorized Project).
  - Dữ liệu sẽ không thể được copy sang các Unauthorized resources bên ngoài vùng perimeters bằng cách sử dụng service operations như [`gsutil cp`](https://cloud.google.com/storage/docs/gsutil/commands/cp) hoặc [`bq mk`](https://cloud.google.com/bigquery/docs/reference/bq-cli-reference#bq_mk).
  - Dữ liệu trao đổi giữa Client và Resource được tách biệt bởi vùng perimeters - đảm bảo an toàn bằng cách sử dụng Ingress và Egress rules.
  - Để xác định được resource có được truy cập hay không sẽ dựa trên các thuộc tính của Client ví dụ như: identity type (service account hoặc user), identity, device data, và network origin (IP address hoặc VPC network).
    - Client ở bên ngoài vùng perimeter sử dụng Google Cloud hay On-Premises có nằm trong authorized VPC networks thì cần sử dụng **Private Google Access** để có thể truy cập vào các resource bên trong vùng perimeter.
    - Quyền truy cập Internet vào các tài nguyên trong vùng perimeter sẽ bị hạn chế đối với một loạt các địa chỉ IPv4 và IPv6
- VPC Service Controls cung cấp một lớp bảo mật cho các Google Cloud services và nó độc lập (không liên quan lắm) với tính năng Identity and Access Management (IAM) của GCP.
  - Trong khi IAM cung cấp tính năng identity-based access control (xác thực dựa trên định danh người dùng), thì VPC Service Controls lại tạo ra các danh giới bảo mật (vùng perimeter) để kiểm soát toàn bộ dữ liệu đi ra bên ngoài vùng này.
  - Best practice là kết hợp sử dụng cả **VPC Service Controls** và **IAM** (Identity and Access Management)
  - Có thể cấu hình VPC Service Controls cho một folder hay project trong organization, khi đó security controls sẽ được áp dụng vào toàn bộ các resource được tạo mới bên trong vùng perimeter.

## Một số lợi ích về bảo mật của **VPC Service Controls**

- **Access from unauthorized networks using stolen credentials** - chỉ cho các truy cập private bên trong vùng perimeter và ngăn chặn các truy cập trái phép sử dụng OAuth credentials hay service account credentials đã bị đánh cắp.
- **Data exfiltration by malicious insiders or compromised code** - ngăn chặn việc đọc hay sao chép dữ liệu từ các GCP resources khác bên ngoài vùng perimeter.
- **Public exposure of private data caused by misconfigured IAM policies** - chặn các truy cập trái phép từ unauthorized networks, ngay cả khi dữ liệu bị lộ do các chính sách IAM cấu hình sai.
- **Monitoring access to services** - theo dõi các yêu cầu truy cập vào các protected services mà không chặn chúng ngay, nhằm mục đích hiểu rõ hơn về luồng truy cập vào Project.

# Một số kịch bản sử dụng

## **Isolate Google Cloud resources into service perimeters**

![Untitled](https://github.com/user-attachments/assets/9435b6ea-f8d7-4665-badb-26e6d0f413e7)

## **Extend perimeters to authorized VPN or Cloud Interconnect**

![Untitled](https://github.com/user-attachments/assets/c77ccb22-da59-4116-afd9-8c53992f1503)

## **Control access to Google Cloud resources from the internet**

![Untitled](https://github.com/user-attachments/assets/67329917-e83a-4335-b503-f78635726525)

# Tham khảo

[https://cloud.google.com/vpc-service-controls/docs/overview](https://cloud.google.com/vpc-service-controls/docs/overview)
