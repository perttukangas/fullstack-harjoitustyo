import { Outlet } from '@tanstack/react-router';

import GlobalErrorBoundaryProvider from '@c/core/components/Providers/GlobalErrorBoundaryProvider';

import Footer from './_components/Footer';

export default function App() {
  return (
    <div className="mx-auto max-w-screen-lg">
      <main>
        <GlobalErrorBoundaryProvider>
          <Outlet />
        </GlobalErrorBoundaryProvider>
      </main>
      <Footer />
    </div>
  );
}
