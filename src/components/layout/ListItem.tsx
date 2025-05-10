// components/ListItem.tsx
import Link from "next/link";

export default function ListItem({
  title,
  href,
  children,
}: {
  title: string;
  href: string;
  children?: React.ReactNode; //  선택형으로 변경
}) {
  return (
    <li>
      <Link
        href={href}
        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100 focus:bg-gray-100"
      >
        <div className="text-sm font-medium leading-none">{title}</div>
        {children && (
          <p className="line-clamp-2 text-sm leading-snug text-gray-500">
            {children}
          </p>
        )}
      </Link>
    </li>
  );
}
