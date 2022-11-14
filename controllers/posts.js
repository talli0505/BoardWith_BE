const PostsService = require("../services/posts") 

// const paging = (page, totalPost, maxPost) => {
//     const maxPost = maxPost
//     const maxPage = maxPage

//     let currentPage = page ? parseInt(page) : 1
//     const hidePost = page === 1 ? 0 : (page - 1) * maxPost
//     const totlaPage = Math.ceil(totalPost / maxPost)
// }

class PostsController {
    postsService = new PostsService();

    createPosts = async (req, res, next) => {
        try{
            const userId = res.locals.user.userId;
            const {nickName} = res.locals.user
            const { title, content, location, cafe, date, time, map, partyMember } =req.body;

            const closingTime = time[1];
            // const openTime = time[0];
            const nowToClose = new Date(closingTime).getTime();  //마감시간 date화
            // const timeDiff = new Date(closingTime).getTime() - new Date(openTime).getTime();  //마감시간 - 현재시간

            console.log(new Date)  //지금 시간
            console.log(closingTime)  //마감 시간
            console.log(nowToClose) //마감시간 date화
            // console.log(timeDiff)  //마감시간 - 오픈시간

            await this.postsService.createPosts( userId, nickName, title, content, location, cafe, date, time, map, partyMember, nowToClose);
            res.status(200).json({message:"게시물 생성 완료"})
        }catch(e) {
            res.status(400).json({message: e.message})
        }
    }

    findAllPosts = async (req, res, next) => {
        const skip = req.query.skip && /^\d+$/.test(req.query.skip) ? Number(req.query.skip) : 0
        const findAllPosts = await this.postsService.findAllPosts(skip);
        res.status(200).json({ data : findAllPosts })
    }

    findOnePost = async (req, res, next) => {
        try{
        const postId = req.params.postId;
        const findOnePosts = await this.postsService.findOnePost(postId);
        res.status(200).json({ data : findOnePosts })
        }catch(e){
            res.status(400).json({message: e})
        }
    }

    updatePost = async (req, res, next) => {
        try{
        const postId = req.params.postId;
        const userId = res.locals.user.userId;
        const { title, content, location, cafe, date, time, map, partyMember } = req.body
        await this.postsService.updatePost( postId, userId, title, content, location, cafe, date, time, map, partyMember );
        res.status(200).json({ message : "게시물 수정을 완료하였습니다."})
        }catch(e){
            res.status(400).json({message : e})
        }
    }

    deletePost = async(req, res, next) => {
        try{
        const postId = req.params.postId;
        const userId= res.locals.user.userId;
        await this.postsService.deletePost(postId, userId);
        res.status(200).json({message:"게시물 삭제를 완료하였습니다."})
        }catch(e){
            res.status(400).json({message: e})
        }
    }

    
    participateMember = async (req, res, next) => {
        try{
        const postId = req.params.postId;
        const userId = res.locals.user.userId;
        const { nickName } = req.body
        await this.postsService.participateMember( postId, userId, nickName );
        res.status(200).json({message:"정상적으로 참가되었습니다."})
        }catch(e){
            res.status(409).json({message:e})
        }
    }

    deleteMember = async (req, res, next) => {
        const { postId } = req.params;
        const { userId } = req.body;
        

    }
}

module.exports = PostsController;