"use client";

import { useState } from "react";
import { MobileUserList } from "./MobileUserList";
import { UserDTO } from "../_actions/user";
import { DesktopUserList } from "./DesktopUserList";

interface ExamsListProps {
  users: UserDTO[];
}

export function UserList({ users }: ExamsListProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <>
      <div className="lg:hidden">
        <MobileUserList
          users={users}
          expandedItems={expandedItems}
          toggleExpand={toggleExpand}
        />
      </div>
      <div className="hidden lg:block">
        <DesktopUserList users={users} />
      </div>
    </>
  );
}
