// src/pages/OAuthTransfer.jsx
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from './axios-config';

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

    api.post('customer/existancecheck', {email:  email , mobile: '' }).then((response) => {
    navigate('/register/mobilevarification', { state: { formData } });
  }).catch((error) => {
    navigate('/login', { state: { emailmobile: email, message: "Your email is already linked to an account. Please use the password you set during registration to log in."} });
  });
  }, []);

  return <p>Redirecting...</p>;
};

export default OAuthTransfer;
