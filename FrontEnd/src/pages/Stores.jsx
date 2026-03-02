import { useState } from 'react';
import { MapPinIcon, PhoneIcon, ClockIcon } from '@heroicons/react/24/outline';

const Stores = () => {
  const [selectedPincode, setSelectedPincode] = useState('');
  const [searchedStores, setSearchedStores] = useState(null);

  const stores = [
    {
      id: 1,
      name: 'GlamArt - Connaught Place',
      address: 'G-3, Ground Floor, Block G, Connaught Place',
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110001',
      phone: '+91 98765 43210',
      timing: '10:00 AM - 09:00 PM',
      lat: 28.6315,
      lng: 77.2197,
    },
    {
      id: 2,
      name: 'GlamArt - Mall of India',
      address: 'Unit No. 208, 2nd Floor, DLF Mall of India',
      city: 'Gurgaon',
      state: 'Haryana',
      pincode: '122002',
      phone: '+91 98765 43211',
      timing: '10:00 AM - 10:00 PM',
      lat: 28.4943,
      lng: 77.0852,
    },
    {
      id: 3,
      name: 'GlamArt - Phoenix Mall',
      address: 'UG-12, Upper Ground Floor, Phoenix Marketcity',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400013',
      phone: '+91 98765 43212',
      timing: '11:00 AM - 09:00 PM',
      lat: 19.0760,
      lng: 72.8777,
    },
    {
      id: 4,
      name: 'GlamArt - Forum',
      address: '1st Floor, Forum Downtown, No. 21-22',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560001',
      phone: '+91 98765 43213',
      timing: '10:00 AM - 09:00 PM',
      lat: 12.9716,
      lng: 77.5946,
    },
    {
      id: 5,
      name: 'GlamArt - South City Mall',
      address: '2nd Floor, South City Mall, Prince Anwar Shah Road',
      city: 'Kolkata',
      state: 'West Bengal',
      pincode: '700068',
      phone: '+91 98765 43214',
      timing: '10:00 AM - 09:00 PM',
      lat: 22.5186,
      lng: 88.3968,
    },
    {
      id: 6,
      name: 'GlamArt - Express Avenue',
      address: 'FF-10, First Floor, Express Avenue, Whites Road',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600014',
      phone: '+91 98765 43215',
      timing: '10:00 AM - 09:00 PM',
      lat: 13.0827,
      lng: 80.2707,
    },
  ];

  const handleSearch = () => {
    if (selectedPincode) {
      // Simple mock search - in real app would filter by pincode
      setSearchedStores(stores.filter(s => s.pincode.startsWith(selectedPincode.slice(0, 2))));
    } else {
      setSearchedStores(null);
    }
  };

  const displayStores = searchedStores || stores;

  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-display font-bold mb-8">Store Locator</h1>

      {/* Pincode Search */}
      <div className="bg-primary-50 rounded-xl p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Find a Store Near You</h2>
        <div className="flex gap-4 max-w-lg">
          <input
            type="text"
            placeholder="Enter your pincode"
            value={selectedPincode}
            onChange={(e) => setSelectedPincode(e.target.value)}
            className="input flex-1"
          />
          <button onClick={handleSearch} className="btn-primary">
            Search
          </button>
        </div>
        {searchedStores && (
          <p className="text-sm text-gray-600 mt-2">
            Found {searchedStores.length} store(s) in your area
          </p>
        )}
      </div>

      {/* Stores List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayStores.map((store) => (
          <div key={store.id} className="bg-white rounded-xl shadow-card p-6">
            <h3 className="font-semibold text-lg mb-2">{store.name}</h3>
            <p className="text-gray-600 mb-4">{store.address}</p>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <MapPinIcon className="w-4 h-4" />
                <span>{store.city}, {store.state} - {store.pincode}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <PhoneIcon className="w-4 h-4" />
                <span>{store.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <ClockIcon className="w-4 h-4" />
                <span>{store.timing}</span>
              </div>
            </div>

            <button className="btn-outline w-full mt-4">
              View on Map
            </button>
          </div>
        ))}
      </div>

      {/* Info Section */}
      <div className="mt-12 bg-gray-50 rounded-xl p-8">
        <h2 className="text-2xl font-display font-bold mb-4">Store Pickup</h2>
        <p className="text-gray-600 mb-4">
          With our omnichannel service, you can shop online and pick up from your nearest store. 
          Enjoy the convenience of shopping from home and picking up at a location near you.
        </p>
        <ul className="space-y-2 text-gray-600">
          <li>✓ Save on shipping costs</li>
          <li>✓ Pick up at your convenience</li>
          <li>✓ Try before you buy</li>
          <li>✓ Easy returns at store</li>
        </ul>
      </div>
    </div>
  );
};

export default Stores;
