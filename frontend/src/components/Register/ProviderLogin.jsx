import { useState } from 'react';
import { Briefcase, Wrench, IndianRupee, CalendarCheck, Zap } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../../config/axios-config';

// Provider login: same layout and outlined inputs as the customer login page,
// with provider-focused wording and icons.
const LoginForm = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = location.state?.from;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSubmitting(true);

    api.post('/provider/login', formData, {
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((response) => {
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.provider))
      navigate(returnTo || '/provider/trips', { replace: true })
    }).catch((error) => {
      setErrorMessage(error.response?.data?.message || "We couldn't log you in. Please try again.");
    }).finally(() => setSubmitting(false));
  };

  return (
    <div className="md:bg-gray-50 h-[100vh] flex justify-center">
      <div className="text-gray-500 overflow-hidden z-0 hidden md:block">
        <Briefcase className="absolute top-24 left-60 rotate-[330deg] z-0" />
        <IndianRupee className="absolute top-[400px] left-[30vw] rotate-[330deg] z-0" />
        <CalendarCheck className="absolute top-[500px] right-20 z-0" />
        <Wrench className="absolute top-[500px] left-40 rotate-[10deg] z-0" />
        <Zap className="absolute top-[250px] left-[50%] z-0" />
      </div>
      <div className="flex items-center justify-center w-full max-w-7xl">
        <main className="relative z-10 flex items-center justify-center md:justify-between border-dashed w-full border-indigo-500 md:border-2 md:m-10 md:p-10 lg:m-10 lg:p-20 rounded-lg bg-white">
          <div className="mx-2 mt-10 w-[550px] hidden md:block">
            <span className="inline-block mb-4 rounded-full bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-600">KnockNow Partner</span>
            <h1 className="text-5xl font-bold tracking-wide">Grow Your Service <span className="bg-indigo-500 text-white">Business</span></h1>
            <p className="text-gray-500 mt-4 mr-10">Welcome back, partner. Log in to accept new bookings, go online for instant requests, manage your services and track your earnings, all in one place.</p>
          </div>
          <div className="max-w-md w-full">
            <div className="text-center">
              <span className="md:hidden inline-block mb-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">KnockNow Partner</span>
              <h2 className="mt-2 text-3xl font-extrabold">
                Login as Provider
              </h2>
              <p className="mt-1 text-sm text-gray-500">Manage your bookings and services</p>
            </div>
            <form onSubmit={handleSubmit} className="mt-3 space-y-2 text-sm p-5">
              <div className="rounded-md">
                <p className="text-red-600 -mt-3" role="alert">{errorMessage}</p>
                <div className="mt-4 relative">
                  <label htmlFor="provider-email" className="absolute left-3 -top-3 bg-white px-1 text-sm font-medium text-indigo-500">Business Email</label>
                  <input
                    id="provider-email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    className="block w-full pl-4 pr-3 py-4 md:py-3 border border-gray-300 bg-white rounded-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-lg md:text-sm"
                    value={formData.email}
                    onChange={handleChange}
                    required />
                </div><br />
                <div className="relative">
                  <label htmlFor="provider-password" className="absolute left-3 -top-3 bg-white px-1 text-sm font-medium text-indigo-500">Password</label>
                  <input
                    id="provider-password"
                    type="password"
                    name="password"
                    autoComplete="current-password"
                    className="block w-full pl-4 pr-3 py-4 md:py-3 border border-gray-300 bg-white rounded-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-lg md:text-sm"
                    value={formData.password}
                    onChange={handleChange}
                    required />
                </div>
              </div>
              <div className="pt-3">
                <button type="submit" disabled={submitting} className="group relative w-full flex justify-center py-4 md:py-3 px-4 border border-transparent font-medium rounded-sm text-white bg-indigo-500 hover:bg-indigo-600 disabled:opacity-60 text-lg md:text-sm cursor-pointer focus:outline-none mt-1">
                  {submitting ? 'Logging in…' : 'LogIn Now'}
                </button>
              </div>
            </form>
            <div className='w-full flex'>
              <Link to='/provider/register' className='-mt-3 mx-auto text-gray-600 tracking-wide font-semibold cursor-pointer'>Register your business?</Link>
            </div>
            <p className='mt-4 px-5 pb-2 text-center text-sm text-gray-500'>
              Looking to book a service?{' '}
              <Link to='/login' className='text-indigo-500 hover:text-indigo-600 font-medium'>Login as customer</Link>
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default LoginForm;
