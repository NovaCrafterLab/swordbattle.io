use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Mint, Transfer, CloseAccount, InitializeAccount};

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

        Ok(())
    }

    pub fn finalize_game(
        ctx: Context<FinalizeGame>,
        rewards: Vec<(Pubkey, u64)>,
    ) -> Result<()> {
        let vault = &mut ctx.accounts.vault;

        require!(!vault.finalized, GameError::AlreadyFinalized);
        vault.finalized = true;
        vault.withdraw_enabled = true;

        for (user_key, reward) in rewards.iter() {
            ctx.accounts.reward_map.insert(*user_key, *reward);
        }

        Ok(())
    }

    pub fn claim_reward(ctx: Context<ClaimReward>) -> Result<()> {
        let vault = &ctx.accounts.vault;
        let user_ticket = &mut ctx.accounts.user_ticket;

        require!(vault.withdraw_enabled, GameError::WithdrawNotEnabled);
        require!(!user_ticket.has_withdrawn, GameError::AlreadyWithdrawn);

        let reward = ctx.accounts.reward_map.get(&ctx.accounts.user.key())
            .ok_or(GameError::NoReward)?;

        let seeds = &[
            b"vault",
            &vault.game_id.to_le_bytes(),
            &[ctx.bumps.get("vault").unwrap().clone()],
        ];
        let signer = &[&seeds[..]];

        // Transfer token from vault to user
        let cpi_accounts = Transfer {
            from: ctx.accounts.vault_token.to_account_info(),
            to: ctx.accounts.user_token.to_account_info(),
            authority: ctx.accounts.vault_signer.to_account_info(),
        };
        let cpi_ctx = CpiContext::new_with_signer(ctx.accounts.token_program.to_account_info(), cpi_accounts, signer);
        token::transfer(cpi_ctx, *reward)?;

        user_ticket.has_withdrawn = true;
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
}

#[account]
pub struct UserTicket {
    pub game_id: u64,
    pub user: Pubkey,
    pub amount: u64,
    pub has_withdrawn: bool,
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
}

#[derive(Accounts)]
pub struct InitializeGameVault<'info> {
    #[account(init, seeds = [b"vault", game_id.to_le_bytes().as_ref()], bump, payer = authority, space = 8 + 64)]
    pub vault: Account<'info, GameVault>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct BuyTicket<'info> {
    #[account(mut)]
    pub vault: Account<'info, GameVault>,
    #[account(mut)]
    pub user_ticket: Account<'info, UserTicket>,
    #[account(mut)]
    pub user_token: Account<'info, TokenAccount>,
    #[account(mut)]
    pub vault_token: Account<'info, TokenAccount>,
    pub user: Signer<'info>,
    pub token_program: Program<'info, Token>,
}
