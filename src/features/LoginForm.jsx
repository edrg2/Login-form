import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "../utils/validationSchema";
import ReCAPTCHA from "react-google-recaptcha";
import { loginApi } from "../api/loginApi";
import InputField from "../components/InputField";
import PwdInputField from "../components/PwdInputField";

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    formState: { isSubmitting, errors },
    reset,
  } = useForm({ resolver: yupResolver(loginSchema), mode: "onBlur" });
  const recaptchaRef = useRef(null);

  // 驗證系統放入表單
  const RECAPTCHA_NAME = "ReCAPTCHA";

  useEffect(() => {
    register(RECAPTCHA_NAME);
  }, [register]);

  const onRecaptchaChange = (token) => {
    setValue(RECAPTCHA_NAME, token);
    trigger(RECAPTCHA_NAME);
  };

  // 表單提交
  const onSubmit = async (data) => {
    try {
      console.log("表單提交中...");
      await loginApi(data);

      console.log("表單提交成功！");
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

      {/* 驗證欄 */}
      <div>
        <div className="flex justify-center">
          <ReCAPTCHA
            onChange={onRecaptchaChange}
            ref={recaptchaRef}
            sitekey="6LdcQoUrAAAAAE5xIrwWCxdIbqI9v1Y7c4CUtGIe"
            hl="zh-TW"
          />
        </div>
        {errors.ReCAPTCHA && (
          <p className="ml-12 mt-1 text-xs text-red-600">
            {errors.ReCAPTCHA.message}
          </p>
        )}
      </div>

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
