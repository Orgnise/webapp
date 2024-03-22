import { Background } from "@/components/ui/background";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function Loading() {
  return (
    <main className="flex h-screen w-screen items-center justify-center">
      <LoadingSpinner />
      <Background />
    </main>
  );
}
