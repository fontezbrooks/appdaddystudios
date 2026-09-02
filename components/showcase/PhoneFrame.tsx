import Image from "next/image";
import { SCREENSHOT_HEIGHT, SCREENSHOT_WIDTH } from "@/lib/apps";
import { cn } from "@/lib/utils";

type PhoneFrameProps = {
  src: string;
  alt: string;
  className?: string;
};

/**
 * Minimal iPhone-style frame: dark bezel, rounded corners, notch. The
 * aspect ratio is locked on the inner screen (not the padded bezel) so the
 * screenshot is never cropped, and layout never shifts while images load.
 * Images are below the fold, so they keep next/image's default lazy loading.
 */
export function PhoneFrame({ src, alt, className }: PhoneFrameProps) {
  return (
    <div
      className={cn(
        "relative rounded-[2.5rem] bg-neutral-900 p-2.5 shadow-2xl ring-1 ring-white/10",
        className,
      )}
    >
      {/* Notch */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-2.5 z-10 h-6 w-1/3 -translate-x-1/2 rounded-b-2xl bg-neutral-900"
      />
      <div
        className="relative w-full overflow-hidden rounded-[2rem] bg-royal"
        style={{ aspectRatio: `${SCREENSHOT_WIDTH} / ${SCREENSHOT_HEIGHT}` }}
      >
        <Image
          src={src}
          alt={alt}
          width={SCREENSHOT_WIDTH}
          height={SCREENSHOT_HEIGHT}
          sizes="240px"
          // Eager (not lazy): a slide is mounted offscreen at ±2 and clipped
          // by overflow-hidden, so lazy loading would defer its fetch until
          // it is already sliding into view. No preload/priority hint, so it
          // still queues behind above-the-fold resources.
          loading="eager"
          // Native image drag-and-drop would hijack the carousel's pointer
          // drag on desktop (dragstart fires, pointer events stop).
          draggable={false}
          onDragStart={(e) => e.preventDefault()}
          className="h-full w-full select-none object-cover"
        />
      </div>
    </div>
  );
}
