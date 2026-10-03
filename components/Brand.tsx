type BrandProps = {
  compact?: boolean;
  showTagline?: boolean;
  variant?: "dark" | "light";
  transparent?: boolean;
};

export default function Brand({
  compact = false,
  showTagline = false,
  variant = "dark",
  transparent = false,
}: BrandProps) {
  return (
    <div
      className={`brand brand-${variant} ${compact ? "brand-compact" : ""} ${
        transparent ? "brand-transparent" : ""
      }`}
    >
      <img src="/logo.png" alt="BhuVedh logo" className="brand-mark" />
    </div>
  );
}
