---
author: thuongnn
pubDatetime: 2022-10-15T19:11:55Z
modDatetime: 2022-10-15T19:11:55Z
title: "[Google Cloud] Cloud SQL"
folder: "gcp"
draft: false
tags:
  - Google Cloud
description: Tìm hiểu về Cloud SQL trong Google Cloud.
ogImage: https://github.com/user-attachments/assets/c6606129-4718-4648-85a5-7e0d33642084
---

![CloudSQL.jpeg](https://github.com/user-attachments/assets/c6606129-4718-4648-85a5-7e0d33642084)

## Restoring an instance

### Point-in-time recovery

- Cho phép chúng ta khôi phục phiên bản ở một thời điểm cụ thể, ví dụ như nếu chúng gặp sự cố về mất dữ liệu, chúng ta có thể khôi phục database ở một thời điểm trước khi sự cố đó xảy ra.
- point-in-time recovery luôn luôn tạo một instance mới, tính năng này không cho phép khôi phục trên instance hiện tại. Đương nhiên là instance mới sẽ kế thừa lại toàn bộ cấu hình của source instance - gần giống như **clone**.
- Tính năng này được bật mặc định khi chúng ta tạo mới một Cloud SQL instance
