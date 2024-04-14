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
