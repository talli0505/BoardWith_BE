const PostsRepository = require("../repositories/posts");
const shuffle_array = require('shuffle-array');

class PostsService {
    postsRepository = new PostsRepository();

    createPosts = async( userId, nickName, title, content, location, cafe, date, time, map, partyMember, participant, nowToClose) => {     
        if(!title || !content || !location || !cafe || !date || !time || !map || !partyMember){
            const err = new Error('postService Error');
            err.status = 403;
            err.message = "빈칸을 입력해주세요."
            throw err;
        } else {
            await this.postsRepository.createPosts(userId, nickName, title, content, location, cafe, date, time, map, partyMember, participant, nowToClose)
        }
        return    
    }

    findAllPosts = async(skip) => {
        const findAllPosts = await this.postsRepository.findAllPosts(skip);
        return findAllPosts;
    }

    findOnePost = async(postId) => {
        try{   
        const findOnePosts = await this.postsRepository.findOnePost(postId);
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
        if(findOnePost._id.toString() == null){
            const err = new Error('postService Error');
            err.status = 404;
            err.message = "게시물이 없습니다."
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
        await this.postsRepository.closeParty(postId)
        return
    }

    //파티원 모집 리오픈
    reopenParty = async(postId, nowToNewClose) => {
        await this.postsRepository.reopenParty(postId, nowToNewClose)
        return
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
}

module.exports = PostsService;