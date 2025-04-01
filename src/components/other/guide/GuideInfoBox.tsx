import { Separator } from "@radix-ui/react-separator";
import { ReactNode } from "react";
import { SiLangchain, SiOpenai } from "react-icons/si";

export function GuideInfoBox(props: { children: ReactNode }) {
  return (
    <div className="text-md mx-auto my-16 flex w-full max-w-[768px] flex-col gap-5 overflow-hidden text-white">
      {/* TODO */}
      <p className="text-center">
        AI Assistant powered by Senior Web developer Hamza
      </p>
      <div className="flex w-full items-center justify-center gap-3 text-4xl">
        {/* ▲ <span className="font-semibold">+</span>🔥🦜🔗▲ */}
        <SiOpenai />
        <span className="font-semibold">+</span>
        <SiLangchain />
      </div>

      <Separator className="my-5 h-[1px] w-full bg-white" />

      <div className="mx-auto max-w-[600px] text-center text-sm">
        {props.children}
      </div>
    </div>
  );
}
