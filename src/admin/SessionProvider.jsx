import { useCallback, useEffect, useMemo, useState } from 'react';
import { checkSession, onSessionEnd, readSession, signIn, signOut } from './api';
import { SessionContext } from './session';

export default function SessionProvider({ children }) {
  // 'checking' until the stored session is confirmed with the server
  const [state, setState] = useState(() => (readSession() ? { status: 'checking', user: null } : { status: 'signed-out', user: null }));

  useEffect(() => {
    if (state.status !== 'checking') return;
    let ignore = false;
    checkSession()
      .then((user) => !ignore && setState({ status: 'signed-in', user }))
      .catch(() => !ignore && setState({ status: 'signed-out', user: null }));
    return () => {
      ignore = true;
    };
  }, [state.status]);

  useEffect(() => onSessionEnd(() => setState({ status: 'signed-out', user: null })), []);

  const login = useCallback(async (email, password) => {
    const user = await signIn(email, password);
    setState({ status: 'signed-in', user });
  }, []);

  const logout = useCallback(async () => {
    await signOut();
    setState({ status: 'signed-out', user: null });
  }, []);

  const value = useMemo(() => ({ ...state, login, logout }), [state, login, logout]);
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}
