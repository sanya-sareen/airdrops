const {expect} = require("chai")
const {ethers} = require("hardhat")
const {MerkleTree} = require("merkletreejs")
const keccak256 = require('keccak256');
const { inputToConfig } = require("@ethereum-waffle/compiler");

describe("ERC721Merkle", function(){

    // let addrs;
    let addresses ;
    let contractDeploy;
    let proof;
    let leaf;
   let tree;
   let accounts;
   let addrs0, addrs1, addrs2;
   let buf2ex;
    before(async function(){
        
         [addrs0, addrs1, addrs2, accounts]  = await ethers.getSigners()

        addresses = [
            '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
            '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
            '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC'
          ]

        const leaves = addresses.map(x => keccak256(x))

        tree = new MerkleTree(leaves, keccak256, {sortPairs: true})
        buf2ex = x => '0x' + x.toString('hex')

       const roots = buf2ex(tree.getRoot())
       
       const contract = await ethers.getContractFactory("ERC721Merkle");
       contractDeploy = await contract.deploy("Sanya","SN",roots);

      
    })

    it("print addresss", async function(){
        console.log(contractDeploy.address)
       console.log(addresses)
    })

 

    it("isValid", async function(){
        leaf = keccak256(addresses[0])
        proof = tree.getProof(leaf).map(x => buf2ex(x.data))
        values = await contractDeploy.connect(addrs0).isValid(proof, leaf)
        console.log(values)
    })

    it("Safe mint", async function(){
        to = addresses[2]
        mints = await contractDeploy.safeMint(to, 12, proof, { from: addresses[0]})
    })
    
})

  