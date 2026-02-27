import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname === '/favicon.ico' ||
    pathname === '/' ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/register') ||
    pathname.startsWith('/url') ||
    pathname.startsWith('/serverUn') ||
    pathname === '/not-found'
  ) {
    return NextResponse.next();
  }
  
  const shortCode = pathname.substring(1);
  
  const shortCodePattern = /^[a-zA-Z0-9]{6,10}$/;
  
  if (shortCodePattern.test(shortCode)) {
    const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/${shortCode}`;
    
    try {
      const response = await fetch(backendUrl, {
        method: 'GET',
        redirect: 'manual',
        headers: {
          'Accept': 'application/json, text/html',
          'User-Agent': 'NextJS-Middleware',
        },
      });
      
      console.log(`[Middleware] Short code: ${shortCode}, Status: ${response.status}`);
      
      if (response.status === 302 || response.status === 301 || response.status === 307 || response.status === 308) {
        const location = response.headers.get('location');
        
        if (location) {
          console.log(`[Middleware] Redirecting to: ${location}`);
          return NextResponse.redirect(location, response.status);
        } else {
          console.error(`[Middleware] No location header found for ${shortCode}`);
          const url = request.nextUrl.clone();
          url.pathname = '/not-found';
          url.searchParams.set('code', shortCode);
          return NextResponse.rewrite(url);
        }
      }
      
      if (response.status === 404) {
        console.log(`[Middleware] Short code not found: ${shortCode}`);
        const url = request.nextUrl.clone();
        url.pathname = '/not-found';
        url.searchParams.set('code', shortCode);
        return NextResponse.rewrite(url);
      }
      
      if (response.status >= 400) {
        console.error(`[Middleware] Backend error ${response.status} for ${shortCode}`);
        
        try {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            console.log('[Middleware] Error response:', data);
          }
        } catch (e) {
        }
        
        const url = request.nextUrl.clone();
        url.pathname = '/not-found';
        url.searchParams.set('code', shortCode);
        return NextResponse.rewrite(url);
      }
      
      if (response.status === 200) {
        console.warn(`[Middleware] Unexpected 200 OK for ${shortCode}`);
        const url = request.nextUrl.clone();
        url.pathname = '/not-found';
        url.searchParams.set('code', shortCode);
        return NextResponse.rewrite(url);
      }
      
    } catch (error) {
      console.error(`[Middleware] Fetch error for ${shortCode}:`, error);
      
      const url = request.nextUrl.clone();
      url.pathname = '/not-found';
      url.searchParams.set('code', shortCode);
      return NextResponse.rewrite(url);
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api routes
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|api).*)',
  ],
};