// SPDX-License-Identifier: MIT
pragma solidity >=0.8.9;

contract Compression {
    uint256 immutable DICT_SIZE;
    mapping(bytes32 => uint256) frequencyMap; // key to frequency
    mapping(bytes32 => uint256) positionMap; // key to dictonary index mapping (1-based indexed)
    bytes32[] dictionary;

    constructor(uint256 _dict_size) {
        DICT_SIZE = _dict_size;
    }

    function getRandom() internal view virtual returns (uint256) {
        return block.prevrandao;
    }

    function process(bytes32 _key) internal {
        frequencyMap[_key] += 1;

        if (positionMap[_key] != 0) {
            // the key is already in the position map
            return;
        }

        if (dictionary.length < DICT_SIZE) {
            // push the key into dict and position map
            dictionary.push(_key);
            positionMap[_key] = dictionary.length;
            return;
        }

        uint256 _randomIndex = getRandom() % DICT_SIZE;
        bytes32 _existingKey = dictionary[_randomIndex - 1];
        if (frequencyMap[_key] > frequencyMap[_existingKey]) {
            positionMap[_existingKey] = 0;
            positionMap[_key] = _randomIndex;
            dictionary[_randomIndex - 1] = _key;
        }
    }

    // TODO: compress and decompress
}
