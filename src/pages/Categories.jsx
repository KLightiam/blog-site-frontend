import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Search } from 'lucide-react';
import { LoadError, Message } from '../components/States';
import { useFetch } from '../lib/useFetch';

export default function CategoriesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const { status, data } = useFetch('/api/v1/categories');

  const term = searchTerm.trim().toLowerCase();
  // Categories with no published stories lead to an empty page, so they are left out.
  const categories = (data ?? [])
    .filter((c) => c.posts.length > 0)
    .filter((c) => !term || c.name.toLowerCase().includes(term));

  return (
    <div className="shell max-w-4xl pt-10 sm:pt-14">
      <title>Categories | Kabah’s Blog</title>
      <h1 className="font-serif text-[clamp(2.25rem,5vw,3.25rem)] font-medium leading-tight tracking-[-0.015em]">Categories</h1>
      <p className="mt-3 text-lg text-muted">Every topic on the blog, with how many stories each one has.</p>

      <div className="relative mt-8">
        <label htmlFor="category-search" className="sr-only">
          Search categories
        </label>
        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" aria-hidden="true" />
        <input
          id="category-search"
          type="search"
          placeholder="Search categories"
          className="field pl-12"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {status === 'loading' && (
        <div className="mt-8 grid gap-3 sm:grid-cols-2" aria-busy="true">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="skeleton h-24" />
          ))}
        </div>
      )}
      {status === 'error' && <LoadError />}
      {status === 'ready' && categories.length === 0 && (
        <Message title={term ? `No categories match “${searchTerm}”` : 'No categories yet'}>
          {term ? 'Try a shorter or different word.' : 'Topics appear here once stories are published.'}
        </Message>
      )}
      {status === 'ready' && categories.length > 0 && (
        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {categories.map((category) => {
            const count = category.posts.length;
            return (
              <li key={category.id}>
                <Link
                  to={`/categories/${encodeURIComponent(category.name)}/posts`}
                  className="group flex items-center justify-between gap-4 rounded-xl border border-line p-5 transition-colors hover:border-accent"
                >
                  <span>
                    <span className="block font-serif text-2xl font-medium group-hover:text-accent transition-colors">{category.name}</span>
                    <span className="mt-1 block text-sm text-muted tabular-nums">
                      {count} {count === 1 ? 'story' : 'stories'}
                    </span>
                  </span>
                  <ArrowUpRight className="h-5 w-5 shrink-0 text-muted transition group-hover:text-accent group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
