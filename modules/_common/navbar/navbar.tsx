"use client";

import { clsx } from "clsx";
import Image from "next/image";
import Link from "next/link";
import styles from "./navbar.module.css";
import { useActiveSection } from "./use-active-selection";

const navItems = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Work", href: "#work" },
  { name: "Contact", href: "#contact" },
];

type NavLinkProps = {
  name: string;
  href: string;
  activeSection: string;
};

const NavLink = ({ name, href, activeSection }: NavLinkProps) => {
  return (
    <li>
      <Link
        href={href}
        className={clsx(
          "text-white transition duration-200",
          activeSection === href.slice(1) && styles.activeNavLink,
        )}
      >
        {name}
      </Link>
    </li>
  );
};

export const Navbar = () => {
  const activeSection = useActiveSection();

  return (
    <nav className="fixed flex w-full items-center justify-between py-6 px-20">
      <Link href="/" className="flex items-center gap-2">
        <Image src="/logo.svg" alt="Logo" width={50} height={50} />
        <span className="text-2xl text-white">Attila Tolnai</span>
      </Link>

      <ul className="flex items-center gap-8">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            name={item.name}
            href={item.href}
            activeSection={activeSection}
          />
        ))}
      </ul>
    </nav>
  );
};
