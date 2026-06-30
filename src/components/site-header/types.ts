export type SiteHeaderProps = {
  hideSubmitCta?: boolean;
};

export type HeaderNavItem = {
  href: string;
  label: string;
  external?: boolean;
  ariaLabel?: string;
};
