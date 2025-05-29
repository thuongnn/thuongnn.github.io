---
author: thuongnn
pubDatetime: 2021-03-16T19:20:35Z
modDatetime: 2021-03-16T19:20:35Z
title: "[Series tự học] Các thuật ngữ Distributed System"
draft: false
tags:
  - Distributed Systems
  - Architecture
description: Tìm hiểu và tổng hợp lại kiến thức về Distributed System.
ogImage: https://upload.wikimedia.org/wikipedia/commons/6/6a/Distributed_Systems.png
---

## Table of contents

## HIGH AVAILABILITY — TÍNH SẴN SÀNG CAO

**High Availability (HA)** hay còn gọi là _Tính Khả Dụng/Sẵn Sàng Cao_. Từ này gặp rất nhiều khi làm việc với các Cloud Service để đề cập đến việc 1 hệ thống hay service đó có tỷ lệ sống sót là bao nhiêu % trong 1 khoảng thời gian.

**Ví dụ** nếu nói hệ thống có HA = 99% thì tức là sẽ có downtime (thời gian chết) là 3.65 ngày trong 1 năm, 7.31 giờ trong một tháng, 14.4 phút trong 1 ngày.

Thời gian downtime có thể là do hệ thống cần được tắt để bảo trì nâng cấp hoặc bị cúp điện chẳng hạn. Vậy làm thế nào để có thể tăng tính HA cho hệ thống?

**Ví dụ** có 1 số service sẽ có SLA (Service Level Agreement) hay Cam kết chất lượng dịch vụ cho HA lên đến 9 số 9 ( 99.9999999%) hoặc như DNS service sẽ có HA = 100%. Tất nhiên để HA càng cao thì chi phí càng đắt.

Do đó, trong mỗi hệ thống cần suy nghĩ xem HA bao nhiêu là vừa đủ. Để làm được điều này thì chúng ta sẽ cần áp dụng một số kỹ thuật như _redundancy, replication, zero-downtime deployment, fail-over,…_

## RELIABILITY — ĐỘ TIN CẬY

Một hệ thống có độ tin cậy cao thì HA sẽ cao, nhưng ngược lại không đúng. 1 hệ thống có khả năng sẵn sàng cao không có nghĩa là một hệ thống ưu việt.

**Ví dụ** có con server đang sống và nhận, xử lý request đều đều, bỗng dưng không hiểu vì sao mà thời gian xử lý request mỗi lúc một lâu, có khi timeout luôn. Thì khi đó mặc dù ta nói HA vẫn cao nhưng độ tin cậy lại thấp.

> Reliability is the ability of a system to recover from infrastructure or service disruptions, dynamically acquire computing resources to meet demand, and mitigate disruptions such as misconfigurations or transient network issues.

**Độ tin cậy** là khả năng hệ thống phục hồi từ sự gián đoạn cơ sở hạ tầng hoặc dịch vụ, tự động có được tài nguyên điện toán để đáp ứng nhu cầu và giảm thiểu sự gián đoạn như cấu hình sai hoặc các sự cố mạng tạm thời.

- Triển khai tự động nhằm loại bỏ các yếu tố lỗi do con người.

- Kiểm thử tính khả dụng, chịu tải, giả lập các tình huống gây lỗi tìm phương hướng khắc phục.

- Cần giám sát hệ thống chặt chẽ và báo động, tìm giải pháp (tự động hoặc thủ công) nhằm khắc phục.

- Thường xuyên kiểm tra (audit) để tìm ra các khuyết điểm của hệ thống.

## REDUNDANCY VÀ REPLICATION — DỰ PHÒNG VÀ SAO CHÉP

Redundancy thường được thể hiện bằng cách có nhiều hơn 1 node/process trong 1 system để nhằm đảm bảo khi có sự cố xảy ra trên 1 node thì vẫn còn node khác có thể tiếp tục handle request, quá trình này gọi là fail-over.

Có nhiều kiểu thiết lập redundancy như _active-active_ hay _active-passive_ bao gồm Cold-standby, Warm-standby hoặc Hot-standby.

Replication bao gồm việc đầu tiên là thiết lập redundancy kèm với việc sao chép data qua các redundant node. Điển hình như việc sao chép dữ liệu giữa active DB node với các standby/passive node. Hoặc sao chép dữ liệu vào các backup node nhằm tránh tình trạng bị mất dữ liệu.

So với việc tự setup thì các nhà cung cấp hạ tầng, dịch vụ cloud hỗ trợ tốt hơn, **ví dụ** như thiết lập redundancy và replication ở nhiều khu vực vật lý khác nhau (multi AZ, multi Region, multi continent).

## FAIL-OVER — CHUYỂN ĐỔI DỰ PHÒNG

Việc backup nhiều server dự phòng thôi là chưa đủ, ví dụ khi 1 server sập, làm thế nào để server khác có thể tiếp tục thực hiện các công việc hiện thời.

Các kỹ thuật fail-over thì cũng khá nhiều, tuy nhiên với việc lên Cloud hoặc sử dụng các container management and orchestration platform như Kubernetes thì việc cần làm là thiết lập cấu hình như DB fail-over hoặc container replica.

## SCALABILITY — KHẢ NĂNG MỞ RỘNG

**Scalability** hay gọi tắt là scale là yếu tố đầu tiên mà architect sẽ consider khi thiết kế hệ thống.

Làm sao để hệ thống sẽ scale được với kiến trúc và công nghệ đã chọn. Một hệ thống được gọi là có khả năng scale nếu có thiết kế để làm sao có thể add/remove thêm tính năng, module vào một cách dễ dàng, hay làm sao để có thể tiếp nhận một lượng lớn các request tăng đột biến do nhu cầu sử dụng của user tăng lên.

Ở mức độ coding thì có thể hiểu là sử dụng interface, abstract class để isolate, tách bạch detail implementation và các quy tắc, contract. Hoặc sử dụng các message queue để loose coupling giữa các components.

Đòi hỏi hệ thống phải có các tính chất eslasticity, giúp co giãn kích thước hợp lý. Khi có nhiều request thì cần scale out hoặc scale up các component để tăng tải, còn khi nhàn rỗi thì lại scale in hoặc down để tiết kiệm chi phí. Hoặc áp dụng các kỹ thuật caching, CQRS, non-blocking để tăng performance

## RESILIENCY — KHẢ NĂNG PHỤC HỒI

Resiliency đề cập đến các kỹ thuật để giúp khắc phục các lỗi trong quá trình vận hành.

Một số kỹ thuật được nhắc đến như health check, monitoring và self healing, circuit breaker, retry (bộ ngắt mạch, để tránh xảy ra sự cố dây chuyền), fail-over (chuyển sang node khác để tiếp tục vận hành)

**Chú ý**: Dự phòng và khả năng phục hồi thường bị nhầm lẫn với nhau. Tuy cả hai đều có liên quan với nhau nhưng chúng không thể hoán đổi cho nhau.

- Dự phòng có thể hiểu là việc thực hiện để ngăn chặn thất bại, ngụ ý rằng nó sẽ xảy ra trước khi một vấn đề xảy ra.

- Khả năng phục hồi liên quan đến việc tìm giải pháp sau khi một vấn đề đã xảy ra.

- Tóm lại, dự phòng là trước khi vấn đề xảy ra, ngược lại phục hồi là sau khi vấn đề xảy ra.

## DISASTER RECOVERY — KHÔI PHỤC SAU THẢM HỌA

Disaster recovery cũng giống như Resiliency đều là những phương pháp để khắc phục lỗi, nhưng khác ở chỗ Resiliency chỉ giải quyết các vấn đề về vận hành và lỗi ứng dụng, hoặc sự cố cục bộ.

Disaster recovery nó ở đẳng cấp khác, đẳng cấp của thảm họa như động đất, sóng thần, bom đạn. Rõ ràng không ai muốn có thảm họa xảy ra.

Tuy nhiên trong thực tế, đã có case như vậy, đơn cử là vụ sập điện tại bang Virginia của Mỹ khiến do bão gây ra khiến cho các data center của AWS ở đó sập hoàn toàn, trên phạm vi toàn region, khiến rất nhiều website sử dụng dịch vụ này bao gồm Pinterest, Netfilx, Heroku… "tắt điện" nhiều giờ liền.

## Reference

- [https://edwardthienhoang.wordpress.com/2020/05/20/system-design-co-ban-phan-21-phan-biet-cac-thuat-ngu-trong-distributed-system-tap-1](https://edwardthienhoang.wordpress.com/2020/05/20/system-design-co-ban-phan-21-phan-biet-cac-thuat-ngu-trong-distributed-system-tap-1/)

- [https://edwardthienhoang.wordpress.com/2020/05/21/system-design-co-ban-phan-22-phan-biet-cac-thuat-ngu-trong-distributed-system-tap-2/](https://edwardthienhoang.wordpress.com/2020/05/21/system-design-co-ban-phan-22-phan-biet-cac-thuat-ngu-trong-distributed-system-tap-2/)
