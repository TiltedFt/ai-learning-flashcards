"use client";
import Link from "next/link";

export function Breadcrumbs({
  items,
}: {
  items: { href?: string; label: string }[];
}) {
  return (
    <nav className="text-sm text-muted-foreground mb-3">
      {items.map((x, i) => (
        <span key={i}>
          {x.href ? (
            <Link href={x.href} className="hover:underline">
              {x.label}
            </Link>
          ) : (
            <span>{x.label}</span>
          )}
          {i < items.length - 1 ? " > " : null}
        </span>
      ))}
    </nav>
  );
}
