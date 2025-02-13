import { Card, CardContent } from "@/components/ui/card";
import { UserItem } from "./UserItem";
import { UserDTO } from "../_actions/user";

interface MobileExamListProps {
  users: UserDTO[];
  expandedItems: Set<string>;
  toggleExpand: (id: string) => void;
}

export function MobileUserList({
  users,
  expandedItems,
  toggleExpand,
}: MobileExamListProps) {
  return (
    <div className="space-y-4">
      {users.map((user) => (
        <Card key={user.id}>
          <CardContent className="p-4">
            <UserItem
              user={user}
              isExpanded={expandedItems.has(user.id)}
              onToggleExpand={() => toggleExpand(user.id)}
              isMobile={true}
            />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
