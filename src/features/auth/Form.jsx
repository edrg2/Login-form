import EmailInput from "./EmailInput";
import PwdInput from "./PwdInput";

export default function Form() {
  return (
    <form className="flex flex-col space-y-4">
      {/* 電子郵件Input */}
      <EmailInput />
      {/* 密碼Input */}
      <PwdInput />
      <div className="flex justify-center">
        <button
          className="w-xs px-4 py-3 font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300 cursor-pointer"
          type="submit"
        >
          登入
        </button>
      </div>
    </form>
  );
}
