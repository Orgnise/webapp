import { Logo } from "@/components/atom/logo";
import { constructMetadata } from "@/lib/utility/construct-metadata";
import { LoginForm } from "./form";

export const metadata = constructMetadata({
  title: `Sign in to ${process.env.NEXT_PUBLIC_APP_NAME}`,
});

export default function LoginPage() {
  return (
    <div className="prose-md h-screen w-full max-w-screen-xl">
      <div className="relative z-10 mx-auto mt-[calc(20vh)] h-fit w-full max-w-md overflow-hidden border-y border-border sm:rounded-2xl sm:border sm:shadow-xl">
        <div className="flex w-full flex-col items-center gap-4 rounded-t-2xl border-b  border-border bg-card py-6 font-normal">
          <Logo className="mb-4 h-12 w-12" />
          <h1 className="m-0 p-0 font-bold">Sign in in to Orgnise</h1>
          <p className="p-0 text-sm text-muted-foreground/90">
            We are <strong className="theme-text-primary">happy</strong> to see
            you back
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
