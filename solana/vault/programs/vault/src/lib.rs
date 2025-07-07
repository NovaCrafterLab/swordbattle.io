#![allow(unexpected_cfgs)]
#![allow(deprecated)]
use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Mint, Transfer};

declare_id!("JC8TvL6RdntRxEEzVjmAXzkAWD5HsCYREiSGXtU5c2tj");

#[program]
pub mod vault {
    use super::*;

    pub fn initialize_game_vault(
        ctx: Context<InitializeGameVault>,
        game_id: u64,
    ) -> Result<()> {
        let vault = &mut ctx.accounts.vault;
        vault.game_id = game_id;
        vault.authority = ctx.accounts.authority.key();
        vault.total_deposit = 0;
        vault.finalized = false;
        vault.withdraw_enabled = false;
        vault.token_mint = ctx.accounts.token_mint.key();
        
        emit!(GameVaultInitialized {
            game_id,
            authority: ctx.accounts.authority.key(),
            token_mint: ctx.accounts.token_mint.key(),
            vault: vault.key(),
        });
        
        Ok(())
    }

    pub fn buy_ticket(ctx: Context<BuyTicket>, amount: u64) -> Result<()> {
        require!(amount > 0, GameError::InvalidAmount);

        let vault = &mut ctx.accounts.vault;
        let user_ticket = &mut ctx.accounts.user_ticket;

        // Transfer token to vault
        let cpi_accounts = Transfer {
            from: ctx.accounts.user_token.to_account_info(),
            to: ctx.accounts.vault_token.to_account_info(),
            authority: ctx.accounts.user.to_account_info(),
        };
        let cpi_ctx = CpiContext::new(ctx.accounts.token_program.to_account_info(), cpi_accounts);
        token::transfer(cpi_ctx, amount)?;

        // Update vault + user ticket
        vault.total_deposit += amount;
        user_ticket.user = ctx.accounts.user.key();
        user_ticket.amount += amount;
        user_ticket.has_withdrawn = false;
        user_ticket.game_id = vault.game_id;

        emit!(TicketPurchased {
            game_id: vault.game_id,
            user: ctx.accounts.user.key(),
            amount,
            total_deposit: vault.total_deposit,
            user_ticket: user_ticket.key(),
        });

        Ok(())
    }

    pub fn finalize_game(
        ctx: Context<FinalizeGame>,
        rewards: Vec<(Pubkey, u64)>,
    ) -> Result<()> {
        let vault = &mut ctx.accounts.vault;

        require!(!vault.finalized, GameError::AlreadyFinalized);
        require!(vault.authority == ctx.accounts.authority.key(), GameError::Unauthorized);
        
        vault.finalized = true;
        vault.withdraw_enabled = true;

        // Store rewards in the reward map account
        let reward_map = &mut ctx.accounts.reward_map;
        reward_map.game_id = vault.game_id;
        for (user_key, reward) in rewards.iter() {
            reward_map.rewards.insert(*user_key, *reward);
        }

        emit!(GameFinalized {
            game_id: vault.game_id,
            authority: ctx.accounts.authority.key(),
            total_deposit: vault.total_deposit,
            reward_count: rewards.len() as u64,
            reward_map: reward_map.key(),
        });

        Ok(())
    }

    pub fn claim_reward(ctx: Context<ClaimReward>) -> Result<()> {
        let vault = &ctx.accounts.vault;
        let user_ticket = &mut ctx.accounts.user_ticket;
        let reward_map = &ctx.accounts.reward_map;

        require!(vault.withdraw_enabled, GameError::WithdrawNotEnabled);
        require!(!user_ticket.has_withdrawn, GameError::AlreadyWithdrawn);

        let reward = reward_map.rewards.get(&ctx.accounts.user.key())
            .ok_or(GameError::NoReward)?;

        // Transfer token from vault to user
        let cpi_accounts = Transfer {
            from: ctx.accounts.vault_token.to_account_info(),
            to: ctx.accounts.user_token.to_account_info(),
            authority: ctx.accounts.vault_signer.to_account_info(),
        };
        let cpi_ctx = CpiContext::new(ctx.accounts.token_program.to_account_info(), cpi_accounts);
        token::transfer(cpi_ctx, *reward)?;

        user_ticket.has_withdrawn = true;

        emit!(RewardClaimed {
            game_id: vault.game_id,
            user: ctx.accounts.user.key(),
            reward_amount: *reward,
            user_ticket: user_ticket.key(),
        });

        Ok(())
    }

    pub fn admin_withdraw(ctx: Context<AdminWithdraw>, amount: u64) -> Result<()> {
        let vault = &ctx.accounts.vault;
        
        require!(vault.authority == ctx.accounts.authority.key(), GameError::Unauthorized);
        require!(amount > 0, GameError::InvalidAmount);

        // Transfer token from vault to admin
        let cpi_accounts = Transfer {
            from: ctx.accounts.vault_token.to_account_info(),
            to: ctx.accounts.admin_token.to_account_info(),
            authority: ctx.accounts.vault_signer.to_account_info(),
        };
        let cpi_ctx = CpiContext::new(ctx.accounts.token_program.to_account_info(), cpi_accounts);
        token::transfer(cpi_ctx, amount)?;

        emit!(AdminWithdrawn {
            game_id: vault.game_id,
            authority: ctx.accounts.authority.key(),
            amount,
            admin_token: ctx.accounts.admin_token.key(),
        });

        Ok(())
    }

    pub fn change_token_mint(ctx: Context<ChangeTokenMint>, new_mint: Pubkey) -> Result<()> {
        let vault = &mut ctx.accounts.vault;
        
        require!(vault.authority == ctx.accounts.authority.key(), GameError::Unauthorized);
        require!(!vault.finalized, GameError::AlreadyFinalized);
        
        let old_mint = vault.token_mint;
        vault.token_mint = new_mint;

        emit!(TokenMintChanged {
            game_id: vault.game_id,
            authority: ctx.accounts.authority.key(),
            old_mint,
            new_mint,
        });

        Ok(())
    }
}

#[account]
pub struct GameVault {
    pub game_id: u64,
    pub authority: Pubkey,
    pub total_deposit: u64,
    pub finalized: bool,
    pub withdraw_enabled: bool,
    pub token_mint: Pubkey,
}

#[account]
pub struct UserTicket {
    pub game_id: u64,
    pub user: Pubkey,
    pub amount: u64,
    pub has_withdrawn: bool,
}

#[account]
pub struct RewardMap {
    pub game_id: u64,
    pub rewards: std::collections::HashMap<Pubkey, u64>,
}

#[event]
pub struct GameVaultInitialized {
    pub game_id: u64,
    pub authority: Pubkey,
    pub token_mint: Pubkey,
    pub vault: Pubkey,
}

#[event]
pub struct TicketPurchased {
    pub game_id: u64,
    pub user: Pubkey,
    pub amount: u64,
    pub total_deposit: u64,
    pub user_ticket: Pubkey,
}

#[event]
pub struct GameFinalized {
    pub game_id: u64,
    pub authority: Pubkey,
    pub total_deposit: u64,
    pub reward_count: u64,
    pub reward_map: Pubkey,
}

#[event]
pub struct RewardClaimed {
    pub game_id: u64,
    pub user: Pubkey,
    pub reward_amount: u64,
    pub user_ticket: Pubkey,
}

#[event]
pub struct AdminWithdrawn {
    pub game_id: u64,
    pub authority: Pubkey,
    pub amount: u64,
    pub admin_token: Pubkey,
}

#[event]
pub struct TokenMintChanged {
    pub game_id: u64,
    pub authority: Pubkey,
    pub old_mint: Pubkey,
    pub new_mint: Pubkey,
}

#[error_code]
pub enum GameError {
    #[msg("Invalid ticket amount")]
    InvalidAmount,
    #[msg("Reward already withdrawn")]
    AlreadyWithdrawn,
    #[msg("Withdraw not enabled yet")]
    WithdrawNotEnabled,
    #[msg("Game already finalized")]
    AlreadyFinalized,
    #[msg("No reward for this user")]
    NoReward,
    #[msg("Unauthorized access")]
    Unauthorized,
}

#[derive(Accounts)]
#[instruction(game_id: u64)]
pub struct InitializeGameVault<'info> {
    #[account(init, seeds = [b"vault", game_id.to_le_bytes().as_ref()], bump, payer = authority, space = 8 + 8 + 32 + 8 + 1 + 1 + 32)]
    pub vault: Account<'info, GameVault>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub token_mint: Account<'info, Mint>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct BuyTicket<'info> {
    #[account(mut)]
    pub vault: Account<'info, GameVault>,
    #[account(
        init_if_needed,
        seeds = [b"ticket", vault.key().as_ref(), user.key().as_ref()],
        bump,
        payer = user,
        space = 8 + 8 + 32 + 8 + 1
    )]
    pub user_ticket: Account<'info, UserTicket>,
    #[account(mut)]
    pub user_token: Account<'info, TokenAccount>,
    #[account(mut)]
    pub vault_token: Account<'info, TokenAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct FinalizeGame<'info> {
    #[account(mut)]
    pub vault: Account<'info, GameVault>,
    #[account(
        init,
        seeds = [b"reward_map", vault.key().as_ref()],
        bump,
        payer = authority,
        space = 8 + 8 + 4 + (32 + 8) * 100 // Space for up to 100 rewards
    )]
    pub reward_map: Account<'info, RewardMap>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ClaimReward<'info> {
    #[account(mut)]
    pub vault: Account<'info, GameVault>,
    #[account(mut)]
    pub user_ticket: Account<'info, UserTicket>,
    pub reward_map: Account<'info, RewardMap>,
    #[account(mut)]
    pub vault_token: Account<'info, TokenAccount>,
    #[account(mut)]
    pub user_token: Account<'info, TokenAccount>,
    /// CHECK: This is the vault signer PDA
    pub vault_signer: UncheckedAccount<'info>,
    pub user: Signer<'info>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct AdminWithdraw<'info> {
    #[account(mut)]
    pub vault: Account<'info, GameVault>,
    #[account(mut)]
    pub vault_token: Account<'info, TokenAccount>,
    #[account(mut)]
    pub admin_token: Account<'info, TokenAccount>,
    /// CHECK: This is the vault signer PDA
    pub vault_signer: UncheckedAccount<'info>,
    pub authority: Signer<'info>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct ChangeTokenMint<'info> {
    #[account(mut)]
    pub vault: Account<'info, GameVault>,
    pub authority: Signer<'info>,
}
