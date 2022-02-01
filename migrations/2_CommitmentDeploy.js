const PC = artifacts.require("PedersenContract");
const CC = artifacts.require("ContestContract");

module.exports = async function(deployer) {
  await deployer.deploy(PC);
  const block = await web3.eth.getBlockNumber();
  await deployer.deploy(CC, PC.address, block, block + 1000, 'ipfs:QmPXME1oRtoT627YK2232cE', 'ipfs:QmPXME1oRtoT627YK6789');
}