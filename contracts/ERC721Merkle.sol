pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract ERC721Merkle is ERC721{
    bytes32 immutable public root;

    constructor(string memory name, string memory symbol, bytes32 merkleroot) ERC721(name, symbol){
        root = merkleroot;
    }

    function safeMint(address to, uint256 tokenId, bytes32[] memory proof) public{
        require(isValid(proof, keccak256(abi.encodePacked(msg.sender))), "not part of allowlist");
        _safeMint(to, tokenId);
    }

    function isValid(bytes32[] memory proof, bytes32 leaf) public view returns(bool){
        return MerkleProof.verify(proof, root, leaf);

    }

}