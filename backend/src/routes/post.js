const { Router } = require("express");
const router = Router();

const requireLogin = require('../middlewares/requireLogin');
const { createPost,
    getAllPost,
    getUsersPosts,
    putLike,
    checkLikes,
    putUnlike,
    putComment,
    deletePost,
    getSubPost,
    deleteComment,
    getOneRecipe } = require('../controllers/posts.controllers');


router.post('/createpost', requireLogin, createPost);

router.get('/allpost', requireLogin, getAllPost);

router.get('/getsubpost', requireLogin, getSubPost);

router.get('/receta/:postid', requireLogin, getOneRecipe);

router.get('/mypost', requireLogin, getUsersPosts);

router.put('/like', requireLogin, putLike);

router.put('/unlike', requireLogin, putUnlike);

router.put('/checklikes', requireLogin, checkLikes);

router.put('/comment', requireLogin, putComment);

router.delete('/deletecomment/:postid/:commentid', requireLogin, deleteComment);

router.delete('/deletepost/:postid', requireLogin, deletePost);





module.exports = router;