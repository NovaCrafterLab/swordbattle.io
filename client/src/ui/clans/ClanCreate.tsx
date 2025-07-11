// client/src/ui/clans/ClanCreate.tsx
// switched to module scss + sb-clans-cc-* class names

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useCreateClan } from './api';
import styles from './ClanCreate.module.scss'; // <— changed

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess?: (tag: string) => void;
}

const ClanCreate: React.FC<Props> = ({ open, onClose, onSuccess }) => {
  const [tag, setTag] = useState('');
  const [name, setName] = useState('');

  const {
    mutate: createClan,
    data,
    error,
    isPending,
    isSuccess,
  } = useCreateClan();

  /* auto-close on success */
  useEffect(() => {
    if (isSuccess && (data as any)?.clan?.tag) {
      onSuccess?.((data as any).clan.tag);
      onClose();
    }
  }, [isSuccess, data, onSuccess, onClose]);

  if (!open) return null;

  return createPortal(
    <div className={styles['sb-clans-cc-overlay']} onClick={onClose}>
      <div
        className={styles['sb-clans-cc-modal']}
        onClick={(e) => e.stopPropagation()}
      >
        <h3>Create Clan</h3>

        <label className={styles['sb-clans-cc-label']}>
          Tag&nbsp;(1–6&nbsp;A-Z/0-9)
          <input
            className={styles['sb-clans-cc-input']}
            type="text"
            maxLength={6}
            value={tag}
            onChange={(e) => setTag(e.target.value.toUpperCase())}
          />
        </label>

        <label className={styles['sb-clans-cc-label']}>
          Name
          <input
            className={styles['sb-clans-cc-input']}
            type="text"
            maxLength={64}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>

        {error && (
          <p className={styles['sb-clans-cc-error']}>
            {(error as any).message || 'Error'}
          </p>
        )}

        <div className={styles['sb-clans-cc-actions']}>
          <button
            className={styles['sb-clans-cc-btn']}
            onClick={onClose}
            disabled={isPending}
          >
            Cancel
          </button>
          <button
            className={styles['sb-clans-cc-btn']}
            onClick={() => createClan({ tag, name })}
            disabled={!tag || !name || isPending}
          >
            {isPending ? 'Creating…' : 'Create'}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default ClanCreate;
