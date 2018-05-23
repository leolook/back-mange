import axios from "axios";
import qs from "qs";
import createError from "axios/lib/core/createError";
import { message } from "antd";
import { hashHistory } from "react-router";

const isURLRegex = /^(?:\w+:)\/\//;
axios.interceptors.request.use(config => {
  console.log("request", config);
  if (config.headers["Content-Type"] == "application/x-www-form-urlencoded") {
    config.data = qs.stringify(config.data);
  }
  let userInfo = window.sessionStorage.getItem("user");
  if (userInfo != null && userInfo != "") {
    let user = JSON.parse(userInfo);
    config.headers["userId"] = user.userId;
    config.headers["token"] = user.token;
  }
  return config;
});

axios.interceptors.response.use(response => {
  console.log("interceptors", response);
  let redata = "";
  if (response.data.hasOwnProperty("data")) {
    redata = response.data.data;
  } else if (response.hasOwnProperty("data")) {
    redata = response.data;
  } else {
    redata = response;
  }

  if (response.data.hasOwnProperty("code") && response.data.code != 0) {
    if (response.data.code == -1) {
      //token invalid
      console.log("token invalid", response.data);
      window.location.href = "/#/login";
      return null;
    } else if (response.data.code == 500) {
      message.error(response.data.message);

      let error = new createError(
        response.data.message,
        response.data.code,
        response.data.code,
        response.data.data
      );
      return Promise.reject(error);
    } else {
      message.error(redata);
    }
  }
  return redata;
});

export default axios;