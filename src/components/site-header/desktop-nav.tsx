import { ChevronDownIcon } from "@/components/site-header/chevron-down-icon";
import { HeaderNavLink } from "@/components/site-header/header-nav-link";
import type { HeaderNavItem } from "@/components/site-header/types";

const primaryLinkClassName =
  "inline-flex h-9 items-center rounded-full px-2.5 text-sm font-medium text-muted-2 transition hover:bg-surface-muted hover:text-foreground";

const dropdownLinkClassName =
  "flex rounded-xl px-3 py-2.5 text-sm font-medium text-foreground transition hover:bg-surface-muted";

type DesktopNavProps = {
  primary: HeaderNavItem[];
  secondary: HeaderNavItem[];
  moreLabel: string;
};

export function DesktopNav({ primary, secondary, moreLabel }: DesktopNavProps) {
  return (
    <div className="hidden items-center gap-0.5 xl:flex">
      {primary.map((item) => (
        <HeaderNavLink
          key={item.href}
          item={item}
          className={primaryLinkClassName}
        />
      ))}
      {secondary.length > 0 ? (
        <details className="group relative">
          <summary className="inline-flex h-9 cursor-pointer list-none items-center gap-1 rounded-full px-2.5 text-sm font-medium text-muted-2 transition hover:bg-surface-muted hover:text-foreground [&::-webkit-details-marker]:hidden">
            {moreLabel}
            <ChevronDownIcon />
          </summary>
          <div className="absolute top-11 left-0 z-50 w-56 rounded-2xl border border-border-base bg-surface p-2 shadow-xl shadow-blue-950/15">
            {secondary.map((item) => (
              <HeaderNavLink
                key={item.href}
                item={item}
                className={dropdownLinkClassName}
              />
            ))}
          </div>
        </details>
      ) : null}
    </div>
  );
}
