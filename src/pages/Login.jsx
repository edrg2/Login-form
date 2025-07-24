import Form from "../features/LoginForm";

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center text-gray-800">登入</h1>
        {/* 表單 */}
        <Form />
        <p className="text-sm text-center text-gray-500">
          還沒有帳號?{" "}
          <a href="#" className="font-medium text-blue-700 hover:text-blue-500">
            立即註冊
          </a>
        </p>
      </div>
    </div>
  );
}
