"use client";

import { clsx } from "clsx";
import Image from "next/image";
import Link from "next/link";
import styles from "./navbar.module.css";
import { useState } from "react";

const navItems = [
    { name: "Home", href: "/" },
    { name: "About", href: "#about" },
    { name: "Portfolio", href: "#portfolio" },
    { name: "Contact", href: "#contact" },
];

const NavLink = ({ name, href }: { name: string; href: string }) => {
    const [isHovered, setIsHovered] = useState(false);
    const isActive = typeof window !== "undefined" && window.location.pathname === href;

    return (
        <li>
            <Link href={href} 
                className={clsx("text-white transition duration-200", (isActive || isHovered) && styles.activeNavLink)} 
                onMouseEnter={() => setIsHovered(true)} 
                onMouseLeave={() => setIsHovered(false)}>
                {name}
            </Link>
        </li>
    );
}


export const Navbar = () => {

    return (
        <nav className="fixed flex w-full items-center justify-between py-6 px-20">
            <Link href="/" className="flex items-center gap-2">
                <Image src="/logo.svg" alt="Logo" width={50} height={50} />
                <span className="text-2xl text-white">Attila Tolnai</span>
            </Link>

            <ul className="flex items-center gap-8">
                {navItems.map((item) => (
                    <NavLink key={item.name} name={item.name} href={item.href} />
                ))}
            </ul>
        </nav>
    );
}
