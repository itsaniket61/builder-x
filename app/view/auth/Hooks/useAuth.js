import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import jwt_decode from 'jwt-decode';
import { AppConstants } from '@/Constants/AppConstants';

export function useAuth(successPath, failedPath) {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const isTokenExpired = (token) => {
    if (!token) return true;

    const decodedToken = jwt_decode(token);
    const currentTime = Date.now() / 1000;

    return decodedToken.exp < currentTime;
  };

  const refreshToken = async () => {
    try {
      const response = await fetch(
        AppConstants.URLS.AUTH_SERVICE_URL_V1 + '/refresh-token',
        {
          method: 'POST',
          credentials: 'include', // Assuming the refresh token is sent via cookies
        }
      );

      if (response.ok) {
        const data = await response.json();
        return data.accessToken;
      } else {
        throw new Error('Failed to refresh token');
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
      return null;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          AppConstants.URLS.AUTH_SERVICE_URL_V1 + '/token',
          {
            credentials: 'include', // Assuming the token is sent via cookies
          }
        );

        if (response.ok) {
          const data = await response.json();
          const token = data.accessToken;

          if (isTokenExpired(token)) {
            const newToken = await refreshToken();
            if (newToken) {
              router.push(successPath);
            } else {
              router.push(failedPath);
            }
          } else {
            router.push(successPath);
          }
        } else {
          router.push(failedPath);
        }
      } catch (error) {
        console.error('Error fetching authentication data:', error);
        router.push(failedPath);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    const refreshInterval = setInterval(async () => {
      try {
        const response = await fetch(
          AppConstants.URLS.AUTH_SERVICE_URL_V1 + '/token',
          {
            credentials: 'include', // Assuming the token is sent via cookies
          }
        );

        if (response.ok) {
          const data = await response.json();
          const token = data.accessToken;

          if (isTokenExpired(token)) {
            const newToken = await refreshToken();
            if (!newToken) {
              router.push(failedPath);
              clearInterval(refreshInterval);
            }
          }
        } else {
          router.push(failedPath);
          clearInterval(refreshInterval);
        }
      } catch (error) {
        console.error('Error refreshing token:', error);
        router.push(failedPath);
        clearInterval(refreshInterval);
      }
    }, 2 * 60 * 1000); // Check every 2 minutes

    return () => clearInterval(refreshInterval);
  }, [successPath, failedPath, router]);

  return { isLoading };
}
