/* 一般input */

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function InputField({
  icon,
  label,
  name,
  placeholder,
  type = "text",
  autoComplete,
  register,
  errors,
  ...rest // 蒐集原生屬性，含className
}) {
  return (
    <div>
      <div className="flex items-center space-x-3">
        <label htmlFor={name} className="text-center">
          <span className="sr-only">{label}</span>
          <FontAwesomeIcon
            icon={icon}
            data-testid={`icon-${name}`}
            className="text-gray-700 text-2xl"
            fixedWidth
          />
        </label>
        <input
          id={name}
          name={name}
          type={type}
          autoComplete={autoComplete}
          {...register(name)}
          placeholder={placeholder ? placeholder : label}
          className="w-full py-2 px-4 text-gray-900 border rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          {...rest}
        />
      </div>
      {errors[name] && (
        <p className="ml-12 mt-1 text-xs text-red-600">
          {errors[name].message}
        </p>
      )}
    </div>
  );
}
