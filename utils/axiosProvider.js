import axios from "axios";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
import { NEXT_PUBLIC_BACKEND_URL } from "../config/client_enums";

export async function refreshAccessToken(rToken) {
  return axios.post(`${NEXT_PUBLIC_BACKEND_URL}/auth/refresh`, {
    refreshToken: rToken,
  }).then(res => res.data.jwt);
}

/**
 *
 * @param {import("next").GetServerSidePropsContext} ctx
 * @return {axios}
 */
export default function getAxiosInstance(ctx) {
  let instance = axios.create({
    baseURL: NEXT_PUBLIC_BACKEND_URL,
    headers: {
      authorization: `Bearer ${getCookie("jwt", ctx)}`,
    },
  });
  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const jwt = getCookie("jwt", ctx);
      const rToken = getCookie("rToken", ctx);
      if(error.response.status === 401 && error.response.data.code === "INVALID_JWT")  {
        try {
          let newJwt = await refreshAccessToken(rToken);
          setCookie("jwt", newJwt, ctx);
          instance.defaults.headers["authorization"] = `Bearer ${newJwt}`;
          error.config.headers["authorization"] = `Bearer ${newJwt}`;
          error.config.baseURL = undefined;
          return instance.request(error.config);
        } catch(e) {
          deleteCookie("jwt", ctx);
          deleteCookie("rToken", ctx);
          throw e;
        }
      }
      throw error;
    }
  );
  return instance;
}
