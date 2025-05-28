---
author: thuongnn
pubDatetime: 2022-09-15T16:32:35Z
title: "[Google Cloud] GCP App Engine"
featured: false
draft: false
tags:
  - Google Cloud
description: Tìm hiểu về App Engine trong Google Cloud.
---

## Table of contents

# Giới thiệu

![Untitled](https://github.com/user-attachments/assets/39f9f76f-96b4-4d66-b131-ef9e1a3f4cb6)

- Là dịch vụ cung cấp cách **đơn giản nhất** để triển khai và mở rộng một ứng dụng trên GCP (end-to-end application management).
- Hỗ trợ
  - Go, Java, .NET, NodeJS, PHP, Python, Ruby sử dụng pre-configured runtimes.
  - Có thể **custom run-time** để sử dụng bất cứ ngôn ngữ lập trình nào để viết code.
  - Có thể kết nối dễ dàng tới bất cứ dịch vụ nào khác trong hệ sinh thái của GCP (Cloud Storage, Cloud SQL,…)
- **No usage charges** - Pay for resources provisioned
- **Features**:
  - Tự động Load Balancing & Auto scaling.
  - GCP quản lý việc cập nhật platform và theo dõi sức khoẻ ứng dụng.
  - Application versioning
  - Traffic splitting

## So sánh với Compute Engine

- **Compute Engine**
  - IAAS
  - Linh hoạt hơn trong quá trình triển khai ứng dụng.
  - Chịu trách nhiệm nhiều hơn:
    - Lựa chọn Image để chạy.
    - Tự cài đặt và quản lý phần mềm chạy trên VM.
    - Lựa chọn phần cứng cho VM.
    - Tự cấu hình quản lý truy cập (Certificates/Firewalls).
    - Lựa chọn và lên kế hoạch triển khai đảm bảo tính khả dụng cao.
- **App Engine**
  - PaaS
  - Serverless
  - Chịu trách nhiệm ít hơn khi mà GCP đã quản lý tất cả (chúng ta chỉ việc code còn lại GCP lo)
  - Kém linh hoạt hơn khi GCP đã quản lý mọi thứ và không thể can thiệp sâu vào tầng VM.

# Tìm hiểu chi tiết App Engine

## Phân loại

| **Feature**           | **Standard**                                       | **Flexible**                         |
| --------------------- | -------------------------------------------------- | ------------------------------------ |
| Pricing Factors       | Instance hours                                     | vCPU, Memory & Persistent Disks      |
| Scaling               | Manual, Basic, Automatic                           | Manual, Automatic                    |
| Scaling to zero       | Yes                                                | No. Minimum one instance             |
| Instance startup time | Seconds                                            | Minutes                              |
| Rapid Scaling         | Yes                                                | No                                   |
| Max. request timeout  | 1 to 10 minutes                                    | 60 minutes                           |
| Local disk            | Mostly(except for Python, PHP). Can write to /tmp. | Yes. Ephemeral. New Disk on startup. |
| SSH for debugging     | No                                                 | Yes                                  |

**`Standard`** - là loại triển khai ứng dụng trên một số ngôn ngữ chỉ định bởi GCP.

- Hoàn toàn cô lập giữa OS, Disk với các ứng dụng khác.
- **V1**: Java, Python, PHP, Go (OLD Versions)
  - Có hạn một số hạn chế đối với Python và PHP runtimes:
    - Restricted network Access
    - Chỉ được sử dụng một số extensions và libraries nằm trong white-listed.
- **V2**: Java, Python, PHP, NodeJS, Ruby, Go (NEWER Versions)
  - Không bị hạn chế Network Access và không giới hạn sử dụng Extensions, Libraries với các ngôn ngữ.

**`Flexible`** - là loại ứng dụng sẽ được triển khai trong môi trường Docker containers.

- Hiểu đơn thuần là nó sẽ sử dụng Compute Engine virtual machines để chạy.
- Hỗ trợ đa dạng ngôn ngữ lập trình, không bị giới hạn như Standard (with built-in support for Python, Java, NodeJS, Go, Ruby, PHP, or .NET)
- Có thể truy cập vào VM instances và local disks.

## **Cấu trúc các thành phần của App Engine**

![Untitled](https://github.com/user-attachments/assets/dd15509f-6a16-4378-bec8-bc1f443e6e11)

- **Application**: Cấu trúc bao gồm một ứng dụng cho mỗi Project.
- **Service(s)**: Tương đương với nhiều Microservices hoặc App components.
  - Có thể triển khai nhiều services trong một Application duy nhất.
  - Mỗi một service thì có thể có nhiều settings khác nhau.
- **Version(s)**: Mỗi một phiên bản sẽ bao gồm Code và Configuration.
  - Mỗi một Version thì có thể chạy trên một hay nhiều instances.
  - Có thể tồn tại nhiều Version cùng một lúc.
  - Hỗ trợ rollback ứng dụng hoặc split traffic đi vào Service.

## Tìm hiểu tính năng chính của App Engine

### **Scaling Instances**

Có 03 mode scaling instances như sau:

- **Automatic** - Tự động scale instances dự trên tải của ứng dụng:
  - Auto scale based on:
    - **Target CPU Utilization** - Configure a CPU usage threshold.
    - **Target Throughput Utilization** - Configure a throughput threshold
    - **Max Concurrent Requests** - Configure max concurrent requests an instance can receive
  - Configure **Max Instances** and **Min Instances**
- **Basic** - Instances được tạo ra khi nhận được requests từ Client:
  - **`RECOMMENDATION`** sử dụng với Adhoc Workloads
    - Instances sẽ bị shutdown khi không có một request nào từ Client.
      - Giúp tiết kiệm chi phí nhất có thể.
      - Bù lại là có thể có độ trễ khá cao từ ứng dụng.
    - Không hỗ trợ mode này đối với App Engine Flexible Environment
    - Configure **Max Instances** and **Idle Timeout**
- **Manual** - Cấu hình cụ thể số lượng instances sẽ chạy:
  - Chủ động điều chỉnh số lượng instances trong suốt thời gian ứng dụng.

### **Request Routing**

Có thể sử dụng kết hợp cả 03 cách tiếp cận sau:

- Routing with **URLs**:
  - `https://PROJECT_ID.REGION_ID.r.appspot.com` (default service called)
  - `https://SERVICE-dot-PROJECT_ID.REGION_ID.r.appspot.com` (specific service)
  - `https://VERSION-dot-SERVICE-dot-PROJECT_ID.REGION_ID.r.appspot.com` (specific version of service)
  - Replace `-dot-` with `.` if using custom domain.
- Routing with a **dispatch file**:
  - Configure `dispatch.yaml` with routes.
  - `gcloud app deploy dispatch.yaml`
- Routing with **Cloud Load Balancing**:
  - Configure routes on Load Balancing instance.

### S**plit traffic between multiple versions**

- Có những cách nào cấu hình việc phân phối traffic đi vào version nào?
  - **IP Splitting** - Dựa trên request IP address
    - IP addresses can change causing accuracy issues! (I go from my house to a coffee shop)
    - Nếu tất cả các request đều đến từ một địa chỉ IP (nghĩa là từ 01 Client) thì đảm bảo chúng luôn luôn đi vào một version.
  - **Cookie Splitting** - Dự trên cookie (**GOOGAPPUID**)
    - Cookies can be controlled from your application
    - Cookie splitting accurately assign users to versions
  - **Random** - Do it randomly
- Cách cấu hình cài đặt

  ```bash
  gcloud app services set-traffic s1 --splits=v2=.5,v1=.5 --split-by=cookie
  ```

  Tham số `—split-by` có thể lựa chọn các giá trị: `cookie`, `ip`, `random`.

### Một số kiểu chạy **App Engine tham khảo**

**`App thông thường`**

```yaml
runtime: python28 #The name of the runtime environment that is used by your app
api_version: 1 #RECOMMENDED - Specify here - gcloud app deploy -v [YOUR_VERSION_ID]
instance_class: F1
service: service-name
#env: flex

inbound_services:
  - warmup

env_variables:
  ENV_VARIABLE: "value"

handlers:
  - url: /
    script: home.app

automatic_scaling:
  target_cpu_utilization: 0.65
  min_instances: 5
  max_instances: 100
  max_concurrent_requests: 50
#basic_scaling:
#max_instances: 11
#idle_timeout: 10m
#manual_scaling:
#instances: 5
```

**`Cron Job`**

```yaml
cron:
	- description: "daily summary job"
	  url: /tasks/summary
	  schedule: every 24 hours
```

- Cho phép chạy **scheduled jobs** trong khoảng thời gian nhất định.
- **Use cases**:
  - Send a report by email every day
  - Refresh cache data every 30 minutes
- Configured using **cron.yaml**
- Run this command - **_gcloud app deploy cron.yaml_**
  - Performs a **HTTP GET** request to the configured URL on schedule

**`Dispatch`**

```yaml
dispatch:
  - url: "*/mobile/*"
    service: mobile-frontend
  - url: "*/work/*"
    service: static-backend
```

**`Queue`**

```yaml
queue:
  - name: fooqueue
    rate: 1/s
    retry_parameters:
      task_retry_limit: 7
      task_age_limit: 2d
```

# Tổng kết

- App Engine là **Regional** (services được triển khai trên các Zones). **KHÔNG** **THỂ** thay đổi Region của Application.
- App Engine là một lựa chọn khá tốt cho những kiến trúc Microservices (multiple services) đơn giản:
  - Sử dụng **Standard v2** nếu như sử dụng các ngôn ngữ lập trình được hỗ trợ bởi GCP App Engine.
  - Sử dụng **Flexible** nếu như muốn xây dựng ứng dụng được container hoá.
- Chú ý khi chạy mode Flexible thì số lượng instances không thể scale về 0, khi đó chi phí luôn luôn bị tính. Nên sử dụng Standard nếu như ứng dụng có những thời điểm không có tải để có thể scale về 0 nhằm tiết kiệm chi phí.

## **App Engine - Scenarios**

| Scenario                                                            | Solution                                                                                                                                                |
| ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| I want to create two Google App Engine Apps in the same project     | Not possible. You can only have one App Engine App per project. However you can have multiple services and multiple version for each service.           |
| I want to create two Google App Engine Services inside the same App | Yup. You can create multiple services under the same app. Each service can have multiple versions as well.                                              |
| I want to move my Google App Engine App to a different region       | App Engine App is region specific. You CANNOT move it to different region. Create a new project and create new app engine app in the new region.        |
| Perform Canary deployments                                          | Deploy v2 without shifting traffic (gcloud app deploy --no-promote)Shift some traffic to V2 (gcloud app services set-traffic s1 --splits v1=0.9,v2=0.1) |

Tham khảo chi tiết cách **Deploying new versions without downtime**

- **Option 1**: I’m very confident - Deploy & shift all traffic at once:
  - Deploy and shift all traffic at once from v1 to v2: `gcloud app deploy`
- **Option 2**: I want to manage the migration from v1 to v2
  - **STEP 1**: Deploy v2 without shifting traffic (`-no-promote`)
    - `gcloud app deploy –no-promote`
  - **STEP 2**: Shift traffic to V2:
    - **Option 1** (All at once Migration): Migrate all at once to v2
      - `gcloud app services set-traffic s1 –splits V2=1`
    - **Option 2 (Gradual Migration)**: Gradually shift traffic to v2. Add `-migrate` option.
      - Gradual migration is not supported by App Engine Flexible Environment
    - **Option 3 (Splitting)**: Control the pace of migration
      - `gcloud app services set-traffic s1 –splits=v2=.5,v1=.5`
      - Useful to perform A/B testing
    - Ensure that new instances are warmed up before they receive traffic (`app.yaml` - `inbound_services > warmup`)
