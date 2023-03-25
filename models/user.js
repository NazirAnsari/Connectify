const mongoose = require('mongoose');

const multer = require('multer');
const path = require('path');
//defining path -AVATAR_PATH is just a variable where we will define path  which will be exported
const AVATAR_PATH = path.join('/uploads/users/avatars'); //this string converted to path using path module defined above

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required : true, //means without having an email value user want be created in the database..mongoose will throw an error that email not passed
        unique: true     //unique emails
    },
    password: {
        type : String,
        required: true
    },
    name : {
        type : String, 
        required: true
    },
    avatar:{
        type:String
    }
},{
    timestamps: true //user created at and updated at stored in database, this feature is managed by mongoose
});

let storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,path.join(__dirname,'..',AVATAR_PATH));
    },
    filename: function(req,file, cb){
        cb(null, file.fieldname + '-' + Date.now());
    }
});

//static function
userSchema.statics.uploadedAvatar = multer({storage: storage}).single('avatar')  //attaches disk storage in multer in the Storage properties  /we defined different properties now we need to assign it to multer for this project
//.single('avatar') -- it says only one file will be uploaded for the field name avatar..so we will send only one file instead of array of files

//defining avatarPath because we need AVATAR_PATH to be available publically for user model.here it gets saved
userSchema.statics.avatarPath = AVATAR_PATH; //made AVATAR_PATH publically available for the user model and uploadedAvatar is a function

//telling mongoose that this is the modal
//it refers to userSchema
const User = mongoose.model('User', userSchema);

//exporting
module.exports = User;
