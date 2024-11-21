import { Outlet } from '@tanstack/react-router';

import GlobalErrorBoundaryProvider from '@cc/components/Providers/GlobalErrorBoundaryProvider';

import Footer from './_components/Footer';

export default function App() {
  return (
    <div>
      <main>
        <GlobalErrorBoundaryProvider>
          <Outlet />
        </GlobalErrorBoundaryProvider>
      </main>
      <footer className="sticky bottom-0">
        <Footer />
      </footer>
    </div>
  );
}
