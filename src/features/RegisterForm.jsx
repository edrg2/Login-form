import { useRef } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerSchema } from "../utils/validationSchema";
import { registerApi } from "../api/authApi";
import InputField from "../components/InputField";
import PwdInputField from "../components/PwdInputField";
import CheckboxField from "../components/CheckboxField";
import RecaptchaField from "../components/RecaptchaField";

export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    control,
    formState: { isSubmitting, errors },
    reset,
  } = useForm({ resolver: yupResolver(registerSchema), mode: "onBlur" });

  const recaptchaRef = useRef(null);

  // 表單提交
  const onSubmit = async (data) => {
    const {
      confirmPassword: _confirmPassword,
      terms: _terms,
      ...apiData
    } = data;
    try {
      console.log("表單提交中...");
      await registerApi(apiData);

      console.log("表單提交成功！");
      reset();
    } catch (err) {
      console.error("表單提交失敗:", err);
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-4">
      {/* 使用者名稱 Input */}
      <InputField
        icon="user"
        label="使用者名稱"
        name="username"
        type="text"
        autoComplete="username"
        register={register}
        errors={errors}
      />

      {/* 電子郵件 Input */}
      <InputField
        icon="envelope"
        label="電子郵件"
        name="email"
        type="email"
        autoComplete="email"
        register={register}
        errors={errors}
      />

      {/* 密碼 Input */}
      <PwdInputField
        icon="lock"
        label="密碼"
        name="password"
        autoComplete="new-password"
        register={register}
        errors={errors}
        showPwdBtn={true}
        showForgotPwdLink={false}
      />

      {/* 確認密碼 Input */}
      <PwdInputField
        icon="check"
        label="確認密碼"
        name="confirmPassword"
        autoComplete="new-password"
        register={register}
        errors={errors}
        showPwdBtn={false}
        showForgotPwdLink={false}
      />

      {/* ReCAPTCHA驗證 */}
      <RecaptchaField
        name="ReCAPTCHA"
        control={control}
        errors={errors}
        ref={recaptchaRef}
      />

      {/* 服務條款 Checkbox */}
      <CheckboxField
        name="terms"
        label="請同意並勾選"
        register={register}
        errors={errors}
      />

      <div className="flex justify-center">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-3xs px-4 py-3 font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300 cursor-pointer disabled:bg-blue-200 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "註冊中..." : "註冊"}
        </button>
      </div>
    </form>
  );
}
