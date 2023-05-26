import { useState } from 'react';

const useSnackbar = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');

  const showSnackbar = (message) => {
    setOpen(true);
    setMessage(message);
  };

  const closeSnackbar = () => {
    setOpen(false);
    setMessage('');
  };

  return { open, message, showSnackbar, closeSnackbar };
};

export default useSnackbar;
