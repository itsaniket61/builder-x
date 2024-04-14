import { AppConstants } from '@/Constants/AppConstants';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function useAuth(successPath, failedPath) {
  const url = AppConstants.URLS.AUTH_SERVICE_URL_V1 + '/token';
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        if (response.ok) {
          router.push(successPath);
        } else {
          router.push(failedPath);
        }
      } catch (error) {
        console.error('Error fetching authentication data:', error);
        router.push(failedPath);
      }
    };

    fetchData();
  }, [url, successPath, failedPath, router]);
}
