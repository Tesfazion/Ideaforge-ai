export const SUNSHINE = {
  name: "Sunshine Tech Solution",
  url: "https://sunshinetechsolution.vercel.app/",
  site: "https://ethiosunshine.tech/",
  github: "https://github.com/Tesfazion/Ideaforge-ai",
} as const;

export const SUNSHINE_LINKS = [
  { label: "Sunshine Tech Solution", href: SUNSHINE.url, icon: "globe" },
  { label: "Ethio Sunshine", href: SUNSHINE.site, icon: "spark" },
  { label: "IdeaForge on GitHub", href: SUNSHINE.github, icon: "github" },
] as const;
