import { Metadata } from "next";
import { HOME_DOMAIN } from "../constants/constants";

export function constructMetadata({
  title = `${process.env.NEXT_PUBLIC_APP_NAME} - Orgnise - Create, Collaborate and orgnise.`,
  description = `Streamline your work with our all-in-one knowledge, doc, and project.`,
  image = "",
  icons = [
    {
      rel: "apple-touch-icon",
      sizes: "32x32",
      url: "/apple-touch-icon.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      url: "/favicon-32x32.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      url: "/favicon-16x16.png",
    },
  ],
  noIndex = false,
  keywords = "Orgnise, Knowledge, Doc, Project, Streamline, Work, All-in-one,Project management, Documentation, Tool, Software, Online tool",
}: {
  title?: string;
  description?: string;
  image?: string;
  icons?: Metadata["icons"];
  noIndex?: boolean;
  keywords?: string;
} = {}): Metadata {
  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      images: [
        {
          url: image,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "@thealphamerc",
    },
    icons,
    metadataBase: new URL(HOME_DOMAIN),
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}
