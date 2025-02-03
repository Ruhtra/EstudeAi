import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "EsstudeAi App",
    short_name: "EstudeAi",
    description:
      "Um aplicativo para ajudar nos seus estudos, oferecendo recursos e ferramentas para melhorar seu aprendizado.",
    start_url: "/",
    background_color: "#033952",
    theme_color: "#ffffff",
    orientation: "portrait",
    display: "standalone",
    dir: "auto",
    lang: "pt-BR",
    icons: [
      {
        purpose: "maskable",
        sizes: "512x512",
        src: "/manifest/icon512_maskable.png",
        type: "image/png",
      },
      {
        purpose: "any",
        sizes: "512x512",
        src: "/manifest/icon512_rounded.png",
        type: "image/png",
      },
    ],
  };
}
