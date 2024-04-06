import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const showToast = (message, type = 'success') => {
  if (type === 'success') {
    toast.success(message);
  } else if (type === 'error') {
    toast.error(message);
  } else if (type === 'info') {
    toast.info(message);
  } else if (type === 'warning') {
    toast.warning(message);
  }
};
