import Image from "next/image";

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
      <Image
        src="/logo-ads-fancywhite.png"
        alt="App Daddy Studios"
        width={480}
        height={480}
        className="w-[clamp(200px,40vw,480px)] h-auto"
        priority
      />
    </main>
  );
}
