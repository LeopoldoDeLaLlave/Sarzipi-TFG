const { Router } = require("express");
const router = Router();
const requireLogin = require('../middlewares/requireLogin');


const { signInUser,
    signUpUser,
    accesToProtected,
    updatePic,
    updateBio,
    confirmAccount } = require('../controllers/users.controllers');


router.route('/signin').
    post(signInUser);

router.route('/signup').
    post(signUpUser);

router.get('/', (req, res) => {
    res.send('Hello');
});

router.get('/protected', requireLogin, (req, res) => {
    res.send('Hello user');
});

router.put('/updatepic', requireLogin, updatePic);

router.put('/updatebio', requireLogin, updateBio);


router.put('/confirmaccount/:id', confirmAccount);


module.exports = router;