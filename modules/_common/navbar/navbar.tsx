"use client";

import { clsx } from "clsx";
import Image from "next/image";
import { useLenis } from "lenis/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MouseEvent, useEffect, useState } from "react";
import styles from "./navbar.module.css";
import { useActiveSection } from "./use-active-selection";

const navItems = [
  { name: "Home", id: "home" },
  { name: "About", id: "about" },
  { name: "Work", id: "work" },
  { name: "Contact", id: "contact" },
];

// On the home page, let Lenis smooth-scroll instead of Next's instant hash jump
const useScrollToSection = () => {
  const lenis = useLenis();
  const pathname = usePathname();

  return (id: string) => (e: MouseEvent) => {
    if (pathname !== "/" || !lenis) return;
    e.preventDefault();
    lenis.scrollTo(`#${id}`);
    window.history.pushState(null, "", `#${id}`);
  };
};

type NavLinkProps = {
  name: string;
  id: string;
  activeSection: string;
};

const NavLink = ({ name, id, activeSection }: NavLinkProps) => {
  const scrollToSection = useScrollToSection();

  return (
    <li>
      <Link
        href={`/#${id}`}
        onClick={scrollToSection(id)}
        className={clsx(
          "text-white transition duration-200",
          activeSection === id && styles.activeNavLink,
        )}
      >
        {name}
      </Link>
    </li>
  );
};

type NavbarProps = {
  defaultActiveSection?: string;
  defaultScrolled?: boolean;
};

export const Navbar = ({
  defaultActiveSection,
  defaultScrolled,
}: NavbarProps) => {
  const activeSection = useActiveSection();
  const scrollToSection = useScrollToSection();
  const [isScrolled, setIsScrolled] = useState(defaultScrolled ?? false);

  useEffect(() => {
    if (defaultScrolled) return;

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [defaultScrolled]);

  return (
    <nav
      className={clsx(
        "fixed flex w-full items-center justify-between px-20 z-50 transition-all duration-300",
        isScrolled
          ? "bg-[#0c1118]/80 backdrop-blur-md p-1"
          : "bg-transparent py-6",
      )}
    >
      <Link
        href="/#home"
        onClick={scrollToSection("home")}
        className="flex items-center gap-2"
      >
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
            id={item.id}
            activeSection={defaultActiveSection || activeSection}
          />
        ))}
      </ul>
    </nav>
  );
};
