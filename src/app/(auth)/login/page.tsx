import { LoginForm } from "./form";

export default function LoginPage() {
  return (
    <div className="bg- m-auto h-screen max-w-screen-xl">
      <div className="mx-auto grid h-full max-w-xl grid-cols-1 place-content-center items-center  gap-2 md:grid-cols-1">
        <LoginForm />
      </div>
    </div>
  );
}
