import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import axios from 'axios';

import { toast } from 'react-toastify';

const Users = () => {

  const [users, setUsers] =
    useState([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [search, setSearch] =
    useState('');

  const [updatingUserId, setUpdatingUserId] =
    useState(null);

  // CURRENT LOGGED USER
  const currentUser = JSON.parse(
    localStorage.getItem('user')
  );

  // FETCH USERS
  useEffect(() => {
    fetchUsers();
  }, []);

  // API
  const fetchUsers = async () => {

    try {

      setIsLoading(true);

      const response = await axios.get(
        'http://localhost:5000/api/users',
        {
          headers: {
            Authorization: `Bearer ${currentUser?.token}`,
          },
        }
      );

      setUsers(
        Array.isArray(
          response?.data?.data
        )
          ? response.data.data
          : []
      );

    } catch (error) {

      console.error(error);

      toast.error(
        'Failed to fetch users'
      );

      setUsers([]);

    } finally {

      setIsLoading(false);
    }
  };

  // UPDATE ROLE
  const updateUserRole = async (
    userId,
    role
  ) => {

    // PREVENT SELF ROLE CHANGE
    if (
      currentUser?._id === userId
    ) {

      toast.error(
        'You cannot change your own role'
      );

      return;
    }

    try {

      setUpdatingUserId(userId);

      const response = await axios.put(
        `http://localhost:5000/api/users/${userId}/role`,
        { role },
        {
          headers: {
            Authorization: `Bearer ${currentUser?.token}`,
          },
        }
      );

      // SAFE UPDATE
      setUsers((prev) =>
        prev.map((user) => {

          if (
            user?._id === userId
          ) {

            return {
              ...user,
              role,
            };
          }

          return user;
        })
      );

      toast.success(
        'User role updated'
      );

    } catch (error) {

      console.error(error);

      toast.error(
        error?.response?.data?.message ||
          'Failed to update role'
      );

    } finally {

      setUpdatingUserId(null);
    }
  };

  // SEARCH
  const filteredUsers = useMemo(() => {

    return (users || []).filter(
      (user) => {

        if (!user) return false;

        return (
          user?.name
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            ) ||

          user?.email
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            ) ||

          user?.phone
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            )
        );
      }
    );

  }, [users, search]);

  // ROLE COLORS
  const getRoleStyles = (
    role
  ) => {

    const styles = {

      admin:
        'bg-purple-100 text-purple-800',

      store_manager:
        'bg-blue-100 text-blue-800',

      customer:
        'bg-gray-100 text-gray-800',
    };

    return (
      styles[role] ||
      'bg-gray-100 text-gray-800'
    );
  };

  // LOADING
  if (isLoading) {

    return (
      <div className="flex justify-center items-center py-24">
        <div className="spinner w-12 h-12"></div>
      </div>
    );
  }

  return (
    <div>

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">

        <div>

          <h1 className="text-3xl font-bold">
            Users
          </h1>

          <p className="text-gray-500 mt-1">
            Manage platform users
          </p>
        </div>

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          className="input max-w-md"
        />
      </div>

      {/* EMPTY */}
      {filteredUsers.length === 0 ? (

        <div className="bg-white rounded-2xl shadow-sm p-12 text-center">

          <h2 className="text-2xl font-semibold mb-2">
            No Users Found
          </h2>

          <p className="text-gray-500">
            No matching users available
          </p>
        </div>

      ) : (

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

          <div className="overflow-x-auto">

            <table className="w-full min-w-[900px]">

              {/* HEADER */}
              <thead className="bg-gray-50 border-b">

                <tr>

                  <th className="text-left py-4 px-4">
                    User
                  </th>

                  <th className="text-left py-4 px-4">
                    Email
                  </th>

                  <th className="text-left py-4 px-4">
                    Phone
                  </th>

                  <th className="text-left py-4 px-4">
                    Role
                  </th>

                  <th className="text-left py-4 px-4">
                    Joined
                  </th>

                  <th className="text-left py-4 px-4">
                    Actions
                  </th>

                </tr>
              </thead>

              {/* BODY */}
              <tbody>

                {filteredUsers.map(
                  (user) => (

                    <tr
                      key={user?._id}
                      className="border-b hover:bg-gray-50 transition"
                    >

                      {/* USER */}
                      <td className="py-4 px-4">

                        <div>

                          <h3 className="font-medium">
                            {user?.name ||
                              'Unnamed'}
                          </h3>

                          <p className="text-xs text-gray-500 mt-1">
                            ID:{' '}
                            {user?._id?.slice(
                              -6
                            )}
                          </p>
                        </div>
                      </td>

                      {/* EMAIL */}
                      <td className="py-4 px-4">
                        {user?.email ||
                          'N/A'}
                      </td>

                      {/* PHONE */}
                      <td className="py-4 px-4">
                        {user?.phone ||
                          '-'}
                      </td>

                      {/* ROLE */}
                      <td className="py-4 px-4">

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getRoleStyles(
                            user?.role
                          )}`}
                        >
                          {user?.role ||
                            'customer'}
                        </span>
                      </td>

                      {/* DATE */}
                      <td className="py-4 px-4 text-sm text-gray-500">

                        {user?.createdAt
                          ? new Date(
                              user.createdAt
                            ).toLocaleDateString()
                          : '-'}
                      </td>

                      {/* ACTION */}
                      <td className="py-4 px-4">

                        <select
                          value={
                            user?.role ||
                            'customer'
                          }

                          disabled={
                            updatingUserId ===
                              user?._id ||
                            currentUser?._id ===
                              user?._id
                          }

                          onChange={(e) =>
                            updateUserRole(
                              user._id,
                              e.target.value
                            )
                          }

                          className="border rounded-lg px-3 py-2 text-sm bg-white"
                        >

                          <option value="customer">
                            Customer
                          </option>

                          <option value="store_manager">
                            Store Manager
                          </option>

                          <option value="admin">
                            Admin
                          </option>

                        </select>

                        {currentUser?._id ===
                          user?._id && (
                          <p className="text-xs text-gray-400 mt-1">
                            Current User
                          </p>
                        )}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;