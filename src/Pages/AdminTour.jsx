import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

// ─── "What's new" guided tour ─────────────────────────────────────
// Shown automatically after login until the admin finishes or skips it, and
// any time from the "What's new" button. Each step can switch tab, open an
// Edit Content section or an apartment's edit form, then highlights one
// element (found by its data-tour attribute) and explains it.
//
// Bump TOUR_VERSION when new steps are added so every admin sees them once.
const TOUR_VERSION = '2026-11-extra-guests';
const SEEN_KEY = 'admin_tour_seen';

// eslint-disable-next-line react-refresh/only-export-components
export const TOUR_STEPS = [
  {
    title: "What's new in your admin",
    body: [
      "Here's a quick tour of everything that was added. Press Next and I'll take you to each one and explain what it does.",
      '• Photo carousel, zoom & full-screen photos on the website',
      '• Extra-guest pricing per apartment',
      '• Long-stay discounts, Location & Google reviews, Rooms page heading and Getting Around text',
    ],
  },
  {
    tab: 'properties',
    target: '[data-tour="property-card"]',
    title: 'Your apartments = the Rooms page',
    body: [
      'Each apartment here is a card on the Rooms page of the website.',
      "Guests can now swipe through the apartment's photos right on the card, and clicking the apartment's name or photo opens its page — they no longer have to press Book Now to see the details.",
    ],
  },
  {
    tab: 'properties',
    target: '[data-tour="property-images"]',
    title: 'Photos: carousel, zoom & full screen',
    body: [
      'The photos you upload here — in this order — are what guests swipe through on the Rooms page card.',
      'On the apartment page they appear with thumbnails, and guests can open them full screen and zoom in and out.',
      'The first photo is the cover. Clear, landscape JPG photos look best.',
    ],
  },
  {
    tab: 'properties',
    openProperty: true,
    target: '[data-tour="field-included_guests"]',
    title: 'Where the extra-guest charge starts',
    body: [
      "I've opened an apartment's edit form for you.",
      'This is how many guests the base price covers. The extra charge starts after this number:',
      '• 2 → the 3rd and 4th guest pay extra',
      '• 3 → only the 4th guest pays extra',
    ],
  },
  {
    tab: 'properties',
    openProperty: true,
    target: '[data-tour="field-extra_guest_fee"]',
    title: 'Extra charge per guest, per night',
    body: [
      'Any amount you choose, added per night for each guest above the included number.',
      'Example: base ₦90,000 + ₦10,000 → 2 guests ₦90,000 · 3 guests ₦100,000 · 4 guests ₦110,000 a night.',
      '0 or empty = no extra charge. Changing it only affects new bookings — guests who already paid are never charged again.',
    ],
  },
  {
    tab: 'properties',
    openProperty: true,
    target: '[data-tour="field-max_guests"]',
    title: 'Maximum guests',
    body: ['The most guests allowed for this apartment. The guest list on the booking page stops at this number (e.g. 4).'],
  },
  {
    tab: 'properties',
    openProperty: true,
    target: '[data-tour="guest-price-preview"]',
    title: 'Price preview',
    body: [
      'This shows exactly what guests will pay per night for each number of guests, so you can check before saving.',
      'Nothing changes on the website until you press Save Changes at the bottom of the form.',
    ],
    missingBody: [
      'When you enter an extra charge above, a preview appears here showing exactly what guests will pay per night for each number of guests.',
      'Nothing changes on the website until you press Save Changes at the bottom of the form.',
    ],
  },
  {
    tab: 'content',
    section: 'booking_settings',
    target: '[data-tour="content-editor"]',
    title: 'Long-stay discounts',
    body: [
      'Edit Content → Booking Settings.',
      'Turn the weekly and monthly discounts on or off and choose the % off and the number of nights.',
      "They're applied automatically on the booking page and shown on the homepage — guests don't need a code. For one-off promo codes, use the Discount Codes tab.",
    ],
  },
  {
    tab: 'content',
    section: 'location',
    target: '[data-tour="content-editor"]',
    title: 'Location & Google reviews',
    body: [
      'Edit Content → Location & Reviews.',
      'The address, map, Google rating, number of reviews and reviews link shown at the top of the Getting Around page.',
      "If the map pin isn't on the property, type the business name as it appears on Google Maps in Map search.",
    ],
  },
  {
    tab: 'content',
    section: 'getting_around',
    target: '[data-tour="ga-intro"]',
    title: 'Getting Around page text',
    body: [
      'Edit Content → Getting Around.',
      'The intro at the top of the page and the note at the bottom can now be edited here. The list of places is below.',
    ],
  },
  {
    tab: 'content',
    section: 'rooms_page',
    target: '[data-tour="content-editor"]',
    title: 'Rooms page heading',
    body: [
      'Edit Content → Rooms Page.',
      'Change the small label, heading and intro text at the top of the Rooms page. Apartment names, prices and photos still come from Properties.',
    ],
  },
  {
    target: '[data-tour="tour-button"]',
    title: "That's everything",
    body: ['You can replay this tour any time from this button.'],
  },
];

// eslint-disable-next-line react-refresh/only-export-components
export const shouldAutoStartTour = () => {
  try { return localStorage.getItem(SEEN_KEY) !== TOUR_VERSION; } catch { return false; }
};
const markTourSeen = () => {
  try { localStorage.setItem(SEEN_KEY, TOUR_VERSION); } catch { /* ignore */ }
};

// Lets a tab react to the tour (switch section, open a form) even when the
// request arrives before the tab has mounted.
let pendingRequest = null;
// eslint-disable-next-line react-refresh/only-export-components
export const tourRequest = (req) => {
  pendingRequest = req;
  window.dispatchEvent(new CustomEvent('admin-tour', { detail: req }));
};
// eslint-disable-next-line react-refresh/only-export-components
export const useTourRequest = (handler) => {
  const ref = useRef(handler);
  ref.current = handler;
  useEffect(() => {
    const on = (e) => { if (e.detail) ref.current(e.detail); };
    window.addEventListener('admin-tour', on);
    if (pendingRequest) ref.current(pendingRequest);
    return () => window.removeEventListener('admin-tour', on);
  }, []);
};

const PAD = 8;

const AdminTour = ({ onNavigate, onClose }) => {
  const [index, setIndex] = useState(0);
  const [rect, setRect] = useState(null);
  const [missing, setMissing] = useState(false);
  const [cardH, setCardH] = useState(240);
  const [viewport, setViewport] = useState({ w: window.innerWidth, h: window.innerHeight });
  const cardRef = useRef(null);
  const step = TOUR_STEPS[index];
  const last = index === TOUR_STEPS.length - 1;

  const finish = () => {
    markTourSeen();
    tourRequest(null);
    onClose();
  };
  const next = () => (last ? finish() : setIndex(i => i + 1));
  const back = () => setIndex(i => Math.max(0, i - 1));

  // Go to the step's place, then find and follow its highlighted element.
  useEffect(() => {
    setRect(null);
    setMissing(false);
    onNavigate(step);
    if (!step.target) return;
    let el = null;
    let scrolled = false;
    const started = Date.now();
    const id = setInterval(() => {
      if (!el || !el.isConnected) el = document.querySelector(step.target);
      if (!el) {
        if (Date.now() - started > 3000) setMissing(true);
        return;
      }
      setMissing(false);
      if (!scrolled) {
        const tall = el.offsetHeight > window.innerHeight * 0.55;
        el.scrollIntoView({ block: tall ? 'start' : 'center', behavior: 'smooth' });
        scrolled = true;
      }
      const r = el.getBoundingClientRect();
      setRect(prev => (prev && prev.top === r.top && prev.left === r.left && prev.width === r.width && prev.height === r.height)
        ? prev : { top: r.top, left: r.left, width: r.width, height: r.height });
    }, 120);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  useEffect(() => {
    const onResize = () => setViewport({ w: window.innerWidth, h: window.innerHeight });
    const onKey = (e) => {
      if (e.key === 'Escape') finish();
      else if (e.key === 'ArrowRight') next();
      else if (e.key === 'ArrowLeft') back();
    };
    window.addEventListener('resize', onResize);
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('resize', onResize); window.removeEventListener('keydown', onKey); };
  });

  // Measure the card after every render (its text changes per step) to place it.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useLayoutEffect(() => {
    const h = cardRef.current?.offsetHeight;
    if (h && h !== cardH) setCardH(h);
  });

  const spot = rect && !missing ? rect : null;
  const width = Math.min(380, viewport.w - 32);
  let cardStyle;
  if (!spot) {
    cardStyle = { top: Math.max(16, (viewport.h - cardH) / 2), left: (viewport.w - width) / 2 };
  } else {
    const left = Math.min(Math.max(16, spot.left), viewport.w - width - 16);
    const below = spot.top + spot.height + PAD + 12;
    const above = spot.top - PAD - 12 - cardH;
    if (below + cardH <= viewport.h - 16) cardStyle = { top: below, left };
    else if (above >= 16) cardStyle = { top: above, left };
    else cardStyle = { top: viewport.h - cardH - 16, left: viewport.w - width - 16 }; // element fills the screen: dock bottom-right
  }
  const body = missing && step.missingBody ? step.missingBody : step.body;

  return createPortal(
    <div className="fixed inset-0 z-[1000]" role="dialog" aria-modal="true" aria-label="What's new tour">
      {/* Blocks clicks on the page while the tour is open; the page still scrolls. */}
      <div className={`absolute inset-0 ${spot ? '' : 'bg-slate-950/75'}`} />
      {spot && (
        <div className="absolute rounded-xl ring-2 ring-amber-400 pointer-events-none transition-all duration-300"
          style={{
            top: spot.top - PAD, left: spot.left - PAD, width: spot.width + PAD * 2, height: spot.height + PAD * 2,
            boxShadow: '0 0 0 9999px rgba(2, 6, 23, 0.75)',
          }} />
      )}
      <div ref={cardRef}
        className="absolute bg-slate-900 border border-amber-400/40 rounded-2xl shadow-2xl p-5 text-white transition-all duration-300"
        style={{ ...cardStyle, width }}>
        <div className="flex items-start justify-between gap-3 mb-2">
          <p className="text-amber-400 text-xs font-semibold uppercase tracking-wider">
            What's new · {index + 1} of {TOUR_STEPS.length}
          </p>
          <button onClick={finish} className="text-purple-300 hover:text-white -mt-1" aria-label="Close tour"><FiX /></button>
        </div>
        <h3 className="text-lg font-bold mb-2">{step.title}</h3>
        <div className="space-y-1.5 text-sm text-purple-100 leading-snug">
          {body.map((line, i) => <p key={i}>{line}</p>)}
        </div>
        <div className="flex gap-1 mt-4">
          {TOUR_STEPS.map((_, i) => (
            <span key={i} className={`h-1 flex-1 rounded-full ${i <= index ? 'bg-amber-400' : 'bg-white/15'}`} />
          ))}
        </div>
        <div className="flex items-center justify-between gap-2 mt-4">
          <button onClick={finish} className="text-purple-300 hover:text-white text-sm">Skip tour</button>
          <div className="flex gap-2">
            {index > 0 && (
              <button onClick={back} className="flex items-center gap-1 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm">
                <FiChevronLeft /> Back
              </button>
            )}
            <button onClick={next} className="flex items-center gap-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-semibold">
              {last ? 'Finish' : <>Next <FiChevronRight /></>}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default AdminTour;
