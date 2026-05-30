export function getPublicAppBaseUrl() {
  const configured = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (configured) return configured.replace(/\/$/, '');

  if (typeof window !== 'undefined') {
    return window.location.origin.replace(/\/$/, '');
  }

  return 'http://localhost:3000';
}

export function getPublicProfileUrl(slug: string) {
  return `${getPublicAppBaseUrl()}/profile/${slug}`;
}
