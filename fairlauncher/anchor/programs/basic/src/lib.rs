use anchor_lang::prelude::*;

declare_id!("7fWLT8k6me1WJcRuMxSBaz4Fo9H4fDbdgwHaVmyKEBtw");

#[program]
pub mod basic {
    use super::*;

    pub fn greet(_ctx: Context<Initialize>) -> Result<()> {
        msg!("GM!");
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
