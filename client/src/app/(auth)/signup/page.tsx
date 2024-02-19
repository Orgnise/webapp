import { SignupForm } from "./form";

export default function SignupPage() {
  return (
    <div className="m-auto h-screen max-w-screen-xl">
      <div className="mx-auto grid h-full max-w-xl grid-cols-1 place-content-center items-center  gap-2 md:grid-cols-1">
        <SignupForm />
      </div>
    </div>
  );
}
