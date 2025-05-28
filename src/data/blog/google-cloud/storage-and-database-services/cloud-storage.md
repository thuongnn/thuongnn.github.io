---
author: thuongnn
pubDatetime: 2022-10-13T21:41:35Z
title: "[Google Cloud] Cloud Storage"
featured: false
draft: false
tags:
  - Google Cloud
description: Tìm hiểu về Cloud Storage trong Google Cloud.
---

## Table of contents

## Giới thiệu

![CloudStorage.png](https://github.com/user-attachments/assets/623b564f-a67f-4f0b-b68b-e8d4119e8001)

- Đây là dịch vụ storage phổ biến nhất, với khả năng linh hoạt và chi phí sử dụng thấp.
- Có thể lưu trữ các objects với dung lượng lưu trữ lớn, sử dụng cách tiếp cận **key-value**:
  - GCP coi các object mà người dùng upload lên như là một đơn vị và không thể cập nhật chúng sau khi upload ⇒ Vậy nên chú ý khi làm việc với Cloud Storage, GCP có hỗ trợ đánh phiên bản nếu như chúng ta muốn cập nhật chúng.
  - Hỗ trợ Access Control ở tầng Object.
  - Còn gọi với tên khác là **Object Storage**.
- Cung cấp REST API để truy cập và modify objects, GCP cung cấp CLI (gsutil) & Client Libraries (C++, C#, Java, Node.js, PHP, Python & Ruby) để làm việc này.
- Lưu trữ nhiều loại tệp dữ liệu - text, binary, backup và archives.
  - Media files and archives, Application packages and logs
  - Backups of your databases or storage devices
  - Staging data during on-premise to cloud database migration

### **Cloud Storage - Objects and Buckets**

- Trong Cloud Storage các **Object** sẽ được lưu trữ trong một thứ gọi là **Buckets**.
  - Bucket là **globally unique** của GCP vậy nên tên Bucket sẽ không được trùng nhau.
  - Bucket names sẽ được sử dụng để cấu tạo nên **Object URLs** vậy nên tên sẽ chỉ bao gồm các lower case letters, numbers, hyphens, underscores và periods. Tối đa 3-63 ký tự.
  - Một Bucket thì có thể lưu trữ không giới hạn các Objects và mỗi một Bucket sẽ được gắn với một Project cụ thể.
- Tên của một Object không được trùng nhau trong Buckets và kích thước tối đa của một Object lên tới **5TB**.

### **Cloud Storage - Storage Classes**

- Thực tế sẽ có nhiều loại dữ liệu sẽ được lưu trữ lên Google Cloud Storage, ví dụ như:
  - Media files and archives
  - Application packages and logs
  - Backups of your databases or storage devices
  - Long term archives
- Mỗi một loại dữ liệu sẽ có những nhu cầu sử dụng khác nhau, vậy có cách nào giảm thiểu chi phí sử dụng với chi phí thấp đối với các Object rất ít khi truy cập?

  **Storage Classes** chính là câu trả lời, nó sẽ giúp chúng ta tối ưu chi phí dựa trên tải truy cập vào Object.

- Google Cloud Storage có thể đảm bảo độ bền của dịch vụ đạt tới **99.999999999%(11 9’s)**
- Bảng so sánh các loại Storage Classes trong GCP

  | Storage Class    | Name     | Minimum Storage duration | Typical Monthly availability                                | Use case                                   |
  | ---------------- | -------- | ------------------------ | ----------------------------------------------------------- | ------------------------------------------ |
  | Standard         | STANDARD | None                     | > 99.99% in multi region and dual region, 99.99% in regions | Frequently used data/Short period of time  |
  | Nearline storage | NEARLINE | 30 days                  | 99.95% in multi region and dual region, 99.9% in regions    | Read or modify **once a month** on average |
  | Coldline storage | COLDLINE | 90 days                  | 99.95% in multi region and dual region, 99.9% in regions    | Read or modify **at most once a quarter**  |
  | Archive storage  | ARCHIVE  | 365 days                 | 99.95% in multi region and dual region, 99.9% in regions    | **Less than once a year**                  |

### **Cloud Storage - Uploading and Downloading Objects**

Dưới đây là bảng so sánh các kịch bản Upload/Download Object trên Google Cloud Storage

| Option                     | Recommended for Scenarios                                                                                                      |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Simple Upload              | Small files (that can be re uploaded in case of failures) + NO object metadata                                                 |
| Multipart upload           | Small files (that can be re uploaded in case of failures) + object metadata                                                    |
| Resumable upload           | Larger files. RECOMMENDED for most usecases(even for small files - costs one additional HTTP request)                          |
| Streaming transfers        | Upload an object of unknown size                                                                                               |
| Parallel composite uploads | File divided up to 32 chunks and uploaded in parallel.Significantly faster if network and disk speed are not limiting factors. |
| Simple download            | Downloading objects to a destination                                                                                           |
| Streaming download         | Downloading data to a process                                                                                                  |
| Sliced object download     | Slice and download large objects                                                                                               |

### **Object Versioning**

- Mặc định thì Google Cloud Storage sẽ không cho phép ghi đè các Object, thay vào đó chúng ta có thể Upload lên nhiều version khác nhau của một Object
  - Có thể bật/tắt tính năng này ở mọi Bucket level, bất cứ lúc nào.
  - **Live version** là version mới nhất.
    - Nếu chúng ta xoá đi **Live version** thì nó sẽ trở thành noncurrent object version.
    - Và nếu xoá đi noncurrent object version thì object đó sẽ bị xoá hẳn.
  - Các version cũ hơn sẽ được phân biệt bởi object key + a generation number
  - Giảm thiểu chi phí sử dụng bằng cách xoá đi các Object bị cũ (noncurrent) versions!

### **Object Lifecycle Management**

- Vấn đề hay gặp là vòng đời của một tệp dữ liệu khi được Upload lên sẽ chỉ thường xuyên truy cập ở một thời điểm nhất định, sau đó sẽ dần ít truy cập hơn.
  - Chúng ta có thể tiết kiệm chi phí sử dụng hơn bằng cách di chuyển các Object có tần suất truy cập ít vào những Storage Classes hợp lý hơn, fit hơn với Storage Classes đó.
  - Bởi vậy GCP đã cung cấp một tính năng gọi là `Object Lifecycle Management`, tính năng này sẽ **tự động di chuyển các Object của Cloud Storage tới các Storage Classes**.
- Điều kiện để di chuyển các Object sang các Storage Classes khác dựa trên:
  - Age, CreatedBefore, IsLive, MatchesStorageClass, NumberOfNewerVersions,…
  - Có thể set multiple conditions: tất cả các điều kiện phải cùng được thoả mãn trước khi di chuyển Object đó sang Storage Classes khác.
- Có 02 loại action là:
  - **SetStorageClass** actions - thay đổi loại của Storage Class của một Object sang một loại khác.
  - **Deletion** actions - xoá luôn Object đó đi.
- Các loại chuyển đổi được cho phép trong GCP:
  - (Standard hoặc Multi-Regional hoặc Regional) sang (Nearline hoặc Coldline hoặc Archive)
  - Nearline sang (Coldline hoặc Archive)
  - Coldline sang Archive
- Example rule:

  ```yaml
  {
    "lifecycle":
      {
        "rule":
          [
            {
              "action": { "type": "Delete" },
              "condition": { "age": 30, "isLive": true },
            },
            {
              "action":
                { "type": "SetStorageClass", "storageClass": "NEARLINE" },
              "condition": { "age": 365, "matchesStorageClass": ["STANDARD"] },
            },
          ],
      },
  }
  ```

### **Cloud Storage - Encryption**

- Mặc định thì GCP luôn luôn mã hoá mọi dữ liệu ở server side.
- Cấu hình **Server-side** encryption (sẽ được thực hiện bởi Google Cloud Storage):
  - **Google-managed encryption key** - là mặc định, không có cấu hình bắt buộc nào.
  - **Customer-managed** encryption keys - được tạo ra bởi **Cloud Key Management Service (KMS)**, đây là công cụ được quản lý bởi người dùng trong KMS.
    - Cloud Storage Service Account phải có quyền truy cập vào keys trong KMS để có thể mã hoá và giải mã sử dụng **Customer-Managed** encryption key
- (OPTIONAL) **Client-side** encryption - mã hoá được thực hiện bởi người dùng trước khi Upload lên Google Cloud Storage.
  - GCP sẽ không biết gì về keys đã được sử dụng để mã hoá.

### **Cloud Storage - Scenarios**

| Scenario                                                                                                       | Description                                                                                                                |
| -------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| How do you speed up large uploads (example: 100 GB) to Cloud Storage?                                          | Use Parallel composite uploads (File is broken in to small chunks and uploaded)                                            |
| You want to permanently store application logs for regulatory reasons. You don’t expect to access them at all. | Cloud storage - Archive                                                                                                    |
| Log files stored in Cloud storage. You expect to access them once in quarter.                                  | Cold Line                                                                                                                  |
| How do you change storage class of an existing bucket in Cloud Storage?                                        | **Step 1**: Change Default Storage Class of the bucket. **Step 2**: Update the Storage Class of the objects in the bucket. |

## Hướng dẫn sử dụng

### **Cloud Storage - Command Line - gsutil - 1**

- (**REMEMBER**) **gsutil** is the CLI for Cloud Storage (**NOT gcloud**)
- Cloud Storage (**gsutil**)
  - `gsutil mb gs://BKT_NAME` (Create Cloud Storage bucket)
  - `gsutil ls -a gs://BKT_NAME` (List current and non-current object versions)
  - `gsutil cp gs://SRC_BKT/SRC_OBJ gs://DESTN_BKT/NAME_COPY` (Copy objects)
    - o ‘**GSUtil:encryption_key=ENCRYPTION_KEY**’ - Encrypt Object
  - `gsutil mv` (Rename/Move objects)
    - `gsutil mv gs://BKT_NAME/OLD_OBJ_NAME gs://BKT_NAME/NEW_OBJ_NAME`
    - `gsutil mv gs://OLD_BUCKET_NAME/OLD_OBJECT_NAME gs://NEW_BKT_NAME/NEW_OBJ_NAME`
  - `gsutil rewrite -s STORAGE_CLASS gs://BKT_NAME/OBJ_PATH` (Ex: Change Storage Class for objects)
  - \*gsutil **cp\*** : Upload and Download Objects
    - `gsutil cp LOCAL_LOCATION gs://DESTINATION_BKT_NAME/` (Upload)
    - `gsutil cp gs://BKT_NAME/OBJ_PATH LOCAL_LOCATION` (Download)

### **Cloud Storage - Command Line - gsutil - 2**

- Cloud Storage (gsutil)
  - `gsutil versioning set on/off gs://BKT_NAME` (Enable/Disable tính năng Versioning)
  - `gsutil uniformbucketlevelaccess set on/off gs://BKT_NAME`
  - \*gsutil **acl ch\*** (Cấu hình Access Permissions cho Objects cụ thể)
    - `gsutil acl ch -u AllUsers:R gs://BKT_NAME/OBJ_PATH` (Make specific object public)
    - `gsutil acl ch -u john.doe@example.com:WRITE gs://BKT_NAME/OBJ_PATH`
      - Permissions - READ (R), WRITE (W), OWNER (O)
      - Scope - User, allAuthenticatedUsers, allUsers(-u), Group (-g), Project (-p) etc
    - `gsutil acl set JSON_FILE gs://BKT_NAME` - sử dụng tệp phân quyền định dạng JSON để cấu hình cho Bucket
  - `gsutil iam ch MBR_TYPE:MBR_NAME:IAM_ROLE gs://BKT_NAME` (Cấu hình IAM role)
    - `gsutil iam ch user:me@myemail.com:objectCreator gs://BKT_NAME`
    - `gsutil iam ch allUsers:objectViewer gs://BKT_NAME` - cấu hình toàn bộ Object trong Bucket có quyền đọc.
  - `gsutil signurl -d 10m YOUR_KEY gs://BUCKET_NAME/OBJECT_PATH` - tạo ra một URL cho phép tạm thời truy cập vào Object.
