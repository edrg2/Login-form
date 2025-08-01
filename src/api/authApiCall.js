import axios from "axios";

// --- Axios (json-server) 版本 API ---
const axiosLoginApiCall = async (data) => {
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
};

const axiosRegisterApiCall = async (data) => {
  const { email, password } = data;

  const checkResponse = await axios.get(`/api/users?email=${email}`);

  if (checkResponse.data.length > 0) {
    throw new Error("此電子郵件已被註冊");
  }

  const newUserResponse = await axios.post("/api/users", { email, password });

  return newUserResponse.data;
};

// --- Mock (promise) 版本 API
const mockLoginApiCall = (data) => {
  return new Promise((resolve, reject) =>
    setTimeout(() => {
      if (data.password === "Password123") {
        resolve({ id: 1, email: data.email, name: "Mock User" });
      } else {
        reject(new Error("帳號或密碼不一致"));
      }
    }, 1500)
  );
};

const mockRegisterApiCall = (data) => {
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve({ id: 2, email: data.email, name: "New Mock User" });
    }, 1500)
  );
};

const isMockMode = import.meta.env.VITE_API_MODE === "mock";

console.log(
  `API 模式: ${isMockMode ? "Mock (Promise)" : "Axios (json-server)"}`
);

export const loginApiCall = isMockMode ? mockLoginApiCall : axiosLoginApiCall;
export const registerApiCall = isMockMode
  ? mockRegisterApiCall
  : axiosRegisterApiCall;
