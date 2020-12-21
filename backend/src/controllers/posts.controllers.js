const postCtrl = {};


const Post = require('../models/post');
//Creamos un post
postCtrl.createPost = async (req, res) => {
    const { title, body, photo } = req.body;

    if (!title || !body || !photo) {
        res.status(422).json({ error: "Please add all the fields" });
    }

    req.user.password = undefined;
    const post = new Post({
        title,
        body,
        photo,
        postedBy: req.user
    });

    try {
        const result = await post.save();
        res.json({ post: result });
    } catch (error) {
        console.log(error);
        res.json({ error });
    }

};


postCtrl.getAllPost = async (req, res) => {

    try {
        const posts = await Post.find()
        .populate("postedBy", "_id name")
        .populate("comments.postedBy","_id name").
        sort('-createdAt'); 
        res.json({ posts });
    } catch (error) {
        console.log("error");
    }

};
 

postCtrl.getSubPost = async (req, res) => {

    try {
        const posts = await Post.find({postedBy:{$in:req.user.following}})
        .populate("postedBy", "_id name")
        .populate("comments.postedBy","_id name").
        sort('-createdAt');;
        res.json({ posts });
    } catch (error) {
        console.log("error");
    }

};

//Obtiene todos los posts de un usuario concreto
postCtrl.getUsersPosts = async (req, res) => {

    try {

        const myPosts = await Post.find({ postedBy: req.user._id }).populate("postedBy", "_id name");
        res.json({ myPosts });

    } catch (error) {

    }
}

//Le añade un like a la publicación
postCtrl.putLike = (req, res) => {

    try {
        Post.findByIdAndUpdate(req.body.postId, {
            $push: { likes: req.user._id }
        }, {
            new: true
        }).populate("postedBy", "_id name")
        .populate("comments.postedBy", "_id name")
            .exec((err, result) => {
                if (err) {
                    return res.status(422).json({ error: err })
                } else {

                    res.json(result)
                }
            })


    } catch (error) {
        return res.status(422).json({ error: err })
    }
}

//Quita like a la publicación
postCtrl.putUnlike = (req, res) => {

    try {
        Post.findByIdAndUpdate(req.body.postId, {
            $pull: { likes: req.user._id }
        }, {
            new: true
        }).populate("postedBy", "_id name")
        .populate("comments.postedBy", "_id name")
            .exec((err, result) => {
                if (err) {
                    return res.status(422).json({ error: err })
                } else {

                    res.json(result)
                }
            })


    } catch (error) {
        return res.status(422).json({ error: err })
    }
}


//Comprueba si el usuario que está dando like ya ha dado like
postCtrl.checkLikes = async (req, res) => {


    try {
        const myPost = await Post.findById(req.body.postId);


        if (myPost.likes.find(element => JSON.stringify(element) == JSON.stringify(req.user._id))) {
            res.json({ presente: true });
        } else {
            res.json({ presente: false });
        }



    } catch (err) {
        return res.status(422).json({ error: err })
    }
}



//Añade un comentario a un post
postCtrl.putComment = (req, res) => {

    const comment = {
        text: req.body.text,
        postedBy: req.user._id
    };
    try {
        Post.findByIdAndUpdate(req.body.postID, {
            $push: { comments: comment }
        }, {
            new: true
        }).populate("comments.postedBy", "_id name")
        .populate("postedBy", "_id name")
            .exec((err, result) => {
                if (err) {
                    return res.status(422).json({ error: err })
                } else {
                    res.json(result)
                }
            })


    } catch (error) {
        console.log(error);
    }
}


//Borra un post
postCtrl.deletePost = async (req, res) => {

    try {
        Post.findOne({_id:req.params.postid}).
        populate("postedBy","_id")
        .exec(async(err, post)=>{
            if(err || !post){
                return res.status(422).json({ error: err })
            }

            if(post.postedBy._id.toString() === req.user._id.toString()){
                const result = await post.remove();
                res.json(result)
            }
        });
        

    } catch (error) {
        console.log(error);
    }
}

module.exports = postCtrl;