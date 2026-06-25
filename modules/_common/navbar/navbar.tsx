"use client";

import { clsx } from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
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
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={clsx(
        "fixed flex w-full items-center justify-between px-20 z-50 transition-all duration-300",
        isScrolled
          ? "bg-[#0c1118]/80 backdrop-blur-md p-1"
          : "bg-transparent py-6",
      )}
    >
      <Link href="#home" className="flex items-center gap-2">
        <div className="relative h-12 w-12">
          <Image src="/logo.svg" alt="Logo" fill />
        </div>
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
