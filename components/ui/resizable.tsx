"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type DivProps = React.HTMLAttributes<HTMLDivElement>;

export function ResizablePanelGroup({ className, ...props }: DivProps) {
  return <div className={cn("flex w-full", className)} {...props} />;
}

export function ResizablePanel({ className, ...props }: DivProps) {
  return <div className={cn("flex-1 min-w-0", className)} {...props} />;
}

export function ResizableHandle({ className, ...props }: DivProps) {
  return <div className={cn("w-1 bg-border/50", className)} {...props} />;
}
