import React, { useState, useEffect } from 'react';
import { FiCalendar, FiTrash2, FiUsers, FiHome, FiAlertCircle, FiCheckCircle, FiXCircle, FiPlus, FiRefreshCw } from 'react-icons/fi';

const Hero = () => {
  const [activeTab, setActiveTab] = useState('block');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // Form state for blocking dates
  const [blockForm, setBlockForm] = useState({
    room_type: 'entire',
    check_in_date: '',
    check_out_date: '',
    reason: ''
  });

  const API_URL = 'https://bookastay-backend-zuwa.onrender.com/api';

  // Fetch all bookings
  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/admin/bookings`);
      const data = await response.json();
      
      if (data.success) {
        setBookings(data.bookings.all || []);
      } else {
        showMessage('error', 'Failed to fetch bookings');
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      showMessage('error', 'Error loading bookings');
    } finally {
      setLoading(false);
    }
  };

  // Show message
  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  // Block date
  const handleBlockDate = async () => {
    if (!blockForm.check_in_date || !blockForm.check_out_date) {
      showMessage('error', 'Please select check-in and check-out dates');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/admin/block-date`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(blockForm)
      });

      const data = await response.json();

      if (data.success) {
        showMessage('success', 'Date blocked successfully!');
        setBlockForm({
          room_type: 'entire',
          check_in_date: '',
          check_out_date: '',
          reason: ''
        });
        fetchBookings();
      } else {
        showMessage('error', data.message || 'Failed to block date');
      }
    } catch (error) {
      console.error('Error blocking date:', error);
      showMessage('error', 'Error blocking date');
    } finally {
      setLoading(false);
    }
  };

  // Delete booking
  const handleDeleteBooking = async (id) => {
    if (!window.confirm('Are you sure you want to delete this booking?')) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/admin/bookings/${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        showMessage('success', 'Booking deleted successfully!');
        fetchBookings();
      } else {
        showMessage('error', data.message || 'Failed to delete booking');
      }
    } catch (error) {
      console.error('Error deleting booking:', error);
      showMessage('error', 'Error deleting booking');
    } finally {
      setLoading(false);
    }
  };

  // Load bookings on mount
  useEffect(() => {
    fetchBookings();
  }, []);

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Calculate nights
  const calculateNights = (checkIn, checkOut) => {
    const nights = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));
    return nights;
  };

  // Separate bookings
  const userBookings = bookings.filter(b => b.booking_type !== 'admin');
  const adminBlocks = bookings.filter(b => b.booking_type === 'admin');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
              <p className="text-purple-200">Manage bookings and block dates</p>
            </div>
            <button
              onClick={fetchBookings}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all disabled:opacity-50"
            >
              <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-500/20 rounded-lg">
                  <FiUsers className="w-6 h-6 text-blue-300" />
                </div>
                <div>
                  <p className="text-purple-200 text-sm">User Bookings</p>
                  <p className="text-2xl font-bold text-white">{userBookings.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-500/20 rounded-lg">
                  <FiHome className="w-6 h-6 text-purple-300" />
                </div>
                <div>
                  <p className="text-purple-200 text-sm">Admin Blocks</p>
                  <p className="text-2xl font-bold text-white">{adminBlocks.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-500/20 rounded-lg">
                  <FiCalendar className="w-6 h-6 text-green-300" />
                </div>
                <div>
                  <p className="text-purple-200 text-sm">Total Bookings</p>
                  <p className="text-2xl font-bold text-white">{bookings.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Message Alert */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-xl border backdrop-blur-md ${
            message.type === 'success' 
              ? 'bg-green-500/20 border-green-500/50 text-green-100' 
              : 'bg-red-500/20 border-red-500/50 text-red-100'
          }`}>
            <div className="flex items-center gap-2">
              {message.type === 'success' ? (
                <FiCheckCircle className="w-5 h-5" />
              ) : (
                <FiXCircle className="w-5 h-5" />
              )}
              <span>{message.text}</span>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 overflow-hidden">
          <div className="flex border-b border-white/20">
            <button
              onClick={() => setActiveTab('block')}
              className={`flex-1 px-6 py-4 font-medium transition-all ${
                activeTab === 'block'
                  ? 'bg-purple-600 text-white'
                  : 'text-purple-200 hover:bg-white/5'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <FiPlus className="w-4 h-4" />
                Block Dates
              </div>
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              className={`flex-1 px-6 py-4 font-medium transition-all ${
                activeTab === 'bookings'
                  ? 'bg-purple-600 text-white'
                  : 'text-purple-200 hover:bg-white/5'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <FiCalendar className="w-4 h-4" />
                All Bookings
              </div>
            </button>
          </div>

          <div className="p-6">
            {/* Block Date Form */}
            {activeTab === 'block' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-purple-200 mb-2 font-medium">
                      Room Type
                    </label>
                    <select
                      value={blockForm.room_type}
                      onChange={(e) => setBlockForm({...blockForm, room_type: e.target.value})}
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="entire" className="bg-slate-800">Entire Apartment</option>
                      <option value="room1" className="bg-slate-800">Room 1</option>
                      <option value="room2" className="bg-slate-800">Room 2</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-purple-200 mb-2 font-medium">
                      Check-in Date
                    </label>
                    <input
                      type="date"
                      value={blockForm.check_in_date}
                      onChange={(e) => setBlockForm({...blockForm, check_in_date: e.target.value})}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-purple-200 mb-2 font-medium">
                      Check-out Date
                    </label>
                    <input
                      type="date"
                      value={blockForm.check_out_date}
                      onChange={(e) => setBlockForm({...blockForm, check_out_date: e.target.value})}
                      min={blockForm.check_in_date || new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-purple-200 mb-2 font-medium">
                      Reason (Optional)
                    </label>
                    <input
                      type="text"
                      value={blockForm.reason}
                      onChange={(e) => setBlockForm({...blockForm, reason: e.target.value})}
                      placeholder="e.g., Maintenance, Cleaning"
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <button
                  onClick={handleBlockDate}
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Blocking...' : 'Block Date'}
                </button>
              </div>
            )}

            {/* All Bookings List */}
            {activeTab === 'bookings' && (
              <div className="space-y-4">
                {loading ? (
                  <div className="text-center py-12">
                    <FiRefreshCw className="w-8 h-8 text-purple-300 animate-spin mx-auto mb-2" />
                    <p className="text-purple-200">Loading bookings...</p>
                  </div>
                ) : bookings.length === 0 ? (
                  <div className="text-center py-12">
                    <FiCalendar className="w-16 h-16 text-purple-300/50 mx-auto mb-4" />
                    <p className="text-purple-200 text-lg">No bookings found</p>
                  </div>
                ) : (
                  <>
                    {/* Admin Blocks Section */}
                    {adminBlocks.length > 0 && (
                      <div className="mb-8">
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                          <FiAlertCircle className="w-5 h-5 text-orange-400" />
                          Admin Blocked Dates ({adminBlocks.length})
                        </h3>
                        <div className="space-y-3">
                          {adminBlocks.map((booking) => (
                            <div key={booking.id} className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="px-3 py-1 bg-orange-500/20 text-orange-300 rounded-full text-sm font-medium">
                                      Admin Block
                                    </span>
                                    <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">
                                      {booking.room_type}
                                    </span>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4 mt-3">
                                    <div>
                                      <p className="text-purple-300 text-sm">Check-in</p>
                                      <p className="text-white font-medium">{formatDate(booking.check_in)}</p>
                                    </div>
                                    <div>
                                      <p className="text-purple-300 text-sm">Check-out</p>
                                      <p className="text-white font-medium">{formatDate(booking.check_out)}</p>
                                    </div>
                                    <div>
                                      <p className="text-purple-300 text-sm">Nights</p>
                                      <p className="text-white font-medium">{calculateNights(booking.check_in, booking.check_out)}</p>
                                    </div>
                                    {booking.notes && (
                                      <div>
                                        <p className="text-purple-300 text-sm">Reason</p>
                                        <p className="text-white font-medium">{booking.notes}</p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <button
                                  onClick={() => handleDeleteBooking(booking.id)}
                                  className="ml-4 p-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-all"
                                  title="Delete block"
                                >
                                  <FiTrash2 className="w-5 h-5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* User Bookings Section */}
                    {userBookings.length > 0 && (
                      <div>
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                          <FiUsers className="w-5 h-5 text-blue-400" />
                          User Bookings ({userBookings.length})
                        </h3>
                        <div className="space-y-3">
                          {userBookings.map((booking) => (
                            <div key={booking.id} className="bg-white/5 border border-white/20 rounded-xl p-4 hover:bg-white/10 transition-all">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-3">
                                    <h4 className="text-lg font-semibold text-white">{booking.name}</h4>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                      booking.payment_status === 'paid' 
                                        ? 'bg-green-500/20 text-green-300' 
                                        : 'bg-yellow-500/20 text-yellow-300'
                                    }`}>
                                      {booking.payment_status}
                                    </span>
                                    <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs">
                                      {booking.room_type}
                                    </span>
                                  </div>
                                  
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                    <div>
                                      <p className="text-purple-300">Email</p>
                                      <p className="text-white font-medium">{booking.email}</p>
                                    </div>
                                    <div>
                                      <p className="text-purple-300">Phone</p>
                                      <p className="text-white font-medium">{booking.phone || 'N/A'}</p>
                                    </div>
                                    <div>
                                      <p className="text-purple-300">Check-in</p>
                                      <p className="text-white font-medium">{formatDate(booking.check_in)}</p>
                                    </div>
                                    <div>
                                      <p className="text-purple-300">Check-out</p>
                                      <p className="text-white font-medium">{formatDate(booking.check_out)}</p>
                                    </div>
                                    <div>
                                      <p className="text-purple-300">Guests</p>
                                      <p className="text-white font-medium">{booking.guests || 1}</p>
                                    </div>
                                    <div>
                                      <p className="text-purple-300">Nights</p>
                                      <p className="text-white font-medium">{calculateNights(booking.check_in, booking.check_out)}</p>
                                    </div>
                                    <div>
                                      <p className="text-purple-300">Price</p>
                                      <p className="text-white font-medium">₦{booking.price?.toLocaleString() || 0}</p>
                                    </div>
                                    <div>
                                      <p className="text-purple-300">ID Type</p>
                                      <p className="text-white font-medium">{booking.id_type || 'N/A'}</p>
                                    </div>
                                  </div>
                                </div>
                                <button
                                  onClick={() => handleDeleteBooking(booking.id)}
                                  className="ml-4 p-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-all"
                                  title="Delete booking"
                                >
                                  <FiTrash2 className="w-5 h-5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;