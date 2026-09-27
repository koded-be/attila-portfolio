"use client";

export const DeleteButton = ({
  action,
  confirmText,
}: {
  action: () => Promise<void>;
  confirmText: string;
}) => (
  <form
    action={action}
    onSubmit={(e) => !confirm(confirmText) && e.preventDefault()}
  >
    <button className="text-sm text-red-400 underline">Delete</button>
  </form>
);
