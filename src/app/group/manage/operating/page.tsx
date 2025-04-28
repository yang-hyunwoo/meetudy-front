import JoinedGroupOperating from "@/components/manage/operating/JoinedGroupOperating";

export default function JoinedGroupOperatingPage() {
  const dummyGroups = [
    {
      id: "1",
      name: "프론트엔드 스터디",
      thumbnail: "/images/study-thumbnail-1.jpg",
      memberCount: 10,
    },
    {
      id: "2",
      name: "백엔드 스터디",
      thumbnail: "/images/study-thumbnail-2.jpg",
      memberCount: 8,
    },
    {
      id: "3",
      name: "CS 스터디",
      thumbnail: "/images/study-thumbnail-3.jpg",
      memberCount: 15,
    },
  ];

  return (
    <main className="min-h-screen p-6">
      <JoinedGroupOperating groups={dummyGroups} />
    </main>
  );
}
