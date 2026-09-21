import Link from "next/link";

const links = [
  { label: "Menu", href: "/menu" },
  { label: "Process", href: "/process" },
  { label: "House", href: "/house" },
  { label: "Journal", href: "/journal" },
  { label: "Visit", href: "/visit" },
];

type SiteNavProps = {
  mobile?: boolean;
  onNavigate?: () => void;
};

export default function SiteNav({
  mobile = false,
  onNavigate,
}: SiteNavProps) {
  if (mobile) {
    return (
      <nav
        aria-label="Mobile navigation"
        className="flex flex-col"
      >
        {links.map((link, index) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            className="group flex items-center justify-between border-b border-black/10 py-5"
          >
            <span className="rr-editorial text-4xl font-medium tracking-tight">
              {link.label}
            </span>

            <span
              className="text-xs font-bold tracking-[0.15em] text-black/40 transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden="true"
            >
              0{index + 1}
            </span>
          </Link>
        ))}
      </nav>
    );
  }

  return (
    <nav
      aria-label="Main navigation"
      className="hidden items-center gap-8 lg:flex"
    >
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="rr-header-link"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}