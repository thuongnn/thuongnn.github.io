---
author: thuongnn
pubDatetime: 2022-09-12T02:32:35Z
title: "[Google Cloud] Identity and Access Management (IAM)"
featured: false
draft: false
tags:
  - Google Cloud
description: Cách quản lý danh tính và truy cập trong Google Cloud.
---

## Table of contents

# Giới thiệu

- **Authentication** - xác thực người dùng
- **Authorization** - người dùng này có đủ quyền để truy cập tài nguyên hay không?
- **Identities** có thể là:
  - A GCP User (Người dùng với tài khoản trên Google hoặc là người dùng đã được xác thực bên ngoài)
  - A Group of GCP Users (Một nhóm các GCP User)
  - An Application running in GCP (Ứng dụng được chạy trên hạ tầng GCP)
  - An Application running in your data center (Ứng dụng được chạy trên hạ tầng On-Premise)
  - Người dùng chưa được xác thực
- Cung cấp khả năng kiểm soát tài nguyên GCP một cách chi tiết ví dụ như:
  - Limit một người dùng có thể:
    - Thực hiện một hành động nào đó
    - Trên một tài nguyên Cloud cụ thể
    - Từ một địa chỉ IP được xác định cụ thể
    - Trong một khoảng thời gian cụ thể
- Ví dụ muốn cung cấp khả năng truy cập cho ông Minh (Developer trong công ty) tới một dịch vụ Cloud Storage bucket cụ thể:
  - Mindset thông thường trong đầu chúng ta như sau:
    - **Member**: Ông Minh (Developer)
    - **Resource**: Dịch vụ Cloud Storage bucket cụ thể
    - **Action**: Upload/Delete Objects
  - Định nghĩa trong Google Cloud IAM
    - **Roles:** Là một tập hợp các permissions (để thực hiện các hành động cụ thể trên các tài nguyên cụ thể)
    - **Policy:** Thực thể này sẽ thực hiện gán (assign/bind) Role vào một Member.

# **`IAM - Roles`**

- Là một tập hợp các permissions, hay được hiểu Roles chính là Permission nhưng nó là một nhóm hành động trên một số nhóm tài nguyên cụ thể.
- Có 03 loại IAM Roles sau:
  - **`Basic Roles` (or Primitive roles)** - Owner/Editor/Viewer
    - **Viewer (roles.viewer)** - Read-only actions
    - **Editor (roles.editor)** - Viewer + Edit actions
    - **Owner (roles.owner)** - Editor + Manage Roles and Permissions + Billing
    - EARLIEST VERSION: Created before IAM
    - NOT RECOMMENDED: **Don’t use in production**
  - **`Predefined Roles`** - Các Roles được xác định chi tiết từ trước và được quản lý bởi Google
    - Các Roles khác nhau cho những mục đích khác nhau
    - **Ví dụ**: Storage Admin, Storage Object Admin, Storage Object Viewer, Storage Object Creator
  - **`Custom Roles`** - Khi mà các **Predefined Roles** không đủ để đáp ứng nhu cầu cho doanh nghiệp thì chúng ta có thể tự tạo riêng các Roles phù hợp với nhu cầu.

## **IAM - Predefined Roles - Example Permissions**

- Các Roles quan trọng của **Cloud Storage**:
  - **Storage Admin (roles/storage.admin)**
    - storage.buckets.\*
    - storage.objects.\*
  - **Storage Object Admin (roles/storage.objectAdmin)**
    - storage.objects.\*
  - **Storage Object Creator (roles/storage.objectCreator)**
    - storage.objects.create
  - **Storage Object Viewer (roles/storage.objectViewer)**
    - storage.objects.get
    - storage.objects.list
- Cả 04 Roles ở trên đều chứa permissions:
  - resourcemanager.projects.get
  - resourcemanager.projects.list

## **IAM - Most Important Concepts - A Review**

![Untitled](https://github.com/user-attachments/assets/39ef248c-8f6d-4a4e-8461-f885fc5317aa)

- **Member** : Who?
- **Roles** : Permissions (What Actions? What Resources?)
- **Policy** : Assign Permissions to Members
  - Map Roles (What?) , Members (Who?) and Conditions (Which Resources?, When?, From Where?)
  - Remember: Permissions are NOT directly assigned to Member
    - Permissions are represented by a Role
    - Member gets permissions through Role!
- A Role can have multiple permissions
- You can assign multiple roles to a Member

# **`IAM policy`**

- Các Roles sẽ được gán tới các Users thông qua các **IAM Policy** documents.
- Một **Policy object** bao gồm tập hợp các bindings, một binding thì được hiểu là gán một Role tới danh sách các **Members**.
- Các **Members** ở đây có thể là
  - Google account
  - Google group
  - Service account
  - Cloud Identity domain
- Ví dụ một Policy sẽ như sau

  ```json
  {
    "bindings": [
      {
        "role": "roles/storage.objectAdmin",
        "members": [
          "user:you@in28minutes.com",
          "serviceAccount:myAppName@appspot.gserviceaccount.com",
          "group:administrators@in28minutes.com",
          "domain:google.com"
        ]
      },
      {
        "role": "roles/storage.objectViewer",
        "members": ["user:you@in28minutes.com"],
        "condition": {
          "title": "Limited time access",
          "description": "Only upto Feb 2022",
          "expression": "request.time < timestamp('2022-02-01T00:00:00.000Z')"
        }
      }
    ]
  }
  ```

- Một số command thông dụng với `gcloud`

  ```bash
  gcloud compute project-info describe #Describe current project
  gcloud auth login #Access the Cloud Platform with Google user credentials
  gcloud auth revoke #Revoke access credentials for an account
  gcloud auth list #List active accounts

  # gcloud projects
  gcloud projects add-iam-policy-binding #Add IAM policy binding
  gcloud projects get-iam-policy #Get IAM policy for a project
  gcloud projects remove-iam-policy-binding #Remove IAM policy binding
  gcloud projects set-iam-policy #Set the IAM policy
  gcloud projects delete #Delete a project

  #gcloud iam
  gcloud iam roles describe #Describe an IAM role
  gcloud iam roles create #create an iam role(–project, –permissions, –stage)
  gcloud iam roles copy #Copy IAM Roles
  ```

## **Service Accounts**

- **Kịch bản sử dụng**: Một ứng dụng trong một VM Instance cần quyền truy cập vào Cloud Storage, chúng ta không muốn sử dụng _personal credentials_ để allow access cho ứng dụng.
- **`RECOMMENDATION`** Sử dụng **Service Accounts**
  - Được xác định bởi một địa chỉ e-mail (Ví dụ: id-compute@developer.gserviceaccount.com)
  - Không sử dụng Password
    - Thay vì đó sẽ sử dụng một cặp **private/public RSA key**
    - Không thể sử dụng để đăng nhập thông qua browsers hoặc cookies
- Các loại **Service Accounts**
  - **Default service account** - Tự động khởi tạo khi có một vài Services được sử dụng - (NOT RECOMMENDED)
  - **User Managed** - Người dùng tự tạo - (RECOMMENDED)
  - **Google-managed service** accounts - Được tạo và quản lý bởi Google - Được sử dụng bởi GCP để thực hiện một số hành động đặc biệt, thông thường chúng ta không cần care tới loại này.
- Một số kịch bản sử dụng của Service Accounts

  | Scenario                                                                                                | Solution                                                                                                                                                           |
  | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
  | Application on a VM wants to talk to a Cloud Storage bucket                                             | Configure the VM to use a Service Account with right permissions                                                                                                   |
  | Application on a VM wants to put a message on a Pub Sub Topic                                           | Configure the VM to use a Service Account with right permissions                                                                                                   |
  | Is Service Account an identity or a resource?                                                           | It is both. You can attach roles with Service Account (identity). You can let other members access a SA by granting them a role on the Service Account (resource). |
  | VM instance with default service account in Project A needs to access Cloud Storage bucket in Project B | In project B, add the service account from Project A and assign Storage Object Viewer Permission on the bucket                                                     |

## **ACL (Access Control Lists)**

- **ACL**: Define **who** has access to your buckets and objects, as well as **what level** of access they have
- **How is this different from IAM?**
  - IAM permissions apply to all objects within a bucket
  - ACLs can be used to customized specific accesses to different objects
- User gets access if he is allowed by either IAM or ACL!
- (Remember) **Use IAM for common permissions** to all objects in a bucket
- (Remember) **Use ACLs** if you need to **customize access to individual objects**

# **`Identity-Aware Proxy (IAP)`**

## Giới thiệu

![Untitled](https://github.com/user-attachments/assets/deeb57b8-f009-4556-84fc-f63f11120480)

- IAP là một dịch vụ chặn các yêu cầu đến một trang web, xác thực người dùng tạo ra yêu cầu (request) và chỉ cho phép các yêu cầu của người dùng được phép truy cập có thể tiếp cận vào hệ thống.
- IAP có thể được sử dụng để bảo vệ các trang web chạy trên nhiều nền tảng, bao gồm App Engine, Compute Engine và các dịch vụ khác ẩn sau Google Cloud Load Balancer.
- Tuy nhiên, nó không bị giới hạn dành riêng cho các dịch vụ của Google Cloud, chúng ta cũng có thể sử dụng nó với [IAP Connector](https://cloud.google.com/iap/docs/enabling-on-prem-howto) để bảo vệ các ứng dụng bên dưới (on-premises applications).

## Tính năng

- Quyền truy cập được cấp phép bằng cách cung cấp vai trò **Người dùng web được IAP bảo mật** cho một hoặc nhiều địa chỉ email riêng lẻ, toàn bộ miền email hoặc một nhóm các địa chỉ email.
- Chức năng **tạo máy chủ** chỉ dành riêng cho nhân viên hoặc “mạng nội bộ”, họ có thể chỉ định những người dùng được xác thực bằng địa chỉ email của công ty mới được phép truy cập. Các máy chủ này có thể liên kiến với:
  - Địa chỉ Gmail
  - Google Workspace
  - Địa chỉ trong Active Directory của công ty
  - Thư mục LDAP thông qua Google Cloud Directory Sync
- Đối với **quyền truy cập công khai nhưng cần xác thực**, bất kỳ ai sẵn sàng và được xác thực sẽ được cung cấp quyền truy cập vào trang web. Ngoài ra, nó có thể thêm header vào mỗi request với thông tin nhận dạng người dùng vì vậy trang web nhận (receiving site) có thể sử dụng thông tin đó mà không cần tự mình xác thực.
- Chức năng **giới hạn quyền truy cập** cho bất kỳ nhóm nào hoặc kết hợp các nhóm, bằng cách chỉ định một địa chỉ email nhóm thay vì các địa chỉ riêng lẻ.
- Các công ty, tổ chức có thể **đặt ra chính sách dành cho các thiết bị** mà các thành viên của nhóm phải tuân theo để có được quyền truy cập. Các chính sách đó có thể bao gồm:
  - Yêu cầu về phiên bản hệ điều hành cụ thể
  - Sử dụng hồ sơ công ty trên trình duyệt hoặc thiết bị di động
  - Có thể là chỉ sử dụng thiết bị thuộc sở hữu của công ty.
