import React, { useState, useEffect } from 'react';

const MemorialSite = () => {
  const [showModal, setShowModal] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [lastSeatNumber, setLastSeatNumber] = useState(0);
  const [error, setError] = useState('');
  const [registeredSeats, setRegisteredSeats] = useState(new Set());
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    relationship: '',
    seatNumber: '',
    registrationDate: ''
  });

  // Load saved registration data and validate session on component mount
  useEffect(() => {
    // Load registered seats
    const savedSeats = localStorage.getItem('registeredSeats');
    if (savedSeats) {
      setRegisteredSeats(new Set(JSON.parse(savedSeats)));
    }

    // Load last seat number
    const savedLastSeat = localStorage.getItem('lastSeatNumber');
    if (savedLastSeat) {
      setLastSeatNumber(parseInt(savedLastSeat));
    }

    // Load and validate user session
    const savedData = localStorage.getItem('registrationData');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      
      // Validate session expiry (24 hours)
      const registrationDate = new Date(parsedData.registrationDate);
      const now = new Date();
      const hoursDiff = (now - registrationDate) / (1000 * 60 * 60);

      if (hoursDiff > 24) {
        handleLogout();
        setError('Your session has expired. Please register again.');
      } else if (!registeredSeats.has(parsedData.seatNumber)) {
        handleLogout();
        setError('Invalid seat number detected. Please register again.');
      } else {
        setFormData(parsedData);
        setIsRegistered(true);
      }
    }
  }, []);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setError('');

    // Validate email
    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address.');
      return;
    }

    // Validate name length
    if (formData.name.length < 2) {
      setError('Please enter your full name.');
      return;
    }

    const nextSeatNumber = lastSeatNumber + 1;
    
    // Check if seat is already taken
    if (registeredSeats.has(nextSeatNumber)) {
      setError('This seat is already taken. Please try again.');
      return;
    }

    const updatedFormData = {
      ...formData,
      seatNumber: nextSeatNumber,
      registrationDate: new Date().toISOString()
    };

    // Update registered seats
    const updatedSeats = new Set(registeredSeats);
    updatedSeats.add(nextSeatNumber);

    // Save all data to localStorage
    localStorage.setItem('registrationData', JSON.stringify(updatedFormData));
    localStorage.setItem('lastSeatNumber', nextSeatNumber.toString());
    localStorage.setItem('registeredSeats', JSON.stringify([...updatedSeats]));

    setFormData(updatedFormData);
    setLastSeatNumber(nextSeatNumber);
    setRegisteredSeats(updatedSeats);
    setIsRegistered(true);
    setShowModal(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('registrationData');
    setFormData({
      name: '',
      email: '',
      relationship: '',
      seatNumber: '',
      registrationDate: ''
    });
    setIsRegistered(false);
    setError('');
  };

  // Modal Registration Form
  const RegistrationModal = () => (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={() => setShowModal(false)}
        ></div>

        <div className="relative bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
          <button
            onClick={() => setShowModal(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
          >
            <span className="text-2xl">×</span>
          </button>
          
          <h2 className="text-2xl font-bold text-center mb-6">Memorial Service Registration</h2>
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value.trim() }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value.trim() }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="relationship" className="block text-sm font-medium text-gray-700 mb-1">
                Relationship to Deceased
              </label>
              <input
                id="relationship"
                required
                value={formData.relationship}
                onChange={(e) => setFormData(prev => ({ ...prev, relationship: e.target.value.trim() }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );

  // Main Content component remains the same as before...
  const MainContent = () => (
    <div className="max-w-xl mx-auto space-y-6">
      {!isRegistered ? (
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white mb-4">In Loving Memory</h1>
          <p className="text-xl text-white mb-8">Join us in remembering our beloved</p>
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md mx-auto max-w-md">
              {error}
            </div>
          )}
          <button
            onClick={() => setShowModal(true)}
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors"
          >
            Register to Attend
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white bg-opacity-90 rounded-lg p-6 shadow-md">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-semibold">Welcome, {formData.name}</h2>
                <p className="font-bold">Your seat number is: {formData.seatNumber}</p>
                <p className="text-sm text-gray-600">
                  Registered: {new Date(formData.registrationDate).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="text-sm px-4 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
              >
                Logout
              </button>
            </div>
          </div>

          <div className="bg-white bg-opacity-90 rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-center mb-6">Service Programme</h3>
            <div className="space-y-3 max-w-md mx-auto">
              <div className="flex justify-between border-b pb-2">
                <span>Opening Prayer</span>
                <span>10:00 AM</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span>Hymn</span>
                <span>10:15 AM</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span>Scripture Reading</span>
                <span>10:30 AM</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span>Eulogy</span>
                <span>10:45 AM</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span>Family Tributes</span>
                <span>11:15 AM</span>
              </div>
              <div className="flex justify-between pb-2">
                <span>Closing Prayer</span>
                <span>11:45 AM</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: `url('/api/placeholder/1920/1080')`,
      }}
    >
      <div className="absolute inset-0 backdrop-blur-md bg-black bg-opacity-50"></div>
      <div className="relative min-h-screen p-6">
        <MainContent />
        {showModal && <RegistrationModal />}
      </div>
    </div>
  );
};

export default MemorialSite;