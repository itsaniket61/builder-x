import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppConstants } from '@/Constants/AppConstants';

export function useAuth(successPath, failedPath) {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          AppConstants.URLS.AUTH_SERVICE_URL_V1 + '/token'
        );

        if (response.ok) {
          router.push(successPath);
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
  }, [successPath, failedPath, router]);

  return { isLoading };
}
