import { VFC } from 'react';
import { AppRouter } from '$cmp/AppRouter';
import { Sidebar } from '$cmp/nav/Sidebar';

export const App: VFC = () => {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <AppRouter />
    </div>
  );
};
