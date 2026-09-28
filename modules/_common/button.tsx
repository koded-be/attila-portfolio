import Link from "next/link";
import type { MouseEvent } from "react";

type ButtonProps = {
  children: React.ReactNode;
  href?: string;
  onClick?: (e: MouseEvent) => void;
  type?: "button" | "submit";
  disabled?: boolean;
};

const className =
  "inline-flex items-center justify-center uppercase cursor-pointer text-black py-2 px-6 rounded-full bg-[linear-gradient(90deg,var(--button-gradient-from),var(--button-gradient-to))] shadow-(--button-glow) hover:opacity-95 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

export const Button = ({
  children,
  href,
  onClick,
  type = "button",
  disabled,
}: ButtonProps) => {
  if (href) {
    return (
      <Link href={href} onClick={onClick} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={className}
    >
      {children}
    </button>
  );
};
