-- Seed 3 Example StyleBoxes for Fashion Designers
INSERT INTO public.styleboxes (
  title, 
  description, 
  difficulty, 
  category, 
  status, 
  xp_reward, 
  archetype, 
  mutation, 
  restrictions, 
  manifestation, 
  adorzia_deliverables,
  collection_line,
  market_context,
  is_featured
) VALUES 
(
  'Cyber-Kimono Reconstruction',
  'Redefine the traditional kimono silhouette using neo-technical materials and modular assembly techniques.',
  'medium',
  'fashion',
  'active',
  250,
  jsonb_build_object(
    'silhouette', 'Modular',
    'rationale', 'The kimono serves as the commercial constant due to its timeless appeal and geometric efficiency. It provides a stable base for technical experimentation while maintaining cultural resonance.',
    'anchor_image', 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&q=80&w=800'
  ),
  jsonb_build_object(
    'concept', 'Crystallography & Circuitry',
    'directive', 'Disrupt the soft drape of the kimono with rigid, crystalline paneling and integrated LED paths. The mutation should feel like an organic growth of technology over tradition.',
    'moodboard', jsonb_build_array(
      jsonb_build_object('id', 'm1', 'url', 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=400'),
      jsonb_build_object('id', 'm2', 'url', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=400')
    )
  ),
  jsonb_build_object(
    'points', jsonb_build_array(
      jsonb_build_object('id', 'r1', 'type', 'Substrate', 'label', 'Technical Silk', 'details', 'Must use a hybrid silk-nylon blend for the base panels.', 'isOpen', false),
      jsonb_build_object('id', 'r2', 'type', 'Protocol', 'label', 'Zero-Waste Patterning', 'details', 'The cutting layout must achieve at least 95% fabric utilization.', 'isOpen', false)
    ),
    'tolerances', jsonb_build_object('max_weight', '1.5', 'max_cost', '350')
  ),
  jsonb_build_object(
    'prompt', 'Design a modular Cyber-Kimono that can be disassembled into 4 distinct wearable components. Focus on the intersection of traditional flat-pattern cutting and futuristic hard-surface modeling.'
  ),
  jsonb_build_array(
    jsonb_build_object('id', 'd1', 'name', 'Modular Pattern Key', 'file_type', 'PDF', 'description', 'A detailed breakdown of all components and assembly instructions.', 'required', true),
    jsonb_build_object('id', 'd2', 'name', '3D Assembly Render', 'file_type', 'OBJ/GLB', 'description', 'A high-fidelity 3D model of the assembled garment.', 'required', true),
    jsonb_build_object('id', 'd3', 'name', 'Material Swatch Map', 'file_type', 'JPG', 'description', 'High-res scans of the proposed technical fabrics.', 'required', false)
  ),
  'Signature Series: APEX',
  'Avant-Garde Pret',
  true
),
(
  'Exoskeletal Evening Wear',
  'Explore the tension between fluid silk draping and 3D-printed structural supports in high-couture evening wear.',
  'hard',
  'fashion',
  'active',
  500,
  jsonb_build_object(
    'silhouette', 'Empire',
    'rationale', 'The high-waisted Empire silhouette provides a clear architectural divide, allowing for a distinct separation between the fluid skirt and the structured bodice.',
    'anchor_image', 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=800'
  ),
  jsonb_build_object(
    'concept', 'Skeletal Ossification',
    'directive', 'Mutate the bodice into a 3D-printed exoskeleton that mimics vertebrate structures. The transition from bone-like rigidity to fabric fluidity must be seamless.',
    'moodboard', jsonb_build_array(
      jsonb_build_object('id', 'm3', 'url', 'https://images.unsplash.com/photo-153218787560d-1e9ad8499270?auto=format&fit=crop&q=80&w=400'),
      jsonb_build_object('id', 'm4', 'url', 'https://images.unsplash.com/photo-1551033406-611cf9a28f67?auto=format&fit=crop&q=80&w=400')
    )
  ),
  jsonb_build_object(
    'points', jsonb_build_array(
      jsonb_build_object('id', 'r3', 'type', 'Protocol', 'label', '3D Print Thickness', 'details', 'Exoskeletal elements must not exceed 4mm in thickness.', 'isOpen', false),
      jsonb_build_object('id', 'r4', 'type', 'Substrate', 'label', 'Bio-Acetate', 'details', 'Structural components must be printed in biodegradable acetate.', 'isOpen', false)
    ),
    'tolerances', jsonb_build_object('max_weight', '2.2', 'max_cost', '1200')
  ),
  jsonb_build_object(
    'prompt', 'Create an evening gown that utilizes a 3D-printed spine to support over 10 meters of silk chiffon. Show how the hardware integrates with the software of fashion.'
  ),
  jsonb_build_array(
    jsonb_build_object('id', 'd4', 'name', '3D Print Files', 'file_type', 'OBJ/GLB', 'description', 'Print-ready files for the exoskeletal bodice.', 'required', true),
    jsonb_build_object('id', 'd5', 'name', 'Draping Documentation', 'file_type', 'MP4', 'description', 'Video demonstrating the flow and attachment of the fabric.', 'required', true)
  ),
  'Signature Series: APEX',
  'Haute Couture'
),
(
  'Kinetic Streetwear V1',
  'Designing garments that react to movement through pneumatic expansion and mechanical joints.',
  'insane',
  'fashion',
  'active',
  1000,
  jsonb_build_object(
    'silhouette', 'Asymmetrical',
    'rationale', 'Asymmetry allows for the placement of kinetic elements without the burden of balance, emphasizing the dynamic nature of the garment.',
    'anchor_image', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800'
  ),
  jsonb_build_object(
    'concept', 'Pneumatic Breath',
    'directive', 'Implement a series of inflatable cells within the garment that react to the wearer''s heart rate or movement speed, changing the silhouette in real-time.',
    'moodboard', jsonb_build_array(
      jsonb_build_object('id', 'm5', 'url', 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=400'),
      jsonb_build_object('id', 'm6', 'url', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400')
    )
  ),
  jsonb_build_object(
    'points', jsonb_build_array(
      jsonb_build_object('id', 'r5', 'type', 'Protocol', 'label', 'Pneumatic Routing', 'details', 'Air channels must be integrated into the seams without adding bulk.', 'isOpen', false),
      jsonb_build_object('id', 'r6', 'type', 'Substrate', 'label', 'Heat-Sealable TPU', 'details', 'All inflatable cells must use medical-grade TPU.', 'isOpen', false)
    ),
    'tolerances', jsonb_build_object('max_weight', '3.5', 'max_cost', '2500')
  ),
  jsonb_build_object(
    'prompt', 'Engineer a kinetic jacket that "breathes" as the wearer walks. Combine soft-robotics with technical outerwear construction.'
  ),
  jsonb_build_array(
    jsonb_build_object('id', 'd6', 'name', 'Pneumatic Schematic', 'file_type', 'PDF', 'description', 'Detailed routing diagram for the air cells.', 'required', true),
    jsonb_build_object('id', 'd7', 'name', 'Kinetic Prototype Video', 'file_type', 'MP4', 'description', 'Video showing the inflation/deflation cycle.', 'required', true),
    jsonb_build_object('id', 'd8', 'name', 'Source Construction File', 'file_type', 'AI/PSD', 'description', 'Master pattern with tech pack integration.', 'required', true)
  ),
  'Signature Series: APEX',
  'RTW'
);
