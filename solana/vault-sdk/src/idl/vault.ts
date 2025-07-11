/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/vault.json`.
 */
export type Vault = {
  address: 'AqDb3BxQhL5wmszt3iy8qrvPJ9Mu5MeF5uoUd1e65EaV';
  metadata: {
    name: 'vault';
    version: '0.1.0';
    spec: '0.1.0';
    description: 'Created with Anchor';
  };
  instructions: [
    {
      name: 'adminWithdraw';
      discriminator: [160, 166, 147, 222, 46, 220, 75, 224];
      accounts: [
        {
          name: 'vault';
          writable: true;
        },
        {
          name: 'vaultToken';
          writable: true;
        },
        {
          name: 'adminToken';
          writable: true;
        },
        {
          name: 'vaultSigner';
          pda: {
            seeds: [
              {
                kind: 'const';
                value: [118, 97, 117, 108, 116];
              },
              {
                kind: 'account';
                path: 'vault.game_id';
                account: 'gameVault';
              },
            ];
          };
        },
        {
          name: 'authority';
          signer: true;
        },
        {
          name: 'tokenProgram';
          address: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA';
        },
      ];
      args: [
        {
          name: 'amount';
          type: 'u64';
        },
      ];
    },
    {
      name: 'buyTicket';
      discriminator: [11, 24, 17, 193, 168, 116, 164, 169];
      accounts: [
        {
          name: 'vault';
          writable: true;
        },
        {
          name: 'userTicket';
          writable: true;
          pda: {
            seeds: [
              {
                kind: 'const';
                value: [116, 105, 99, 107, 101, 116];
              },
              {
                kind: 'account';
                path: 'vault';
              },
              {
                kind: 'account';
                path: 'user';
              },
            ];
          };
        },
        {
          name: 'userToken';
          writable: true;
        },
        {
          name: 'vaultToken';
          writable: true;
        },
        {
          name: 'user';
          writable: true;
          signer: true;
        },
        {
          name: 'tokenProgram';
          address: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA';
        },
        {
          name: 'systemProgram';
          address: '11111111111111111111111111111111';
        },
      ];
      args: [
        {
          name: 'amount';
          type: 'u64';
        },
      ];
    },
    {
      name: 'changeTokenMint';
      discriminator: [131, 157, 170, 11, 176, 212, 248, 239];
      accounts: [
        {
          name: 'vault';
          writable: true;
        },
        {
          name: 'authority';
          signer: true;
        },
      ];
      args: [
        {
          name: 'newMint';
          type: 'pubkey';
        },
      ];
    },
    {
      name: 'claimReward';
      discriminator: [149, 95, 181, 242, 94, 90, 158, 162];
      accounts: [
        {
          name: 'vault';
          writable: true;
        },
        {
          name: 'userTicket';
          writable: true;
        },
        {
          name: 'rewardMap';
        },
        {
          name: 'vaultToken';
          writable: true;
        },
        {
          name: 'userToken';
          writable: true;
        },
        {
          name: 'vaultSigner';
          pda: {
            seeds: [
              {
                kind: 'const';
                value: [118, 97, 117, 108, 116];
              },
              {
                kind: 'account';
                path: 'vault.game_id';
                account: 'gameVault';
              },
            ];
          };
        },
        {
          name: 'user';
          signer: true;
        },
        {
          name: 'tokenProgram';
          address: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA';
        },
      ];
      args: [];
    },
    {
      name: 'finalizeGame';
      discriminator: [203, 227, 3, 167, 186, 102, 76, 10];
      accounts: [
        {
          name: 'vault';
          writable: true;
        },
        {
          name: 'rewardMap';
          writable: true;
          pda: {
            seeds: [
              {
                kind: 'const';
                value: [114, 101, 119, 97, 114, 100, 95, 109, 97, 112];
              },
              {
                kind: 'account';
                path: 'vault';
              },
            ];
          };
        },
        {
          name: 'authority';
          writable: true;
          signer: true;
        },
        {
          name: 'systemProgram';
          address: '11111111111111111111111111111111';
        },
      ];
      args: [
        {
          name: 'rewards';
          type: {
            vec: {
              defined: {
                name: 'rewardEntry';
              };
            };
          };
        },
      ];
    },
    {
      name: 'initializeGameVault';
      discriminator: [150, 163, 248, 101, 237, 128, 208, 219];
      accounts: [
        {
          name: 'vault';
          writable: true;
          pda: {
            seeds: [
              {
                kind: 'const';
                value: [118, 97, 117, 108, 116];
              },
              {
                kind: 'arg';
                path: 'gameId';
              },
            ];
          };
        },
        {
          name: 'authority';
          writable: true;
          signer: true;
        },
        {
          name: 'tokenMint';
        },
        {
          name: 'systemProgram';
          address: '11111111111111111111111111111111';
        },
      ];
      args: [
        {
          name: 'gameId';
          type: 'u64';
        },
      ];
    },
  ];
  accounts: [
    {
      name: 'gameVault';
      discriminator: [152, 194, 238, 3, 140, 24, 51, 32];
    },
    {
      name: 'rewardMap';
      discriminator: [59, 134, 60, 69, 163, 241, 171, 72];
    },
    {
      name: 'userTicket';
      discriminator: [180, 163, 8, 176, 85, 62, 213, 128];
    },
  ];
  events: [
    {
      name: 'adminWithdrawn';
      discriminator: [12, 67, 18, 232, 19, 82, 237, 212];
    },
    {
      name: 'gameFinalized';
      discriminator: [29, 161, 173, 86, 207, 34, 220, 48];
    },
    {
      name: 'gameVaultInitialized';
      discriminator: [108, 6, 98, 249, 184, 26, 48, 135];
    },
    {
      name: 'rewardClaimed';
      discriminator: [49, 28, 87, 84, 158, 48, 229, 175];
    },
    {
      name: 'ticketPurchased';
      discriminator: [108, 59, 246, 95, 84, 145, 13, 71];
    },
    {
      name: 'tokenMintChanged';
      discriminator: [74, 127, 112, 239, 162, 80, 112, 51];
    },
  ];
  errors: [
    {
      code: 6000;
      name: 'invalidAmount';
      msg: 'Invalid ticket amount';
    },
    {
      code: 6001;
      name: 'alreadyWithdrawn';
      msg: 'Reward already withdrawn';
    },
    {
      code: 6002;
      name: 'withdrawNotEnabled';
      msg: 'Withdraw not enabled yet';
    },
    {
      code: 6003;
      name: 'alreadyFinalized';
      msg: 'Game already finalized';
    },
    {
      code: 6004;
      name: 'noReward';
      msg: 'No reward for this user';
    },
    {
      code: 6005;
      name: 'unauthorized';
      msg: 'Unauthorized access';
    },
  ];
  types: [
    {
      name: 'adminWithdrawn';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'gameId';
            type: 'u64';
          },
          {
            name: 'authority';
            type: 'pubkey';
          },
          {
            name: 'amount';
            type: 'u64';
          },
          {
            name: 'adminToken';
            type: 'pubkey';
          },
        ];
      };
    },
    {
      name: 'gameFinalized';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'gameId';
            type: 'u64';
          },
          {
            name: 'authority';
            type: 'pubkey';
          },
          {
            name: 'totalDeposit';
            type: 'u64';
          },
          {
            name: 'rewardCount';
            type: 'u64';
          },
          {
            name: 'rewardMap';
            type: 'pubkey';
          },
        ];
      };
    },
    {
      name: 'gameVault';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'gameId';
            type: 'u64';
          },
          {
            name: 'authority';
            type: 'pubkey';
          },
          {
            name: 'totalDeposit';
            type: 'u64';
          },
          {
            name: 'finalized';
            type: 'bool';
          },
          {
            name: 'withdrawEnabled';
            type: 'bool';
          },
          {
            name: 'tokenMint';
            type: 'pubkey';
          },
        ];
      };
    },
    {
      name: 'gameVaultInitialized';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'gameId';
            type: 'u64';
          },
          {
            name: 'authority';
            type: 'pubkey';
          },
          {
            name: 'tokenMint';
            type: 'pubkey';
          },
          {
            name: 'vault';
            type: 'pubkey';
          },
        ];
      };
    },
    {
      name: 'rewardClaimed';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'gameId';
            type: 'u64';
          },
          {
            name: 'user';
            type: 'pubkey';
          },
          {
            name: 'rewardAmount';
            type: 'u64';
          },
          {
            name: 'userTicket';
            type: 'pubkey';
          },
        ];
      };
    },
    {
      name: 'rewardEntry';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'user';
            type: 'pubkey';
          },
          {
            name: 'amount';
            type: 'u64';
          },
        ];
      };
    },
    {
      name: 'rewardMap';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'gameId';
            type: 'u64';
          },
          {
            name: 'rewards';
            type: {
              vec: {
                defined: {
                  name: 'rewardEntry';
                };
              };
            };
          },
        ];
      };
    },
    {
      name: 'ticketPurchased';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'gameId';
            type: 'u64';
          },
          {
            name: 'user';
            type: 'pubkey';
          },
          {
            name: 'amount';
            type: 'u64';
          },
          {
            name: 'totalDeposit';
            type: 'u64';
          },
          {
            name: 'userTicket';
            type: 'pubkey';
          },
        ];
      };
    },
    {
      name: 'tokenMintChanged';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'gameId';
            type: 'u64';
          },
          {
            name: 'authority';
            type: 'pubkey';
          },
          {
            name: 'oldMint';
            type: 'pubkey';
          },
          {
            name: 'newMint';
            type: 'pubkey';
          },
        ];
      };
    },
    {
      name: 'userTicket';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'gameId';
            type: 'u64';
          },
          {
            name: 'user';
            type: 'pubkey';
          },
          {
            name: 'amount';
            type: 'u64';
          },
          {
            name: 'hasWithdrawn';
            type: 'bool';
          },
        ];
      };
    },
  ];
};
