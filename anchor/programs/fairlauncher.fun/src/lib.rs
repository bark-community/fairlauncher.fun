use anchor_lang::prelude::*;
use anchor_lang::solana_program::program::invoke;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer, SetAuthority};
use spl_token::instruction::AuthorityType;

declare_id!("FLFDqRwqrTbt1YQcuRGY7J112TCmAesCKkqUsRtDPWEn");

#[program]
pub mod fairlauncher {
    use super::*;

    /// Initializes the Launch account with default values.
    pub fn initialize(ctx: Context<Initialize>) -> ProgramResult {
        let launch = &mut ctx.accounts.launch;
        launch.owner = *ctx.accounts.user.key;
        launch.status = LaunchStatus::Initialized;
        launch.created_at = Clock::get().unwrap().unix_timestamp;
        Ok(())
    }

    /// Creates a new launch with the specified parameters.
    pub fn create_launch(
        ctx: Context<CreateLaunch>, 
        amount: u64, 
        token_mint: Pubkey, 
        start_time: i64, 
        end_time: i64
    ) -> ProgramResult {
        let launch = &mut ctx.accounts.launch;
        require!(start_time > Clock::get().unwrap().unix_timestamp, CustomError::InvalidStartTime);
        require!(end_time > start_time, CustomError::InvalidEndTime);
        launch.amount = amount;
        launch.launcher = *ctx.accounts.user.key;
        launch.token_mint = token_mint;
        launch.status = LaunchStatus::Created;
        launch.start_time = start_time;
        launch.end_time = end_time;
        Ok(())
    }

    /// Launches the token transfer according to the launch details.
    pub fn launch(ctx: Context<Launch>) -> ProgramResult {
        let launch = &mut ctx.accounts.launch;
        let current_time = Clock::get().unwrap().unix_timestamp;
        require!(launch.status == LaunchStatus::Created, CustomError::InvalidLaunchStatus);
        require!(current_time >= launch.start_time, CustomError::LaunchNotStarted);
        require!(current_time <= launch.end_time, CustomError::LaunchEnded);

        let cpi_accounts = Transfer {
            from: ctx.accounts.from.to_account_info(),
            to: ctx.accounts.to.to_account_info(),
            authority: ctx.accounts.user.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        token::transfer(cpi_ctx, launch.amount)?;

        launch.status = LaunchStatus::Launched;
        emit!(LaunchEvent {
            launcher: *ctx.accounts.user.key,
            status: launch.status.clone(),
            timestamp: current_time,
        });
        Ok(())
    }

    /// Cancels the launch before it is launched.
    pub fn cancel_launch(ctx: Context<CancelLaunch>) -> ProgramResult {
        let launch = &mut ctx.accounts.launch;
        require!(launch.status == LaunchStatus::Created, CustomError::InvalidLaunchStatus);
        require!(launch.launcher == *ctx.accounts.user.key, CustomError::Unauthorized);

        launch.status = LaunchStatus::Cancelled;
        emit!(LaunchEvent {
            launcher: *ctx.accounts.user.key,
            status: launch.status.clone(),
            timestamp: Clock::get().unwrap().unix_timestamp,
        });
        Ok(())
    }

    /// Updates the details of an existing launch.
    pub fn update_launch_details(
        ctx: Context<UpdateLaunchDetails>, 
        amount: Option<u64>, 
        start_time: Option<i64>, 
        end_time: Option<i64>
    ) -> ProgramResult {
        let launch = &mut ctx.accounts.launch;
        require!(launch.launcher == *ctx.accounts.user.key, CustomError::Unauthorized);
        if let Some(amount) = amount {
            launch.amount = amount;
        }
        if let Some(start_time) = start_time {
            require!(start_time > Clock::get().unwrap().unix_timestamp, CustomError::InvalidStartTime);
            launch.start_time = start_time;
        }
        if let Some(end_time) = end_time {
            require!(end_time > launch.start_time, CustomError::InvalidEndTime);
            launch.end_time = end_time;
        }
        emit!(LaunchEvent {
            launcher: *ctx.accounts.user.key,
            status: launch.status.clone(),
            timestamp: Clock::get().unwrap().unix_timestamp,
        });
        Ok(())
    }

    /// Claims the tokens for a launched campaign.
    pub fn claim_tokens(ctx: Context<ClaimTokens>) -> ProgramResult {
        let launch = &mut ctx.accounts.launch;
        require!(launch.status == LaunchStatus::Launched, CustomError::InvalidLaunchStatus);
        require!(ctx.accounts.launch.token_mint == ctx.accounts.from.mint, CustomError::InvalidTokenMint);

        let cpi_accounts = Transfer {
            from: ctx.accounts.from.to_account_info(),
            to: ctx.accounts.to.to_account_info(),
            authority: ctx.accounts.launch.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        token::transfer(cpi_ctx, launch.amount)?;

        emit!(ClaimEvent {
            claimer: *ctx.accounts.user.key,
            amount: launch.amount,
            timestamp: Clock::get().unwrap().unix_timestamp,
        });
        Ok(())
    }

    /// Sets a new authority for the token account.
    pub fn set_authority(ctx: Context<SetAuthorityContext>, new_authority: Pubkey) -> ProgramResult {
        let cpi_accounts = SetAuthority {
            account_or_mint: ctx.accounts.token_account.to_account_info(),
            current_authority: ctx.accounts.current_authority.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        token::set_authority(
            cpi_ctx,
            AuthorityType::AccountOwner,
            Some(new_authority),
        )?;
        emit!(SetAuthorityEvent {
            old_authority: *ctx.accounts.current_authority.key,
            new_authority,
            timestamp: Clock::get().unwrap().unix_timestamp,
        });
        Ok(())
    }

    /// Distributes rewards after the launch has ended.
    pub fn distribute_rewards(ctx: Context<DistributeRewards>, reward_amount: u64) -> ProgramResult {
        let current_time = Clock::get().unwrap().unix_timestamp;
        let launch = &ctx.accounts.launch;
        require!(current_time > launch.end_time, CustomError::LaunchNotEnded);
        require!(ctx.accounts.user.key == &launch.owner, CustomError::Unauthorized);

        let cpi_accounts = Transfer {
            from: ctx.accounts.from.to_account_info(),
            to: ctx.accounts.to.to_account_info(),
            authority: ctx.accounts.user.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        token::transfer(cpi_ctx, reward_amount)?;

        emit!(RewardDistributedEvent {
            distributor: *ctx.accounts.user.key,
            amount: reward_amount,
            timestamp: current_time,
        });
        Ok(())
    }

    /// Pauses an active launch.
    pub fn pause_launch(ctx: Context<PauseLaunch>) -> ProgramResult {
        let launch = &mut ctx.accounts.launch;
        require!(launch.status == LaunchStatus::Created, CustomError::InvalidLaunchStatus);
        require!(launch.launcher == *ctx.accounts.user.key, CustomError::Unauthorized);

        launch.status = LaunchStatus::Paused;
        emit!(LaunchEvent {
            launcher: *ctx.accounts.user.key,
            status: launch.status.clone(),
            timestamp: Clock::get().unwrap().unix_timestamp,
        });
        Ok(())
    }

    /// Resumes a paused launch.
    pub fn resume_launch(ctx: Context<ResumeLaunch>) -> ProgramResult {
        let launch = &mut ctx.accounts.launch;
        require!(launch.status == LaunchStatus::Paused, CustomError::InvalidLaunchStatus);
        require!(launch.launcher == *ctx.accounts.user.key, CustomError::Unauthorized);

        launch.status = LaunchStatus::Created;
        emit!(LaunchEvent {
            launcher: *ctx.accounts.user.key,
            status: launch.status.clone(),
            timestamp: Clock::get().unwrap().unix_timestamp,
        });
        Ok(())
    }

    /// Withdraws funds from the launch account.
    pub fn withdraw_funds(ctx: Context<WithdrawFunds>, amount: u64) -> ProgramResult {
        let launch = &mut ctx.accounts.launch;
        require!(launch.owner == *ctx.accounts.user.key, CustomError::Unauthorized);
        require!(amount <= launch.amount, CustomError::InsufficientFunds);

        let cpi_accounts = Transfer {
            from: ctx.accounts.launch.to_account_info(),
            to: ctx.accounts.user.to_account_info(),
            authority: ctx.accounts.launch.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        token::transfer(cpi_ctx, amount)?;

        launch.amount -= amount;
        emit!(WithdrawEvent {
            owner: *ctx.accounts.user.key,
            amount,
            timestamp: Clock::get().unwrap().unix_timestamp,
        });
        Ok(())
    }

    /// Finalizes the launch after it has ended.
    pub fn finalize_launch(ctx: Context<FinalizeLaunch>) -> ProgramResult {
        let launch = &mut ctx.accounts.launch;
        require!(launch.status == LaunchStatus::Launched, CustomError::InvalidLaunchStatus);
        require!(Clock::get().unwrap().unix_timestamp > launch.end_time, CustomError::LaunchNotEnded);

        launch.status = LaunchStatus::Finalized;
        emit!(LaunchEvent {
            launcher: launch.launcher,
            status: launch.status.clone(),
            timestamp: Clock::get().unwrap().unix_timestamp,
        });
        Ok(())
    }

    /// Distributes remaining tokens after the launch is finalized.
    pub fn distribute_remaining_tokens(ctx: Context<DistributeRemainingTokens>, amount: u64) -> ProgramResult {
        let launch = &mut ctx.accounts.launch;
        require!(launch.status == LaunchStatus::Finalized, CustomError::InvalidLaunchStatus);
        require!(ctx.accounts.user.key == &launch.owner, CustomError::Unauthorized);

        let cpi_accounts = Transfer {
            from: ctx.accounts.launch.to_account_info(),
            to: ctx.accounts.to.to_account_info(),
            authority: ctx.accounts.launch.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        token::transfer(cpi_ctx, amount)?;

        emit!(RemainingTokensDistributedEvent {
            distributor: *ctx.accounts.user.key,
            amount,
            timestamp: Clock::get().unwrap().unix_timestamp,
        });
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = user, space = 8 + 128)]
    pub launch: Account<'info, Launch>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CreateLaunch<'info> {
    #[account(mut)]
    pub launch: Account<'info, Launch>,
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(mut)]
    pub from: Account<'info, TokenAccount>,
    #[account(mut)]
    pub to: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
    pub token_mint: Account<'info, Mint>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Launch<'info> {
    #[account(mut)]
    pub launch: Account<'info, Launch>,
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(mut)]
    pub from: Account<'info, TokenAccount>,
    #[account(mut)]
    pub to: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct CancelLaunch<'info> {
    #[account(mut)]
    pub launch: Account<'info, Launch>,
    #[account(mut)]
    pub user: Signer<'info>,
}

#[derive(Accounts)]
pub struct UpdateLaunchDetails<'info> {
    #[account(mut)]
    pub launch: Account<'info, Launch>,
    #[account(mut)]
    pub user: Signer<'info>,
}

#[derive(Accounts)]
pub struct ClaimTokens<'info> {
    #[account(mut)]
    pub launch: Account<'info, Launch>,
    #[account(mut)]
    pub from: Account<'info, TokenAccount>,
    #[account(mut)]
    pub to: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct SetAuthorityContext<'info> {
    #[account(mut)]
    pub token_account: Account<'info, TokenAccount>,
    pub current_authority: Signer<'info>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct DistributeRewards<'info> {
    #[account(mut)]
    pub launch: Account<'info, Launch>,
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(mut)]
    pub from: Account<'info, TokenAccount>,
    #[account(mut)]
    pub to: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct PauseLaunch<'info> {
    #[account(mut)]
    pub launch: Account<'info, Launch>,
    #[account(mut)]
    pub user: Signer<'info>,
}

#[derive(Accounts)]
pub struct ResumeLaunch<'info> {
    #[account(mut)]
    pub launch: Account<'info, Launch>,
    #[account(mut)]
    pub user: Signer<'info>,
}

#[derive(Accounts)]
pub struct WithdrawFunds<'info> {
    #[account(mut)]
    pub launch: Account<'info, Launch>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct FinalizeLaunch<'info> {
    #[account(mut)]
    pub launch: Account<'info, Launch>,
    #[account(mut)]
    pub user: Signer<'info>,
}

#[derive(Accounts)]
pub struct DistributeRemainingTokens<'info> {
    #[account(mut)]
    pub launch: Account<'info, Launch>,
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(mut)]
    pub to: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
}

#[account]
pub struct Launch {
    pub owner: Pubkey,
    pub status: LaunchStatus,
    pub created_at: i64,
    pub amount: u64,
    pub launcher: Pubkey,
    pub token_mint: Pubkey,
    pub start_time: i64,
    pub end_time: i64,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum LaunchStatus {
    Initialized,
    Created,
    Launched,
    Cancelled,
    Paused,
    Finalized,
}

#[error]
pub enum CustomError {
    #[msg("Invalid start time.")]
    InvalidStartTime,
    #[msg("Invalid end time.")]
    InvalidEndTime,
    #[msg("Invalid launch status.")]
    InvalidLaunchStatus,
    #[msg("Launch has not started.")]
    LaunchNotStarted,
    #[msg("Launch has ended.")]
    LaunchEnded,
    #[msg("Unauthorized.")]
    Unauthorized,
    #[msg("Launch has not ended.")]
    LaunchNotEnded,
    #[msg("Insufficient funds.")]
    InsufficientFunds,
    #[msg("Invalid token mint.")]
    InvalidTokenMint,
}

#[event]
pub struct LaunchEvent {
    pub launcher: Pubkey,
    pub status: LaunchStatus,
    pub timestamp: i64,
}

#[event]
pub struct ClaimEvent {
    pub claimer: Pubkey,
    pub amount: u64,
    pub timestamp: i64,
}

#[event]
pub struct SetAuthorityEvent {
    pub old_authority: Pubkey,
    pub new_authority: Pubkey,
    pub timestamp: i64,
}

#[event]
pub struct RewardDistributedEvent {
    pub distributor: Pubkey,
    pub amount: u64,
    pub timestamp: i64,
}

#[event]
pub struct WithdrawEvent {
    pub owner: Pubkey,
    pub amount: u64,
    pub timestamp: i64,
}

#[event]
pub struct RemainingTokensDistributedEvent {
    pub distributor: Pubkey,
    pub amount: u64,
    pub timestamp: i64,
}

// Unit tests
#[cfg(test)]
mod tests {
    use super::*;
    use anchor_lang::prelude::*;
    use anchor_lang::solana_program::clock::Clock;
    use anchor_lang::solana_program::pubkey::Pubkey;
    use anchor_lang::solana_program::sysvar::Sysvar;

    #[test]
    fn test_initialize() {
        let program_id = Pubkey::default();
        let launch = Pubkey::default();
        let user = Pubkey::default();
        let ctx = Context::new(program_id, Initialize {
            launch,
            user,
            system_program: Program::default(),
        });

        let result = initialize(ctx);
        assert!(result.is_ok());
    }

    #[test]
    fn test_create_launch() {
        let program_id = Pubkey::default();
        let launch = Pubkey::default();
        let user = Pubkey::default();
        let from = Pubkey::default();
        let to = Pubkey::default();
        let token_program = Pubkey::default();
        let token_mint = Pubkey::default();
        let ctx = Context::new(program_id, CreateLaunch {
            launch,
            user,
            from,
            to,
            token_program,
            token_mint,
            system_program: Program::default(),
        });

        let result = create_launch(ctx, 1000, Pubkey::default(), Clock::get().unwrap().unix_timestamp + 100, Clock::get().unwrap().unix_timestamp + 200);
        assert!(result.is_ok());
    }

    #[test]
    fn test_launch() {
        let program_id = Pubkey::default();
        let launch = Pubkey::default();
        let user = Pubkey::default();
        let from = Pubkey::default();
        let to = Pubkey::default();
        let token_program = Pubkey::default();
        let ctx = Context::new(program_id, Launch {
            launch,
            user,
            from,
            to,
            token_program,
        });

        let result = launch(ctx);
        assert!(result.is_ok());
    }

    #[test]
    fn test_cancel_launch() {
        let program_id = Pubkey::default();
        let launch = Pubkey::default();
        let user = Pubkey::default();
        let ctx = Context::new(program_id, CancelLaunch {
            launch,
            user,
        });

        let result = cancel_launch(ctx);
        assert!(result.is_ok());
    }

    #[test]
    fn test_update_launch_details() {
        let program_id = Pubkey::default();
        let launch = Pubkey::default();
        let user = Pubkey::default();
        let ctx = Context::new(program_id, UpdateLaunchDetails {
            launch,
            user,
        });

        let result = update_launch_details(ctx, Some(2000), Some(Clock::get().unwrap().unix_timestamp + 150), Some(Clock::get().unwrap().unix_timestamp + 250));
        assert!(result.is_ok());
    }

    #[test]
    fn test_claim_tokens() {
        let program_id = Pubkey::default();
        let launch = Pubkey::default();
        let from = Pubkey::default();
        let to = Pubkey::default();
        let token_program = Pubkey::default();
        let ctx = Context::new(program_id, ClaimTokens {
            launch,
            from,
            to,
            token_program,
        });

        let result = claim_tokens(ctx);
        assert!(result.is_ok());
    }

    #[test]
    fn test_set_authority() {
        let program_id = Pubkey::default();
        let token_account = Pubkey::default();
        let current_authority = Pubkey::default();
        let token_program = Pubkey::default();
        let ctx = Context::new(program_id, SetAuthorityContext {
            token_account,
            current_authority,
            token_program,
        });

        let result = set_authority(ctx, Pubkey::default());
        assert!(result.is_ok());
    }

    #[test]
    fn test_distribute_rewards() {
        let program_id = Pubkey::default();
        let launch = Pubkey::default();
        let user = Pubkey::default();
        let from = Pubkey::default();
        let to = Pubkey::default();
        let token_program = Pubkey::default();
        let ctx = Context::new(program_id, DistributeRewards {
            launch,
            user,
            from,
            to,
            token_program,
        });

        let result = distribute_rewards(ctx, 500);
        assert!(result.is_ok());
    }

    #[test]
    fn test_pause_launch() {
        let program_id = Pubkey::default();
        let launch = Pubkey::default();
        let user = Pubkey::default();
        let ctx = Context::new(program_id, PauseLaunch {
            launch,
            user,
        });

        let result = pause_launch(ctx);
        assert!(result.is_ok());
    }

    #[test]
    fn test_resume_launch() {
        let program_id = Pubkey::default();
        let launch = Pubkey::default();
        let user = Pubkey::default();
        let ctx = Context::new(program_id, ResumeLaunch {
            launch,
            user,
        });

        let result = resume_launch(ctx);
        assert!(result.is_ok());
    }

    #[test]
    fn test_withdraw_funds() {
        let program_id = Pubkey::default();
        let launch = Pubkey::default();
        let user = Pubkey::default();
        let token_program = Pubkey::default();
        let ctx = Context::new(program_id, WithdrawFunds {
            launch,
            user,
            token_program,
        });

        let result = withdraw_funds(ctx, 300);
        assert!(result.is_ok());
    }

    #[test]
    fn test_finalize_launch() {
        let program_id = Pubkey::default();
        let launch = Pubkey::default();
        let user = Pubkey::default();
        let ctx = Context::new(program_id, FinalizeLaunch {
            launch,
            user,
        });

        let result = finalize_launch(ctx);
        assert!(result.is_ok());
    }

    #[test]
    fn test_distribute_remaining_tokens() {
        let program_id = Pubkey::default();
        let launch = Pubkey::default();
        let user = Pubkey::default();
        let to = Pubkey::default();
        let token_program = Pubkey::default();
        let ctx = Context::new(program_id, DistributeRemainingTokens {
            launch,
            user,
            to,
            token_program,
        });

        let result = distribute_remaining_tokens(ctx, 100);
        assert!(result.is_ok());
    }
}
