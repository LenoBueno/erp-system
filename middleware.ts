import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Remover cabeçalhos problemáticos
  // response.headers.set('Content-Encoding', 'gzip');
  // response.headers.set('Content-Type', 'application/gzip');

  // Cache
  response.headers.set('Cache-Control', 'public, max-age=31536000');
  response.headers.set('Vary', 'Accept-Encoding');

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
