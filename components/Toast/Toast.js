import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const showToast = (message, type = 'success' , options={}) => {
  if (type === 'success') {
    toast.success(message,options);
  } else if (type === 'error') {
    toast.error(message,options);
  } else if (type === 'info') {
    toast.info(message,options);
  } else if (type === 'warning') {
    toast.warning(message,options);
  }
};

export const statusToast = (startMessage, successMessage, failureMessage) => {
  const notify = () => toast(startMessage, { autoClose: false });
  return (promise) => {
    const toastId = notify();
    return promise
      .then(() => {
        toast.success(successMessage);
      })
      .catch(() => {
        toast.error(failureMessage);
      })
      .finally(() => {
        toast.dismiss(toastId);
      });
  };
};

export const processWithToast = (
  { startMessage, successMessage, failureMessage },
  promise
) => {
  statusToast(startMessage, successMessage, failureMessage)(promise);
};
