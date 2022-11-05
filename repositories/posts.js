const { Posts } = require("../schema");

class PostsRepository {
    
    createPosts = async( userId, nickname, title, content, location, cafe, date, time, map, partyMember ) => {
        await Posts.create({ userId, nickname, title, content, location, cafe, date, time, map, partyMember });
        return;
    };

    findAllPosts = async() => {
        const findAllPosts = await Posts.find();
        return findAllPosts;
    }
    
    findOnePost = async(postId) => {
        const findOnePosts = await Posts.findOne({_id:postId})
        return findOnePosts;
    }

    updatePost = async(postId, userId, title, content, location, cafe, date, time, map, partyMember) => {
        await Posts.updateOne(
            {id:postId, userId:userId},{$set:{title:title,content:content,location:location,cafe:cafe,date:date,time:time,map:map,partyMember:partyMember}}
        )
        return 
    }

    deletePost = async(postId, userId) => {
        await Posts.destroy({id:postId, userId:userId});
        return
    }
}

module.exports = PostsRepository;