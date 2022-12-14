const RanksService = require("../services/ranks")

class RanksController {
    ranksService = new RanksService();

    getRanks = async(req, res, next) => {
        const getRank = await this.ranksService.getRanks();
        res.status(200).json({data:getRank})
    }

    getMyPoint = async(req, res, next) => {
        const {nickName} = res.locals.user;
        const getMyPoint = await this.ranksService.getMyPoint(nickName);
        res.status(200).json({data: getMyPoint, message:"์กฐํ ์๋ฃ"})
    }
}

module.exports = RanksController