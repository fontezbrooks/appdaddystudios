import { BrandLogo } from "@/components/brand/BrandLogo";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-12">
      <BrandLogo className="w-[clamp(200px,40vw,480px)]" />
    </main>
  );
}
