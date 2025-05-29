---
author: thuongnn
pubDatetime: 2021-11-26T23:29:35Z
modDatetime: 2021-11-26T23:29:35Z
title: Tìm hiểu về Pod network
draft: false
tags:
  - Kubernetes
  - Networking
description: Tìm hiểu về network trong Kubernetes Pod.
ogImage: https://github.com/user-attachments/assets/20fe0f95-ea17-4de2-83f0-ab419b15bf49
---

## Table of contents

# Pod là gì?

![](https://github.com/user-attachments/assets/20fe0f95-ea17-4de2-83f0-ab419b15bf49)

- Là đơn vị nhỏ nhất có thể triển khai (tạo và quản lý trên Kubernetes).
- Có thể bao gồm một hay nhiều container được allocated trên cùng một host, các container trong cùng một pod chia sẻ `network` và tài nguyên khác như `volume`.
- Trong tài liệu của Kubernetes có đề cập rằng tất cả các container trên cùng một pod có thể kết nối với nhau qua localhost.

Ví dụ có một Nginx container listen port 80 và một container khác trong Pod có thể kết nối đến Nginx container bằng địa chỉ http://localhost:80. Chúng hoạt động như thế nào vậy?

# Tìm hiểu về network trong Pod

Trước khi tìm hiểu, chúng ta sẽ xem lại network giữa các Docker container bình thường khi triển khai trên local machine. Network diagram sẽ như sau:
![](https://github.com/user-attachments/assets/9b397141-30f5-4269-be22-f22676d97c77)

- `eth0` là network interface được sử dụng trên máy host (có thể card vật lý hay card ảo) cho phép các kết nối từ bên ngoài máy host.
- `docker0` (bridge network) là một network đặc biệt được tạo mặc định bởi Docker, nó có nhiệm vụ hỗ trợ các container có thể giao tiếp ra bên ngoài máy host.
- `veth0` & `veth1` là virtual network interface được tạo ra tự động bởi Docker và gắn cho mỗi một container (nếu không set network cho container, mặc định được gắn với `docker0`)

Nhìn vào diagram chúng ta có thể thấy Container 1 và Container 2 có thể kết nối với nhau thông qua địa chỉ IP (vì chúng cùng gắn với `docker0` network). Nếu expose listening port của một trong các container ra ngoài máy host, bản chất iptables rule được bổ sung để NAT các packet từ card `eth0` tới `veth0` (hoặc `veth1`) trong Docker container.

## Tuy nhiên đối với Kubernetes thì làm sao hai container cùng một Pod có thể kết nối với nhau thông qua localhost?

May thay khi triển khai một Docker container thay vì tạo một virtual network interface mới, nó có thể chỉ định một share network interface hiện có. Hình dung lại diagram sẽ như sau:
![](https://github.com/user-attachments/assets/c9024688-5392-4bf3-acc2-fd283af5425b)
Bây giờ thì Container 2 thay vì gắn với `veth1` như ở diagram trước thì giờ được gắn chung với `veth0`, việc này cho chúng ta một số các thay đổi như sau:

- Cả hai container trên sẽ có cùng một địa chỉ IP là `172.17.0.2` nên các ứng dụng bên trong nó có thể listen port trên cùng địa chỉ IP và có thể kết nối với nhau thông qua localhost.
- Điều này cũng có nghĩa rằng hai container không thể listen cùng một port giống nhau được, đây là một hạn chế nhưng nó không khác gì việc chạy nhiều process trên cùng một máy host.
- Bằng cách này thì các ứng dụng (process) có thể tận dụng được tính chất decoupling và isolation của container trong khi chúng lại có thể sử dụng chung một network.

Kubernetes đã implement pattern nói trên bằng cách triển khai một container đặc biệt cho mỗi Pod và có mục đích duy nhất là cung cấp network interface cho các container. Chúng ta có thể kiểm tra bằng cách sử dụng command docker ps trên các Kubernetes node (running Pod):

```shell
➜  docker ps
```

```text
CONTAINER ID        IMAGE                       COMMAND ...
...
3b45e983c859        k8s.gcr.io/pause:3.2        "/pause" ...
```

![](https://github.com/user-attachments/assets/bb1b4a92-9086-4d4a-9984-a90a77330d2f)

## Giao tiếp giữa các Pod trên nhiều Kubernetes node

- Một cụm Kubernetes có thể có một hay nhiều node, node là một máy chủ vật lý hay ảo hoá (có cài đặt Docker và các thành phần phụ thuộc của k8s).
- Tất cả các node trong cùng một cụm k8s phải được thông kết nối với nhau (hoặc trên cùng một private network), đối với các public cloud (AWS, Azure, Google Cloud) thì cần đảm bảo các instance được gắn cùng VPC.
- Ví dụ sau đây sẽ sử dụng một private network `10.100.0.0/24` với 02 node tương ứng là `10.100.0.2` và `10.100.0.3`, network giữa các Pod trong k8s như sau:
  ![](https://github.com/user-attachments/assets/38256b52-5115-49db-bd04-c50f1910bcf6)

Dựa vào diagram chúng ta sẽ thấy được như sau:

- Ở server node bên trái có network interface `eth0` với địa chỉ là `10.100.0.2` và được kết nối tới network `docker0` (bridge network) có default gateway là `172.17.0.1`.
- `veth0` có địa chỉ `172.17.0.2` thuộc dải `docker0` và được tạo bởi pause container, `veth0` có thể nhìn thấy bên trong cả 03 container nhờ shared network stack.
- Như đã giải thích ở phần trên, bản chất iptables rule sẽ setup các gói tin (từ `eth0`) có địa chỉ đích là `172.17.0.2` forward tới `docker0` (bridge network) rồi tới `veth0`.
- Tương tự ở server node bên phải cũng có network interface `eth0` với địa chỉ là `10.100.0.3` được kết nối tới `docker0` có default gateway là `172.17.0.1`. Hmm, chỗ này bắt đầu trở nên phức tạp rồi đây 🤔🤔🤔

Mỗi server node là độc lập (với các node khác), card mạng `docker0` được tạo ra mặc định và quản lý bởi Docker trên server node đó thôi. Sẽ có thể xảy ra vấn đề trên cả 02 node đều triển khai service Pod gắn với `veth0` riêng biệt nhưng lại có cùng 1 địa chỉ là `172.17.0.2`. Vậy làm thế nào mà packet được gửi qua lại giữa 02 Pod (trên 02 node khác nhau) khi chúng giao tiếp?

---

Để giải quyết vấn đề này, Kubernetes đã giải quyết như sau:

- K8s đã assign address space (do k8s tạo và quản lý) cho bridge network trên từng node, nhìn vào hình dưới thấy được bridge network `cbr0` do k8s tạo ra và được assign dải mạng tách biệt (không trùng nhau) cho mỗi node. → Như vậy giải quyết được vấn đề 1 gói tin có source IP và destination IP trùng nhau.
- Tuy nhiên lúc này gói tin đi ra từ node bên trái (có source IP là `10.0.1.2`) làm sao biết được destination IP đang nằm ở trên node nào? Vì vậy k8s đã bổ sung routing rules cho routing table với mục đích định tuyến gói tin tới node phù hợp. → Gói tin từ card `eth0` sẽ mặc định đẩy vào gateway `10.100.0.1` (vì destination IP của gói tin không nằm trong dải `10.100.0.0`). Routing table sẽ forward gói tin tới node phù hợp.
  ![](https://github.com/user-attachments/assets/71aed0c4-2882-4e36-8ab4-94582c80d927)
- Như ví dụ ở hình bên trên, có thể thấy trong routing table (quản lý bởi `kube-proxy`) các gói tin có destination IP thuộc dải `10.0.2.0/24` thì sẽ được forward tới node `10.100.0.3`.
- Bảng routing table ở trên sẽ được quản lý bởi k8s và `kube-proxy`, các bridge network `cbr0` chúng ta đã nói ở trên sẽ được cấu hình tự động trong routing table (khi tạo worker node).
- Nhìn hình vẽ ta nhầm tưởng rằng Routing table nằm duy nhất ở một nơi nào đó (master hay worker hoặc một nơi nào đó) nhưng thực chất thì bảng này được đặt ở trên tất cả các node trong cụm k8s. Tất cả gói tin ra vào node thì đều đã được routing tới node đích phù hợp.
- `kube-proxy` sẽ quản lý (thêm, sửa, xoá) rules trong Routing table, ngoài ra thằng `kube-proxy` này còn có rất nhiều nhiệm vụ khác mà chúng ta sẽ tìm hiểu ở phần service network.

# Reference Link

Tổng quan về Pod trong k8s:

- https://kubernetes.io/vi/docs/tutorials/kubernetes-basics/explore/explore-intro

Giải thích chi tiết về network hoạt động như thế nào trong Pod resource:

- https://medium.com/google-cloud/understanding-kubernetes-networking-pods-7117dd28727
- https://www.tutorialworks.com/kubernetes-pod-communication
