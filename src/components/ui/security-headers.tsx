import { useEffect } from 'react';

// Component to set security headers via meta tags
export const SecurityHeaders = () => {
  useEffect(() => {
    // Set Content Security Policy
    const cspMeta = document.createElement('meta');
    cspMeta.httpEquiv = 'Content-Security-Policy';
    cspMeta.content = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://fonts.googleapis.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://ebdtrwkrelzbtjdwuxbk.supabase.co wss://ebdtrwkrelzbtjdwuxbk.supabase.co",
      "media-src 'self' blob:",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'"
    ].join('; ');
    
    // Set X-Frame-Options
    const frameMeta = document.createElement('meta');
    frameMeta.httpEquiv = 'X-Frame-Options';
    frameMeta.content = 'DENY';
    
    // Set X-Content-Type-Options
    const contentTypeMeta = document.createElement('meta');
    contentTypeMeta.httpEquiv = 'X-Content-Type-Options';
    contentTypeMeta.content = 'nosniff';
    
    // Set Referrer Policy
    const referrerMeta = document.createElement('meta');
    referrerMeta.name = 'referrer';
    referrerMeta.content = 'strict-origin-when-cross-origin';
    
    // Add to head
    const head = document.getElementsByTagName('head')[0];
    head.appendChild(cspMeta);
    head.appendChild(frameMeta);
    head.appendChild(contentTypeMeta);
    head.appendChild(referrerMeta);
    
    // Cleanup on unmount
    return () => {
      head.removeChild(cspMeta);
      head.removeChild(frameMeta);
      head.removeChild(contentTypeMeta);
      head.removeChild(referrerMeta);
    };
  }, []);
  
  return null;
};