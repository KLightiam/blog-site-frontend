import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Check, Link2 } from 'lucide-react';
import { Cover } from '../components/BlogCard';
import { BackHome, LoadError, Message } from '../components/States';
import { useFetch } from '../lib/useFetch';
import { formatDate, paragraphs, readingTime } from '../lib/posts';

function CopyLink() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };
  return (
    <button type="button" onClick={copy} className="btn btn-ghost">
      {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Link2 className="h-4 w-4" aria-hidden="true" />}
      {copied ? 'Link copied' : 'Copy link'}
    </button>
  );
}

function BlogPost() {
  const { id } = useParams();
  const { status, data: post } = useFetch(`/api/v1/posts/${encodeURIComponent(id)}`);

  if (status === 'loading') {
    return (
      <div className="shell max-w-3xl pt-14" aria-busy="true" aria-label="Loading story">
        <div className="skeleton h-4 w-40" />
        <div className="skeleton mt-5 h-12 w-full" />
        <div className="skeleton mt-3 h-12 w-2/3" />
        <div className="skeleton mt-10 aspect-[16/9]" />
      </div>
    );
  }
  if (status === 'notfound') {
    return (
      <div className="shell">
        <title>Story not found | Kabah’s Blog</title>
        <Message title="We couldn’t find that story" action={<BackHome />}>
          It may have been moved or unpublished. The latest stories are on the home page.
        </Message>
      </div>
    );
  }
  if (status === 'error') return <div className="shell"><LoadError /></div>;

  const category = post.categories?.[0];
  const body = paragraphs(post.content);

  return (
    <article className="pt-10 sm:pt-14">
      <title>{`${post.title} | Kabah’s Blog`}</title>
      <header className="shell max-w-3xl">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-ink">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> All stories
        </Link>
        {category && (
          <p className="mt-8">
            <Link
              to={`/categories/${encodeURIComponent(category.name)}/posts`}
              className="text-sm font-semibold text-accent hover:underline underline-offset-4"
            >
              {category.name}
            </Link>
          </p>
        )}
        <h1 className="mt-3 font-serif text-[clamp(2.25rem,5.5vw,3.75rem)] font-medium leading-[1.06] tracking-[-0.02em]">
          {post.title}
        </h1>
        <p className="mt-5 flex flex-wrap gap-x-2 text-muted">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span aria-hidden="true">·</span>
          <span>{readingTime(post.content)} min read</span>
        </p>
      </header>

      <figure className="shell mt-10 max-w-5xl">
        <Cover post={post} className="aspect-[16/9] w-full rounded-2xl" />
      </figure>

      <div className="shell max-w-3xl">
        <div className="prose-body mt-12 font-serif text-[1.25rem] leading-[1.75] text-ink/90">
          {body.length ? body.map((p, i) => <p key={i}>{p}</p>) : <p className="text-muted">This story has no text yet.</p>}
        </div>

        {post.tags?.length > 0 && (
          <ul className="mt-12 flex flex-wrap gap-2" aria-label="Tags">
            {post.tags.map((tag) => (
              <li key={tag.id} className="rounded-full bg-surface px-3 py-1 text-sm text-muted">
                #{tag.name}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-8">
          <Link to="/" className="btn btn-primary">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" /> More stories
          </Link>
          <CopyLink />
        </div>
      </div>
    </article>
  );
}

export default BlogPost;
