import { Outlet } from '@tanstack/react-router';

import GlobalErrorBoundaryProvider from '@c/core/components/Providers/GlobalErrorBoundaryProvider';

import Footer from './_components/Footer';

export default function App() {
  return (
    <div className="flex max-h-screen flex-col">
      <main className="overflow-y-auto">
        <GlobalErrorBoundaryProvider>
          <Outlet />
        </GlobalErrorBoundaryProvider>
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
}
