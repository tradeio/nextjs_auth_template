import { deleteCookie, setCookie } from "cookies-next";
import getAxiosInstance from "./axiosProvider";

function agent(ctx) {
  let axiosInstance = getAxiosInstance(ctx);
  return {
    login: async (email, password) => {
      return axiosInstance
        .post("/auth/login", { email, password })
        .then((res) => {
          setCookie("jwt", res.data.jwt);
          setCookie("rToken", res.data.refreshToken);
          window.localStorage.setItem("rToken", res.data.refreshToken);
          return res;
        });
    },
    refreshAccessToken: async () => {
      let rToken = window.localStorage.getItem("rToken");
      if (!rToken) {
        deleteCookie("rToken", ctx);
        deleteCookie("jwt", ctx);
        return Promise.reject("Refresh token does not exists");
      }
      return axiosInstance
        .post("/auth/refresh", { refreshToken: rToken })
        .then((res) => {
          setCookie("jwt", res.data.jwt);
          setCookie("rToken", rToken);
          return res;
        });
    },
    logout: async () => {
      return axiosInstance.post("/auth/logout").then((res) => {
        deleteCookie("jwt");
        deleteCookie("rToken");
        window.localStorage.removeItem("rToken");
        return res;
      });
    },
    register: async (email, password) => {
      return axiosInstance
        .post("/auth/register", { email, password })
        .then((res) => {
          setCookie("jwt", res.data.jwt);
          setCookie("rToken", res.data.refreshToken);
          window.localStorage.setItem("rToken", res.data.refreshToken);
          return res;
        });
    },
    example: async () => {
      return axiosInstance.get("/hello");
    },
  };
}

export default agent;
