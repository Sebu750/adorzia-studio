import { request } from 'http';

const designerIds = [
  'c22f79a6-0fa2-4f3e-ad3c-a647e7eab39d',
  'b2c92b0f-cc1e-423c-ba2f-ce22a70b7099'
];

async function testDesignerPage(id) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 8080,
      path: `/shop/designer/${id}`,
      method: 'GET',
      timeout: 5000
    };

    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        // Check if the page contains designer-specific content
        const hasDesignerContent = data.includes('Designer Not Found') || 
                                  data.includes('designer-profile') || 
                                  data.includes('designer-products') ||
                                  data.includes('Our Designers');
        
        resolve({
          id,
          statusCode: res.statusCode,
          hasDesignerContent,
          contentLength: data.length
        });
      });
    });

    req.on('error', (error) => {
      reject({ id, error: error.message });
    });

    req.on('timeout', () => {
      req.destroy();
      reject({ id, error: 'Request timeout' });
    });

    req.end();
  });
}

async function runTests() {
  console.log('Testing designer pages...\n');
  
  for (const id of designerIds) {
    try {
      const result = await testDesignerPage(id);
      console.log(`Designer ${id}:`);
      console.log(`  Status: ${result.statusCode}`);
      console.log(`  Has designer content: ${result.hasDesignerContent}`);
      console.log(`  Content length: ${result.contentLength} bytes`);
      console.log('');
    } catch (error) {
      console.log(`Designer ${id}: ERROR - ${error.error}`);
      console.log('');
    }
  }
}

runTests();