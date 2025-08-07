import * as yup from "yup";

const passwordRules = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

export const loginSchema = yup
  .object({
    email: yup
      .string()
      .email("* 請輸入有效的電子郵件格式")
      .required("* 此為必填欄位"),
    password: yup
      .string()
      .min(8, "* 密碼長度不能少於 8 個字元")
      .required("* 此為必填欄位"),
    ReCAPTCHA: yup.string().required("* 請勾選完成驗證"),
  })
  .required();

export const registerSchema = yup
  .object({
    username: yup
      .string()
      .min(3, "* 使用者名稱至少需要 3 個字元")
      .max(20, "* 使用者名稱不能超過 20 個字元")
      .required("* 此為必填欄位"),
    email: yup
      .string()
      .email("* 請輸入有效的電子郵件格式")
      .required("* 此為必填欄位"),
    password: yup
      .string()
      .matches(passwordRules, {
        message: "* 密碼須至少 8 碼，且包含大小寫英文及數字",
      })
      .max(20, "* 密碼不能超過 20 個字元")
      .required("* 此為必填欄位"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password"), null], "* 兩次輸入的密碼不一致")
      .required("* 此為必填欄位"),
    terms: yup
      .boolean()
      .oneOf([true], "* 請詳閱並同意服務條款")
      .required("* 請詳閱並同意服務條款"),
    ReCAPTCHA: yup.string().required("* 請勾選完成驗證"),
  })
  .required();
