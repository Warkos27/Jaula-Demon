import Markdown from 'markdown-to-jsx';

type MarkdownArticleProps = {
  markdown: string;
};

export default function MarkdownArticle({ markdown }: MarkdownArticleProps) {
  return (
    <div className="prose prose-slate max-w-none prose-headings:font-semibold prose-a:text-sky-700 prose-strong:text-slate-900">
      <Markdown>{markdown}</Markdown>
    </div>
  );
}
