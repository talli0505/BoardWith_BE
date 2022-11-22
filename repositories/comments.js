const Comments = require('../schema/comments');
const Posts = require('../schema/posts');

class CommentsRepository {
    //댓글 전체 목록 보기
    findAllComments = async (postId) => {
        const allCommentsData = await Comments.find({postId}).sort({updatedAt: -1});
        return allCommentsData;
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
        const createCommentData = await Comments.create({ postId, userId, nickName, birth, gender, myPlace, comment });
        await Posts.updateOne( { _id: postId},{ $push:{participant: nickName}});
        return createCommentData;
    };

    //댓글 존재 여부 확인하기, 본인의 댓글 맞는지 확인하기 for update
    findOneComment = async (commentId) => {
        const findOneComment = await Comments.findOne({_id: commentId.commentId.substring(0, 24)});
        return findOneComment;
    }

    //댓글 수정
    updateComment = async (userId, commentId, comment) => {
        const updatedCommentData = await Comments.updateOne({userId,  _id: commentId}, {$set: {comment}});
        return updatedCommentData;
    };

    //댓글 존재 여부 확인하기 for delete
    findOneCommentforDelete = async (commentId) => {
        const findOneComment = await Comments.findOne({ _id: commentId.commentId });
        return findOneComment;
    }

    //본인 댓글 여부 확인 후 댓글 삭제
    deleteComment = async (commentId) => {
        const deleteCommentData = await Comments.deleteOne({_id: commentId});
        return deleteCommentData;
    };

    //참여 예약한 모임 조회
    partyReservedData = async(nickName) => {
        const partyReservedData = await Comments.find({nickName}).sort('date');
        return partyReservedData;
    }
}

module.exports = CommentsRepository;