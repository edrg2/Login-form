import { useRef } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";
import { loginSchema } from "../utils/validationSchema";
import { loginApiCall } from "../api/authApiCall";
import InputField from "../components/InputField";
import PwdInputField from "../components/PwdInputField";
import RecaptchaField from "../components/RecaptchaField";

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    control,
    formState: { isSubmitting, errors },
    reset,
  } = useForm({ resolver: yupResolver(loginSchema), mode: "onBlur" });

  const recaptchaRef = useRef(null);

  // 表單提交
  const onSubmit = async (data) => {
    const promise = loginApiCall(data);

    toast.promise(
      promise,
      {
        loading: "正在登入中，請稍後...",
        success: "登入成功！歡迎回來",
        error: (err) => `登入失敗: ${err.toString()}`,
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
    } catch (err) {
      console.error("表單提交失敗:", err);
    } finally {
      reset();
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-4">
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
        autoComplete="current-password"
        register={register}
        errors={errors}
        showForgotPwdLink={true}
      />

      {/* ReCAPTCHA驗證 */}
      <RecaptchaField
        name="ReCAPTCHA"
        control={control}
        errors={errors}
        ref={recaptchaRef}
      />

      <div className="flex justify-center">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-3xs px-4 py-3 font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300 cursor-pointer disabled:bg-blue-200 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "登入中..." : "登入"}
        </button>
      </div>
    </form>
  );
}
