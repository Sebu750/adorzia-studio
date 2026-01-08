interface ProductSchemaProps {
  name: string;
  description: string;
  image: string;
  price: number;
  currency?: string;
  sku?: string;
  brand?: string;
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder';
  ratingValue?: number;
  reviewCount?: number;
  url: string;
}

export function ProductSchema({
  name,
  description,
  image,
  price,
  currency = "USD",
  sku,
  brand = "Adorzia",
  availability = "InStock",
  ratingValue,
  reviewCount,
  url,
}: ProductSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    image,
    sku,
    brand: {
      "@type": "Brand",
      name: brand,
    },
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: currency,
      price: price.toFixed(2),
      availability: `https://schema.org/${availability}`,
      seller: {
        "@type": "Organization",
        name: "Adorzia",
      },
    },
    ...(ratingValue && reviewCount && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: ratingValue.toFixed(1),
        reviewCount,
      },
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
