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
        const findOnePostResult = await Posts.findOne({_id: postId.postId});
        return findOnePostResult
    }

    //신규 댓글
    createComment = async (postId, userId, nickname, comment) => {
        const createCommentData = await Comments.create({postId, userId, nickname, comment});
        return createCommentData;
    };

    //댓글 존재 여부 확인하기, 본인의 댓글 맞는지 확인하기
    findOneComment = async (commentId) => {
        const findOneComment = await Comments.findOne({_id: commentId.commentId});
        return findOneComment;
    }

    //댓글 수정
    updateComment = async (userId, commentId, comment) => {
        const updatedCommentData = await Comments.updateOne({userId, commentId}, {$set: {comment}});
        return updatedCommentData;
    };

    //댓글 삭제
    deleteComment = async (userId, commentId) => {
        const deleteCommentData = await Comments.deleteOne({userId, commentId});
        return deleteCommentData;
    };
}

module.exports = CommentsRepository;