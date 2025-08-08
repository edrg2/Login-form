import toast from "react-hot-toast";

export default function CheckboxField({ name, label, register, errors }) {
  const handleLinkClick = (e) => {
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
          <a
            href="#"
            onClick={handleLinkClick}
            className="font-medium text-blue-600 hover:underline"
          >
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
