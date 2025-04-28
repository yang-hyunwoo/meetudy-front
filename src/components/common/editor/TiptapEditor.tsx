"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Heading from "@tiptap/extension-heading";
import Blockquote from "@tiptap/extension-blockquote";
import CodeBlock from "@tiptap/extension-code-block";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Node, mergeAttributes } from "@tiptap/core";
import "./TiptapEditor.css";

const ResizableImage = Node.create({
  name: "resizableImage",
  group: "block",
  inline: false,
  draggable: true,
  atom: true,

  addAttributes() {
    return {
      src: {},
      width: { default: "300px" },
    };
  },

  parseHTML() {
    return [{ tag: "img[data-resizable]" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "img",
      mergeAttributes(HTMLAttributes, { "data-resizable": "true" }),
    ];
  },

  addNodeView() {
    return ({ node, getPos, editor }) => {
      const img = document.createElement("img");
      img.setAttribute("src", node.attrs.src);
      img.setAttribute("data-resizable", "true");
      img.style.width = node.attrs.width || "300px";

      const container = document.createElement("div");
      container.contentEditable = "false";
      container.className = "resizable-image-wrapper";
      container.appendChild(img);

      const handle = document.createElement("div");
      handle.className = "resize-handle";
      container.appendChild(handle);

      let startX = 0;
      let startWidth = 0;

      let savedPos: number | null = null;
      try {
        savedPos = getPos?.();
      } catch (err) {
        console.warn("getPos 저장 실패", err);
      }

      const onMouseDown = (event: MouseEvent) => {
        event.preventDefault();
        startX = event.clientX;
        startWidth = img.offsetWidth;

        const onMouseMove = (moveEvent: MouseEvent) => {
          const newWidth = startWidth + (moveEvent.clientX - startX);
          img.style.width = `${newWidth}px`;

          if (
            typeof savedPos !== "number" ||
            savedPos < 0 ||
            savedPos >= editor.state.doc.content.size
          )
            return;

          const resolvedNode = editor.state.doc.nodeAt(savedPos);
          if (!resolvedNode || resolvedNode.type.name !== "resizableImage")
            return;

          const transaction = editor.state.tr.setNodeMarkup(
            savedPos,
            undefined,
            {
              ...node.attrs,
              width: `${newWidth}px`,
            },
          );
          editor.view.dispatch(transaction);
        };

        const onMouseUp = () => {
          document.removeEventListener("mousemove", onMouseMove);
          document.removeEventListener("mouseup", onMouseUp);
        };

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
      };

      handle.addEventListener("mousedown", onMouseDown);
      return { dom: container, contentDOM: null };
    };
  },
});

interface TiptapEditorProps {
  content?: string;
  onChange?: (html: string) => void;
}

export default function TiptapEditor({
  content = "",
  onChange,
}: TiptapEditorProps) {
  const { resolvedTheme } = useTheme();
  const [themeClass, setThemeClass] = useState("tiptap-light");

  useEffect(() => {
    setThemeClass(resolvedTheme === "dark" ? "tiptap-dark" : "tiptap-light");
  }, [resolvedTheme]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      TextStyle,
      Color.configure({ types: ["textStyle"] }),
      Highlight,
      ResizableImage,
      Heading.configure({ levels: [1, 2, 3] }),
      Blockquote,
      CodeBlock,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Link.configure({ openOnClick: false }),
    ],
    content,
    editorProps: {
      attributes: { class: `ProseMirror ${themeClass}` },
      handleDrop(view, event) {
        const hasFiles = event.dataTransfer?.files?.length;
        if (!hasFiles || !editor) return false;

        const file = event.dataTransfer.files[0];
        const reader = new FileReader();
        reader.onload = () => {
          if (!editor || typeof reader.result !== "string") return;
          editor.commands.insertContent({
            type: "resizableImage",
            attrs: { src: reader.result, width: "300px" },
          });
        };
        reader.readAsDataURL(file);
        return true;
      },
    },
    onUpdate: ({ editor }) => onChange?.(editor.getHTML()),
  });

  return (
    <div className={`tiptap-editor-wrapper ${themeClass}`}>
      {editor && (
        <>
          <div className={`tiptap-toolbar ${themeClass}`}>
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={editor.isActive("bold") ? "active" : ""}
            >
              B
            </button>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={editor.isActive("italic") ? "active" : ""}
            >
              I
            </button>
            <button
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={editor.isActive("strike") ? "active" : ""}
            >
              S
            </button>
            <button
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 1 }).run()
              }
              className={
                editor.isActive("heading", { level: 1 }) ? "active" : ""
              }
            >
              H1
            </button>
            <button
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
              className={
                editor.isActive("heading", { level: 2 }) ? "active" : ""
              }
            >
              H2
            </button>
            <button
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 3 }).run()
              }
              className={
                editor.isActive("heading", { level: 3 }) ? "active" : ""
              }
            >
              H3
            </button>
            <button
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              className={editor.isActive("codeBlock") ? "active" : ""}
            >
              Code
            </button>
            <button
              onClick={() => editor.chain().focus().toggleHighlight().run()}
            >
              🖍
            </button>
            <label
              title="텍스트 색상"
              className="w-8 h-8 rounded bg-gray-600 hover:bg-gray-500 inline-flex items-center justify-center cursor-pointer"
            >
              🎨
              <input
                type="color"
                onChange={(e) =>
                  editor.chain().focus().setColor(e.target.value).run()
                }
                className="absolute w-0 h-0 opacity-0 pointer-events-none"
              />
            </label>
            <button
              onClick={() => {
                const previousUrl = editor.getAttributes("link").href;
                const url = window.prompt(
                  "링크 URL을 입력하세요",
                  previousUrl || "",
                );
                if (url === null) return;

                if (url === "") {
                  editor.chain().focus().unsetLink().run();
                  return;
                }

                editor
                  .chain()
                  .focus()
                  .extendMarkRange("link")
                  .setLink({ href: url })
                  .run();
              }}
            >
              Link
            </button>
            <button
              onClick={() => editor.chain().focus().setTextAlign("left").run()}
            >
              ↤
            </button>
            <button
              onClick={() =>
                editor.chain().focus().setTextAlign("center").run()
              }
            >
              ↔
            </button>
            <button
              onClick={() => editor.chain().focus().setTextAlign("right").run()}
            >
              ↦
            </button>
          </div>
          <EditorContent key={themeClass} editor={editor} />
        </>
      )}
    </div>
  );
}
