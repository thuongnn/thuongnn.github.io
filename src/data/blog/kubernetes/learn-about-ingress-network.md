---
author: thuongnn
pubDatetime: 2021-11-28T15:29:35Z
title: Tìm hiểu về Ingress network
draft: false
tags:
  - Kubernetes
  - Networking
  - Ingress
description: Tìm hiểu về network trong Kubernetes Ingress.
---

Ingress là gì, Ingress resource khác gì với Service type là LoadBalancer?

Trong kubernetes, Ingress là một loại resource cho phép client truy cập vào Service resource từ bên ngoài cụm. Nghe qua thì tương đối giống với Service có type là LoadBalacner (đã tìm hiểu rõ ở phần Service Network), rõ hơn chúng ta sẽ có ví dụ sau: triển khai 02 ứng dụng worker và api như diagram dưới đây:

![](https://github.com/user-attachments/assets/afd8b13f-f3a4-4e0b-a484-c293bf95e661)

Nếu expose 02 ứng dụng worker application và api application ra ngoài cho client có thể truy cập được, thì cần phải triển khai 02 Service type LoadBalancer cho mỗi ứng dụng đó.

> _Cách này có thể chấp nhận được, tuy nhiên trên môi trường Cloud thì cần phải ít nhất 02 public IP cho mỗi LoadBalancer Service ở trên. Chưa kể đến việc chúng ta chỉ cần duy nhất một public IP cấu hình DNS server cho cả hệ thống, thì việc cần 02 public IP sẽ tốn thêm tiền cho dịch vụ Cloud._

## Table of contents

## Vì vậy Ingress resource đã được tạo ra để giải quyết vấn đề này

![](https://github.com/user-attachments/assets/672cc4f1-7f4b-44ca-8dee-719bb489f225)

Thay vì phải cần đến 02 Service type LoadBalancer (tốn đến 02 public IP) thì chúng ta chỉ có 01 resource duy nhất là Ingress (có duy nhất 01 public IP).

Ingress sẽ làm nhiệm vụ routing kết hợp với cân bằng tải giúp cho các request từ client đến các Service bên trong cụm, ngoài ra đối với Ingress còn có rất nhiều các tính năng khác như cấu hình domain, cấu hình TLS, authentication,…

Ingress resource sẽ cần phải kết hợp với Service resource có type là NodePort, flow của Ingress sẽ như ví dụ dưới đây:

![](https://github.com/user-attachments/assets/79fb16d2-208e-4cd7-ac71-81168752e931)

```yaml
# Deployment
---
spec:
  replicas: 1
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
---
# Service
---
kind: Service
metadata:
  name: my-service
  labels:
    app: nginx
spec:
  type: NodePort
  selector:
    app: nginx
  ports:
    - protocol: TCP
      port: 80
      targetPort: 9376
---
#Ingress
---
spec:
  rules:
    - host: a.domain.com
      http:
        paths:
          - backend:
              serviceName: my-service
              servicePort: 80
```

## Nguyên lý hoạt động của Ingress

![](https://github.com/user-attachments/assets/f3963bc2-0c03-43af-bc28-057815adcaaf)

Thực chất **Ingress resource** mà chúng ta khai báo trong kubernetes chỉ là một tệp config được khai báo, tệp config này sau đó sẽ được apply vào **Ingress Controller** mà chúng ta sử dụng!

Kubernetes hỗ trợ Ingress Controller dưới dạng một interface mà chúng ta có thể dynamic thay đổi nó với Ingress Controller Provider phù hợp, ví dụ như:

- [Kubernetes Ingress](https://kubernetes.github.io/ingress-nginx/) - mặc định của Kubernetes, lõi của con này sử dụng Nginx.
- [NGINX Ingress](https://docs.nginx.com/nginx-ingress-controller/intro/nginx-ingress-controllers) - được phát triển bởi [Nginx](https://www.nginx.com/), dựa trên [NGINX Plus](https://www.nginx.com/products/nginx/).
- [Kong Ingress](https://docs.konghq.com/kubernetes-ingress-controller/) - được phát triển bởi [Kong](https://konghq.com/), nổi tiếng với [Kong API Gateway](https://docs.konghq.com/gateway-oss/).
- [Istio Ingress](https://istio.io/latest/docs/tasks/traffic-management/ingress/) - được biết đến nhiều hơn với giải pháp Service Mesh, dựa trên [Envoy](https://www.envoyproxy.io/).
- [Ambassador](https://www.getambassador.io/) - tương tự như Istio, cũng dựa trên [Envoy](https://www.envoyproxy.io/).
- [HAProxy Ingress](https://haproxy-ingress.github.io/docs/getting-started/) - [HAProxy](https://www.haproxy.com/) thì được biết đến nhiều hơn là một proxy server và load balancer, tuy nhiên cũng có một dự án làm Ingress Controller cho Kubernetes.
- [Traefik Ingress](https://doc.traefik.io/traefik/providers/kubernetes-ingress/) - là giải pháp Ingress Controller được phát triển bởi [Traefik](https://traefik.io/).
- …

Đối với mỗi một Ingress Controller Provider khác nhau thì có những tính năng, hỗ trợ khác nhau tuỳ theo nhu cầu sử dụng. Để cân nhắc hơn các lựa chọn sử dụng Ingress Controller cho một dự án, xem so sánh của chúng tại đây: [https://blog.flant.com/comparing-ingress-controllers-for-kubernetes](https://blog.flant.com/comparing-ingress-controllers-for-kubernetes).

## Ingress Tutorial

- Xem hướng dẫn cấu hình NGINX Ingress với [Cert Manager](https://cert-manager.io/docs/tutorials/acme/ingress/) (sử dụng [Let’s Encrypt](https://letsencrypt.org/docs/)) trong Kubernetes [ở đây](https://medium.com/containerum/how-to-launch-nginx-ingress-and-cert-manager-in-kubernetes-55b182a80c8f).
- Demonstration triển khai Kubernetes Ingress với Nginx [ở đây](https://matthewpalmer.net/kubernetes-app-developer/articles/kubernetes-ingress-guide-nginx-example.html).

## Tham Khảo

- [https://www.stackrox.com/post/2020/01/kubernetes-networking-demystified](https://www.stackrox.com/post/2020/01/kubernetes-networking-demystified)
- [https://medium.com/google-cloud/understanding-kubernetes-networking-ingress-1bc341c84078](https://medium.com/google-cloud/understanding-kubernetes-networking-ingress-1bc341c84078)
- [https://medium.com/flant-com/comparing-ingress-controllers-for-kubernetes-9b397483b46b](https://medium.com/flant-com/comparing-ingress-controllers-for-kubernetes-9b397483b46b)
