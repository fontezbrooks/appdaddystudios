"use client";

import Image from "next/image";
import { useState } from "react";
import { AppShowcase } from "@/components/showcase/AppShowcase";
import { royalShadow } from "@/lib/tokens";

type FormState = "idle" | "sending" | "success" | "error";

export default function Home() {
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormState("sending");
    setErrorMessage("");

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      businessName: (form.elements.namedItem("businessName") as HTMLInputElement).value,
      phone: (form.elements.namedItem("phone") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Something went wrong.");
      setFormState("success");
    } catch {
      setFormState("error");
      setErrorMessage("Something went wrong. Try emailing us directly at hi@appdaddystudios.com");
    }
  }

  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center bg-background text-center"
      style={{
        backgroundImage: "url('/website-bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="flex flex-col items-center gap-10 w-full max-w-3xl px-8 py-24 sm:px-16">
        {/* Logo */}
        <Image
          src="/logo-ads-fancywhite.png"
          alt="App Daddy Studios"
          width={480}
          height={480}
          className="w-[clamp(80px,13vw,180px)] h-auto"
          priority
        />

        {/* Headline */}
        <h1
          className="font-heading text-8xl text-peach leading-none"
          style={{ textShadow: royalShadow }}
        >
          Your business finally gets an app.
        </h1>

        {/* Supporting text */}
        <p
          className="font-sans font-normal text-3xl text-white leading-tight"
          style={{ textShadow: royalShadow }}
        >
          We build powerful custom tools for small businesses in days, not months.
          All at an affordable price.
        </p>

        {/* App showcase */}
        <AppShowcase />

        {/* Contact Form */}
        {formState === "success" ? (
          <div className="w-full rounded-xl bg-brown-400/80 backdrop-blur-sm border border-brown-300/30 px-8 py-10 flex flex-col items-center gap-4">
            <p
              className="font-heading text-5xl text-peach"
              style={{ textShadow: royalShadow }}
            >
              We&apos;ll be in touch.
            </p>
            <p className="font-sans text-xl text-white/80">
              Thanks for reaching out — expect to hear from us soon.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="w-full flex flex-col gap-4 rounded-xl bg-brown-400/80 backdrop-blur-sm border border-brown-300/30 px-8 py-10"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5 text-left">
                <label htmlFor="name" className="font-sans text-sm text-peach/80 uppercase tracking-wider">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="Jane Smith"
                  className="rounded-lg bg-brown-500 border border-brown-300/20 px-4 py-3 font-sans text-base text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-pumpkin transition"
                />
              </div>

              <div className="flex flex-col gap-1.5 text-left">
                <label htmlFor="businessName" className="font-sans text-sm text-peach/80 uppercase tracking-wider">
                  Business Name
                </label>
                <input
                  id="businessName"
                  name="businessName"
                  type="text"
                  required
                  placeholder="Smith Roofing Co."
                  className="rounded-lg bg-brown-500 border border-brown-300/20 px-4 py-3 font-sans text-base text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-pumpkin transition"
                />
              </div>

              <div className="flex flex-col gap-1.5 text-left">
                <label htmlFor="email" className="font-sans text-sm text-peach/80 uppercase tracking-wider">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="jane@smithroofing.com"
                  className="rounded-lg bg-brown-500 border border-brown-300/20 px-4 py-3 font-sans text-base text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-pumpkin transition"
                />
              </div>

              <div className="flex flex-col gap-1.5 text-left">
                <label htmlFor="phone" className="font-sans text-sm text-peach/80 uppercase tracking-wider">
                  Phone
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="(404) 555-0100"
                  className="rounded-lg bg-brown-500 border border-brown-300/20 px-4 py-3 font-sans text-base text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-pumpkin transition"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5 text-left">
              <label htmlFor="message" className="font-sans text-sm text-peach/80 uppercase tracking-wider">
                What do you need? <span className="normal-case text-neutral-500">(optional)</span>
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                placeholder="Tell us a little about your business and what you're looking to build."
                className="rounded-lg bg-brown-500 border border-brown-300/20 px-4 py-3 font-sans text-base text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-pumpkin transition resize-none"
              />
            </div>

            {formState === "error" && (
              <p className="font-sans text-sm text-red-300 text-left">{errorMessage}</p>
            )}

            <button
              type="submit"
              disabled={formState === "sending"}
              className="mt-2 w-full rounded-lg bg-pumpkin hover:bg-orange-300 disabled:opacity-60 px-6 py-4 font-heading text-2xl text-white transition-colors cursor-pointer"
              style={{ textShadow: royalShadow }}
            >
              {formState === "sending" ? "Sending…" : "Let's talk →"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
