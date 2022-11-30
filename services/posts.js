const PostsRepository = require("../repositories/posts");
const Posts = require("../schema/posts")
const shuffle_array = require("shuffle-array")

class PostsService {
    postsRepository = new PostsRepository();

    createPosts = async( userId, img, nickName, title, content, location, cafe, date, time, map, partyMember, participant, nowToClose) => {
        if(!title || !content || !location || !cafe || !date || !time || !map || !partyMember){
            const err = new Error('postService Error');
            err.status = 403;
            err.message = "빈칸을 입력해주세요."
            throw err;
        } else {
            const createPosts = await this.postsRepository.createPosts(userId, img, nickName, title, content, location, cafe, date, time, map, partyMember, participant, nowToClose)
            return createPosts
        }
    }

    //게시글 검색 by 제목
    searchTitle = async(keyword) => {
        const searchTitle = await this.postsRepository.searchTitle(keyword)
        return searchTitle
    }

    //게시글 검색 by 닉네임
    searchNickName = async(keyword) => {
        const searchNickName = await this.postsRepository.searchNickName(keyword)
        return searchNickName
    }

    findAllPosts = async(skip, keyword) => {
        const findAllPosts = await this.postsRepository.findAllPosts(skip, keyword);
        return findAllPosts;
    }

    findOnePost = async(postId) => {
        try{
            const findOnePosts = await this.postsRepository.findOnePost(postId);
            console.log(findOnePosts)
            return findOnePosts;
        }catch(err){
            err.status = 404
            err.message = "게시물이 없습니다."
            throw err;
        }
    }

    updatePost = async(postId, userId, title, content, location, cafe, date, time, map, partyMember) => {
        if(!title || !content || !location || !cafe || !date || !time || !map || !partyMember){
            const err = new Error('postService Error');
            err.status = 403;
            err.message = "빈칸을 입력해주세요."
            throw err;
        }
        const findOnePost = await this.postsRepository.findOnePost(postId)
        if(findOnePost._id.toString() !== postId){
            const err = new Error('postService Error');
            err.status = 404;
            err.message = "게시물이 없습니다."
            throw err
        }
        await this.postsRepository.updatePost(postId, userId, title, content, location, cafe, date, time, map, partyMember)
        return
    }

    deletePost = async(postId, userId) => {
        try{
            await this.postsRepository.deletePost(postId, userId);
            return
        }catch(err){
            err.status = 404
            err.message = "경로 요청이 잘못되었습니다."
            throw err
        }
    }

    participateMember = async (postId,userId, nickName) => {
        const findMembersLength = await this.postsRepository.findOnePost(postId)
        if( findMembersLength.partyMember <= (findMembersLength.participant.length - 1) ){
            throw "참가 마감되었습니다."
        } else if( findMembersLength.partyMember > findMembersLength.participant.length ){
            await this.postsRepository.participateMember(postId, userId, nickName)
        }
        return
    }

    //participate => confirm
    confirmMember = async (postId, nickName) => {
        const confirmMember = await this.postsRepository.confirmMember(postId, nickName)
        if(confirmMember.participant.includes(nickName)) {
            await this.postsRepository.pushconfirmMember(postId, nickName)
        } else {
            await this.postsRepository.pullconfirmMember(postId,nickName)
        }
        return confirmMember
    }

    banMember = async(postId,nickName) => {
        await this.postsRepository.banMember(postId, nickName)
        return
    }

    cancelBanMember = async(postId, nickName) => {
        await this.postsRepository.cancelBanMember(postId, nickName)
        return
    }

    //파티원 모집 마감
    closeParty = async(postId) => {
        const closeParty = await this.postsRepository.closeParty(postId);
        return {
            userId: closeParty.userId,
            nickName: closeParty.nickName,
            title: closeParty.title,
            time: closeParty.time,
            expireAt: closeParty.expireAt,
            closed: closeParty.closed
        }
    }

    //파티원 모집 리오픈
    reopenParty = async(postId, nowToNewClose) => {
        const reopenParty = await this.postsRepository.reopenParty(postId, nowToNewClose)
        return {
            userId: reopenParty.userId,
            nickName: reopenParty.nickName,
            title: reopenParty.title,
            time: reopenParty.time,
            expireAt: reopenParty.expireAt,
            closed: reopenParty.closed
        }
    }

    //게시글 랜덤 추출
    getRandomPost = async(skip) =>{
        console.log("진입은 됨?")
        const getRandomPost = await this.postsRepository.findAllPostsForRandomExtract(skip);
        let getRandomPostResult = new Array();

        for (let i = 0; i < getRandomPost.length; i++) {
            getRandomPostResult.push(getRandomPost[i])
        }

        shuffle_array(getRandomPostResult);
        let slicedGetRandomPostResult = getRandomPostResult.slice(0, 5);
        return slicedGetRandomPostResult;
    }

    findPostsByUser = async(nickName) => {
        const findPostsByUser = await this.postsRepository.findPostsByUser(nickName)
        return findPostsByUser
    }

    //북마크
    pushBookmark = async(postId, nickName) => {
        const findBookmark = await this.postsRepository.findBookmark(postId, nickName)
        if(!findBookmark.postId.includes(postId)){
            await this.postsRepository.pushBookmark(postId, nickName)
        } else if(findBookmark.postId.includes(postId)){
            await this.postsRepository.pullBookmark(postId, nickName)
        }
        return findBookmark
    }

    getBookmark = async(nickName) => {
        let result = []
        const getBookmark = await this.postsRepository.getBookmark(nickName);
        const GetBookmark = getBookmark.map((p) => p.postId)
        for (let i = 0; i < GetBookmark.length; i++){
            const AllgetBookmark = await this.postsRepository.AllgetBookmark(GetBookmark[i])
            if(AllgetBookmark.length === 0) {
                const err = new Error('postsService Error');
                err.status = 200
                err.message = "등록된 게시물이 없습니다."
                throw err
            } else if(AllgetBookmark.length !== 0){
                result.push(AllgetBookmark)
            }
            console.log(AllgetBookmark.length)
        }
        return result
    }
}

module.exports = PostsService;