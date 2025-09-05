import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const timerButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95 relative overflow-hidden group",
  {
    variants: {
      variant: {
        primary: "bg-gradient-focus text-white shadow-pomodoro-md hover:shadow-focus-glow hover:scale-105 hover:-translate-y-1 before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700",
        secondary: "bg-gradient-short-break text-white shadow-pomodoro-md hover:shadow-short-break-glow hover:scale-105 hover:-translate-y-1 before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700",
        tertiary: "bg-gradient-long-break text-white shadow-pomodoro-md hover:shadow-long-break-glow hover:scale-105 hover:-translate-y-1 before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700",
        outline: "border-2 border-border bg-card text-card-foreground shadow-pomodoro-sm hover:bg-accent hover:shadow-pomodoro-md hover:scale-105 hover:-translate-y-0.5 hover:border-primary/50",
        ghost: "text-foreground hover:bg-accent hover:text-accent-foreground hover:scale-105 hover:-translate-y-0.5",
        destructive: "bg-destructive text-destructive-foreground shadow-pomodoro-sm hover:bg-destructive/90 hover:shadow-pomodoro-md hover:scale-105 hover:-translate-y-0.5",
      },
      size: {
        default: "h-12 px-6 py-3",
        sm: "h-9 px-4 py-2 text-xs",
        lg: "h-14 px-8 py-4 text-base",
        xl: "h-16 px-10 py-5 text-lg",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
)

export interface TimerButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof timerButtonVariants> {
  asChild?: boolean
}

const TimerButton = React.forwardRef<HTMLButtonElement, TimerButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(timerButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
TimerButton.displayName = "TimerButton"

export { TimerButton, timerButtonVariants }