---
author: thuongnn
pubDatetime: 2021-11-28T01:29:35Z
modDatetime: 2025-07-13T06:35:03Z
title: Tìm hiểu về Service network
draft: false
isPinned: true
tags:
  - Kubernetes
  - Networking
description: Tìm hiểu về network trong Kubernetes Service.
ogImage: https://github.com/user-attachments/assets/901f1427-bd81-495f-899b-1125d2432917
---

Trong phần Pod network chúng ta đều biết rằng Pod resource là đơn vị nhỏ nhất sẽ có chứa ứng dụng bên trong nó khi triển khai và loại resource này khá là linh hoạt (có thể scale up, scale down, stop, re-created, re-allocated,…)

Bởi sự linh hoạt này nên không có gì là chắc chắn đối với IP address của một Pod, IP address có thể liên tục bị thay đổi trong nhiều trường hợp → **Vậy làm sao để connect giữa 02 Pod với nhau?**

Lại quay về vấn đề cũ (khi có nhiều replicas của một service trong Docker Swarm), chúng ta lại nghĩ đến cần phải có một proxy như reverse-proxy/load balancer:

- Client sẽ kết nối đến proxy và proxy đó đảm nhiệm nhiệm vụ maintain danh sách các healthy servers mà client muốn kết nối tới.
- Proxy nhận biết các IP address của Pod còn sống hay đã chết, bổ sung thêm hay loại bỏ bớt Pod (replicas) → Từ đây client chỉ cần kết nối đến IP address của proxy thôi.

![](https://github.com/user-attachments/assets/3670a594-98f9-4e60-bd6d-5d9559ad2759)

Kubernetes đã thiết kế một resource tương tự như thành phần proxy đã nói ở trên gọi là Service, Service resource có đặc điểm như sau:

- it must itself be durable and resistant to failure.
- it must have a list of servers it can forward to.
- it must have some way of knowing if a particular server is healthy and able to respond to requests.

## Table of contents

## Vậy Kubernetes Service hoạt động như thế nào?

Để tìm hiểu cách mà Service hoạt động, chúng ta sẽ tạo một Deployment resource như sau:

```yaml
kind: Deployment
apiVersion: apps/v1
metadata:
  name: service-test
spec:
  replicas: 2
  selector:
    matchLabels:
      app: service_test_pod
  template:
    metadata:
      labels:
        app: service_test_pod
    spec:
      containers:
        - name: simple-http
          image: python:2.7
          imagePullPolicy: IfNotPresent
          command: ["/bin/bash"]
          args:
            [
              "-c",
              'echo "<p>Hello from $(hostname)</p>" > index.html; python -m SimpleHTTPServer 8080',
            ]
          ports:
            - name: http
              containerPort: 8080
```

Deployment sẽ triển khai 02 simple http server Pods và listen ở port 8080, kiểm tra địa chỉ IP của 02 Pods:

```shell
kubectl get pods --selector=app=service_test_pod -o jsonpath='{.items[*].status.podIP}'
```

Kiểm tra kết nối tới một trong 02 Pods trên bằng cách chạy một client Pod như sau:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: service-test-client1
spec:
  restartPolicy: Never
  containers:
    - name: test-client1
      image: alpine
      command: ["/bin/sh"]
      args: ["-c", "echo 'GET / HTTP/1.1\\r\\n\\r\\n' | nc 10.0.2.2 8080"]
```

Client Pod ở trên sẽ tạo một kết nối tới địa chỉ IP `10.0.2.2` (có thể thay thế IP address này bằng địa chỉ IP của một trong 02 Pod ở trên). Xem kết quả chạy của client Pod đã triển khai bằng command kubectl logs `service-test-client1`.

Chúng ta thấy rằng việc kết nối thông qua IP address của Pod khá là khó khăn:

- Cần phải lấy thủ công IP address của các Pod trong Deployment resource.
- IP address sẽ bị thay đổi và lấy thủ công lại lần nữa trong các trường hợp Pod (stop, scale up, scale down,…)
- Không tận dụng được hết hiệu năng khi các kết nối từ client Pod không được chia đều ra các Pod trong Deployment resource.

Từ vấn đề trên k8s có hỗ trợ chúng ta một loại resource là Service có thể giải quyết được vấn đề này, triển khai Service như sau:

```yaml
kind: Service
apiVersion: v1
metadata:
  name: service-test
spec:
  selector:
    app: service_test_pod
  ports:
    - port: 80
      targetPort: 8080
```

```shell
kubectl get service service-test
```

```text
NAME           CLUSTER-IP     EXTERNAL-IP   PORT(S)   AGE
service-test   10.3.241.152   <none>        80/TCP    11s
```

Service resource sẽ cấu hình một proxy để forward các request của client tới danh sách Pod thông qua labels đã được assign khi khởi tạo (labels trong Deployment resource).

Như khai báo Service ở trên, k8s sẽ tạo một Service có tên `service-test` gán với một địa chỉ IP và listen port 80. Điều này có nghĩa rằng client có thể kết nối tới các http server Pods thông qua IP address `10.3.241.152` và port 80:

Có lẽ chúng ta sẽ không cần phải dùng đến IP address của Service, k8s đã cung cấp một internal cluster DNS hỗ trợ resolves IP address của Service thông qua Service name. Thử kiếm tra bằng cách kết nối tới `service-test` như sau:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: service-test-client2
spec:
  restartPolicy: Never
  containers:
    - name: test-client2
      image: alpine
      command: ["/bin/sh"]
      args: ["-c", "echo 'GET / HTTP/1.1\\r\\n\\r\\n' | nc service-test 80"]
```

Kiểm tra logs của client Pod nhận thấy kết quả trả về không khác gì với cách truy cập bằng IP address. Nếu chạy lại nhiều lần client Pod ở trên chúng ta sẽ thấy kết quả trả về sẽ được LB round robin tới 02 http server Pods. Great 😉

## Service Network

Kiến trúc kết nối giữa client Pod và server Pod (triển khai ở trên) được phác hoạ lại như sau:

![](https://github.com/user-attachments/assets/2877df2d-e429-40f7-8f1b-1d29d29f4d09)

Chúng ta có dải mạng `10.100.0.0/24` chính là network chứa IP address của các server node trong cụm k8s, các server node sẽ giao tiếp với nhau thông qua dải mạng này.

- Đối với cụm k8s được triển khai trên các dịch vụ public cloud (AWS, Azure, Google Cloud) thì các server node sẽ giao tiếp với nhau thông qua private network (được tạo bởi VPC network). Các client request sẽ kết nối với cụm thông qua public IP address.
- Đối với cụm k8s triển khai trên các virtual machine, cloud server thông thường thì sẽ kết nối với nhau thông qua đường internet (đường ra vào trên chính public IP address của các server node).

Dải mạng `10.0.0.0/14` là network do k8s tạo và quản lý riêng trên từng server node (mỗi server node sẽ có lớp mạng riêng):

- Dải mạng `cbr0` (custom bridge network) tương tự như `docker0` (bridge network) vậy. Chỉ khác là nó đặc biệt hơn, do k8s quản lý trên tất cả các server node.
- Mỗi Pod resource sẽ được assign một IP address trên dải mạng của `cbr0`.

Bảng Routing table thực chất sẽ được đặt trên tất cả các host (node) và được quản lý bởi kube-proxy, khi có bất cứ thông tin thay đổi nào thì k8s master sẽ thực hiện gửi đồng bộ xuống cho kube-proxy và nó sẽ update rules vào Routing table.

Khi chúng ta tạo Service resource, thực chất nó sẽ hoạt động như sau:

```shell
kubectl describe services service-test
```

```text
Name:                   service-test
Namespace:              default
Labels:                 <none>
Selector:               app=service_test_pod
Type:                   ClusterIP
IP:                     10.3.241.152
Port:                   http    80/TCP
Endpoints:              10.0.1.2:8080,10.0.2.2:8080
Session Affinity:       None
Events:                 <none>
```

![](https://github.com/user-attachments/assets/d5ffe94d-24de-4e6f-a3cd-fc66e270485b)

- Bản chất khi tạo Service resource, nó sẽ tự sinh ra Endpoint resource được dùng để mapping với Pod resource như hình ở trên (mapping với IP address và port của Pod resource). Địa chỉ IP của Service resource mà client Pod kết nối tới là một địa chỉ IP ảo được tạo và quản lý bởi `kube-proxy`.
- DNS server của k8s (chính là `core-dns` container) sẽ lưu trữ các A record và thực hiện resolve địa chỉ IP cho client Pod. Như ở hình trên thì có thể thấy được DNS server sẽ resolve domain `service-test` và trả về cho client Pod địa chỉ IP là `10.3.241.152`, các gói tin đi ra từ client Pod sẽ được set Destination IP là `10.3.241.152` trong header.

Bây giờ chúng ta sẽ bắt đầu quá trình từ client Pod khi kết nối tới server Pod thông qua Service resource với diagram sau đây:
![](https://github.com/user-attachments/assets/901f1427-bd81-495f-899b-1125d2432917)

- Các gói tin được gửi từ client Pod sẽ có destination IP là `10.3.241.152` (chính là địa chỉ IP ảo của Service resource, nó được resolve khi gọi đến `service-test`), những gói tin này sẽ được forward tới gateway của card mạng `cbr0` (gateway ip là `10.0.1.1`) bởi vì mạng này không biết destination IP của gói tin.
- Các gói tin đó sẽ đi ra ngoài tới card mạng `eth0` của máy host, `eth0` network cũng không biết gửi gói tin đi đâu và nó sẽ tiếp tục forward gói tin tới gateway IP là `10.100.0.1`. Điểm mấu chốt chính là ở bảng Routing table, các gói tin tới gateway `10.100.0.1` sẽ được NAT lại packet header và routing tới node phù hợp.
- Cụ thể trong diagram phía trên, các header của gói tin có thông tin Destination IP và Destination Port là `10.3.241.152:80` (virtual IP của Service resource tự sinh và port do người dùng thiết lập), routing table sẽ NAT lại các thông tin Destination IP và Destination Port là `10.0.2.2:8080` (địa chỉ IP của thằng server Pod 2 và port ứng dụng trong Pod đó).

## Có một vấn đề là làm sao để NAT được gói tin tới đúng địa chỉ IP của server Pod, và các gói tin này được cân bằng tải đều giữa 02 Pod như thế nào?

Câu trả lời đó chính là kube-proxy và network provider, xem diagram chi tiết dưới đây:

![](https://github.com/user-attachments/assets/882c6c49-1632-44e1-80c2-8e32b822a59b)

**Netfilter** là một công cụ trong kernel space cho phép cập nhật rules liên quan tới định tuyến gói tin trong linux, chắc hẳn chúng ta đều biết đến thằng iptables — nó chính là interface tương tác với netfilter để cấu hình firewall (khác nhau giữa netfilter và iptables xem [ở đây](https://www.zdnet.com/article/netfilter-and-iptables-stateful-firewalling-for-linux/#:~:text=There%20may%20be%20some%20confusion,classify%20and%20act%20on%20packets.)).

Trong kiến trúc của k8s thì thằng kube-proxy sẽ tương tác với **interface network provider** và thằng **network provider** này có nhiệm vụ tương tác với netfilter trong kernel space để cập nhật rules được gửi từ apiserver:

- Khi chúng ta tạo hay cập nhật Pod, Service, Endpoint resource,… → các routing rules liên quan sẽ được tự động gửi vào kube-proxy, kube-proxy sẽ có nhiệm vụ update chúng vào network provider.
- Cơ chế Pod healcheck cũng vậy, thông tin (trạng thái) của server Pod sẽ được kubelet thu thập và gửi về apiserver. Nếu trạng thái của Pod bị thay đổi, apiserver sẽ tự động gửi về kube-proxy của các host(node) để update lại netfilter thông qua network provider.
- Network provider chính là thành phần khi chúng ta cài đặt kubernetes (CNI plugins), mọi thông tin routing rules trên node sẽ do thằng này quản lý (thêm, sửa, xoá)

_Tất cả các routing rules sẽ được liên tục cập nhật vào Routing table của netfilter_, việc forward gói tin hay cân bằng tải các gói tin đều do thằng netfilter này làm hết. Cân bằng tải thì được thực hiện bằng cơ chế IPVS, iptables,… sẽ tuỳ thuộc theo thằng network provider được sử dụng là gì.

![Diagram chi tiết hơn về việc gói tin được xử lý với netfilter, chi tiết có thể xem thêm [ở đây](https://www.stackrox.com/post/2020/01/kubernetes-networking-demystified/)](https://github.com/user-attachments/assets/7ae96fa0-6d4d-41e6-8833-976de1f2b755)_Diagram chi tiết hơn về việc gói tin được xử lý với netfilter, chi tiết có thể xem thêm [ở đây](https://www.stackrox.com/post/2020/01/kubernetes-networking-demystified/)_

**Network provider (CNI plugins)**

- Như đã nói ở trên, tất cả các routing rules của cụm k8s sẽ được thêm vào Routing table → việc Routing table sẽ ngày càng bị phình rất là to bởi vì một cụm k8s có thể chạy đến hàng nghìn tài nguyên (Pod, Service, Endpoint resource,…)
- Bởi vậy chúng ta cần phải có những cơ chế, thuật toán sử dụng để quản lý các routing rules trong netfilter một cách hiệu quả nhất. Đây chính là thằng network provider (CNI plugins) chúng ta nói ở trên, đã có rất nhiều các CNI plugins được sử dụng trong cộng đồng k8s.
- Những thằng CNI plugins phổ biến như fannel, calico, cilium, weave-net,… sẽ được lựa chọn cài đặt khi dựng cụm k8s, mỗi thằng plugin này có ưu nhược điểm khác nhau → tuỳ theo nhu cầu sử dụng, chúng ta sẽ chọn plugin phù hợp nhất.

![Xem chi tiết so sánh giữa các CNI plugins [ở đây](https://platform9.com/blog/the-ultimate-guide-to-using-calico-flannel-weave-and-cilium/)](https://github.com/user-attachments/assets/4de5ac6c-1595-46f3-bc4d-eb1ef66473ae)_Xem chi tiết so sánh giữa các CNI plugins [ở đây](https://platform9.com/blog/the-ultimate-guide-to-using-calico-flannel-weave-and-cilium/)_

## Phân loại Service resource

### Service CÓ proxy

![](https://github.com/user-attachments/assets/6fbcfa15-5dcb-4aa4-974a-76075312a766)

- Đặc điểm chung của loại Service kèm proxy (có type là **ClusterIP**, **NodePort**, **LoadBalancer**) là gom toàn bộ các Pod với cơ chế selector label qua một Virtual IP chung (như đã giải thích ở trên).
- Các request gọi đến Service kèm proxy sẽ được tự động load balacing (round-robin) tới các Pod phía sau nó, tự động discovery khi các Pod (có label đã đăng ký với Service) được khởi chạy hoặc dừng.
- Proxy ở đây là cơ chế đã giải thích ở phân Service resource hoạt động như nào? cách mà chúng được cân bằng tải, hay cách chúng kết nối với nhau.

**ClusterIP**

![](https://github.com/user-attachments/assets/c4701fef-447c-4c69-92f4-a2e626755166)

Ở ví dụ trước chúng ta sử dụng Service với type mặc định là ClusterIP, loại Service này được sử dụng để giao tiếp nội bộ trong cụm k8s. Ví dụ như client Pod kết nối tới 02 server Pod thông qua Service resource, **ClusterIP** chỉ là một IP ảo `10.3.241.152` - chỉ có những Pod resource chạy bên trong cụm mới có thể kết nối đến ClusterIP này.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: service-test
spec:
  type: ClusterIP # Chỉ tạo Virtual IP
  selector:
    app: service_test_pod # Label selector
  ports:
    - protocol: TCP # Protocol
      port: 80 # Port của Service
      targetPort: 8080 # Port của Pod
```

**NodePort**

![](https://github.com/user-attachments/assets/35564293-4230-4083-9604-21ca5800b7fd)

_Vấn đề ở đây là làm sao cho client có thể kết nối tới các service Pod trong cụm k8s?_ từ đây k8s mới cung cấp loại Service type là **NodePort**. Các client ở bên ngoài cụm k8s lúc này có thể truy cập vào cụm thông qua IP address `10.100.0.2`

Khi tạo Service resource có type là NodePort, k8s sẽ tự động tạo thành phần ClusterIP (tự tạo Virtual IP) rồi mapping tới một port ngẫu nhiên (30000~32767) trên tất cả các worker node (port này có thể được cấu hình fix cứng thông qua yaml file).

Ví dụ ở hình bên trên, client có thể truy cập vào địa chỉ IP `10.100.0.2:30080` hoặc `10.100.0.3:30080` (miễn sao client cùng dải mạng với cụm k8s). Port **30080** sẽ được listen trên card eth0 của tất cả các worker node, đây chính là lý do tại sao không thể tạo nhiều Servicce (NodePort) fix cứng nodePort giống nhau.

```yaml
---
apiVersion: v1
kind: Service
metadata:
  name: service-test
spec:
  type: NodePort # Virtual IP + map host port
  selector:
    app: service_test_pod # Label selector
  ports:
    - protocol: TCP # Protocol
      port: 80 # Port của Service
      targetPort: 8080 # Port của Pod
      nodePort: 30080 # Port của Host (optional)
```

**LoadBalancer**

![](https://github.com/user-attachments/assets/6716038c-6119-48cf-80f9-af10d28237f6)

Lúc này, tất cả các worker node đều listen chung một port duy nhất, client có thể truy cập vào bất kỳ node nào trong cụm với port duy nhất trên để kết nối tới Pod bên trong. **_Vấn đề ở đây là chúng ta cung cấp địa chỉ IP của worker node nào cho client? nhỡ worker node đó chết thì sao?_**

Ví dụ đơn giản nhất là trên dịch vụ Cloud, các worker node nằm trên dải VPC network mà client từ bên ngoài internet không thể truy cập vào được. Chúng ta phải cần một con Load Balancer (có 1 chân public IP phơi ra cho client truy cập) làm nhiệm vụ cân bằng tải tới các worker node bên trong dải VPC network kia. Đây chính là Service resource có type là **LoadBalancer**.

Tuy nhiên loại này không được sử dụng phổ biến trong thực tế, nó cũng chả khác gì con cân bằng tải thông thường cả (nginx, haproxy, envoy,…) Vì vậy để giải quyết vấn đề trên, đa số thường chọn giải pháp tự dựng Load Balancer cho cụm k8s (có thể cấu hình được nhiều thứ hơn so với Service type LoadBalancer của k8s).

Khi sử dụng resource này trên cloud (ví dụ như Google Cloud, AWS, Azure,…) bọn nó sẽ tự động gán một public IP cho Service → tất nhiên là nó sẽ tính phí trên mỗi public IP tạo ra.

```yaml
---
apiVersion: v1
kind: Service
metadata:
  name: service-test
  annotations:
    service.beta.kubernetes.io/aws-load-balancer-backend-protocol: http
    service.beta.kubernetes.io/aws-load-balancer-ssl-ports: "443,8443"
spec:
  type: LoadBalancer # Virtual IP + map host port + create LB
  selector:
    app: service_test_pod # Label selector
  ports:
    - protocol: TCP # Protocol
      port: 80 # Port của Service
      targetPort: 8080 # Port của Pod
      nodePort: 30080 # Port của Host (optional)
```

### Service KHÔNG proxy (Headless Service)

![](https://github.com/user-attachments/assets/d34c7ba8-fa75-4447-80ef-3d1e31956b51)

```yaml
---
apiVersion: v1
kind: Service
metadata:
  name: service-test
spec:
  clusterIP: None # Không tạo Virtual IP
  selector:
    app: service_test_pod # Label selector
  ports:
    - protocol: TCP # Protocol
      targetPort: 8080 # Port của Pod
```

- Đây là loại Service không sử dụng proxy - đồng nghĩa với việc nó sẽ không tạo bất kỳ Virtual IP nào và client sẽ kết nối thông qua cơ chế **DNS Load Balancing**.

- Thay vì trả về Virtual IP, khi truy cập vào domain service-test sẽ được resolve ra danh sách các địa chỉ IP của server Pod. Phía client cần phải chọn ra địa chỉ IP của Pod mà nó muốn kết nối đến, DNS server của k8s cũng hỗ trợ LB sử dụng thuật toán round robin để trả về danh sách địa chỉ IP của các server Pod.

- Lúc này client Pod sẽ không kết nối tới server Pod thông qua Virtual IP của Service resource nữa, thay vào đó nó sẽ thực hiện kết nối trực tiếp tới 1 Pod server. Cách này chúng ta không thể mapping port của container Pod với một port bất kỳ nào khác, nên các kết nối cần phải sử dụng chính xác port của container trong Pod.

- Như ví dụ ở diagram phía trên, chúng ta có thể truy cập vào server Pod thông qua DNS name `service-test:8080` hoặc `10.0.1.2:8080`, `10.0.2.2:8080`. Nó vẫn đảm bảo cơ chế healthcheck các server Pod phía sau và trả về danh sách các địa chỉ IP của healthy Pod.

![](https://github.com/user-attachments/assets/fbdf3334-5a5a-4fac-9369-b51ef0dbd3d5)

Một trường hợp sử dụng nữa đối với **Service NO proxy** là cấu hình kết nối tới Database server bên ngoài cụm (như diagram ở trên), chúng ta sẽ thiết kế Service resource với clusterIP là None và một Manual Endpoint để cấu hình địa chỉ IP và port (của PostgreSQL server).

Khi tạo Service resource, thông tin của Service sẽ được k8s apiserver cập nhật vào DNS server (chính là `core-dns` container trong kube-system namspace). Vì vậy trong golang API container có thể resolve được địa chỉ IP của database service là `192.0.2.42`.

```yaml
---
apiVersion: v1
kind: Service
metadata:
  name: database
spec:
  clusterIP: None
  ports:
    - protocol: TCP
      targetPort: 5432
---
apiVersion: v1
kind: Endpoints
metadata:
  name: database
subsets:
  - addresses:
      - ip: 192.0.2.42
    ports:
      - port: 5432
```

## Tìm hiểu thêm về K8s Networking

- Pod network: [Tìm hiểu về Pod network](/posts/kubernetes/learn-about-pod-network/)
- Ingress network: [Tìm hiểu về Ingress network](/posts/kubernetes/learn-about-ingress-network/)

## Reference Link

- Giải thích chi tiết về Service network trong k8s: [https://medium.com/google-cloud/understanding-kubernetes-networking-services-f0cb48e4cc82](https://medium.com/google-cloud/understanding-kubernetes-networking-services-f0cb48e4cc82)
- So sánh sự khác nhau giữa Service (có proxy) và Headless Service (không proxy): [https://dev.to/kaoskater08/building-a-headless-service-in-kubernetes-3bk8](https://dev.to/kaoskater08/building-a-headless-service-in-kubernetes-3bk8)
- So sánh chi tiết giữa các CNI plugins: [https://rancher.com/blog/2019/2019-03-21-comparing-kubernetes-cni-providers-flannel-calico-canal-and-weave](https://rancher.com/blog/2019/2019-03-21-comparing-kubernetes-cni-providers-flannel-calico-canal-and-weave)
- Xem chi tiết cách kube-proxy với netfilter hoạt động như nào: [https://www.stackrox.com/post/2020/01/kubernetes-networking-demystified](https://www.stackrox.com/post/2020/01/kubernetes-networking-demystified)
- Xem chi tiết tài liệu về netfilter và iptables: [https://news.cloud365.vn/chuyen-sau-ve-iptables-command-va-netfilter](https://news.cloud365.vn/chuyen-sau-ve-iptables-command-va-netfilter)
- Xem chi tiết tài liệu về calico plugin [ở đây](https://object-storage-ca-ymq-1.vexxhost.net/swift/v1/6e4619c416ff4bd19e1c087f27a43eea/www-assets-prod/presentation-media/k8s-calico-v1.0.pdf)
- Phân biệt Port, TargetPort và NodePort trong Kubernetes ở đây: [https://matthewpalmer.net/kubernetes-app-developer/articles/kubernetes-ports-targetport-nodeport-service.html](https://matthewpalmer.net/kubernetes-app-developer/articles/kubernetes-ports-targetport-nodeport-service.html)
