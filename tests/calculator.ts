import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { Calculator } from "../target/types/calculator";
import { SystemProgram } from '@solana/web3.js';
import assert from 'assert';

describe("calculator", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Calculator as Program<Calculator>;
  const calculator = anchor.web3.Keypair.generate();

  it("Is initialized!", async () => {
    await program.rpc.initialize({
      accounts: {
        calculator: calculator.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId
      },
      signers: [calculator]
    })
  });

  it("Can add", async () => {
    await program.rpc.add(new anchor.BN(1), new anchor.BN(2), {
      accounts: {
        calculator: calculator.publicKey
      }
    });

    const account = await program.account.calculator.fetch(calculator.publicKey);
    assert.ok(account.result.eq(new anchor.BN(3)));
  });

  it("Can subtract", async () => {
    await program.rpc.sub(new anchor.BN(3), new anchor.BN(2), {
      accounts: {
        calculator: calculator.publicKey
      }
    });

    const account = await program.account.calculator.fetch(calculator.publicKey);
    assert.ok(account.result.eq(new anchor.BN(1)));
  });

  it("Can multiply", async () => {
    await program.rpc.mul(new anchor.BN(3), new anchor.BN(2), {
      accounts: {
        calculator: calculator.publicKey
      }
    });

    const account = await program.account.calculator.fetch(calculator.publicKey);
    assert.ok(account.result.eq(new anchor.BN(6)));
  });

  it("Can divide", async () => {
    await program.rpc.div(new anchor.BN(9), new anchor.BN(2), {
      accounts: {
        calculator: calculator.publicKey
      }
    });

    const account = await program.account.calculator.fetch(calculator.publicKey);
    assert.ok(account.result.eq(new anchor.BN(4)));
    assert.ok(account.remainder.eq(new anchor.BN(1)));
  });
});
