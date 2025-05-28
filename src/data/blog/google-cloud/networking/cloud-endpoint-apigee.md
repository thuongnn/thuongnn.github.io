---
author: thuongnn
pubDatetime: 2022-10-07T01:14:22Z
title: "[Google Cloud] Tìm hiểu về Cloud Endpoint & Apigee"
folder: "gcp"
draft: false
tags:
  - Google Cloud
description: Tìm hiểu về dịch vụ Cloud Endpoint & Apigee trong Google Cloud.
---

- Cloud Endpoint
  - Được tích hợp với App Engine, có thể deploy ở một môi trường khác ví dụ như Cloud Run.
  - Có những tính năng cơ bản của một Endpoint Proxy như authentication, API key validation, JSON to gRPC transcoding, API monitoring, tracing and logging.
  - Đây là dịch vụ miễn phí, tính tiền dựa trên hạ tầng đã triển khai nó ví dụ như Cloud Run.
- Apigee
  - Có các tính năng tương tự như Cloud Endpoint, tuy nhiên còn có những tính năng nâng cao khác.
  - Các tính năng nâng cao: quota, billing, request pre, post processing,…
  - Nó còn có khả năng kết nối APIs dựa trên giao thức REST và gRPC do đó nó có thể tích hợp với cả các legacy application và cho phép expose API.
  - Apigee is EXPENSIVE, but POWERFUL!
