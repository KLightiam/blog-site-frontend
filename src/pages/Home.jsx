import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import BlogCard, { Cover, PostMeta } from '../components/BlogCard';
import { CardSkeletons, LoadError, Message } from '../components/States';
import { useFetch } from '../lib/useFetch';
import { excerpt } from '../lib/posts';

function LeadStory({ post }) {
  return (
    <article className="group relative grid items-center gap-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-12">
      <div className="overflow-hidden rounded-2xl">
        <Cover post={post} className="aspect-[16/10] w-full transition-transform duration-700 group-hover:scale-[1.02]" />
      </div>
      <div>
        <PostMeta post={post} />
        <h2 className="mt-3 font-serif text-[clamp(2rem,4.4vw,3.25rem)] font-medium leading-[1.08] tracking-[-0.015em]">
          <Link to={`/blog/${post.id}`} className="after:absolute after:inset-0 group-hover:text-accent transition-colors">
            {post.title}
          </Link>
        </h2>
        <p className="mt-4 text-lg leading-relaxed text-muted">{excerpt(post.content, 40)}</p>
        <p className="mt-6 inline-flex items-center gap-2 font-semibold text-accent">
          Read the story <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
        </p>
      </div>
    </article>
  );
}

function CategoryStrip() {
  const { status, data } = useFetch('/api/v1/categories');
  const categories = (data ?? []).filter((c) => c.posts.length > 0);
  if (status !== 'ready' || categories.length === 0) return null;
  return (
    <section aria-labelledby="topics-title" className="mt-24 rounded-2xl bg-surface px-6 py-10 sm:px-10">
      <h2 id="topics-title" className="font-serif text-3xl font-medium">
        Browse by topic
      </h2>
      <ul className="mt-6 flex flex-wrap gap-2.5">
        {categories.map((c) => (
          <li key={c.id}>
            <Link
              to={`/categories/${encodeURIComponent(c.name)}/posts`}
              className="inline-flex items-center gap-2 rounded-full border border-line bg-paper px-4 py-2 font-medium transition-colors hover:border-accent hover:text-accent"
            >
              {c.name}
              <span className="text-sm text-muted tabular-nums">{c.posts.length}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Home() {
  const { status, data: posts } = useFetch('/api/v1/trendingposts?limit=7');

  let content;
  if (status === 'loading') {
    content = (
      <>
        <div className="grid gap-8 lg:grid-cols-[7fr_5fr]" aria-busy="true">
          <div className="skeleton aspect-[16/10]" />
          <div className="space-y-4 self-center">
            <div className="skeleton h-4 w-1/3" />
            <div className="skeleton h-12 w-full" />
            <div className="skeleton h-5 w-5/6" />
          </div>
        </div>
        <div className="mt-20">
          <CardSkeletons />
        </div>
      </>
    );
  } else if (status === 'error') {
    content = <LoadError />;
  } else if (!posts?.length) {
    content = (
      <Message title="No stories yet">New posts will appear here as soon as they’re published.</Message>
    );
  } else {
    const [lead, ...rest] = posts;
    content = (
      <>
        <LeadStory post={lead} />
        {rest.length > 0 && (
          <section aria-labelledby="more-title" className="mt-20 border-t border-line pt-12">
            <h2 id="more-title" className="font-serif text-3xl font-medium">
              More stories
            </h2>
            <div className="mt-8 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          </section>
        )}
      </>
    );
  }

  return (
    <div className="shell pt-10 sm:pt-14">
      <title>Kabah’s Blog</title>
      <h1 className="sr-only">Latest stories</h1>
      {content}
      <CategoryStrip />
    </div>
  );
}

export default Home;
