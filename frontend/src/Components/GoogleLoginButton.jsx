import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase';

const Login = () => {
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log('User info: ', user);
    } catch (error) {
      console.error('Error signing in with Google: ', error);
    }
  };
  return (
    <button
      onClick={handleGoogleLogin}
      type="button"
      className="text-white w-auto bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg shadow-md transition duration-200 font-bold"
    >
      Login with Google
    </button>
  );
};

export default Login;
