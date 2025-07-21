---
author: thuongnn
pubDatetime: 2022-10-15T20:13:45Z
modDatetime: 2022-10-15T20:13:45Z
title: "[Google Cloud] Cloud Bigtable"
folder: "gcp"
draft: true
tags:
  - Google Cloud
description: Tìm hiểu về Cloud Bigtable trong Google Cloud.
ogImage: https://github.com/user-attachments/assets/9b8fbc9e-023a-4843-91ef-ac9dbade0fe0
---

![Untitled](https://github.com/user-attachments/assets/9b8fbc9e-023a-4843-91ef-ac9dbade0fe0)

### Khác nhau giữa Cloud BigTable và Cloud BigQuery

- Nếu yêu cầu của bạn là cơ sở dữ liệu trực tiếp, **BigTable** là thứ bạn cần (Không thực sự là **OLTP** hệ thống). Nếu đó là mục đích phân tích nhiều hơn, thì **BigQuery** là thứ bạn cần!
- Hãy nghĩ về **OLTP** vs **OLAP**; Hoặc nếu bạn đã quen thuộc với Cassandra vs Hadoop, BigTable gần tương đương với Cassandra, BigQuery gần tương đương với Hadoop (Đồng ý, đó không phải là một so sánh công bằng, nhưng bạn hiểu ý)
