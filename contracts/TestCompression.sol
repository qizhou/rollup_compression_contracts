// SPDX-License-Identifier: MIT
pragma solidity >=0.8.9;
import "./Compression.sol";

contract TestCompression is Compression {
    uint256 randomValue;

    constructor(uint256 _dict_size) Compression(_dict_size) {}

    function setRandom(uint256 _randomValue) public {
        randomValue = _randomValue;
    }

    function getRandom() internal view override returns (uint256) {
        return randomValue;
    }
}
