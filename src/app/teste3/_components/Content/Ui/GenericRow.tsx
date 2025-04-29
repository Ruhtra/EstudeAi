"use client";

import { useUserContext } from "../../UserMutationProvider";

export const GenericRow = ({
  item,
}: {
  item: { id: string; name: string };
}) => {
  const { useDeleteMutation } = useUserContext();

  const { mutate, isPending } = useDeleteMutation(item.id);

  return (
    <div>
      <span>{item.name}</span>
      <button onClick={() => mutate()} disabled={isPending}>
        {isPending ? "Deletando..." : "Deletar"}
      </button>
    </div>
  );
};
