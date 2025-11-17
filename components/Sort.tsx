"use client"; // Anytime using useState, next/navigation (useRouter) is an indication it is going to run on client

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePathname, useRouter } from "next/navigation";
import { sortTypes } from "@/constants";

const Sort = () => {
  const path = usePathname();
  const router = useRouter(); // Routing functionality with useRouter

  const handleSort = (value: string) => {
    router.push(`${path}?sort=${value}`); // Go over
  };

  return (
    <Select onValueChange={handleSort} defaultValue={sortTypes[0].value}>
      <SelectTrigger className="sort-select">
        <SelectValue placeholder={sortTypes[0].value} />
      </SelectTrigger>
      <SelectContent className="sort-select-content">
        {sortTypes.map((sort) => (
          <SelectItem
            key={sort.label}
            value={sort.value}
            className="shad-select-item"
          >
            {sort.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default Sort;
