var mongoose = require('mongoose');
const UserSchema = mongoose.Schema({
	_id:mongoose.Schema.Types.ObjectId,
    email:{
        type:String,
        require:true,
        unique: true
    },
    password:{
        type:String,
        require:true
    }
});
module.exports = User = mongoose.model('testcollections2',UserSchema);
