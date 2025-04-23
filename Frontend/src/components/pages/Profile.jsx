import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { User, Mail, CalendarDays } from 'lucide-react';
import { updateProfile } from "../../API/api.js" // Update path as necessary

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [userDetails, setUserDetails] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || 'user'
  });

  if (!user) {
    return (
      <div className="text-center mt-10 text-white bg-gradient-to-b from-[#1f1b2e] via-[#15131e] to-[#0e0c15] min-h-screen">
        Loading profile...
      </div>
    );
  }

  const { name, email, role, createdAt } = user;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
  };

  const handleUpdateProfile = async () => {
    await updateProfile(dispatch, { userDetails });
    setIsEditing(false);
  };

  return (
    <div
      className="min-h-screen flex py-12 justify-center"
      style={{
        background:
          'radial-gradient(circle at center, #1f1b2e 0%, #15131e 60%, #0e0c15 100%)',
      }}
    >
      <div className="max-sm:mx-8 bg-[#1f1b2e] text-white shadow-2xl rounded-2xl w-full h-[25rem] max-w-md p-6 border border-white/10">
        <h2 className="text-2xl font-bold mb-6 text-center">User Profile</h2>

        {/* Display Profile or Edit Form */}
        <div className="space-y-5">
          {!isEditing ? (
            <>
              <div className="flex items-center gap-4">
                <User className="text-white/70" />
                <div>
                  <p className="text-sm text-white/60">Name</p>
                  <p className="text-lg font-semibold">{name}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Mail className="text-white/70" />
                <div>
                  <p className="text-sm text-white/60">Email</p>
                  <p className="text-lg font-semibold">{email}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <CalendarDays className="text-white/70" />
                <div>
                  <p className="text-sm text-white/60">Joined</p>
                  <p className="text-lg font-semibold">
                    {new Date(createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <p className="text-sm text-white/60">Role</p>
                <span className="bg-white/10 text-white text-sm font-medium px-3 py-1 rounded-full capitalize">
                  {role}
                </span>
              </div>

              {/* Edit Button */}
              <div className="mt-4 text-center">
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-sm text-white bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-full"
                >
                  Edit Profile
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-col">
                <label className="text-sm text-white/60">Name</label>
                <input
                  type="text"
                  name="name"
                  value={userDetails.name}
                  onChange={handleInputChange}
                  className="mt-1 px-4 py-2 rounded-md bg-[#2c2a35] text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm text-white/60">Email</label>
                <input
                  type="email"
                  name="email"
                  value={userDetails.email}
                  onChange={handleInputChange}
                  className="mt-1 px-4 py-2 rounded-md bg-[#2c2a35] text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select
                name="role"
                className={`block w-full border border-gray-300 rounded-md p-3 bg-zinc-900 text-white`}
                value={userDetails.role}
                onChange={handleInputChange}
              >
                <option value="user" className={`text-white}`}>User</option>
                <option value="admin" className={` text-white}`}>Admin</option>
              </select>
              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={handleUpdateProfile}
                  className="bg-blue-600 text-white px-4 py-2 rounded-full"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="text-sm text-white/60"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
