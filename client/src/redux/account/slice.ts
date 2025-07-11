// client/src/redux/account/slice.ts
// Refined account slice: smaller surface, clear side-effects, clan helpers added

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '@/api';

/* ---------- models ---------- */

export interface AccountState {
  id: number;
  email: string;
  username: string;
  clan_tag: string;
  secret: string;
  isLoggedIn: boolean;
  gems: number;
  ultimacy: number;
  skins: { equipped: number; owned: number[] };
  is_v1: boolean;
  xp: number;
}

const initialState: AccountState = {
  id: 0,
  email: '',
  username: '',
  clan_tag: '',
  secret: '',
  isLoggedIn: false,
  gems: 0,
  ultimacy: 0,
  skins: { equipped: 1, owned: [1] },
  is_v1: false,
  xp: 0,
};

/* ---------- helpers ---------- */

const storeSecret = (token: string) => {
  try {
    window.localStorage.setItem('secret', token);
  } catch {}
  window.phaser_game?.events.emit('tokenUpdate', token);
};

/* ---------- async thunks ---------- */

export const logoutAsync = createAsyncThunk(
  'account/logout',
  (_, { dispatch }) => {
    storeSecret('');
    dispatch(clearAccount());
  },
);

export const refreshAccountAsync = createAsyncThunk(
  'account/refresh',
  async (_: void, { getState, dispatch }) => {
    const secret = (getState() as any).account.secret;
    const resp: any = await api.postAsync(
      `${api.endpoint}/profile/getPrivateUserInfo`,
      {},
    );
    if (resp.account) {
      dispatch(setAccount({ ...resp.account, secret }));
      return resp.account;
    }
    throw new Error(resp.error || 'Refresh failed');
  },
);

/* ---------- slice ---------- */

const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    clearAccount(state) {
      Object.assign(state, initialState);
      /* keep token in localStorage; only emit blank to Phaser,
         real removal happens explicitly in logoutAsync  */
      window.phaser_game?.events.emit('tokenUpdate', '');
    },

    setAccount(state, action: PayloadAction<Partial<AccountState>>) {
      const prev = state.secret;
      Object.assign(state, action.payload, { isLoggedIn: true });
      if (action.payload.secret && action.payload.secret !== prev) {
        state.secret = action.payload.secret;
        storeSecret(state.secret);
      }
    },

    setName(state, action: PayloadAction<string>) {
      state.username = action.payload;
    },

    setClanTag(state, action: PayloadAction<string>) {
      state.clan_tag = action.payload;
    },

    setSecret(state, action: PayloadAction<string>) {
      state.secret = action.payload;
      storeSecret(state.secret);
    },
  },
});

/* ---------- exports ---------- */

export const { clearAccount, setAccount, setName, setClanTag, setSecret } =
  accountSlice.actions;
export default accountSlice.reducer;

/* -----------------------------------------------------------------
   TEMP compat thunk
   changeNameAsync is deprecated; keep until name-change UI is migrated
   TODO: remove after dedicated username-change modal refactor
------------------------------------------------------------------- */
export const changeNameAsync = createAsyncThunk(
  'account/compat/changeName',
  async (newUsername: string, { dispatch }) => {
    try {
      const res: any = await api.postAsync(
        `${api.endpoint}/auth/change-username?now=${Date.now()}`,
        { newUsername },
      );
      if (res.success) {
        dispatch(setName(newUsername));
        dispatch(setSecret(res.secret));
      } else if (res.error) {
        throw new Error(res.error);
      }
      return res;
    } catch (e) {
      /* swallow to prevent unhandled rejection */
      console.error('changeNameAsync deprecated thunk error', e);
      return { error: (e as Error).message };
    }
  },
);
