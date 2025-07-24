import RegisterForm from "../features/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center text-gray-800">註冊</h1>
        {/* 表單 */}
        <RegisterForm />
      </div>
    </div>
  );
}
