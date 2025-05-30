export const SITE = {
  website: "https://thuongnn.dev/", // replace this with your deployed domain
  author: "Thuong Nguyen Nhu",
  profile: "https://thuongnn.dev/",
  desc: "just an engineer guy..",
  title: "thuongnn.dev",
  ogImage: "astropaper-og.jpg",
  lightAndDarkMode: true,
  postPerIndex: 4,
  postPerPage: 4,
  postPerTagsPage: 10,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  showArchives: true,
  showBackButton: true, // show back button in post detail
  editPost: {
    enabled: true,
    text: "Suggest Changes",
    url: "https://github.com/thuongnn/thuongnn.github.io/edit/master/",
  },
  dynamicOgImage: true,
  lang: "en", // html lang code. Set this empty and default will be "en"
  timezone: "UTC", // Default global timezone (IANA format) https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
} as const;
