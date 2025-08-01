const { ContainerClient } = require('@azure/storage-blob');

async function testDirectURL() {
  console.log('Testing with the exact URL from Azure...');
  
  try {
    // Use the exact URL provided by Azure
    const containerUrl = 'https://delivery.blob.core.windows.net/ecommerce?sp=racwdl&st=2025-08-01T07:26:55Z&se=2025-08-01T15:41:55Z&spr=https&sv=2024-11-04&sr=c&sig=aIrFzN47PqTxegOgIHWcBFWztKIdgyY0TQ7yQw0rTHY%3D';
    
    console.log('Using URL:', containerUrl.substring(0, 50) + '...');
    
    const containerClient = new ContainerClient(containerUrl);
    
    // Test 1: Check if container exists
    console.log('\n--- Test 1: Checking container exists ---');
    const exists = await containerClient.exists();
    console.log('Container exists:', exists);
    
    if (exists) {
      // Test 2: List blobs
      console.log('\n--- Test 2: Listing blobs ---');
      const blobIterator = containerClient.listBlobsFlat();
      const blobs = [];
      let count = 0;
      for await (const blob of blobIterator) {
        blobs.push(blob.name);
        count++;
        if (count >= 5) break;
      }
      console.log(`Found ${count} blobs:`, count > 0 ? blobs : 'None');
      
      // Test 3: Upload test file
      console.log('\n--- Test 3: Testing upload ---');
      const testFileName = `test-${Date.now()}.txt`;
      const testContent = 'Azure Blob Storage test upload';
      const blockBlobClient = containerClient.getBlockBlobClient(testFileName);
      
      await blockBlobClient.upload(testContent, testContent.length, {
        blobHTTPHeaders: {
          blobContentType: 'text/plain',
        },
      });
      
      console.log('✅ Upload successful!');
      console.log('File URL:', blockBlobClient.url);
      
      // Verify and clean up
      const uploadExists = await blockBlobClient.exists();
      console.log('File exists after upload:', uploadExists);
      
      await blockBlobClient.delete();
      console.log('✅ Test file deleted');
    }
    
    console.log('\n🎉 Azure Blob Storage is working perfectly!');
    
  } catch (error) {
    console.log('\n❌ Test failed:', error.message);
    console.log('Error code:', error.code);
    console.log('Status code:', error.statusCode);
    
    // Log more details for debugging
    if (error.details) {
      console.log('Error details:', error.details);
    }
  }
}

testDirectURL();
