const Comments = require('../schema/comments');
const Posts = require('../schema/posts');
const Users = require("../schema/users")

class CommentsRepository {
    //댓글 전체 목록 보기
    findAllComments = async (postId) => {
        const allCommentsData = await Comments
            .find({postId})
            .populate('postId')
            .sort({updatedAt: -1});

        for (let i = 0; i < allCommentsData.length; i++) {
            const userData = await Users.findOne({userId: allCommentsData[i].userId});
            allCommentsData[i].userAvatar = userData.userAvatar
            allCommentsData[i].age = userData.age
        }
        return allCommentsData
    };

    //댓글 한개 보기
    findComment = async (userId, commentId) => {
        const findCommentData = await Comments.findOne({userId, commentId});
        return findCommentData;
    }

    //게시글 존재 여부 확인
    findOnePost = async (postId) => {
        const findOnePostResult = await Posts.findOne({_id: postId});
        return findOnePostResult;
    }

    //신규 댓글
    createComment = async (postId, userId, nickName, birth, gender, myPlace, comment) => {
        const createCommentData = await Comments.create({postId, userId, nickName, birth, gender, myPlace, comment});
        await Posts.updateOne({_id: postId}, {$push: {participant: nickName}});
        await Users.updateOne({userId: userId}, {$inc: {point: 100, totalPoint: 100}})
        const userInfo = await Users.findOne({userId: userId})
        const userAvatarData = userInfo.userAvatar;
        const age = userInfo.age;
        createCommentData["userAvatar"] = userAvatarData;
        createCommentData["age"] = age;
        return createCommentData;
    };

    //댓글 존재 여부 확인하기, 본인의 댓글 맞는지 확인하기 for update
    findOneComment = async (commentId) => {
        const findOneComment = await Comments.findOne({_id: commentId.commentId.substring(0, 24)});
        return findOneComment;
    }

    //댓글 수정
    updateComment = async (userId, commentId, comment) => {
        const updatedCommentData = await Comments.updateOne({userId, _id: commentId}, {$set: {comment}});
        return updatedCommentData;
    };

    //댓글 존재 여부 확인하기 for delete
    findOneCommentforDelete = async (commentId) => {
        const findOneComment = await Comments.findOne({_id: commentId.commentId});
        return findOneComment;
    }

    //본인 댓글 여부 확인 후 댓글 삭제
    deleteComment = async (nickName, commentId) => {
        const findOneComment = await Comments.findOne({_id: commentId});
        await Posts.updateOne({_id: findOneComment.postId}, {$pull: {participant: nickName}});
        const deleteCommentData = await Comments.deleteOne({_id: commentId});
        return deleteCommentData;
    };
}

module.exports = CommentsRepository;