import axios from "axios";

const APIUrl = import.meta.env.VITE_API_URL

const api = axios.create({
  baseURL: APIUrl + "/api/",
});

api.interceptors.request.use(async (config) => {
  let access = localStorage.getItem("access");
  const refresh = localStorage.getItem("refresh");

  if (!access) return config;

  const tokenData = JSON.parse(atob(access.split(".")[1]));
  const exp = tokenData.exp * 1000;
  const now = new Date().getTime();

  if (now > exp && refresh) {
    try {
      const res = await axios.post(`${APIUrl}/api/token/refresh/`, {
        refresh,
      });
      access = res.data.access;
      localStorage.setItem("access", access);
    } catch (err) {
      console.log("Refresh token failed", err);
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      window.location.href = "/";
    }
  }

  config.headers.Authorization = `Bearer ${access}`;
  return config;
});

export default api;
