import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function PwdInput({ register, errors }) {
  const [showPwd, setShowPwd] = useState(false);
  return (
    <div>
      <div className="flex items-center space-x-3">
        <span className="text-center">
          <FontAwesomeIcon
            icon="lock"
            className="text-gray-700 text-2xl"
            fixedWidth
          />
        </span>
        <div className="relative w-full">
          <input
            id="password"
            name="password"
            type={showPwd ? "text" : "password"}
            {...register("password")}
            placeholder="密碼"
            className="w-full py-2 pl-4 pr-11 text-gray-900 border rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={() => setShowPwd(!showPwd)}
            className="absolute inset-y-0 right-0 flex items-center pr-3"
          >
            <FontAwesomeIcon
              icon={showPwd ? "eye-slash" : "eye"}
              className="text-lg text-gray-700 hover:text-gray-500 cursor-pointer"
              fixedWidth
            />
          </button>
        </div>
      </div>

      <div className="flex">
        {errors.password && (
          <p className="ml-12 mt-1 text-xs text-red-600">
            {errors.password.message}
          </p>
        )}
        <div className="ml-auto mt-2 text-sm">
          <a href="#" className="font-medium text-blue-700 hover:text-blue-500">
            忘記密碼?
          </a>
        </div>
      </div>
    </div>
  );
}
