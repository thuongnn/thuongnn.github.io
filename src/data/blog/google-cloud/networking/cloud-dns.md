---
author: thuongnn
pubDatetime: 2022-10-06T12:31:52Z
modDatetime: 2022-10-06T12:31:52Z
title: "[Google Cloud] Tìm hiểu về Cloud DNS"
folder: "gcp"
draft: false
tags:
  - Google Cloud
description: Tìm hiểu về dịch vụ Cloud DNS trong Google Cloud.
ogImage: https://github.com/user-attachments/assets/134248b5-7f78-4f1d-9cfd-7e2b4df74bc2
---

## Table of contents

# Google Cloud DNS

![](https://github.com/user-attachments/assets/134248b5-7f78-4f1d-9cfd-7e2b4df74bc2)

- Cloud DNS is a high-performance, resilient, reliable, low-latency, global Domain Name System (DNS) service that publishes the domain names to the global DNS in a cost-effective way.
- Cloud DNS helps to publish the zones and records in DNS without the burden of managing your own DNS servers and software.
- Cloud DNS offers both public zones and private managed DNS zones.
  - A public zone is visible to the public internet
  - A private zone is visible only from one or more specified VPC networks
  - Google Cloud also creates internal DNS names for VMs automatically, even if you do not use Cloud DNS
- With Shared VPC, Cloud DNS managed private zone, Cloud DNS peering zone, or Cloud DNS forwarding zone must be created in the host project
- Google Cloud offers inbound and outbound DNS forwarding for private zones
- Cloud DNS offers DNS forwarding zones and DNS server policies to allow lookups of DNS names between the on-premises and Google Cloud environment

# DNS Server Policies

- DNS Server Policies can specify inbound DNS forwarding, outbound DNS forwarding, or both.
- Inbound server policy refers to a policy that permits inbound DNS forwarding i.e. On-premises to VPC
- Outbound server policy refers to one possible method for implementing outbound DNS forwarding. i.e. VPC to On-premises
- It is possible for a policy to be both an inbound server policy and an outbound server policy if it implements the features of both.
- DNS Server Policies is similar to DNS Forwarding zones, except that it applies to all the traffic and not a single specific domain
- DNS Outbound Policy disables internal DNS for the selected networks

# DNS Forwarding Zones

- Cloud DNS forwarding zones help configure target name servers for specific private zones.
- Using a forwarding zone is one way to implement outbound DNS forwarding from the VPC network.
- A Cloud DNS forwarding zone is a special type of Cloud DNS private zone. Instead of creating records within the zone, you specify a set of forwarding targets.
- Each forwarding target is an IP address of a DNS server, located in the VPC network, or in an on-premises network connected to the VPC network by Cloud VPN or Cloud Interconnect.
- Cloud DNS caches responses for queries sent to Cloud DNS forwarding zones
- DNS forwarding does not work between two Google Cloud environments

# DNS Peering

![](https://github.com/user-attachments/assets/168bf88b-1165-40ff-b9f8-1a03ab1822b1)

- DNS peering allows sending requests for records that come from one zone's namespace to another VPC network _for e.g., a SaaS provider can give a SaaS customer access to DNS records it manages._
- To provide DNS peering
  - Cloud DNS peering zone must be created and configured to perform DNS lookups in a VPC network where the records for that zone's namespace are available.
  - The VPC network where the DNS peering zone performs lookups is called the DNS producer network.
- To use DNS peering
  - A network must be authorized to use a peering zone.
  - The VPC network authorized to use the peering zone is called the DNS consumer network.
- DNS peering and VPC Network Peering are different services. DNS peering can be used with VPC Network Peering, but VPC Network Peering is **NOT** required for DNS peering. VPC peering does not enable DNS peering and must be setup explicitly.

# VPC Name Resolution Order

- Each VPC network provides DNS name resolution services to the VM instances that use it.
- When VMs use their metadata server 169.254.169.254 as their name server, Google Cloud searches for DNS records in the following order:
  - If the VPC network has an outbound **server policy**, Google Cloud forwards all DNS queries to those alternative servers. The VPC name resolution order consists only of this step.
  - If the VPC network does not have an outbound server policy:
    - Google Cloud tries to find a **private** zone that matches as much of the requested record as possible (longest suffix matching).
      - Searching records that you created in private zones.
      - Querying the forwarding targets for forwarding zones.
      - Querying the name resolution order of another VPC network by using peering zones.
    - Searches the automatically created Compute Engine **internal** DNS records for the project.
    - Queries **publicly** available zones

# DNSSEC

- DNSSEC is a feature of DNS that authenticates responses to domain name lookups
- DNSSEC protects the domains from spoofing and cache poisoning attacks
- DNSSEC provides strong authentication for domain lookups, but it does not provide encryption
- Both the registrar and registry must support DNSSEC for the Top Level Domain (TLD) used
- For Enabling DNSSEC
  - Enable DNSSEC on the domain. DNS zone for the domain must serve special DNSSEC records for public keys (DNSKEY), signatures (RRSIG), and non-existence (NSEC, or NSEC3 and NSEC3PARAM) to authenticate the zone's contents.
  - DS record must be added to the TLD at the registrar
  - DNS resolver that validates signatures for DNSSEC-signed domains must be used
