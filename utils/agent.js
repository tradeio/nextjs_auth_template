import getAxiosInstance from "./axiosProvider";

function agent(ctx) {
  let axiosInstance = getAxiosInstance(ctx);
  return {
    login: async (email, password) => {
      return axiosInstance.post("/auth/login", { email, password });
    },
    logout: async () => {
      return axiosInstance.post("/auth/logout");
    },
    register: async (email, password) => {
      return axiosInstance.post("/auth/register", { email, password });
    },
    example: async () => {
      return axiosInstance.get("/hello");
    }
  }
}

export default agent;