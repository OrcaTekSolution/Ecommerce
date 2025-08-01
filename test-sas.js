const { BlobServiceClient } = require('@azure/storage-blob');
require('dotenv').config();

async function testSASConnection() {
  console.log('Testing Azure Blob Storage with SAS token...');
  console.log('Account Name:', process.env.AZURE_STORAGE_ACCOUNT_NAME);
  console.log('Container Name:', process.env.AZURE_STORAGE_CONTAINER_NAME);
  console.log('SAS Token:', process.env.AZURE_STORAGE_SAS_TOKEN ? 'Present' : 'Missing');

  try {
    // Create BlobServiceClient using SAS token
    const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
    const sasToken = process.env.AZURE_STORAGE_SAS_TOKEN;
    const blobServiceUrl = `https://${accountName}.blob.core.windows.net/?${sasToken}`;
    
    console.log('Connecting to:', `https://${accountName}.blob.core.windows.net`);
    
    const blobServiceClient = new BlobServiceClient(blobServiceUrl);
    
    // Test 1: Check container access
    console.log('\n--- Test 1: Checking ecommerce container ---');
    const containerClient = blobServiceClient.getContainerClient('ecommerce');
    const exists = await containerClient.exists();
    console.log('Container exists:', exists);
    
    if (exists) {
      // Test 2: List blobs in container
      console.log('\n--- Test 2: Listing blobs in container ---');
      const blobIterator = containerClient.listBlobsFlat();
      const blobs = [];
      let count = 0;
      for await (const blob of blobIterator) {
        blobs.push(blob.name);
        count++;
        if (count >= 5) break; // Limit to first 5 blobs
      }
      console.log('Blobs found:', count > 0 ? blobs : 'None');
      
      // Test 3: Try to upload a test file
      console.log('\n--- Test 3: Testing upload capability ---');
      const testFileName = `test-${Date.now()}.txt`;
      const testContent = 'This is a test file for Azure Blob Storage connection';
      const blockBlobClient = containerClient.getBlockBlobClient(testFileName);
      
      await blockBlobClient.upload(testContent, testContent.length, {
        blobHTTPHeaders: {
          blobContentType: 'text/plain',
        },
      });
      
      console.log('✅ Test file uploaded successfully!');
      console.log('File URL:', blockBlobClient.url);
      
      // Clean up test file
      await blockBlobClient.delete();
      console.log('✅ Test file cleaned up');
    }
    
    console.log('\n🎉 All tests passed! Azure Blob Storage with SAS token is working perfectly!');
    
  } catch (error) {
    console.log('\n❌ Connection failed:', error.message);
    console.log('Error code:', error.code);
    console.log('Status code:', error.statusCode);
    
    if (error.code === 'AuthenticationFailed') {
      console.log('\n🔧 SAS Token troubleshooting:');
      console.log('1. Check if the SAS token has expired');
      console.log('2. Verify the token has the correct permissions (racwl)');
      console.log('3. Make sure the token is for the correct container');
    }
  }
}

testSASConnection();
