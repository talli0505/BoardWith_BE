const PostsRepository = require("../repositories/posts"); 

class PostsService {
    postsRepository = new PostsRepository();

    
    createPosts = async( userId, nickname, title, content, location, cafe, date, time, map, partyMember) => {
        try{    
        await this.postsRepository.createPosts(
            userId, nickname, title, content, location, cafe, date, time, map, partyMember
        )        
        return
        }catch(e){
            throw { message : "양식에 맞게 작성해주세요"}
        }
    }

    findAllPosts = async() => {
        const findAllPosts = await this.postsRepository.findAllPosts();
        return findAllPosts;
    }

    findOnePost = async(postId) => {       
        const findOnePosts = await this.postsRepository.findOnePost(postId);
        if(findOnePosts.postId !== postId) {
            throw { message :"없는 게시물입니다."}
        }
        return findOnePosts;        
    }

    updatePost = async(postId, userId, title, content, location, cafe, date, time, map, partyMember) => {
        const findOnePosts = await this.postsRepository.findOnePost(postId);
        if(findOnePosts.postId !== postId) {
            throw { message :"없는 게시물입니다."}
        } 
        await this.postsRepository.updatePost(postId, userId, title, content, location, cafe, date, time, map, partyMember)
        return; 
    }
    
    deletePost = async(postId, userId) => {
        const findOnePosts = await this.postsRepository.findOnePost(postId);
        if(findOnePosts.postId !== postId) {
            throw { message :"없는 게시물입니다."}
        }        
        await this.postsRepository.deletePost(postId, userId);
        return;      
    }

    
}

module.exports = PostsService;