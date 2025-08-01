const { BlobServiceClient } = require('@azure/storage-blob');
require('dotenv').config();

async function testConnection() {
  console.log('Testing connection with current settings...');
  console.log('Account Name:', process.env.AZURE_STORAGE_ACCOUNT_NAME);
  console.log('Container Name:', process.env.AZURE_STORAGE_CONTAINER_NAME);
  
  // Check if connection string is properly formatted
  const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
  console.log('Connection String Format:', connectionString ? 'Present' : 'Missing');
  
  if (connectionString) {
    // Parse connection string to check components
    const parts = connectionString.split(';');
    parts.forEach(part => {
      if (part.startsWith('AccountName=') || part.startsWith('AccountKey=') || part.startsWith('DefaultEndpointsProtocol=')) {
        console.log('Connection part:', part.split('=')[0] + '=***');
      }
    });
  }

  try {
    const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
    
    // Test 1: List containers
    console.log('\n--- Test 1: Listing containers ---');
    const containerIterator = blobServiceClient.listContainers();
    const containers = [];
    for await (const container of containerIterator) {
      containers.push(container.name);
    }
    console.log('Available containers:', containers);
    
    // Test 2: Check specific container
    console.log('\n--- Test 2: Checking ecommerce container ---');
    const containerClient = blobServiceClient.getContainerClient('ecommerce');
    const exists = await containerClient.exists();
    console.log('Container exists:', exists);
    
    if (exists) {
      // Test 3: Check container properties
      const properties = await containerClient.getProperties();
      console.log('Container public access:', properties.blobPublicAccess || 'none');
    }
    
    console.log('\n✅ All tests passed! Azure Blob Storage is working.');
    
  } catch (error) {
    console.log('\n❌ Connection failed:', error.message);
    
    if (error.code === 'AuthenticationFailed') {
      console.log('\n🔧 Troubleshooting suggestions:');
      console.log('1. Verify the account key is correct');
      console.log('2. Check the storage account name is "delivery"');
      console.log('3. Ensure the connection string format is correct');
      console.log('4. Make sure the storage account exists and is accessible');
    }
  }
}

testConnection();
