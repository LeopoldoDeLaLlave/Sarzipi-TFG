const {Schema, model} = require('mongoose');
const {ObjectID}=Schema.Types;


const userSchema = new Schema({
    name:{
        type: String,
        required: true,
        unique:true
    },
    bio:{
        type: String,
        required: false,
        unique:false
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
    isConfirmed:{
        type: Boolean,
        required: true,
        default: false
    },
    pic:{
        type:String,
        default:"https://res.cloudinary.com/dniykkyhc/image/upload/v1607013402/user_poyqf2.png"
    },
    followers:[{type:ObjectID, ref:"User"}],
    following:[{type:ObjectID, ref:"User"}],
    followingHastags:[{text:String}]

});

module.exports = model('User', userSchema);