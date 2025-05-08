import JoinSuccess from "@/components/join/JoinSuccess";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function JoinSuccessPage() {
  const cookieStore = await cookies();
  const joinSuccess = cookieStore.get("join_success");
  if (!joinSuccess || joinSuccess.value !== "success") {
    redirect("/"); // 잘못된 접근 시 홈으로 이동
  }

  return <JoinSuccess />;
}
