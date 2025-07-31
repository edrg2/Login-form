import axios from "axios";

// 登入 Api
export const loginApiCall = async (data) => {
  const { email, password } = data;

  const response = await axios.get(`/api/users?email=${email}`);
  const users = response.data;

  if (users.length === 0) {
    throw new Error("此電子郵件尚未註冊");
  }

  const user = users[0];
  if (user.password !== password) {
    throw new Error("密碼不一致");
  }

  const { password: _, ...userToReturn } = user;
  return userToReturn;

  // console.log("呼叫 登入API:", data);
  // return new Promise((resolve, reject) =>
  //   setTimeout(() => {
  //     if (data.password === "12345678") {
  //       reject(new Error("密碼過於簡單，伺服器拒絕登入！"));
  //     } else {
  //       resolve({ message: "Success" });
  //     }
  //   }, 1500)
  // );
};

// 註冊 Api
export const registerApiCall = async (data) => {
  const { email, password } = data;

  const checkResponse = await axios.get(`/api/users?email=${email}`);

  if (checkResponse.data.length > 0) {
    throw new Error("此電子郵件已被註冊");
  }

  const newUserResponse = await axios.post("/api/users", { email, password });

  return newUserResponse.data;

  // console.log("呼叫 註冊API:", data);
  // return new Promise((resolve) => setTimeout(resolve, 1500));
};
