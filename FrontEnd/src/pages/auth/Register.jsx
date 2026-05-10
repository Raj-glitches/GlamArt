import {
  useState,
} from 'react';

import {
  Link,
  useNavigate,
} from 'react-router-dom';

import {
  useDispatch,
  useSelector,
} from 'react-redux';

import {
  register,
} from '../../slices/authSlice';

import {

  EnvelopeIcon,

  LockClosedIcon,

  UserIcon,

  PhoneIcon,

  EyeIcon,

  EyeSlashIcon,

} from '@heroicons/react/24/outline';

const Register = () => {

  const dispatch =
    useDispatch();

  const navigate =
    useNavigate();

  const {
    isLoading,
    error,
  } = useSelector(
    (state) => state.auth
  );

  /* ============================================
     STATE
  ============================================ */

  const [formData, setFormData] =
    useState({

      name: '',

      email: '',

      phone: '',

      password: '',

      confirmPassword: '',
    });

  const [showPassword, setShowPassword] =
    useState(false);

  const [validationError, setValidationError] =
    useState('');

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  /* ============================================
     HANDLE CHANGE
  ============================================ */

  const handleChange = (e) => {

    const {
      name,
      value,
    } = e.target;

    let updatedValue =
      value;

    // NAME VALIDATION
    if (name === 'name') {

      updatedValue =
        value
          .replace(
            /[^a-zA-Z\s]/g,
            ''
          )
          .replace(
            /\s+/g,
            ' '
          )
          .slice(0, 50);
    }

    // PHONE VALIDATION
    if (name === 'phone') {

      updatedValue =
        value
          .replace(
            /\D/g,
            ''
          )
          .slice(0, 10);
    }

    setFormData({

      ...formData,

      [name]:
        updatedValue,
    });

    setValidationError('');
  };

  /* ============================================
     VALIDATION
  ============================================ */

  const validateForm = () => {

    const {

      name,

      email,

      phone,

      password,

      confirmPassword,

    } = formData;

    // TRIM
    const trimmedName =
      name.trim();

    const trimmedEmail =
      email.trim();

    // NAME
    if (!trimmedName) {

      return 'Full name is required';
    }

    if (
      trimmedName.length < 3
    ) {

      return 'Name must be at least 3 characters';
    }

    if (
      !/^[A-Za-z ]+$/.test(
        trimmedName
      )
    ) {

      return 'Name can contain only letters';
    }

    // EMAIL
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      !emailRegex.test(
        trimmedEmail
      )
    ) {

      return 'Enter valid email address';
    }

    // PHONE
    const phoneRegex =
      /^[6-9]\d{9}$/;

    if (
      !phoneRegex.test(
        phone
      )
    ) {

      return 'Enter valid 10 digit Indian mobile number';
    }

    // PASSWORD
    if (
      password.length < 6
    ) {

      return 'Password must be at least 6 characters';
    }

    // STRONG PASSWORD
    const strongPassword =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{6,}$/;

    if (
      !strongPassword.test(
        password
      )
    ) {

      return 'Password must contain uppercase, lowercase and number';
    }

    // CONFIRM PASSWORD
    if (
      password !==
      confirmPassword
    ) {

      return 'Passwords do not match';
    }

    return null;
  };

  /* ============================================
     SUBMIT
  ============================================ */

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      if (
        isSubmitting
      ) return;

      setValidationError('');

      const validation =
        validateForm();

      if (validation) {

        setValidationError(
          validation
        );

        return;
      }

      try {

        setIsSubmitting(
          true
        );

        const {
          confirmPassword,

          ...registerData

        } = formData;

        // TRIM DATA
        registerData.name =
          registerData.name.trim();

        registerData.email =
          registerData.email
            .trim()
            .toLowerCase();

        const result =
          await dispatch(
            register(
              registerData
            )
          );

        if (!result.error) {

          navigate('/');
        }

      } finally {

        setIsSubmitting(
          false
        );
      }
    };

  return (

    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-gray-50">

      <div className="max-w-md w-full">

        <div className="bg-white rounded-2xl shadow-card p-8">

          {/* HEADER */}
          <div className="text-center mb-8">

            <h1 className="text-2xl font-display font-bold">
              Create Account
            </h1>

            <p className="text-gray-500 mt-2">
              Join GlamArt and start shopping
            </p>
          </div>

          {/* ERROR */}
          {(error || validationError) && (

            <div className="bg-red-50 border border-red-200 text-red-500 p-3 rounded-lg mb-4 text-sm">

              {error || validationError}

            </div>
          )}

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >

            {/* NAME */}
            <div>

              <label className="label">
                Full Name
              </label>

              <div className="relative">

                <UserIcon
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                />

                <input
                  type="text"

                  name="name"

                  value={formData.name}

                  onChange={handleChange}

                  className="input pl-10"

                  placeholder="Enter your full name"

                  required
                />
              </div>
            </div>

            {/* EMAIL */}
            <div>

              <label className="label">
                Email
              </label>

              <div className="relative">

                <EnvelopeIcon
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                />

                <input
                  type="email"

                  name="email"

                  value={formData.email}

                  onChange={handleChange}

                  className="input pl-10"

                  placeholder="Enter your email"

                  required
                />
              </div>
            </div>

            {/* PHONE */}
            <div>

              <label className="label">
                Phone Number
              </label>

              <div className="relative">

                <PhoneIcon
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                />

                <input
                  type="tel"

                  name="phone"

                  value={formData.phone}

                  onChange={handleChange}

                  className="input pl-10"

                  placeholder="Enter 10 digit mobile number"

                  required
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>

              <label className="label">
                Password
              </label>

              <div className="relative">

                <LockClosedIcon
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                />

                <input
                  type={
                    showPassword
                      ? 'text'
                      : 'password'
                  }

                  name="password"

                  value={formData.password}

                  onChange={handleChange}

                  className="input pl-10 pr-10"

                  placeholder="Create password"

                  required
                />

                <button
                  type="button"

                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }

                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >

                  {showPassword ? (

                    <EyeSlashIcon className="w-5 h-5 text-gray-400" />

                  ) : (

                    <EyeIcon className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* CONFIRM PASSWORD */}
            <div>

              <label className="label">
                Confirm Password
              </label>

              <div className="relative">

                <LockClosedIcon
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                />

                <input
                  type={
                    showPassword
                      ? 'text'
                      : 'password'
                  }

                  name="confirmPassword"

                  value={
                    formData.confirmPassword
                  }

                  onChange={handleChange}

                  className="input pl-10"

                  placeholder="Confirm password"

                  required
                />
              </div>
            </div>

            {/* BUTTON */}
            <button
              type="submit"

              className="btn-primary w-full"

              disabled={
                isLoading ||
                isSubmitting
              }
            >

              {isLoading ||

              isSubmitting

                ? 'Creating Account...'

                : 'Create Account'}
            </button>
          </form>

          {/* LOGIN */}
          <div className="mt-6 text-center">

            <p className="text-gray-600">

              Already have an account?
              {' '}

              <Link
                to="/login"

                className="text-primary-500 hover:text-primary-600 font-medium"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;