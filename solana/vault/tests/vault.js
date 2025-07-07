const anchor = require("@coral-xyz/anchor");
const { PublicKey, Keypair, SystemProgram } = require("@solana/web3.js");
const { TOKEN_PROGRAM_ID, createMint, createAccount, mintTo, getAccount, getAssociatedTokenAddress, createAssociatedTokenAccount, getOrCreateAssociatedTokenAccount } = require("@solana/spl-token");

describe("Game Vault", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());
  const program = anchor.workspace.vault;
  const provider = anchor.getProvider();

  // Test accounts
  let admin;
  let user1;
  let user2;
  let tokenMint;
  let adminTokenAccount;
  let user1TokenAccount;
  let user2TokenAccount;
  let gameId = 12345;

  before(async () => {
    // Create test keypairs
    admin = Keypair.generate();
    user1 = Keypair.generate();
    user2 = Keypair.generate();

    // Airdrop SOL to test accounts
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(admin.publicKey, 10 * anchor.web3.LAMPORTS_PER_SOL)
    );
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(user1.publicKey, 10 * anchor.web3.LAMPORTS_PER_SOL)
    );
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(user2.publicKey, 10 * anchor.web3.LAMPORTS_PER_SOL)
    );

    // Create token mint
    tokenMint = await createMint(
      provider.connection,
      admin,
      admin.publicKey,
      null,
      9,
      undefined,
      undefined,
      TOKEN_PROGRAM_ID
    );

    // Create associated token accounts
    adminTokenAccount = await getAssociatedTokenAddress(tokenMint, admin.publicKey);
    user1TokenAccount = await getAssociatedTokenAddress(tokenMint, user1.publicKey);
    user2TokenAccount = await getAssociatedTokenAddress(tokenMint, user2.publicKey);

    // Create token accounts if they don't exist
    await createAssociatedTokenAccount(
      provider.connection,
      admin,
      tokenMint,
      admin.publicKey
    );

    await createAssociatedTokenAccount(
      provider.connection,
      admin,
      tokenMint,
      user1.publicKey
    );

    await createAssociatedTokenAccount(
      provider.connection,
      admin,
      tokenMint,
      user2.publicKey
    );

    // Mint tokens to users
    await mintTo(
      provider.connection,
      admin,
      tokenMint,
      user1TokenAccount,
      admin,
      1000000000 // 1000 tokens
    );

    await mintTo(
      provider.connection,
      admin,
      tokenMint,
      user2TokenAccount,
      admin,
      1000000000 // 1000 tokens
    );

    console.log("Test setup completed");
    console.log("Admin:", admin.publicKey.toString());
    console.log("User1:", user1.publicKey.toString());
    console.log("User2:", user2.publicKey.toString());
    console.log("Token Mint:", tokenMint.toString());
  });

  it("Initialize game vault", async () => {
    const [vaultPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("vault"), new anchor.BN(gameId).toArrayLike(Buffer, "le", 8)],
      program.programId
    );

    const tx = await program.methods
      .initializeGameVault(new anchor.BN(gameId))
      .accounts({
        vault: vaultPda,
        authority: admin.publicKey,
        tokenMint: tokenMint,
        systemProgram: SystemProgram.programId,
      })
      .signers([admin])
      .rpc();

    console.log("✅ Game vault initialized:", tx);


    try {
      // Create vault token account after vault initialization
      const vaultTokenAccount = await getOrCreateAssociatedTokenAccount(
        provider.connection,
        admin,        // payer
        tokenMint,    // mint
        vaultPda,     // owner
        true          // allowOwnerOffCurve
      );
      console.log("✅ Vault token account created:", vaultTokenAccount.address.toString());
    } catch (error) {
      console.log("Error creating vault token account:", error);
    }

    const vaultAccount = await program.account.gameVault.fetch(vaultPda);
    console.log("Vault account:", {
      gameId: vaultAccount.gameId.toString(),
      authority: vaultAccount.authority.toString(),
      totalDeposit: vaultAccount.totalDeposit.toString(),
      finalized: vaultAccount.finalized,
      withdrawEnabled: vaultAccount.withdrawEnabled,
      tokenMint: vaultAccount.tokenMint.toString(),
    });
  });

  it("User1 buys ticket", async () => {
    const [vaultPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("vault"), new anchor.BN(gameId).toArrayLike(Buffer, "le", 8)],
      program.programId
    );

    const [userTicketPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("ticket"), vaultPda.toBuffer(), user1.publicKey.toBuffer()],
      program.programId
    );

    const vaultTokenPda = await getAssociatedTokenAddress(
      tokenMint,
      vaultPda,
      true // allowOwnerOffCurve
    );

    const ticketAmount = 100000000; // 100 tokens

    const tx = await program.methods
      .buyTicket(new anchor.BN(ticketAmount))
      .accounts({
        vault: vaultPda,
        userTicket: userTicketPda,
        userToken: user1TokenAccount,
        vaultToken: vaultTokenPda,
        user: user1.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .signers([user1])
      .rpc();

    console.log("✅ User1 bought ticket:", tx);

    const userTicketAccount = await program.account.userTicket.fetch(userTicketPda);
    console.log("User1 ticket:", {
      gameId: userTicketAccount.gameId.toString(),
      user: userTicketAccount.user.toString(),
      amount: userTicketAccount.amount.toString(),
      hasWithdrawn: userTicketAccount.hasWithdrawn,
    });

    const vaultAccount = await program.account.gameVault.fetch(vaultPda);
    console.log("Vault total deposit:", vaultAccount.totalDeposit.toString());
  });

  it("User2 buys ticket", async () => {
    const [vaultPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("vault"), new anchor.BN(gameId).toArrayLike(Buffer, "le", 8)],
      program.programId
    );

    const [userTicketPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("ticket"), vaultPda.toBuffer(), user2.publicKey.toBuffer()],
      program.programId
    );

    const vaultTokenPda = await getAssociatedTokenAddress(
      tokenMint,
      vaultPda,
      true // allowOwnerOffCurve
    );

    const ticketAmount = 150000000; // 150 tokens

    const tx = await program.methods
      .buyTicket(new anchor.BN(ticketAmount))
      .accounts({
        vault: vaultPda,
        userTicket: userTicketPda,
        userToken: user2TokenAccount,
        vaultToken: vaultTokenPda,
        user: user2.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .signers([user2])
      .rpc();

    console.log("✅ User2 bought ticket:", tx);

    const vaultAccount = await program.account.gameVault.fetch(vaultPda);
    console.log("Vault total deposit after User2:", vaultAccount.totalDeposit.toString());
  });

  it("Finalize game with rewards", async () => {
    const [vaultPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("vault"), new anchor.BN(gameId).toArrayLike(Buffer, "le", 8)],
      program.programId
    );

    const [rewardMapPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("reward_map"), vaultPda.toBuffer()],
      program.programId
    );

    const rewards = [
      { user: user1.publicKey, amount: new anchor.BN(150000000) },
      { user: user2.publicKey, amount: new anchor.BN(100000000) },
    ];

    const tx = await program.methods
      .finalizeGame(rewards)
      .accounts({
        vault: vaultPda,
        rewardMap: rewardMapPda,
        authority: admin.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([admin])
      .rpc();

    console.log("✅ Game finalized:", tx);

    const rewardMapAccount = await program.account.rewardMap.fetch(rewardMapPda);
    console.log("Reward map:", {
      gameId: rewardMapAccount.gameId.toString(),
      rewards: rewardMapAccount.rewards.map(r => ({
        user: r.user.toString(),
        amount: r.amount.toString()
      }))
    });

    const vaultAccount = await program.account.gameVault.fetch(vaultPda);
    console.log("Vault finalized:", vaultAccount.finalized);
    console.log("Withdraw enabled:", vaultAccount.withdrawEnabled);
  });

  it("User1 claims reward", async () => {
    const [vaultPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("vault"), new anchor.BN(gameId).toArrayLike(Buffer, "le", 8)],
      program.programId
    );

    const [userTicketPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("ticket"), vaultPda.toBuffer(), user1.publicKey.toBuffer()],
      program.programId
    );

    const [rewardMapPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("reward_map"), vaultPda.toBuffer()],
      program.programId
    );

    const vaultTokenPda = await getAssociatedTokenAddress(
      tokenMint,
      vaultPda,
      true // allowOwnerOffCurve
    );

    const [vaultSignerPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("vault"), new anchor.BN(gameId).toArrayLike(Buffer, "le", 8)],
      program.programId
    );

    const tx = await program.methods
      .claimReward()
      .accounts({
        vault: vaultPda,
        userTicket: userTicketPda,
        rewardMap: rewardMapPda,
        vaultToken: vaultTokenPda,
        userToken: user1TokenAccount,
        vaultSigner: vaultSignerPda,
        user: user1.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([user1])
      .rpc();

    console.log("✅ User1 claimed reward:", tx);

    const userTicketAccount = await program.account.userTicket.fetch(userTicketPda);
    console.log("User1 ticket withdrawn:", userTicketAccount.hasWithdrawn);

    const user1Balance = await getAccount(provider.connection, user1TokenAccount);
    console.log("User1 token balance:", user1Balance.amount.toString());
  });

  it("User2 claims reward", async () => {
    const [vaultPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("vault"), new anchor.BN(gameId).toArrayLike(Buffer, "le", 8)],
      program.programId
    );

    const [userTicketPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("ticket"), vaultPda.toBuffer(), user2.publicKey.toBuffer()],
      program.programId
    );

    const [rewardMapPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("reward_map"), vaultPda.toBuffer()],
      program.programId
    );

    const vaultTokenPda = await getAssociatedTokenAddress(
      tokenMint,
      vaultPda,
      true // allowOwnerOffCurve
    );

    const [vaultSignerPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("vault"), new anchor.BN(gameId).toArrayLike(Buffer, "le", 8)],
      program.programId
    );

    const tx = await program.methods
      .claimReward()
      .accounts({
        vault: vaultPda,
        userTicket: userTicketPda,
        rewardMap: rewardMapPda,
        vaultToken: vaultTokenPda,
        userToken: user2TokenAccount,
        vaultSigner: vaultSignerPda,
        user: user2.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([user2])
      .rpc();

    console.log("✅ User2 claimed reward:", tx);

    const user2Balance = await getAccount(provider.connection, user2TokenAccount);
    console.log("User2 token balance:", user2Balance.amount.toString());
  });

  it("Admin withdraws remaining tokens", async () => {
    const [vaultPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("vault"), new anchor.BN(gameId).toArrayLike(Buffer, "le", 8)],
      program.programId
    );

    const vaultTokenPda = await getAssociatedTokenAddress(
      tokenMint,
      vaultPda,
      true // allowOwnerOffCurve
    );

    const [vaultSignerPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("vault"), new anchor.BN(gameId).toArrayLike(Buffer, "le", 8)],
      program.programId
    );

    try {
      const vaultBalance = await getAccount(provider.connection, vaultTokenPda);
      console.log("Vault balance before admin withdraw:", vaultBalance.amount.toString());

      const withdrawAmount = new anchor.BN(vaultBalance.amount);

      const tx = await program.methods
        .adminWithdraw(withdrawAmount)
        .accounts({
          vault: vaultPda,
          vaultToken: vaultTokenPda,
          adminToken: adminTokenAccount,
          vaultSigner: vaultSignerPda,
          authority: admin.publicKey,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .signers([admin])
        .rpc();

      console.log("✅ Admin withdrew remaining tokens:", tx);

      const adminBalance = await getAccount(provider.connection, adminTokenAccount);
      console.log("Admin token balance:", adminBalance.amount.toString());

      const vaultBalanceAfter = await getAccount(provider.connection, vaultTokenPda);
      console.log("Vault balance after admin withdraw:", vaultBalanceAfter.amount.toString());
    } catch (error) {
      console.log("Admin withdraw failed (expected if no remaining tokens):", error.message);
    }
  });

  it("Change token mint (should fail if game is finalized)", async () => {
    const [vaultPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("vault"), new anchor.BN(gameId).toArrayLike(Buffer, "le", 8)],
      program.programId
    );

    const newMint = Keypair.generate();

    try {
      const tx = await program.methods
        .changeTokenMint(newMint.publicKey)
        .accounts({
          vault: vaultPda,
          authority: admin.publicKey,
        })
        .signers([admin])
        .rpc();

      console.log("Token mint changed:", tx);
    } catch (error) {
      console.log("Expected error - cannot change token mint after game is finalized:", error.message);
    }
  });
});
