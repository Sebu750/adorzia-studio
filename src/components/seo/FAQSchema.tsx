interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSchemaProps {
  items: FAQItem[];
  mainEntityName?: string;
}

export function FAQSchema({ items, mainEntityName = 'Adorzia' }: FAQSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "name": `${mainEntityName} - Frequently Asked Questions`,
    "mainEntity": items.map((item) => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Pre-defined FAQ items for common pages
export const COMMON_FAQS = {
  portfolio: [
    {
      question: "How to build a professional fashion portfolio in Pakistan?",
      answer: "Adorzia provides StyleBoxes - gamified design challenges that help you create production-ready assets for your portfolio. Complete challenges, earn badges, and showcase your work to brands and recruiters across Pakistan."
    },
    {
      question: "Can fashion design students use Adorzia for free?",
      answer: "Yes! Adorzia offers a free tier for students to build their portfolios, participate in competitions, and connect with the fashion community in Pakistan."
    },
  ],
  competitions: [
    {
      question: "What fashion design competitions are available in Pakistan?",
      answer: "Adorzia hosts regular design competitions including Styleathons, brand-sponsored challenges, and inter-university design competitions. Students from PIFD, STEP, and other institutes compete for prizes and brand collaborations."
    },
    {
      question: "How do I participate in fashion competitions on Adorzia?",
      answer: "Create a free account, browse active competitions, and submit your designs through our StyleBox system. Winners receive cash prizes, brand collaborations, and portfolio features."
    },
  ],
  brands: [
    {
      question: "How can brands find fashion designers in Pakistan?",
      answer: "Adorzia's designer marketplace connects brands with vetted fashion, textile, and jewelry designers across Pakistan. Browse portfolios, review ratings, and hire designers for custom collections or white-label production."
    },
    {
      question: "Can brands host their own design competitions on Adorzia?",
      answer: "Yes! Brands can create custom design challenges with specific briefs, prize pools, and selection criteria. This is an effective way to source fresh designs and discover emerging talent in Pakistan."
    },
  ],
  marketplace: [
    {
      question: "How does the made-to-order marketplace work?",
      answer: "Designers list their creations on Adorzia's marketplace. When customers order, designers produce the item on-demand, eliminating inventory costs. This model supports sustainable fashion and enables zero-inventory fashion brands."
    },
    {
      question: "Can I sell my jewelry designs on Adorzia?",
      answer: "Yes! Adorzia supports fashion, textile, and jewelry designers. List your designs on the marketplace, set your prices, and earn from each sale with our transparent commission structure."
    },
  ],
};
