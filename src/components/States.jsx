import { Link } from 'react-router-dom';

export function Message({ title, children, action }) {
  return (
    <div className="mx-auto max-w-lg py-20 text-center">
      <h2 className="font-serif text-3xl font-medium">{title}</h2>
      {children && <p className="mt-3 text-muted leading-relaxed">{children}</p>}
      {action && <div className="mt-7">{action}</div>}
    </div>
  );
}

export function LoadError() {
  return (
    <Message title="Stories couldn’t load" action={<button type="button" className="btn btn-ghost" onClick={() => window.location.reload()}>Try again</button>}>
      The blog server didn’t respond. Check your connection, then try again.
    </Message>
  );
}

export function BackHome({ children = 'Back to all stories' }) {
  return (
    <Link to="/" className="btn btn-primary">
      {children}
    </Link>
  );
}

export function CardSkeletons({ count = 3 }) {
  return (
    <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true" aria-label="Loading stories">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="space-y-3">
          <div className="skeleton aspect-[3/2]" />
          <div className="skeleton h-3 w-1/3" />
          <div className="skeleton h-6 w-4/5" />
          <div className="skeleton h-4 w-full" />
        </div>
      ))}
    </div>
  );
}
