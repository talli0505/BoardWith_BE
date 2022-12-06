const PostsService = require("../services/posts")
const PostsRepository = require("../repositories/posts")
const Posts = require("../schema/posts");
const Users = require("../schema/users");
const _ = require('lodash');

// const paging = (page, totalPost, maxPost) => {
//     const maxPost = maxPost
//     const maxPage = maxPage

//     let currentPage = page ? parseInt(page) : 1
//     const hidePost = page === 1 ? 0 : (page - 1) * maxPost
//     const totlaPage = Math.ceil(totalPost / maxPost)
// }

class PostsController {
    postsService = new PostsService();
    postsRepository = new PostsRepository();

    createPosts = async (req, res, next) => {
        try {
            const userId = res.locals.user.userId;
            const {nickName, img} = res.locals.user
            const {title, content, location, cafe, date, time, map, partyMember, participant} = req.body;

            const closingTime = time[1];
            const nowToClose = new Date(closingTime).getTime();  //마감시간 date화

            //console.log(new Date)  //지금 시간
            //console.log(closingTime)  //마감시간
            //console.log(nowToClose) //마감시간 date화

            const createPost = await this.postsService.createPosts(userId, img, nickName, title, content, location, cafe, date, time, map, partyMember, participant, nowToClose);
            res.status(200).json({message: "게시물 생성 완료", createPost : createPost})
        } catch (e) {
            res.status(400).json({message: e.message})
        }
    }

    //게시글 검색 by 제목
    searchTitle = async (req, res, next) => {
        const {keyword} = req.params;
        const searchTitle = await this.postsService.searchTitle(keyword);
        res.status(200).json({data: searchTitle})
    }

    //게시글 검색 by 닉네임
    searchNickName = async (req, res, next) => {
        const {keyword} = req.params;
        const searchNickName = await this.postsService.searchNickName(keyword);
        res.status(200).json({data: searchNickName})
    }

    findAllPosts = async (req, res, next) => {
        const skip = req.query.skip && /^\d+$/.test(req.query.skip) ? Number(req.query.skip) : 0
        const findAllPosts = await this.postsService.findAllPosts(skip);
        res.status(200).json({data: findAllPosts})
    }

    findOnePost = async (req, res, next) => {
        try {
            const postId = req.params.postId;
            const findOnePosts = await this.postsService.findOnePost(postId);
            res.status(200).json({data: findOnePosts})
        } catch (err) {
            res.status(err.status || 400).json({statusCode: err.status, message: err.message})
        }
    }

    updatePost = async (req, res, next) => {
        try {
            const postId = req.params.postId;
            const userId = res.locals.user.userId;
            const {title, content, location, cafe, date, time, map, partyMember} = req.body
            await this.postsService.updatePost(postId, userId, title, content, location, cafe, date, time, map, partyMember);
            res.status(200).json({message: "게시물 수정을 완료하였습니다."})
        } catch (err) {
            res.status(err.status || 400).json({statusCode: err.status, message: err.message})
        }
    }

    deletePost = async (req, res, next) => {
        try {
            const postId = req.params.postId;
            const userId = res.locals.user.userId;
            await this.postsService.deletePost(postId, userId);
            res.status(200).json({message: "게시물 삭제를 완료하였습니다."})
        } catch (err) {
            res.status(err.status || 404).json({statusCode: err.status, message: err.message})
        }
    }


    participateMember = async (req, res, next) => {
        try {
            const postId = req.params.postId;
            const userId = res.locals.user.userId;
            const {nickName} = req.body
            await this.postsService.participateMember(postId, userId, nickName);
            res.status(200).json({message: "정상적으로 참가되었습니다."})
        } catch (err) {
            res.status(err.status || 400).json({statusCode: err.status, message: err.message})
        }
    }

    confirmMember = async (req, res, next) => {
        try {
            const postId = req.params.postId;
            const {nickName} = req.body
            await this.postsService.confirmMember(postId, nickName);
            res.status(200).json({message: "confirm"})
        } catch (err) {
            res.status(err.status || 400).json({statusCode: err.status, message: err.message})
        }
    }

    banMember = async (req, res, next) => {
        try {
            const {postId} = req.params;
            const {nickName} = req.body;
            await this.postsService.banMember(postId, nickName);
            res.status(200).json({message: "강퇴하였습니다."})
        } catch (err) {
            res.status(err.status || 400).json({statusCode: err.status, message: err.message})
        }
    }

    cancelBanMember = async (req, res, next) => {
        try {
            const {postId} = req.params;
            const {nickName} = req.body;
            await this.postsService.cancelBanMember(postId, nickName);
            res.status(200).json({message: "강퇴를 취소하였습니다."})
        } catch (err) {
            res.status(err.status || 400).json({statusCode: err.status, message: err.message})
        }
    }

    //파티원 모집 마감
    closeParty = async (req, res, next) => {
        const {postId} = req.params;
        const closePartyData = await this.postsService.closeParty(postId);
        res.status(200).json({message: "파티원 모집 마감", closePartyData});
    }

    //파티원 모집 리오픈
    reopenParty = async (req, res, next) => {
        const {postId} = req.params;
        const {time} = req.body;

        const nowToNewClose = new Date(time).getTime();  //새로운 마감 시간(절대적인 시점 자체) Date화

        const reopenPartyData = await this.postsService.reopenParty(postId, nowToNewClose);
        res.status(200).json({message: "파티원 모집 리오픈", reopenPartyData});
    }

    //게시글 랜덤 추출
    randomPost = async (req, res, next) => {
        try {
            const skip = req.query.skip && /^\+$/.test(req.query.skip) ? Number(req.query.skip) : 0
            const randomPost = await this.postsService.getRandomPost(skip);

            res.status(200).json({data: randomPost});
        } catch (error) {
            res.status(404).json({error: error.message});
        }
    }

    findPostsByUser = async (req, res, next) => {
        try {
            const nickName = res.locals.user.nickName
            const findPostsByUser = await this.postsService.findPostsByUser(nickName);
            res.status(200).json({data: findPostsByUser})
        } catch {
            res.status(401).json({message: "권한이 없습니다."})
        }
    }
    //북마크
    pushBookmark = async (req, res, next) => {
        const {postId} = req.body;
        const nickName = res.locals.user.nickName;
        await this.postsService.pushBookmark(postId, nickName)
        res.status(200).json({message: "추가되었습니다."})
    }

    getBookmark = async (req, res, next) => {
        try {
            const {nickName} = res.locals.user;
            const getBookmark = await this.postsService.getBookmark(nickName);
            res.status(200).json({data: getBookmark, message: "조회 완료"});
        } catch (err) {
            res.status(err.status || 400).json({statusCode: err.status, message: err.message})
        }
    }

//게시글 필터링
    filterPosts = async (req, res, next) => {
        try {
            const {map, time, partyMember} = req.body;
            const filterPosts = await this.postsService.filterPosts(map, time, partyMember);
            res.status(200).json({data: filterPosts, message: "게시글 필터링 완료"});
        } catch (e) {
            res.status(e.status || 400).json({statusCode: e.status, message: e.message });
        }
    }
}

module.exports = PostsController;