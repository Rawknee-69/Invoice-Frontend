/**
 * Gets the appropriate image URL, using proxy for Google images if needed
 */
export function getImageUrl(
  imageUrl: string | null | undefined
): string | null {
  if (!imageUrl) return null;

  // If it's a Google profile image, use our proxy to avoid CORS issues
  if (imageUrl.startsWith("https://lh3.googleusercontent.com/")) {
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
    return `${apiUrl}/api/proxy/google-image?url=${encodeURIComponent(imageUrl)}`;
  }

  // For other images, return as-is
  return imageUrl;
}
