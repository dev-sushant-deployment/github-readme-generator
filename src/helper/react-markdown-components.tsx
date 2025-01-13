import Image from "next/image";
import { ReactNode } from "react";
import { Prism as SyntaxHighlighter, SyntaxHighlighterProps } from "react-syntax-highlighter";
import { darcula } from "react-syntax-highlighter/dist/esm/styles/prism";

interface CodeProps {
  children: ReactNode;
  className?: string;
  [key: string]: unknown;
}

export const markdownComponents: { [key: string]: React.ElementType } = {
  h1: ({ children }: { children: ReactNode }) => <h1 className="text-4xl font-bold text-gray-800 mt-2 mb-4">{children}</h1>,
  h2: ({ children }: { children: ReactNode }) => <h2 className="text-3xl font-semibold text-gray-700 mt-5 mb-3">{children}</h2>,
  h3: ({ children }: { children: ReactNode }) => <h3 className="text-2xl font-medium text-gray-600 mt-4 mb-2">{children}</h3>,
  h4: ({ children }: { children: ReactNode }) => <h4 className="text-xl font-medium text-gray-500 mt-3 mb-2">{children}</h4>,
  h5: ({ children }: { children: ReactNode }) => <h5 className="text-lg font-medium text-gray-500 mt-2 mb-1">{children}</h5>,
  h6: ({ children }: { children: ReactNode }) => <h6 className="text-base font-medium text-gray-400 mt-2 mb-1">{children}</h6>,
  p: ({ children }: { children: ReactNode }) => <p className="text-base text-gray-600 mb-4 leading-relaxed">{children}</p>,
  ul: ({ children }: { children: ReactNode }) => <ul className="list-disc list-inside ml-6 mb-4">{children}</ul>,
  ol: ({ children }: { children: ReactNode }) => <ol className="list-decimal list-inside ml-6 mb-4">{children}</ol>,
  li: ({ children }: { children: ReactNode }) => <li className="mb-1">{children}</li>,
  blockquote: ({ children }: { children: ReactNode }) => (
    <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-500 my-4">{children}</blockquote>
  ),
  code: (props: CodeProps) => {
    const { children, className, ...rest } = props;
    const match = /language-(\w+)/.exec(className || "");
    return match ? (
      <SyntaxHighlighter
        {...(rest as SyntaxHighlighterProps)}
        language={match[1]}
        style={darcula}
      >
        {String(children).replace(/\n$/, "")}
      </SyntaxHighlighter>
    ) : (
      <code {...rest} className={`${className || ""} bg-muted-foreground rounded-md p-1 text-white`}>
        {children}
      </code>
    );
  },
  a: ({ href = '', children }: { href?: string; children?: ReactNode }) => (
    <a
      href={href}
      className="text-blue-600 hover:underline"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ),
  hr: () => <hr className="border-gray-300 my-6" />,
  table: ({ children }: { children: ReactNode }) => <table className="table-auto border-collapse border border-gray-300 w-full mb-4">{children}</table>,
  thead: ({ children }: { children: ReactNode }) => <thead className="bg-gray-100">{children}</thead>,
  tbody: ({ children }: { children: ReactNode }) => <tbody>{children}</tbody>,
  tr: ({ children }: { children: ReactNode }) => <tr className="border-b border-gray-300">{children}</tr>,
  th: ({ children }: { children: ReactNode }) => <th className="px-4 py-2 text-left font-medium text-gray-600 border border-gray-300">{children}</th>,
  td: ({ children }: { children: ReactNode }) => <td className="px-4 py-2 text-gray-600 border border-gray-300">{children}</td>,
  img: ({ src, alt }: { src: string; alt: string }) => <Image src={src} alt={alt} className="rounded-lg max-w-full h-auto my-4" />,
  strong: ({ children }: { children: ReactNode }) => <strong className="font-semibold text-gray-700">{children}</strong>,
  em: ({ children }: { children: ReactNode }) => <em className="italic text-gray-600">{children}</em>,
  del: ({ children }: { children: ReactNode }) => <del className="line-through text-gray-400">{children}</del>,
  dl: ({ children }: { children: ReactNode }) => <dl className="mb-4">{children}</dl>,
  dt: ({ children }: { children: ReactNode }) => <dt className="font-semibold text-gray-700 mt-2">{children}</dt>,
  dd: ({ children }: { children: ReactNode }) => <dd className="ml-4 text-gray-600 mb-2">{children}</dd>,
  inlineCode: ({ children }: { children: ReactNode }) => (
    <code className="bg-gray-100 text-red-600 px-1 py-0.5 rounded">{children}</code>
  ),
};