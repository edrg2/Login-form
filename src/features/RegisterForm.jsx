import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";
import { registerSchema } from "../utils/validationSchema";
import { registerApiCall } from "../api/authApiCall";
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
  } = useForm({ resolver: yupResolver(registerSchema), mode: "onBlur" });

  const recaptchaRef = useRef(null);
  const navigate = useNavigate();

  // 表單提交
  const onSubmit = async (data) => {
    const {
      confirmPassword: _confirmPassword,
      terms: _terms,
      ...apiData
    } = data;

    const promise = registerApiCall(apiData);

    toast.promise(
      promise,
      {
        loading: "正在註冊中，請稍後...",
        success: "註冊成功！請登入",
        error: (err) => `註冊失敗：${err.toString()}`,
      },
      {
        style: {
          fontWeight: "bold",
        },
        success: {
          style: {
            color: "white",
            backgroundColor: "#88EF98",
          },
          duration: 3000,
        },
        error: {
          style: {
            color: "white",
            backgroundColor: "#F07C7C",
          },
          duration: 3000,
        },
      }
    );

    try {
      await promise;
      navigate("/login");
    } catch (err) {
      console.error("表單提交失敗:", err);
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
      }
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
        showPwdBtn={false}
      />

      {/* 確認密碼 Input */}
      <PwdInputField
        icon="check"
        label="確認密碼"
        name="confirmPassword"
        autoComplete="new-password"
        register={register}
        errors={errors}
        showPwdBtn={true}
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
