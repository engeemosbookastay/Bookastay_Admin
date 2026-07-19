import React, { useState, useEffect, useRef } from 'react';
import {
  FiCalendar, FiTrash2, FiUsers, FiHome, FiAlertCircle,
  FiCheckCircle, FiXCircle, FiPlus, FiRefreshCw, FiEdit2,
  FiTag, FiImage, FiFileText, FiDollarSign, FiToggleLeft, FiToggleRight,
  FiSave, FiUpload, FiX,
  FiWifi, FiWind, FiMonitor, FiZap, FiShield, FiActivity,
  FiBriefcase, FiSun, FiDroplet, FiCoffee, FiMapPin, FiAnchor, FiSliders
} from 'react-icons/fi';

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

const AMENITY_OPTIONS = [
  { name: 'High-Speed WiFi',          Icon: FiWifi },
  { name: 'Full Kitchen',             Icon: FiCoffee },
  { name: 'Shared Kitchen',           Icon: FiCoffee },
  { name: 'Air Conditioning',         Icon: FiWind },
  { name: 'Smart TV',                 Icon: FiMonitor },
  { name: 'DSTV / Cable TV',          Icon: FiMonitor },
  { name: 'Free Parking',             Icon: FiMapPin },
  { name: 'Private Balcony',          Icon: FiSun },
  { name: 'Private Bathroom',         Icon: FiDroplet },
  { name: 'Washing Machine',          Icon: FiRefreshCw },
  { name: 'Generator / Backup Power', Icon: FiZap },
  { name: 'Security / Gated',         Icon: FiShield },
  { name: 'Swimming Pool',            Icon: FiAnchor },
  { name: 'Gym / Fitness',            Icon: FiActivity },
  { name: 'Work Desk',                Icon: FiBriefcase },
  { name: 'Iron & Board',             Icon: FiSliders },
];

const AmenitiesPicker = ({ selected = [], onChange }) => {
  const toggle = (name) =>
    onChange(selected.includes(name) ? selected.filter(a => a !== name) : [...selected, name]);
  return (
    <div className="grid grid-cols-2 gap-2">
      {AMENITY_OPTIONS.map(({ name, Icon }) => (
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
  const [imageFile, setImageFile] = useState(null);
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
    setShowAddForm(false);
  };

  const cancelEdit = () => { setEditing(null); setForm({}); setPendingImages([]); setUploadProgress(''); };

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

  const handleSave = async () => {
    const isNew = !editing;
    const url = isNew ? `${API_URL}/admin/properties` : `${API_URL}/admin/properties/${editing}`;
    const method = isNew ? 'POST' : 'PUT';

    const amenities = (form.amenities || []).map(name => ({ name }));

    setLoading(true);
    try {
      const res = await authFetch(url, {
        method, headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, amenities })
      });
      const d = await res.json();
      if (d.success) {
        if (isNew && pendingImages.length > 0) {
          const createdKey = form.room_key.toLowerCase().replace(/\s+/g, '_');
          for (let i = 0; i < pendingImages.length; i++) {
            setUploadProgress(`Uploading image ${i + 1} of ${pendingImages.length}...`);
            const fd = new FormData();
            fd.append('image', pendingImages[i]);
            await authFetch(`${API_URL}/admin/properties/${createdKey}/images`, { method: 'POST', body: fd });
          }
          setUploadProgress('');
          setPendingImages([]);
        }
        showMessage('success', isNew ? 'Property created with images!' : 'Property updated!');
        setEditing(null); setForm({}); setShowAddForm(false);
        fetch_();
      } else showMessage('error', d.message);
    } catch { showMessage('error', 'Save failed'); }
    finally { setLoading(false); }
  };

  const handleDeactivate = async (key) => {
    if (!window.confirm('Deactivate this listing?')) return;
    try {
      const res = await authFetch(`${API_URL}/admin/properties/${key}`, { method: 'DELETE' });
      const d = await res.json();
      if (d.success) { showMessage('success', 'Deactivated'); fetch_(); }
      else showMessage('error', d.message);
    } catch { showMessage('error', 'Failed'); }
  };

  const handleUploadImage = async (room_key) => {
    if (!imageFile) return;
    setUploadingImage(room_key);
    try {
      const fd = new FormData();
      fd.append('image', imageFile);
      const res = await authFetch(`${API_URL}/admin/properties/${room_key}/images`, { method: 'POST', body: fd });
      const d = await res.json();
      if (d.success) { showMessage('success', 'Image uploaded!'); setImageFile(null); fetch_(); }
      else showMessage('error', d.message);
    } catch { showMessage('error', 'Upload failed'); }
    finally { setUploadingImage(''); }
  };

  const handleRemoveImage = async (room_key, url) => {
    if (!window.confirm('Remove this image?')) return;
    try {
      const res = await authFetch(`${API_URL}/admin/properties/${room_key}/images`, {
        method: 'DELETE', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_url: url })
      });
      const d = await res.json();
      if (d.success) { showMessage('success', 'Image removed'); fetch_(); }
    } catch { showMessage('error', 'Failed to remove'); }
  };

  const fields = [
    { label: 'Room Key (e.g. room2)', field: 'room_key', disabled: !!editing },
    { label: 'Display Name', field: 'name' },
    { label: 'Subtitle', field: 'subtitle' },
    { label: 'Category', field: 'category' },
    { label: 'Base Price (₦/night)', field: 'base_price', type: 'number' },
    { label: 'Max Guests', field: 'max_guests', type: 'number' },
    { label: 'Min Nights', field: 'min_nights', type: 'number' },
    { label: 'Bedrooms', field: 'bedrooms', type: 'number' },
    { label: 'Bathrooms', field: 'bathrooms', type: 'number' },
    { label: 'Sort Order', field: 'sort_order', type: 'number' },
  ];

  return (
    <div className="space-y-6">
      {!editing && !showAddForm && (
        <button onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all">
          <FiPlus /> Add New Property
        </button>
      )}

      {(editing || showAddForm) && (
        <div className="bg-white/5 border border-white/20 rounded-xl p-6 space-y-4">
          <h3 className="text-white font-bold text-lg">{editing ? 'Edit Property' : 'Add New Property'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.map(({ label, field, type, disabled }) => (
              <div key={field}>
                <label className="block text-purple-200 text-sm mb-1">{label}</label>
                <input type={type || 'text'} value={form[field] || ''} disabled={disabled}
                  onChange={e => setForm({ ...form, [field]: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-purple-500" />
              </div>
            ))}
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
              Select one or more images. The <span className="text-amber-400 font-semibold">first image</span> is the main cover photo.
              Hover any image and click <span className="text-amber-400 font-semibold">Set as Main</span> to change the order.
            </p>

            {pendingImages.length > 0 && (
              <div className="flex flex-wrap gap-3 mb-4">
                {pendingImages.map((file, i) => (
                  <div key={i} className="relative group w-24 h-24 shrink-0">
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

      {properties.map(p => (
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
            <div className="flex gap-2">
              {editing !== p.room_key && (
                <>
                  <button onClick={() => startEdit(p)} className="p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg"><FiEdit2 /></button>
                  {p.is_active && <button onClick={() => handleDeactivate(p.room_key)} className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg"><FiTrash2 /></button>}
                </>
              )}
            </div>
          </div>

          {/* Images */}
          <div className="mt-3">
            <p className="text-purple-300 text-sm font-medium mb-2">Images ({(p.images || []).length})</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {(p.images || []).map((img, i) => (
                <div key={i} className="relative group w-20 h-20">
                  <img src={img} alt={`Property ${i}`} className="w-20 h-20 object-cover rounded-lg border border-white/20" />
                  <button onClick={() => handleRemoveImage(p.room_key, img)}
                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <FiX size={10} />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2 items-center flex-wrap">
              <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} className="text-sm text-purple-300" />
              {imageFile && (
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
const DiscountsTab = ({ showMessage }) => {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ code: '', type: 'percentage', value: '', description: '', expiry_date: '', usage_limit: '' });

  const fetch_ = async () => {
    setLoading(true);
    try {
      const res = await authFetch(`${API_URL}/admin/discounts`);
      const d = await res.json();
      if (d.success) setDiscounts(d.discounts || []);
    } catch { showMessage('error', 'Failed to load'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch_(); }, []);

  const handleCreate = async () => {
    if (!form.code || !form.value) { showMessage('error', 'Code and value are required'); return; }
    setLoading(true);
    try {
      const res = await authFetch(`${API_URL}/admin/discounts`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          value: Number(form.value),
          usage_limit: form.usage_limit ? Number(form.usage_limit) : null,
        })
      });
      const d = await res.json();
      if (d.success) {
        showMessage('success', 'Discount code created!');
        setShowForm(false);
        setForm({ code: '', type: 'percentage', value: '', description: '', expiry_date: '', usage_limit: '' });
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
      <button onClick={() => setShowForm(!showForm)}
        className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg">
        <FiPlus /> {showForm ? 'Cancel' : 'New Discount Code'}
      </button>

      {showForm && (
        <div className="bg-white/5 border border-white/20 rounded-xl p-6 space-y-4">
          <h3 className="text-white font-bold">Create Discount Code</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: 'Code (e.g. WELCOME20)', field: 'code', placeholder: 'SUMMER10' },
              { label: 'Description', field: 'description', placeholder: 'Summer promo' },
              { label: 'Expiry Date', field: 'expiry_date', type: 'date' },
              { label: 'Usage Limit (blank = unlimited)', field: 'usage_limit', type: 'number', placeholder: '100' },
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
          <button onClick={handleCreate} disabled={loading}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg disabled:opacity-50">
            {loading ? 'Creating...' : 'Create Code'}
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
                  {d.expiry_date && <span>Expires: {new Date(d.expiry_date).toLocaleDateString()}</span>}
                  <span className={d.is_active ? 'text-green-300' : 'text-red-300'}>{d.is_active ? 'Active' : 'Inactive'}</span>
                </div>
                <div className="flex gap-2">
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
        <h3 className="text-white font-bold">About Us Text</h3>
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
    const [categories, setCategories] = useState(current.categories || []);

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
        <h3 className="text-white font-bold">Getting Around Content</h3>
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

  const sections = [
    { key: 'about', label: 'About Us' },
    { key: 'getting_around', label: 'Getting Around' },
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
        </>
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
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-6 border border-white/20">
          <div className="flex justify-between items-start gap-4 flex-wrap mb-2">
            <div>
              <h1 className="text-3xl font-bold text-white">BookAStay Admin</h1>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
