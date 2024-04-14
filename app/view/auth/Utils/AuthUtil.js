import { AppConstants } from "@/Constants/AppConstants"

export const AuthUtil = {
  signUp : async (name, email, password) => {
    try {
      if (!name || !email || !password)
        throw new Error('Please enter your name, email address and password');
      const url = AppConstants.URLS.AUTH_SERVICE_URL_V1 + '/signup';
      const reqOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      };
      const req = await fetch(url, reqOptions);
      if (req.status == 201) {
        const res = await req.json();
        return res;
      } else {
        const res = await req.json();
        throw new Error(res.error);
      }
    } catch (error) {
      throw new Error(error.message);
    }
  },
    signIn : async (email,password) => {
        try {
            if (!email || !password)
              throw new Error('Please enter your email address and password');
            const url = AppConstants.URLS.AUTH_SERVICE_URL_V1 + '/signin';
            const reqOptions = {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ email, password }),
            };
            const req = await fetch(url, reqOptions);
            if (req.status == 200) {
              const res = await req.json();
              return res;
            } else {
              const res = await req.json();
              throw new Error(res.error);
            }
        } catch (error) {
            throw new Error(error.message);
        }
    },
    signout: async () =>{
      const url = AppConstants.URLS.AUTH_SERVICE_URL_V1 + '/signout';
      const reqOptions = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      };
      const req = await fetch(url, reqOptions);
      if (req.ok) {
        const res = await req.json();
        return res;
      } else {
        const res = await req.json();
        throw new Error(res.error);
      }
    }
}