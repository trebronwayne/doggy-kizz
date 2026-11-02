/**
 * EDITABLE WEBSITE CONTENT — Doggy Kizz
 * Update approved wording, photos, social links, song links and contact details here.
 * Before launch, ask Doggy Kizz to review the biography, genres, location line, photos and every link.
 */

// Builds a URL for a file in /public that works on any host path (local, GitHub Pages project site, custom domain).
const asset = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;

import { songs } from './catalog';

function fromCatalog(id) {
  const song = songs.find((item) => item.id === id);
  const version = song.versions[0];
  return { id, title: song.title, year: '', href: `https://www.youtube.com/watch?v=${version.id}`, youtubeId: version.id, cover: '', credit: song.feat ? `ft. ${song.feat}` : '' };
}

export const siteContent = {
  artistName: 'Doggy Kizz',
  artistTagline: 'Born Street.',
  heroEyebrow: 'UGANDAN RECORDING ARTIST',
  heroText: 'Born Street. New music out now.',
  heroKicker: 'NEW RELEASE OUT NOW',
  locationLine: 'Uganda',
  // Drop his approved photos into public/images using these names (see public/images/README.txt).
  // Until a file exists the site shows a neat "DK" placeholder instead, so nothing looks broken.
  images: {
    hero: asset('images/dk-hero.webp'),
    heroCutout: asset('images/dk-cutout-hero.webp'),
    aboutCutout: asset('images/dk-cutout-about.webp'),
    about: asset('images/dk-about.webp'),
  },
  // Only photos that exist are shown; with none, the gallery stays hidden.
  // Tags create the filter buttons (Shows, Portraits).
  gallery: [
    { src: asset('images/dk-hero.webp'), alt: 'Doggy Kizz studio portrait', caption: 'Studio portrait', tag: 'Portraits' },
    { src: asset('images/dk-about.webp'), alt: 'Doggy Kizz portrait', caption: 'Portrait', tag: 'Portraits' },
    { src: asset('images/dk-portrait-1.webp'), alt: 'Doggy Kizz with the crew at night', caption: 'With the crew', tag: 'Moments' },
    { src: asset('images/dk-portrait-2.webp'), alt: 'Doggy Kizz with a friend in the garden', caption: 'Together', tag: 'Moments' },
    { src: asset('images/dk-portrait-3.webp'), alt: 'Doggy Kizz portrait', caption: 'Portrait', tag: 'Portraits' },
    { src: asset('images/dk-show-1.webp'), alt: 'Doggy Kizz performing live', caption: 'Live on stage', tag: 'Shows' },
    { src: asset('images/dk-show-2.webp'), alt: 'Doggy Kizz on stage with the crowd', caption: 'The crowd', tag: 'Shows' },
    { src: asset('images/dk-show-3.webp'), alt: 'Doggy Kizz at a show', caption: 'Show night', tag: 'Shows' },
  ],
  aboutTitle: 'Born Street.',
  // PLACEHOLDER biography: replace with wording Doggy Kizz has approved.
  biography: 'Doggy Kizz is a Ugandan recording artist whose sound moves between Afrobeat, trap and gospel. His single “Luyala” is on Apple Music, and songs such as Gweyo Myel, Ki Matifali, Bond 7 and Rwot Yap Wiya are on his official YouTube channel, Doggy Kizz Official.',
  genres: ['Afrobeat', 'Trap', 'Gospel'],
  // Upcoming shows. Leave empty to show a friendly "no dates yet" message.
  // Example: { date: '2026-12-20', title: 'Live set', venue: 'Venue name', city: 'Gulu', href: 'https://...' }
  shows: [],
  // Optional career highlights for the About page. Leave empty to hide the section.
  // Example: { year: '2026', title: 'Released "AN AYE"', text: 'One short sentence.' }
  milestones: [
    { year: '2025', title: 'Released “Luyala”', text: 'The single is available on Apple Music.' },
    { year: '2026', title: 'Released “AN AYE”', text: 'The new official audio premiered on YouTube.' },
  ],
  youtubeChannel: 'https://www.youtube.com/@doggykizzbornstreet',
  // Apple Music profile (artist page) and his single on it.
  appleMusic: 'https://music.apple.com/ug/artist/doggy-kizz/1789856017',
  appleMusicSingle: { title: 'Luyala', year: '2025', href: 'https://music.apple.com/ug/album/luyala-single/1789856016' },
  // Add Instagram, Facebook or X here once Doggy Kizz confirms the official accounts, e.g.
  // { label: 'Instagram', href: 'https://www.instagram.com/…', short: 'IG' },
  socialLinks: [
    { label: 'Apple Music', href: 'https://music.apple.com/ug/artist/doggy-kizz/1789856017', short: 'AM' },
    { label: 'YouTube', href: 'https://www.youtube.com/@doggykizzbornstreet', short: 'YT' },
    { label: 'TikTok', href: 'https://www.tiktok.com/@doggykizofficial', short: 'TT' },
  ],
  // Latest releases are the three newest songs in src/data/catalog.js (by date), so this list updates itself.
  releases: [...songs].sort((x, y) => y.date.localeCompare(x.date)).slice(0, 3).map((song) => ({
    ...fromCatalog(song.id), kind: 'New release', date: song.date, exact: song.exact,
  })),
  // News posts that ship with the site. Posts added in the admin board (/admin) appear alongside these.
  news: [
    {
      id: 'an-aye-out-now', title: 'AN AYE is out now', date: '2026-10-25',
      body: 'AN AYE, the new official audio from Doggy Kizz, is out now on YouTube.\n\nPress play and let him know what you think.',
      link: '/watch?v=Q-TG2kvDBkw', linkLabel: 'Listen now',
    },
  ],

  videos: [
    { title: 'Kwayo Kisa', subtitle: 'Official music video · ft. Judah Rapknowledge Da Akbar', youtubeId: 'iXHndNyqqcs', href: 'https://www.youtube.com/watch?v=iXHndNyqqcs' },
  ],
  booking: {
    heading: 'Book Doggy Kizz',
    // What promoters can book him for. Shown on the home page and the booking page.
    offers: [
      { title: 'Live shows', text: 'Concerts, festivals, club nights and private events.' },
      { title: 'Features & collaborations', text: 'Verses, hooks and studio sessions with artists and producers.' },
      { title: 'Media & interviews', text: 'Radio, TV, podcasts, press and content shoots.' },
      { title: 'Brand partnerships', text: 'Campaigns, endorsements and promotional appearances.' },
    ],
    steps: [
      { title: 'Send the details', text: 'Date, location, type of event and your budget range.' },
      { title: 'Get a reply', text: 'The team confirms availability and sends terms.' },
      { title: 'Lock the date', text: 'Agree the details and confirm your booking.' },
    ],
    text: 'For bookings, collaborations and media enquiries, message Doggy Kizz on WhatsApp or reach out through his official channels.',
    // Add only a client-approved public booking email.
    email: '',
    // Optional: add a number here to also show a "Call" button. Left empty on purpose (only WhatsApp was supplied).
    phone: '',
    whatsappNumber: '256777714717', // International format, digits only. Used for every WhatsApp button.
  },
};
