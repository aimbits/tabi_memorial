import React, { useState, useEffect } from 'react';
import tabi1 from '../src/img/tabi1.jpg';

const MemorialSite = () => {
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    relationship: ''
  });

  // Array of background images
  const backgroundImages = [
    tabi1,
    'tabi/src/tabi2.jpg',
    'tabi/src/tabi3.jpg',
    'tabi/public/tabi3.jpg',
    '../public/tabi5.jpg'
  ];

  // Background Photo Layout Component
  const PhotoBackground = () => (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 flex justify-center items-center gap-4">
        {backgroundImages.map((img, index) => (
          <div
            key={index}
            className="relative transform transition-all duration-1000 ease-in-out hover:scale-105"
            style={{
              animation: `float ${2 + index * 0.5}s ease-in-out infinite alternate`,
              marginTop: `${index % 2 === 0 ? '-40px' : '40px'}`,
              opacity: 0.7
            }}
          >
            <img
              src={img}
              alt={`Memorial photo ${index + 1}`}
              className="rounded-lg shadow-xl object-cover"
              style={{
                width: '250px',
                height: '350px',
                filter: 'grayscale(30%)'
              }}
            />
          </div>
        ))}
      </div>
      {/* <div className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm"></div> */}
    </div>
  );

  // Add floating animation keyframes
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes float {
        0% { transform: translateY(0px) rotate(-2deg); }
        100% { transform: translateY(-10px) rotate(2deg); }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // Add your registration logic here
      setShowModal(false);
      setFormData({ name: '', email: '', relationship: '' });
    } catch (err) {
      setError('Failed to register. Please try again.');
    }
  };

  const MainContent = () => (
    <div className="max-w-4xl mx-auto text-white text-center">
      <h1 className="text-4xl font-bold mb-6">In Loving Memory</h1>
      <p className="text-xl mb-8">Join us as we celebrate the life of our beloved</p>
      
      <button
        onClick={() => setShowModal(true)}
        className="bg-white text-black px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors"
      >
        Register for Service
      </button>
    </div>
  );

  const RegistrationModal = () => (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={() => setShowModal(false)}
        ></div>

        <div 
          className="relative bg-white rounded-lg max-w-md w-full p-6 shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
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
                onChange={handleInputChange}
                onBlur={(e) => setFormData(prev => ({ ...prev, name: e.target.value.trim() }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoComplete="name"
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
                onChange={handleInputChange}
                onBlur={(e) => setFormData(prev => ({ ...prev, email: e.target.value.trim() }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoComplete="email"
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
                onChange={handleInputChange}
                onBlur={(e) => setFormData(prev => ({ ...prev, relationship: e.target.value.trim() }))}
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

  return (
  
    <div className="min-h-screen relative"> 
    
      <PhotoBackground />
      <div className="relative min-h-screen p-6">
        <MainContent />
        {showModal && <RegistrationModal />}
      </div>

      
      
    </div>
  );
};

export default MemorialSite;