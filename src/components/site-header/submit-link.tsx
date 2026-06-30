import Link from "next/link";

type SubmitLinkProps = {
  href: string;
  label: string;
  variant: "desktop" | "mobile";
};

const variantClassName = {
  desktop:
    "hidden h-10 items-center justify-center rounded-full bg-inverse px-4 text-sm font-medium text-on-inverse transition hover:bg-inverse-hover md:inline-flex",
  mobile:
    "mt-1 flex rounded-xl bg-inverse px-3 py-2.5 text-sm font-medium text-on-inverse transition hover:bg-inverse-hover",
} as const;

export function SubmitLink({ href, label, variant }: SubmitLinkProps) {
  return (
    <Link href={href} prefetch={false} className={variantClassName[variant]}>
      {label}
    </Link>
  );
}
