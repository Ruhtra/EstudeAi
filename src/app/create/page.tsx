import { Suspense } from "react";
import { List } from "./components/List";
export default function Pageh() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <List />;
      </Suspense>
    </div>
  );
}
