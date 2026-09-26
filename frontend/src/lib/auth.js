// Small helpers around the JWT stored in localStorage by the login pages.
// The token payload carries { id, role } where role is 'customer' or 'provider'.

export const getToken = () => {
  try {
    return localStorage.getItem('token');
  } catch {
    return null;
  }
};

export const getAuthUser = () => {
  const token = getToken();
  if (!token) return null;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const data = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    if (data.exp && data.exp * 1000 < Date.now()) return null;
    return data;
  } catch {
    return null;
  }
};

export const isCustomer = () => getAuthUser()?.role === 'customer';
export const isProvider = () => getAuthUser()?.role === 'provider';

export const logout = (redirectTo = '/') => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = redirectTo;
};
