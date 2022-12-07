const RanksRepository = require("../repositories/ranks")

class RanksService {
    ranksRepository = new RanksRepository();

    getRanks = async() => {
        const getRanks = await this.ranksRepository.getRanks();
        return getRanks
    }

    getMyPoint = async(nickName) => {
        const getMyPoint = await this.ranksRepository.getMyPoint(nickName);
        return getMyPoint
    }
}

module.exports = RanksService;