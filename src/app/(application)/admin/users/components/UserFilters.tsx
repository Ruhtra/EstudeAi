import { Input } from "@/components/ui/input";
interface UserFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}
export function UserFilter({ searchQuery, setSearchQuery }: UserFilterProps) {
  return (
    <>
      <Input
        placeholder="Buscar usuários..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full sm:max-w-xs"
      />
    </>
  );
}
