import { LoadingSpinner } from "@/components/Loading";
import React, { Suspense } from "react";

function SuccessLayout({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>;
}

export default SuccessLayout;
