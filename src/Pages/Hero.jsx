import React, { useState, useEffect, useRef } from 'react';
import {
  FiCalendar, FiTrash2, FiUsers, FiHome, FiAlertCircle,
  FiCheckCircle, FiXCircle, FiPlus, FiRefreshCw, FiEdit2,
  FiTag, FiImage, FiFileText, FiDollarSign, FiToggleLeft, FiToggleRight,
  FiSave, FiUpload, FiX, FiChevronLeft, FiChevronRight,
  FiWifi, FiWind, FiMonitor, FiZap, FiShield, FiActivity,
  FiBriefcase, FiSun, FiDroplet, FiCoffee, FiMapPin, FiAnchor, FiSliders, FiBookOpen,
  FiLock, FiCamera, FiThermometer, FiUmbrella, FiTruck, FiHeart, FiPrinter, FiFilm, FiTv
} from 'react-icons/fi';
import { DEFAULT_GETTING_AROUND } from '../data/gettingAroundDefaults';
import { DEFAULT_CAROUSEL } from '../data/carouselDefaults';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:4000') + '/api';

const authFetch = (url, opts = {}) => {
  const token = sessionStorage.getItem('admin_token');
  return fetch(url, {
    ...opts,
    headers: {
      ...(opts.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
};

// Facilities — mirrors the public /facilities page (Frontend Feauters.jsx). Keep the two in sync.
const AMENITY_CATEGORIES = [
  {
    category: 'Entertainment & Connectivity',
    items: [
      { name: 'Unlimited Internet', Icon: FiWifi },
      { name: 'Smart TV', Icon: FiTv },
      { name: 'Board Games Collection', Icon: FiFilm },
    ],
  },
  {
    category: 'Kitchen & Dining',
    items: [
      { name: 'Fully-Kitted Kitchen', Icon: FiCoffee },
      { name: 'Complimentary Beverages', Icon: FiCoffee },
    ],
  },
  {
    category: 'Comfort & Convenience',
    items: [
      { name: 'Air Conditioners', Icon: FiWind },
      { name: 'Rechargeable Fans', Icon: FiWind },
      { name: 'Washing Machine', Icon: FiRefreshCw },
      { name: 'Water Heater', Icon: FiThermometer },
      { name: 'Hair Dryers', Icon: FiWind },
      { name: 'Hotel-Grade Beddings', Icon: FiHome },
      { name: 'Bathroom Essentials', Icon: FiDroplet },
      { name: 'Smart Home Features', Icon: FiHome },
    ],
  },
  {
    category: 'Work & Productivity',
    items: [
      { name: 'Dedicated Workspace', Icon: FiBriefcase },
      { name: 'Constant Electricity', Icon: FiZap },
    ],
  },
  {
    category: 'Security & Safety',
    items: [
      { name: 'Maximum Security', Icon: FiShield },
      { name: 'Self Check-in', Icon: FiLock },
      { name: 'Fire Extinguisher', Icon: FiShield },
      { name: 'First Aid Box', Icon: FiHeart },
      { name: 'Spacious Parking', Icon: FiTruck },
    ],
  },
];

const AmenitiesPicker = ({ selected = [], onChange }) => {
  const toggle = (name) =>
    onChange(selected.includes(name) ? selected.filter(a => a !== name) : [...selected, name]);
  return (
    <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
      {AMENITY_CATEGORIES.map(({ category, items }) => (
        <div key={category}>
          <h4 className="text-purple-300 text-xs font-semibold uppercase tracking-wider mb-2">{category}</h4>
          <div className="grid grid-cols-2 gap-2">
            {items.map(({ name, Icon }) => (
              <label key={name}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition select-none
                  ${selected.includes(name)
                    ? 'bg-purple-600/40 border-purple-400 text-white'
                    : 'bg-white/5 border-white/20 text-purple-200 hover:border-white/40'}`}>
                <input type="checkbox" checked={selected.includes(name)} onChange={() => toggle(name)} className="sr-only" />
                <Icon size={14} className="shrink-0" />
                <span className="text-xs font-medium">{name}</span>
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

// ─── Reusable alert ───────────────────────────────────────────────
const Alert = ({ message, type }) => {
  if (!message) return null;
  return (
    <div className={`mb-6 p-4 rounded-xl border backdrop-blur-md flex items-center gap-2 ${
      type === 'success'
        ? 'bg-green-500/20 border-green-500/50 text-green-100'
        : 'bg-red-500/20 border-red-500/50 text-red-100'
    }`}>
      {type === 'success' ? <FiCheckCircle /> : <FiXCircle />}
      <span>{message}</span>
    </div>
  );
};

// ─── TAB: Block Dates ─────────────────────────────────────────────
const BlockDatesTab = ({ showMessage }) => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ room_type: 'entire', check_in_date: '', check_out_date: '', reason: '' });

  const handleBlock = async () => {
    if (!form.check_in_date || !form.check_out_date) {
      showMessage('error', 'Select check-in and check-out dates');
      return;
    }
    setLoading(true);
    try {
      const res = await authFetch(`${API_URL}/admin/block-date`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form)
      });
      const d = await res.json();
      if (d.success) {
        showMessage('success', 'Date blocked!');
        setForm({ room_type: 'entire', check_in_date: '', check_out_date: '', reason: '' });
      } else {
        showMessage('error', d.message || 'Failed to block date');
      }
    } catch { showMessage('error', 'Network error'); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { label: 'Room Type', field: 'room_type', type: 'select', options: [
            { value: 'entire', label: 'Entire Apartment' },
            { value: 'room1', label: 'Room 1' },
          ]},
          { label: 'Check-in Date', field: 'check_in_date', type: 'date' },
          { label: 'Check-out Date', field: 'check_out_date', type: 'date' },
          { label: 'Reason (Optional)', field: 'reason', type: 'text', placeholder: 'e.g., Maintenance' },
        ].map(({ label, field, type, options, placeholder }) => (
          <div key={field}>
            <label className="block text-purple-200 mb-2 font-medium">{label}</label>
            {type === 'select' ? (
              <select value={form[field]} onChange={e => setForm({ ...form, [field]: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
                {options.map(o => <option key={o.value} value={o.value} className="bg-slate-800">{o.label}</option>)}
              </select>
            ) : (
              <input type={type} value={form[field]} placeholder={placeholder || ''}
                min={field === 'check_out_date' ? form.check_in_date : new Date().toISOString().split('T')[0]}
                onChange={e => setForm({ ...form, [field]: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500" />
            )}
          </div>
        ))}
      </div>
      <button onClick={handleBlock} disabled={loading}
        className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium rounded-xl transition-all disabled:opacity-50">
        {loading ? 'Blocking...' : 'Block Dates'}
      </button>
    </div>
  );
};

// ─── TAB: All Bookings ────────────────────────────────────────────
const BookingsTab = ({ showMessage }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await authFetch(`${API_URL}/admin/bookings`);
      const d = await res.json();
      if (d.success) setBookings(d.bookings.all || []);
      else showMessage('error', 'Failed to fetch bookings');
    } catch { showMessage('error', 'Network error'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this booking?')) return;
    try {
      const res = await authFetch(`${API_URL}/admin/bookings/${id}`, { method: 'DELETE' });
      const d = await res.json();
      if (d.success) { showMessage('success', 'Deleted!'); fetchBookings(); }
      else showMessage('error', d.message);
    } catch { showMessage('error', 'Network error'); }
  };

  const fmt = (d) => new Date(d).toLocaleDateString('en-NG', { year: 'numeric', month: 'short', day: 'numeric' });
  const nights = (a, b) => Math.ceil((new Date(b) - new Date(a)) / 86400000);

  const userBookings = bookings.filter(b => b.booking_type !== 'admin');
  const adminBlocks = bookings.filter(b => b.booking_type === 'admin');

  if (loading) return <div className="text-center py-12 text-purple-200">Loading...</div>;

  return (
    <div className="space-y-6">
      <button onClick={fetchBookings} className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all">
        <FiRefreshCw /> Refresh
      </button>

      {adminBlocks.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <FiAlertCircle className="text-orange-400" /> Admin Blocks ({adminBlocks.length})
          </h3>
          <div className="space-y-2">
            {adminBlocks.map(b => (
              <div key={b.id} className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 flex justify-between items-center">
                <div>
                  <span className="text-orange-300 font-medium">{b.room_type}</span>
                  <span className="text-purple-300 ml-3">{fmt(b.check_in)} → {fmt(b.check_out)}</span>
                  <span className="text-purple-400 ml-3 text-sm">({nights(b.check_in, b.check_out)} nights)</span>
                </div>
                <button onClick={() => handleDelete(b.id)} className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg">
                  <FiTrash2 />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
          <FiUsers className="text-blue-400" /> Guest Bookings ({userBookings.length})
        </h3>
        <div className="space-y-3">
          {userBookings.map(b => (
            <div key={b.id} className="bg-white/5 border border-white/20 rounded-xl p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <span className="font-semibold text-white">{b.name}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${b.payment_status === 'paid' ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'}`}>
                      {b.payment_status}
                    </span>
                    <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded-full text-xs">{b.room_type}</span>
                    {b.payment_type === 'deposit' && (
                      <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded-full text-xs">
                        Deposit ({b.deposit_percentage}%) • Balance due: ₦{Number(b.balance_due || 0).toLocaleString()}
                      </span>
                    )}
                    {b.discount_code && (
                      <span className="px-2 py-0.5 bg-pink-500/20 text-pink-300 rounded-full text-xs">
                        Code: {b.discount_code} (-₦{Number(b.discount_amount || 0).toLocaleString()})
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-purple-300">
                    <div><span className="block text-xs">Email</span><span className="text-white">{b.email}</span></div>
                    <div><span className="block text-xs">Phone</span><span className="text-white">{b.phone || 'N/A'}</span></div>
                    <div><span className="block text-xs">Check-in</span><span className="text-white">{fmt(b.check_in)}</span></div>
                    <div><span className="block text-xs">Check-out</span><span className="text-white">{fmt(b.check_out)}</span></div>
                    <div><span className="block text-xs">Nights</span><span className="text-white">{nights(b.check_in, b.check_out)}</span></div>
                    <div><span className="block text-xs">Guests</span><span className="text-white">{b.guests}</span></div>
                    <div><span className="block text-xs">Price Paid</span><span className="text-white">₦{Number(b.paid_amount || b.price || 0).toLocaleString()}</span></div>
                    <div><span className="block text-xs">Provider</span><span className="text-white capitalize">{b.provider || 'N/A'}</span></div>
                  </div>
                  {b.id_file_url && (
                    <a href={b.id_file_url} target="_blank" rel="noreferrer" className="text-blue-400 text-xs underline mt-1 block">View ID Document</a>
                  )}
                </div>
                <button onClick={() => handleDelete(b.id)} className="ml-4 p-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg">
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── TAB: Properties ─────────────────────────────────────────────
const PropertiesTab = ({ showMessage }) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  // ── Guided apartment/room setup (drives property_group + blocks_group) ──
  const [aptChoice, setAptChoice] = useState('__standalone__'); // '__standalone__' | '__new__' | <group key>
  const [newAptName, setNewAptName] = useState('');
  const [listingType, setListingType] = useState('entire');     // 'entire' | 'room'
  const [roomNo, setRoomNo] = useState('1');
  const slug = (s) => (s || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
  const resetSetup = () => { setAptChoice('__standalone__'); setNewAptName(''); setListingType('entire'); setRoomNo('1'); };
  const [imageFile, setImageFile] = useState({}); // keyed by room_key — per-card, so one card's pick doesn't light up every card
  const [uploadingImage, setUploadingImage] = useState('');
  const [pendingImages, setPendingImages] = useState([]);
  const [uploadProgress, setUploadProgress] = useState('');

  const fetch_ = async () => {
    setLoading(true);
    try {
      const res = await authFetch(`${API_URL}/admin/properties`);
      const d = await res.json();
      if (d.success) setProperties(d.properties || []);
    } catch { showMessage('error', 'Failed to load properties'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch_(); }, []);

  const startEdit = (p) => {
    setEditing(p.room_key);
    const amenityNames = (p.amenities || []).map(a => typeof a === 'string' ? a : a.name);
    setForm({ ...p, amenities: amenityNames });
    if (!p.property_group) {
      setAptChoice('__standalone__'); setListingType('entire'); setRoomNo('1');
    } else {
      setAptChoice(p.property_group);
      setListingType(p.blocks_group ? 'entire' : 'room');
      const m = (p.room_key || '').match(/_room_(\d+)$/);
      setRoomNo(m ? m[1] : '1');
    }
    setNewAptName('');
    setShowAddForm(false);
    setPendingImages([]); setUploadProgress(''); // don't carry staged images between edits
  };

  const cancelEdit = () => { setEditing(null); setForm({}); setPendingImages([]); setUploadProgress(''); resetSetup(); };

  const handlePendingImageSelect = (e) => {
    const files = Array.from(e.target.files);
    setPendingImages(prev => [...prev, ...files]);
    e.target.value = '';
  };

  const removePendingImage = (index) => {
    setPendingImages(prev => prev.filter((_, i) => i !== index));
  };

  const setPendingAsMain = (index) => {
    setPendingImages(prev => {
      const updated = [...prev];
      const [item] = updated.splice(index, 1);
      return [item, ...updated];
    });
  };

  // Nudge a staged (not-yet-uploaded) image earlier/later so it uploads in the
  // exact order chosen. The first one becomes the cover.
  const movePendingImage = (index, direction) => {
    setPendingImages(prev => {
      const target = index + direction;
      if (target < 0 || target >= prev.length) return prev;
      const updated = [...prev];
      [updated[index], updated[target]] = [updated[target], updated[index]];
      return updated;
    });
  };

  const handleSave = async () => {
    const isNew = !editing;
    const url = isNew ? `${API_URL}/admin/properties` : `${API_URL}/admin/properties/${editing}`;
    const method = isNew ? 'POST' : 'PUT';

    const amenities = (form.amenities || []).map(name => ({ name }));

    // Availability grouping — derive from the guided setup so bookings can't mix
    const standalone = aptChoice === '__standalone__';
    const gKey = standalone ? '' : (aptChoice === '__new__' ? slug(newAptName) : aptChoice);
    if (!standalone && !gKey) {
      showMessage('error', 'Please name the apartment (or choose “Standalone”).');
      return;
    }
    const grouping = standalone
      ? { property_group: null, blocks_group: false }
      : { property_group: gKey, blocks_group: listingType === 'entire' };

    // Don't let an apartment hold more rooms than its entire listing declares
    if (!standalone && listingType === 'room') {
      const entire = (properties || []).find(p => p.property_group === gKey && p.blocks_group);
      const existingRooms = (properties || []).filter(p => p.property_group === gKey && !p.blocks_group && p.room_key !== form.room_key);
      if (entire && Number(entire.bedrooms) > 0 && existingRooms.length >= Number(entire.bedrooms)) {
        showMessage('error', `"${gKey}" already has all ${entire.bedrooms} room(s). Raise the apartment's room count to add more.`);
        return;
      }
    }

    setLoading(true);
    try {
      const res = await authFetch(url, {
        method, headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, ...grouping, amenities })
      });
      const d = await res.json();
      if (d.success) {
        if (pendingImages.length > 0) {
          // Upload staged images for BOTH new and edited properties.
          // Use the key the backend actually returned (room_key can't change on edit).
          const targetKey = d.property?.room_key || (isNew ? form.room_key.toLowerCase().replace(/\s+/g, '_') : editing);
          let failed = '';
          for (let i = 0; i < pendingImages.length; i++) {
            setUploadProgress(`Uploading image ${i + 1} of ${pendingImages.length}...`);
            const fd = new FormData();
            fd.append('image', pendingImages[i]);
            try {
              const upRes = await authFetch(`${API_URL}/admin/properties/${targetKey}/images`, { method: 'POST', body: fd });
              const upData = await upRes.json();
              if (!upData.success) failed = upData.message || 'Image upload failed';
            } catch { failed = 'Could not reach the server to upload images'; }
          }
          setUploadProgress('');
          setPendingImages([]);
          if (failed) showMessage('error', `Saved, but image upload failed: ${failed}`);
          else showMessage('success', isNew ? 'Property created with images!' : 'Property updated — images added!');
        } else {
          showMessage('success', isNew ? 'Property created!' : 'Property updated!');
        }
        setEditing(null); setForm({}); setShowAddForm(false); resetSetup();
        fetch_();
      } else showMessage('error', d.message);
    } catch { showMessage('error', 'Save failed'); }
    finally { setLoading(false); }
  };

  const handleDeactivate = async (key) => {
    if (!window.confirm('Turn this listing OFF? It stays in your list but is hidden from the website.')) return;
    try {
      const res = await authFetch(`${API_URL}/admin/properties/${key}`, { method: 'DELETE' });
      const d = await res.json();
      if (d.success) { showMessage('success', 'Listing turned off'); fetch_(); }
      else showMessage('error', d.message);
    } catch { showMessage('error', 'Failed'); }
  };

  // ON/OFF toggle — turn a hidden listing back on (backend needs ≥1 image first)
  const handleActivate = async (p) => {
    try {
      const res = await authFetch(`${API_URL}/admin/properties/${p.room_key}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: true }),
      });
      const d = await res.json();
      if (d.success) { showMessage('success', 'Listing turned on'); fetch_(); }
      else showMessage('error', d.message || 'Could not activate');
    } catch { showMessage('error', 'Failed'); }
  };

  // Permanent hard delete — removes the row from the database (not reversible)
  const handleHardDelete = async (p) => {
    if (!window.confirm(`Permanently DELETE "${p.name}" from the database? This cannot be undone.`)) return;
    try {
      const res = await authFetch(`${API_URL}/admin/properties/${p.room_key}/permanent`, { method: 'DELETE' });
      const d = await res.json();
      if (d.success) { showMessage('success', 'Property permanently deleted'); fetch_(); }
      else showMessage('error', d.message || 'Delete failed');
    } catch { showMessage('error', 'Failed'); }
  };

  const handleUploadImage = async (room_key) => {
    const file = imageFile[room_key];
    if (!file) return;
    setUploadingImage(room_key);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const res = await authFetch(`${API_URL}/admin/properties/${room_key}/images`, { method: 'POST', body: fd });
      const d = await res.json();
      if (d.success) {
        showMessage('success', 'Image uploaded!');
        setImageFile(prev => { const next = { ...prev }; delete next[room_key]; return next; });
        fetch_();
      } else showMessage('error', d.message || 'Upload failed');
    } catch { showMessage('error', 'Upload failed — could not reach the server'); }
    finally { setUploadingImage(''); }
  };

  const handleRemoveImage = async (room_key, url) => {
    if (!window.confirm('Remove this image?')) return;
    // Optimistic: drop it from the UI immediately so it feels instant
    setProperties(prev => prev.map(p =>
      p.room_key === room_key ? { ...p, images: (p.images || []).filter(u => u !== url) } : p
    ));
    // Delete on the backend silently — only surface something if it fails
    try {
      const res = await authFetch(`${API_URL}/admin/properties/${room_key}/images`, {
        method: 'DELETE', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_url: url })
      });
      const d = await res.json();
      if (!d.success) { showMessage('error', d.message || 'Could not remove image'); fetch_(); }
    } catch { showMessage('error', 'Could not remove image — restoring'); fetch_(); }
  };

  // Reorder images by moving one left/right in the list. The website shows them
  // in exactly this order (the first image is the cover). We reorder the WHOLE
  // array and save it, so removing or moving one photo never forces touching the
  // others. Optimistic: the thumbnails rearrange instantly, then we persist.
  const moveImage = async (room_key, index, direction) => {
    const prop = properties.find(p => p.room_key === room_key);
    const images = [...(prop?.images || [])];
    const target = index + direction;
    if (target < 0 || target >= images.length) return; // already at an end
    [images[index], images[target]] = [images[target], images[index]]; // swap

    // Show the new order immediately
    setProperties(prev => prev.map(p =>
      p.room_key === room_key ? { ...p, images } : p
    ));
    // Persist the full ordered array (updateProperty stores it as-is)
    try {
      const res = await authFetch(`${API_URL}/admin/properties/${room_key}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ images }),
      });
      const d = await res.json();
      if (!d.success) { showMessage('error', d.message || 'Could not save the new order'); fetch_(); }
    } catch { showMessage('error', 'Could not save image order — restoring'); fetch_(); }
  };

  const fields = [
    { label: 'Room Key (unique id — auto-filled)', field: 'room_key', disabled: !!editing },
    { label: 'Display Name', field: 'name' },
    { label: 'Subtitle', field: 'subtitle' },
    { label: 'Category', field: 'category' },
    { label: 'Base Price (₦/night)', field: 'base_price', type: 'number' },
    { label: 'Max Guests', field: 'max_guests', type: 'number' },
    { label: 'Min Nights', field: 'min_nights', type: 'number' },
    { label: 'Bathrooms', field: 'bathrooms', type: 'number' },
    { label: 'Sort Order', field: 'sort_order', type: 'number' },
  ];

  // ── Derived values for the guided setup UI ──
  const apartments = [...new Set((properties || []).map(p => p.property_group).filter(Boolean))];
  const isStandalone = aptChoice === '__standalone__';
  const groupKey = isStandalone ? '' : (aptChoice === '__new__' ? slug(newAptName) : aptChoice);
  const groupDisplay = isStandalone ? '' : (aptChoice === '__new__' ? (newAptName || 'Apartment') : aptChoice);
  const entireListing = groupKey ? (properties || []).find(p => p.property_group === groupKey && p.blocks_group) : null;
  const roomCount = entireListing ? (Number(entireListing.bedrooms) || 0) : 0;
  const maxRooms = roomCount > 0 ? roomCount : 8;
  const takenRoomKeys = new Set((properties || []).filter(p => p.property_group === groupKey).map(p => p.room_key));
  const roomsInGroup = (properties || []).filter(p => p.property_group === groupKey && !p.blocks_group).length;
  const apartmentFull = !!entireListing && roomCount > 0 && roomsInGroup >= roomCount && !editing;

  // Keep property_group / blocks_group (and auto-fill the identity fields on a new listing) in sync with the setup choices
  const syncSetup = (over = {}) => {
    const choice = over.choice ?? aptChoice;
    const type = over.type ?? listingType;
    const room = over.room ?? roomNo;
    const newName = over.newName ?? newAptName;
    const standalone = choice === '__standalone__';
    const gKey = standalone ? '' : (choice === '__new__' ? slug(newName) : choice);
    const gDisp = standalone ? '' : (choice === '__new__' ? (newName || 'Apartment') : choice);
    setForm(f => {
      const next = { ...f, property_group: standalone ? '' : gKey, blocks_group: !standalone && type === 'entire' };
      if (!editing && !standalone) {
        if (type === 'entire') {
          next.room_key = gKey ? `${gKey}_entire` : '';
          next.name = `${gDisp} – Entire apartment`;
          next.category = 'Entire Apartment';
        } else {
          next.room_key = gKey ? `${gKey}_room_${room}` : '';
          next.name = `${gDisp} – Room ${room}`;
          next.category = 'Private Room';
        }
      }
      return next;
    });
  };

  return (
    <div className="space-y-6">
      {!editing && !showAddForm && (
        <button onClick={() => { setForm({}); resetSetup(); setShowAddForm(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all">
          <FiPlus /> Add New Property
        </button>
      )}

      {(editing || showAddForm) && (
        <div className="bg-white/5 border border-white/20 rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500 tracking-tight">{editing ? 'Edit Property' : 'Add New Property'}</h3>

          {/* ── STEP 1: Set up this listing (defines availability grouping) ── */}
          <div className="bg-purple-500/10 border border-purple-400/30 rounded-lg p-4 space-y-3">
            <p className="text-white font-semibold text-sm">1. Set up this listing</p>
            <p className="text-purple-300 text-xs leading-relaxed">
              Choose which apartment this belongs to and whether it's the <strong>whole place</strong> or a <strong>single room</strong>.
              This is what keeps calendars from clashing — booking the whole apartment blocks its rooms, and booking a room blocks the whole-apartment listing.
            </p>

            <div>
              <label className="block text-purple-200 text-sm mb-1">Apartment</label>
              <select value={aptChoice}
                onChange={e => { const v = e.target.value; setAptChoice(v); syncSetup({ choice: v }); }}
                className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
                <option value="__standalone__" className="bg-slate-800 text-white">Standalone — rented as one whole unit only</option>
                {apartments.map(a => <option key={a} value={a} className="bg-slate-800 text-white">{a}</option>)}
                <option value="__new__" className="bg-slate-800 text-white">➕ Add a new apartment…</option>
              </select>
            </div>

            {aptChoice === '__new__' && (
              <div>
                <label className="block text-purple-200 text-sm mb-1">New apartment name <span className="text-amber-300">*</span></label>
                <input type="text" value={newAptName}
                  onChange={e => { const v = e.target.value; setNewAptName(v); syncSetup({ newName: v }); }}
                  placeholder="e.g. Apartment 1"
                  className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                {groupKey && <p className="text-purple-400 text-xs mt-1">Saved under id <code className="text-amber-300">{groupKey}</code></p>}
              </div>
            )}

            {!isStandalone && (
              <div>
                <label className="block text-purple-200 text-sm mb-1">This listing is…</label>
                <select value={listingType}
                  onChange={e => { const v = e.target.value; setListingType(v); syncSetup({ type: v }); }}
                  className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
                  <option value="entire" className="bg-slate-800 text-white">The entire apartment (booking it blocks every room)</option>
                  <option value="room" className="bg-slate-800 text-white">A single room in this apartment</option>
                </select>
              </div>
            )}

            {!isStandalone && listingType === 'entire' && (
              <div>
                <label className="block text-purple-200 text-sm mb-1">How many rooms does this apartment have?</label>
                <input type="number" min="1" value={form.bedrooms || ''}
                  onChange={e => setForm({ ...form, bedrooms: e.target.value })}
                  placeholder="e.g. 3"
                  className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                <p className="text-purple-400 text-xs mt-1">Sets how many rooms (Room 1…Room N) you can add for this apartment later.</p>
              </div>
            )}

            {!isStandalone && listingType === 'room' && (
              <div>
                <label className="block text-purple-200 text-sm mb-1">Which room?</label>
                <select value={roomNo}
                  onChange={e => { const v = e.target.value; setRoomNo(v); syncSetup({ room: v }); }}
                  className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
                  {Array.from({ length: maxRooms }, (_, i) => String(i + 1)).map(n => {
                    const rk = `${groupKey}_room_${n}`;
                    const taken = takenRoomKeys.has(rk) && !(editing && form.room_key === rk);
                    return <option key={n} value={n} disabled={taken} className="bg-slate-800 text-white">Room {n}{taken ? ' — already added' : ''}</option>;
                  })}
                </select>
                {apartmentFull
                  ? <p className="text-red-300 text-xs mt-1">All {roomCount} rooms have already been added for this apartment. Raise the apartment's room count (edit the entire listing) to add more.</p>
                  : entireListing
                    ? <p className="text-purple-400 text-xs mt-1">"{entireListing.name}" has {roomCount} room(s).</p>
                    : <p className="text-amber-300 text-xs mt-1">Tip: add the entire apartment first so the room count is known.</p>}
              </div>
            )}
          </div>

          {/* ── STEP 2: Details & pricing ── */}
          <p className="text-white font-semibold text-sm pt-1">2. Details &amp; pricing</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.map(({ label, field, type, disabled }) => (
              <div key={field}>
                <label className="block text-purple-200 text-sm mb-1">{label}</label>
                <input type={type || 'text'} value={form[field] || ''} disabled={disabled}
                  onChange={e => setForm({ ...form, [field]: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-purple-500" />
              </div>
            ))}
            {(isStandalone || listingType === 'room') && (
              <div>
                <label className="block text-purple-200 text-sm mb-1">{isStandalone ? 'Bedrooms' : 'Bedrooms in this room'}</label>
                <input type="number" min="0" value={form.bedrooms || ''}
                  onChange={e => setForm({ ...form, bedrooms: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
              </div>
            )}
          </div>
          <div>
            <label className="block text-purple-200 text-sm mb-1">Description</label>
            <textarea value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} rows={3}
              className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
          </div>

          {/* ── Image Uploader ── */}
          <div>
            <label className="block text-purple-200 text-sm mb-1">Property Images</label>
            <p className="text-purple-400 text-xs mb-3">
              Select one or more images — they upload in the order shown here, and the <span className="text-amber-400 font-semibold">first image</span> is the cover photo.
              Use the arrows to arrange them, or hover an image and click <span className="text-amber-400 font-semibold">Set as Main</span> to jump it to the front.
            </p>

            {pendingImages.length > 0 && (
              <div className="flex flex-wrap gap-3 mb-4">
                {pendingImages.map((file, i) => (
                  <div key={i} className="w-24 shrink-0">
                    <div className="relative group w-24 h-24">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`preview-${i}`}
                        className={`w-24 h-24 object-cover rounded-xl border-2 transition ${i === 0 ? 'border-amber-400' : 'border-white/20'}`}
                      />
                      {i === 0 && (
                        <span className="absolute top-1 left-1 bg-amber-500 text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                          Main
                        </span>
                      )}
                      <div className="absolute inset-0 rounded-xl bg-black/50 flex flex-col items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {i !== 0 && (
                          <button type="button" onClick={() => setPendingAsMain(i)}
                            className="bg-amber-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-full w-fit">
                            Set as Main
                          </button>
                        )}
                        <button type="button" onClick={() => removePendingImage(i)}
                          className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full w-fit">
                          Remove
                        </button>
                      </div>
                    </div>
                    {pendingImages.length > 1 && (
                      <div className="flex items-center justify-between mt-1 gap-1">
                        <button type="button" onClick={() => movePendingImage(i, -1)} disabled={i === 0}
                          className="flex-1 flex items-center justify-center py-1 bg-white/10 hover:bg-white/20 rounded text-purple-200 disabled:opacity-25 disabled:cursor-not-allowed"
                          title="Move earlier">
                          <FiChevronLeft size={14} />
                        </button>
                        <span className="text-[10px] text-purple-400 w-3 text-center">{i + 1}</span>
                        <button type="button" onClick={() => movePendingImage(i, 1)} disabled={i === pendingImages.length - 1}
                          className="flex-1 flex items-center justify-center py-1 bg-white/10 hover:bg-white/20 rounded text-purple-200 disabled:opacity-25 disabled:cursor-not-allowed"
                          title="Move later">
                          <FiChevronRight size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <label className="inline-flex items-center gap-2 cursor-pointer px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-purple-200 text-sm transition">
              <FiUpload size={14} />
              {pendingImages.length === 0 ? 'Select Images' : `Add More (${pendingImages.length} selected)`}
              <input type="file" accept="image/*" multiple className="sr-only" onChange={handlePendingImageSelect} />
            </label>

            {uploadProgress && (
              <p className="mt-3 text-amber-300 text-sm font-medium">{uploadProgress}</p>
            )}
          </div>

          <div>
            <label className="block text-purple-200 text-sm mb-2">Amenities — tick all that apply</label>
            <AmenitiesPicker selected={form.amenities || []} onChange={v => setForm({ ...form, amenities: v })} />
          </div>

          {/* ── Calendar Sync (iCal) ── */}
          <div>
            <label className="block text-purple-200 text-sm mb-1">Calendar Sync — iCal URLs (optional)</label>
            <p className="text-purple-400 text-xs mb-2">
              Paste the calendar export links from Airbnb / Booking.com — <span className="text-amber-400 font-semibold">one per line</span>.
              Dates booked on those sites get blocked here automatically, so you never get double-booked. Leave empty if you only take bookings on this site.
            </p>
            <textarea
              value={Array.isArray(form.ical_urls) ? form.ical_urls.join('\n') : (form.ical_urls || '')}
              onChange={e => setForm({ ...form, ical_urls: e.target.value })}
              rows={3}
              placeholder={'https://www.airbnb.com/calendar/ical/12345.ics?s=...\nhttps://ical.booking.com/v1/export?t=...'}
              className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-purple-500" />
          </div>
          <div className="flex gap-3">
            <button onClick={handleSave} disabled={loading}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all flex items-center gap-2 disabled:opacity-50">
              <FiSave /> {uploadProgress ? uploadProgress : editing ? 'Save Changes' : 'Create Property'}
            </button>
            <button onClick={() => { cancelEdit(); setShowAddForm(false); }}
              className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all">
              Cancel
            </button>
          </div>
        </div>
      )}

      {loading && <div className="text-center text-purple-200">Loading...</div>}

      {/* While editing one property, show only that property's card (hide the rest) */}
      {properties.filter(p => !editing || p.room_key === editing).map(p => (
        <div key={p.room_key} className={`bg-white/5 border rounded-xl p-5 ${p.is_active ? 'border-white/20' : 'border-red-500/30 opacity-60'}`}>
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center gap-3">
                <span className="text-white font-bold text-lg">{p.name}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs ${p.is_active ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                  {p.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="text-purple-300 text-sm mt-1">
                <span className="mr-4">Key: <code className="text-amber-400">{p.room_key}</code></span>
                <span className="mr-4">₦{Number(p.base_price).toLocaleString()}/night</span>
                <span className="mr-4">Max: {p.max_guests} guests</span>
                <span>Min: {p.min_nights} night(s)</span>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              {editing !== p.room_key && (
                <>
                  <button
                    onClick={() => (p.is_active ? handleDeactivate(p.room_key) : handleActivate(p))}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${p.is_active ? 'bg-green-500/20 hover:bg-green-500/30 text-green-300' : 'bg-white/10 hover:bg-white/20 text-purple-200'}`}
                    title={p.is_active ? 'Turn OFF (hide from website)' : 'Turn ON (show on website)'}>
                    {p.is_active ? <FiToggleRight size={18} /> : <FiToggleLeft size={18} />}
                    {p.is_active ? 'On' : 'Off'}
                  </button>
                  <button onClick={() => startEdit(p)} className="p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg" title="Edit"><FiEdit2 /></button>
                  <button onClick={() => handleHardDelete(p)} className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg" title="Delete permanently"><FiTrash2 /></button>
                </>
              )}
            </div>
          </div>

          {/* Images */}
          <div className="mt-3">
            <p className="text-purple-300 text-sm font-medium mb-1">Images ({(p.images || []).length})</p>
            {(p.images || []).length > 1 && (
              <p className="text-purple-400/70 text-xs mb-2">
                Use the arrows to arrange the order guests see. The first photo is the <span className="text-amber-400 font-semibold">cover</span>. Removing one never disturbs the rest.
              </p>
            )}
            <div className="flex flex-wrap gap-3 mb-3">
              {(p.images || []).map((img, i) => (
                <div key={img} className="relative group w-24">
                  <div className="relative w-24 h-24">
                    <img src={img} alt={`Property photo ${i + 1}`} className="w-24 h-24 object-cover rounded-lg border border-white/20" />
                    {i === 0 && (
                      <span className="absolute top-1 left-1 bg-amber-500 text-slate-900 text-[10px] font-bold px-1.5 py-0.5 rounded shadow">Cover</span>
                    )}
                    <button onClick={() => handleRemoveImage(p.room_key, img)}
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Remove this image">
                      <FiX size={10} />
                    </button>
                  </div>
                  {/* Reorder controls — move this photo earlier/later without deleting */}
                  {(p.images || []).length > 1 && (
                    <div className="flex items-center justify-between mt-1 gap-1">
                      <button onClick={() => moveImage(p.room_key, i, -1)} disabled={i === 0}
                        className="flex-1 flex items-center justify-center py-1 bg-white/10 hover:bg-white/20 rounded text-purple-200 disabled:opacity-25 disabled:cursor-not-allowed"
                        title="Move earlier">
                        <FiChevronLeft size={14} />
                      </button>
                      <span className="text-[10px] text-purple-400 w-3 text-center">{i + 1}</span>
                      <button onClick={() => moveImage(p.room_key, i, 1)} disabled={i === (p.images || []).length - 1}
                        className="flex-1 flex items-center justify-center py-1 bg-white/10 hover:bg-white/20 rounded text-purple-200 disabled:opacity-25 disabled:cursor-not-allowed"
                        title="Move later">
                        <FiChevronRight size={14} />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-2 items-center flex-wrap">
              <input type="file" accept="image/*" onChange={e => { const f = e.target.files[0]; if (f) setImageFile(prev => ({ ...prev, [p.room_key]: f })); }} className="text-sm text-purple-300" />
              {imageFile[p.room_key] && (
                <button onClick={() => handleUploadImage(p.room_key)} disabled={uploadingImage === p.room_key}
                  className="flex items-center gap-1 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm disabled:opacity-50">
                  <FiUpload size={14} /> {uploadingImage === p.room_key ? 'Uploading...' : 'Upload'}
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// ─── TAB: Discount Codes ──────────────────────────────────────────
const EMPTY_DISCOUNT_FORM = {
  code: '', type: 'percentage', value: '', description: '', expiry_date: '', usage_limit: '',
  min_nights: '', min_amount: '', applies_to: [],
};

const DiscountsTab = ({ showMessage }) => {
  const [discounts, setDiscounts] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_DISCOUNT_FORM);

  const fetch_ = async () => {
    setLoading(true);
    try {
      const res = await authFetch(`${API_URL}/admin/discounts`);
      const d = await res.json();
      if (d.success) setDiscounts(d.discounts || []);
    } catch { showMessage('error', 'Failed to load'); }
    finally { setLoading(false); }
  };

  const fetchRooms = async () => {
    try {
      const res = await fetch(`${API_URL}/properties`);
      const d = await res.json();
      if (d.success) setRooms(d.properties || []);
    } catch { /* non-fatal — Applies To just won't have options */ }
  };

  useEffect(() => { fetch_(); fetchRooms(); }, []);

  const startEdit = (d) => {
    setEditingId(d.id);
    setForm({
      code: d.code, type: d.type, value: d.value, description: d.description || '',
      expiry_date: d.expiry_date || '', usage_limit: d.usage_limit ?? '',
      min_nights: d.min_nights ?? '', min_amount: d.min_amount ?? '', applies_to: d.applies_to || [],
    });
    setShowForm(true);
  };

  const cancelForm = () => { setShowForm(false); setEditingId(null); setForm(EMPTY_DISCOUNT_FORM); };

  const toggleRoom = (room_key) => {
    setForm(f => ({
      ...f,
      applies_to: f.applies_to.includes(room_key) ? f.applies_to.filter(r => r !== room_key) : [...f.applies_to, room_key],
    }));
  };

  const handleSave = async () => {
    if (!form.code || !form.value) { showMessage('error', 'Code and value are required'); return; }
    setLoading(true);
    try {
      const url = editingId ? `${API_URL}/admin/discounts/${editingId}` : `${API_URL}/admin/discounts`;
      const method = editingId ? 'PUT' : 'POST';
      const res = await authFetch(url, {
        method, headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          value: Number(form.value),
          usage_limit: form.usage_limit ? Number(form.usage_limit) : null,
          min_nights: form.min_nights ? Number(form.min_nights) : 1,
          min_amount: form.min_amount ? Number(form.min_amount) : 0,
          applies_to: form.applies_to.length ? form.applies_to : null,
        })
      });
      const d = await res.json();
      if (d.success) {
        showMessage('success', editingId ? 'Discount code updated!' : 'Discount code created!');
        cancelForm();
        fetch_();
      } else showMessage('error', d.message);
    } catch { showMessage('error', 'Failed'); }
    finally { setLoading(false); }
  };

  const handleToggle = async (id, is_active) => {
    try {
      const res = await authFetch(`${API_URL}/admin/discounts/${id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !is_active })
      });
      const d = await res.json();
      if (d.success) { fetch_(); } else showMessage('error', d.message);
    } catch { showMessage('error', 'Failed'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this code?')) return;
    try {
      const res = await authFetch(`${API_URL}/admin/discounts/${id}`, { method: 'DELETE' });
      const d = await res.json();
      if (d.success) { showMessage('success', 'Deleted'); fetch_(); } else showMessage('error', d.message);
    } catch { showMessage('error', 'Failed'); }
  };

  return (
    <div className="space-y-6">
      <button onClick={() => (showForm ? cancelForm() : setShowForm(true))}
        className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg">
        <FiPlus /> {showForm ? 'Cancel' : 'New Discount Code'}
      </button>

      {showForm && (
        <div className="bg-white/5 border border-white/20 rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500 tracking-tight">{editingId ? 'Edit Discount Code' : 'Create Discount Code'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: 'Code (e.g. WELCOME20)', field: 'code', placeholder: 'SUMMER10' },
              { label: 'Description', field: 'description', placeholder: 'Summer promo' },
              { label: 'Expiry Date', field: 'expiry_date', type: 'date' },
              { label: 'Usage Limit (blank = unlimited)', field: 'usage_limit', type: 'number', placeholder: '100' },
              { label: 'Min Nights (e.g. 7 for a week+)', field: 'min_nights', type: 'number', placeholder: '1' },
              { label: 'Min Booking Amount (₦, blank = none)', field: 'min_amount', type: 'number', placeholder: '0' },
            ].map(({ label, field, type, placeholder }) => (
              <div key={field}>
                <label className="block text-purple-200 text-sm mb-1">{label}</label>
                <input type={type || 'text'} value={form[field]} placeholder={placeholder || ''}
                  onChange={e => setForm({ ...form, [field]: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
              </div>
            ))}
            <div>
              <label className="block text-purple-200 text-sm mb-1">Type</label>
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
                className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
                <option value="percentage" className="bg-slate-800">Percentage (%)</option>
                <option value="fixed" className="bg-slate-800">Fixed Amount (₦)</option>
              </select>
            </div>
            <div>
              <label className="block text-purple-200 text-sm mb-1">Value ({form.type === 'percentage' ? '%' : '₦'})</label>
              <input type="number" value={form.value} placeholder={form.type === 'percentage' ? '10' : '5000'}
                onChange={e => setForm({ ...form, value: e.target.value })}
                className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
          </div>
          <div>
            <label className="block text-purple-200 text-sm mb-2">Applies To — leave blank for all rooms</label>
            <div className="flex flex-wrap gap-2">
              {rooms.map(r => (
                <label key={r.room_key}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border cursor-pointer text-sm select-none
                    ${form.applies_to.includes(r.room_key)
                      ? 'bg-purple-600/40 border-purple-400 text-white'
                      : 'bg-white/5 border-white/20 text-purple-200 hover:border-white/40'}`}>
                  <input type="checkbox" checked={form.applies_to.includes(r.room_key)}
                    onChange={() => toggleRoom(r.room_key)} className="sr-only" />
                  {r.name}
                </label>
              ))}
              {rooms.length === 0 && <span className="text-purple-400 text-sm">No active rooms found</span>}
            </div>
          </div>
          <button onClick={handleSave} disabled={loading}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg disabled:opacity-50">
            {loading ? 'Saving...' : (editingId ? 'Save Changes' : 'Create Code')}
          </button>
        </div>
      )}

      {loading && !discounts.length ? (
        <div className="text-center text-purple-200">Loading...</div>
      ) : (
        <div className="space-y-3">
          {discounts.map(d => (
            <div key={d.id} className={`bg-white/5 border rounded-xl p-4 ${d.is_active ? 'border-white/20' : 'border-white/10 opacity-60'}`}>
              <div className="flex justify-between items-center flex-wrap gap-2">
                <div>
                  <span className="font-bold text-white font-mono text-lg">{d.code}</span>
                  <span className="ml-3 text-green-300 font-semibold">
                    {d.type === 'percentage' ? `${d.value}% off` : `₦${Number(d.value).toLocaleString()} off`}
                  </span>
                  {d.description && <span className="ml-3 text-purple-400 text-sm">{d.description}</span>}
                </div>
                <div className="text-purple-300 text-sm flex gap-4 flex-wrap">
                  <span>Used: {d.times_used}/{d.usage_limit ?? '∞'}</span>
                  <span>Min: {d.min_nights || 1} night(s){d.min_amount > 0 ? `, ₦${Number(d.min_amount).toLocaleString()}+` : ''}</span>
                  <span>{d.applies_to?.length ? `Applies to: ${d.applies_to.join(', ')}` : 'All rooms'}</span>
                  {d.expiry_date && <span>Expires: {new Date(d.expiry_date).toLocaleDateString()}</span>}
                  <span className={d.is_active ? 'text-green-300' : 'text-red-300'}>{d.is_active ? 'Active' : 'Inactive'}</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => startEdit(d)} className="p-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-lg">
                    <FiEdit2 />
                  </button>
                  <button onClick={() => handleToggle(d.id, d.is_active)}
                    className="p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg text-sm">
                    {d.is_active ? <FiToggleRight /> : <FiToggleLeft />}
                  </button>
                  <button onClick={() => handleDelete(d.id)} className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg">
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {discounts.length === 0 && <div className="text-center text-purple-300 py-8">No discount codes yet</div>}
        </div>
      )}
    </div>
  );
};

// ─── TAB: Content Editor ──────────────────────────────────────────
const ContentTab = ({ showMessage }) => {
  const [activeSection, setActiveSection] = useState('about');
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetch_ = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/content`);
      const d = await res.json();
      if (d.success) setContent(d.content || {});
    } catch { showMessage('error', 'Failed to load content'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch_(); }, []);

  const handleSave = async (key, value) => {
    setSaving(true);
    try {
      const res = await authFetch(`${API_URL}/admin/content/${key}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value })
      });
      const d = await res.json();
      if (d.success) { showMessage('success', 'Content saved!'); fetch_(); }
      else showMessage('error', d.message);
    } catch { showMessage('error', 'Save failed'); }
    finally { setSaving(false); }
  };

  // About editor
  const AboutEditor = () => {
    const current = content.about?.value || { paragraphs: [] };
    const [paragraphs, setParagraphs] = useState(current.paragraphs || []);

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500 tracking-tight">About Us Text</h3>
        <p className="text-purple-300 text-sm">Edit each paragraph. Use &lt;strong&gt; tags for bold text.</p>
        {paragraphs.map((para, i) => (
          <div key={i} className="relative">
            <div className="flex justify-between items-center mb-1">
              <label className="text-purple-300 text-sm">Paragraph {i + 1}</label>
              <button onClick={() => setParagraphs(paragraphs.filter((_, j) => j !== i))}
                className="text-red-400 text-xs hover:text-red-300">Remove</button>
            </div>
            <textarea value={para} rows={4} onChange={e => {
              const updated = [...paragraphs]; updated[i] = e.target.value; setParagraphs(updated);
            }} className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
          </div>
        ))}
        <button onClick={() => setParagraphs([...paragraphs, ''])}
          className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm">
          <FiPlus /> Add Paragraph
        </button>
        <button onClick={() => handleSave('about', { paragraphs })} disabled={saving}
          className="flex items-center gap-2 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg disabled:opacity-50">
          <FiSave /> {saving ? 'Saving...' : 'Save About Content'}
        </button>
      </div>
    );
  };

  // Getting Around editor
  const GettingAroundEditor = () => {
    const current = content.getting_around?.value || { categories: [] };
    // Seed from the bundled defaults when the DB row is empty, so the owner
    // sees and edits the real "current stuff" instead of a blank form. Once
    // they save, this becomes the site_content override the public page merges.
    const [categories, setCategories] = useState(
      current.categories?.length ? current.categories : DEFAULT_GETTING_AROUND
    );

    const updateCategory = (i, field, val) => {
      const updated = [...categories];
      updated[i] = { ...updated[i], [field]: val };
      setCategories(updated);
    };

    const updateItem = (catI, itemI, field, val) => {
      const updated = [...categories];
      updated[catI].items[itemI] = { ...updated[catI].items[itemI], [field]: val };
      setCategories(updated);
    };

    const addItem = (catI) => {
      const updated = [...categories];
      updated[catI].items = [...(updated[catI].items || []), { name: '', time: '', link: '' }];
      setCategories(updated);
    };

    const removeItem = (catI, itemI) => {
      const updated = [...categories];
      updated[catI].items = updated[catI].items.filter((_, j) => j !== itemI);
      setCategories(updated);
    };

    return (
      <div className="space-y-6">
        <h3 className="text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500 tracking-tight">Getting Around Content</h3>
        {categories.map((cat, catI) => (
          <div key={catI} className="bg-white/5 rounded-xl p-4 border border-white/20">
            <input value={cat.title} onChange={e => updateCategory(catI, 'title', e.target.value)}
              placeholder="Category Title"
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white font-semibold mb-3 focus:outline-none" />
            <div className="space-y-2">
              {(cat.items || []).map((item, itemI) => (
                <div key={itemI} className="flex gap-2 items-center flex-wrap">
                  <input value={item.name} onChange={e => updateItem(catI, itemI, 'name', e.target.value)}
                    placeholder="Place name" className="flex-1 min-w-[150px] px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none" />
                  <input value={item.time} onChange={e => updateItem(catI, itemI, 'time', e.target.value)}
                    placeholder="15 mins" className="w-24 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none" />
                  <input value={item.link || ''} onChange={e => updateItem(catI, itemI, 'link', e.target.value)}
                    placeholder="Google Maps link (optional)" className="flex-1 min-w-[200px] px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none" />
                  <button onClick={() => removeItem(catI, itemI)} className="text-red-400 hover:text-red-300"><FiX /></button>
                </div>
              ))}
            </div>
            <button onClick={() => addItem(catI)} className="mt-2 text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1">
              <FiPlus size={14} /> Add Place
            </button>
          </div>
        ))}
        <button onClick={() => handleSave('getting_around', { categories })} disabled={saving}
          className="flex items-center gap-2 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg disabled:opacity-50">
          <FiSave /> {saving ? 'Saving...' : 'Save Getting Around Content'}
        </button>
      </div>
    );
  };

  // House Rules editor
  const HouseRulesEditor = () => {
    const current = content.house_rules?.value || { rules: [] };
    const [rules, setRules] = useState(current.rules || []);

    const updateRule = (i, field, val) => {
      const updated = [...rules];
      updated[i] = { ...updated[i], [field]: val };
      setRules(updated);
    };

    const addRule = () => setRules([...rules, { title: '', category: '', content: '', extra: '', details: [] }]);
    const removeRule = (i) => setRules(rules.filter((_, j) => j !== i));

    const addDetail = (ruleI) => {
      const updated = [...rules];
      updated[ruleI].details = [...(updated[ruleI].details || []), { subtitle: '', text: '', extra: '', list: [] }];
      setRules(updated);
    };
    const updateDetail = (ruleI, detI, field, val) => {
      const updated = [...rules];
      updated[ruleI].details[detI] = { ...updated[ruleI].details[detI], [field]: val };
      setRules(updated);
    };
    const removeDetail = (ruleI, detI) => {
      const updated = [...rules];
      updated[ruleI].details = updated[ruleI].details.filter((_, j) => j !== detI);
      setRules(updated);
    };

    const addListItem = (ruleI, detI) => {
      const updated = [...rules];
      updated[ruleI].details[detI].list = [...(updated[ruleI].details[detI].list || []), ''];
      setRules(updated);
    };
    const updateListItem = (ruleI, detI, itemI, val) => {
      const updated = [...rules];
      updated[ruleI].details[detI].list[itemI] = val;
      setRules(updated);
    };
    const removeListItem = (ruleI, detI, itemI) => {
      const updated = [...rules];
      updated[ruleI].details[detI].list = updated[ruleI].details[detI].list.filter((_, j) => j !== itemI);
      setRules(updated);
    };

    return (
      <div className="space-y-6">
        <h3 className="text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500 tracking-tight">House Rules</h3>
        <p className="text-purple-300 text-sm">Each rule is shown as a card on the House Rules page. "Details" are optional expandable sub-sections (e.g. for longer rules like power supply).</p>
        {rules.map((rule, i) => (
          <div key={i} className="bg-white/5 rounded-xl p-4 border border-white/20 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-purple-300 text-sm font-semibold">Rule {i + 1}</span>
              <button onClick={() => removeRule(i)} className="text-red-400 text-xs hover:text-red-300">Remove Rule</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input value={rule.title || ''} onChange={e => updateRule(i, 'title', e.target.value)}
                placeholder="Title (e.g. Smoking)"
                className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none" />
              <input value={rule.category || ''} onChange={e => updateRule(i, 'category', e.target.value)}
                placeholder="Category (e.g. Health & Safety)"
                className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none" />
            </div>
            <textarea value={rule.content || ''} onChange={e => updateRule(i, 'content', e.target.value)} rows={3}
              placeholder="Main rule text"
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none" />
            <textarea value={rule.extra || ''} onChange={e => updateRule(i, 'extra', e.target.value)} rows={2}
              placeholder="Extra text (optional)"
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none" />

            <div className="pl-4 border-l-2 border-amber-500/20 space-y-3">
              <span className="text-purple-300 text-xs font-semibold uppercase">Expandable Details (optional)</span>
              {(rule.details || []).map((det, di) => (
                <div key={di} className="bg-slate-700/30 rounded-lg p-3 space-y-2">
                  <div className="flex justify-between items-center gap-2">
                    <input value={det.subtitle || ''} onChange={e => updateDetail(i, di, 'subtitle', e.target.value)}
                      placeholder="Subtitle (optional)"
                      className="flex-1 px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-xs focus:outline-none" />
                    <button onClick={() => removeDetail(i, di)} className="text-red-400 hover:text-red-300"><FiX size={14} /></button>
                  </div>
                  <textarea value={det.text || ''} onChange={e => updateDetail(i, di, 'text', e.target.value)} rows={2}
                    placeholder="Text"
                    className="w-full px-2 py-1 bg-white/5 border border-white/10 rounded text-white text-xs focus:outline-none" />
                  <textarea value={det.extra || ''} onChange={e => updateDetail(i, di, 'extra', e.target.value)} rows={2}
                    placeholder="Extra text (optional)"
                    className="w-full px-2 py-1 bg-white/5 border border-white/10 rounded text-white text-xs focus:outline-none" />
                  <div className="space-y-1">
                    {(det.list || []).map((item, li) => (
                      <div key={li} className="flex items-center gap-2">
                        <input value={item} onChange={e => updateListItem(i, di, li, e.target.value)}
                          placeholder="List item"
                          className="flex-1 px-2 py-1 bg-white/5 border border-white/10 rounded text-white text-xs focus:outline-none" />
                        <button onClick={() => removeListItem(i, di, li)} className="text-red-400 hover:text-red-300"><FiX size={12} /></button>
                      </div>
                    ))}
                    <button onClick={() => addListItem(i, di)} className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1">
                      <FiPlus size={12} /> Add List Item
                    </button>
                  </div>
                </div>
              ))}
              <button onClick={() => addDetail(i)} className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1">
                <FiPlus size={14} /> Add Detail Block
              </button>
            </div>
          </div>
        ))}
        <button onClick={addRule} className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm">
          <FiPlus /> Add Rule
        </button>
        <button onClick={() => handleSave('house_rules', { rules })} disabled={saving}
          className="flex items-center gap-2 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg disabled:opacity-50">
          <FiSave /> {saving ? 'Saving...' : 'Save House Rules'}
        </button>
      </div>
    );
  };

  // Footer editor
  const FooterEditor = () => {
    const current = content.footer?.value || {};
    const [phones, setPhones] = useState(current.phones || []);
    const [email, setEmail] = useState(current.email || '');
    const [address, setAddress] = useState(current.address || '');
    const [socials, setSocials] = useState(current.socials || {});
    const socialKeys = ['whatsapp', 'tiktok', 'facebook', 'instagram', 'twitter'];

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500 tracking-tight">Footer</h3>
        <p className="text-purple-300 text-sm">Phone numbers, email, address and social links shown in the site footer. Leave a social link blank to hide its icon.</p>

        <div className="space-y-2">
          <label className="text-purple-300 text-sm font-semibold">Phone Numbers</label>
          {phones.map((p, i) => (
            <div key={i} className="flex gap-2 items-center flex-wrap">
              <input value={p.label || ''} onChange={e => { const u = [...phones]; u[i] = { ...u[i], label: e.target.value }; setPhones(u); }}
                placeholder="Label (e.g. Phone)" className="w-32 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none" />
              <input value={p.number || ''} onChange={e => { const u = [...phones]; u[i] = { ...u[i], number: e.target.value }; setPhones(u); }}
                placeholder="+234 ..." className="flex-1 min-w-[160px] px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none" />
              <button onClick={() => setPhones(phones.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-300"><FiX /></button>
            </div>
          ))}
          <button onClick={() => setPhones([...phones, { label: '', number: '' }])} className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1"><FiPlus size={14} /> Add Phone</button>
        </div>

        <div>
          <label className="text-purple-300 text-sm">Email</label>
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="engeemosbookastay@gmail.com"
            className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white text-sm focus:outline-none" />
        </div>
        <div>
          <label className="text-purple-300 text-sm">Address</label>
          <input value={address} onChange={e => setAddress(e.target.value)} placeholder="Olomore, Abeokuta, Ogun State"
            className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white text-sm focus:outline-none" />
        </div>

        <div className="space-y-2">
          <label className="text-purple-300 text-sm font-semibold">Social Links (full URLs)</label>
          {socialKeys.map(k => (
            <div key={k} className="flex gap-2 items-center">
              <span className="w-24 text-purple-200 text-sm capitalize">{k}</span>
              <input value={socials[k] || ''} onChange={e => setSocials({ ...socials, [k]: e.target.value })}
                placeholder={k === 'whatsapp' ? 'https://wa.me/234...' : `https://...`}
                className="flex-1 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none" />
            </div>
          ))}
          <p className="text-purple-400 text-xs">WhatsApp: use a wa.me link (e.g. https://wa.me/2348066215431).</p>
        </div>

        <button onClick={() => handleSave('footer', { phones, email, address, socials })} disabled={saving}
          className="flex items-center gap-2 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg disabled:opacity-50">
          <FiSave /> {saving ? 'Saving...' : 'Save Footer'}
        </button>
      </div>
    );
  };

  // Comparison table editor
  const ComparisonEditor = () => {
    const current = content.comparison?.value || {};
    const [heading, setHeading] = useState(current.heading || '');
    const [subheading, setSubheading] = useState(current.subheading || '');
    const [columns, setColumns] = useState(current.columns || { ours: 'Book Direct With Us', theirs: 'Booking.com / 3rd-Party' });
    const [rows, setRows] = useState(current.rows || []);
    const [footnote, setFootnote] = useState(current.footnote || '');
    const updateRow = (i, field, val) => { const u = [...rows]; u[i] = { ...u[i], [field]: val }; setRows(u); };

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500 tracking-tight">Homepage Comparison Table</h3>
        <p className="text-purple-300 text-sm">Show guests what they save by booking direct vs third-party sites (e.g. Booking.com).</p>
        <input value={heading} onChange={e => setHeading(e.target.value)} placeholder="Heading (e.g. Book Direct & Save)"
          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white font-semibold text-sm focus:outline-none" />
        <input value={subheading} onChange={e => setSubheading(e.target.value)} placeholder="Subheading (optional)"
          className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white text-sm focus:outline-none" />
        <div className="grid grid-cols-2 gap-2">
          <input value={columns.ours || ''} onChange={e => setColumns({ ...columns, ours: e.target.value })} placeholder="Our column header"
            className="px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white text-sm focus:outline-none" />
          <input value={columns.theirs || ''} onChange={e => setColumns({ ...columns, theirs: e.target.value })} placeholder="Their column header"
            className="px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white text-sm focus:outline-none" />
        </div>
        <div className="space-y-2">
          {rows.map((row, i) => (
            <div key={i} className="flex gap-2 items-center flex-wrap">
              <input value={row.label || ''} onChange={e => updateRow(i, 'label', e.target.value)} placeholder="Row label"
                className="flex-1 min-w-[140px] px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none" />
              <input value={row.ours || ''} onChange={e => updateRow(i, 'ours', e.target.value)} placeholder="Ours"
                className="w-32 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none" />
              <input value={row.theirs || ''} onChange={e => updateRow(i, 'theirs', e.target.value)} placeholder="Theirs"
                className="w-32 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none" />
              <button onClick={() => setRows(rows.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-300"><FiX /></button>
            </div>
          ))}
          <button onClick={() => setRows([...rows, { label: '', ours: '', theirs: '' }])} className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1"><FiPlus size={14} /> Add Row</button>
        </div>
        <input value={footnote} onChange={e => setFootnote(e.target.value)} placeholder="Footnote (optional)"
          className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white text-sm focus:outline-none" />
        <button onClick={() => handleSave('comparison', { heading, subheading, columns, rows, footnote })} disabled={saving}
          className="flex items-center gap-2 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg disabled:opacity-50">
          <FiSave /> {saving ? 'Saving...' : 'Save Comparison'}
        </button>
      </div>
    );
  };

  // Homepage carousel editor
  const CarouselEditor = () => {
    const current = content.home_hero?.value || {};
    const [slides, setSlides] = useState(current.slides || []);
    const [uploading, setUploading] = useState(-1);
    const updateSlide = (i, field, val) => { const u = [...slides]; u[i] = { ...u[i], [field]: val }; setSlides(u); };
    const removeSlide = (i) => setSlides(slides.filter((_, j) => j !== i));
    const moveSlide = (i, dir) => {
      const j = i + dir;
      if (j < 0 || j >= slides.length) return;
      const u = [...slides];
      [u[i], u[j]] = [u[j], u[i]];
      setSlides(u);
    };

    const uploadImage = async (i, file) => {
      if (!file) return;
      setUploading(i);
      try {
        const fd = new FormData();
        fd.append('image', file);
        const res = await authFetch(`${API_URL}/admin/content/upload-image`, { method: 'POST', body: fd });
        const d = await res.json();
        if (d.success && d.url) {
          const u = [...slides]; u[i] = { ...u[i], url: d.url }; setSlides(u);
          showMessage('success', 'Image uploaded');
        } else showMessage('error', d.message || 'Upload failed');
      } catch { showMessage('error', 'Upload failed'); }
      finally { setUploading(-1); }
    };

    // A slide only appears on the site once it has an uploaded photo.
    const withImages = slides.filter((s) => s && s.url).length;

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500 tracking-tight">Homepage Carousel</h3>

        {/* How it works — explains why this may look empty and how to take control */}
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-sm text-amber-100 space-y-1">
          <p className="font-semibold text-amber-300">How the carousel works</p>
          <p>Your homepage currently shows the <strong>built-in default images</strong>. As soon as you upload one or more images here and press <strong>Save</strong>, your images fully replace the defaults.</p>
          <p>• Use <strong>▲ ▼</strong> to reorder slides, <strong>Remove</strong> to delete one.</p>
          <p>• A slide with no uploaded photo is skipped on the site.</p>
          <p>• To go back to the default images, remove <strong>all</strong> slides and Save.</p>
        </div>

        {slides.length === 0 && (
          <div className="bg-white/5 border border-dashed border-white/20 rounded-xl p-6 text-center space-y-3">
            <p className="text-purple-200 text-sm">No custom slides yet — the homepage is showing the built-in default images.</p>
            <div className="flex flex-wrap gap-2 justify-center">
              <button onClick={() => setSlides([{ url: '', caption: '', subtitle: '' }])} className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm"><FiPlus /> Add your first slide</button>
              <button onClick={() => setSlides(DEFAULT_CAROUSEL.map(s => ({ ...s })))} className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm"><FiImage /> Start from default captions</button>
            </div>
            <p className="text-purple-400 text-xs">“Start from default captions” fills in the current slide wording — just upload a photo into each one.</p>
          </div>
        )}

        {slides.map((slide, i) => (
          <div key={i} className="bg-white/5 rounded-xl p-4 border border-white/20 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-purple-300 text-sm font-semibold">Slide {i + 1}</span>
              <div className="flex items-center gap-2">
                <button onClick={() => moveSlide(i, -1)} disabled={i === 0} className="text-purple-300 hover:text-white disabled:opacity-30 text-sm px-1" title="Move up">▲</button>
                <button onClick={() => moveSlide(i, 1)} disabled={i === slides.length - 1} className="text-purple-300 hover:text-white disabled:opacity-30 text-sm px-1" title="Move down">▼</button>
                <button onClick={() => removeSlide(i)} className="text-red-400 text-xs hover:text-red-300">Remove</button>
              </div>
            </div>
            {slide.url
              ? <img src={slide.url} alt="" className="w-full h-40 object-cover rounded-lg" />
              : <div className="w-full h-40 bg-white/5 rounded-lg flex flex-col items-center justify-center text-purple-300 text-sm gap-1">
                  <span>No image yet</span>
                  <span className="text-amber-300/80 text-xs px-4 text-center">Upload a photo — this slide is skipped on the site until you do.</span>
                </div>}
            <label className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm cursor-pointer w-fit">
              <FiUpload /> {uploading === i ? 'Uploading...' : (slide.url ? 'Replace Image' : 'Upload Image')}
              <input type="file" accept="image/*" className="hidden" onChange={e => uploadImage(i, e.target.files?.[0])} />
            </label>
            <input value={slide.caption || ''} onChange={e => updateSlide(i, 'caption', e.target.value)} placeholder="Caption (optional)"
              className="w-full px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none" />
            <input value={slide.subtitle || ''} onChange={e => updateSlide(i, 'subtitle', e.target.value)} placeholder="Subtitle (optional)"
              className="w-full px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none" />
          </div>
        ))}

        {slides.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <button onClick={() => setSlides([...slides, { url: '', caption: '', subtitle: '' }])} className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm"><FiPlus /> Add Slide</button>
            <button onClick={() => { if (window.confirm('Remove all slides and go back to the built-in default images?')) setSlides([]); }} className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 text-red-300 rounded-lg text-sm"><FiTrash2 /> Reset to defaults</button>
          </div>
        )}

        <div className="flex items-center gap-3 flex-wrap">
          <button onClick={() => handleSave('home_hero', { slides })} disabled={saving}
            className="flex items-center gap-2 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg disabled:opacity-50">
            <FiSave /> {saving ? 'Saving...' : 'Save Carousel'}
          </button>
          {slides.length > 0 && withImages === 0 && (
            <span className="text-amber-300 text-xs">No photos uploaded yet — the site keeps showing the default images until you add at least one.</span>
          )}
        </div>
      </div>
    );
  };

  const sections = [
    { key: 'about', label: 'About Us' },
    { key: 'getting_around', label: 'Getting Around' },
    { key: 'house_rules', label: 'House Rules' },
    { key: 'footer', label: 'Footer' },
    { key: 'comparison', label: 'Comparison' },
    { key: 'home_hero', label: 'Carousel' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex gap-2 flex-wrap">
        {sections.map(s => (
          <button key={s.key} onClick={() => setActiveSection(s.key)}
            className={`px-4 py-2 rounded-lg font-medium transition-all text-sm ${
              activeSection === s.key ? 'bg-purple-600 text-white' : 'bg-white/10 text-purple-200 hover:bg-white/20'
            }`}>
            {s.label}
          </button>
        ))}
      </div>

      {loading ? <div className="text-center text-purple-200">Loading content...</div> : (
        <>
          {activeSection === 'about' && <AboutEditor />}
          {activeSection === 'getting_around' && <GettingAroundEditor />}
          {activeSection === 'house_rules' && <HouseRulesEditor />}
          {activeSection === 'footer' && <FooterEditor />}
          {activeSection === 'comparison' && <ComparisonEditor />}
          {activeSection === 'home_hero' && <CarouselEditor />}
        </>
      )}
    </div>
  );
};

// ─── TAB: Blog ────────────────────────────────────────────────────
const EMPTY_POST_FORM = { title: '', slug: '', category: '', author: '', excerpt: '', content: '', image: '', published: false, date: '' };

const BlogTab = ({ showMessage }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_POST_FORM);
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const fetch_ = async () => {
    setLoading(true);
    try {
      const res = await authFetch(`${API_URL}/admin/blog`);
      const d = await res.json();
      if (d.success) setPosts(d.posts || []);
    } catch { showMessage('error', 'Failed to load posts'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch_(); }, []);

  const startEdit = (p) => {
    setEditingId(p.id);
    setForm({
      title: p.title, slug: p.slug, category: p.category || '', author: p.author || '',
      excerpt: p.excerpt || '', content: p.content || '', image: p.image || '',
      published: p.published, date: p.date || '',
    });
    setImageFile(null);
    setShowForm(true);
  };

  const cancelForm = () => { setShowForm(false); setEditingId(null); setForm(EMPTY_POST_FORM); setImageFile(null); };

  const uploadImageIfNeeded = async () => {
    if (!imageFile) return form.image;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('image', imageFile);
      const res = await authFetch(`${API_URL}/admin/blog/upload-image`, { method: 'POST', body: fd });
      const d = await res.json();
      if (d.success) return d.url;
      showMessage('error', d.message || 'Image upload failed');
      return form.image;
    } catch { showMessage('error', 'Image upload failed'); return form.image; }
    finally { setUploading(false); }
  };

  const handleSave = async () => {
    if (!form.title) { showMessage('error', 'Title is required'); return; }
    setLoading(true);
    try {
      const imageUrl = await uploadImageIfNeeded();
      const url = editingId ? `${API_URL}/admin/blog/${editingId}` : `${API_URL}/admin/blog`;
      const method = editingId ? 'PUT' : 'POST';
      const res = await authFetch(url, {
        method, headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, image: imageUrl })
      });
      const d = await res.json();
      if (d.success) {
        showMessage('success', editingId ? 'Post updated!' : 'Post created!');
        cancelForm();
        fetch_();
      } else showMessage('error', d.message);
    } catch { showMessage('error', 'Save failed'); }
    finally { setLoading(false); }
  };

  const handleTogglePublish = async (p) => {
    try {
      const res = await authFetch(`${API_URL}/admin/blog/${p.id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !p.published })
      });
      const d = await res.json();
      if (d.success) fetch_(); else showMessage('error', d.message);
    } catch { showMessage('error', 'Failed'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this post?')) return;
    try {
      const res = await authFetch(`${API_URL}/admin/blog/${id}`, { method: 'DELETE' });
      const d = await res.json();
      if (d.success) { showMessage('success', 'Deleted'); fetch_(); } else showMessage('error', d.message);
    } catch { showMessage('error', 'Failed'); }
  };

  const fields = [
    { label: 'Title', field: 'title', placeholder: 'How to Get Around Abeokuta' },
    { label: 'Slug (auto from title if blank)', field: 'slug', placeholder: 'how-to-get-around-abeokuta' },
    { label: 'Category', field: 'category', placeholder: 'Travel Tips' },
    { label: 'Author', field: 'author', placeholder: 'BookAStay Team' },
    { label: 'Date', field: 'date', type: 'date' },
  ];

  return (
    <div className="space-y-6">
      <button onClick={() => (showForm ? cancelForm() : setShowForm(true))}
        className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg">
        <FiPlus /> {showForm ? 'Cancel' : 'New Blog Post'}
      </button>

      {showForm && (
        <div className="bg-white/5 border border-white/20 rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500 tracking-tight">{editingId ? 'Edit Post' : 'Create Post'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.map(({ label, field, type, placeholder }) => (
              <div key={field}>
                <label className="block text-purple-200 text-sm mb-1">{label}</label>
                <input type={type || 'text'} value={form[field] || ''} placeholder={placeholder || ''}
                  onChange={e => setForm({ ...form, [field]: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
              </div>
            ))}
          </div>
          <div>
            <label className="block text-purple-200 text-sm mb-1">Excerpt (short summary shown on the blog list)</label>
            <textarea value={form.excerpt || ''} onChange={e => setForm({ ...form, excerpt: e.target.value })} rows={2}
              className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
          </div>
          <div>
            <label className="block text-purple-200 text-sm mb-1">Content</label>
            <textarea value={form.content || ''} onChange={e => setForm({ ...form, content: e.target.value })} rows={8}
              className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
          </div>
          <div>
            <label className="block text-purple-200 text-sm mb-1">Cover Image</label>
            {form.image && <img src={form.image} alt="Cover" className="w-40 h-24 object-cover rounded-lg mb-2 border border-white/20" />}
            <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])}
              className="text-purple-200 text-sm" />
          </div>
          <label className="flex items-center gap-2 text-purple-200 text-sm cursor-pointer">
            <input type="checkbox" checked={form.published} onChange={e => setForm({ ...form, published: e.target.checked })} />
            Published (visible on the site)
          </label>
          <button onClick={handleSave} disabled={loading || uploading}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg disabled:opacity-50">
            {uploading ? 'Uploading image...' : loading ? 'Saving...' : (editingId ? 'Save Changes' : 'Create Post')}
          </button>
        </div>
      )}

      {loading && !posts.length ? (
        <div className="text-center text-purple-200">Loading...</div>
      ) : (
        <div className="space-y-3">
          {posts.map(p => (
            <div key={p.id} className={`bg-white/5 border rounded-xl p-4 ${p.published ? 'border-white/20' : 'border-white/10 opacity-60'}`}>
              <div className="flex justify-between items-center flex-wrap gap-2">
                <div>
                  <span className="font-bold text-white">{p.title}</span>
                  {p.category && <span className="ml-3 text-purple-400 text-sm">{p.category}</span>}
                </div>
                <div className="text-purple-300 text-sm flex gap-4 flex-wrap items-center">
                  {p.date && <span>{new Date(p.date).toLocaleDateString()}</span>}
                  <span className={p.published ? 'text-green-300' : 'text-red-300'}>{p.published ? 'Published' : 'Draft'}</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => startEdit(p)} className="p-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-lg">
                    <FiEdit2 />
                  </button>
                  <button onClick={() => handleTogglePublish(p)}
                    className="p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg text-sm">
                    {p.published ? <FiToggleRight /> : <FiToggleLeft />}
                  </button>
                  <button onClick={() => handleDelete(p.id)} className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg">
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {posts.length === 0 && <div className="text-center text-purple-300 py-8">No blog posts yet</div>}
        </div>
      )}
    </div>
  );
};

// ─── Main Hero / Dashboard ────────────────────────────────────────
const Hero = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('bookings');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [stats, setStats] = useState({ total: 0, confirmed: 0, pending: 0 });
  const adminName = sessionStorage.getItem('admin_name') || 'Admin';

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await authFetch(`${API_URL}/admin/bookings`);
        const d = await res.json();
        if (d.success) {
          const all = d.bookings.all || [];
          const users = all.filter(b => b.booking_type !== 'admin');
          setStats({
            total: users.length,
            confirmed: users.filter(b => b.payment_status === 'paid').length,
            pending: users.filter(b => b.payment_status !== 'paid').length,
          });
        }
      } catch {}
    })();
  }, [activeTab]);

  const tabs = [
    { key: 'bookings', label: 'All Bookings', icon: FiCalendar },
    { key: 'block', label: 'Block Dates', icon: FiPlus },
    { key: 'properties', label: 'Properties', icon: FiHome },
    { key: 'discounts', label: 'Discount Codes', icon: FiTag },
    { key: 'content', label: 'Edit Content', icon: FiFileText },
    { key: 'blog', label: 'Blog', icon: FiBookOpen },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-6 border border-white/20">
          <div className="flex justify-between items-start gap-4 flex-wrap mb-2">
            <div>
              <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500 tracking-tight">BookAStay Admin</h1>
              <p className="text-purple-200 mt-1">Logged in as <span className="text-white font-semibold">{adminName}</span></p>
            </div>
            <button onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-red-500/30 border border-white/20 hover:border-red-500/40 text-purple-200 hover:text-red-300 rounded-xl transition text-sm font-medium">
              <FiX size={16} /> Sign Out
            </button>
          </div>
          <p className="text-purple-300 text-sm">Manage bookings, properties, discounts, and content</p>
          <div className="grid grid-cols-3 gap-4 mt-4">
            {[
              { label: 'Total Bookings', value: stats.total, color: 'text-blue-300' },
              { label: 'Confirmed (Paid)', value: stats.confirmed, color: 'text-green-300' },
              { label: 'Pending', value: stats.pending, color: 'text-yellow-300' },
            ].map(s => (
              <div key={s.label} className="bg-white/5 rounded-xl p-4 border border-white/10">
                <p className="text-purple-200 text-sm">{s.label}</p>
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>
        </div>

        <Alert message={message.text} type={message.type} />

        {/* Tabs */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 overflow-hidden">
          <div className="flex flex-wrap border-b border-white/20">
            {tabs.map(({ key, label, icon: Icon }) => (
              <button key={key} onClick={() => setActiveTab(key)}
                className={`flex-1 min-w-[120px] px-4 py-4 font-medium transition-all text-sm ${
                  activeTab === key ? 'bg-purple-600 text-white' : 'text-purple-200 hover:bg-white/5'
                }`}>
                <div className="flex items-center justify-center gap-2">
                  <Icon className="w-4 h-4" />
                  {label}
                </div>
              </button>
            ))}
          </div>
          <div className="p-6">
            {activeTab === 'bookings' && <BookingsTab showMessage={showMessage} />}
            {activeTab === 'block' && <BlockDatesTab showMessage={showMessage} />}
            {activeTab === 'properties' && <PropertiesTab showMessage={showMessage} />}
            {activeTab === 'discounts' && <DiscountsTab showMessage={showMessage} />}
            {activeTab === 'content' && <ContentTab showMessage={showMessage} />}
            {activeTab === 'blog' && <BlogTab showMessage={showMessage} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
