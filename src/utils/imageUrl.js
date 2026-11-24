// Uploaded photos are stored on Cloudinary at full size (phone photos are often
// 7–9 MB each). Ask Cloudinary for a copy resized to the width it's shown at and
// auto-compressed (~100 KB) so photos appear quickly. Non-Cloudinary URLs and
// URLs that already carry a transformation are returned unchanged.
export const sizedImage = (url, width) => {
  if (typeof url !== 'string' || !url.includes('res.cloudinary.com') || !url.includes('/upload/')) return url;
  if (/\/upload\/[^/]*\b(w_|q_auto|f_auto)/.test(url)) return url;
  return url.replace('/upload/', `/upload/f_auto,q_auto,c_limit,w_${width}/`);
};
