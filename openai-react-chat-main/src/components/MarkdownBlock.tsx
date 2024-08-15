import React, { useContext } from "react";
import ReactMarkdown from "react-markdown";
import { visit } from "unist-util-visit";
import "./MarkdownBlock.css";

// import SyntaxHighlighter from 'react-syntax-highlighter';
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import CopyButton from "./CopyButton";
import { Root } from "hast";
import gfm from "remark-gfm";
import "github-markdown-css/github-markdown.css";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { UserContext } from "../UserContext";
import {
  coldarkDark,
  oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";

interface ChatBlockProps {
  markdown: string;
  role: string;
  loading: boolean;
}

function rehypeInlineCodeProperty() {
  return function (tree: Root): void {
    visit(tree, "element", (node, index, parent) => {
      if (node.tagName === "code") {
        const isInline =
          node.position && node.position.start.line === node.position.end.line;
        node.properties.dataInline = isInline;
        // console.log('Code element:', node);
        // console.log('Is inline:', isInline);
      }
    });
  };
}

const MarkdownBlock: React.FC<ChatBlockProps> = ({
  markdown,
  role,
  loading,
}) => {
  const { userSettings, setUserSettings } = useContext(UserContext);

  function inlineCodeBlock({
    value,
    language,
  }: {
    value: string;
    language: string | undefined;
  }) {
    return <code>{value}</code>;
  }

  function codeBlock({ node, className, children, ...props }: any) {
    if (!children) {
      return null;
    }
    const value = String(children).replace(/\n$/, "");
    if (!value) {
      return null;
    }
    // Note: OpenAI does not always annotate the Markdown code block with the language
    // Note: In this case, we will fall back to plaintext
    const match = /language-(\w+)/.exec(className || "");
    let language: string = match ? match[1] : "plaintext";
    const isInline = node.properties.dataInline;

    return isInline ? (
      inlineCodeBlock({ value: value, language })
    ) : (
      <div className="border border-gray-200 dark:border-gray-800 rounded-md codeBlockContainer dark:bg-gray-850">
        <div className="flex items-center relative text-gray-900 dark:text-gray-200 bg-gray-200 dark:bg-gray-850 px-4 py-1.5 text-xs font-sans justify-between rounded-t-md">
          <span>{language}</span>
          <CopyButton text={children} />
        </div>
        <div className="overflow-y-auto">
          <SyntaxHighlighter
            language={language}
            style={userSettings.theme === "dark" ? coldarkDark : oneLight}
            customStyle={{ margin: "0" }}
          >
            {value}
          </SyntaxHighlighter>
          {/* <code {...props} className={className}>
                        {children}
                    </code>*/}
        </div>
      </div>
    );
  }

  const renderers = {
    code: codeBlock,
  };

  return (
    <>
      <div className="mb-2 flex w-full flex-row justify-end gap-x-2 text-slate-500">
        <button className="hover:text-blue-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <path d="M7 11v8a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1v-7a1 1 0 0 1 1 -1h3a4 4 0 0 0 4 -4v-1a2 2 0 0 1 4 0v5h3a2 2 0 0 1 2 2l-1 5a2 3 0 0 1 -2 2h-7a3 3 0 0 1 -3 -3"></path>
          </svg>
        </button>
        <button className="hover:text-blue-600" type="button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <path d="M7 13v-8a1 1 0 0 0 -1 -1h-2a1 1 0 0 0 -1 1v7a1 1 0 0 0 1 1h3a4 4 0 0 1 4 4v1a2 2 0 0 0 4 0v-5h3a2 2 0 0 0 2 -2l-1 -5a2 3 0 0 0 -2 -2h-7a3 3 0 0 0 -3 3"></path>
          </svg>
        </button>
        <button className="hover:text-blue-600" type="button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <path d="M8 8m0 2a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2z"></path>
            <path d="M16 8v-2a2 2 0 0 0 -2 -2h-8a2 2 0 0 0 -2 2v8a2 2 0 0 0 2 2h2"></path>
          </svg>
        </button>
      </div>
      <div className="mb-4 flex rounded-xl bg-gray-50 px-2 py-6 dark:bg-gray-900 sm:px-4">
        <img
          className="mr-2 flex h-8 w-8 rounded-full sm:mr-4"
          src="https://dummyimage.com/256x256/354ea1/ffffff&text=G"
        />

        <div className="flex max-w-3xl items-center rounded-xl">
          {markdown}
        </div>
      </div>
    </>

    // <div>
    //   <ReactMarkdown
    //       remarkPlugins={[gfm, remarkMath]}
    //       components={renderers}
    //       rehypePlugins={[rehypeKatex, rehypeInlineCodeProperty]}
    //   >
    //     {markdown}
    //   </ReactMarkdown>
    //   {loading && <span className="streaming-dot">•••</span>}
    // </div>
  );
};

export default MarkdownBlock;
