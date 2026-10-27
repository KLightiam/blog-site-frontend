import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useBlocker, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ExternalLink, ImagePlus, X } from 'lucide-react';
import { adminFetch } from './api';
import { ConfirmButton, ErrorNote, StatusPill } from './ui';
import { coverOf, formatDate, paragraphs, readingTime } from '../lib/posts';

const EMPTY = { title: '', content: '', categoryId: '', tags: [] };
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];

const formOf = (post) =>
  post
    ? { title: post.title, content: post.content, categoryId: post.categories[0]?.id ?? '', tags: post.tags.map((t) => t.name) }
    : EMPTY;

const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

function TagInput({ tags, onChange, suggestions }) {
  const [draft, setDraft] = useState('');
  const add = (value) => {
    const name = value.trim().replace(/^#/, '');
    if (name && !tags.some((t) => t.toLowerCase() === name.toLowerCase()) && tags.length < 10) onChange([...tags, name.slice(0, 30)]);
    setDraft('');
  };
  return (
    <div>
      <div className="field flex min-h-0 flex-wrap items-center gap-1.5 py-2">
        {tags.map((t) => (
          <span key={t} className="inline-flex items-center gap-1 rounded-full bg-surface py-0.5 pl-2.5 pr-1 text-sm">
            #{t}
            <button type="button" onClick={() => onChange(tags.filter((x) => x !== t))} className="rounded-full p-0.5 text-muted hover:bg-line hover:text-ink" aria-label={`Remove tag ${t}`}>
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </span>
        ))}
        <input
          id="post-tags"
          list="tag-suggestions"
          value={draft}
          onChange={(e) => (e.target.value.endsWith(',') ? add(e.target.value.slice(0, -1)) : setDraft(e.target.value))}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              add(draft);
            } else if (e.key === 'Backspace' && !draft && tags.length) {
              onChange(tags.slice(0, -1));
            }
          }}
          onBlur={() => draft && add(draft)}
          placeholder={tags.length ? '' : 'Type a tag and press Enter'}
          className="min-w-[8rem] flex-1 bg-transparent py-0.5 outline-none placeholder:text-muted"
          disabled={tags.length >= 10}
        />
        <datalist id="tag-suggestions">
          {suggestions.filter((s) => !tags.includes(s)).map((s) => (
            <option key={s} value={s} />
          ))}
        </datalist>
      </div>
      <p className="mt-1.5 text-xs text-muted">Up to 10 tags. New tags are created when you save.</p>
    </div>
  );
}

function Preview({ form, cover, categories, date }) {
  const category = categories.find((c) => c.id === form.categoryId);
  const body = paragraphs(form.content);
  return (
    <article className="rounded-2xl border border-line bg-paper px-5 py-8 sm:px-10 sm:py-12">
      {category && <p className="text-sm font-semibold text-accent">{category.name}</p>}
      <h1 className="mt-2 font-serif text-[clamp(2rem,4.5vw,3rem)] font-medium leading-[1.08] tracking-[-0.015em]">{form.title || 'Untitled'}</h1>
      <p className="mt-4 text-muted">
        {formatDate(date)} · {readingTime(form.content)} min read
      </p>
      {cover && <img src={cover} alt="" className="mt-8 aspect-[16/9] w-full rounded-xl object-cover" />}
      <div className="prose-body mt-8 font-serif text-[1.2rem] leading-[1.75] text-ink/90">
        {body.length ? body.map((p, i) => <p key={i}>{p}</p>) : <p className="text-muted">Nothing written yet.</p>}
      </div>
      {form.tags.length > 0 && (
        <ul className="mt-8 flex flex-wrap gap-2">
          {form.tags.map((t) => (
            <li key={t} className="rounded-full bg-surface px-3 py-1 text-sm text-muted">
              #{t}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

export default function EditorPage() {
  const { id } = useParams();
  const isNew = id === 'new';
  const navigate = useNavigate();

  // Always loaded from the server, never from navigation state (which survives a reload and goes stale).
  const [saved, setSaved] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [loadState, setLoadState] = useState(isNew ? 'ready' : 'loading');
  const [categories, setCategories] = useState([]);
  const [tagSuggestions, setTagSuggestions] = useState([]);
  const [mode, setMode] = useState('write');
  const [busy, setBusy] = useState(null); // 'save' | 'publish' | 'unpublish' | 'cover'
  const [notice, setNotice] = useState(null); // { text, link? }
  const [error, setError] = useState('');
  const [localCover, setLocalCover] = useState(null);
  const fileInput = useRef(null);

  const dirty = !same(form, formOf(saved));
  const dirtyRef = useRef(dirty);
  dirtyRef.current = dirty;

  // Load the post when arriving at /admin/posts/:id (not after creating it here).
  useEffect(() => {
    if (isNew) {
      if (saved) {
        setSaved(null);
        setForm(EMPTY);
        setNotice(null);
      }
      setLoadState('ready');
      return;
    }
    if (saved?.id === id) return;
    let ignore = false;
    setLoadState('loading');
    adminFetch(`/api/v1/admin/posts/${encodeURIComponent(id)}`)
      .then((post) => {
        if (ignore) return;
        setSaved(post);
        setForm(formOf(post));
        setLoadState('ready');
      })
      .catch((err) => !ignore && setLoadState(err.status === 404 ? 'missing' : 'error'));
    return () => {
      ignore = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only react to the route changing
  }, [id]);

  useEffect(() => {
    adminFetch('/api/v1/admin/categories').then(setCategories).catch(() => {});
    adminFetch('/api/v1/admin/tags').then((tags) => setTagSuggestions(tags.map((t) => t.name))).catch(() => {});
  }, []);

  useEffect(() => () => localCover && URL.revokeObjectURL(localCover), [localCover]);

  // Warn before leaving with unsaved changes, inside the app and when closing the tab.
  const blocker = useBlocker(({ currentLocation, nextLocation }) => dirtyRef.current && currentLocation.pathname !== nextLocation.pathname);
  useEffect(() => {
    const warn = (e) => {
      if (dirtyRef.current) e.preventDefault();
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, []);

  const update = (patch) => {
    setForm((f) => ({ ...f, ...patch }));
    setNotice(null);
  };

  // Saves the form. `published` changes the status; leave it out to keep the current one.
  const save = useCallback(
    async ({ published, quiet = false } = {}) => {
      setError('');
      if (!form.title.trim()) {
        setError('Add a title before saving.');
        return null;
      }
      const body = { title: form.title, content: form.content, categoryId: form.categoryId || null, tags: form.tags };
      if (published !== undefined) body.published = published;
      try {
        const post = saved
          ? await adminFetch(`/api/v1/admin/posts/${saved.id}`, { method: 'PUT', body })
          : await adminFetch('/api/v1/admin/posts', { method: 'POST', body: { ...body, published: published ?? false } });
        setSaved(post);
        setForm(formOf(post));
        dirtyRef.current = false;
        // Same route, so the editor stays mounted (and an upload in progress carries on).
        if (!saved) navigate(`/admin/posts/${post.id}`, { replace: true });
        if (!quiet) {
          const wasLive = saved?.published;
          setNotice(
            post.published
              ? { text: wasLive ? 'Changes are live on the blog.' : 'Published. It’s now on the blog.', link: `/blog/${post.id}` }
              : { text: wasLive ? 'Moved back to drafts. It’s no longer on the blog.' : 'Draft saved.' },
          );
        }
        return post;
      } catch (err) {
        setError(err.message);
        return null;
      }
    },
    [form, saved, navigate],
  );

  const run = async (kind, options) => {
    setBusy(kind);
    await save(options);
    setBusy(null);
  };

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        if (!busy) run('save');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const uploadCover = async (file) => {
    setError('');
    if (!IMAGE_TYPES.includes(file.type)) return setError('Choose a JPEG, PNG, WebP, GIF or AVIF image.');
    if (file.size > MAX_IMAGE_BYTES) return setError('That image is over 5 MB. Choose a smaller one.');
    setBusy('cover');
    setLocalCover(URL.createObjectURL(file));
    try {
      // A new post has to exist before it can have a cover, so save it as a draft first.
      const post = saved ?? (await save({ quiet: true }));
      if (!post) return;
      const data = new FormData();
      data.append('image', file);
      const updated = await adminFetch(`/api/v1/admin/posts/${post.id}/cover`, { method: 'POST', body: data });
      setSaved((s) => ({ ...(s ?? updated), files: updated.files }));
      setNotice({ text: saved ? 'Cover image updated.' : 'Saved as a draft and added the cover image.' });
    } catch (err) {
      setError(err.message);
    } finally {
      setLocalCover(null);
      setBusy(null);
    }
  };

  const removeCover = async () => {
    setBusy('cover');
    setError('');
    try {
      const updated = await adminFetch(`/api/v1/admin/posts/${saved.id}/cover`, { method: 'DELETE' });
      setSaved((s) => ({ ...s, files: updated.files }));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(null);
    }
  };

  const deletePost = async () => {
    try {
      await adminFetch(`/api/v1/admin/posts/${saved.id}`, { method: 'DELETE' });
      dirtyRef.current = false;
      navigate('/admin', { replace: true });
    } catch (err) {
      setError(err.message);
    }
  };

  if (loadState === 'loading') return <div className="skeleton h-96" aria-busy="true" />;
  if (loadState === 'missing' || loadState === 'error') {
    return (
      <div className="rounded-2xl border border-line bg-paper px-6 py-14 text-center">
        <p className="font-medium">{loadState === 'missing' ? 'This post doesn’t exist any more.' : 'The post couldn’t load.'}</p>
        <Link to="/admin" className="btn btn-primary mt-5">
          Back to posts
        </Link>
      </div>
    );
  }

  const cover = localCover ?? coverOf(saved);
  const published = saved?.published ?? false;
  const words = form.content.trim() ? form.content.trim().split(/\s+/).length : 0;

  return (
    <div>
      <title>{`${isNew ? 'New post' : form.title || 'Untitled'} | Admin`}</title>

      {blocker.state === 'blocked' && (
        <div role="alertdialog" aria-label="Unsaved changes" className="sticky top-20 z-10 mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-500/40 bg-paper px-4 py-3 shadow-lg">
          <p className="text-sm font-medium">You have unsaved changes. Leave without saving?</p>
          <div className="flex gap-2">
            <button type="button" className="btn btn-ghost" onClick={() => blocker.reset()}>
              Stay
            </button>
            <button type="button" className="btn bg-red-600 text-white hover:bg-red-700" onClick={() => blocker.proceed()}>
              Leave
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link to="/admin" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-ink">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> All posts
        </Link>
        <div role="tablist" aria-label="Editor mode" className="flex gap-1 rounded-full bg-paper p-1 ring-1 ring-line">
          {['write', 'preview'].map((m) => (
            <button
              key={m}
              type="button"
              role="tab"
              aria-selected={mode === m}
              onClick={() => setMode(m)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize ${mode === m ? 'bg-ink text-paper' : 'text-muted hover:text-ink'}`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="min-w-0">
          {mode === 'write' ? (
            <div className="rounded-2xl border border-line bg-paper p-5 sm:p-8">
              <label htmlFor="post-title" className="sr-only">
                Title
              </label>
              <textarea
                id="post-title"
                rows={1}
                value={form.title}
                onChange={(e) => update({ title: e.target.value.replace(/\n/g, ' ') })}
                placeholder="Post title"
                maxLength={200}
                className="w-full resize-none bg-transparent font-serif text-[clamp(1.875rem,4vw,2.75rem)] font-medium leading-tight tracking-[-0.015em] outline-none placeholder:text-muted/60 [field-sizing:content]"
              />
              <label htmlFor="post-content" className="sr-only">
                Text
              </label>
              <textarea
                id="post-content"
                value={form.content}
                onChange={(e) => update({ content: e.target.value })}
                placeholder="Start writing. Leave a blank line between paragraphs."
                className="mt-4 min-h-[26rem] w-full resize-y bg-transparent font-serif text-[1.2rem] leading-[1.75] outline-none placeholder:text-muted/60 [field-sizing:content]"
              />
              <p className="mt-3 border-t border-line pt-3 text-sm text-muted tabular-nums">
                {words.toLocaleString('en-GB')} {words === 1 ? 'word' : 'words'} · {readingTime(form.content)} min read
              </p>
            </div>
          ) : (
            <Preview form={form} cover={cover} categories={categories} date={saved?.published ? saved.date : new Date()} />
          )}
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <section aria-labelledby="status-title" className="rounded-2xl border border-line bg-paper p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 id="status-title" className="font-semibold">
                Status
              </h2>
              <StatusPill published={published} />
            </div>
            <p className="mt-2 text-sm text-muted">
              {published
                ? `Live on the blog since ${formatDate(saved.date, { short: true })}.`
                : 'Only you can see drafts. Publishing puts the post at the top of the blog, dated today.'}
            </p>
            {dirty && <p className="mt-2 text-sm font-medium text-amber-700 dark:text-amber-300">Unsaved changes</p>}

            <div className="mt-4 grid gap-2">
              {published ? (
                <>
                  <button type="button" className="btn btn-primary disabled:opacity-60" disabled={!!busy || !dirty} onClick={() => run('save')}>
                    {busy === 'save' ? 'Updating…' : 'Update live post'}
                  </button>
                  <button type="button" className="btn btn-ghost disabled:opacity-60" disabled={!!busy} onClick={() => run('unpublish', { published: false })}>
                    {busy === 'unpublish' ? 'Unpublishing…' : 'Unpublish'}
                  </button>
                </>
              ) : (
                <>
                  <button type="button" className="btn btn-primary disabled:opacity-60" disabled={!!busy} onClick={() => run('publish', { published: true })}>
                    {busy === 'publish' ? 'Publishing…' : 'Publish'}
                  </button>
                  <button type="button" className="btn btn-ghost disabled:opacity-60" disabled={!!busy || (!dirty && !!saved)} onClick={() => run('save')}>
                    {busy === 'save' ? 'Saving…' : 'Save draft'}
                  </button>
                </>
              )}
            </div>
            <div className="mt-3 space-y-2" aria-live="polite">
              <ErrorNote>{error}</ErrorNote>
              {notice && (
                <p className="rounded-lg bg-emerald-500/10 px-3 py-2 text-sm text-emerald-800 dark:text-emerald-200">
                  {notice.text}{' '}
                  {notice.link && (
                    <a href={notice.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-semibold underline underline-offset-2">
                      View it <ExternalLink className="h-3 w-3" aria-hidden="true" />
                    </a>
                  )}
                </p>
              )}
            </div>
            <p className="mt-3 text-xs text-muted">Tip: Ctrl+S or ⌘S saves.</p>
          </section>

          <section aria-labelledby="cover-title" className="rounded-2xl border border-line bg-paper p-5">
            <h2 id="cover-title" className="font-semibold">
              Cover image
            </h2>
            <input
              ref={fileInput}
              id="cover-file"
              type="file"
              accept={IMAGE_TYPES.join(',')}
              className="sr-only"
              onChange={(e) => {
                const file = e.target.files?.[0];
                e.target.value = '';
                if (file) uploadCover(file);
              }}
            />
            {cover ? (
              <div className="mt-3">
                <div className="relative overflow-hidden rounded-xl">
                  <img src={cover} alt="Cover image preview" className={`aspect-[3/2] w-full object-cover ${busy === 'cover' ? 'opacity-50' : ''}`} />
                  {busy === 'cover' && <span className="absolute inset-0 grid place-items-center text-sm font-semibold">Uploading…</span>}
                </div>
                <div className="mt-3 flex gap-2">
                  <button type="button" className="btn btn-ghost flex-1 disabled:opacity-60" disabled={!!busy} onClick={() => fileInput.current?.click()}>
                    Replace
                  </button>
                  <button type="button" className="btn btn-ghost disabled:opacity-60" disabled={!!busy || !!localCover} onClick={removeCover}>
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <label
                htmlFor="cover-file"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files?.[0];
                  if (file) uploadCover(file);
                }}
                className="mt-3 flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-line px-4 py-8 text-center text-sm text-muted transition-colors hover:border-accent hover:text-ink"
              >
                <ImagePlus className="h-6 w-6" aria-hidden="true" />
                <span>
                  <span className="font-semibold text-accent">Choose an image</span> or drop it here
                </span>
                <span className="text-xs">JPEG, PNG, WebP, GIF or AVIF, up to 5 MB. Stored on Cloudinary.</span>
              </label>
            )}
          </section>

          <section aria-labelledby="details-title" className="rounded-2xl border border-line bg-paper p-5">
            <h2 id="details-title" className="font-semibold">
              Details
            </h2>
            <label htmlFor="post-category" className="mb-1.5 mt-4 block text-sm font-medium">
              Category
            </label>
            <select id="post-category" value={form.categoryId} onChange={(e) => update({ categoryId: e.target.value })} className="field">
              <option value="">No category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <p className="mt-1.5 text-xs text-muted">
              <Link to="/admin/categories" className="underline underline-offset-2 hover:text-ink">
                Manage categories
              </Link>
            </p>
            <label htmlFor="post-tags" className="mb-1.5 mt-5 block text-sm font-medium">
              Tags
            </label>
            <TagInput tags={form.tags} onChange={(tags) => update({ tags })} suggestions={tagSuggestions} />
          </section>

          {saved && (
            <div className="px-1">
              <ConfirmButton label="Delete post" confirmLabel="Delete" question="Delete this post for good?" onConfirm={deletePost} className="w-full" />
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
