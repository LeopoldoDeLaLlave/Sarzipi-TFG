const bcrypt = require('bcryptjs');
const userCtrl = {};
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const nodemailer = require('nodemailer');
const sendGridTransport = require('nodemailer-sendgrid-transport');

//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

const transporter = nodemailer.createTransport(sendGridTransport({
    auth: {
        api_key: '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'
    }
}));

//Crear nuevos usuarios
userCtrl.signUpUser = async (req, res) => {
    const { name, email, password, pic } = req.body;

    //Comprobamos que hay aintroducido todos los datos
    if (!name || !email || !password) {
        return res.status(422).json({ "error": "faltan datos" });
    }

    try {

        //Comprobamos si el mail ya está registrado
        const savedUser = await User.findOne({ email: email });

        if (savedUser) {
            return res.status(422).json({ "error": "usuario ya registrado" });
        }
        //Protegemos la contraseña
        hashedPassword = await bcrypt.hash(password, 12);
        //Creamos el nuevo usuario
        const user = new User({
            name,
            email,
            password: hashedPassword,
            pic
        });

        try {
            await user.save(user.email);
            console.log(user.email);
            transporter.sendMail({
                    to:user.email,
                    from:"sarzipi@gmail.com",
                    subject:"signup success",
                    html:"<h1>welcome to instagram</h1>"
                })
            res.json({ "message": "saved succesfully" });
        } catch (error) {
            console.log(error);
        }

    } catch (error) {
        console.log(error);
    }
};

//Apertura de sesión de usuarios ya registrados
userCtrl.signInUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(422).json({ "error": "please add email or password" });
    }

    try {
        const savedUser = await User.findOne({ email: email });
        if (!savedUser) {
            return res.status(422).json({ "error": "Invalid email or password" });
        }

        doMatch = await bcrypt.compare(password, savedUser.password);

        if (doMatch) {
            const token = jwt.sign({ id: savedUser._id }, process.env.JSW_SECRET);
            const { _id, name, email, followers, following, pic } = savedUser;
            res.json({ token, user: { _id, name, email, followers, following, pic } });
        } else {
            return res.status(422).json({ "error": "Invalid email or password" });
        }
    } catch (error) {
        console.log(error);
    }
};


userCtrl.updatePic = async (req, res) => {
    User.findByIdAndUpdate(req.user._id, { $set: { pic: req.body.pic } }, { new: true },
        (err, result) => {
            if (err) {
                console.log(err);
                return res.status(422).json({ error: "pic can not post" })
            }
            res.json(result);
        });
};


userCtrl.accesToProtected = async (req, res) => {
    res.send("Hello user");
};


module.exports = userCtrl;