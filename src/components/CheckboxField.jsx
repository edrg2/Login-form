export default function CheckboxField({ name, label, register, errors }) {
  return (
    <div>
      <div className="flex ml-10.5 items-center">
        <input
          id={name}
          name={name}
          type="checkbox"
          {...register(name)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
        />
        <label htmlFor={name} className="ml-2 block text-sm text-gray-900">
          {label}{" "}
          <a href="#" className="font-medium text-blue-600 hover:underline">
            服務條款
          </a>
        </label>
      </div>
      {errors[name] && (
        <p className="ml-12 mt-1 text-xs text-red-600">
          {errors[name].message}
        </p>
      )}
    </div>
  );
}
