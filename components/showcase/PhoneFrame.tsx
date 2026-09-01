import Image from "next/image";
import { SCREENSHOT_HEIGHT, SCREENSHOT_WIDTH } from "@/lib/apps";
import { cn } from "@/lib/utils";

type PhoneFrameProps = {
  src: string;
  alt: string;
  className?: string;
  /** Eager-load the image (use for the initially visible slide). */
  preload?: boolean;
};

/**
 * Minimal iPhone-style frame: dark bezel, rounded corners, notch. The
 * screenshot fills the screen area. Aspect ratio is locked to the
 * screenshot dimensions so layout never shifts while images load.
 */
export function PhoneFrame({ src, alt, className, preload = false }: PhoneFrameProps) {
  return (
    <div
      className={cn(
        "relative rounded-[2.5rem] bg-neutral-900 p-2.5 shadow-2xl ring-1 ring-white/10",
        className,
      )}
      style={{ aspectRatio: `${SCREENSHOT_WIDTH} / ${SCREENSHOT_HEIGHT}` }}
    >
      {/* Notch */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-2.5 z-10 h-6 w-1/3 -translate-x-1/2 rounded-b-2xl bg-neutral-900"
      />
      <div className="relative h-full w-full overflow-hidden rounded-[2rem] bg-royal">
        <Image
          src={src}
          alt={alt}
          width={SCREENSHOT_WIDTH}
          height={SCREENSHOT_HEIGHT}
          sizes="240px"
          preload={preload}
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
}
