const Users = require("../schema/users")

class RanksRepository {
    getRanks = async() => {
        let count = 1
        const result =[]
        const getRanks = await Users.find({}).sort("-totalPoint")
        for(let i = 0; i<getRanks.length; i++){            
            getRanks[i].rank = count++
        }
        getRanks.map((p) => result.push({
            nickName: p.nickName,
            userAvatar : p.userAvatar,
            totalPoint: p.totalPoint,
            rank: p.rank
    })
    );
        return result
    };

    getMyPoint = async(nickName) => {
        const getMyPoint = await Users.findOne({nickName:nickName})
        const result = {
            point : getMyPoint.point, 
            totalPoint : getMyPoint.totalPoint
        }
        return result       
    };
}

module.exports = RanksRepository;