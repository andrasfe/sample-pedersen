const BN = require('bn.js');
const crypto = require("crypto")
const axios = require('axios');
const PC = artifacts.require('PedersenContract')
const CC = artifacts.require('ContestContract')
const NOTEBOOK_URL = 'https://raw.githubusercontent.com/dmlc/mxnet-notebooks/master/python/tutorials/mnist.ipynb'

contract('Contract deployment', function() {
    before(async function() {
        this.pc = await PC.new();
        const block = await web3.eth.getBlockNumber();
        this.cc = await CC.new(this.pc.address,block, block + 1000, 'ipfs:QmPXME1oRtoT627YK2232cE', 'ipfs:QmPXME1oRtoT627YK6789');
    });

    after(async function() {
        console.log('Test Finished')
    })

    describe('Contest flows', function() {
        it('Simple contest', async function() {

            /* 
             * Submission:  fetch notebook from url (initially private).
             * Hash it, pick a random t, generate commitment, then submit it along with a valid
             * metric, e.g. F1 score on test data.
             */
            const response = await axios.get(NOTEBOOK_URL);
            const notebookHash = crypto.createHash("sha256").update(response.toString()).digest("hex");
            console.log('hash', notebookHash)
            const bodyHash = new BN(notebookHash, 16);
            const accounts = await web3.eth.getAccounts();
            const RANDOM_T = 123;
            // commitment is in same cyclic group
            commitment = await this.pc.commit(RANDOM_T, bodyHash);
            console.log('first:', commitment[0], 'second:', commitment[1]);
            const F1_SCORE = 98371; // 0.98371, as we use integers for simplicity

            // prior to submission we can verify our commitment, by providing t and body hash
            verification = await this.pc.verify(RANDOM_T, bodyHash, commitment[0], commitment[1]);
            assert.equal( verification , true ,"pedersen commitment verification incorrect");

            // and then submit
            await this.cc.submit(commitment[0], commitment[1], F1_SCORE);

            /*
             * Validation post contest. Can be performed the organizer. Disqualifies dishonest contestants
             */
            await this.cc.validate(accounts[0], RANDOM_T, bodyHash);
            // const gasEstimate = await this.pc.verify.estimateGas(RANDOM_T, bodyHash, commitment[0], commitment[1]);
            // console.log('gas estimate for pedersen:', gasEstimate);
            result = await this.cc.status();
            console.log(result);
            assert.equal(result[1], true, 'ms.status() should return true' );
        });
    });
});
