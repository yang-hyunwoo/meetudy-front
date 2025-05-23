import GroupList from "@/components/study/list/area/GroupList";

interface Props {
  params: { area: string }; // [area]가 URL에서 들어옴
}

export default function GroupListPage({ params }: Props) {
  const { area } = params;
  return <GroupList region={area} />;
}
