import { Link } from 'react-router-dom';
import { coverOf, excerpt, formatDate, readingTime } from '../lib/posts';

export function Cover({ post, className = '', sizes }) {
  const src = coverOf(post);
  if (!src) {
    return (
      <div className={`grid place-items-center bg-accent-soft text-accent ${className}`} aria-hidden="true">
        <span className="font-serif text-5xl italic">{post.title.charAt(0)}</span>
      </div>
    );
  }
  return <img src={src} alt="" loading="lazy" sizes={sizes} className={`object-cover ${className}`} />;
}

export function PostMeta({ post, className = '', short = false }) {
  const category = post.categories?.[0]?.name;
  return (
    <p className={`flex flex-wrap items-center gap-x-2 text-sm text-muted ${className}`}>
      {category && <span className="font-semibold text-accent">{category}</span>}
      {category && <span aria-hidden="true">·</span>}
      <time dateTime={post.date}>{formatDate(post.date, { short })}</time>
      <span aria-hidden="true">·</span>
      <span>{readingTime(post.content)} min read</span>
    </p>
  );
}

function BlogCard({ post }) {
  return (
    <article className="group relative flex flex-col">
      <div className="overflow-hidden rounded-xl">
        <Cover post={post} className="aspect-[3/2] w-full transition-transform duration-500 group-hover:scale-[1.03]" />
      </div>
      <PostMeta post={post} short className="mt-4" />
      <h3 className="mt-2 font-serif text-2xl font-medium leading-snug">
        <Link to={`/blog/${post.id}`} className="after:absolute after:inset-0 group-hover:text-accent transition-colors">
          {post.title}
        </Link>
      </h3>
      <p className="mt-2 text-muted leading-relaxed">{excerpt(post.content, 22)}</p>
    </article>
  );
}

export default BlogCard;
