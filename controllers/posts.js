const PostsService = require("../services/posts")

class PostsController {
    postsService = new PostsService();

    createPosts = async (req, res, next) => {
        try{
        const userId = res.locals.user.userId;
        const nickname = res.locals.user.nickname;
        const { title, content, location, cafe, date, time, map, partyMember } =req.body;
        await this.postsService.createPosts( userId, nickname, title, content, location, cafe, date, time, map, partyMember );
        res.status(200).json({message:"게시물 생성 완료"})
        }catch(e) {
            res.status(400).json({message: e.message})
        }
    }

    findAllPosts = async (req, res, next) => {
        const findAllPosts = await this.postsService.findAllPosts();
        res.status(200).json({ data : findAllPosts })
    }

    findOnePost = async (req, res, next) => {
        try{
        const postId = req.params.postId;
        const findOnePosts = await this.postsService.findOnePost(postId);
        res.status(200).json({ data : findOnePosts })
        }catch(e){
            res.status(400).json({message: e.message})
        }
    }

    updatePost = async (req, res, next) => {
        try{
        const postId = req.params.postId;
        const userId = res.locals.user.userId;
        const { title, content, location, cafe, date, time, map, partyMember } = req.body
        await this.postsService.updatePost(postId, userId, title, content, location, cafe, date, time, map, partyMember);
        res.status(200).json({ message : "게시물 수정을 완료하였습니다."})
        }catch(e){
            res.status(400).json({message : e.message})
        }
    }

    deletePost = async(req, res, next) => {
        try{
        const postId = req.params.postId;
        const userId= res.locals.user.userId;
        console.log(postId,userId)
        await this.postsService.deletePost(postId, userId);
        res.status(200).json({message:"게시물 삭제를 완료하였습니다."})
        }catch(e){
            res.status(400).json({message: e.message})
        }
    }
}

module.exports = PostsController;