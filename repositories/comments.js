const {Comments} = require('../models/index');

class CommentsRepository {
    //댓글 전체 목록 보기
    findAllComments = async (postId) => {
        const allCommentsData = await Comments.findAll({where: {postId}, order: [['createdAt', 'DESC']]});
        return allCommentsData;
    };

    //댓글 한개 보기
    findComment = async (userId, commentId) => {
        const findCommentData = await Comments.findOne({where: {userId, commentId}});
        return findCommentData;
    }

    //신규 댓글
    createComment = async (postId, userId, nickname, comment) => {
        const createCommentData = await Comments.create({postId, userId, nickname, comment});
        return createCommentData;
    };

    //댓글 존재 여부 확인하기, 본인의 댓글 맞는지 확인하기
    findOneComment = async (commentId) => {
        const findOneComment = await Comments.findOne({where: {commentId}});
        return findOneComment;
    }

    //댓글 수정
    updateComment = async (userId, commentId, comment) => {
        const updatedCommentData = await Comments.update({comment}, {where: {userId, commentId}});
        return updatedCommentData;
    };

    //댓글 삭제
    deleteComment = async (userId, commentId) => {
        const deleteCommentData = await Comments.destroy({where: {userId, commentId},});
        // console.log(deleteCommentData)
        // console.log(commentsId, "commentsId")
        // console.log(userId)
        return deleteCommentData;
    };
}

module.exports = CommentsRepository;