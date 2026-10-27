import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import BlogCard from '../components/BlogCard';
import { CardSkeletons, LoadError, Message } from '../components/States';
import { useFetch } from '../lib/useFetch';

export default function CategoryPosts() {
  const { categoryName } = useParams();
  const { status, data: posts } = useFetch(`/api/v1/${encodeURIComponent(categoryName)}/posts`);

  return (
    <div className="shell pt-10 sm:pt-14">
      <title>{`${categoryName} | Kabah’s Blog`}</title>
      <Link to="/categories" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-ink">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> All categories
      </Link>
      <h1 className="mt-6 font-serif text-[clamp(2.25rem,5vw,3.25rem)] font-medium leading-tight tracking-[-0.015em]">{categoryName}</h1>
      {status === 'ready' && (
        <p className="mt-2 text-lg text-muted tabular-nums">
          {posts.length} {posts.length === 1 ? 'story' : 'stories'}
        </p>
      )}

      <div className="mt-10">
        {status === 'loading' && <CardSkeletons />}
        {status === 'error' && <LoadError />}
        {status === 'notfound' && (
          <Message
            title="No stories here yet"
            action={
              <Link to="/categories" className="btn btn-primary">
                Browse other categories
              </Link>
            }
          >
            Nothing has been published under {categoryName} so far.
          </Message>
        )}
        {status === 'ready' && (
          <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
