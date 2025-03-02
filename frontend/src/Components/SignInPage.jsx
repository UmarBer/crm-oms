import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  signInStart,
  signInSuccess,
  signInFailure
} from '../redux/user/userSlice';
import OAuth from './OAuth';

function SignIn() {
  const [formData, setFormData] = useState({});
  // eslint-disable-next-line no-unused-vars
  const { loading, error: errorMessage } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const clearErrorMessage = () => {
    dispatch(signInFailure(null));
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      return dispatch(signInFailure());
    }
    try {
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include'
      });
      const data = await res.json();
      if (!res.ok || data.success === false) {
        return dispatch(signInFailure(data.message || 'Login failed'));
      }

      console.log('Login Response:', data); // ✅ Debugging log

      if (data.token) {
        localStorage.setItem('token', data.token); // ✅ Store token in localStorage
      } else {
        console.warn('No token received');
      }

      dispatch(signInSuccess(data));
      navigate('/'); // ✅ Redirect user after successful login
    } catch (error) {
      console.error('Login Error:', error);
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <>
      <div className="min-h-screen flex flex-col pt-20 md:pt-56 bg-gradient-to-r from-blue-50 via-white to-blue-50">
        <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
          {/* left */}
          <div className="flex-1">
            <div className="mt-20">
              <span className="font-bold text-xl text-gray-700">
                Welcome to My CRM.
              </span>
              <p className="font-semibold text-lg text-left text-blue-600">
                You can sign in with your email and password or with Google.
              </p>
            </div>
          </div>
          {/* right */}
          <div className="flex-1 mt-20">
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <div className="border-b-2 border-t-2 border-l-2 border-r-2 p-2 rounded-2xl  border-blue-500">
                <label className="border-t-2" value="Your email" />
                <input
                  type="text"
                  placeholder="name@company.com"
                  id="email"
                  className="focus:outline-none"
                  onChange={handleChange}
                />
              </div>
              <div className="border-b-2 border-t-2 border-l-2 border-r-2 p-2 rounded-2xl  border-blue-500">
                <label className="border-t-2" value="Your password" />
                <input
                  type="password"
                  placeholder="Password"
                  id="password"
                  className="focus:outline-none"
                  onChange={handleChange}
                />
              </div>
              <button
                className="bg-gradient-to-r from-violet-600 to-indigo-600 p-2 rounded-2xl"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <div
                    role="status"
                    className="flex justify-center items-center"
                  >
                    <svg
                      aria-hidden="true"
                      className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-orange-500"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                    <span className="sr-only">Loading...</span>
                  </div>
                ) : (
                  <span className="text-white font-bold tracking-widest">
                    Sign In
                  </span>
                )}
              </button>
              <OAuth
                updateFormData={setFormData}
                clearErrorMessage={clearErrorMessage}
              />
            </form>
            <div className="flex gap-2 text-lg mt-5">
              <span>Don&apos;t have an account?</span>
              <a href="/signup" className="text-blue-500">
                Sign Up
              </a>
            </div>
            {errorMessage && (
              <div className="text-red-500 text-sm mt-2">{errorMessage}</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default SignIn;
