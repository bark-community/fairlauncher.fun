import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { FairLauncher } from '../target/types/fairlauncher.fun';

describe('fairlauncher.fun', () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.FairLauncher as Program<FairLauncher>;

  it('should run the program', async () => {
    // Add your test here.
    const tx = await program.methods.fairlauncher.fun().rpc();
    console.log('Your transaction signature', tx);
  });
});
