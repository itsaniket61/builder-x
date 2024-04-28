import { ROOT_DIR_ALIAS } from "next/dist/lib/constants";

export const AppConstants = {
  ROOT_DIR_ALIAS: 'BuildersX/Users',
  URLS: {
    STORAGE_SERVICE_URL_V1: process.env.STORAGE_SERVICE_URL + '/keeper/v1',
    CRAFTER_SERVICE_URL_V1: process.env.CRAFTER_SERVICE_URL + '/craft/v1',
    AUTH_SERVICE_URL_V1: '/gateway/auth',
  },
};