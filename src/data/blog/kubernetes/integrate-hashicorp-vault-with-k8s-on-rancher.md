---
author: thuongnn
pubDatetime: 2024-04-13T22:29:35Z
title: Tích hợp Hashicorp Vault với K8S trên Rancher
featured: false
draft: false
tags:
  - Kubernetes
  - Hashicorp Vault
description: Hướng dẫn chi tiết cách tích hợp Hashicorp Vault với Kubernetes (triển khai qua Rancher) để lấy giá trị bí mật.
---

## Table of contents

## Service Account (SA) là gì?

Đối với Kubernetes có một loại resource gọi là `ServiceAccount` - bất kỳ Pod (đơn vị nhỏ nhất để triển khai ứng dụng trên K8S) sẽ luôn có một SA đính kèm theo.

Có thể định nghĩa SA cho một đơn vị triển khai trên K8S hoặc là chúng sẽ sử dụng default service account (do K8S tự tạo mặc định). SA gắn với mỗi Pod sẽ có token tương ứng của SA đó mà chúng ta có thể tìm thấy trong Pod với đường dẫn thư mục sau: `/var/run/secrets/kubernetes.io/serviceaccount`

SA đóng vai trò xác thực và phân quyền trên K8S, đồng thời mỗi default SA gán cho mỗi Pod sẽ có quyền hạn nhất định (ví dụ app bên trong Pod sử dụng SA token để gọi KubeAPI lấy một số thông tin của cụm). Chúng ta có thể gán RBAC với scope là trong một namespace như sau:

![](https://cdn-images-1.medium.com/max/2000/1*0BU3W4JmVGqIxdqlQx7uRQ.png)

Hoặc là gán RBAC với scope là cho cả cụm K8S:

![](https://cdn-images-1.medium.com/max/2000/1*yQ6c8mM4wTF3bkKDdT_WSw.png)

Đọc thêm về ServiceAccount của K8S ở đây: [https://faun.pub/service-account-kubernetes-ec0f112c5bc5](https://faun.pub/service-account-kubernetes-ec0f112c5bc5)

## Kubernetes API Server (Kube API) là gì?

Tiếp theo là Kubernetes API Server — REST API dùng để quản lý tất cả các object trong cụm K8S và chúng ta có thể sử dụng SA token để có thể xác thực với Kube API.

Vì là REST API nên chúng ta có thể dễ dàng tương tác thông qua cURL, CLI, UI,… Ví dụ như Rancher là một trong những platform được dùng để xây dựng cụm K8S, đồng thời nó cũng cung cấp một UI dùng để tương tác với các Kube API cho phép quản trị các cụm K8S dễ dàng hơn.

Tuy nhiên khi sử dụng Rancher thì lớp xác thực và phân quyền trên cụm K8S sẽ được quản lý bởi thằng Rancher và cơ chế của nó như sau:

![](https://cdn-images-1.medium.com/max/2000/1*WJxbmrSweqQHOKDJBxgwFQ.png)

Thay vì tương tác trực tiếp với Kube API như user Alice thì khi sử dụng Rancher — user sẽ phải đi qua một lớp gọi là Authentication Proxy (ví dụ như user Bob).

Đến đây thì việc tích hợp với Hashicorp Vault sẽ có 02 cách

- Tích hợp với Rancher API
- Tích hợp trực tiếp với Kube API của mỗi cụm

## Tích hợp như thế nào?

### Về phía ứng dụng được triển khai trên K8S

![Ví dụ sử dụng Vault sidecar injector](https://cdn-images-1.medium.com/max/2000/1*h8sYPsU-5L2s-ctnT9BDZw.png)_Ví dụ sử dụng Vault sidecar injector_

Sẽ nhận được các giá trị bí mật (secrets) từ hệ thống Vault trong môi trường Runtime — nghĩa là khi Pod ứng dụng khởi tạo, nó sẽ kéo các giá trị này từ Vault về để sử dụng.

Khi truy vấn vào hệ thống Vault nó cần phải gửi kèm theo SA token mà chúng ta đã nói ở trên, Vault sẽ dựa vào SA token để thực hiện xác thực và phân quyền cho ứng dụng đó.

Cơ chế xác thực với Vault sẽ giống như các cơ chế bình thường mà chúng ta dùng với Vault, có thể sử dụng với cURL, CLI, Agent,… Và đối với K8S thì chúng ta cũng có khá nhiều lựa chọn như sau:

- Viết sẵn một script lấy các giá trị secret từ Vault và nhúng nó vào docker image của ứng dụng, khi start lên thì chạy script này rồi mới chạy ứng dụng. Tuy nhiên cách này hơi thô và chưa Cloud Native App lắm.
- (multi-container Pod) Viết một `init-container` cho Pod ứng dụng, `init-container` sẽ thực hiện kéo secret về trước khi main container (ứng dụng) được chạy. 02 container này có thể sử dụng shared volume.
- Sử dụng một số giải pháp gắn [Vault sidecar injector](https://developer.hashicorp.com/vault/docs/platform/k8s/injector), nó cũng tương đương với cách thứ 02 cơ mà chính thống của Vault hơn và được package hết rồi chỉ việc cấu hình.

### Về phía hệ thống Hashicorp Vault

- Cần phải kiểm tra SA token của các ứng dụng gửi lên và chỉ có một cách để kiểm tra đó là gọi tới Kube API, Kube API sẽ thực hiện kiểm tra và đảm bảo cho thằng Vault là SA token đó hợp lệ — có thể tin tưởng được rồi.
- Cũng giống như bất kỳ client nào truy vấn vào Kube API, hệ thống Vault cũng phải có một token khi truy vấn tới Kube API — và phải có một quyền đặc biệt đó là quyền kiểm tra tính hợp lệ của các SA token khác (`system:auth-delegator`).
- Nếu như SA token mà ứng dụng gửi lên đã được xác nhận là hợp lệ rồi thì nó sẽ trả về phía ứng dụng **Vault token** — cái này sẽ dùng để gửi kèm cho những truy vấn get secret về sau.

## Hướng dẫn tích hợp

### Cấu hình trên cụm K8S

Tạo SA token cho hệ thống Vault, bởi Vault cần có quyền đặc biệt là review SA token khác trong cụm K8S nên chúng ta cần phải tạo mỗi cụm một SA token kèm theo quyền này như sau:

```shell
kubectl apply -f - <<EOF
---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: rv-token
---
apiVersion: v1
kind: Secret
metadata:
  name: rv-token
  annotations:
    kubernetes.io/service-account.name: rv-token
type: kubernetes.io/service-account-token
---
  apiVersion: rbac.authorization.k8s.io/v1
  kind: ClusterRoleBinding
  metadata:
    name: role-tokenreview-binding
    namespace: default
  roleRef:
    apiGroup: rbac.authorization.k8s.io
    kind: ClusterRole
    name: system:auth-delegator
  subjects:
  - kind: ServiceAccount
    name: rv-token
    namespace: default
EOF
```

Sau đó lấy token của SA rv-token đã tạo ở trên như sau:

```shell
kubectl get secret devwebapp -o jsonpath="{.data.token}" | base64 --decode
```

### Cấu hình hệ thống Vault với K8S

Trước tiên là việc tích hợp giữa hệ thống Vault và hệ thống Rancher, bởi hệ thống Rancher quản lý toàn bộ các cụm K8S nên nếu tích hợp với Rancher Endpoint thì sẽ không mất công đi cấu hình với từng cụm K8S nữa.

Tuy nhiên việc tích hợp với Rancher lại gặp phải một issue mà cho đến giờ vẫn chưa được giải quyết, nên cách này không thể sử dụng được.
Xem chi tiết issue ở đây: [https://github.com/rancher/rancher/issues/30420](https://github.com/rancher/rancher/issues/30420)

![](https://cdn-images-1.medium.com/max/7266/1*VEm4qYjJO9R1LjkZ18zt5w.png)

Vậy nên phía hệ thống Vault bây giờ cần phải tích hợp trực tiếp tới Kube API trên mỗi cụm K8S như sau:

![](https://cdn-images-1.medium.com/max/5900/1*tAzLH4RkAXsV8HBJNLFylg.png)

Có một rủi ro tiềm tàng đó là Kube API chỉ chạy trên các K8S Master node, đối các hệ thống K8S hiện nay đang triển khai thì luôn triển khai ít nhất 03 master node để đảm bảo tính HA. Tuy nhiên thằng Hashicorp Vault lại chỉ đang cấu hình được với duy nhất 1 endpoint mỗi cụm, vậy nên giải pháp thay thế như sau:

![](https://cdn-images-1.medium.com/max/7648/1*rY5C8Szb6w9T7p_i8wyOxg.png)

### Hướng dẫn chi tiết cấu hình

Enable và khởi tạo Kubernetes module path trên Vault bằng command sau:

```shell
vault auth enable hn-ssi-cluster
```

Cấu hình với hệ thống K8S cho module đã tạo ở trên:

```shell
vault write auth/hn-ssi-cluster/config \
    token_reviewer_jwt="<token có quyền validate token # trong cụm hn-ssi-cluster>" \
    kubernetes_host="https://hn-ssi-cluster:443" \
    kubernetes_ca_cert=@ca.crt \
    disable_local_ca_jwt=true
```

- `token_reviewer_jwt` - sử dụng SA **rv-token** đã tạo từ phía K8S.
- `kubernetes_host` - sử dụng giải pháp thay thế nói ở trên thì chỗ này cần fill host của cụm K8S tương ứng đã cấu hình trong Nginx.
- `kubernetes_ca_cert` - CA Certificate của cụm K8S cần cấu hình (lấy từ cụm K8S).
- `disable_local_ca_jwt` - thông thường thì Vault sẽ sử dụng 02 config `token_reviewer_jwt` và `kubernetes_ca_cert`, tuy nhiên nó cũng có thể sử dụng các giá trị này từ đầu client gửi lên. Tắt cái này đi thì nó chỉ sử dụng duy nhất cấu hình mà đã thiết lập ở trên.

Tiếp theo là thực hiện phân quyền cho các SA token từ phía cụm K8S, đây là một JSON Web Token và chúng ta có thể decode nó để xem có thể phân quyền dựa trên những attribute nào. Hiện tại thì đang support phân quyền tới mức Service Account và Namespace của ứng dụng:

```shell
vault write auth/hn-ssi-cluster/role/devweb-app \
  bound_service_account_names=devwebapp \
  bound_service_account_namespaces=test \
  policies="default,devwebapp" \
  ttl=24h
```

- `devwebapp` là SA được gắn với Pod đang chạy ứng dụng
- policies là các policy của Vault cho phép SA này + Namespace này được phép lấy những giá trị secret gì.

Cuối cùng là từ ứng dụng, cấu hình K8S manifest để đọc các giá trị secrets từ Vault, có thể xem chi tiết hướng dẫn ở đây: [https://developer.hashicorp.com/vault/docs/platform/k8s/injector](https://developer.hashicorp.com/vault/docs/platform/k8s/injector)
