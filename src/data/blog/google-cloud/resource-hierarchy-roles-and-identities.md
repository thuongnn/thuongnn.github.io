---
author: thuongnn
pubDatetime: 2022-09-12T02:11:35Z
modDatetime: 2022-09-12T02:11:35Z
title: "[Google Cloud] Resource Hierarchy, Roles and Identities"
folder: "gcp"
draft: true
tags:
  - Google Cloud
description: Cách tổ chức tài nguyên trong Google Cloud, vai trò và phân quyền.
ogImage: https://github.com/user-attachments/assets/47b3131b-4397-42e8-b5ed-59274a05df5c
---

## Table of contents

# Cách tổ chức tài nguyên trong Google Cloud

![Untitled](https://github.com/user-attachments/assets/47b3131b-4397-42e8-b5ed-59274a05df5c)

- Hệ thống tổ chức các tài nguyên được xác định rõ ràng như sau
  - Organization > Folder > Project > Resources
- Có tổng cộng 4 levels trong việc tổ chức và quản lý các resources trong Google Cloud:
  - `Level 1 - Resources` → Là toàn bộ các tài nguyên trong Google Cloud ví dụ như Virtual Machines, Cloud Storage Buckets, Tables trong BigQuery,…
  - `Level 2 - Projects` → Tương đương với một dự án, có thể tạo nhiều dự án khác nhau.
  - `Level 3 - Folder` → Có thể tạo folder và sub-folder để quản lý các project, thực tế có thể sử dụng để chia các phòng ban trong công ty.
  - `Level 4 - Oragnization node` → Là level cao nhất, tương đương với một tổ chức (hoặc công ty) bao gồm toàn bộ các projects và resources.

## **`Organization`**

- **G-Suite domain** hoặc **Cloud Identity** có thể được map với Organization.
- Một Cloud Identity chỉ định cho ít nhất một Organization và sẽ có `Super admins`, `Super admins` có trách nhiệm gán IAM role (Organization administrator) tới các Users.
- Các User đã được gán Organization administrator role thì có những quyền sau đây:
  - Xác định cấu trúc của resource hierarchy (hệ thống phân cấp tài nguyên)
  - Xác định IAM policies dựa trên resource hierarchy đã tạo ở trên.
  - Uỷ quyền các management roles tới các Users khác.
- GCP tự động gán **Project Creator** và **Billing Account Creator** IAM roles tới toàn bộ Users trong domain (thuộc Google Workspace Customer), điều này cho phép bất kỳ User nào cũng có thể tạo dự án và enable billing cho các chi phí tài nguyên đã khởi tạo.

## **`Folder`**

![Untitled](https://github.com/user-attachments/assets/851603e4-cee5-49cd-8c81-a5c9ea9a5807)

- Folder được dùng để phân cấp tổ chức nhiều lớp, bởi vì một Folder có thể chứa các Folder hoặc Project khác. Vậy nên thực tế Folder được sử dụng để phân cấp các ban bộ phận trong một tổ chức, công ty.
- Chúng ta có thể gán các Policies tới một Folder, các resources trong Folder lúc này sẽ kế thừa toàn bộ các Policies và Permissions đã được gán vào Folder đó.

## **`Project`**

- Mỗi một resource sẽ chỉ được gắn với một project và một project thì có thể có nhiều Owners và Users.
- Mỗi project được thiết lập hoá đơn thanh toán và được quản lý một cách riêng biệt.

# **Resource Hierarchy - Recommendations for Enterprises**

- Tạo các dự án riêng biệt cho các môi trường khác nhau, tách biệt hoàn toàn giữa môi trường Test và Production.
- Tạo các thư mục (Folder) riêng biệt cho mỗi bộ phận khác nhau:
  - Cô lập môi trường Production của các bộ phận với nhau, tránh rủi ro về bảo mật thông tin.
  - Chúng ta có thể tạo một shared folder để chia sẻ tài nguyên với nhau.
- **One project per application per environment**:
  - Ví dụ có 02 ứng dụng: "Order" và "Product"
  - Giả sử cần có 02 môi trường là "DEV" và "PROD"
  - Dựa vào nguyên tắc ở trên thì chúng ta cần tạo 04 projects: Order-DEV, Order-PROD, Product-DEV, Product-PROD
    - Cô lập các môi trường triển khai với nhau
    - Thay đổi ở môi trường DEV sẽ không ảnh hưởng gì tới PROD
    - Có thể trao quyền cho các developers (create, delete, deploy) tới DEV Projects.
    - Trao quyền truy cập vào môi trường PROD cho duy nhất đội vận hành.

# **Billing Accounts**

- **Billing Account** là bắt buộc nếu như muốn khởi tạo tài nguyên trong một dự án:
  - Billing Account chứa các thông tin chi tiết để thanh toán.
  - Bất kỳ Project nào có các tài nguyên đang được sử dụng đều phải liên kết với một Billing Account.
- **Một Billing Account có thể liên kết với một hoặc nhiều Projects và có thể có nhiều Billing Account trong một Organization**.
- Có 02 loại Billing Accounts:
  - **Self Serve** → Thanh toán trực tiếp vào Credit Card hoặc Bank Account
  - **Invoiced** → Tạo các hoá đơn thanh toán (sử dụng cho doanh nghiệp quy mô lớn)
- **`RECOMMENDATION`** Tuỳ theo quy mô sử dụng GCP, có thể tổ chức cách thanh toán khác nhau:
  - Quy mô nhỏ (Startup) thì có thể chỉ cần một Billing Account.
  - Quy mô doanh nghiệp lớn thì có thể có nhiều Billing Account riêng cho từng bộ phận khác nhau.
- **Managing Billing - Budget, Alerts and Exports**
  - Cấu hình **Cloud Billing Budget** để tránh những chi phí bất ngờ không nằm trong kiểm soát:
    - RECOMMENDED) Configure **Alerts**
    - Mặc định alert thresholds để ở mức `50%`, `90%` và `100%`
      - Bắn alert tới Pub Sub (Optional)
      - Billing admins và Billing Account users được cảnh báo bằng cách gửi về e-mail.
  - Dữ liệu thanh toán có thể exported (theo một lịch cụ thể) tới:
    - **Big Query** (nếu như tổ chức cần truy vấn thông tin hoặc visualize dữ liệu thanh toán)
    - **Cloud Storage** (cho mục đích lưu trữ lịch sử thanh toán)

# **Resource Hierarchy & IAM Policy**

![Untitled](https://github.com/user-attachments/assets/46b7877a-8ae3-4436-bd88-42aaf8d34a44)

- Các IAM Policy có thể được gán cho bất kỳ level nào trong hệ thống phân cấp của Google Cloud.
- Resources sẽ kế thừa toàn bộ các Policies của level cha của nó, chú ý sự kế thừa Policies có tính chất bắc cầu (nghĩa là nếu như Policy gán cho một Folder thì toàn bộ bao gồm Projects và Resources trong Folder đó sẽ ăn theo Policy đã gán).
- **`RECOMMENDATION`** là kết hợp gán các Policies lên các Resources và Level cao hơn của Resources đó (maybe Project, Folder).
- Chúng ta không thể gán đè đi Policy mà đã được gán bởi Level cao hơn hiện tại, ví dụ như đang quản trị Policies của một Project thì không thể thay đổi một Policy nào đó đã được gán cho cả Folder (chứa Project mình đang quản trị).

# **Organization, Billing and Project Roles**

- **Organization Administrator**
  - Xác định cấu trúc của resource hierarchy (hệ thống phân cấp tài nguyên)
  - Xác định các Access Management Policies.
  - Quản lý các User và Role khác.
- **Billing Account Creator**
  - Có quyền tạo các Billing Accounts
- **Billing Account Administrator**
  - Quản lý các Billing Accounts
    - payment instruments (các phương thức thanh toán)
    - billing exports (xuất hoá đơn thanh toán)
    - link and unlink projects (gán hoặc loại bỏ Billing Account cho các project)
    - manage roles on billing account (quản lý các roles của Billing Account)
  - Tuy nhiên **KHÔNG THỂ** tạo Billing Account.
- **Billing Account User**
  - Liên kết các Projects với Billing Accounts.
  - Thường được sử dụng kết hợp với **Project Creator**, 02 roles này cho phép người dùng có thể tạo mới một Project với link project đó tới Billing Account.
- **Billing Account Viewer**
  - Chỉ có quyền xem thông tin chi tiết Billing Account.

## **Billing Roles - Quick Review**

| Roles                         | Description                                                        | Use Case       |
| ----------------------------- | ------------------------------------------------------------------ | -------------- |
| Billing Account Creator       | Permissions to create new billing accounts                         | Finance Team   |
| Billing Account Administrator | Manages billing account but can't create them                      | Finance Team   |
| Billing Account User          | Assigns projects to billing accounts                               | Project Owner  |
| Billing Account Viewer        | View only access to billing account                                | Auditor        |
| Billing Account Costs Manager | Manage budgets, view & export cost information of billing accounts | budget Team    |
| Project Billing Manager       | Link/UnLink the project to/from billing account                    | Project Owners |
