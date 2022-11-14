const PostsRepository = require("../repositories/posts");
const { findOne } = require("../schema/posts");

class PostsService {
    postsRepository = new PostsRepository();

    createPosts = async( userId, nickName, title, content, location, cafe, date, time, map, partyMember, nowToClose) => {
        try{
            await this.postsRepository.createPosts(userId, nickName, title, content, location, cafe, date, time, map, partyMember, nowToClose)
            return
        }catch(e){
            throw { message : "양식에 맞게 작성해주세요"}
        }
    }

    findAllPosts = async(skip) => {
        const findAllPosts = await this.postsRepository.findAllPosts(skip);
        return findAllPosts;
    }

    findOnePost = async(postId) => {
        try{
            const findOnePosts = await this.postsRepository.findOnePost(postId);
            return findOnePosts;
        }catch(e){
            throw "없는 게시물이거나 경로요청이 잘못되었습니다."
        }
    }

    updatePost = async(postId, userId, title, content, location, cafe, date, time, map, partyMember) => {
        try{
            const findOnePosts = await this.postsRepository.findOnePost(postId);
            console.log(findOnePosts)
            if(findOnePosts._id.toString() !== postId){
                throw "없는 게시물입니다."
            }
            await this.postsRepository.updatePost(postId, userId, title, content, location, cafe, date, time, map, partyMember)
            return
        }catch{
            throw "없는 게시물이거나 경로요청이 잘못되었습니다."
        }
    }

    deletePost = async(postId, userId) => {
        try{
            const findOnePosts = await this.postsRepository.findOnePost(postId);
            if(findOnePosts._id.toString() !== postId){
                throw "없는 게시물입니다."
            }
            await this.postsRepository.deletePost(postId, userId);
            return findOnePosts
        }catch(e){
            throw "없는 게시물이거나 경로요청이 잘못되었습니다."
        }
    }


}

module.exports = PostsService;