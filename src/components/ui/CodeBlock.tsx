"use client";

import { useState } from "react";

interface CodeBlockProps {
  children: React.ReactNode;
  className?: string;
}

const CodeBlock = ({ children, className }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      // childrenからテキストを抽出
      let codeText = "";
      
      if (typeof children === "string") {
        codeText = children;
      } else if (Array.isArray(children)) {
        codeText = children
          .map((child) => {
            if (typeof child === "string") return child;
            if (child && typeof child === "object" && "props" in child) {
              return child.props.children;
            }
            return "";
          })
          .join("");
      } else if (children && typeof children === "object" && "props" in children) {
        codeText = children.props.children || "";
      }

      // テキストが空でない場合のみコピー
      if (codeText.trim()) {
        await navigator.clipboard.writeText(codeText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        console.log("コードをコピーしました:", codeText.substring(0, 50) + "...");
      } else {
        console.log("コピーするテキストが見つかりません");
      }
    } catch (error) {
      console.error("クリップボードへのコピーに失敗しました:", error);
    }
  };

  return (
    <div className="relative group">
      <div className="absolute top-2 right-2 z-10">
        <button
          onClick={handleCopy}
          className="px-3 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-md transition-colors duration-200 opacity-0 group-hover:opacity-100 text-xs font-medium"
          title="コードをコピー"
        >
          {copied ? "✓ コピー完了" : "📋 コピー"}
        </button>
      </div>
      <pre className={className}>
        <code>{children}</code>
      </pre>
    </div>
  );
};

export default CodeBlock; 