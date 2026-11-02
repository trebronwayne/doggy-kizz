import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import {
  ArrowRight, ArrowUpRight, Play, Disc3, Headphones,
  Globe2, Mic2, Mail, Smartphone, CalendarDays, MapPin, Copy, Check, Send, Phone, Download
} from 'lucide-react';
import SiteLayout, { SocialLinks, BrandIcon } from './components/SiteLayout';
import { siteContent as content } from './data/siteContent';
import { Countdown, useAvailableImages } from './components/Dynamic';
import ThemeToggle from './components/ThemeToggle';
import { Catalog, LatestRelease, LivePerformances, MostWatched } from './components/Catalog';
import { songs as catalogSongs } from './data/catalog';
import { watchPath } from './lib/tracks';
const WatchPage = lazy(() => import('./components/Watch'));
const AdminPage = lazy(() => import('./admin/Admin'));
import { NewsList, SubscribeForm } from './components/Cms';
import { cmsEnabled, useCms } from './lib/cms';
import { useImageSrc } from './lib/images';

function Photo({ src, alt, className = '', fallback = 'DK' }) {
  const [current, onError] = useImageSrc(src);
  const showFallback = !current;
  return (
    <div className={`photo-frame ${className}`} {...(showFallback ? { role: 'img', 'aria-label': alt } : {})}>
      {!showFallback ? <img src={current} alt={alt} decoding="async" onError={onError} /> : null}
      {showFallback && <div className="photo-fallback" aria-hidden="true"><span>{fallback}</span></div>}
    </div>
  );
}

/* Cut-out portrait on a soft tinted disc. Falls back to the framed photo if the cut-out file is missing. */
function CutoutPortrait({ cutout, photo, alt, tint = 'red', className = '', fallback = 'DK' }) {
  const items = useMemo(() => [{ src: cutout }], [cutout]);
  const found = useAvailableImages(items);
  if (found === null) return <div className={`cutout-stage ${className}`} aria-hidden="true" />;
  if (found.length === 0) return <Photo src={photo} alt={alt} className={className} fallback={fallback} />;
  return (
    <div className={`cutout-stage cutout-stage--${tint} ${className}`}>
      <div className="cutout-disc" aria-hidden="true" />
      <img className="cutout-img" src={found[0].src} alt={alt} loading="lazy" decoding="async" />
    </div>
  );
}

function SectionHeading({ eyebrow, title, text, action, to }) {
  return <div className="section-heading"><div><p className="eyebrow">{eyebrow}</p><h2>{title}</h2>{text && <p className="section-intro">{text}</p>}</div>{action && <Link className="text-link" to={to}>{action}<ArrowUpRight size={16} /></Link>}</div>;
}

function VideoFeature({ video, large = false }) {
  return (
    <article className={`video-feature ${large ? 'video-feature--large' : ''}`}>
      <div className="video-embed">
        <Link className="video-facade" to={watchPath(video.youtubeId)} aria-label={`Play ${video.title}`}>
          <img src={`${import.meta.env.BASE_URL}covers/${video.youtubeId}.webp`} alt="" loading="lazy" decoding="async" onError={(event) => { const img = event.currentTarget; if (!img.dataset.fallback) { img.dataset.fallback = '1'; img.src = `https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`; } }} />
          <span className="video-facade-play"><Play size={26} fill="currentColor" /></span>
          <span className="video-facade-note">Press play · opens the player page</span>
        </Link>
      </div>
      <div className="video-meta"><div><p className="eyebrow">{video.subtitle}</p><h3>{video.title}</h3></div><a href={video.href} target="_blank" rel="noreferrer" aria-label={`Open ${video.title} on YouTube`}><ArrowUpRight size={18} /></a></div>
    </article>
  );
}

const whatsappUrl = (text) => {
  const number = content.booking.whatsappNumber.replace(/\D/g, '');
  return number.length > 5 ? `https://wa.me/${number}${text ? `?text=${encodeURIComponent(text)}` : ''}` : null;
};
const offerIcons = [Mic2, Disc3, Globe2, Headphones];

function BookingStrip({ showOffers = false }) {
  const wa = whatsappUrl('Hello, I would like to book Doggy Kizz.');
  return (
    <section className="booking-strip booking-promo">
      <div className="wrap">
        <div className="booking-strip-inner">
          <div>
            <p className="eyebrow">BOOKINGS · COLLABORATIONS · MEDIA</p>
            <h2>{content.booking.heading} for your next event.</h2>
            <p>{content.booking.text}</p>
          </div>
          <div className="booking-promo-actions">
            {wa && <a className="button button--accent button--lg" href={wa} target="_blank" rel="noreferrer"><BrandIcon name="WhatsApp" size={18} /> Book on WhatsApp</a>}
            <Link to="/booking" className="button button--outline button--lg">Send an enquiry <ArrowUpRight size={17} /></Link>
          </div>
        </div>
        {showOffers && <ul className="offer-grid">{content.booking.offers.map((offer, i) => { const Icon = offerIcons[i % offerIcons.length]; return <li key={offer.title}><span className="offer-icon"><Icon size={20} aria-hidden="true" /></span><b>{offer.title}</b><small>{offer.text}</small></li>; })}</ul>}
      </div>
    </section>
  );
}

function formatShowDate(value) {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return { day: '—', month: value || 'TBA' };
  return { day: String(date.getDate()).padStart(2, '0'), month: date.toLocaleString('en-GB', { month: 'short' }).toUpperCase() };
}

const showPhotos = content.gallery.filter((item) => item.tag === 'Shows');
const dayStart = (value) => new Date(`${value}T00:00:00`).getTime();

function ShowRow({ show }) {
  const { day, month } = formatShowDate(show.date);
  return (
    <li className="show-row">
      <span className="show-date"><b>{day}</b><small>{month}</small></span>
      <div className="show-info"><h3>{show.title}</h3><p><MapPin size={14} aria-hidden="true" /> {[show.venue, show.city].filter(Boolean).join(' · ')}</p></div>
      {show.href && <a className="button button--soft" href={show.href} target="_blank" rel="noreferrer">Details <ArrowUpRight size={16} /></a>}
    </li>
  );
}

function Shows() {
  const photos = useAvailableImages(showPhotos);
  const photo = photos && photos[0];
  const photoStyle = photo ? { '--photo': `url(${photo.src})` } : undefined;
  const today = new Date().setHours(0, 0, 0, 0);
  const managed = useCms('shows', 'published').items
    .filter((show) => show.title && /^\d{4}-\d{2}-\d{2}$/.test(show.date))
    .map((show) => ({ title: show.title, date: show.date, time: show.time || undefined, venue: show.venue, city: show.city, href: show.ticketUrl || undefined }));
  const sorted = [...content.shows, ...managed].sort((a, b) => a.date.localeCompare(b.date));
  const upcoming = sorted.filter((show) => dayStart(show.date) >= today);
  const past = sorted.filter((show) => dayStart(show.date) < today).reverse();
  const next = upcoming[0];
  return (
    <section className="section-block wrap" id="shows">
      <SectionHeading eyebrow="ON STAGE" title="Upcoming shows." text="Dates, venues and where to catch Doggy Kizz live." />
      {next ? (
        <div className={`next-show ${photo ? 'has-photo' : ''}`} style={photoStyle}>
          <div className="next-show-copy">
            <p className="eyebrow"><span className="status-dot" /> NEXT SHOW</p>
            <h3>{next.title}</h3>
            <p className="next-show-where"><MapPin size={15} aria-hidden="true" /> {[next.venue, next.city].filter(Boolean).join(' · ')}</p>
            <Countdown date={next.date} time={next.time} />
            {next.href && <a className="button button--accent" href={next.href} target="_blank" rel="noreferrer">Show details <ArrowUpRight size={16} /></a>}
          </div>
        </div>
      ) : (
        <div className={`shows-empty ${photo ? 'has-photo' : ''}`} style={photoStyle}>
          <span className="fact-icon"><CalendarDays size={20} /></span>
          <div><h3>No dates announced yet.</h3><p>Follow the official channels to hear first when new shows are confirmed.</p></div>
          <SocialLinks compact />
        </div>
      )}
      {upcoming.length > 1 && <ul className="shows-list">{upcoming.slice(1).map((show) => <ShowRow key={`${show.date}-${show.title}`} show={show} />)}</ul>}
      {past.length > 0 && <details className="past-shows"><summary>Past shows ({past.length})</summary><ul className="shows-list">{past.map((show) => <ShowRow key={`${show.date}-${show.title}`} show={show} />)}</ul></details>}
    </section>
  );
}

const enquiryTypes = ['Booking', 'Collaboration', 'Media'];

function EnquiryForm() {
  const [data, setData] = useState({ name: '', type: 'Booking', date: '', location: '', message: '' });
  const [copied, setCopied] = useState(false);
  const email = content.booking.email;
  const phone = content.booking.whatsappNumber.replace(/\D/g, '');
  const hasWhatsapp = phone.length > 5;
  const update = (key) => (event) => { setCopied(false); setData((prev) => ({ ...prev, [key]: event.target.value })); };

  const subject = `${data.type} enquiry — Doggy Kizz`;
  const body = [
    `Hello, my name is ${data.name || '[your name]'}.`,
    `Enquiry type: ${data.type}`,
    data.date ? `Date: ${data.date}` : null,
    data.location ? `Location: ${data.location}` : null,
    '',
    data.message,
  ].filter((line) => line !== null).join('\n');

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`${subject}\n\n${body}`);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  const submit = (event) => {
    event.preventDefault();
    if (email) window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    else if (hasWhatsapp) window.open(`https://wa.me/${phone}?text=${encodeURIComponent(body)}`, '_blank', 'noopener');
    else copy();
  };

  const primary = email ? 'Send by email' : hasWhatsapp ? 'Send on WhatsApp' : 'Copy my enquiry';

  return (
    <form className="enquiry" onSubmit={submit}>
      <h2>Start an enquiry</h2>
      <p className="enquiry-note">Fill this in and it becomes a ready-to-send message. Nothing is stored on this website.</p>
      <fieldset className="segmented">
        <legend>What is this about?</legend>
        {enquiryTypes.map((type) => (
          <label key={type}><input type="radio" name="type" value={type} checked={data.type === type} onChange={update('type')} /><span>{type}</span></label>
        ))}
      </fieldset>
      <div className="field-row">
        <label className="field"><span>Your name</span><input required value={data.name} onChange={update('name')} autoComplete="name" placeholder="Full name" /></label>
        <label className="field"><span>Event date <em>(optional)</em></span><input type="date" value={data.date} onChange={update('date')} /></label>
      </div>
      <label className="field"><span>City / venue <em>(optional)</em></span><input value={data.location} onChange={update('location')} placeholder="e.g. Kampala" /></label>
      <label className="field"><span>Your message</span><textarea required rows={5} value={data.message} onChange={update('message')} placeholder="Tell us about the event, project or request." /></label>
      <div className="enquiry-actions">
        <button type="submit" className="button button--accent">{primary} <Send size={16} /></button>
        {(email || hasWhatsapp) && <button type="button" className="button button--soft" onClick={copy}>{copied ? <>Copied <Check size={16} /></> : <>Copy message <Copy size={16} /></>}</button>}
        {!email && !hasWhatsapp && copied && <span className="copied-note" role="status"><Check size={15} /> Copied. Paste it into a message on any official channel.</span>}
      </div>
    </form>
  );
}

const heroCutoutItems = [{ src: content.images.heroCutout }];

const streamNotes = {
  'Apple Music': () => `Stream “${content.appleMusicSingle.title}” and more`,
  YouTube: () => `${catalogSongs.length} songs and videos`,
  TikTok: () => 'Clips, challenges and updates',
};

function HomePage() {
  const cutoutList = useAvailableImages(heroCutoutItems);
  const cutout = cutoutList && cutoutList[0];
  const latest = content.releases[0];
  const [first, ...rest] = content.artistName.split(' ');
  const wa = whatsappUrl('Hello, I would like to book Doggy Kizz.');
  return (
    <>
      <section className="home-hero">
        <div className="home-hero-bg" aria-hidden="true" />
        <div className="wrap home-hero-grid">
          <div className="home-hero-copy">
            <p className="home-kicker"><span className="status-dot" /> {content.heroKicker} <b>{latest.title}</b></p>
            <h1 className="home-hero-title"><span>{first}</span><span>{rest.join(' ')}</span></h1>
            <p className="home-hero-tagline">{content.heroText}</p>
            <p className="home-hero-genres">{content.genres.join(' · ')}</p>
            <div className="hero-actions">
              <Link to={watchPath(latest.youtubeId)} className="button button--accent button--lg"><Play size={17} fill="currentColor" /> Watch {latest.title}</Link>
              <a href={content.appleMusic} target="_blank" rel="noreferrer" className="button button--outline button--lg"><BrandIcon name="Apple Music" size={18} /> Apple Music</a>
              {wa && <a href={wa} target="_blank" rel="noreferrer" className="button button--ghost button--lg">Book now <ArrowUpRight size={17} /></a>}
            </div>
            <div className="hero-platforms"><span>FOLLOW</span><SocialLinks compact withWhatsApp /></div>
          </div>
          <div className={`home-hero-visual ${cutout ? '' : 'home-hero-visual--photo'}`}>
            <div className="home-hero-ring" aria-hidden="true" />
            {cutout
              ? <img className="home-hero-cutout" src={cutout.src} alt={`${content.artistName} portrait`} fetchPriority="high" decoding="async" />
              : <Photo src={content.images.hero} alt={`${content.artistName} portrait`} className="home-hero-photo" fallback="DK" />}
            <Link className="home-hero-card" to={watchPath(latest.youtubeId)}><span className="hero-now-play"><Play size={15} fill="currentColor" /></span><span><small>NEW RELEASE</small><b>{latest.title}</b></span></Link>
          </div>
        </div>
      </section>

      <LatestRelease />

      <section className="section-block wrap" id="stream">
        <SectionHeading eyebrow="STREAM EVERYWHERE" title="Hear it your way." text="Follow Doggy Kizz on every platform so you never miss a release." />
        <div className="stream-grid">
          {content.socialLinks.map((link) => (
            <a key={link.label} className="stream-card" data-brand={link.label.toLowerCase().replace(/\s+/g, '-')} href={link.href} target="_blank" rel="noreferrer">
              <span className="stream-icon"><BrandIcon name={link.label} size={26} /></span>
              <div><b>{link.label}</b><small>{(streamNotes[link.label] || (() => `Open on ${link.label}`))()}</small></div>
              <ArrowUpRight size={18} aria-hidden="true" />
            </a>
          ))}
        </div>
      </section>

      <section className="section-block wrap" id="favourites">
        <SectionHeading eyebrow="FAN FAVOURITES" title="Popular songs" action="All videos" to="/videos" />
        <MostWatched count={4} />
      </section>

      <BookingStrip showOffers />
      <Shows />
    </>
  );
}

function MusicPage() {
  return <PageShell eyebrow="LISTEN" title="Music" intro="Every song in one place. Pick one and it plays on its own page, with the full playlist beside it." number="01">
    <Catalog />
    <div className="platform-panel"><div><p className="eyebrow">YOUR NEXT LISTEN</p><h2>Listen elsewhere</h2></div><div className="listen-grid">{content.socialLinks.map((link) => <a key={link.label} className="listen-card" href={link.href} target="_blank" rel="noreferrer"><span className="listen-icon"><BrandIcon name={link.label} size={20} /></span><div><b>{link.label}</b><small>Open on {link.label}</small></div><ArrowUpRight size={16} aria-hidden="true" /></a>)}</div></div>
  </PageShell>;
}

function VideosPage() {
  return <PageShell eyebrow="WATCH" title="Videos" intro="The newest videos, the most watched songs and live performances." number="02">
    <div className="videos-list">{content.videos.map((video) => <VideoFeature key={video.youtubeId} video={video} large />)}</div>
    <div className="video-section"><p className="eyebrow">FAN FAVOURITES</p><h2>Popular songs</h2><MostWatched /></div>
    <div className="video-section"><p className="eyebrow">ON STAGE</p><h2>Live performances.</h2><LivePerformances /></div>
    <div className="video-actions">
      <a className="button button--accent youtube-more" href={content.youtubeChannel} target="_blank" rel="noreferrer">Visit the YouTube channel <ArrowUpRight size={17} /></a>
      <Link className="button button--soft youtube-more" to="/music">Browse all {catalogSongs.length} songs</Link>
    </div>
  </PageShell>;
}

function AboutPage() {
  const single = content.appleMusicSingle;
  return <PageShell eyebrow="THE ARTIST" title="About Doggy Kizz" intro="The voice, the vision and the journey behind the music." number="03">
    <div className="artist-bio-layout"><CutoutPortrait cutout={content.images.aboutCutout} photo={content.images.about} alt={`${content.artistName} portrait`} tint="green" className="artist-bio-photo" /><div className="artist-bio-copy"><p className="eyebrow">MUSIC · CULTURE · CONNECTION</p><h2>{content.aboutTitle}</h2><p>{content.biography}</p><SocialLinks withWhatsApp /></div></div>
    <div className="genre-row"><span>THE SOUND</span>{content.genres.map((genre, i) => <span className="genre-item" key={genre}>{i > 0 && <i>×</i>}<b>{genre}</b></span>)}</div>
    <div className="apple-panel">
      <span className="apple-panel-icon"><BrandIcon name="Apple Music" size={30} /></span>
      <div className="apple-panel-copy"><p className="eyebrow">ON APPLE MUSIC</p><h2>{content.artistName}</h2><p>{single.title} · Single · {single.year}</p></div>
      <div className="apple-panel-actions"><a className="button button--accent" href={single.href} target="_blank" rel="noreferrer"><Play size={16} fill="currentColor" /> Play {single.title}</a><a className="button button--outline" href={content.appleMusic} target="_blank" rel="noreferrer">Artist profile <ArrowUpRight size={16} /></a></div>
    </div>
    <div className="glance">{[
      ['Role', 'Singer & songwriter'],
      ['Based in', content.locationLine],
      ['Sound', content.genres.join(' · ')],
      ['Latest release', content.releases[0].title],
      ['Songs', `${Math.floor(catalogSongs.length / 5) * 5}+ released`],
    ].map(([label, value]) => <div className="glance-card" key={label}><small>{label}</small><b>{value}</b></div>)}</div>
    {content.milestones.length > 0 && <div className="timeline-wrap"><p className="eyebrow">THE JOURNEY</p><ol className="timeline">{content.milestones.map((item) => <li key={`${item.year}-${item.title}`}><span>{item.year}</span><div><h3>{item.title}</h3>{item.text && <p>{item.text}</p>}</div></li>)}</ol></div>}
  </PageShell>;
}

function BookingPage() {
  const hasEmail = Boolean(content.booking.email);
  const wa = whatsappUrl('Hello, I would like to book Doggy Kizz. Event type: \nDate: \nLocation: ');
  return <PageShell eyebrow="GET IN TOUCH" title="Book Doggy Kizz" intro={content.booking.text} number="04">
    <div className="book-hero">
      <div><p className="eyebrow">FASTEST WAY TO BOOK</p><h2>Message the team on WhatsApp.</h2><p>Share the event, date and location and you will get a reply with availability and terms.</p></div>
      {wa && <a className="button button--accent button--lg" href={wa} target="_blank" rel="noreferrer"><BrandIcon name="WhatsApp" size={18} /> Start a WhatsApp chat</a>}
    </div>
    <div className="book-section"><p className="eyebrow">WHAT YOU CAN BOOK</p>
      <ul className="offer-grid offer-grid--page">{content.booking.offers.map((offer, i) => { const Icon = offerIcons[i % offerIcons.length]; return <li key={offer.title}><span className="offer-icon"><Icon size={20} aria-hidden="true" /></span><b>{offer.title}</b><small>{offer.text}</small></li>; })}</ul>
    </div>
    <div className="book-section"><p className="eyebrow">HOW IT WORKS</p>
      <ol className="steps-grid">{content.booking.steps.map((step, i) => <li key={step.title}><span>{String(i + 1).padStart(2, '0')}</span><b>{step.title}</b><small>{step.text}</small></li>)}</ol>
    </div>
    <div className="contact-layout"><div className="contact-lead"><span className="contact-icon"><Mail size={24} /></span><h2>Official channels</h2><p>For shows, features, collaborations and media enquiries, reach Doggy Kizz through any channel below.</p><SocialLinks withWhatsApp /></div><div className="contact-options">
      {hasEmail && <a className="contact-option" href={`mailto:${content.booking.email}`}><span><Mail size={19} /></span><div><b>Booking email</b><small>{content.booking.email}</small></div><ArrowUpRight size={18} /></a>}
      {content.booking.phone && <a className="contact-option" href={`tel:${content.booking.phone.replace(/\s/g, '')}`}><span><Phone size={19} /></span><div><b>Call</b><small>{content.booking.phone}</small></div><ArrowUpRight size={18} /></a>}
      {wa && <a className="contact-option" href={wa} target="_blank" rel="noreferrer"><span><Smartphone size={19} /></span><div><b>WhatsApp enquiries</b><small>Chat on WhatsApp</small></div><ArrowUpRight size={18} /></a>}
      <a className="contact-option" href={content.appleMusic} target="_blank" rel="noreferrer"><span><BrandIcon name="Apple Music" size={19} /></span><div><b>Apple Music</b><small>Artist profile</small></div><ArrowUpRight size={18} /></a>
      <a className="contact-option" href={content.youtubeChannel} target="_blank" rel="noreferrer"><span><Play size={19} /></span><div><b>YouTube channel</b><small>Videos and music</small></div><ArrowUpRight size={18} /></a>
    </div></div>
    <EnquiryForm />
  </PageShell>;
}

function PageShell({ eyebrow, title, intro, number, children }) {
  return <div className="page-shell"><section className="page-hero wrap"><span className="page-watermark" aria-hidden="true">{eyebrow}</span><div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p className="page-intro">{intro}</p></div>{number && <span className="page-number">{number} <i>/</i> 04</span>}</section><div className="wrap page-content">{children}</div><BookingStrip /></div>;
}

function NotFound() {
  return <PageShell eyebrow="NOT FOUND" title="Page not found" intro="The page may have moved. Head back to the homepage." number="00"><Link to="/" className="button button--accent">Back home <ArrowRight size={17} /></Link></PageShell>;
}

const pressItems = [
  { src: content.images.heroCutout, label: 'Cut-out portrait', file: 'doggy-kizz-cutout' },
  { src: content.images.aboutCutout, label: 'Cut-out portrait (alternate)', file: 'doggy-kizz-cutout-2' },
  { src: content.images.hero, label: 'Portrait', file: 'doggy-kizz-portrait' },
  { src: content.images.about, label: 'Portrait (alternate)', file: 'doggy-kizz-portrait-2' },
  ...content.gallery.filter((item) => item.tag === 'Shows').map((item, i) => ({ src: item.src, label: item.caption, file: `doggy-kizz-live-${i + 1}` })),
];

function PressPage() {
  const photos = useAvailableImages(pressItems);
  const [copied, setCopied] = useState(false);
  const phone = content.booking.whatsappNumber.replace(/\D/g, '');
  const copyBio = async () => {
    try { await navigator.clipboard.writeText(content.biography); setCopied(true); window.setTimeout(() => setCopied(false), 2500); } catch { setCopied(false); }
  };
  const facts = [
    ['Name', content.artistName],
    ['Based in', content.locationLine],
    ['Sound', content.genres.join(' · ')],
    ['Latest release', content.releases[0].title],
    ['Songs', `${Math.floor(catalogSongs.length / 5) * 5}+ released`],
  ];
  return <PageShell eyebrow="PRESS KIT" title="Press kit" intro="Biography, photos and contact details for media, promoters and partners.">
    <div className="press-bio">
      <div><p className="eyebrow">SHORT BIOGRAPHY</p><p className="press-bio-text">{content.biography}</p></div>
      <button type="button" className="button button--soft" onClick={copyBio}>{copied ? <>Copied <Check size={16} /></> : <>Copy bio <Copy size={16} /></>}</button>
    </div>
    <div className="glance">{facts.map(([label, value]) => <div className="glance-card" key={label}><small>{label}</small><b>{value}</b></div>)}</div>
    {photos && photos.length > 0 && <div className="press-photos">
      <p className="eyebrow">PHOTOS · FREE TO USE FOR PRESS AND PROMOTION OF DOGGY KIZZ</p>
      <div className="press-grid">{photos.map((photo) => {
        const ext = photo.src.split('?')[0].split('.').pop();
        return <figure className="press-item" key={photo.src}><div className="press-thumb"><img src={photo.src} alt={photo.label} loading="lazy" decoding="async" /></div><figcaption><span>{photo.label}</span><a href={photo.src} download={`${photo.file}.${ext}`} aria-label={`Download ${photo.label}`}><Download size={16} /></a></figcaption></figure>;
      })}</div>
    </div>}
    <div className="press-contact">
      <h2>Media and booking contact</h2>
      <p>For interviews, features, bookings and collaborations.</p>
      <div className="enquiry-actions">
        {phone.length > 5 && <a className="button button--accent" href={`https://wa.me/${phone}`} target="_blank" rel="noreferrer">WhatsApp <ArrowUpRight size={16} /></a>}
        {content.booking.phone && <a className="button button--soft" href={`tel:${content.booking.phone.replace(/\s/g, '')}`}>Call {content.booking.phone}</a>}
        <Link className="button button--soft" to="/booking">Enquiry form <ArrowRight size={16} /></Link>
      </div>
    </div>
  </PageShell>;
}

function LinksPage() {
  useEffect(() => { document.title = 'Doggy Kizz — Links'; }, []);
  const phone = content.booking.whatsappNumber.replace(/\D/g, '');
  const latest = content.releases[0];
  const others = content.socialLinks.filter((link) => link.label !== 'YouTube');
  return (
    <main className="links-page" id="main">
      <div className="links-top"><Link to="/" className="links-home" aria-label="Doggy Kizz website home">DK<span>.</span></Link><ThemeToggle /></div>
      <div className="links-card">
        <Photo src={content.images.about} alt={`${content.artistName} portrait`} className="links-avatar" fallback="DK" />
        <h1>{content.artistName}</h1>
        <p className="links-sub">Ugandan recording artist</p>
        <div className="links-list">
          <Link className="links-btn links-btn--main" to={watchPath(latest.youtubeId)}><Play size={18} fill="currentColor" /><span><b>Watch: {latest.title}</b><small>Latest release</small></span><ArrowRight size={17} /></Link>
          <a className="links-btn" href={content.youtubeChannel} target="_blank" rel="noreferrer"><BrandIcon name="YouTube" size={18} /><span><b>Watch on YouTube</b><small>Videos and music</small></span><ArrowUpRight size={17} /></a>
          {phone.length > 5 && <a className="links-btn" href={`https://wa.me/${phone}`} target="_blank" rel="noreferrer"><Smartphone size={18} /><span><b>WhatsApp</b><small>Bookings and enquiries</small></span><ArrowUpRight size={17} /></a>}
          <Link className="links-btn" to="/music"><Headphones size={18} /><span><b>All songs and videos</b><small>{catalogSongs.length} songs to watch and listen</small></span><ArrowRight size={17} /></Link>
          <Link className="links-btn" to="/booking"><Mail size={18} /><span><b>Book Doggy Kizz</b><small>Shows, features, collaborations</small></span><ArrowRight size={17} /></Link>
          {others.map((link) => <a key={link.label} className="links-btn" href={link.href} target="_blank" rel="noreferrer"><BrandIcon name={link.label} size={18} /><span><b>{link.label}</b></span><ArrowUpRight size={17} /></a>)}
          <Link className="links-btn" to="/"><Globe2 size={18} /><span><b>Full website</b><small>Music, videos and About</small></span><ArrowRight size={17} /></Link>
        </div>
      </div>
      <p className="links-foot">© {new Date().getFullYear()} {content.artistName}</p>
    </main>
  );
}

function NewsPage() {
  return <PageShell title="News" intro="Announcements, releases and updates from Doggy Kizz." number="05">
    <NewsList />
    {cmsEnabled && <div className="news-subscribe"><h2>Get updates by email</h2><p>One email when there is something worth sharing. No spam.</p><SubscribeForm source="news" /></div>}
  </PageShell>;
}

export default function App() {
  return <Routes><Route path="links" element={<LinksPage />} /><Route path="admin" element={<Suspense fallback={<div className="admin-loading">Loading…</div>}><AdminPage /></Suspense>} /><Route element={<SiteLayout />}><Route index element={<HomePage />} /><Route path="music" element={<MusicPage />} /><Route path="watch" element={<WatchPage />} /><Route path="videos" element={<VideosPage />} /><Route path="news" element={<NewsPage />} /><Route path="about" element={<AboutPage />} /><Route path="booking" element={<BookingPage />} /><Route path="press" element={<PressPage />} /><Route path="*" element={<NotFound />} /></Route></Routes>;
}
