const CommentsRepository = require('../repositories/comments');

class CommentsService {
    commentsRepository = new CommentsRepository();
    //댓글 전체 목록 보기
    findAllComments = async (postId) => {
        const findAllCommentResult = await this.commentsRepository.findAllComments(postId);
        const mapComments = findAllCommentResult.map((item) => {
            return {
                _id: item._id,
                postId: item.postId._id,
                banuUser: item.postId.banUser,
                participant: item.postId.participant,
                confirmMember: item.postId.confirmMember,
                userId: item.userId,
                nickName: item.nickName,
                gender: item.gender,
                age: item.age,
                myPlace: item.myPlace,
                comment : item.comment,
                createdAt: item.createdAt,
                updatedAt: item.updatedAt,
                userAvatar: item.userAvatar,
                confirmOrNot: item.postId.confirmMember.includes(item.nickName),
                banOrNot: item.postId.banUser.includes(item.nickName),

            }
        })
        return mapComments;
    }

    //게시글 존재 여부 확인
    findOnePost = async (postId) => {
        const findOnePost = await this.commentsRepository.findOnePost(postId);
        if (!findOnePost) {
            throw new Error("게시글이 없어요!!");
        } else {
            return findOnePost;
        }
    }

    //신규 댓글
    createComment = async (postId, userId, nickName, birth, gender, myPlace, comment) => {
        const createCommentResult = await this.commentsRepository.createComment(postId, userId, nickName, birth, gender, myPlace, comment);
        return createCommentResult;
    };

    //댓글 존재 여부 확인하기, 본인의 댓글 맞는지 확인하기 for update
    findOneComment = async (commentId) => {
        const findOneComment = await this.commentsRepository.findOneComment({commentId});
        if (!findOneComment) {
            throw new Error("댓글이 없어요!!");
        }
        return findOneComment;
    }

    //댓글 수정
    updateComment = async (userId, commentId, comment) => {
        await this.commentsRepository.updateComment(userId, commentId, comment);
        const commentResult = await this.commentsRepository.findComment(userId, commentId);
        return commentResult;
    };

    //댓글 존재 여부 확인하기 for delete
    findOneCommentforDelete = async (commentId) => {
        const findOneComment = await this.commentsRepository.findOneCommentforDelete(commentId);
        return findOneComment;
    }

    //본인 댓글 여부 확인 후 댓글 삭제
    deleteComment = async (commentId) => {
        const deletedCommentResult = await this.commentsRepository.deleteComment(commentId);
        // console.log(deletedCommentResult, "service")
        return deletedCommentResult;
    };
}

module.exports = CommentsService;