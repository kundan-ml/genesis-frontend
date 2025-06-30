import { useEffect } from 'react';

const RegisterServiceWorker = () => {
  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.register('/sw.js')
        .then(function(registration) {
          console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch(function(error) {
          console.log('Service Worker registration failed:', error);
        });
    }
  }, []);

  return null;  // This component doesn't render anything visible
};

export default RegisterServiceWorker;
