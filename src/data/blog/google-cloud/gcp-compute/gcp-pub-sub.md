---
author: thuongnn
pubDatetime: 2022-10-02T23:01:32Z
title: "[Google Cloud] GCP Pub/Sub"
featured: false
draft: false
tags:
  - Google Cloud
description: Tìm hiểu về các dịch vụ liên quan Pub/Sub trong Google Cloud.
---

## Table of contents

# Cloud Pub/Sub là gì?

![pubsub.jpeg](https://github.com/user-attachments/assets/1fea20f8-8f76-4700-b91a-54c7fce7c003)

- Ở các ứng dụng được built on-premise. Thì có một số ứng dụng là Message Bus phổ biến như **Redis**, **RabbitMQ**,…
- Khi on-deman trên nền tảng Google Cloud, thì Google cũng cung cấp giải pháp có tên là **Cloud Pub/Sub**. Nó đảm nhận nhiệm vụ kết nối các hệ thống và các ứng dụng lại với nhau thông qua **stream message**. Nó có một số điểm nổi bật so với message bus on- premise như:
    - **Cloud Pub/Sub** là **global service**, quản lý **multi-tenanted**, message gửi nhận **real-time** , **asynchronous** và **stateless**.
    - **Cloud Pub/Sub** không lưu trữ message để xử lý hoặc để phân tích. (Nếu muốn phân tích và lưu trữ thì nên xem xét **Dataflow** và **BigQuery**).
    - **Cloud Pub/Sub** xử lý tốt cho việc thu thập dữ liệu và phân phối dữ liệu **on-deman.**
    - **Cloud Pub/Sub** đảm bảo **Receiver** sẽ nhận ít nhất 1 message từ bên **Sender**.
    - Và đặc biệt là chúng ta chỉ cần tập trung vào vấn đề bussines, không cần quan tâm các vấn đề deploy, maintain, bảo mật, middleware, config Cloud Pub/Sub,… vì đã có Google Cloud Platform tự động xử lý hộ chúng ta rồi.

# **Cloud Pub/Sub – Hoạt động như thế nào?**

- Trong Cloud Pub/Sub. **Sender** (người gửi message) được gọi là **publishers** và **Receiver** (người nhận message) gọi là **Subscriber**.
- Ngoài khái niệm **message**, Cloud Pub/Sub có thêm một số khái niệm là **Topic, Subscription,** **Message attribute**:
    - **`Topic`**: là tên của tài nguyên (**resource**) chứa những tin nhắn được gửi lên bởi **publisher**.
    - **`Subscription`**: Tên của tài nguyên đại diện cho các dòng tin nhắn từ một hoặc một topic cụ thể nào đó được chuyển (**delivered**) đến **Subscriber**.
    - **`Message`**: tin nhắn – kết hợp giữa dữ liệu và các **attributes** mà **publisher** gửi lên topic và chuyển đến **subscribers**.
    - **`Message attribute`**: là các cặp key-value mà **publisher** có thể định nghĩa cho message.
      Ví dụ: **publisher** định nghĩa ra cặp key-value là `ana.org/language_tag=en`, và cặp key-value được gắn vào message để đánh dấu message này dành cho **subscriber** nói tiếng anh.

## **Mối quan hệ giữa Publisher và subscriber**

Trong Cloud Pub/Sub có chứa nhiều **Topic**, một **Topic** có thể có nhiều **Subscription** , Mỗi **Subscripton** chứa nhiều **Message**

![](https://github.com/user-attachments/assets/7ee38bcb-f1b6-4899-b489-8cf5f0093635)

## **Luồng xử lý Message trong Cloud Pub/Sub**

![](https://github.com/user-attachments/assets/8eb62c8c-c464-41f8-8b08-1e39b958e580)

1. **Pulisher** tạo **Topic** trên **Cloud Pub/Sub service** và gửi **messsage** lên **Topic**. một **messaage** chứa nội dung tin nhắn và có thể có thêm mô tả (**message attributes**) cho tin nhắn đó.
2. **Message** sẽ được lưu trữ tại **Message Storage** cho đến khi tin nhắn được chuyển đến cho **subscribers** và nhận được phản hồi kết quả từ **subscribers.**
3. **Cloud Pub/Sub** sẽ chuyển tiếp **message** từ **topic** đến hàng đợi của tất cả **subscriptions** của nó. Mỗi **subscriptions** sau khi được tin nhắn, nó sẽ đẩy (**push**) **message** đó về cho **subscriber**. Hoặc **subscriber** có thể tự kéo (**pull**) **message** từ một **subscription** nào đó.
4. **Subscriber** nhận được **message** đang chờ xử lý từ **subscription**.**Subscriber** sẽ xác nhận (**ACK**) từng tin nhắn từ **subscription**.
5. Khi **subscription** nhận được tin nhắn xác nhận (**ACK**) của **message** đó thì thì **message** đó sẽ được xóa khỏi hàng đợi của **subscription**.

## Vài điểm cần chú ý

Cloud Pub/Sub là bất đồng bộ (**asynchronous**) và không có trạng thái (**stateless**). Một message được gửi từ **Publisher** đến **Subscription**. Ở đây, **Subscriber** sẽ có 2 cách để có được **message**:

- **`Subscriber kéo (pull) message`**: **Subscriber** chủ động lấy tin nhắn từ **subscription**, Mỗi lần lấy 1 **message** và chỉ cần thông qua giao thức http.
- **`Subscription đẩy (push) message`**: **Subscriber** sẽ nhận **message** thụ động từ **subscription**, lúc này phải chỉ cho **subscription** cần đẩy **message** về **Subscriber** nào và phải thông qua giao thức https.

Cloud Pub/Sub đảm bảo là **Subscriber** nhận ít nhất 1 message. Nguyên nhân do một phần do cơ chế xác nhận tin nhắn của nó, **Cloud Pub/Sub** xóa tin nhắn nếu nó nhận được phản hồi xác nhân (**ACK**). Nếu **Subscriber** nhận được **message** nhưng phản hồi chậm hoặc không phản hồi thì **message** đó sẽ được gửi lại lần nữa cho đến khi nhận được phản hồi.

Khi một **message** *không* được gửi đến cho **subscriber** nào thì sẽ bị xóa sau thời gian là **7 ngày**. Do đó **Cloud Pub/Sub** không phải là nơi để mà lưu trữ **message**. Các bạn muốn lưu trữ lại **message** thì thêm 1 **subcription** để queue tin nhắn và 1 **Subscriber** lấy **message** để lưu. Bên dưới là một số service/application có thể làm **publisher** và **subscriber**.

![](https://github.com/user-attachments/assets/e27f1960-2941-4f74-829d-f0a408c47324)

# Reference link

[https://blog.cloud-ace.vn/cloud-pub-sub-hoat-dong-nhu-the-nao](https://blog.cloud-ace.vn/cloud-pub-sub-hoat-dong-nhu-the-nao/)