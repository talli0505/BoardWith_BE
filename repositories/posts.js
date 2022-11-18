const Posts = require("../schema/posts"); 
const bans = require("../schema/ban")
const Bookmarks = require("../schema/bookmark");

class PostsRepository {

    createPosts = async (userId, img, nickName, title, content, location, cafe, date, time, map, partyMember, participant, nowToClose) => {
        await Posts.create({userId, img, nickName, title, content, location, cafe, date, time, map, partyMember, participant, confirmMember:nickName, expireAt: nowToClose
        });
        return;
    };

    findAllPosts = async(skip) => {
        const findAllPosts = await Posts.find({}, undefined, {skip, limit:5}).sort('createdAt');
        return findAllPosts;
    }
    
    findOnePost = async(postId) => {
        const findOnePosts = await Posts.findOne({_id:postId})
        return findOnePosts;
    }

    updatePost = async(postId, userId, title, content, location, cafe, date, time, map, partyMember) => {
        await Posts.updateOne(
            {_id:postId, userId:userId},{$set:{title:title,content:content,location:location,cafe:cafe,date:date,time:time,map:map,partyMember:partyMember}}
        )
        return 
    }

    deletePost = async(postId, userId) => {
        await Posts.deleteOne({_id:postId, userId:userId});
        return
    }

    participateMember = async(postId,userId, nickName) => {
        await Posts.updateOne({_id:postId, userId:userId}, {$push:{participant: nickName}})
        return
    }

    confirmMember = async(postId,nickName) => {
        const confirmMember = await Posts.findById(postId)
        return confirmMember
    }

    pushconfirmMember = async(postId, nickName) => {
        await Posts.updateOne({_id:postId},{$push:{confirmMember:nickName}})
        await Posts.updateOne({_id:postId},{$pull:{participant:nickName}})
        return
    }

    pullconfirmMember = async(postId, nickName) => {
        await Posts.updateOne({_id:postId},{$pull:{confirmMember:nickName}})
        await Posts.updateOne({_id:postId},{$push:{participant:nickName}})
        return 
    }

    banMember = async(postId, nickName) => {
        await Posts.updateOne({_id:postId},{$push:{banUser: nickName}})
        await Posts.updateOne({_id:postId},{$pull:{participant: nickName}})
        return
    }

    cancelBanMember = async(postId, nickName) => {
        await Posts.updateOne({_id:postId},{$pull:{banUser:nickName}})
        return
    }

    //파티원 모집 마감
    closeParty = async (postId) => {
        await Posts.updateOne({_id: postId}, {$set: {closed: 1, expireAt: ""}});
        const closePartyResult = await Posts.findOne({_id:postId});
        return closePartyResult;
    }

    //파티원 모집 리오픈
    reopenParty = async (postId, nowToNewClose) => {
        await Posts.updateOne({_id: postId}, {$set: {closed: 0, expireAt: nowToNewClose, "time.1": nowToNewClose}});
        const reopenPartyResult = await Posts.findOne({_id:postId});
        return reopenPartyResult;
    }

    //게시글 랜덤 추출
    findAllPostsForRandomExtract = async (skip) => {
        const findAllPostsData = await Posts.find({}, undefined, {skip, limit:5}).sort('createdAt');
        return findAllPostsData;
    }

    // 참여 예약한 모임 조회
    partyReservedData = async(nickName) => {
        const partyReservedData = await Posts.find({nickName}).sort('date');
        return partyReservedData;
    }

    // 참여 확정된 모임 조회
    partyGoData = async(nickName) => {
        const partyGoData = await Posts.find({participant: nickName}).sort('date');
        return partyGoData;
    }

    findPostsByUser = async(nickName) => {
        const findPostsByUser = await Posts.find({nickName:nickName})
        return findPostsByUser
    }

    findBookmark = async(postId, nickName) => {
        const findBookmark = await Bookmarks.findOne({nickName:nickName})
        return findBookmark
    }

    pushBookmark = async(postId, nickName) => {
        const pushBookmark = await Bookmarks.updateOne({nickName:nickName},{$push:{postId: postId}})
        return pushBookmark
    } 

    pullBookmark = async(postId, nickName) => {
        const pullBookmark = await Bookmarks.updateOne({nickName:nickName}, {$pull:{postId:postId}})
        return pullBookmark
    }
}

module.exports = PostsRepository;