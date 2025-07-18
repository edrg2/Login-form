import * as yup from "yup";

export const loginSchema = yup
  .object({
    email: yup
      .string()
      .email("* 電子郵件格式不正確")
      .required("* 此為必填欄位"),
    password: yup
      .string()
      .min(6, "* 密碼長度不能少於 6 個字元")
      .required("* 此為必填欄位"),
    ReCAPTCHA: yup.string().required("* 請勾選完成驗證"),
  })
  .required();
