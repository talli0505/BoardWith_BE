const Posts = require("../schema/posts");
const Bookmarks = require("../schema/bookmark");
const Users = require("../schema/users");

class PostsRepository {

    createPosts = async (userId, img, nickName, title, content, location, cafe, date, time, map, partyMember, participant, nowToClose) => {
        const createPosts = await Posts.create({
            userId,
            img,
            nickName,
            title,
            content,
            location,
            cafe,
            date,
            time,
            map,
            partyMember,
            participant,
            confirmMember: nickName,
            expireAt: nowToClose
        });
        await Users.updateOne({userId: userId}, {$inc: {point: 300, totalPoint: 300}})
        const UserAvatar = await Users.findOne({userId: userId})
        createPosts.userAvatar = UserAvatar.userAvatar
        return createPosts;
    };

    //게시글 검색 by 제목
    searchTitle = async (keyword) => {
        const searchTitle = await Posts.find({title: {$regex: keyword, $options: "xi"}}).sort({createdAt: "desc"});
        for (let i = 0; i < searchTitle.length; i++) {
            const findAvatar = await Users.findOne({userId: searchTitle[i].userId})
            searchTitle[i]['userAvatar'] = findAvatar.userAvatar;
        }
        return searchTitle;
    }

    //키워드(닉네임)로 게시글 검색
    searchNickName = async (keyword) => {
        const searchNickName = await Posts.find({
            nickName: {
                $regex: keyword,
                $options: "xi"
            }
        }).sort({createdAt: "desc"});
        for (let i = 0; i < searchNickName.length; i++) {
            const findAvatar = await Users.findOne({userId: searchNickName[i].userId})
            searchNickName[i]['userAvatar'] = findAvatar.userAvatar;
        }
        return searchNickName;
    }

    findAllPosts = async (skip, keyword) => {
        const findAllPosts = await Posts.find({}, undefined, {skip, limit: 5}).sort('-createdAt')
        for (let i = 0; i < findAllPosts.length; i++) {
            const userAvatar = await Users.findOne({userId: findAllPosts[i].userId})
            findAllPosts[i].userAvatar = userAvatar.userAvatar
        }
        return findAllPosts;
    }

    findOnePost = async (postId) => {
        const findOnePosts = await Posts.findOne({_id: postId})
        const userAvatar = await Users.findOne({userId: findOnePosts.userId})
        findOnePosts.userAvatar = userAvatar.userAvatar
        return findOnePosts;
    }

    findPostsByPostIdForBookmark = async (postId) => {
        const findPostsByPostIdForBookmark = await Posts.find({_id: postId})
        return findPostsByPostIdForBookmark
    }

    updatePost = async (postId, userId, title, content, location, cafe, date, time, map, partyMember) => {
        await Posts.updateOne(
            {_id: postId, userId: userId}, {
                $set: {
                    title: title,
                    content: content,
                    location: location,
                    cafe: cafe,
                    date: date,
                    time: time,
                    map: map,
                    partyMember: partyMember
                }
            }
        )
        return
    }

    deletePost = async (postId, userId) => {
        await Posts.deleteOne({_id: postId, userId: userId});
        return
    }

    participateMember = async (postId, userId, nickName) => {
        await Posts.updateOne({_id: postId, userId: userId}, {$push: {participant: nickName}})
        return
    }

    confirmMember = async (postId, nickName) => {
        const confirmMember = await Posts.findById(postId)
        return confirmMember
    }

    pushconfirmMember = async (postId, nickName) => {
        await Posts.updateOne({_id: postId}, {$push: {confirmMember: nickName}})
        await Posts.updateOne({_id: postId}, {$pull: {participant: nickName}})
        return
    }

    pullconfirmMember = async (postId, nickName) => {
        await Posts.updateOne({_id: postId}, {$pull: {confirmMember: nickName}})
        await Posts.updateOne({_id: postId}, {$push: {participant: nickName}})
        return
    }

    banMember = async (postId, nickName) => {
        await Posts.updateOne({_id: postId}, {$push: {banUser: nickName}})
        await Posts.updateOne({_id: postId}, {$pull: {confirmMember: nickName}})
        return
    }

    cancelBanMember = async (postId, nickName) => {
        await Posts.updateOne({_id: postId}, {$pull: {banUser: nickName}})
        await Posts.updateOne({_id: postId}, {$push: {participant: nickName}})
        return
    }

    //파티원 모집 마감
    closeParty = async (postId) => {
        await Posts.updateOne({_id: postId}, {$set: {closed: 1, expireAt: ""}});
        const closePartyResult = await Posts.findOne({_id: postId});
        return closePartyResult;
    }

    //파티원 모집 리오픈
    reopenParty = async (postId, nowToNewClose) => {
        await Posts.updateOne({_id: postId}, {$set: {closed: 0, expireAt: nowToNewClose, "time.1": nowToNewClose}});
        const reopenPartyResult = await Posts.findOne({_id: postId});
        return reopenPartyResult;
    }

    //게시글 랜덤 추출
    findAllPostsForRandomExtract = async (skip) => {
        const findAllPostsData = await Posts.find({}, undefined, {skip, limit: 5}).sort('createdAt');
        return findAllPostsData;
    }

    // 참여 확정된 모임 조회
    partyGoData = async (nickName) => {
        const partyGoData = await Posts.find({confirmMember: nickName}).sort('date');
        return partyGoData;
    }

    //참여 예약한 모임 조회
    partyReservedData = async (nickName) => {
        const partyReservedData = await Posts.find({participant: nickName}).sort('date');
        return partyReservedData;
    }

    findPostsByUser = async (nickName) => {
        const findPostsByUser = await Posts.find({nickName: nickName})
        return findPostsByUser
    }

    //북마크
    findBookmark = async (postId, nickName) => {
        const findBookmark = await Bookmarks.findOne({nickName: nickName})
        return findBookmark
    }

    pushBookmark = async (postId, nickName) => {
        const pushBookmark = await Bookmarks.updateOne({nickName: nickName}, {$push: {postId: postId}})
        return pushBookmark
    }

    pullBookmark = async (postId, nickName) => {
        const pullBookmark = await Bookmarks.updateOne({nickName: nickName}, {$pull: {postId: postId}})
        return pullBookmark
    }

    getBookmark = async (nickName) => {
        const getBookmark = await Bookmarks.find({nickName: nickName})
        return getBookmark
    }

    AllgetBookmark = async (postId) => {
        const AllgetBookmark = await Posts.find({_id: postId});
        return AllgetBookmark
    }

    //게시글 필터링
    filterPosts = async (map, time, partyMember) => {
        const filter = await Posts.find(
            {
                $and: [
                    {map: {$regex: new RegExp(`${map}`, "i")}},
                    {time: {$gte: time[0], $lte: time[1]}},
                    {partyMember: {$gte: partyMember[0], $lte: partyMember[1]}}
                ]
            });
        for (let i = 0; i < filter.length; i++) {
            const findUser = await Users.findOne({userId: filter[i].userId})
            filter[i]['userAvatar'] = findUser.userAvatar;
        }
    return filter;
    }
}

module.exports = PostsRepository;