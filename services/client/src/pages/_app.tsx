import { Link, Outlet } from '@tanstack/react-router';

import GlobalErrorBoundaryProvider from '@c/core/components/Providers/GlobalErrorBoundaryProvider';

export default function App() {
  return (
    <section style={{ margin: 24 }}>
      <header style={{ display: 'flex', gap: 24 }}>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/posts">Posts</Link>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
      </header>

      <main>
        <GlobalErrorBoundaryProvider>
          <Outlet />
        </GlobalErrorBoundaryProvider>
      </main>
    </section>
  );
}