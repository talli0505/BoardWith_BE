
const Posts = require("../schema/posts"); 

class PostsRepository {
    
    createPosts = async( userId, nickname, title, content, location, cafe, date, time, map, partyMember ) => {
        await Posts.create({ userId, nickname, title, content, location, cafe, date, time, map, partyMember });
        return;
    };

    findAllPosts = async(skip) => {
        const findAllPosts = await Posts.find({}, undefined, {skip, limit:5}).sort('title');
        return findAllPosts;
    }
    
    findOnePost = async(postId) => {
        const findOnePosts = await Posts.findOne({_id:postId})
        return findOnePosts;
    }

    updatePost = async(postId, userId, title, content, location, cafe, date, time, map, partyMember) => {
        await Posts.updateOne(
            {_id:postId, userId:userId},{$set:{title:title,content:content,location:location,cafe:cafe,date:date,time:time,map:map,partyMember:partyMember}}
        )
        return 
    }

    deletePost = async(postId, userId) => {
        await Posts.deleteOne({_id:postId, userId:userId});
        return
    }
}

module.exports = PostsRepository;