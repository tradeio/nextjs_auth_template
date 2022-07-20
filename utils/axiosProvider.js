import axios from "axios";
import { getCookie, setCookie } from "cookies-next";
import { NEXT_PUBLIC_BACKEND_URL } from "../config/enums";

async function refreshAccessToken(rToken) {
  return axios.post(`${NEXT_PUBLIC_BACKEND_URL}/auth/refresh`, {
    refreshToken: rToken,
  }).then(res => res.data.jwt);
}

function createAxiosInstance(jwt, rToken, ctx) {
  let instance = axios.create({
    baseURL: NEXT_PUBLIC_BACKEND_URL,
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  });
  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      if (error.response.data && error.response.data.code === "JWT_EXPIRED") {
        let newJwt = await refreshAccessToken(rToken);
        setCookie("jwt", newJwt, {}, ctx);
        error.config.headers["Authorization"] = `Bearer ${newJwt}`;
        error.config.baseURL = undefined;
        return instance.request(error.config);
      }
      throw error;
    }
  );
  return instance;
}

let axiosInstance;
/**
 *
 * @param {import("next").GetServerSidePropsContext} ctx
 * @return {axios}
 */
export default function getAxiosInstance(ctx) {
  const jwt = getCookie("jwt", ctx);
  const rToken = getCookie("rToken", ctx);
  if(ctx){
    return createAxiosInstance(jwt, rToken, ctx);
  } else {
    if(!axiosInstance){
      axiosInstance = createAxiosInstance(jwt, rToken);
    }
    return axiosInstance;
  }
}
