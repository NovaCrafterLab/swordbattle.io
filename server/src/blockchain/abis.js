// 区块链合约ABI定义 - 只使用GameAggregator
const fs = require('fs');
const path = require('path');

// 加载GameAggregator ABI
function loadGameAggregatorABI() {
  try {
    const abiPath = path.join(__dirname, './../../abis/GameAggregator.json');
    const abiData = fs.readFileSync(abiPath, 'utf8');
    const parsedData = JSON.parse(abiData);
    return parsedData.abi || parsedData;
  } catch (error) {
    console.error('Failed to load GameAggregator ABI:', error);
    throw new Error('Unable to load GameAggregator contract ABI');
  }
}

const GAME_AGGREGATOR_ABI = loadGameAggregatorABI();

module.exports = {
  GAME_AGGREGATOR_ABI,
};
