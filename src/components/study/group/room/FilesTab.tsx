"use client";

import { api } from "@/lib/axios";
import { useRef } from "react";
import { Button } from "@/components/ui/button";

interface ChatDocumentDto {
  studyGroupId: number;
  memberId: number;
  fileId: number;
  status?: "CREATE" | "READ" | "DELETE"; // enum 가능
  file: FileMessage;
  modifyChk: boolean;
  id: number;
}

interface FileMessage {
  filesDetails: FilesDetailsDto[];
}

interface FilesDetailsDto {
  id: number;
  originFileName: string;
  fileUrl: string;
  filesId: number;
}

interface FilesTabProps {
  uploadedFiles: ChatDocumentDto[];
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isUploading: boolean;
  handleDeleteDocument: (
    id: number,
    fileId: number,
    fileDetailId: number,
  ) => void;
}

export default function FilesTab({
  uploadedFiles,
  onFileChange,
  isUploading,
  handleDeleteDocument,
}: FilesTabProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleDownload = async (
    detail: FilesDetailsDto,
    studyGroupId: number,
  ) => {
    try {
      const isCloudflare = detail.fileUrl.includes("r2.cloudflarestorage.com");
      const isCloudinary = detail.fileUrl.includes("res.cloudinary.com");

      if (isCloudflare) {
        const res = await api.get(
          `/private/file/signed-url?url=${encodeURIComponent(detail.fileUrl)}&studyGroupId=${studyGroupId}`,
        );
        const signedUrl = res.data;
        const a = document.createElement("a");
        a.href = signedUrl;
        a.download = detail.originFileName;
        a.click();
        window.URL.revokeObjectURL(signedUrl);
      } else if (isCloudinary) {
        const res = await api.get(
          `/private/file/download?url=${encodeURIComponent(detail.fileUrl)}&studyGroupId=${studyGroupId}`,
          { responseType: "blob" },
        );

        const blob = new Blob([res.data]);
        const blobUrl = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = detail.originFileName;
        a.click();
        window.URL.revokeObjectURL(blobUrl);
      }
    } catch (err) {
      console.error("Download failed", err);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex-1 overflow-y-auto space-y-2 text-sm pr-1">
        <ul className="space-y-2 text-sm">
          {uploadedFiles.map((file, idx) =>
            file.file.filesDetails.map((detail, innerIdx) => (
              <li key={`${idx}-${innerIdx}`}>
                <div
                  className="flex items-center justify-between px-4 py-3 
    border border-gray-200 dark:border-gray-700 
    rounded-xl shadow-sm 
    bg-white dark:bg-gray-800 
    hover:bg-gray-50 dark:hover:bg-gray-700 
    transition"
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <div className="text-gray-500 dark:text-gray-300 flex-shrink-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1M4 12l1.41-1.41a2 2 0 012.83 0L12 15l3.76-3.76a2 2 0 012.83 0L20 12"
                        />
                      </svg>
                    </div>
                    {/* 파일 이름 */}
                    <a
                      onClick={() => handleDownload(detail, file.studyGroupId)}
                      role="button"
                      className="cursor-pointer truncate max-w-full block text-sm text-gray-800 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 hover:underline"
                      title={detail.originFileName}
                    >
                      {detail.originFileName}
                    </a>
                  </div>
                  {file.modifyChk && (
                    <Button
                      variant="destructive"
                      size="sm"
                      className="flex-shrink-0 ml-2"
                      onClick={() =>
                        handleDeleteDocument(file.id, detail.filesId, detail.id)
                      }
                    >
                      삭제
                    </Button>
                  )}
                </div>
              </li>
            )),
          )}
        </ul>
      </div>
      {/* 숨겨진 input */}
      <div className="sticky bottom-0 bg-white dark:bg-gray-800 py-3 border-t border-gray-200 dark:border-gray-700">
        <input
          type="file"
          multiple
          onChange={onFileChange}
          ref={fileInputRef}
          className="hidden"
        />
        <button
          type="button"
          onClick={triggerFileSelect}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isUploading}
        >
          {isUploading ? "📤 업로드 중..." : "📎 자료 등록"}
        </button>
      </div>
    </div>
  );
}
