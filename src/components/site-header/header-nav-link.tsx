import Link from "next/link";

import type { HeaderNavItem } from "@/components/site-header/types";

type HeaderNavLinkProps = {
  item: HeaderNavItem;
  className: string;
};

export function HeaderNavLink({ item, className }: HeaderNavLinkProps) {
  if (item.external) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noreferrer"
        aria-label={item.ariaLabel}
        className={className}
      >
        {item.label}
      </a>
    );
  }

  return (
    <Link
      href={item.href}
      prefetch={false}
      aria-label={item.ariaLabel}
      className={className}
    >
      {item.label}
    </Link>
  );
}
