const { Keypair } = require("@solana/web3.js");

const { getWalletBalance, transferSOL, airDropSol } = require("./solana");
const { getReturnAmount, totalAmtToBePaid, randomNumber } = require("./helper");

const gameExecution = async () => {
  const userWallet = Keypair.generate();
  const treasuryWallet = Keypair.generate();

  // airdrop to user
  await getWalletBalance(userWallet.publicKey);
  await airDropSol(userWallet, 2);
  console.log(`-- Waiting for 10s --`);
  await new Promise((r) => setTimeout(r, 10000));
  await getWalletBalance(userWallet.publicKey);

  // airdrop to treasury - need it to have something to give back
  await getWalletBalance(treasuryWallet.publicKey);
  await airDropSol(treasuryWallet, 2);
  console.log(`-- Waiting for 10s --`);
  await new Promise((r) => setTimeout(r, 10000));
  await getWalletBalance(treasuryWallet.publicKey);

  const generateRandomNumber = randomNumber(1, 5);
  const answers = {
    SOL: 0.2,
    RANDOM: 3,
    RATIO: 1.25,
  };
  console.log("SOL staked: ", answers.SOL);
  console.log("RATIO selected: ", answers.RATIO);
  console.log("Random Number selected: ", answers.RANDOM);
  if (answers.RANDOM) {
    const paymentSignature = await transferSOL(
      userWallet,
      treasuryWallet,
      totalAmtToBePaid(answers.SOL)
    );
    if (!paymentSignature) process.exit(1);
    console.log(`Signature of payment for playing the game`, paymentSignature);
    if (answers.RANDOM === generateRandomNumber) {
      //guess is successfull
      const prizeSignature = await transferSOL(
        treasuryWallet,
        userWallet,
        getReturnAmount(answers.SOL, parseFloat(answers.RATIO))
      );
      console.log(chalk.green`Your guess is absolutely correct`);
      console.log(`Here is the price signature `, prizeSignature);
    } else {
      //better luck next time
      console.log(
        "Better luck next time, actual number was ",
        generateRandomNumber
      );
    }
  }
};

gameExecution();
