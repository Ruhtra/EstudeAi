import { Card, CardContent } from "@/components/ui/card"
import { UserItem } from "./UserItem"
import type { UserDTO } from "./UsersList"

interface MobileUsersListProps {
  users: UserDTO[]
  expandedItems: Set<string>
  toggleExpand: (id: string) => void
}

export function MobileUsersList({ users, expandedItems, toggleExpand }: MobileUsersListProps) {
  return (
    <div className="space-y-3">
      {users.map((user) => (
        <Card key={user.id}>
          <CardContent className="p-3">
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
  )
}

