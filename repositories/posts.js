const { Posts } = require("../models");

class PostsRepository {
    
    createPosts = async( postId, userId, nickname, title, content, location, cafe, date, time, map, partyMember ) => {
        await Posts.create({ postId,userId, nickname, title, content, location, cafe, date, time, map, partyMember });
        return;
    };

    findAllPosts = async() => {
        const findAllPosts = await Posts.findAll();
        return findAllPosts;
    }
    
    findOnePost = async(postId) => {
        const findOnePosts = await Posts.findOne({where:{postId}})
        return findOnePosts;
    }

    updatePost = async(postId, userId, title, content, location, cafe, date, time, map, partyMember) => {
        await Posts.update(
            {title, content, location, cafe, date, time, map, partyMember},
            {where:{postId, userId}}
        )
        return 
    }

    deletePost = async(postId, userId) => {
        await Posts.destroy({where:{postId, userId}});
        return
    }
}

module.exports = PostsRepository;