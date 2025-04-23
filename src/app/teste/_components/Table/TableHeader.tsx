export function TableHeader({ headers }: { headers: string[] }) {
    return (
      <thead className="bg-gray-100">
        <tr>
          {headers.map((header, index) => (
            <th key={index} className="px-4 py-2 text-left font-medium text-gray-700 border-b">
              {header}
            </th>
          ))}
        </tr>
      </thead>
    );
  }
  