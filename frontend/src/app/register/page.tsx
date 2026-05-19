import RegisterForm from "../components/RegisterForm";

export default function LoginPage() {
  return (
    <main className="min-h-screen p-8 bg-gray-50 flex items-center justify-center">
      <div className="w-full">
        <RegisterForm />
      </div>
    </main>
  );
}