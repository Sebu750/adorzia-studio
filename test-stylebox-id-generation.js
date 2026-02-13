const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please check your .env file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testStyleBoxIdGeneration() {
  console.log('Testing StyleBox ID generation...');
  
  // Insert a test StyleBox without specifying display_id (should trigger auto-generation)
  const { data, error } = await supabase
    .from('styleboxes')
    .insert([
      {
        title: 'Test StyleBox for ID Generation',
        description: 'This is a test StyleBox to verify ID generation',
        category: 'fashion',
        difficulty: 'easy',
        status: 'draft',
        xp_reward: 100
      }
    ])
    .select('id, display_id, title')
    .single();

  if (error) {
    console.error('Error creating test StyleBox:', error);
    return;
  }

  console.log('Test StyleBox created successfully!');
  console.log('ID:', data.id);
  console.log('Display ID:', data.display_id);
  console.log('Title:', data.title);

  // Verify that the display_id follows the expected format (ADORZIA-SB-XXX)
  if (data.display_id && /^ADORZIA-SB-\d{3}$/.test(data.display_id)) {
    console.log('✅ SUCCESS: Display ID was auto-generated with correct format:', data.display_id);
  } else {
    console.log('❌ FAILURE: Display ID was not auto-generated correctly');
    console.log('Expected format: ADORZIA-SB-XXX (where XXX is a 3-digit number)');
  }

  // Clean up - delete the test record
  const { error: deleteError } = await supabase
    .from('styleboxes')
    .delete()
    .match({ id: data.id });

  if (deleteError) {
    console.error('Warning: Could not clean up test record:', deleteError);
  } else {
    console.log('✅ Test record cleaned up successfully');
  }
}

// Run the test
testStyleBoxIdGeneration().catch(console.error);