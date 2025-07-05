// client/src/router.tsx
import { createHashRouter } from 'react-router-dom';
import App from './ui/App';
import { GlobalLeaderboard } from './ui/GlobalLeaderboard';
import Profile from './ui/Profile';
import ClanPage from './ui/page/ClanPage';
import { ClanList, ClanDetail } from './ui/clans'
import { config } from './config';

export const router = createHashRouter(
  [
    { path: '/', element: <App /> },
    { path: 'leaderboard', element: <GlobalLeaderboard /> },
    { path: 'profile', element: <Profile /> }, 

    { path: 'clan', element: <ClanPage /> }, 
    {
      path: 'clans',
      children: [
        { index: true, element: <ClanList /> },
        { path: ':tag', element: <ClanDetail /> },
      ],
    },
  ],
  { basename: config.basename },
);
