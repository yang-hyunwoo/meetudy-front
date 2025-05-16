import BoardDetail from "@/components/board/detail/BoardDetail";
import axios from "axios";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function BoardDetailPage({ params }: PageProps) {
  try {
    const res = await fetch(
      `http://localhost:8080/api/free-board/${params.id}`,
      {
        cache: "no-store",
      },
    );
    const data = await res.json();

    if (res.status !== 200 || !data.data) {
      return (
        <BoardDetail errorMessage="게시글이 존재하지 않거나 삭제되었습니다." />
      );
    }

    return <BoardDetail post={data.data} />;
  } catch (err) {
    return <BoardDetail errorMessage="서버 오류가 발생했습니다." />;
  }
}

//   const isLoggedIn = true; // 나중에 진짜 로그인 정보 가져오기

//   const res = await fetch(`http://localhost:8080/api/free-board/${postId}`, {
//     // 절대 경로 필요! 서버 컴포넌트는 브라우저가 아님
//     cache: "no-store", // ← ISR 캐싱 방지 (선택)
//   });

//   let postData;
//   const data = await res.json(); // ← 여기가 실제 서버 데이터!
//   if (data.httpCode == 200) {
//     postData = data.data;
//   } else {
//     alert(data.errCodeMsg);
//     return;
//   }
//   const post = {
//     id: postData.id,
//     title: postData.title,
//     content: postData.content,
//     author: postData.writeNickname,
//     createdAt: postData.createdAt,
//     isAuthor: postData.modifyChk,
//   };

//   return (
//     <div className="max-w-3xl mx-auto p-6">
//       <BoardDetail post={post} />
//     </div>
//   );
// }
