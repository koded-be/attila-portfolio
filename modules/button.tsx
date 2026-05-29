type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
};

export const Button = ({ children, onClick }: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="uppercase cursor-pointer text-black py-2 px-6 rounded-full bg-[linear-gradient(90deg,var(--button-gradient-from),var(--button-gradient-to))] shadow-(--button-glow) hover:opacity-95 transition duration-200"
    >
      {children}
    </button>
  );
};
