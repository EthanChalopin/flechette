"use client";

export type HitSplashAnimation = "triple" | "bull" | "double-bull" | "blank-turn";

export type HitSplashConfig = {
  src: string;
  alt: string;
  animation: HitSplashAnimation;
};

type Props = {
  splash: HitSplashConfig | null;
  onDismiss: () => void;
};

export function HitSplash({ splash, onDismiss }: Props) {
  if (!splash) {
    return null;
  }

  return (
    <button
      aria-label="Masquer l'animation"
      className={`hit-splash-overlay hit-splash-overlay-${splash.animation}`}
      type="button"
      onClick={onDismiss}
    >
      <img alt={splash.alt} className={`hit-splash-image hit-splash-${splash.animation}`} src={splash.src} />
    </button>
  );
}
