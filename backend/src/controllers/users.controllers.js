const bcrypt = require('bcryptjs');
const userCtrl = {};
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const nodemailer = require('nodemailer');

//Transporter con los datos desde donde voy a mandar correos
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'sarzipicr@gmail.com',
        pass: process.env.GMAIL_PASSWORD
    }
});

//Crea un objeto con la opciones del mail
class mailOptions {
    constructor(_to, name) {
        this.from = 'sarzipicr@gmail.com';
        this.to = _to;
        this.subject = 'Registro en Sarzipi';
        this.html= '<h1>Bienvenido '+ name +'!</h1><p>Gracias por registrarte</p>'
    }
}

//Crear nuevos usuarios
userCtrl.signUpUser = async (req, res) => {
    const { name, email, password, pic } = req.body;

    //Comprobamos que hay aintroducido todos los datos
    if (!name || !email || !password) {
        return res.status(422).json({ "error": "faltan datos" });
    }

    try {

        //Comprobamos si el mail o el nombre ya está registrado
        const savedUser = await User.findOne({ name });
        const savedMail = await User.findOne({ email });

        if (savedUser || savedMail) {
            return res.status(422).json({ "error": "usuario ya registrado" });
        }
        //Protegemos la contraseña
        hashedPassword = await bcrypt.hash(password, 12);
        //Creamos el nuevo usuario
        const user = new User({
            name,
            email,
            bio: "",
            password: hashedPassword,
            pic
        });

        try {
            await user.save(user.email);
            transporter.sendMail(new mailOptions(user.email, user.name)).
                then((error, info) => {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });

            res.json({ "message": "saved succesfully" });
        } catch (error) {
            console.log(error);
        }

    } catch (error) {
        return res.status(422).json({ error });
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
            const { _id, name, email, bio, followers, following, followingHastags, pic } = savedUser;
            res.json({ token, user: { _id, name, email, bio, followers, following, followingHastags, pic } });
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

//Actualiza la biografia de un usuario
userCtrl.updateBio = async (req, res) => {

    if (req.body.bio.length > 140) {
        return res.status(422).json({ "error": "please add email or password" });
    }
    User.findByIdAndUpdate(req.user._id, { $set: { bio: req.body.bio } }, { new: true },
        (err, result) => {
            if (err) {
                console.log(err);
                return res.status(422).json({ error: "bio can not post" })
            }
            res.json(result);
        });
};


userCtrl.accesToProtected = async (req, res) => {
    res.send("Hello user");
};


module.exports = userCtrl;