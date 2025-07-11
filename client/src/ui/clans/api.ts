// client/src/ui/clans/api.ts
// React-Query hooks for clans (auto-inject secret via api.ts)

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/api';
import { ClanBrief, ClanMember, ClanDetail } from './types';
import { toast } from '@/ui/components/Toast';

/* ---------- low-level helpers ---------- */

const PAGE_SIZE = 20;

const getAsync = <T = any>(url: string) =>
  new Promise<T>((res) => api.get(url, res));

const postAsync = <T = any>(url: string, body: any) =>
  api.postAsync<T>(url, body);

const patchAsync = <T = any>(url: string, body: any) =>
  new Promise<T>((res) => api.patch(url, body, res));

/* ---------- queries ---------- */

// clan list
export function useClans(page = 1, q = '') {
  const search = q ? `&q=${encodeURIComponent(q)}` : '';
  return useQuery({
    queryKey: ['clans', page, q],
    queryFn: () =>
      getAsync<{
        data: ClanBrief[];
        total: number;
        page: number;
        size: number;
      }>(`${api.endpoint}/clans?page=${page}&size=${PAGE_SIZE}${search}`),
    staleTime: 30_000,
  });
}

// clan detail
export function useClanDetail(key: string | number) {
  return useQuery({
    queryKey: ['clan', key],
    queryFn: () => getAsync<ClanDetail>(`${api.endpoint}/clans/info/${key}`),
    enabled: !!key,
  });
}

// clan members (Phase 2 strengthened)
interface MembersResp {
  clan: { tag: string; name: string };
  members: ClanMember[];
}

export function useClanMembers(tag: string) {
  return useQuery<MembersResp, Error>({
    queryKey: ['clanMembers', tag],
    queryFn: () =>
      getAsync<MembersResp>(`${api.endpoint}/clans/${tag}/members`).then(
        (d) => {
          if ((d as any).error) throw new Error((d as any).error);
          return d;
        },
      ),
    enabled: !!tag,
    staleTime: 15_000,
  });
}

/* ---------- mutations (secret auto-injected by api.ts) ---------- */

export function useCreateClan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      tag: string;
      name: string;
      color?: string;
      description?: string;
      is_public?: boolean;
    }) => postAsync(`${api.endpoint}/clans`, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['clans'] });
    },
    onError: (e: any) => toast('error', e?.message || 'Create failed'),
  });
}

export function useJoinClan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (tag: string) =>
      postAsync(`${api.endpoint}/clans/join/${tag}`, {}),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['clans'] });
    },
  });
}

export function useLeaveClan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => postAsync(`${api.endpoint}/clans/leave`, {}),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['clans'] });
      qc.invalidateQueries({ queryKey: ['clan'] });
    },
    onError: (e: any) => toast('error', e?.message || 'Leave failed'),
  });
}

/* == update clan (owner) == */
export function useUpdateClan(tag: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      name?: string;
      description?: string;
      color?: string;
      is_public?: boolean;
    }) => patchAsync(`${api.endpoint}/clans/${tag}`, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['clan', tag] });
    },
    onError: (e: any) => toast('error', e?.message || 'Update failed'),
  });
}

/* ----- admin / owner actions ----- */

export function useKickMember(tag: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      postAsync(`${api.endpoint}/clans/${tag}/kick/${id}`, {}),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['clanMembers', tag] });
    },
    onError: (e: any) => toast('error', e?.message || 'Kick failed'),
  });
}

export function useToggleAdmin(tag: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      postAsync(`${api.endpoint}/clans/${tag}/promote/${id}`, {}),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['clanMembers', tag] });
    },
    onError: (e: any) => toast('error', e?.message || 'Operation failed'),
  });
}

export function useTransferOwner(tag: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      postAsync(`${api.endpoint}/clans/${tag}/transfer/${id}`, {}),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['clanMembers', tag] });
      qc.invalidateQueries({ queryKey: ['clan', tag] });
    },
    onError: (e: any) => toast('error', e?.message || 'Transfer failed'),
  });
}

/* == invite to private clan (optional) == */
export function useAddMember(tag: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      postAsync(`${api.endpoint}/clans/${tag}/add/${id}`, {}),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['clanMembers', tag] });
    },
    onError: (e: any) => toast('error', e?.message || 'Add member failed'),
  });
}
