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
  locationLine: 'Uganda',
  // Drop his approved photos into public/images using these names (see public/images/README.txt).
  // Until a file exists the site shows a neat "DK" placeholder instead, so nothing looks broken.
  images: {
    hero: asset('images/dk-hero.webp'),
    heroCutout: asset('images/dk-cutout.webp'),
    aboutCutout: asset('images/dk-cutout-about.webp'),
    about: asset('images/dk-about.webp'),
  },
  // Only photos that exist are shown; with none, the gallery stays hidden.
  // Tags create the filter buttons (Shows, Portraits).
  gallery: [
    { src: asset('images/dk-hero.webp'), alt: 'Doggy Kizz portrait', caption: 'Portrait', tag: 'Portraits' },
    { src: asset('images/dk-about.webp'), alt: 'Doggy Kizz portrait', caption: 'Portrait', tag: 'Portraits' },
    { src: asset('images/dk-portrait-1.webp'), alt: 'Doggy Kizz portrait', caption: 'Portrait', tag: 'Portraits' },
    { src: asset('images/dk-portrait-2.webp'), alt: 'Doggy Kizz portrait', caption: 'Portrait', tag: 'Portraits' },
    { src: asset('images/dk-portrait-3.webp'), alt: 'Doggy Kizz portrait', caption: 'Portrait', tag: 'Portraits' },
    { src: asset('images/dk-show-1.webp'), alt: 'Doggy Kizz performing live', caption: 'Live on stage', tag: 'Shows' },
    { src: asset('images/dk-show-2.webp'), alt: 'Doggy Kizz on stage with the crowd', caption: 'The crowd', tag: 'Shows' },
    { src: asset('images/dk-show-3.webp'), alt: 'Doggy Kizz at a show', caption: 'Show night', tag: 'Shows' },
  ],
  aboutTitle: 'Born Street.',
  // PLACEHOLDER biography: replace with wording Doggy Kizz has approved.
  biography: 'Doggy Kizz is a Ugandan recording artist whose music spans trap and gospel. Songs such as Gweyo Myel, Ki Matifali, Bond 7 and Rwot Yap Wiya are on his official YouTube channel, Doggy Kizz Official.',
  genres: ['Trap', 'Gospel'],
  // Upcoming shows. Leave empty to show a friendly "no dates yet" message.
  // Example: { date: '2026-12-20', title: 'Live set', venue: 'Venue name', city: 'Gulu', href: 'https://...' }
  shows: [],
  // Optional career highlights for the About page. Leave empty to hide the section.
  // Example: { year: '2026', title: 'Released "AN AYE"', text: 'One short sentence.' }
  milestones: [],
  youtubeChannel: 'https://www.youtube.com/@doggykizzbornstreet',
  socialLinks: [
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
    text: 'For bookings, collaborations and media enquiries, message Doggy Kizz on WhatsApp or reach out through his official channels.',
    // Add only a client-approved public booking email.
    email: '',
    // Optional: add a number here to also show a "Call" button. Left empty on purpose (only WhatsApp was supplied).
    phone: '',
    whatsappNumber: '256777714717', // International format, digits only. Used for every WhatsApp button.
  },
};
