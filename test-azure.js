const { BlobServiceClient } = require('@azure/storage-blob');

async function testAzureConnection() {
  try {
    const connectionString = "DefaultEndpointsProtocol=https;AccountName=delivery;AccountKey=6QAYo6nW3OOL1A+Roh+O8eMwxWbPEKGV8hvmrxfvNz6o/LJO2FGFo9W3h4oeNdZ6QQSrjI3OcIkc+ASt7mGO+w==;EndpointSuffix=core.windows.net";
    const containerName = "categoryimages";
    
    console.log('Testing Azure Blob Storage connection...');
    
    const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
    const containerClient = blobServiceClient.getContainerClient(containerName);
    
    // Test container exists and access
    const containerExists = await containerClient.exists();
    console.log('Container exists:', containerExists);
    
    if (!containerExists) {
      console.log('Creating container...');
      await containerClient.create({ access: 'blob' });
      console.log('Container created successfully');
    }
    
    // Test upload a small test file
    const testContent = 'Hello Azure Blob Storage!';
    const blobName = `test-${Date.now()}.txt`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    
    console.log('Uploading test file...');
    await blockBlobClient.upload(testContent, testContent.length);
    console.log('Test file uploaded successfully:', blobName);
    
    // Test listing blobs
    console.log('Listing blobs in container:');
    for await (const blob of containerClient.listBlobsFlat()) {
      console.log('- ', blob.name);
    }
    
    // Clean up test file
    await blockBlobClient.delete();
    console.log('Test file deleted');
    
    console.log('✅ Azure Blob Storage connection test completed successfully!');
    
  } catch (error) {
    console.error('❌ Azure Blob Storage connection test failed:');
    console.error('Error details:', error.message);
    console.error('Full error:', error);
  }
}

testAzureConnection();
