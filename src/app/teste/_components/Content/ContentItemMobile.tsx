import { ReactNode, useState } from 'react';

interface ContentItemMobileProps {
  expandable?: boolean;
  header: ReactNode;
  children?: ReactNode;
}

export function ContentItemMobile({ expandable, header, children }: ContentItemMobileProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border rounded p-4 shadow-sm">
      <div className="flex justify-between items-start">
        <div>{header}</div>
        {expandable && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-blue-600 text-sm hover:underline"
          >
            {expanded ? 'Recolher' : 'Expandir'}
          </button>
        )}
      </div>
      {expanded && <div className="mt-2">{children}</div>}
    </div>
  );
}
