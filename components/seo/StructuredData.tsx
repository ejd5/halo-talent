import React from "react";

interface StructuredDataProps {
  type: "Organization" | "WebSite" | "BreadcrumbList" | "Article" | "FAQPage" | "Service";
  data: any;
}

export function StructuredData({ type, data }: StructuredDataProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": type,
    ...data,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
