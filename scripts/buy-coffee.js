// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

//Returns the Ether balance of a given address.
async function getBalance(address) {
  const balanceBigInt = await hre.waffle.provider.getBalance(address);
  return hre.ethers.utils.formatEther(balanceBigInt);
}

//Logs the Ethers balanaces for a list of addresses.
async function printBalances(addresses) {
  let idx = 0;
  for (const address of addresses) {
    console.log(`Address ${idx} balance: `, await getBalance(address));
    idx++;
  }
}

//Logs the memos stored on-chain from coffee purchases.
async function printMemos(memos) {
  for (const memo of memos) {
    const timestamp = memo.timestamp;
    const tipper = memo.name;
    const tipperAddress = memo.from;
    const message = memo.message;
    console.log(
      `At ${timestamp}, ${tipper} (${tipperAddress}) said: "${message}"`
    );
  }
}

async function main() {
  // Get example accounts.
  const [owner, tipper, tipper2, tipper3] = await hre.ethers.getSigners();

  // Get the contract to deploy & deploy.
  const BuyMeACoffee = await hre.ethers.getContractFactory("BuyMeACoffee");
  const buyMeACoffee = await BuyMeACoffee.deploy();
  await buyMeACoffee.deployed();
  console.log("BuyMeACoffee deployed to ", buyMeACoffee.address);

  // Check balances before the coffee purchase.
  const addresses = [owner.address, tipper.address, buyMeACoffee.address];
  console.log("==== Start ====");
  await printBalances(addresses);

  // Buy the owner a few coffees.
  const tip = { value: hre.ethers.utils.parseEther("1") };
  await buyMeACoffee
    .connect(tipper)
    .buyCoffee("Carolina", "You're the best!", tip);
  await buyMeACoffee
    .connect(tipper2)
    .buyCoffee("Vitto", "What an amazing teacher!", tip);
  await buyMeACoffee
    .connect(tipper3)
    .buyCoffee("Kay", "I love my Proof of Knowledge NFT!", tip);

  // Buy the owner a few large coffees.
  const tip1 = { value: hre.ethers.utils.parseEther("1") };
  await buyMeACoffee
    .connect(tipper)
    .buylargeCoffee("Carolina", "You're the best!", tip1);
  await buyMeACoffee
    .connect(tipper2)
    .buylargeCoffee("Vitto", "What an amazing teacher!", tip1);
  await buyMeACoffee
    .connect(tipper3)
    .buylargeCoffee("Kay", "I love my Proof of Knowledge NFT!", tip1);

  // Check balances after coffee purchases.
  console.log("==== bought ====");
  await printBalances(addresses);

  // Withdraw funds.
  await buyMeACoffee.connect(owner).withdrawTips();
  // Check balance after withrdraw.

  console.log("==== withdrawTips ====");
  await printBalances(addresses);

  // Read all the memos left for the owner.
  console.log("=== memos ===");
  const memos = await buyMeACoffee.getMemos();
  printMemos(memos);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });