import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide",
  {
    variants: {
      variant: {
        default: "border-brand-champagne/50 bg-brand-charcoal text-white",
        outline: "border-brand-charcoal/20 bg-white text-brand-charcoal",
        glow: "border-transparent bg-brand-champagne/20 text-brand-charcoal"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

interface BadgeProps extends VariantProps<typeof badgeVariants> {
  className?: string;
  children: React.ReactNode;
}

export function Badge({ className, variant, children }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)}>{children}</span>;
}