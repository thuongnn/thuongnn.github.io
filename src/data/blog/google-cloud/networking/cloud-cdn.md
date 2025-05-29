---
author: thuongnn
pubDatetime: 2022-10-06T20:01:22Z
modDatetime: 2022-10-06T20:01:22Z
title: "[Google Cloud] Tìm hiểu về Cloud CDN"
folder: "gcp"
draft: false
tags:
  - Google Cloud
description: Tìm hiểu về dịch vụ Cloud CDN trong Google Cloud.
---

## Table of contents

# Google Cloud CDN

![](https://github.com/user-attachments/assets/9732d303-76f4-4d43-82d4-70f1dfba4485)

- Google Cloud CDN (Content Delivery Network) caches website and application content closer to the user
- Cloud CDN uses Google’s global edge network to serve content closer to users, which accelerates the websites and applications.
- Cloud CDN works with **external HTTP(S) Load Balancing** to deliver content to the users.
- Cloud CDN requires the use of Google Premium Network Tier which provides the Global Anycast IP address
- Cloud CDN content can be sourced from various types of backends (also referred to as origin servers) :
  - Instance groups
  - Zonal network endpoint groups (NEGs)
  - Serverless NEGs: One or more App Engine, Cloud Run, or Cloud Functions services
  - Internet NEGs, for endpoints that are outside of Google Cloud (also known as custom origins)
  - Buckets in Cloud Storage
- Cloud CDN with Google Cloud Armor enforces security policies only for requests for dynamic content, cache misses, or other requests that are destined for the origin server. Cache hits are served even if the downstream Google Cloud Armor security policy would prevent that request from reaching the origin server.

# Cloud CDN Flow

![](https://github.com/user-attachments/assets/5d83d7dc-93e2-45b8-95e9-3b080230e186)

- When a user requests content from an external HTTP(S) load balancer, the request arrives at a Google Front End (GFE), which is at the edge of Google’s network as close as possible to the user.
- GFE uses Cloud CDN if the load balancer’s URL map routes traffic to a backend service or backend bucket that has Cloud CDN configured
- Cloud CDN doesn’t perform any URL redirection. The Cloud CDN cache is located at the GFE.
- Caching happens automatically for all cacheable content, once Cloud CDN is enabled
- Cache Hits and Cache Misses
  - A cache is a group of servers that stores and manages content so that future requests for that content can be served faster.
  - Cached content is a copy of cacheable content that is stored on origin servers.
  - Cache Hit – GFE sends the cached response, if the GFE looks in the Cloud CDN cache and finds a cached response to the user’s request
  - Cache Miss – GFE determines that it can’t fulfill the request from the cache, if the content is requested first time or expired or evicated
- Cache Hit Ratio
  - Cache Hit Ration is the percentage of times that a requested object is served from the cache
- Cache Egress and Cache Fill
  - Cache Egress – Data transfer from a cache to the client
  - Cache Fill – Data transfer to a cache
- Cache Eviction
  - Cloud CDN removes or evicts content to insert new content once the it reaches its capacity
  - Content evicted is usually the one that hasn’t recently been accessed, regardless of the content’s expiration time
- Cache Expiration
  - Content in HTTP(S) caches can have a configurable expiration time or Time To Live (TTL)
- Cache Invalidation
  - Cache Invalidation allows one to force an object or set of objects to be ignored by the cache
  - Invalidations don’t affect cached copies in web browser caches or caches operated by third-party internet service providers.
  - Cache Invalidation are eventual
  - Invalidations are rate-limited and use patterns to control the same _for e.g. use /images/_ instead of each request for /images/1.jpg etc.\*
- Cache Preloading
  - Caching is **reactive** in that an object is stored in a particular cache only if a request goes through that cache and if the response is cacheable.
  - Caches cannot be preloaded except by causing the individual caches to respond to requests.
- An object stored in one cache does not automatically replicate into other caches; cache fill happens only in response to a client-initiated request.

# Cloud CDN Signed URL

- Cloud CDN signed URLs helps serve responses from Google Cloud’s globally distributed caches, even for authorized requests
- Cloud CDN signed URLs help control access to the cached content
- Signed URL is a URL that provides user read access to a private resource for a limited time without needing a Google Account
- Anyone who knows the URL can access the resource until the expiration time for the URL is reached or the key used to sign the URL is rotated.
- Cryptographic keys are created on a backend service or bucket, or both
- Signed URL contains authorization within the request URL with selected elements of the request that are hashed and cryptographically signed by using a strongly generated random key.

# Cloud CDN Best Practices

- Cache static content
- Use proper expiration time or TTL for time sensitive data
- Use custom cache keys to improve cache hit ratio
  - Cloud CDN, by default, uses entire request URL to build the cache key
  - Cache keys can be customized to include or omit any combination of protocol, host, and query string
- Use versioning to update content instead of cache invalidation
  - Versioning content serves a different version of the same content, effectively removing it by showing users new content before the cache entry expires
  - Invalidation is eventually consistent and should be used as a last resort
