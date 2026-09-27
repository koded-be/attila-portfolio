"use client";

import { usePathname, useRouter } from "next/navigation";
import { clsx } from "clsx";
import { useSelect } from "downshift";
import { useEffect, useRef } from "react";

type ProjectsFiltersProps = {
  q: string;
  sort: "newest" | "oldest";
};

const inputClassName =
  "rounded-lg border border-white/15 bg-[#0c1118] px-4 py-3 text-sm text-white/90 placeholder:text-white/40 outline-none transition-colors focus:border-primary";

const sortOptions = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
] as const;

type SortSelectProps = {
  sort: ProjectsFiltersProps["sort"];
  onChange: (sort: ProjectsFiltersProps["sort"]) => void;
};

const SortSelect = ({ sort, onChange }: SortSelectProps) => {
  const {
    isOpen,
    selectedItem,
    highlightedIndex,
    getLabelProps,
    getToggleButtonProps,
    getMenuProps,
    getItemProps,
  } = useSelect({
    items: [...sortOptions],
    itemToString: (item) => item?.label ?? "",
    initialSelectedItem: sortOptions.find((option) => option.value === sort),
    onSelectedItemChange: ({ selectedItem }) =>
      selectedItem && onChange(selectedItem.value),
  });

  return (
    <div className="relative w-44">
      <label {...getLabelProps()} className="sr-only">
        Sort projects
      </label>
      <button
        type="button"
        {...getToggleButtonProps()}
        className={clsx(
          inputClassName,
          "flex w-full cursor-pointer items-center justify-between gap-3 text-left",
          isOpen && "border-primary",
        )}
      >
        {selectedItem?.label}
        <svg
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden
          className={clsx(
            "h-4 w-4 text-white/60 transition-transform duration-200",
            isOpen && "rotate-180 text-primary",
          )}
        >
          <path d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.17l3.71-3.94a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z" />
        </svg>
      </button>
      <ul
        {...getMenuProps()}
        className={clsx(
          "absolute z-10 mt-2 w-full overflow-hidden rounded-lg border border-white/15 bg-[#0c1118] p-1 shadow-2xl outline-none",
          !isOpen && "hidden",
        )}
      >
        {isOpen &&
          sortOptions.map((option, index) => (
            <li
              key={option.value}
              {...getItemProps({ item: option, index })}
              className={clsx(
                "cursor-pointer rounded-md px-3 py-2 text-sm transition-colors",
                highlightedIndex === index && "bg-white/5",
                selectedItem?.value === option.value
                  ? "text-primary"
                  : "text-white/90",
              )}
            >
              {option.label}
            </li>
          ))}
      </ul>
    </div>
  );
};

export const ProjectsFilters = ({ q, sort }: ProjectsFiltersProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const params = useRef({ q, sort });
  const timeout = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timeout.current), []);

  const apply = (next: Partial<ProjectsFiltersProps>, delay = 0) => {
    params.current = { ...params.current, ...next };
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => {
      const search = new URLSearchParams();
      const { q, sort } = params.current;
      if (q.trim()) search.set("q", q.trim());
      if (sort === "oldest") search.set("sort", sort);
      const query = search.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    }, delay);
  };

  return (
    <div className="flex flex-wrap items-center gap-4">
      <input
        type="search"
        defaultValue={q}
        placeholder="Search projects..."
        aria-label="Search projects"
        onChange={(e) => apply({ q: e.target.value }, 300)}
        className={`${inputClassName} min-w-64 flex-1`}
      />
      <SortSelect
        sort={sort}
        onChange={(sort) => apply({ sort })}
      />
    </div>
  );
};
