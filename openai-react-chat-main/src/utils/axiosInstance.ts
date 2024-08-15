// src/services/axiosInstance.ts
import axios from "axios";
import type { AxiosRequestConfig, AxiosResponse } from "axios";
// import router from "@/router";
// import { useAuthStore } from "@/stores/authStore";

const useMock = true;

let axiosURL = null;
if (import.meta.env.MODE === "development" || import.meta.env.MODE === "test") {
  axiosURL = {
    baseURL: useMock ? "" : "/api",
  };
} else {
  axiosURL = {
    baseURL:
      "https://wa-cip-dev-wus-backend-campaign-manager.azurewebsites.net",
  };
}

// Create an Axios instance
const axiosInstance = axios.create(axiosURL);

// Request Interceptor to add Authorization token
axiosInstance.interceptors.request.use(
  (config) => {
    //const authStore = useAuthStore();
    // const token = authStore.accessToken;
    // const userInfo = authStore.userInfo;
    // const fullName = `${userInfo?.given_name} ${userInfo?.family_name}`;
    // const email = userInfo?.email;

    // Ensure headers object exists
    config.headers = config.headers || {};

    // Set Authorization and custom user headers if not already set
    // if (token && !config.headers["Authorization"]) {
    //   config.headers["Authorization"] = `Bearer ${token}`;
    // }
    // if (!config.headers["X-User-Name"]) {
    //   config.headers["X-User-Name"] = fullName;
    // }
    // if (!config.headers["X-User-Email"]) {
    //   config.headers["X-User-Email"] = email;
    // }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response Interceptor to handle 500 errors
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response && error.response.status === 500) {
//       router.push({ name: "Error500" });
//     }
//     return Promise.reject(error);
//   }
// );

// Utility functions for common HTTP methods
const get = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await axiosInstance.get<T>(url, config);
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

const post = async <T>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig,
): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await axiosInstance.post<T>(
      url,
      data,
      config,
    );
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

const put = async <T>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig,
): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await axiosInstance.put<T>(
      url,
      data,
      config,
    );
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

const patch = async <T>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig,
): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await axiosInstance.patch<T>(
      url,
      data,
      config,
    );
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

const del = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await axiosInstance.delete<T>(
      url,
      config,
    );
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export { get, post, put, patch, del };
export default axiosInstance;
