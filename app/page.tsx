import Image from "next/image";

const royalShadow = "2px 2px 0px #491e3d";

export default function Home() {
  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center gap-8 bg-background px-6 py-12 text-center"
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
        className="w-[clamp(80px,13vw,180px)] h-auto"
        priority
      />

      <h1
        className="font-heading text-9xl text-peach leading-none"
        style={{ textShadow: royalShadow }}
      >
        Your business finally gets an app.
      </h1>

      <p
        className="font-sans font-normal text-6xl text-foreground leading-tight max-w-5xl"
        style={{ textShadow: royalShadow }}
      >
        We build powerful custom tools for small businesses in days, not months.
        All at an affordable price.
      </p>
    </main>
  );
}
