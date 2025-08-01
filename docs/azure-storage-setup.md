# Implementing Azure Blob Storage for Images

This document provides instructions for setting up and using Azure Blob Storage for your e-commerce product images.

## Prerequisites

1. An Azure account with an active subscription
2. Azure Storage account created

## Step 1: Set up your Azure Storage Account

1. Sign in to the [Azure Portal](https://portal.azure.com)
2. Create a new Storage Account:
   - Click "Create a resource"
   - Search for "Storage account"
   - Click "Create"
   - Fill in the required fields
   - Create a new container named "product-images"

## Step 2: Get your connection details

From your storage account:

1. Go to "Access keys" in the left sidebar
2. Copy the connection string
3. Note your storage account name

## Step 3: Update your .env file

Update your `.env` file with the real values:

```
AZURE_STORAGE_CONNECTION_STRING="your-connection-string-from-azure"
AZURE_STORAGE_ACCOUNT_NAME="your-storage-account-name"
AZURE_STORAGE_CONTAINER_NAME="product-images"
```

## Step 4: Using the Azure Storage features

The application has built-in support for:

1. Uploading images to Azure Blob Storage (Admin dashboard)
2. Listing images from the container
3. Deleting images from the container
4. Selecting images for products and categories

Once your `.env` file is updated with the correct values, the application will automatically start using Azure Blob Storage instead of local image paths.
