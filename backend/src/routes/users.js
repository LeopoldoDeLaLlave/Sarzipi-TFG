const { Router } = require("express");
const router = Router();

const requireLogin = require('../middlewares/requireLogin');
const { getUser,
    putFollow,
    putUnfollow,
    searchUsers,
    followHastag } = require('../controllers/otherusers.controllers');

router.get('/user/:id', requireLogin, getUser);

router.put('/follow', requireLogin, putFollow);

router.put('/unfollow', requireLogin, putUnfollow);

router.put('/followhastag', requireLogin, followHastag);

router.post('/search-users', searchUsers);



module.exports = router;