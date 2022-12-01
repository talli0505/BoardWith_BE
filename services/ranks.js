const RanksRepository = require("../repositories/ranks")

class RanksService {
    ranksRepository = new RanksRepository();

    getRanks = async() => {
        const getRanks = await this.ranksRepository.getRanks();
        return getRanks
    }
}

module.exports = RanksService;