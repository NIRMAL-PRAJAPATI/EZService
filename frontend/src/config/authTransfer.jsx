// src/pages/OAuthTransfer.jsx
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const OAuthTransfer = () => {
  const { search } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(search);
    const name = params.get('name');
    const email = params.get('email');

    const formData = {
      name,
      email,
      mobile: '',
      password: '',   // Ask during mobile verification
      city: '',
      state: '',
      country: ''
    };

    // Redirect to the mobile verification page with state
    navigate('/register/mobilevarification', { state: { formData } });
  }, []);

  return <p>Redirecting...</p>;
};

export default OAuthTransfer;
