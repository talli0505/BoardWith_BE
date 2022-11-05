const CommentsRepository = require('../repositories/comments');

class CommentsService {
    commentsRepository = new CommentsRepository();
//댓글 전체 목록 보기
    findAllComments = async (postId) => {
        const findAllCommentResult = await this.commentsRepository.findAllComments(postId);
        // const findAllCommentResultData = [];
        // for (let i = 0; i < findAllCommentResult.length; i++) {
        //     const data =
        //         {
        //             goodsId: findAllCommentResult[i].dataValues.goodsId,
        //             commentsId: findAllCommentResult[i].dataValues.commentsId,
        //             userId: findAllCommentResult[i].dataValues.userId,
        //             userName: findAllCommentResult[i].dataValues.userName[0] + "*" + findAllCommentResult[i].dataValues.userName[2],
        //             commentImage: findAllCommentResult[i].dataValues.commentImage,
        //             content: findAllCommentResult[i].dataValues.content,
        //             createdAt: findAllCommentResult[i].dataValues.createdAt,
        //             updatedAt: findAllCommentResult[i].dataValues.updatedAt
        //         };
        //     findAllCommentResultData.push(data)
        // }
        // return findAllCommentResultData;
        return findAllCommentResult;
    };

//신규 댓글
    createComment = async (postId, userId, nickname, comment) => {
        const createCommentResult = await this.commentsRepository.createComment(postId, userId, nickname, comment);
        return createCommentResult;
    };

//댓글 존재 여부 확인하기, 본인의 댓글 맞는지 확인하기
    findOneComment = async (commentId) => {
        const findOneComment = await this.commentsRepository.findOneComment(commentId);
        return findOneComment;
    }

//댓글 수정
    updateComment = async (userId, commentId, comment) => {
        await this.commentsRepository.updateComment(userId, commentId, comment);
        const commentResult = await this.commentsRepository.findComment(userId, commentId);
        return commentResult;
    };

//댓글 삭제
    deleteComment = async (userId, commentId) => {
        const deletedCommentResult = await this.commentsRepository.deleteComment(userId, commentId);
        // console.log(deletedCommentResult, "service")
        return deletedCommentResult;
    };
}

module.exports = CommentsService;