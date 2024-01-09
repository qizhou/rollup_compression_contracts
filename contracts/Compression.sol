// SPDX-License-Identifier: MIT
pragma solidity >=0.8.9;

contract Compression {
    uint256 public immutable DICT_SIZE;
    mapping(bytes32 key => uint256 frequency) public frequencyMap; // key to frequency
    mapping(bytes32 key => uint256 position) public positionMap; // key to dictonary index mapping (1-based indexed)
    bytes32[] public dictionary;

    constructor(uint256 _dictSize) {
        DICT_SIZE = _dictSize;
    }

    function getLength() public view returns (uint256) {
        return dictionary.length;
    }

    function _getRandom() internal view virtual returns (uint256) {
        return block.prevrandao;
    }

    function _process(bytes32 _key) internal {
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

        uint256 _randomIndex = _getRandom() % DICT_SIZE;
        bytes32 _existingKey = dictionary[_randomIndex];
        if (frequencyMap[_key] > frequencyMap[_existingKey]) {
            positionMap[_existingKey] = 0;
            positionMap[_key] = _randomIndex + 1;
            dictionary[_randomIndex] = _key;
        }
    }

    function process(bytes32 _key) public {
        _process(_key);
    }

    // TODO: compress and decompress
}
