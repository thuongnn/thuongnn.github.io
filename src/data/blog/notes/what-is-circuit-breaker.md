---
author: thuongnn
pubDatetime: 2021-03-15T22:20:35Z
modDatetime: 2021-03-15T22:20:35Z
title: "[Series tự học] CIRCUIT BREAKER là gì?"
draft: false
tags:
  - Circuit Breaker
  - Architecture
description: Tổng hợp và trình bày những hiểu biết bản thân về Circuit Breaker.
---

**Circuit Breaker (CB)** nếu dịch theo nghĩa Tiếng Việt được gọi là cầu giao, nhiệm vụ chính của nó chính là ngắt mạch mỗi khi hệ thống điện có vấn đề xảy ra để tránh hệ thống quá tải dẫn đến các thành phần bên trong bị sụp đổ theo dẫn đến một thảm họa khác.

Ví dụ trong môi trường phân tán (distributed environment), việc một hệ thống (external services) bị down trong khoảng thời gian khá lâu trong khi các hệ thống khác đang liên tục request đến nó.

- Mỗi request đều có timeout và sẽ bị chặn (blocking) sau một khoảng thời gian timeout.

- Khi đó các hệ thống gửi request (đang giữ các tài nguyên hệ thống như memory, threads, database connection,..v.v) sẽ phải chịu thời gian timeout trên.

- Hệ thống sẽ liên tục gửi request mà không hề hay biết có thành công hay không; việc này dẫn đến các tài nguyên nhanh chóng bị cạn kiệt và đễn đến các hệ thống khác không liên qua dùng chung tài nguyên bị sụp đổ theo.

Circuit Breaker sẽ tự động ngắt mạch trong trường hợp đạt đến ngưỡng thất bại; tạo điều kiện cho các ứng dụng tự phục hồi, như trong trường hợp bị ngắt mạch sẽ quyết định sử dụng gọi dịch vụ khác hay ngừng dịch vụ cho đến khi hệ thống ổn định.

![](https://github.com/user-attachments/assets/1f25eb1a-7a82-4fa9-b97c-50c0eaf4c40d)

Cơ chế này sẽ quản lý và thống kê số lần lỗi xảy ra trong một khoảng thời gian để quyết định xem có cho phép chương trình tiếp tục hay “ngắt mạch” ngay lập tức. Nếu mạch đã bị ngắt thì những lời gọi tiếp theo sẽ được thực hiện nhanh chóng như trả ra lỗi hoặc gọi sang dịch vụ khác.

- **CLOSED**: Khi ở trạng thái này, toàn bộ chương trình hoạt động bình thường, các remote calls vẫn được phép gọi nhưng một remote call nào đó bị fail thì bộ đếm lỗi của CB kích hoạt và tăng lên một đơn vị. Mục đích bộ đếm lỗi (error counter) ở đây là xác định được số lượng fail tối đa mà hệ thống cho phép, nếu vượt quá thì CB sẽ thực hiện mở ra trạng thái **OPEN**.

- **OPEN**: Trạng thái này các request từ ứng dụng sẽ bị fail ngay lập tức thì và có exception sẽ được trả về cho ứng dụng.

- **HAFL-OPEN**: Khi CB ở trạng thái **OPEN** sau một khoảng thời gian timeout nào đó thì nó tạo cơ hội chuyển sang trạng thái **HAFL-OPEN**, cho phép một remote call từ ứng dụng được phép đi qua và gọi hoạt động. Nếu yêu cầu này thành công, có thể giả định rằng lỗi trước đó đã được khắc phục và CB sẽ chuyển lại trạng thái **CLOSED**, còn nếu không thì CB sẽ chuyển trạng thái sang **OPEN** và reset lại error counter.

![](https://github.com/user-attachments/assets/53f02491-b9fe-43e6-aa0e-30ed388f0e23)
