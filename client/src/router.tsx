// client/src/router.tsx
import { createHashRouter } from 'react-router-dom';
import App from './ui/App';
import { GlobalLeaderboard } from './ui/GlobalLeaderboard';
import Profile from './ui/Profile';
import { config } from './config';

export const router = createHashRouter(
  [
    { path: '/', element: <App /> },
    { path: 'leaderboard', element: <GlobalLeaderboard /> },
    { path: 'profile', element: <Profile /> },
  ],
  { basename: config.basename },
);
