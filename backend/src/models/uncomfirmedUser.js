const {Schema, model} = require('mongoose');
const {ObjectID}=Schema.Types;


const UnconfirmedUserSchema = new Schema({
    name:{
        type: String,
        required: true,
        unique:true
    },
    email:{
        type: String,
        required: true,
        unique:true
    },
    password:{
        type: String,
        required: true
    },
    pic:{
        type:String,
        default:"https://res.cloudinary.com/dniykkyhc/image/upload/v1607013402/user_poyqf2.png"
    }

});

module.exports = model('UnconfirmedUser', UnconfirmedUserSchema);