---
author: thuongnn
pubDatetime: 2022-10-12T22:11:22Z
modDatetime: 2022-10-12T22:11:22Z
title: "[Google Cloud] Hybrid Network & Multi-Cloud"
folder: "gcp"
draft: true
tags:
  - Google Cloud
description: Tìm hiểu về Hybrid Network & Multi-Cloud trong Google Cloud.
ogImage: https://github.com/user-attachments/assets/b3e500f1-1bd4-460f-aacf-7e1d8c3c0825
---

## Table of contents

# **`1. Mô hình Mirrored`**

![1](https://github.com/user-attachments/assets/b3e500f1-1bd4-460f-aacf-7e1d8c3c0825)

- Continuous integration/continuous deployment (CI/CD) and administrative systems can deploy and manage workloads across computing environments.
- Monitoring and other administrative tooling works across computing environments.
- Workloads cannot communicate across computing environments.

## Các biến thể của mô hình Mirroed

### Mô hình thông thường

![2](https://github.com/user-attachments/assets/49555e62-2691-45a6-bae8-b6764e6b17c4)

### Mô hình với Kubernetes

Kiến trúc đối với K8S (Không cần phải peer 2 VPC với nhau vì môi trường CI/CD có thể connect tới cụm thông qua đường public)

![3](https://github.com/user-attachments/assets/5748ba4c-8f50-4609-9dfe-a269c225263d)

### Best practices

- Ensure that any CI/CD systems required for deploying or reconfiguring production deployments are deployed in a highly available fashion. Additionally, consider using redundant virtual private network (VPN) or interconnect links to increase availability.
- Configure VM instances in the development and testing VPC to have public IP addresses so that those instances can access the internet directly. Otherwise, deploy [Cloud NAT](https://cloud.google.com/nat/docs) in the same VPC to handle egress traffic.
- To use public networks, use [Private Google Access](https://cloud.google.com/vpc/docs/configure-private-google-access) to avoid communication between VPC workloads and Google APIs.
- Also consider the [general best practices](https://cloud.google.com/architecture/hybrid-and-multi-cloud-network-topologies#best-practices-topologies) for hybrid and multi-cloud networking topologies.

# `2. Mô hình Meshed`

![4](https://github.com/user-attachments/assets/cf17fd75-c6ff-4806-942f-ac6bf6abaeda)

- On the Google Cloud side, you deploy workloads into a single shared VPC.
- You connect the VPC to the network in the private computing environment by using either [Cloud Interconnect](https://cloud.google.com/network-connectivity/docs/interconnect) or [Cloud VPN](https://cloud.google.com/network-connectivity/docs/vpn). This setup ensures that communication between environments can be conducted using private IP addresses.
- You use [Cloud Router](https://cloud.google.com/network-connectivity/docs/router) to dynamically exchange routes between environments.
- All environments share a common, overlap-free RFC 1918 IP address space.

## Mô hình thông thường

![5](https://github.com/user-attachments/assets/a9da39d1-c174-49e7-96b2-0eee4bfd4359)

### Best practices

- If you intend to enforce stricter isolation between the cloud and private computing environments, consider using the [gated](https://cloud.google.com/architecture/hybrid-and-multi-cloud-network-topologies#gated-ingress-and-egress) topology instead.
- When using Kubernetes within the private computing environment, use [Open Service Broker](https://www.openservicebrokerapi.org/) to [provision and access Google platform services and resources](https://cloud.google.com/kubernetes-engine/docs/concepts/add-on/service-broker) in a unified way.
- Also consider the [general best practices](https://cloud.google.com/architecture/hybrid-and-multi-cloud-network-topologies#best-practices-topologies) for hybrid and multi-cloud networking topologies.

# `3. Mô hình Gated`

## **Gated egress**

![6](https://github.com/user-attachments/assets/ba82cf73-ead5-4086-be8f-aaba246d5e75)

- **Các thức hoạt động**
  - Workloads that you deploy in Google Cloud can communicate with the API gateway by using private IP addresses. Other systems in the private computing environment cannot be reached from within Google Cloud.
  - Communication from the private computing environment to any workloads deployed in Google Cloud is not allowed.
- **Mô tả chi tiết**
  - On the Google Cloud side, you deploy workloads into a Shared VPC.
  - Using either [Cloud Interconnect](https://cloud.google.com/network-connectivity/docs/interconnect) or [Cloud VPN](https://cloud.google.com/network-connectivity/docs/vpn), you connect the VPC to a perimeter network in the private computing environment, allowing calls to the API gateway.
  - Using firewall rules, you disallow incoming connections to the VPC.
  - Optionally, you use [Cloud Router](https://cloud.google.com/network-connectivity/docs/router/docs) to dynamically exchange routes between environments.
  - All environments share a common, overlap-free RFC 1918 IP address space.
- **Best practices**
  - Consider using [Apigee for Private Cloud](https://docs.apigee.com/private-cloud/versions) as the API gateway solution.
  - Also consider the [general best practices](https://cloud.google.com/architecture/hybrid-and-multi-cloud-network-topologies#best-practices-topologies) for hybrid and multi-cloud networking topologies.

## **Gated ingress**

![7](https://github.com/user-attachments/assets/39834ede-6c5e-46b6-acc5-607a8ea6a6f3)

- **Cách thức hoạt động**
  - Workloads that you deploy in the private computing environment are able to communicate with the API gateway by using private IP addresses. Other systems deployed in Google Cloud cannot be reached.
  - Communication from Google Cloud to the private computing environment is not allowed.
- **Mô tả chi tiết**
  - On the Google Cloud side, you deploy workloads into an application VPC.
  - You establish a [Cloud Interconnect](https://cloud.google.com/network-connectivity/docs/interconnect) or [Cloud VPN](https://cloud.google.com/network-connectivity/docs/vpn) connection between a dedicated transit VPC and the private computing environment.
  - You establish the connection between the transit VPC and the application VPC by using VMs that are running the API gateway. These VMs use two networking interfaces: one connected to the transit VPC, and one to the application VPC. To balance traffic to multiple API gateway instances, you configure an [internal load balancer](https://cloud.google.com/kubernetes-engine/docs/how-to/internal-load-balancing) in the transit VPC.
  - You deploy [Cloud NAT](https://cloud.google.com/nat/docs) in the application VPC to allow workloads to access the internet. This gateway avoids having to equip VM instances with external IP addresses, which you don't want in systems that are deployed behind an API gateway.
  - Optionally, you can use [Cloud Router](https://cloud.google.com/network-connectivity/docs/router) to dynamically exchange routes between environments.
  - All environments share a common, overlap-free RFC 1918 IP address space
- **Best practices**
  - Consider using [Apigee for Private Cloud](https://docs.apigee.com/private-cloud/versions) as API gateway solution.
  - Also consider the [general best practices](https://cloud.google.com/architecture/hybrid-and-multi-cloud-network-topologies#best-practices-topologies) for hybrid and multi-cloud networking topologies.

## **Gated ingress and egress**

![8](https://github.com/user-attachments/assets/f6ae6100-14d0-4cf6-86d2-9b17f646bdf3)

- **Cách thức hoạt động**
  - Workloads that you deploy in Google Cloud can communicate with the API gateway by using private IP addresses. Other systems deployed in the private computing environment cannot be reached.
  - Conversely, workloads that you deploy in the private computing environment can communicate with the Google Cloud-side API gateway by using private IP addresses. Other systems deployed in Google Cloud cannot be reached.
- **Mô tả chi tiết**
  - On the Google Cloud side, you deploy workloads to a Shared VPC and do not expose them to the internet.
  - You establish a [Cloud Interconnect](https://cloud.google.com/network-connectivity/docs/interconnect) or [Cloud VPN](https://cloud.google.com/network-connectivity/docs/vpn) connection between a dedicated transit VPC and the private computing environment.
  - You establish the connection between the transit VPC and the application VPC by using VMs that are running the API gateway. These VMs use two networking interfaces: one connected to the transit VPC, and one to the application VPC. To balance traffic to multiple API gateway instances, you configure an [internal load balancer](https://cloud.google.com/kubernetes-engine/docs/how-to/internal-load-balancing) in the transit VPC.
  - You also use [Cloud NAT](https://cloud.google.com/nat/docs). Cloud NAT allows workloads to access the internet and to communicate with the API gateway that is running in the private computing environment.
  - Optionally, you can use [Cloud Router](https://cloud.google.com/network-connectivity/docs/router) to dynamically exchange routes between environments.
  - All environments share a common, overlap-free RFC 1918 IP address space.
- **Best practices**
  - Consider using [Apigee for Private Cloud](https://docs.apigee.com/private-cloud/versions) as API gateway solution.
  - Also consider the [general best practices](https://cloud.google.com/architecture/hybrid-and-multi-cloud-network-topologies#best-practices-topologies) for hybrid and multi-cloud networking topologies.

# `4. Mô hình Handover`

![9](https://github.com/user-attachments/assets/dd189563-fee6-441a-8d5c-fed417efd620)

- Cách thức hoạt động
  - Workloads that are running in a private computing environment upload data to shared storage locations. Depending on use cases, uploads might happen in bulk or in small messages.
  - Google Cloud-hosted workloads then consume data from these locations and process it in a streaming or batch fashion.
- Mô tả chi tiết
  - On the Google Cloud side, you deploy workloads into an application VPC. These workloads can include data processing, analytics, and analytics-related frontend applications.
  - To securely expose frontend applications to corporate users, you can use [Identity-Aware Proxy](https://cloud.google.com/iap).
  - You use a set of Cloud Storage buckets or Pub/Sub queues to upload data from the private computing environment and to make it available for further processing by workloads deployed in Google Cloud. Using IAM policies, you can restrict access to trusted workloads.
  - Because there is no private network connectivity between environments, RFC 1918 IP address spaces are allowed to overlap between environments.
- Best practices
  - Lock down access to Cloud Storage buckets and Pub/Sub topics.
  - To reduce latency and to avoid passing data over the public internet, consider using [Direct Peering](https://cloud.google.com/network-connectivity/docs/direct-peering/direct-peering) or [Carrier Peering](https://cloud.google.com/network-connectivity/docs/carrier-peering/carrier-peering).
  - Use [VPC Service Controls](https://cloud.google.com/vpc-service-controls) to restrict access to the Cloud Storage or Pub/Sub locations to specific IP address ranges.
  - Equip VM instances in the VPC with public IP addresses so that they can access the internet directly. Otherwise, deploy [Cloud NAT](https://cloud.google.com/nat/docs) in the same VPC to handle egress traffic.
  - Also consider the [general best practices](https://cloud.google.com/architecture/hybrid-and-multi-cloud-network-topologies) for hybrid and multi-cloud networking topologies.
