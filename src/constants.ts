import IconMail from "@/assets/icons/IconMail.svg";
import IconGitHub from "@/assets/icons/IconGitHub.svg";
import IconBrandX from "@/assets/icons/IconBrandX.svg";
import IconLinkedin from "@/assets/icons/IconLinkedin.svg";
import IconWhatsapp from "@/assets/icons/IconWhatsapp.svg";
import IconFacebook from "@/assets/icons/IconFacebook.svg";
import IconTelegram from "@/assets/icons/IconTelegram.svg";
import IconPinterest from "@/assets/icons/IconPinterest.svg";
import type { GiscusProps } from "@giscus/react";
import { SITE } from "@/config";

export const SOCIALS = [
  {
    name: "Github",
    href: "https://github.com/thuongnn",
    linkTitle: ` ${SITE.title} on Github`,
    icon: IconGitHub,
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/thuongnn97",
    linkTitle: `${SITE.title} on Facebook`,
    icon: IconFacebook,
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/thuongnn/",
    linkTitle: `${SITE.title} on LinkedIn`,
    icon: IconLinkedin,
  },
  {
    name: "Mail",
    href: "mailto:thuongnn1997@gmail.com",
    linkTitle: `Send an email to ${SITE.title}`,
    icon: IconMail,
  },
] as const;

export const SHARE_LINKS = [
  {
    name: "WhatsApp",
    href: "https://wa.me/?text=",
    linkTitle: `Share this post via WhatsApp`,
    icon: IconWhatsapp,
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/sharer.php?u=",
    linkTitle: `Share this post on Facebook`,
    icon: IconFacebook,
  },
  {
    name: "X",
    href: "https://x.com/intent/post?url=",
    linkTitle: `Share this post on X`,
    icon: IconBrandX,
  },
  {
    name: "Telegram",
    href: "https://t.me/share/url?url=",
    linkTitle: `Share this post via Telegram`,
    icon: IconTelegram,
  },
  {
    name: "Pinterest",
    href: "https://pinterest.com/pin/create/button/?url=",
    linkTitle: `Share this post on Pinterest`,
    icon: IconPinterest,
  },
  {
    name: "Mail",
    href: "mailto:?subject=See%20this%20post&body=",
    linkTitle: `Share this post via email`,
    icon: IconMail,
  },
] as const;

export const GISCUS: GiscusProps = {
  repo: "thuongnn/thuongnn.github.io",
  repoId: "MDEwOlJlcG9zaXRvcnkyMTk3NTcxNTQ=",
  category: "General",
  categoryId: "DIC_kwDODRk6Ys4Cqtv2",
  mapping: "title",
  reactionsEnabled: "1",
  emitMetadata: "0",
  inputPosition: "top",
  lang: "en",
  loading: "lazy",
};

export interface Collection {
  folder: string; // Tên folder chứa các bài viết
  name: string; // Tên hiển thị của collection
  description?: string; // Mô tả ngắn về collection
  icon?: string; // Icon cho collection (có thể thêm sau)
}

export const COLLECTIONS: Collection[] = [
  // {
  //   folder: "aws",
  //   name: "Amazon Web Services",
  //   description: "Tổng hợp các bài viết về AWS services",
  // },
  // {
  //   folder: "google-cloud",
  //   name: "Google Cloud Platform",
  //   description: "Tổng hợp các bài viết về Google Cloud services",
  // },
  {
    folder: "computer-science",
    name: "Computer Science",
    description: "Tổng hợp các bài viết về Computer Science",
  },
];
