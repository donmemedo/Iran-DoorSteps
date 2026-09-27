import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Doorsteps — با شما تا کلید خانه",
    short_name: "Doorsteps",
    description: "Guided home buying: listings, verified pros, budget and a six-phase journey.",
    start_url: "/fa",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#07070b",
    theme_color: "#6b4df6",
    lang: "fa",
    dir: "rtl",
    categories: ["lifestyle", "business", "shopping"],
    icons: [
      { src: "/icons/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/icons/maskable.svg", sizes: "any", type: "image/svg+xml", purpose: "maskable" },
    ],
  };
}
