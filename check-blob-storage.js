const { BlobServiceClient } = require('@azure/storage-blob');
require('dotenv').config();

async function checkBlobStorage() {
  console.log('🔍 Checking Azure Blob Storage for uploaded images...\n');
  
  try {
    const blobServiceClient = BlobServiceClient.fromConnectionString(
      process.env.AZURE_STORAGE_CONNECTION_STRING
    );
    
    const containerClient = blobServiceClient.getContainerClient(
      process.env.AZURE_STORAGE_CONTAINER_NAME
    );
    
    // List all blobs in the container
    console.log('📂 Container:', process.env.AZURE_STORAGE_CONTAINER_NAME);
    console.log('🌐 Storage Account:', process.env.AZURE_STORAGE_ACCOUNT_NAME);
    console.log('\n📋 Files in blob storage:');
    console.log('═══════════════════════════════════════════════════════════════');
    
    const blobIterator = containerClient.listBlobsFlat({
      includeTags: true,
      includeMetadata: true
    });
    
    let count = 0;
    let totalSize = 0;
    
    for await (const blob of blobIterator) {
      count++;
      const sizeInKB = (blob.properties.contentLength / 1024).toFixed(2);
      totalSize += blob.properties.contentLength;
      
      console.log(`${count}. 📄 ${blob.name}`);
      console.log(`   💾 Size: ${sizeInKB} KB`);
      console.log(`   📅 Last Modified: ${blob.properties.lastModified}`);
      console.log(`   🔗 URL: https://${process.env.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net/${process.env.AZURE_STORAGE_CONTAINER_NAME}/${blob.name}`);
      console.log('   ───────────────────────────────────────────────────────────');
    }
    
    if (count === 0) {
      console.log('❌ No files found in the container');
      console.log('\n💡 This could mean:');
      console.log('   - Images are being uploaded to local storage instead');
      console.log('   - Upload failed silently');
      console.log('   - Wrong container name');
    } else {
      console.log(`\n✅ Found ${count} files in Azure Blob Storage`);
      console.log(`📊 Total size: ${(totalSize / 1024).toFixed(2)} KB`);
    }
    
    // Also check the database to see what URLs are stored
    console.log('\n🗄️  Checking database for image URLs...');
    console.log('═══════════════════════════════════════════════════════════════');
    
  } catch (error) {
    console.log('❌ Error checking blob storage:', error.message);
  }
}

checkBlobStorage();
