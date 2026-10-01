import type { ReactNode } from "react";

export type LegalConditionsLayoutProps = {
  title: string;
  children: ReactNode;
  showBreadcrumb?: boolean;
  containerClassName?: string;
};
