interface EventSchemaProps {
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  location?: {
    name: string;
    address?: string;
    url?: string;
  };
  image?: string;
  url: string;
  organizer?: {
    name: string;
    url?: string;
  };
  offers?: {
    price: number;
    priceCurrency?: string;
    availability?: 'InStock' | 'SoldOut' | 'PreOrder';
    validFrom?: string;
  };
  eventStatus?: 'EventScheduled' | 'EventCancelled' | 'EventPostponed' | 'EventRescheduled';
  eventAttendanceMode?: 'OfflineEventAttendanceMode' | 'OnlineEventAttendanceMode' | 'MixedEventAttendanceMode';
  performer?: {
    name: string;
    type?: 'Person' | 'Organization';
  };
}

export function EventSchema({
  name,
  description,
  startDate,
  endDate,
  location,
  image,
  url,
  organizer = { name: 'Adorzia', url: 'https://studio.adorzia.com' },
  offers,
  eventStatus = 'EventScheduled',
  eventAttendanceMode = 'OnlineEventAttendanceMode',
  performer,
}: EventSchemaProps) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Event",
    name,
    description,
    startDate,
    url,
    eventStatus: `https://schema.org/${eventStatus}`,
    eventAttendanceMode: `https://schema.org/${eventAttendanceMode}`,
    organizer: {
      "@type": "Organization",
      name: organizer.name,
      url: organizer.url,
    },
  };

  if (endDate) {
    schema.endDate = endDate;
  }

  if (image) {
    schema.image = image;
  }

  if (location) {
    if (eventAttendanceMode === 'OnlineEventAttendanceMode') {
      schema.location = {
        "@type": "VirtualLocation",
        url: location.url || url,
      };
    } else {
      schema.location = {
        "@type": "Place",
        name: location.name,
        address: {
          "@type": "PostalAddress",
          streetAddress: location.address,
          addressCountry: "PK",
        },
      };
    }
  }

  if (offers) {
    schema.offers = {
      "@type": "Offer",
      url,
      price: offers.price,
      priceCurrency: offers.priceCurrency || "PKR",
      availability: `https://schema.org/${offers.availability || 'InStock'}`,
      validFrom: offers.validFrom || startDate,
    };
  }

  if (performer) {
    schema.performer = {
      "@type": performer.type || "Organization",
      name: performer.name,
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Competition-specific schema for design challenges
interface CompetitionSchemaProps {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  prize: string;
  participants?: number;
  url: string;
  image?: string;
  category?: string;
}

export function CompetitionSchema({
  name,
  description,
  startDate,
  endDate,
  prize,
  participants,
  url,
  image,
  category = 'Fashion Design Competition',
}: CompetitionSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Event",
    name,
    description,
    startDate,
    endDate,
    url,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
    location: {
      "@type": "VirtualLocation",
      url: "https://studio.adorzia.com/competitions",
    },
    organizer: {
      "@type": "Organization",
      name: "Adorzia",
      url: "https://studio.adorzia.com",
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "PKR",
      availability: "https://schema.org/InStock",
      description: `Prize: ${prize}`,
    },
    ...(image && { image }),
    ...(participants && { maximumAttendeeCapacity: participants }),
    about: {
      "@type": "Thing",
      name: category,
    },
    audience: {
      "@type": "Audience",
      audienceType: "Fashion Design Students, Emerging Designers",
      geographicArea: {
        "@type": "Country",
        name: "Pakistan",
      },
    },
    keywords: "Fashion Competitions 2026, Design Challenge Pakistan, PIFD vs STEP",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
