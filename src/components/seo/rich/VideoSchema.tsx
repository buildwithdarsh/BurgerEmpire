import { cloudinaryUrl } from "@/lib/cloudinary-url";

interface VideoSchemaProps {
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  duration: string;
  contentUrl?: string;
  embedUrl?: string;
  interactionCount?: number;
}

export function VideoSchema(props: VideoSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: props.name,
    description: props.description,
    thumbnailUrl: [props.thumbnailUrl],
    uploadDate: props.uploadDate,
    duration: props.duration,
    contentUrl: props.contentUrl,
    embedUrl: props.embedUrl,
    publisher: {
      "@type": "Organization",
      name: "Burger Empire",
      logo: {
        "@type": "ImageObject",
        url: cloudinaryUrl("burgerempire/images/logo"),
        width: 200,
        height: 60,
      },
    },
    interactionStatistic: props.interactionCount
      ? {
          "@type": "InteractionCounter",
          interactionType: "https://schema.org/WatchAction",
          userInteractionCount: props.interactionCount,
        }
      : undefined,
    potentialAction: {
      "@type": "WatchAction",
      target: props.embedUrl || props.contentUrl,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
