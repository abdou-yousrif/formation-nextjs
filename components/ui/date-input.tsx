// components/ui/date-input.tsx
import * as React from "react"
import { cn } from "@/lib/utils"

function DateInput({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type="date"
      data-slot="date-input"
      className={cn(
        "border-input h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs outline-none",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        className
      )}
      {...props}
    />
  )
}

export { DateInput }