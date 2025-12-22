const REDIRECT_KEY = "auth_redirect_url";

export function setRedirectUrl(url: string) {
  if (typeof window !== "undefined") {
    sessionStorage.setItem(REDIRECT_KEY, url);
  }
}

export function getRedirectUrl(): string | null {
  if (typeof window !== "undefined") {
    return sessionStorage.getItem(REDIRECT_KEY);
  }
  return null;
}

export function clearRedirectUrl() {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem(REDIRECT_KEY);
  }
}

export function getPostAuthRedirect(fallback: string = "/dashboard"): string {
  const stored = getRedirectUrl();
  clearRedirectUrl();
  return stored || fallback;
}