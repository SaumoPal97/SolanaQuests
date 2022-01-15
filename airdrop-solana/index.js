const {
  Connection,
  PublicKey,
  clusterApiUrl,
  Keypair,
  LAMPORTS_PER_SOL,
  Transaction,
  Account,
} = require("@solana/web3.js");

const newPair = new Keypair();
const publicKey = new PublicKey(newPair._keypair.publicKey).toString();
const secretKey = newPair._keypair.secretKey;

const getWalletBalance = async () => {
  try {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
    const myWallet = await Keypair.fromSecretKey(secretKey);
    const walletBalance = await connection.getBalance(
      new PublicKey(myWallet.publicKey)
    );
    console.log(`=> For wallet address ${publicKey}`);
    console.log(
      `   Wallet balance: ${parseInt(walletBalance) / LAMPORTS_PER_SOL}SOL`
    );
  } catch (err) {
    console.log(err);
  }
};

const airDropSol = async (sol) => {
  try {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
    const walletKeyPair = await Keypair.fromSecretKey(secretKey);
    console.log(`-- Airdropping ${sol} SOL --`);
    const fromAirDropSignature = await connection.requestAirdrop(
      new PublicKey(walletKeyPair.publicKey),
      sol * LAMPORTS_PER_SOL
    );
    await connection.confirmTransaction(fromAirDropSignature);
  } catch (err) {
    console.log(err);
  }
};

const driverFunction = async () => {
  await getWalletBalance();
  await airDropSol(2);
  console.log(`-- Waiting for 10s --`);
  await new Promise((r) => setTimeout(r, 10000));
  await airDropSol(2);
  console.log(`-- Waiting for 10s --`);
  await new Promise((r) => setTimeout(r, 10000));
  await airDropSol(1);
  console.log(`-- Waiting for 10s --`);
  await new Promise((r) => setTimeout(r, 10000));
  await getWalletBalance();
};

driverFunction();
