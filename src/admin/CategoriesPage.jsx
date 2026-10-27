import { useEffect, useState } from 'react';
import { adminFetch } from './api';
import { ConfirmButton, ErrorNote } from './ui';

function CategoryRow({ category, onRenamed, onDeleted }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(category.name);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const drafts = category.postCount - category.publishedCount;

  const rename = async (e) => {
    e.preventDefault();
    if (name.trim() === category.name) return setEditing(false);
    setBusy(true);
    setError('');
    try {
      const updated = await adminFetch(`/api/v1/admin/categories/${category.id}`, { method: 'PUT', body: { name } });
      onRenamed({ ...category, name: updated.name });
      setEditing(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <li className="flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-4">
      {editing ? (
        <form onSubmit={rename} className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
          <label htmlFor={`rename-${category.id}`} className="sr-only">
            New name for {category.name}
          </label>
          <input id={`rename-${category.id}`} value={name} onChange={(e) => setName(e.target.value)} maxLength={40} className="field max-w-xs" autoFocus />
          <button type="submit" className="btn btn-primary disabled:opacity-60" disabled={busy || !name.trim()}>
            Save
          </button>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => {
              setEditing(false);
              setName(category.name);
              setError('');
            }}
          >
            Cancel
          </button>
          <div className="w-full">
            <ErrorNote>{error}</ErrorNote>
          </div>
        </form>
      ) : (
        <>
          <div className="min-w-0 flex-1">
            <p className="font-serif text-xl font-medium">{category.name}</p>
            <p className="text-sm text-muted tabular-nums">
              {category.publishedCount} published{drafts > 0 ? ` · ${drafts} ${drafts === 1 ? 'draft' : 'drafts'}` : ''}
              {category.publishedCount === 0 && ' · hidden on the blog until a post in it is published'}
            </p>
          </div>
          <button type="button" className="btn btn-ghost" onClick={() => setEditing(true)}>
            Rename
          </button>
          <ConfirmButton
            label="Delete"
            confirmLabel="Delete"
            question={category.postCount ? `Its ${category.postCount} ${category.postCount === 1 ? 'post stays' : 'posts stay'}, without a category.` : 'Delete this category?'}
            onConfirm={async () => {
              await adminFetch(`/api/v1/admin/categories/${category.id}`, { method: 'DELETE' });
              onDeleted(category.id);
            }}
          />
        </>
      )}
    </li>
  );
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState(null);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [addError, setAddError] = useState('');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    adminFetch('/api/v1/admin/categories')
      .then(setCategories)
      .catch((err) => setError(err.message));
  }, []);

  const add = async (e) => {
    e.preventDefault();
    setAdding(true);
    setAddError('');
    try {
      const created = await adminFetch('/api/v1/admin/categories', { method: 'POST', body: { name } });
      setCategories((list) => [...list, created].sort((a, b) => a.name.localeCompare(b.name)));
      setName('');
    } catch (err) {
      setAddError(err.message);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <title>Categories | Admin</title>
      <h1 className="font-serif text-4xl font-medium">Categories</h1>
      <p className="mt-1 text-muted">Each post can have one category. Readers browse the blog by them.</p>

      <form onSubmit={add} className="mt-8 rounded-2xl border border-line bg-paper p-5">
        <label htmlFor="new-category" className="mb-1.5 block text-sm font-medium">
          New category
        </label>
        <div className="flex flex-wrap gap-2">
          <input id="new-category" value={name} onChange={(e) => setName(e.target.value)} maxLength={40} placeholder="For example: Food" className="field max-w-xs flex-1" />
          <button type="submit" className="btn btn-primary disabled:opacity-60" disabled={adding || !name.trim()}>
            {adding ? 'Adding…' : 'Add category'}
          </button>
        </div>
        <div className="mt-2">
          <ErrorNote>{addError}</ErrorNote>
        </div>
      </form>

      <div className="mt-6">
        <ErrorNote>{error}</ErrorNote>
        {!categories && !error && <div className="skeleton h-48" aria-busy="true" />}
        {categories?.length === 0 && <p className="rounded-2xl border border-dashed border-line bg-paper px-6 py-10 text-center text-muted">No categories yet. Add the first one above.</p>}
        {categories?.length > 0 && (
          <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-paper">
            {categories.map((c) => (
              <CategoryRow
                key={c.id}
                category={c}
                onRenamed={(updated) => setCategories((list) => list.map((x) => (x.id === updated.id ? updated : x)))}
                onDeleted={(id) => setCategories((list) => list.filter((x) => x.id !== id))}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
