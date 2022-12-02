const Users = require("../schema/users")

class RanksRepository {
    getRanks = async() => {
        const result =[]
        const getRanks = await Users.find({}).sort("-totalPoint")
        getRanks.map((p) => result.push({
            nickName: p.nickName,
            userAvatar : p.userAvatar,
            totalPoint: p.totalPoint
    })
    )
        return result
    }
}

module.exports = RanksRepository;