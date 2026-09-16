import axios from "axios";

export const login = async function (data) {
  const response = await axios({
    url: "http://localhost:3001/api/v1/user/login",
    method: "POST",
    data,
    withCredentials: true,
  });

  return response;
};

export const sign = async function (data) {
  const response = await axios({
    url: "http://localhost:3001/api/v1/user/signup",
    method: "POST",
    data,
    withCredentials: true,
  });

  return response;
};

export const verifyEmail = async function (data) {
  const response = await axios({
    url: "http://localhost:3001/api/v1/user/verifyEmail",
    method: "POST",
    data,
    withCredentials: true,
  });

  return response;
};

export const forgetPassword = async function (data) {
  const response = await axios({
    url: "http://localhost:3001/api/v1/user/forgetPassword",
    method: "POST",
    data,
  });

  return response;
};

export const resetPassword = async function ({ data, token }) {
  const response = await axios({
    url: `http://localhost:3001/api/v1/user/resetPassword/${token}`,
    method: "PATCH",
    data,
  });

  return response;
};

export const getMe = async function () {
  const response = await axios({
    url: "http://localhost:3001/api/v1/user/getMe",
    method: "GET",
    withCredentials: true,
  });

  return response.data.data.user;
};

export const logout = async function () {
  const responce = await axios({
    url: "http://localhost:3001/api/v1/user/logout",
    method: "GET",
    withCredentials: true,
  });

  return responce.data;
};

export async function cancelSignup(email) {
  const response = await axios.delete(
    "http://localhost:3001/api/v1/user/cancelSignUp",
    {
      data: { email }, // DELETE requests send body inside `data`
      withCredentials: true,
    },
  );

  return response.data;
}

export async function updateMe(formData) {
  const response = await axios.patch(
    "http://localhost:3001/api/v1/user/updateMe",
    formData,
    {
      withCredentials: true,
    },
  );

  return response.data;
}

export async function updateMyPassword(data) {
  const response = await axios.patch(
    "http://localhost:3001/api/v1/user/updatePassword",
    data,
    {
      withCredentials: true,
    },
  );

  return response.data;
}

export async function deleteAccount(password) {
  const response = await axios.delete(
    "http://localhost:3001/api/v1/user/deleteUser",
    {
      data: { password },
      withCredentials: true,
    },
  );

  return response.data;
}

export async function consultantBooking(data) {
  const response = await axios.post(
    "http://localhost:3001/api/v1/user/consultant",
    data,
    {
      withCredentials: true,
    },
  );

  return response.data;
}