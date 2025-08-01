import { NextRequest, NextResponse } from 'next/server';

// This route handles requests for missing image files by serving a tiny transparent GIF
export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  // Create a tiny transparent GIF
  const transparentGif = Buffer.from(
    'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
    'base64'
  );
  
  // Determine what type of image it is based on the path
  // This lets us log which images are being requested but not found
  const path = params.path ? params.path.join('/') : 'unknown';
  console.log(`Serving placeholder for missing image: /images/${path}`);
  
  // Return the transparent gif
  return new NextResponse(transparentGif, {
    headers: {
      'Content-Type': 'image/gif',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
