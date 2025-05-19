import { Link } from "react-router-dom";
import { useAuthContext } from "../../auth/useAuthContext";
import { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";

export default function Login() {
  const { login } = useAuthContext();
  const [loading, setLoading] = useState(false);
  

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email"));
    const password = String(formData.get("password"));

    try {
      setLoading(true);
      await login(email, password);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-[#202227] lg:grid lg:grid-cols-12 gap-6 p-10" >

      <section className="md:col-span-6 col-span-12 flex justify-center">
        <div className='flex flex-col justify-center items-center gap-6 md:w-[50%] w-full'>
          <div className="flex flex-col items-start justify-start gap-10 w-full">
            <h1 className='font-extrabold font-poppins text-4xl text-white'
              style={{ fontFamily: 'poppins', letterSpacing: '-3px' }}>spectra.</h1>

            <div className="flex flex-col gap-3">
              <h1 className="text-white text-xl">Welcome Back  👋</h1>
              <p className="text-gray-500">We are happy to have you back</p>
            </div>
          </div>

          {/* İçerik (form + başlıklar) */}
          <div className="w-full">
            <form className="flex flex-col gap-3 w-full h-96" onSubmit={handleOnSubmit}>
              <label htmlFor="" className="text-gray-500">Email address*</label>
              <input
                type="text"
                name="email"
                placeholder="E-posta"
                className="border border-gray-600 text-white rounded
                            placeholder:text-gray-400 py-3 px-5
                            focus:!outline-none      
                            focus:!ring-0            
                            focus:!ring-offset-0      
                            focus:!shadow-none"
              />
              <label htmlFor="" className="text-gray-500">Password*</label>
              <input
                type="password" name="password"
                placeholder="Password"
                className="border border-gray-600 text-white rounded
                            placeholder:text-gray-400 py-3 px-5
                            focus:!outline-none      
                            focus:!ring-0            
                            focus:!ring-offset-0      
                            focus:!shadow-none"
              />
              <div className='flex items-center gap-3'>
                <input type="checkbox" className="my-3" />
                <p className="text-gray-600">I agree to terms & conditions</p>
              </div>

              <button
                disabled={loading}
                className="bg-[#5871EB] text-white p-2 rounded-md flex items-center justify-center gap-3 disabled:opacity-50 disabled:pointer-events-none"
              >
                {loading && <FaSpinner className="animate-spin" />}
                Login
              </button>
              <Link to={"/register"} className="text-white underline">Do you have a not account? </Link>
            </form>
          </div>
        </div>
      </section>

      <section className="hidden lg:block self-stretch overflow-hidden col-span-6">
        <img
          src="/assets/login-bg.jpg"
          alt="Login background"
          className="h-full w-full object-cover object-left-top rounded-xl"
        />
      </section>
    </div>
  );
}
