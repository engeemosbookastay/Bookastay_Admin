// Default homepage-carousel captions — mirrors DEFAULT_IMAGES in the customer
// app (Frontend/src/Pages/Hero.jsx). The actual default PHOTOS are bundled into
// the customer build (src/assets), so they have no shareable URL the admin can
// show — only their wording lives here. This powers the editor's "Start from
// default captions" button: it lays out the current slide wording so the owner
// only needs to upload a photo into each slide. url is intentionally empty.
export const DEFAULT_CAROUSEL = [
  { url: '', caption: 'Engeemos Bookastay', subtitle: 'Hosting Temporary Stay In Exotic Style' },
  { url: '', caption: 'Modern Interiors', subtitle: 'Designed For Your Comfort' },
  { url: '', caption: 'Peaceful Retreats', subtitle: 'Your Home Away From Home' },
  { url: '', caption: 'Luxury Living Spaces', subtitle: 'Where Comfort Meets Elegance' },
  { url: '', caption: 'Elegant Dining', subtitle: 'Create Memorable Moments' },
  { url: '', caption: 'Cozy Bedrooms', subtitle: 'Restful Sleep Awaits' },
];
