import { SignupForm } from "./form";

export default function SignupPage() {
  return (
    <div className="max-w-screen-xl m-auto h-screen">
      <div className="max-w-xl mx-auto grid md:grid-cols-1 grid-cols-1 gap-2 h-full  items-center place-content-center">
        <SignupForm />
      </div>
    </div>
  );
}
