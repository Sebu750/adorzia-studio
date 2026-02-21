interface HowToStep {
  name: string;
  text: string;
  image?: string;
  url?: string;
}

interface HowToSchemaProps {
  name: string;
  description: string;
  steps: HowToStep[];
  totalTime?: string;
  estimatedCost?: {
    currency: string;
    value: string;
  };
  image?: string;
  tool?: string[];
  supply?: string[];
}

export function HowToSchema({
  name,
  description,
  steps,
  totalTime,
  estimatedCost,
  image,
  tool,
  supply,
}: HowToSchemaProps) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    description,
    step: steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.name,
      text: step.text,
      ...(step.image && { image: step.image }),
      ...(step.url && { url: step.url }),
    })),
  };

  if (totalTime) {
    schema.totalTime = totalTime;
  }

  if (estimatedCost) {
    schema.estimatedCost = {
      "@type": "MonetaryAmount",
      currency: estimatedCost.currency,
      value: estimatedCost.value,
    };
  }

  if (image) {
    schema.image = image;
  }

  if (tool && tool.length > 0) {
    schema.tool = tool.map((t) => ({
      "@type": "HowToTool",
      name: t,
    }));
  }

  if (supply && supply.length > 0) {
    schema.supply = supply.map((s) => ({
      "@type": "HowToSupply",
      name: s,
    }));
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Pre-defined HowTo schemas for common pages
export const COMMON_HOWTOS = {
  buildPortfolio: {
    name: "How to Build a Professional Fashion Portfolio in Pakistan",
    description: "Step-by-step guide to creating a production-ready fashion design portfolio using Adorzia StyleBoxes. Perfect for students and emerging designers in Pakistan.",
    steps: [
      {
        name: "Create Your Adorzia Account",
        text: "Sign up for a free account on Adorzia. Choose the Basic tier to start building your portfolio with access to 3 free StyleBoxes.",
      },
      {
        name: "Complete Your First StyleBox",
        text: "Pick a StyleBox challenge that matches your interests (Streetwear, Couture, Essentials, etc.). Follow the design brief and submit your work.",
      },
      {
        name: "Receive Feedback and Scores",
        text: "Your submission is evaluated on Creativity, Execution, Originality, Brand Coherence, and Craftsmanship. Use feedback to improve.",
      },
      {
        name: "Build Your Portfolio Gallery",
        text: "Completed StyleBoxes automatically populate your portfolio. Add project descriptions and showcase your design process.",
      },
      {
        name: "Get Discovered by Brands",
        text: "Share your portfolio with recruiters and brands. Participate in competitions to gain visibility and win prizes.",
      },
    ],
    totalTime: "P2W",
  },
  startFashionBrand: {
    name: "How to Start a Fashion Brand with Zero Inventory in Pakistan",
    description: "Learn how to launch a fashion brand in Pakistan without holding inventory using Adorzia's made-to-order marketplace model.",
    steps: [
      {
        name: "Create Your Brand Profile",
        text: "Sign up on Adorzia and set up your brand profile. Define your brand aesthetic, target audience, and design philosophy.",
      },
      {
        name: "Design or Collaborate",
        text: "Create your own designs using StyleBox tools, or partner with designers from the Adorzia network for capsule collections.",
      },
      {
        name: "List Products on Marketplace",
        text: "Add your designs to the marketplace with pricing. No inventory required - products are made-to-order when customers purchase.",
      },
      {
        name: "Promote Your Brand",
        text: "Use social media, participate in Adorzia competitions, and leverage the platform's built-in traffic to reach customers.",
      },
      {
        name: "Fulfill Orders and Earn",
        text: "When orders come in, Adorzia handles production and shipping. You earn up to 40% revenue share on each sale.",
      },
    ],
    totalTime: "P1M",
    estimatedCost: {
      currency: "PKR",
      value: "0",
    },
  },
  enterCompetitions: {
    name: "How to Enter Fashion Design Competitions in Pakistan",
    description: "Guide to participating in fashion design competitions on Adorzia, including PIFD vs STEP inter-university challenges.",
    steps: [
      {
        name: "Browse Active Competitions",
        text: "Visit the Competitions page to see live challenges, upcoming events, and brand-sponsored contests.",
      },
      {
        name: "Read Competition Brief",
        text: "Each competition has a specific theme, requirements, and prizes. Understand the brief before starting your design.",
      },
      {
        name: "Submit Your Entry",
        text: "Create your design using StyleBox tools. Ensure your submission meets all requirements before the deadline.",
      },
      {
        name: "Get Judged and Ranked",
        text: "Entries are evaluated by judges or community voting. Top entries win prizes and brand recognition.",
      },
      {
        name: "Claim Your Prize",
        text: "Winners receive cash prizes, brand collaboration opportunities, and featured placement on the platform.",
      },
    ],
    totalTime: "P1W",
  },
};
