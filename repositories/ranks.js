const Users = require("../schema/users")

class RanksRepository {
    getRanks = async() => {
        const result =[]
        const getRanks = await Users.find({}).sort("-totalPoint")
        getRanks.map((p) => result.push({
            nickName: p.nickName,
            userAvater : p.userAvater,
            totalPoint: p.totalPoint
    })
    )
        return result
    }
}

module.exports = RanksRepository;