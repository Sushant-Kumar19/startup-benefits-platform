import { NextRequest, NextResponse } from 'next/server';

// Backend base URL (no /api suffix) – used only for server-side proxy
const BACKEND_BASE = process.env.BACKEND_URL || 'http://localhost:4000';

export async function GET(
  request: NextRequest,
  { params }: { params: { path?: string[] } }
) {
  return proxy(request, params.path || [], 'GET');
}

export async function POST(
  request: NextRequest,
  { params }: { params: { path?: string[] } }
) {
  return proxy(request, params.path || [], 'POST');
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { path?: string[] } }
) {
  return proxy(request, params.path || [], 'PUT');
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { path?: string[] } }
) {
  return proxy(request, params.path || [], 'PATCH');
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { path?: string[] } }
) {
  return proxy(request, params.path || [], 'DELETE');
}

async function proxy(
  request: NextRequest,
  pathSegments: string[],
  method: string
) {
  const path = pathSegments.length ? pathSegments.join('/') : '';
  const url = `${BACKEND_BASE.replace(/\/$/, '')}/api/${path}`;
  const search = request.nextUrl.search;
  const fullUrl = search ? `${url}${search}` : url;

  const headers: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    const k = key.toLowerCase();
    if (k !== 'host' && k !== 'connection' && k !== 'content-length') {
      headers[key] = value;
    }
  });

  let body: string | undefined;
  try {
    body = await request.text();
  } catch {
    // no body
  }
  // Re-set Content-Length for backend when we have a body (some servers expect it)
  if (body && body.length > 0) {
    headers['content-length'] = String(Buffer.byteLength(body, 'utf8'));
  }

  try {
    const res = await fetch(fullUrl, {
      method,
      headers,
      body: body || undefined,
    });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error('API proxy error:', err);
    return NextResponse.json(
      { message: 'Unable to reach the server. Is the backend running on port 4000?' },
      { status: 502 }
    );
  }
}
