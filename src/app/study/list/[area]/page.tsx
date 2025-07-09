import GroupList from "@/components/study/list/area/GroupList";

interface PageProps {
  params: Promise<{ area: string }>; // params를 Promise로 정의
}

export default async function GroupListPage({ params }: PageProps) {
  const resolvedParams = await params;
  const area = resolvedParams?.area;
  return <GroupList region={area} />;
}
