import {
  useState,
  useMemo,
} from 'react';

import {
  MapPinIcon,
  PhoneIcon,
  ClockIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

const Stores = () => {

  const [selectedPincode, setSelectedPincode] =
    useState('');

  const [searchedStores, setSearchedStores] =
    useState(null);

  const [error, setError] =
    useState('');

  /* ============================================
     STORES
  ============================================ */

  const stores = [

    {
      id: 1,

      name:
        'GlamArt - Connaught Place',

      address:
        'G-3, Ground Floor, Block G, Connaught Place',

      city:
        'New Delhi',

      state:
        'Delhi',

      pincode:
        '110001',

      phone:
        '+91 98765 43210',

      timing:
        '10:00 AM - 09:00 PM',

      lat:
        28.6315,

      lng:
        77.2197,
    },

    {
      id: 2,

      name:
        'GlamArt - Mall of India',

      address:
        'Unit No. 208, 2nd Floor, DLF Mall of India',

      city:
        'Gurgaon',

      state:
        'Haryana',

      pincode:
        '122002',

      phone:
        '+91 98765 43211',

      timing:
        '10:00 AM - 10:00 PM',

      lat:
        28.4943,

      lng:
        77.0852,
    },

    {
      id: 3,

      name:
        'GlamArt - Phoenix Mall',

      address:
        'UG-12, Upper Ground Floor, Phoenix Marketcity',

      city:
        'Mumbai',

      state:
        'Maharashtra',

      pincode:
        '400013',

      phone:
        '+91 98765 43212',

      timing:
        '11:00 AM - 09:00 PM',

      lat:
        19.0760,

      lng:
        72.8777,
    },

    {
      id: 4,

      name:
        'GlamArt - Forum',

      address:
        '1st Floor, Forum Downtown, No. 21-22',

      city:
        'Bangalore',

      state:
        'Karnataka',

      pincode:
        '560001',

      phone:
        '+91 98765 43213',

      timing:
        '10:00 AM - 09:00 PM',

      lat:
        12.9716,

      lng:
        77.5946,
    },

    {
      id: 5,

      name:
        'GlamArt - South City Mall',

      address:
        '2nd Floor, South City Mall, Prince Anwar Shah Road',

      city:
        'Kolkata',

      state:
        'West Bengal',

      pincode:
        '700068',

      phone:
        '+91 98765 43214',

      timing:
        '10:00 AM - 09:00 PM',

      lat:
        22.5186,

      lng:
        88.3968,
    },

    {
      id: 6,

      name:
        'GlamArt - Express Avenue',

      address:
        'FF-10, First Floor, Express Avenue, Whites Road',

      city:
        'Chennai',

      state:
        'Tamil Nadu',

      pincode:
        '600014',

      phone:
        '+91 98765 43215',

      timing:
        '10:00 AM - 09:00 PM',

      lat:
        13.0827,

      lng:
        80.2707,
    },
  ];

  /* ============================================
     HANDLE SEARCH
  ============================================ */

  const handleSearch = () => {

    setError('');

    // EMPTY
    if (
      !selectedPincode.trim()
    ) {

      setSearchedStores(
        null
      );

      return;
    }

    // VALIDATE
    const pincodeRegex =
      /^[1-9][0-9]{5}$/;

    if (
      !pincodeRegex.test(
        selectedPincode
      )
    ) {

      setError(
        'Enter valid 6 digit pincode'
      );

      setSearchedStores([]);

      return;
    }

    // FILTER
    const filtered =
      stores.filter(
        (store) =>

          store.pincode
            .slice(0, 2) ===
          selectedPincode.slice(0, 2)
      );

    setSearchedStores(
      filtered
    );

    if (
      filtered.length === 0
    ) {

      setError(
        'No stores found near this area'
      );
    }
  };

  /* ============================================
     RESET
  ============================================ */

  const handleReset = () => {

    setSelectedPincode('');

    setSearchedStores(
      null
    );

    setError('');
  };

  /* ============================================
     DISPLAY STORES
  ============================================ */

  const displayStores =
    useMemo(() => {

      return searchedStores ||
        stores;

    }, [
      searchedStores
    ]);

  /* ============================================
     MAP
  ============================================ */

  const openMap = (
    store
  ) => {

    const url =
      `https://www.google.com/maps?q=${store.lat},${store.lng}`;

    window.open(
      url,
      '_blank'
    );
  };

  /* ============================================
     CALL STORE
  ============================================ */

  const callStore = (
    phone
  ) => {

    window.location.href =
      `tel:${phone}`;
  };

  return (

    <div className="container-custom py-8">

      {/* HEADER */}
      <div className="mb-8">

        <h1 className="text-3xl font-display font-bold">
          Store Locator
        </h1>

        <p className="text-gray-500 mt-2">
          Find GlamArt stores near you
        </p>
      </div>

      {/* SEARCH */}
      <div className="bg-primary-50 rounded-2xl p-6 mb-8">

        <h2 className="text-xl font-semibold mb-4">
          Find a Store Near You
        </h2>

        <div className="flex flex-col md:flex-row gap-4 max-w-2xl">

          <div className="relative flex-1">

            <MagnifyingGlassIcon
              className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"

              placeholder="Enter your pincode"

              value={
                selectedPincode
              }

              onChange={(e) => {

                setSelectedPincode(
                  e.target.value
                    .replace(/\D/g, '')
                    .slice(0, 6)
                );

                setError('');
              }}

              className="input pl-10"
            />
          </div>

          <button
            onClick={
              handleSearch
            }

            className="btn-primary"
          >
            Search
          </button>

          <button
            onClick={
              handleReset
            }

            className="btn-outline"
          >
            Reset
          </button>
        </div>

        {/* ERROR */}
        {error && (

          <p className="text-red-500 text-sm mt-3">
            {error}
          </p>
        )}

        {/* RESULT */}
        {searchedStores && !error && (

          <p className="text-sm text-gray-600 mt-3">

            Found
            {' '}
            <strong>
              {searchedStores.length}
            </strong>
            {' '}
            store(s) near your area

          </p>
        )}
      </div>

      {/* STORES */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

        {displayStores.map(
          (store) => (

            <div
              key={store.id}

              className="bg-white rounded-2xl shadow-card border border-gray-100 p-6 hover:shadow-lg transition-all"
            >

              {/* TITLE */}
              <h3 className="font-semibold text-lg mb-2">

                {store.name}

              </h3>

              {/* ADDRESS */}
              <p className="text-gray-600 mb-5 min-h-[50px]">

                {store.address}

              </p>

              {/* INFO */}
              <div className="space-y-3 text-sm">

                <div className="flex items-start gap-2 text-gray-600">

                  <MapPinIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />

                  <span>

                    {store.city},
                    {' '}
                    {store.state}
                    {' '}
                    -
                    {' '}
                    {store.pincode}

                  </span>
                </div>

                <div className="flex items-center gap-2 text-gray-600">

                  <PhoneIcon className="w-4 h-4" />

                  <span>
                    {store.phone}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-gray-600">

                  <ClockIcon className="w-4 h-4" />

                  <span>
                    {store.timing}
                  </span>
                </div>
              </div>

              {/* BUTTONS */}
              <div className="grid grid-cols-2 gap-3 mt-6">

                <button
                  onClick={() =>
                    openMap(store)
                  }

                  className="btn-outline"
                >
                  View Map
                </button>

                <button
                  onClick={() =>
                    callStore(
                      store.phone
                    )
                  }

                  className="btn-primary"
                >
                  Call Store
                </button>
              </div>
            </div>
          )
        )}
      </div>

      {/* INFO */}
      <div className="mt-12 bg-gray-50 rounded-2xl p-8">

        <h2 className="text-2xl font-display font-bold mb-4">
          Store Pickup
        </h2>

        <p className="text-gray-600 mb-5">

          Shop online and pick up your
          products from the nearest GlamArt
          store with our omnichannel
          shopping experience.

        </p>

        <div className="grid md:grid-cols-2 gap-4 text-gray-600">

          <div>
            ✓ Save on shipping costs
          </div>

          <div>
            ✓ Pick up anytime
          </div>

          <div>
            ✓ Easy returns at store
          </div>

          <div>
            ✓ Faster delivery experience
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stores;