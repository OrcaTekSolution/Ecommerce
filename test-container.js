const { ContainerClient } = require('@azure/storage-blob');
require('dotenv').config();

async function testContainerSAS() {
  console.log('Testing direct container access with SAS token...');
  console.log('Account Name:', process.env.AZURE_STORAGE_ACCOUNT_NAME);
  console.log('Container Name:', process.env.AZURE_STORAGE_CONTAINER_NAME);

  try {
    // Create ContainerClient directly with SAS token
    const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
    const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME;
    const sasToken = process.env.AZURE_STORAGE_SAS_TOKEN;
    
    const containerUrl = `https://${accountName}.blob.core.windows.net/${containerName}?${sasToken}`;
    console.log('Container URL:', `https://${accountName}.blob.core.windows.net/${containerName}`);
    
    const containerClient = new ContainerClient(containerUrl);
    
    // Test 1: Check if container exists
    console.log('\n--- Test 1: Checking container exists ---');
    const exists = await containerClient.exists();
    console.log('Container exists:', exists);
    
    if (exists) {
      // Test 2: List blobs in container
      console.log('\n--- Test 2: Listing blobs in container ---');
      try {
        const blobIterator = containerClient.listBlobsFlat();
        const blobs = [];
        let count = 0;
        for await (const blob of blobIterator) {
          blobs.push(blob.name);
          count++;
          if (count >= 5) break;
        }
        console.log(`Found ${count} blobs:`, count > 0 ? blobs : 'None');
      } catch (listError) {
        console.log('List blobs error:', listError.message);
      }
      
      // Test 3: Try to upload a test file
      console.log('\n--- Test 3: Testing upload capability ---');
      try {
        const testFileName = `test-upload-${Date.now()}.txt`;
        const testContent = 'Test upload to Azure Blob Storage with SAS token';
        const blockBlobClient = containerClient.getBlockBlobClient(testFileName);
        
        await blockBlobClient.upload(testContent, testContent.length, {
          blobHTTPHeaders: {
            blobContentType: 'text/plain',
          },
        });
        
        console.log('✅ Upload successful!');
        console.log('File URL:', blockBlobClient.url);
        
        // Test 4: Verify the file exists
        const uploadExists = await blockBlobClient.exists();
        console.log('Uploaded file exists:', uploadExists);
        
        // Clean up
        await blockBlobClient.delete();
        console.log('✅ Test file cleaned up');
        
      } catch (uploadError) {
        console.log('Upload error:', uploadError.message);
        console.log('Error code:', uploadError.code);
      }
    }
    
    console.log('\n🎉 Container SAS test completed successfully!');
    
  } catch (error) {
    console.log('\n❌ Container connection failed:', error.message);
    console.log('Error code:', error.code);
    console.log('Status code:', error.statusCode);
    
    if (error.code === 'AuthorizationFailure') {
      console.log('\n🔧 SAS Token troubleshooting:');
      console.log('1. The SAS token might be for service-level, not container-level');
      console.log('2. Check if permissions include: read, add, create, write, list');
      console.log('3. Verify the token hasn\'t expired');
      console.log('4. Make sure the container name in the token matches "ecommerce"');
    }
  }
}

testContainerSAS();
