function SignUp() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-blue-50 via-white to-blue-50">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/* left */}
        <div className="flex-1">
          <div className="mt-20">
            <span className="font-bold text-xl text-gray-700">
              Welcome to My CRM.
            </span>
            <p className="font-semibold text-lg text-left text-blue-600">
              You can sign up with your email and password or with Google.
            </p>
          </div>
        </div>
        {/* right */}
        <div className="flex-1 mt-20">
          <form className="flex flex-col gap-4">
            <div className="border-b-2 border-t-2 border-l-2 border-r-2 p-2 rounded-2xl border-blue-500">
              <label className="border-t-2" value="Your username" />
              <input type="text" placeholder="Username" id="username" />
            </div>
            <div className="border-b-2 border-t-2 border-l-2 border-r-2 p-2 rounded-2xl  border-blue-500">
              <label className="border-t-2" value="Your email" />
              <input type="text" placeholder="name@company.com" id="email" />
            </div>
            <div className="border-b-2 border-t-2 border-l-2 border-r-2 p-2 rounded-2xl  border-blue-500">
              <label className="border-t-2" value="Your password" />
              <input type="text" placeholder="Password" id="password" />
            </div>
            <button
              className="bg-gradient-to-r from-violet-600 to-indigo-600 p-2 rounded-2xl"
              type="submit"
            >
              Sign Up
            </button>
          </form>
          <div className="flex gap-2 text-lg mt-5">
            <span>Have an account?</span>
            <button className="text-blue-500">Sign In</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
