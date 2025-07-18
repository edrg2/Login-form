import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "../../utils/validationSchema";
import ReCAPTCHA from "react-google-recaptcha";
import EmailInput from "./EmailInput";
import PwdInput from "./PwdInput";

export default function Form() {
  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors },
  } = useForm({ resolver: yupResolver(loginSchema) });

  useEffect(() => {
    register("ReCAPTCHA");
  }, [register]);

  const onRecaptchaChange = (token) => {
    setValue("ReCAPTCHA", token);
    trigger("ReCAPTCHA");
  };

  const onSubmit = (data) => {
    console.log("表單資料", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-4">
      {/* 電子郵件 Input */}
      <EmailInput register={register} errors={errors} />

      {/* 密碼 Input */}
      <PwdInput register={register} errors={errors} />

      {/* 驗證欄 */}
      <div>
        <div className="flex justify-center">
          <ReCAPTCHA
            onChange={onRecaptchaChange}
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
          className="w-xs px-4 py-3 font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300 cursor-pointer"
        >
          登入
        </button>
      </div>
    </form>
  );
}
