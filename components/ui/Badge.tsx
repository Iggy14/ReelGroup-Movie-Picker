interface BadgeProps {
  children: React.ReactNode;
  variant?: "gold" | "neutral";
}

export default function Badge({ children, variant = "gold" }: BadgeProps) {
  const variantClasses =
    variant === "gold"
      ? "border-gold text-gold"
      : "border-surface-border text-foreground/80";

  return (
    <span
      className={`inline-block px-2 py-1 rounded text-xs font-medium border bg-background/80 backdrop-blur-sm ${variantClasses}`}
    >
      {children}
    </span>
  );
}