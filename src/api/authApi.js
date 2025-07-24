export const loginApi = (data) => {
  console.log("呼叫 登入API:", data);
  return new Promise((resolve) => setTimeout(resolve, 1500));
};

export const registerApi = (data) => {
  console.log("呼叫 註冊API:", data);
  return new Promise((resolve) => setTimeout(resolve, 1500));
};
