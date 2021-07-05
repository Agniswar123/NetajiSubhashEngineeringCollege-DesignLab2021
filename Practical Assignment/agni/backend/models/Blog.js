var mongoose = require('mongoose');
const BlogSchema = mongoose.Schema({

	_id:mongoose.Schema.Types.ObjectId,
    title:{
        type: String,
        require: true,
    },
    content:{
        type: String,
        require: true
    },
    imageLink:{
        type: String,
        require: true
    },
    email:{
        type: String,
        require: true
    }
});
module.exports = User = mongoose.model('testcollections1',BlogSchema);
