"use client";

import { Input } from "@/components/ui/input";

interface FilesTabProps {
  uploadedFiles: File[];
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function FilesTab({
  uploadedFiles,
  onFileChange,
}: FilesTabProps) {
  return (
    <div className="flex flex-col gap-4">
      <ul className="list-disc list-inside text-sm">
        {uploadedFiles.map((file, idx) => (
          <li key={idx}>
            <a
              href={URL.createObjectURL(file)}
              download={file.name}
              className="text-blue-600 underline"
            >
              {file.name}
            </a>
          </li>
        ))}
      </ul>
      <Input type="file" multiple onChange={onFileChange} />
    </div>
  );
}
