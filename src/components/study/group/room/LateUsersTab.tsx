"use client";

interface User {
  name: string;
  nickname: string;
}

interface LateUsersTabProps {
  lateUsers: User[];
}

export default function LateUsersTab({ lateUsers }: LateUsersTabProps) {
  return (
    <div className="flex flex-col gap-4">
      <ul className="list-disc list-inside text-sm">
        {lateUsers.map((user, idx) => (
          <li key={idx} className="flex justify-between items-center">
            <span>
              {user.nickname} ({user.name})
            </span>
            <span className="text-xs text-red-500">지각</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
