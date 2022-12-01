const RanksService = require("../services/ranks")

class RanksController {
    ranksService = new RanksService();

    getRanks = async(req, res, next) => {
        const getRank = await this.ranksService.getRanks();
        res.status(200).json({data:getRank})
    }
}

module.exports = RanksController