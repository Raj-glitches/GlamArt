import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateProfile } from '../../slices/authSlice';
import { toast } from 'react-toastify';

const Profile = () => {
  const dispatch = useDispatch();
  const { user, isLoading } = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(updateProfile(formData));
    if (!result.error) {
      toast.success('Profile updated successfully');
    }
  };

  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-display font-bold mb-8">My Profile</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-card p-6">
            <div className="text-center">
              <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-primary-600">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <h2 className="text-xl font-bold">{user?.name}</h2>
              <p className="text-gray-500">{user?.email}</p>
              <span className="inline-block mt-2 px-3 py-1 bg-primary-100 text-primary-600 rounded-full text-sm capitalize">
                {user?.role}
              </span>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-card p-6">
            <h2 className="text-xl font-bold mb-6">Personal Information</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input"
                />
              </div>

              <div>
                <label className="label">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input"
                  disabled
                />
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>

              <div>
                <label className="label">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="input"
                />
              </div>

              <button type="submit" className="btn-primary" disabled={isLoading}>
                {isLoading ? 'Updating...' : 'Update Profile'}
              </button>
            </form>
          </div>

          {/* Addresses */}
          <div className="bg-white rounded-xl shadow-card p-6 mt-6">
            <h2 className="text-xl font-bold mb-6">Saved Addresses</h2>
            
            {user?.addresses?.length > 0 ? (
              <div className="space-y-4">
                {user.addresses.map((address, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <p className="font-medium">{address.name}</p>
                    <p className="text-gray-600">{address.street}</p>
                    <p className="text-gray-600">{address.city}, {address.state} - {address.pincode}</p>
                    <p className="text-gray-500">{address.phone}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No saved addresses</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
