import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';

// Connection to Azure Storage
const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING || '';
const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME || 'categoryimages';
const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME || 'delivery';

// Create the BlobServiceClient object
const blobServiceClient = connectionString 
  ? BlobServiceClient.fromConnectionString(connectionString)
  : null;

// Get container client
export const containerClient: ContainerClient | null = blobServiceClient 
  ? blobServiceClient.getContainerClient(containerName)
  : null;

// Upload a file to blob storage
export async function uploadFileToBlob(file: File): Promise<string> {
  if (!containerClient) {
    throw new Error('Azure Storage not configured');
  }

  const blobName = `${Date.now()}-${file.name.replace(/\s/g, '-')}`;
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  
  // Set content type based on file extension
  const contentType = file.type;
  const options = { blobHTTPHeaders: { blobContentType: contentType } };

  // Upload file
  await blockBlobClient.uploadData(await file.arrayBuffer(), options);

  // Get the URL
  return `https://${accountName}.blob.core.windows.net/${containerName}/${blobName}`;
}

// Upload buffer data to blob storage
export async function uploadBufferToBlob(fileName: string, buffer: Buffer, contentType: string): Promise<string> {
  if (!containerClient) {
    throw new Error('Azure Storage not configured');
  }

  const blobName = `${Date.now()}-${fileName.replace(/\s/g, '-')}`;
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  
  const options = { blobHTTPHeaders: { blobContentType: contentType } };

  // Upload buffer
  await blockBlobClient.uploadData(buffer, options);

  // Get the URL
  return `https://${accountName}.blob.core.windows.net/${containerName}/${blobName}`;
}

// Delete a blob from storage
export async function deleteBlobImage(blobName: string): Promise<void> {
  if (!containerClient) {
    throw new Error('Azure Storage not configured');
  }

  // Extract blob name from URL
  const url = new URL(blobName);
  const pathParts = url.pathname.split('/');
  const name = pathParts[pathParts.length - 1];

  const blockBlobClient = containerClient.getBlockBlobClient(name);
  await blockBlobClient.delete();
}

// List all blobs in the container
export async function listBlobs(): Promise<string[]> {
  if (!containerClient) {
    throw new Error('Azure Storage not configured');
  }

  const blobs: string[] = [];
  
  // List all blobs in the container
  for await (const blob of containerClient.listBlobsFlat()) {
    blobs.push(`https://${accountName}.blob.core.windows.net/${containerName}/${blob.name}`);
  }

  return blobs;
}
