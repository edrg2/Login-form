import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function EmailInput() {
  return (
    <div className="flex items-center space-x-3">
      <span className="text-center">
        <FontAwesomeIcon
          icon="envelope"
          className="text-gray-700 text-2xl"
          fixedWidth
        />
      </span>
      <input
        id="email"
        name="email"
        type="email"
        placeholder="電子郵件"
        className="w-full py-2 px-4 text-gray-900 border rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      />
    </div>
  );
}
