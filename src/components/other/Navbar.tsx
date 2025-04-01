"use client";

import { cn } from "@/lib/cn";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import Link from "next/link";

export const ActiveLink = (props: { href: string; children: ReactNode }) => {
  const pathname = usePathname();
  return (
    <Link
      href={props.href}
      className={cn(
        "flex items-center gap-2 whitespace-nowrap rounded-[18px] border px-4 py-2 text-sm shadow-lg shadow-blue-400 transition-all hover:border-black",
        pathname === props.href && "bg-primary text-primary-foreground",
        // pathname === props.href && "bg-primary text-primary-foreground",
      )}
    >
      {props.children}
    </Link>
  );
};
