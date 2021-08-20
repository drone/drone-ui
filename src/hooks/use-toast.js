import { useCallback } from 'react';
import { toast } from 'react-toastify';

const DEFAULT_TIMEOUT = 3000;

const useToast = () => {
  const showSuccess = useCallback((message, timeout = DEFAULT_TIMEOUT) => {
    toast.success(message, {
      autoClose: timeout,
    });
  }, []);

  const showWarning = useCallback((message, timeout = DEFAULT_TIMEOUT) => {
    toast.warn(message, {
      autoClose: timeout,
    });
  }, []);

  const showError = useCallback((message, timeout = DEFAULT_TIMEOUT) => {
    toast.error(message, {
      autoClose: timeout,
    });
  }, []);

  return {
    showSuccess,
    showWarning,
    showError,
  };
};

export default useToast;
