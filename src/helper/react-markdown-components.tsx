import Link from "next/link";
import { ReactNode } from "react";
import { Prism as SyntaxHighlighter, SyntaxHighlighterProps } from "react-syntax-highlighter";
import { darcula } from "react-syntax-highlighter/dist/esm/styles/prism";

interface CodeProps {
  children: ReactNode;
  className?: string;
  [key: string]: unknown;
}

const childrentoId = (children: ReactNode | undefined) => {
  let temp = children?.toString().toLowerCase().replace(/\s/g, '-');
  const emojiRegex = /^[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{2B50}\u{2B55}\u{2934}\u{2935}\u{2B05}-\u{2B07}\u{2B1B}\u{2B1C}\u{2B50}\u{2B55}\u{3030}\u{303D}\u{3297}\u{3299}\u{1F004}\u{1F0CF}\u{1F170}-\u{1F171}\u{1F17E}-\u{1F17F}\u{1F18E}\u{1F191}-\u{1F19A}\u{1F1E6}-\u{1F1FF}\u{1F201}-\u{1F202}\u{1F21A}\u{1F22F}\u{1F232}-\u{1F23A}\u{1F250}-\u{1F251}\u{1F300}-\u{1F321}\u{1F324}-\u{1F393}\u{1F396}-\u{1F397}\u{1F399}-\u{1F39B}\u{1F39E}-\u{1F3F0}\u{1F3F3}-\u{1F3F5}\u{1F3F7}-\u{1F4FD}\u{1F4FF}-\u{1F53D}\u{1F549}-\u{1F54E}\u{1F550}-\u{1F567}\u{1F56F}-\u{1F570}\u{1F573}-\u{1F57A}\u{1F587}-\u{1F588}\u{1F58A}-\u{1F58D}\u{1F590}-\u{1F590}\u{1F595}-\u{1F596}\u{1F5A4}-\u{1F5A5}\u{1F5A8}-\u{1F5A8}\u{1F5B1}-\u{1F5B2}\u{1F5BC}-\u{1F5BC}\u{1F5C2}-\u{1F5C4}\u{1F5D1}-\u{1F5D3}\u{1F5DC}-\u{1F5DE}\u{1F5E1}-\u{1F5E1}\u{1F5E3}-\u{1F5E3}\u{1F5E8}-\u{1F5E8}\u{1F5EF}-\u{1F5EF}\u{1F5F3}-\u{1F5F3}\u{1F5FA}-\u{1F5FA}\u{1F5FB}-\u{1F5FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{2B50}\u{2B55}\u{2934}\u{2935}\u{2B05}-\u{2B07}\u{2B1B}\u{2B1C}\u{2B50}\u{2B55}\u{3030}\u{303D}\u{3297}\u{3299}\u{1F004}\u{1F0CF}\u{1F170}-\u{1F171}\u{1F17E}-\u{1F17F}\u{1F18E}\u{1F191}-\u{1F19A}\u{1F1E6}-\u{1F1FF}\u{1F201}-\u{1F202}\u{1F21A}\u{1F22F}\u{1F232}-\u{1F23A}\u{1F250}-\u{1F251}\u{1F300}-\u{1F321}\u{1F324}-\u{1F393}\u{1F396}-\u{1F397}\u{1F399}-\u{1F39B}\u{1F39E}-\u{1F3F0}\u{1F3F3}-\u{1F3F5}\u{1F3F7}-\u{1F4FD}\u{1F4FF}-\u{1F53D}\u{1F549}-\u{1F54E}\u{1F550}-\u{1F567}\u{1F56F}-\u{1F570}\u{1F573}-\u{1F57A}\u{1F587}-\u{1F588}\u{1F58A}-\u{1F58D}\u{1F590}-\u{1F590}\u{1F595}-\u{1F596}\u{1F5A4}-\u{1F5A5}\u{1F5A8}-\u{1F5A8}\u{1F5B1}-\u{1F5B2}\u{1F5BC}-\u{1F5BC}\u{1F5C2}-\u{1F5C4}\u{1F5D1}-\u{1F5D3}\u{1F5DC}-\u{1F5DE}\u{1F5E1}-\u{1F5E1}\u{1F5E3}-\u{1F5E3}\u{1F5E8}-\u{1F5E8}\u{1F5EF}-\u{1F5EF}\u{1F5F3}-\u{1F5F3}\u{1F5FA}-\u{1F5FA}\u{1F5FB}-\u{1F5FF}]/u;
  if (!temp) return '';
  if (emojiRegex.test(temp)) {
    temp = temp.replace(emojiRegex, '').trim();
    while (temp[0] === '-') temp = temp.slice(1);
  }
  return temp;
}

export const markdownComponents: { [key: string]: React.ElementType } = {
  h1: ({ children }: { children: ReactNode }) => <h1 className="text-4xl font-bold text-gray-800 mt-2 mb-4">{children}</h1>,
  h2: ({ children }: { children: ReactNode }) => <h2 id={childrentoId(children)} className="text-3xl font-semibold text-gray-700 mt-5 mb-3 scroll-m-16">{children}</h2>,
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
    <Link
      href={href}
      className="text-blue-600 hover:underline"
      target={href?.toString()[0] === "#" ? "_self" : "_blank"}
      rel="noopener noreferrer"
    >
      {children}
    </Link>
  ),
  hr: () => <hr className="border-gray-300 my-6" />,
  table: ({ children }: { children: ReactNode }) => <table className="table-auto border-collapse border border-gray-300 w-full mb-4">{children}</table>,
  thead: ({ children }: { children: ReactNode }) => <thead className="bg-gray-100">{children}</thead>,
  tbody: ({ children }: { children: ReactNode }) => <tbody>{children}</tbody>,
  tr: ({ children }: { children: ReactNode }) => <tr className="border-b border-gray-300">{children}</tr>,
  th: ({ children }: { children: ReactNode }) => <th className="px-4 py-2 text-left font-medium text-gray-600 border border-gray-300">{children}</th>,
  td: ({ children }: { children: ReactNode }) => <td className="px-4 py-2 text-gray-600 border border-gray-300">{children}</td>,
  img: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} className="rounded-lg max-w-full h-auto my-4" />,
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