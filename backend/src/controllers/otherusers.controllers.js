//Controla la relación entre usuarios

const bcrypt = require('bcryptjs');
const otheruserCtrl = {};
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const Post = require('../models/post');

//Obtiene el perfil de otro usuario
otheruserCtrl.getUser = async (req, res) => {


    try {
        const user = await User.findOne({ _id: req.params.id }).select("-password");
        Post.find({ postedBy: req.params.id })
            .populate("postedBy", "_id name")
            .exec((error, posts) => {
                if (error) {
                    return res.status(422).json({ error })
                }
                res.json({ user, posts });
            })

    } catch (error) {
        return res.status(404).json({ error: "User not found" })
    }
}


//Sigue a otro usuario
otheruserCtrl.putFollow = (req, res) => {


    try {
        User.findByIdAndUpdate(req.body.followId, {
            $push: { followers: req.user._id }
        }, {
            new: true
        }, async (err, result) => {
            if (err) {
                return res.status(422).json({ error: err })
            }
            const followingResult = await User.findByIdAndUpdate(req.user._id, {
                $push: { following: req.body.followId }
            }, {
                new: true
            }).select("-password");
            res.json({ result: followingResult })
        });



    } catch (error) {
        return res.status(422).json({ error })
    }
}




//Da unfollow a otro usuario
otheruserCtrl.putUnfollow = (req, res) => {



    try {
        User.findByIdAndUpdate(req.body.unfollowId, {
            $pull: { followers: req.user._id }
        }, {
            new: true
        }, async (err, result) => {
            if (err) {
                return res.status(422).json({ error: err })
            }
            const unfollowingResult = await User.findByIdAndUpdate(req.user._id, {
                $pull: { following: req.body.unfollowId }
            }, {
                new: true
            }).select("-password");
            res.json({ result: unfollowingResult })
        });



    } catch (error) {
        return res.status(422).json({ error })
    }
}



//Busca usuarios
otheruserCtrl.searchUsers = async (req, res) => {



    try {
        let userPattern = new RegExp("^" + req.body.query)
        const _user = await User.find({ email: { $regex: userPattern } })
            .select("_id email");

        res.json({ user: _user })

    } catch (error) {
        console.log(error)
    }
}




//Sigue una etiqueta
otheruserCtrl.followHastag = async(req, res) => {

    try {

        const followingResult = await User.findByIdAndUpdate(req.user._id, {
            $push: { followingHastags: {text: req.body.etiqueta} }
        }, {
            new: true
        }).select("-password");
        console.log(followingResult);
        res.json({ result: followingResult })

    } catch (error) {
        console.log(error);
        return res.status(422).json({ error })
    }
}


//Da unfollow a una etiqueta
otheruserCtrl.unfollowHstag = async (req, res) => {



    try {
        
            const unfollowingResult = await User.findByIdAndUpdate(req.user._id, {
                $pull: { followingHastags: {text: req.body.etiqueta} }
            }, {
                new: true
            }).select("-password");
            res.json({ result: unfollowingResult })
       



    } catch (error) {
        return res.status(422).json({ error })
    }
}

module.exports = otheruserCtrl;