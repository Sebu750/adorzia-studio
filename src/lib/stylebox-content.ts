/**
 * Production-Grade StyleBox Content Data
 * 4 Studios × 4 Levels = 16 StyleBoxes for MVP Launch
 */

import type { 
  StyleBoxTemplate, 
  StudioName, 
  LevelNumber,
  DetailedDeliverable,
  StyleBoxConstraint,
  StyleBoxScenario 
} from './stylebox-template';

// ============================================
// STUDIO 1: BRIDAL SERIES (Fashion)
// ============================================

const BRIDAL_SERIES: Partial<StyleBoxTemplate>[] = [
  {
    // Level 1: EASY - The Concept Phase
    title: "Bridal Series: The Concept Phase",
    studio_name: 'bridal-series',
    client_name: 'Sophia',
    level_number: 1,
    category: 'fashion',
    difficulty: 'free',
    target_role: 'Junior Designer / Illustrator',
    time_limit_hours: 4,
    xp_reward: 100,
    scenario: {
      context: 'Engagement Party',
      theme: 'Romantic Minimalism',
      difficulty_spike: "It's not just a sketch; it's a material concept. The sampling team needs to know what the drawing represents visually and texturally.",
    },
    description: 'Create a concept design for an engagement party dress. Focus on rendering fabric texture and material intent for the sampling team.',
    constraints: [
      { type: 'silhouette', label: 'Silhouette', value: 'Bias-cut slip dress', is_required: true },
      { type: 'fabric', label: 'Fabric Intent', value: 'Must appear fluid (Silk Satin)', is_required: true },
    ],
    detailed_deliverables: [
      {
        id: 'illustration',
        name: 'Fashion Illustration (Front & Back)',
        description: 'Full color illustration showing drape and lighting',
        specifications: ['Show fabric drape', 'Demonstrate lighting/shine', 'Full color rendering'],
        required: true,
        category: 'illustration',
      },
      {
        id: 'fabric-sim',
        name: 'Fabric Simulation',
        description: 'The sketch must clearly render the texture',
        specifications: ['Render shine for satin', 'Show matte for crepe', 'Texture must be identifiable'],
        required: true,
        category: 'illustration',
      },
      {
        id: 'detail-zoom',
        name: 'Detailed Zoom-In',
        description: 'Close-up panel showing specific detail',
        specifications: ['1000x1000px minimum', 'Strap attachment OR neckline finish', 'High resolution'],
        dimensions: '1000x1000px',
        required: true,
        category: 'illustration',
      },
      {
        id: 'pantone',
        name: 'Pantone Color Match',
        description: 'Specific Pantone Textile (TCX) codes',
        specifications: ['Main fabric color code', 'Lining color code', 'Use TCX format'],
        required: true,
        category: 'documentation',
      },
    ],
  },
  {
    // Level 2: MEDIUM - The Construction Phase
    title: "Bridal Series: The Construction Phase",
    studio_name: 'bridal-series',
    client_name: 'Sophia',
    level_number: 2,
    category: 'fashion',
    difficulty: 'free',
    target_role: 'Mid-Level Designer',
    time_limit_hours: 12,
    xp_reward: 250,
    scenario: {
      context: 'Rehearsal Dinner',
      theme: 'Structural Elegance',
      difficulty_spike: 'We need to know how it opens, closes, and stays on the body.',
    },
    description: 'Create technical documentation for a structured bodice dress. Focus on construction details and closure mechanisms.',
    constraints: [
      { type: 'structure', label: 'Structure', value: 'Bodice must be boned/corseted', is_required: true },
      { type: 'technique', label: 'Closure', value: 'Invisible zipper (Center Back)', is_required: true },
      { type: 'fabric', label: 'Lining', value: 'Fully lined', is_required: true },
    ],
    detailed_deliverables: [
      {
        id: 'flats',
        name: 'Flat Sketches (Technical Flats)',
        description: 'Black & white line art',
        specifications: ['Front, Back, Side views', 'All seam lines (Princess seams, darts, waistline)', 'Stitch lines (Topstitch vs. Edge stitch)'],
        required: true,
        category: 'technical',
      },
      {
        id: 'callouts',
        name: 'Construction Callouts',
        description: 'Arrows pointing to specific areas with instructions',
        specifications: ['"Hook & Eye closure at top of zipper"', '"1cm seam allowance pressed open"', '"Horsehair braid (crinoline) at hem for volume"'],
        required: true,
        category: 'technical',
      },
      {
        id: 'trims',
        name: 'Trims List',
        description: 'Basic list of non-fabric items',
        specifications: ['YKK Invisible Zip #3, 40cm, Dyed to Match', 'Hook & Eye specifications', 'Thread color matching'],
        required: true,
        category: 'documentation',
      },
    ],
  },
  {
    // Level 3: HARD - The Tech Pack Phase
    title: "Bridal Series: The Tech Pack Phase",
    studio_name: 'bridal-series',
    client_name: 'Sophia',
    level_number: 3,
    category: 'fashion',
    difficulty: 'free',
    target_role: 'Senior Technical Designer',
    time_limit_hours: 48,
    xp_reward: 500,
    scenario: {
      context: 'The Main Ceremony',
      theme: 'Eco-Couture',
      difficulty_spike: 'The sampling team needs a full Bill of Materials (BOM) and Points of Measure (POM). If the measurements are off, the sample fails.',
    },
    description: 'Create a complete tech pack for a fitted mermaid silhouette wedding gown with embroidery placement.',
    constraints: [
      { type: 'silhouette', label: 'Fit', value: 'Fitted Mermaid Silhouette with Train', is_required: true },
      { type: 'sizing', label: 'Sizing', value: 'Sample Size US 6 / UK 10', is_required: true },
      { type: 'technique', label: 'Complexity', value: 'Multi-layered tulle skirt with embroidery placement', is_required: true },
    ],
    detailed_deliverables: [
      {
        id: 'techpack',
        name: 'Full Tech Pack (PDF)',
        description: 'Complete technical package for sampling',
        specifications: ['Cover page with style details', 'All views with annotations', 'Complete specifications'],
        file_format: 'PDF',
        required: true,
        category: 'documentation',
      },
      {
        id: 'bom',
        name: 'BOM (Bill of Materials)',
        description: 'Comprehensive materials table',
        specifications: ['Main Fabric, Lining, Interfacing, Tulle, Thread', 'Buttons, Zippers', 'Consumption estimates (e.g., 4.5 meters)'],
        required: true,
        category: 'documentation',
      },
      {
        id: 'pom',
        name: 'POM (Points of Measure)',
        description: 'Data table with measurement points',
        specifications: ['Minimum 15 measurement points', 'Across Shoulder, Bust, Waist, High Hip, Low Hip', 'Sweep, Armhole Depth, etc.'],
        required: true,
        category: 'documentation',
      },
      {
        id: 'embroidery-map',
        name: 'Embroidery Placement Map',
        description: 'Schematic showing motif positions',
        specifications: ['"Start 10cm below waistline"', '"Fade out at knee"', 'Exact positioning grid'],
        required: true,
        category: 'technical',
      },
      {
        id: 'inside-view',
        name: 'Inside View Sketch',
        description: 'Inside of garment construction',
        specifications: ['French seams vs. Overlock', 'Lining attachment method', 'Hanging loops placement'],
        required: true,
        category: 'technical',
      },
    ],
  },
  {
    // Level 4: INSANE - The Manufacturing Phase
    title: "Bridal Series: The Manufacturing Phase",
    studio_name: 'bridal-series',
    client_name: 'Sophia',
    level_number: 4,
    category: 'fashion',
    difficulty: 'free',
    target_role: 'Lead Product Developer / 3D Specialist',
    time_limit_hours: 72,
    xp_reward: 1000,
    scenario: {
      context: 'The After-Party',
      theme: 'Transformer Dress',
      difficulty_spike: 'This is ready for mass production or high-end 3D prototyping. The factory needs zero questions answered.',
    },
    description: 'Create production-ready files for a convertible dress with detachable elements and 3D digital twin.',
    constraints: [
      { type: 'innovation', label: 'Innovation', value: 'Detachable skirt mechanism (Magnet or Snap tape)', is_required: true },
      { type: 'technique', label: 'Patterning', value: 'Zero-Waste Pattern Logic (preferred)', is_required: false },
      { type: 'format', label: 'Format', value: 'Digital Twin required', is_required: true },
    ],
    detailed_deliverables: [
      {
        id: 'pattern-logic',
        name: 'Production Pattern Logic',
        description: 'Mini-Marker layout for fabric optimization',
        specifications: ['Pattern pieces on 140cm fabric width', 'Calculate exact yield/waste', 'Grain line directions'],
        required: true,
        category: 'technical',
      },
      {
        id: 'ops-list',
        name: 'Assembly Instructions (Operation List)',
        description: 'Step-by-step guide for sewing floor',
        specifications: ['Step 1: Fuse interfacing to collar', 'Step 2: Sew darts on front bodice', 'Step 3: Attach detachable snap tape to waist seam'],
        required: true,
        category: 'documentation',
      },
      {
        id: '3d-asset',
        name: '3D Asset (OBJ/GLB) OR Turntable Video',
        description: '360-degree view of draped garment',
        specifications: ['Draped on avatar', 'Heat Map / Strain Map', 'Prove fit is tight but not bursting'],
        file_format: 'OBJ/GLB/MP4',
        required: true,
        category: 'digital',
      },
      {
        id: 'costing',
        name: 'Costing Sheet (Estimate)',
        description: 'Full production cost breakdown',
        specifications: ['Estimated Fabric Cost', 'Trims cost', 'Cut & Sew Minutes (Labor)'],
        required: true,
        category: 'documentation',
      },
    ],
  },
];

// ============================================
// STUDIO 2: MARIA B. SPRING 2026 (Pakistani Fusion)
// ============================================

const MARIA_B_COLLECTION: Partial<StyleBoxTemplate>[] = [
  {
    // Level 1: EASY - The Print Concept
    title: "Maria B. Gardens of Andalusia: The Print Concept",
    studio_name: 'maria-b',
    client_name: 'Maria B.',
    level_number: 1,
    category: 'fashion',
    difficulty: 'free',
    target_role: 'Textile Designer / Illustrator',
    time_limit_hours: 4,
    xp_reward: 100,
    season: 'SS26',
    scenario: {
      context: 'Unstitched Lawn Collection',
      theme: 'Moorish Architecture mixed with Spanish Flora',
      difficulty_spike: 'Maria B. needs a fresh digital print concept. The theme is Moorish Architecture mixed with Spanish Flora.',
    },
    description: 'Create a digital print concept for luxury pret/fusion wear combining Islamic geometric patterns with organic floral motifs.',
    constraints: [
      { type: 'colors', label: 'Colors', value: 'Sun-Baked Earth palette: Terracotta (#E2725B), Deep Teal (#008080), Ivory (#FFFFF0)', is_required: true },
      { type: 'motifs', label: 'Motifs', value: 'Geometric Islamic tile patterns (Zellij) merging into organic Bougainvillea flowers', is_required: true },
    ],
    detailed_deliverables: [
      {
        id: 'repeat-tile',
        name: 'Print Repeat Tile',
        description: 'High-resolution seamless pattern',
        specifications: ['1000x1000px or larger', 'Seamless repeat', 'Print-ready quality'],
        dimensions: '1000x1000px minimum',
        required: true,
        category: 'illustration',
      },
      {
        id: 'mockup',
        name: 'Mockup Visualization',
        description: 'Print applied to Kurta outline',
        specifications: ['Show scale and placement', 'Standard Kurta silhouette', 'Front view minimum'],
        required: true,
        category: 'illustration',
      },
      {
        id: 'color-sep',
        name: 'Color Separation',
        description: 'Display distinct colors used',
        specifications: ['4-6 distinct colors', 'Simulate screen-print separation', 'Color swatches with codes'],
        required: true,
        category: 'technical',
      },
    ],
  },
  {
    // Level 2: MEDIUM - The Fusion Silhouette
    title: "Maria B. Gardens of Andalusia: The Fusion Silhouette",
    studio_name: 'maria-b',
    client_name: 'Maria B.',
    level_number: 2,
    category: 'fashion',
    difficulty: 'free',
    target_role: 'Fashion Designer',
    time_limit_hours: 12,
    xp_reward: 250,
    season: 'SS26',
    scenario: {
      context: 'Eid Lunch Ready-to-Wear',
      theme: 'Kalidar Jumpsuit Fusion',
      difficulty_spike: 'It must fuse a traditional Kalidar silhouette with a modern Jumpsuit or Trouser element.',
    },
    description: 'Design a Ready-to-Wear outfit fusing traditional Kalidar with modern trouser elements for Eid celebrations.',
    constraints: [
      { type: 'fabric', label: 'Fabric', value: 'Pure Grip 80 or Raw Silk', is_required: true },
      { type: 'silhouette', label: 'Cut', value: 'A-line shirt paired with modern "Bootcut" trousers', is_required: true },
      { type: 'technique', label: 'Detailing', value: 'Neckline must feature a specific "Loop Button" detail', is_required: true },
    ],
    detailed_deliverables: [
      {
        id: 'illustration',
        name: 'Fashion Illustration',
        description: 'Front and Back view showing fabric fall',
        specifications: ['Full color', 'Show drape and flow', 'Front and Back views'],
        required: true,
        category: 'illustration',
      },
      {
        id: 'flat-sketch',
        name: 'Flat Sketch (Technical)',
        description: 'Technical drawings with construction details',
        specifications: ['Kalidar paneling (how many panels, flare width)', 'Bootcut measurement at hem', 'Construction lines visible'],
        required: true,
        category: 'technical',
      },
      {
        id: 'trim-placement',
        name: 'Trim Placement',
        description: 'Mark exactly where lace or piping goes',
        specifications: ['"Join panels with zero-size gold piping"', 'Lace placement indicators', 'Button positioning'],
        required: true,
        category: 'technical',
      },
    ],
  },
  {
    // Level 3: HARD - The Embroidery Tech Pack
    title: "Maria B. Gardens of Andalusia: The Embroidery Tech Pack",
    studio_name: 'maria-b',
    client_name: 'Maria B.',
    level_number: 3,
    category: 'fashion',
    difficulty: 'free',
    target_role: 'Senior Designer / Embroidery Specialist',
    time_limit_hours: 48,
    xp_reward: 500,
    season: 'SS26',
    scenario: {
      context: 'Signature Heavy Formal',
      theme: 'Multi-head Embroidery Production',
      difficulty_spike: 'This requires a fully detailed embroidery map (Khaka) for the sampling machine. The stitch count must not exceed 150,000.',
    },
    description: 'Create a complete embroidery tech pack for a heavy formal piece with detailed Khaka for machine production.',
    constraints: [
      { type: 'technique', label: 'Technique', value: 'Mix of Resham (Silk thread), Tilla (Gold wire), and Sequins', is_required: true },
      { type: 'application', label: 'Placement', value: 'Heavy neckline (Gala) and borders (Daman)', is_required: true },
      { type: 'technique', label: 'Budget Control', value: 'Stitch count must not exceed 150,000 stitches', is_required: true },
    ],
    detailed_deliverables: [
      {
        id: 'khaka',
        name: 'Embroidery Map (Khaka)',
        description: 'Clear line drawing for digitizer',
        specifications: ['Distinguish Satin stitch vs. Run stitch areas', 'Scale reference', 'Color coding for techniques'],
        required: true,
        category: 'technical',
      },
      {
        id: 'bom',
        name: 'BOM (Bill of Materials)',
        description: 'Complete embroidery materials list',
        specifications: ['Specific thread colors (e.g., "Anchor 456")', 'Sequin size (e.g., "3mm Gold Matte")', 'Tilla specifications'],
        required: true,
        category: 'documentation',
      },
      {
        id: 'measurement-spec',
        name: 'Measurement Spec Sheet',
        description: 'Full garment measurements',
        specifications: ['Shoulder, Chest, Waist, Hip', 'Armhole, Sleeve Opening', 'Total Length'],
        required: true,
        category: 'documentation',
      },
    ],
  },
  {
    // Level 4: INSANE - The Master Sample
    title: "Maria B. Gardens of Andalusia: The Master Sample",
    studio_name: 'maria-b',
    client_name: 'Maria B.',
    level_number: 4,
    category: 'fashion',
    difficulty: 'free',
    target_role: 'Product Developer / Production Manager',
    time_limit_hours: 72,
    xp_reward: 1000,
    season: 'SS26',
    scenario: {
      context: 'Fashion Week Showstopper',
      theme: 'Complex 3-Piece Ensemble',
      difficulty_spike: 'This is a complex 3-piece ensemble with pre-draped dupatta and 3D hand-embellishment. Documentation must be ready for Adda workers and Master Tailor.',
    },
    description: 'Create complete production documentation for a showstopper ensemble: embellished jacket, inner slip, and pre-draped dupatta.',
    constraints: [
      { type: 'innovation', label: 'Innovation', value: 'Dupatta must be "Pre-Draped" or stitched into shoulder mechanism', is_required: true },
      { type: 'technique', label: 'Surface Embellishment', value: '3D hand-embellishment (Adda work) mixed with machine embroidery', is_required: true },
    ],
    detailed_deliverables: [
      {
        id: 'adda-guide',
        name: 'The "Adda" Guide',
        description: 'Detailed beadwork instructions',
        specifications: ['"Cluster of pearls here"', '"Crystal fringe at hem"', 'Close-up positioning diagrams'],
        required: true,
        category: 'documentation',
      },
      {
        id: 'pattern-layout',
        name: 'Pattern Layout (Marker)',
        description: 'Cutting layout for fabric optimization',
        specifications: ['Standard 4-yard fabric roll', 'All complex pieces', 'Minimize waste'],
        required: true,
        category: 'technical',
      },
      {
        id: 'ops-sequence',
        name: 'Construction Sequence (Operations List)',
        description: 'Step-by-step assembly guide',
        specifications: ['Step 1: Frame fabric for embroidery', 'Step 2: Wash/Shrink after embroidery', 'Step 3: Cut panels', 'Step 4: Stitch inner slip to jacket at shoulder'],
        required: true,
        category: 'documentation',
      },
      {
        id: 'costing',
        name: 'Costing Breakdown',
        description: 'Complete cost calculation',
        specifications: ['Fabric Cost + Embroidery Machine Time', 'Handwork Labor Hours + Stitching Cost', 'Overheads = Final Ex-Factory Price'],
        required: true,
        category: 'documentation',
      },
    ],
  },
];

// ============================================
// STUDIO 3: BOTANIC ILLUSION (Textile)
// ============================================

const BOTANIC_ILLUSION: Partial<StyleBoxTemplate>[] = [
  {
    // Level 1: EASY - The Motif
    title: "Botanic Illusion: The Hero Motif",
    studio_name: 'botanic-illusion',
    client_name: 'Studio Client',
    level_number: 1,
    category: 'textile',
    difficulty: 'free',
    target_role: 'Junior Textile Artist',
    time_limit_hours: 4,
    xp_reward: 100,
    season: 'SS26',
    scenario: {
      context: 'Digital Garden Collection',
      theme: 'Watercolor + Pixelated/Glitch Fusion',
      difficulty_spike: 'Create a single "Hero Motif" combining hand-painted watercolor effect with pixelated/glitch edges.',
    },
    description: 'Create a hero motif for a floral print collection combining traditional watercolor techniques with digital manipulation.',
    constraints: [
      { type: 'technique', label: 'Style', value: 'Watercolor effect mixed with pixelated/glitch edges (Hand-painted + Digital)', is_required: true },
      { type: 'motifs', label: 'Subject', value: 'Large-scale Hibiscus or Peony flower', is_required: true },
      { type: 'colors', label: 'Palette', value: '"Cyber-Nature" – Neon Pink (#FF6EC7), Deep Moss Green (#4A5D23)', is_required: true },
    ],
    detailed_deliverables: [
      {
        id: 'motif',
        name: 'The Motif',
        description: 'High-resolution hero element',
        specifications: ['Transparent PNG background', 'High resolution (300dpi+)', 'Print-ready quality'],
        file_format: 'PNG',
        required: true,
        category: 'illustration',
      },
      {
        id: 'process-sketch',
        name: 'Process Sketch',
        description: 'Original artwork before digital editing',
        specifications: ['Snapshot of original sketch/painting', 'Show hand-painted layer', 'Document technique'],
        required: true,
        category: 'illustration',
      },
    ],
  },
  {
    // Level 2: MEDIUM - The Repeat Pattern
    title: "Botanic Illusion: The Repeat Pattern",
    studio_name: 'botanic-illusion',
    client_name: 'Studio Client',
    level_number: 2,
    category: 'textile',
    difficulty: 'free',
    target_role: 'Textile Designer',
    time_limit_hours: 12,
    xp_reward: 250,
    season: 'SS26',
    scenario: {
      context: 'Production-Ready Rotary Print',
      theme: 'Seamless Repeat Engineering',
      difficulty_spike: 'Turn the Hero Motif into a production-ready Seamless Repeat Pattern suitable for rotary printing.',
    },
    description: 'Transform the hero motif into a production-ready seamless repeat pattern for rotary printing.',
    constraints: [
      { type: 'technique', label: 'Repeat Type', value: 'Half-Drop Repeat or Brick Repeat (NOT simple grid)', is_required: true },
      { type: 'sizing', label: 'Dimensions', value: '64cm x 64cm tile size (Standard rotary screen)', is_required: true },
      { type: 'technique', label: 'Coverage', value: '80% coverage (Dense pattern)', is_required: true },
    ],
    detailed_deliverables: [
      {
        id: 'repeat-block',
        name: 'The Repeat Block',
        description: 'Source file that tiles perfectly',
        specifications: ['AI/PSD/TIFF format', 'Seamless without visible edges', '64x64cm at print resolution'],
        file_format: 'AI/PSD/TIFF',
        required: true,
        category: 'technical',
      },
      {
        id: 'scale-ref',
        name: 'Scale Reference',
        description: 'Pattern on virtual fabric roll',
        specifications: ['Show pattern relative to meter rule', 'Full roll visualization', 'Scale indicator'],
        required: true,
        category: 'illustration',
      },
    ],
  },
  {
    // Level 3: HARD - The Collection & Colorways
    title: "Botanic Illusion: The Collection & Colorways",
    studio_name: 'botanic-illusion',
    client_name: 'Studio Client',
    level_number: 3,
    category: 'textile',
    difficulty: 'free',
    target_role: 'Senior Print Designer',
    time_limit_hours: 24,
    xp_reward: 500,
    season: 'SS26',
    scenario: {
      context: 'Coordinate Collection Development',
      theme: 'Main Print + Supporting Coordinates',
      difficulty_spike: 'A main print is rarely sold alone; it needs supporting prints and multiple colorways.',
    },
    description: 'Develop a full coordinate collection with main print, geometric coordinate, texture blender, and three colorways.',
    constraints: [
      { type: 'technique', label: 'Main Print', value: 'The floral repeat from Level 2', is_required: true },
      { type: 'technique', label: 'Coordinate 1', value: 'Geometric pattern (stripes, polka dots, checks) matching floral colors', is_required: true },
      { type: 'technique', label: 'Coordinate 2', value: 'Blender print (abstract texture) as solid/background', is_required: true },
      { type: 'colors', label: 'Colorways', value: '3 Distinct Colorways (Morning Light, Midnight, Sunset)', is_required: true },
    ],
    detailed_deliverables: [
      {
        id: 'collection-board',
        name: 'Collection Board',
        description: 'Layout showing Main Print + 2 Coordinates',
        specifications: ['Harmonious arrangement', 'Show how prints work together', 'Professional presentation'],
        required: true,
        category: 'illustration',
      },
      {
        id: 'colorway-presentation',
        name: 'Colorway Presentation',
        description: 'Three versions of Main Print side-by-side',
        specifications: ['Morning Light colorway', 'Midnight colorway', 'Sunset colorway'],
        required: true,
        category: 'illustration',
      },
      {
        id: 'pantone-spec',
        name: 'Pantone Specification',
        description: 'Complete color code list',
        specifications: ['Pantone TCX codes for every color', 'Maximum 8 colors per print', 'Screen printing compatible'],
        required: true,
        category: 'documentation',
      },
    ],
  },
  {
    // Level 4: INSANE - The Production Master
    title: "Botanic Illusion: The Production Master",
    studio_name: 'botanic-illusion',
    client_name: 'Studio Client',
    level_number: 4,
    category: 'textile',
    difficulty: 'free',
    target_role: 'Textile Production Manager / Colorist',
    time_limit_hours: 48,
    xp_reward: 1000,
    season: 'SS26',
    scenario: {
      context: 'Flat-Bed Screen Printing Factory',
      theme: 'Production-Ready Separations',
      difficulty_spike: 'Prepare files for factory production. You need color separations with proper trapping for screen printing.',
    },
    description: 'Create production-ready files with color separations, trapping, and product visualization for factory handoff.',
    constraints: [
      { type: 'technique', label: 'Technical Limit', value: 'Maximum 8 Screens (Colors) allowed', is_required: true },
      { type: 'technique', label: 'Trapping', value: 'Include slight overlap of colors to prevent white gaps', is_required: true },
      { type: 'application', label: 'Application', value: 'Map design onto specific product (Duvet Cover Set or Silk Scarf)', is_required: true },
    ],
    detailed_deliverables: [
      {
        id: 'color-separations',
        name: 'Color Separations (Channels)',
        description: 'PSD file with separate color channels',
        specifications: ['Each color on separate Channel (Spot Colors)', 'Ready for screen engraving', 'Proper trapping applied'],
        file_format: 'PSD',
        required: true,
        category: 'technical',
      },
      {
        id: 'strike-off',
        name: 'Strike-Off Request',
        description: 'Factory instruction document',
        specifications: ['"Use Reactive Dyes for Cotton Sateen"', '"Gold pigment for stamen details"', 'Print paste recipe'],
        required: true,
        category: 'documentation',
      },
      {
        id: '3d-mockup',
        name: '3D Product Mockup',
        description: 'Photorealistic render of final product',
        specifications: ['Bedding Set in room setting', 'Show Main Print + Coordinates interaction', 'Pillow front floral, back geometric'],
        required: true,
        category: 'digital',
      },
    ],
  },
];

// ============================================
// STUDIO 4: NEO-DECO 2026 (Jewelry)
// ============================================

const NEO_DECO: Partial<StyleBoxTemplate>[] = [
  {
    // Level 1: EASY - The Concept Sketch
    title: "Neo-Deco 2026: The Concept Sketch",
    studio_name: 'neo-deco',
    client_name: 'Luxury Client',
    level_number: 1,
    category: 'jewelry',
    difficulty: 'free',
    target_role: 'Jewelry Illustrator / Hand Sketcher',
    time_limit_hours: 4,
    xp_reward: 100,
    season: 'FW26',
    scenario: {
      context: 'Statement Cocktail Ring Design',
      theme: 'Neo-Deco – 1920s geometry meets modern fluidity',
      difficulty_spike: 'Combine the geometric lines of the 1920s with modern, organic fluidity.',
    },
    description: 'Create a concept design for a statement cocktail ring combining Art Deco geometry with contemporary organic forms.',
    constraints: [
      { type: 'stone', label: 'Stone', value: 'Must feature a central "Emerald Cut" stone', is_required: true },
      { type: 'metal', label: 'Metal', value: 'Yellow Gold (18k)', is_required: true },
      { type: 'technique', label: 'Aesthetic', value: 'Clean lines, symmetry, with futuristic twist (floating stones or negative space)', is_required: true },
    ],
    detailed_deliverables: [
      {
        id: 'perspective',
        name: 'Perspective Sketch',
        description: 'Beautiful rendering at 3/4 angle',
        specifications: ['Hand-drawn or digital', '3/4 angle view', 'Show dimensional depth'],
        required: true,
        category: 'illustration',
      },
      {
        id: 'gouache',
        name: 'Gouache Rendering',
        description: 'Colored sketch simulating materials',
        specifications: ['Simulate light reflection on metal', 'Show refraction inside gem', 'Professional presentation quality'],
        required: true,
        category: 'illustration',
      },
    ],
  },
  {
    // Level 2: MEDIUM - The Orthographic Draft
    title: "Neo-Deco 2026: The Orthographic Draft",
    studio_name: 'neo-deco',
    client_name: 'Luxury Client',
    level_number: 2,
    category: 'jewelry',
    difficulty: 'free',
    target_role: 'Technical Jewelry Designer',
    time_limit_hours: 8,
    xp_reward: 250,
    season: 'FW26',
    scenario: {
      context: 'Technical Blueprint for Bench Jeweler',
      theme: 'Precision Documentation',
      difficulty_spike: 'Without exact dimensions, the jeweler cannot create the piece. Translate concept to technical blueprint.',
    },
    description: 'Create technical blueprints with exact measurements for jewelry production.',
    constraints: [
      { type: 'sizing', label: 'Sizing', value: 'US Ring Size 7 (17.3mm diameter)', is_required: true },
      { type: 'stone', label: 'Stone Specs', value: 'Center stone exactly 10mm x 8mm', is_required: true },
      { type: 'sizing', label: 'Shank', value: '2.5mm wide at bottom, tapering to 4mm at shoulders', is_required: true },
    ],
    detailed_deliverables: [
      {
        id: 'ortho-views',
        name: 'Orthographic Views',
        description: 'Technical drawing with three views',
        specifications: ['Top View', 'Side View', 'Front View'],
        required: true,
        category: 'technical',
      },
      {
        id: 'dimensions',
        name: 'Dimension Lines',
        description: 'Callouts with all measurements',
        specifications: ['All thicknesses in millimeters', 'Precise measurements', 'Clear annotation'],
        required: true,
        category: 'technical',
      },
      {
        id: 'cross-section',
        name: 'Cross-Section',
        description: 'Slice view of ring shank',
        specifications: ['Show profile shape', 'D-shape, Comfort fit, or Flat', 'Internal dimensions'],
        required: true,
        category: 'technical',
      },
    ],
  },
  {
    // Level 3: HARD - The 3D CAD & Gemology
    title: "Neo-Deco 2026: The 3D CAD & Gemology",
    studio_name: 'neo-deco',
    client_name: 'Luxury Client',
    level_number: 3,
    category: 'jewelry',
    difficulty: 'free',
    target_role: 'CAD Specialist (Matrix / Rhino / ZBrush)',
    time_limit_hours: 24,
    xp_reward: 500,
    season: 'FW26',
    scenario: {
      context: 'Matching Pendant Necklace',
      theme: 'Photorealistic 3D + Complete Gemology',
      difficulty_spike: 'Client wants a photorealistic preview and precise breakdown of gemstones to approve the budget.',
    },
    description: 'Design a matching pendant with full 3D CAD modeling, photorealistic rendering, and complete gem specification.',
    constraints: [
      { type: 'technique', label: 'Setting Style', value: 'Micro-Pave setting for halo, Prong setting for center', is_required: true },
      { type: 'mechanism', label: 'Mechanism', value: 'Hidden bail (loop for chain) on the back', is_required: true },
      { type: 'format', label: 'Software', value: 'Must be modeled in 3D (Matrix/Rhino/ZBrush)', is_required: true },
    ],
    detailed_deliverables: [
      {
        id: 'render',
        name: 'Photorealistic Render',
        description: 'High-quality image like a photograph',
        specifications: ['KeyShot/V-Ray quality', 'Professional lighting', 'Marketing-ready'],
        required: true,
        category: 'digital',
      },
      {
        id: 'gem-map',
        name: 'Gem Map',
        description: 'Diagram showing every stone position',
        specifications: ['All stone positions numbered', 'Setting style indicated', 'Scale reference'],
        required: true,
        category: 'technical',
      },
      {
        id: 'stone-report',
        name: 'Stone Report',
        description: 'Complete gemstone specification table',
        specifications: ['Center Stone: 1x Emerald Cut (2.5 Carat)', 'Accent Stones: 40x Round Brilliant (1.0mm)', 'Total Carat Weight (TCW)'],
        required: true,
        category: 'documentation',
      },
    ],
  },
  {
    // Level 4: INSANE - The Caster's Bench
    title: "Neo-Deco 2026: The Caster's Bench",
    studio_name: 'neo-deco',
    client_name: 'Luxury Client',
    level_number: 4,
    category: 'jewelry',
    difficulty: 'free',
    target_role: 'Production Manager / Master Jeweler',
    time_limit_hours: 48,
    xp_reward: 1000,
    season: 'FW26',
    scenario: {
      context: '3D Printing & Casting Preparation',
      theme: 'Factory-Ready Production Files',
      difficulty_spike: 'If this file is wrong, the gold casting will fail, costing thousands in wasted metal.',
    },
    description: 'Prepare production-ready files for 3D printing (wax model) and casting with precise metal weight calculations.',
    constraints: [
      { type: 'technique', label: 'Shrinkage', value: 'Scale 3D model up by 3% for metal shrinkage during cooling', is_required: true },
      { type: 'technique', label: 'Sprueing', value: 'Attach "Sprues" (feed channels for molten metal) to 3D model', is_required: true },
      { type: 'sizing', label: 'Weight Calculation', value: 'Estimate final weight in 18k Gold based on model volume', is_required: true },
    ],
    detailed_deliverables: [
      {
        id: 'stl',
        name: 'Print-Ready STL File',
        description: 'Watertight mesh for 3D printer',
        specifications: ['Checked for naked edges', 'Watertight mesh', 'Ready for resin 3D printer'],
        file_format: 'STL',
        required: true,
        category: 'digital',
      },
      {
        id: 'weight-calc',
        name: 'Metal Weight Calculation',
        description: 'Precise gold requirement',
        specifications: ['Volume of Model (e.g., 450 mm³)', 'Specific Gravity of 18k Gold (15.5 g/cm³)', 'Formula: Volume x Density = Final Gram Weight'],
        required: true,
        category: 'documentation',
      },
      {
        id: 'support-strategy',
        name: 'Support Structure Strategy',
        description: 'Screenshot of print support setup',
        specifications: ['Show supports during 3D printing', 'Prevent warping', 'Easy removal planning'],
        required: true,
        category: 'technical',
      },
    ],
  },
];

// ============================================
// EXPORTED CONTENT
// ============================================

export const ALL_STYLEBOXES: Partial<StyleBoxTemplate>[] = [
  ...BRIDAL_SERIES,
  ...MARIA_B_COLLECTION,
  ...BOTANIC_ILLUSION,
  ...NEO_DECO,
];

export const STUDIOS_INFO: Record<StudioName, { 
  title: string; 
  subtitle: string; 
  description: string;
  category: 'fashion' | 'textile' | 'jewelry';
  client: string;
  color: string;
  icon: string;
}> = {
  'bridal-series': {
    title: 'Bridal Series',
    subtitle: 'Client: Sophia',
    description: 'Factory-ready bridal wear from concept to production. Master the complete journey from romantic sketches to manufacturing specs.',
    category: 'fashion',
    client: 'Sophia',
    color: 'from-rose-500 to-pink-600',
    icon: '💍',
  },
  'maria-b': {
    title: 'Maria B. Collection',
    subtitle: 'Gardens of Andalusia',
    description: 'Luxury Pakistani fusion wear for Spring/Summer 2026. Blend Moorish architecture with Spanish flora in this prestigious collection.',
    category: 'fashion',
    client: 'Maria B.',
    color: 'from-amber-500 to-orange-600',
    icon: '🌸',
  },
  'botanic-illusion': {
    title: 'Botanic Illusion',
    subtitle: 'Textile Studio',
    description: 'Create print-ready textiles for high-street fashion and home. From hero motifs to production-ready color separations.',
    category: 'textile',
    client: 'Studio Client',
    color: 'from-emerald-500 to-teal-600',
    icon: '🌿',
  },
  'neo-deco': {
    title: 'Neo-Deco 2026',
    subtitle: 'Fine Jewelry Studio',
    description: 'Design fine jewelry combining Art Deco geometry with modern fluidity. From concept sketches to CAD files ready for casting.',
    category: 'jewelry',
    client: 'Luxury Client',
    color: 'from-violet-500 to-purple-600',
    icon: '💎',
  },
};

export function getStyleBoxesByStudio(studio: StudioName): Partial<StyleBoxTemplate>[] {
  return ALL_STYLEBOXES.filter(sb => sb.studio_name === studio);
}

export function getStyleBoxByLevel(studio: StudioName, level: LevelNumber): Partial<StyleBoxTemplate> | undefined {
  return ALL_STYLEBOXES.find(sb => sb.studio_name === studio && sb.level_number === level);
}
