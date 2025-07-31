export const loginApiCall = (data) => {
  console.log("呼叫 登入API:", data);
  return new Promise((resolve, reject) =>
    setTimeout(() => {
      if (data.password === "12345678") {
        reject(new Error("密碼過於簡單，伺服器拒絕登入！"));
      } else {
        resolve({ message: "Success" });
      }
    }, 1500)
  );
};

export const registerApiCall = (data) => {
  console.log("呼叫 註冊API:", data);
  return new Promise((resolve) => setTimeout(resolve, 1500));
};
