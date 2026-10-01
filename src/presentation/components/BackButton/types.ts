import type { ReactNode } from "react";

export type BackButtonProps = {
  children?: ReactNode;
  className?: string;
  fallbackHref?: string;
  customGoBack?: () => void;
};
