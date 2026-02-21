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
  startups: [
    {
      question: "How to start a fashion brand with zero inventory in Pakistan?",
      answer: "Adorzia's made-to-order model lets you launch a fashion brand without holding any inventory. You design or curate products, list them on the marketplace, and we handle production only when orders come in. This eliminates upfront costs and inventory risk."
    },
    {
      question: "How to find a co-founder for a fashion startup in Pakistan?",
      answer: "Use Adorzia's designer network to find potential co-founders. Browse designer profiles, review portfolios, and reach out for collaboration. Many successful fashion startups on our platform started as designer-entrepreneur partnerships."
    },
    {
      question: "What is the revenue share for fashion startups on Adorzia?",
      answer: "Startups earn up to 40% revenue share depending on their rank and founder status. Early founders (F1/F2) receive permanent bonus percentages. Production costs, shipping, and platform fees are deducted from the remaining share."
    },
    {
      question: "Can I collaborate with designers for a capsule collection?",
      answer: "Yes! Adorzia's peer-to-peer networking connects you with designers across Pakistan. You can collaborate on capsule collections, limited editions, or ongoing partnerships with transparent revenue sharing."
    },
  ],
  institutes: [
    {
      question: "What are the best fashion design institutes in Pakistan?",
      answer: "Top fashion design institutes in Pakistan include PIFD (Pakistan Institute of Fashion & Design) in Lahore, STEP Institute in Karachi, National College of Arts (NCA), IVSAA (Indus Valley School), Beaconhouse National University, and SZABIST. Each has unique strengths in different fashion categories."
    },
    {
      question: "How do PIFD vs STEP design competitions work on Adorzia?",
      answer: "Inter-university competitions on Adorzia pit students from different institutes against each other in themed design challenges. Students submit StyleBox entries, which are judged on creativity, execution, and market readiness. Winners receive cash prizes, brand exposure, and portfolio features."
    },
    {
      question: "Can fashion students from any institute join Adorzia?",
      answer: "Yes! Adorzia welcomes fashion design students from all institutes across Pakistan. Whether you're from PIFD, STEP, NCA, IVSAA, or any other fashion school, you can create a free account, build your portfolio, and participate in competitions."
    },
  ],
};
