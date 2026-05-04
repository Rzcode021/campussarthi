import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

export default function MainLayout() {
  return (
    <div className="flex min-h-screen" style={{ background: '#0F1629' }}>
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <Topbar />
        <main className="flex-1 pt-14 px-6 md:px-8 py-7">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
