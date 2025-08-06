/* 密碼input */

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import toast from "react-hot-toast";

export default function PwdInputField({
  icon = "lock",
  label = "密碼",
  name,
  autoComplete,
  register,
  errors,
  showPwdBtn = true,
  showForgotPwdLink = false,
  ...rest // 蒐集原生屬性，含className
}) {
  const [showPwd, setShowPwd] = useState(false);

  const handleForgetPwdClick = (e) => {
    e.preventDefault();
    toast.error("此連結僅限展示，並無實際用途", {
      duration: 2000,
      icon: "👾",
      style: {
        fontWeight: "bold",
        color: "white",
        backgroundColor: "#E8AB61",
      },
    });
  };

  return (
    <div>
      <div className="flex items-center space-x-3">
        <label htmlFor={name} className="text-center">
          <span className="sr-only">{label}</span>
          <FontAwesomeIcon
            icon={icon}
            data-testid={`icon-label`}
            className="text-gray-700 text-2xl"
            fixedWidth
          />
        </label>
        <div className="relative w-full">
          <input
            id={name}
            name={name}
            type={showPwdBtn ? (showPwd ? "text" : "password") : "text"}
            {...register(name)}
            placeholder={label}
            autoComplete={autoComplete}
            className="w-full py-2 pl-4 pr-11 text-gray-900 border rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            {...rest}
          />
          {showPwdBtn && (
            <button
              type="button"
              onClick={() => setShowPwd(!showPwd)}
              className="absolute inset-y-0 right-0 flex items-center pr-3"
              aria-label={showPwd ? "隱藏密碼" : "顯示密碼"}
            >
              <FontAwesomeIcon
                icon={showPwd ? "eye-slash" : "eye"}
                data-testid={`icon-button`}
                className="text-lg text-gray-700 hover:text-gray-500 cursor-pointer"
                fixedWidth
              />
            </button>
          )}
        </div>
      </div>

      <div className="flex">
        {errors[name] && (
          <p className="ml-12 mt-1 text-xs text-red-600">
            {errors[name].message}
          </p>
        )}
        {showForgotPwdLink && (
          <div className="ml-auto mt-1 text-sm">
            <a
              href="#"
              onClick={handleForgetPwdClick}
              className="font-medium text-blue-700 hover:text-blue-500"
            >
              忘記密碼?
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
