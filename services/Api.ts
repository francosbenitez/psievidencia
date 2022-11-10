/* eslint-disable import/no-anonymous-default-export */
import axios from "axios";
// import { getToken } from "../utils/helper";
import { store } from "../store";
import Router from "next/router";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://web-develop-ecb4.up.railway.app/api/";

export default () => {
  // const token: string | null = typeof window !== "undefined" ? getToken() : "";

  const state = store.getState();
  const token =
    state.userReducer.userToken != null
      ? state.userReducer.userToken
      : state.userReducer.userInfo != null
      ? state.userReducer.userInfo.token
      : null;

  const API = axios.create({
    baseURL: `${API_URL}`,
    headers: {
      Accept: "application/json",
      Authorization: token ? `Token ${token}` : "",
    },
  });

  API.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response.status === 401) {
        localStorage.removeItem("Token");
        localStorage.removeItem("state");
        console.log("error.reponse", error.response);
        Router.push("/");
      }
      return Promise.reject(error);
    }
  );

  return API;
};
