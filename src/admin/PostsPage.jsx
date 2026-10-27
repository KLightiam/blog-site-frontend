import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ExternalLink, ImageOff, Plus, Search } from 'lucide-react';
import { adminFetch } from './api';
import { ErrorNote, StatusPill } from './ui';
import { coverOf, formatDate } from '../lib/posts';

const TABS = [
  { key: 'all', label: 'All' },
  { key: 'published', label: 'Published' },
  { key: 'draft', label: 'Drafts' },
];

export default function PostsPage() {
  const [posts, setPosts] = useState(null);
  const [error, setError] = useState('');
  const [params, setParams] = useSearchParams();
  const tab = TABS.some((t) => t.key === params.get('status')) ? params.get('status') : 'all';
  const [search, setSearch] = useState('');

  useEffect(() => {
    let ignore = false;
    adminFetch('/api/v1/admin/posts')
      .then((data) => !ignore && setPosts(data))
      .catch((err) => !ignore && setError(err.message));
    return () => {
      ignore = true;
    };
  }, []);

  const counts = useMemo(
    () => ({
      all: posts?.length ?? 0,
      published: posts?.filter((p) => p.published).length ?? 0,
      draft: posts?.filter((p) => !p.published).length ?? 0,
    }),
    [posts],
  );

  const term = search.trim().toLowerCase();
  const visible = (posts ?? [])
    .filter((p) => tab === 'all' || (tab === 'published') === p.published)
    .filter((p) => !term || p.title.toLowerCase().includes(term));

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl font-medium">Posts</h1>
          {posts && (
            <p className="mt-1 text-muted">
              {counts.published} published · {counts.draft} {counts.draft === 1 ? 'draft' : 'drafts'}
            </p>
          )}
        </div>
        <Link to="/admin/posts/new" className="btn btn-primary">
          <Plus className="h-4 w-4" aria-hidden="true" /> New post
        </Link>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <div role="tablist" aria-label="Filter posts" className="flex gap-1 rounded-full bg-paper p-1 ring-1 ring-line">
          {TABS.map((t) => (
            <button
              key={t.key}
              role="tab"
              type="button"
              aria-selected={tab === t.key}
              onClick={() => setParams(t.key === 'all' ? {} : { status: t.key }, { replace: true })}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${tab === t.key ? 'bg-ink text-paper' : 'text-muted hover:text-ink'}`}
            >
              {t.label} <span className="tabular-nums opacity-70">{posts ? counts[t.key] : ''}</span>
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-72">
          <label htmlFor="post-search" className="sr-only">
            Search posts by title
          </label>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
          <input id="post-search" type="search" placeholder="Search by title" value={search} onChange={(e) => setSearch(e.target.value)} className="field pl-10" />
        </div>
      </div>

      <div className="mt-5">
        <ErrorNote>{error}</ErrorNote>
        {!posts && !error && (
          <div className="space-y-2" aria-busy="true">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="skeleton h-20" />
            ))}
          </div>
        )}
        {posts && visible.length === 0 && (
          <div className="rounded-2xl border border-dashed border-line bg-paper px-6 py-14 text-center">
            <p className="font-medium">{posts.length === 0 ? 'No posts yet' : term ? `No posts match “${search}”` : tab === 'draft' ? 'No drafts' : 'Nothing published yet'}</p>
            <p className="mt-1 text-sm text-muted">{posts.length === 0 ? 'Write your first post and publish it when it’s ready.' : 'Try another filter or search.'}</p>
            {posts.length === 0 && (
              <Link to="/admin/posts/new" className="btn btn-primary mt-5">
                Write a post
              </Link>
            )}
          </div>
        )}
        {visible.length > 0 && (
          <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-paper">
            {visible.map((post) => {
              const cover = coverOf(post);
              return (
                <li key={post.id} className="group relative flex items-center gap-4 px-4 py-3.5 hover:bg-surface/60 sm:px-5">
                  <div className="h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-surface">
                    {cover ? (
                      <img src={cover} alt="" className="h-full w-full object-cover" loading="lazy" />
                    ) : (
                      <span className="grid h-full place-items-center text-muted" aria-label="No cover image">
                        <ImageOff className="h-4 w-4" aria-hidden="true" />
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link to={`/admin/posts/${post.id}`} className="block truncate font-medium after:absolute after:inset-0 group-hover:text-accent">
                      {post.title || 'Untitled'}
                    </Link>
                    <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted">
                      <StatusPill published={post.published} />
                      <span>{post.categories[0]?.name ?? 'No category'}</span>
                      <span aria-hidden="true">·</span>
                      <span>{post.published ? `Published ${formatDate(post.date, { short: true })}` : `Created ${formatDate(post.date, { short: true })}`}</span>
                    </p>
                  </div>
                  {post.published && (
                    <a
                      href={`/blog/${post.id}`}
                      target="_blank"
                      rel="noreferrer"
                      className="relative z-10 hidden items-center gap-1 rounded-full px-3 py-1.5 text-sm text-muted hover:bg-surface hover:text-ink sm:inline-flex"
                      onClick={(e) => e.stopPropagation()}
                    >
                      View <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
