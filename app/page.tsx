import { BrandLogo } from "@/components/brand/BrandLogo";

export default function Home() {
  return (
    <main
      className="flex min-h-screen items-center justify-center bg-background px-6 py-12"
      style={{
        backgroundImage: "url('/gradient-tall-1.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <BrandLogo className="w-[clamp(200px,40vw,480px)]" />
    </main>
  );
}
