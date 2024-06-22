// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor';
import { PublicKey } from '@solana/web3.js';
import type { FairLauncher } from '../target/types/fairlauncher.fun';
import { IDL as FairLauncherIDL } from '../target/types/fairlauncher.fun';

// Re-export the generated IDL and type
export { FairLauncher, FairLauncherIDL };

// The programId is imported from the program IDL.
export const FAIRLAUNCHER_PROGRAM_ID = new PublicKey(FairLauncherIDL.metadata.address);

// This is a helper function to get the FairLauncher Anchor program.
export function getFairLauncherProgram(provider: AnchorProvider) {
  return new Program<FairLauncher>(FairLauncherIDL, FAIRLAUNCHER_PROGRAM_ID, provider);
}
