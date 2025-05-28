---
author: thuongnn
pubDatetime: 2022-10-15T19:33:15Z
title: "[Google Cloud] Cloud Spanner"
featured: false
draft: false
tags:
  - Google Cloud
description: Tìm hiểu về Cloud Spanner trong Google Cloud.
---

![CloudSpanner.jpeg](https://github.com/user-attachments/assets/0f9d84e2-4528-4b1b-9e4f-ea9790cfa360)

### Reads outside of transactions

- **If you need to write, depending on the value of one or more reads**, you should execute the read as part of a read-write transaction. Read more about [read-write transactions](https://cloud.google.com/spanner/docs/transactions#read-write_transactions).
- **If you are making multiple read calls that require a consistent view of your data**, you should execute the reads as part of a read-only transaction. Read more about [read-only transactions](https://cloud.google.com/spanner/docs/transactions#read-only_transactions).

Có 02 loại read sau:

- A _strong read_ is a read at a current timestamp and is guaranteed to see all data that has been committed up until the start of this read. Spanner defaults to using strong reads to serve read requests.
- A _stale read_ is read at a timestamp in the past. If your application is latency sensitive but tolerant of stale data, then stale reads can provide performance benefits.
