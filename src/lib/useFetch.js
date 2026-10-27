import { useEffect, useState } from 'react';
import { getJSON, NotFoundError } from './api';

// Loads JSON from the API. status: 'loading' | 'ready' | 'notfound' | 'error'
export function useFetch(path) {
  const [state, setState] = useState({ path: null, status: 'loading', data: null });

  useEffect(() => {
    const controller = new AbortController();
    getJSON(path, { signal: controller.signal })
      .then((data) => setState({ path, status: 'ready', data }))
      .catch((error) => {
        if (controller.signal.aborted) return;
        const notFound = error instanceof NotFoundError;
        if (!notFound) console.error(`Error loading ${path}:`, error);
        setState({ path, status: notFound ? 'notfound' : 'error', data: null });
      });
    return () => controller.abort();
  }, [path]);

  // While a new path loads, report loading rather than the previous page's data.
  return state.path === path ? state : { path, status: 'loading', data: null };
}
