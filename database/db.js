var mongoose = require('mongoose');
var db = mongoose.createConnection('mongodb://localhost/sync'); //；连接数据库
mongoose.Promise = require('bluebird');
var Schema = mongoose.Schema; //  创建模型
var ObjectId = mongoose.Schema.Types.ObjectId;

var orderSchema = new Schema({
	orderID: {
		type:String,
		unique: true
	},
	itemID: {
		type:String,
		required: true
	},
	itemName: {
		type:String,
		required: true
	},
	buyerName: {
		type:String,
		required: true
	},
	buyerPhone: {
		type:String,
		required: true
	},
	buyerAddress: {
		type:String,
		required: true
	}
}); 

var itemSchema = new Schema({
	itemID: {
		type:String,
		unique: true
	},
	itemName: {
		type:String,
		required: true
	},
	itemType: {
		type:String,
		required: true
	},
	itemImg: {
		type:Array
	}
}); 

var userSchema = new Schema({
	userID: {
		type:String,
		unique: true
	},
	userPWD: String,
	role: {
		type:String,
		required: true
	},
	userName:{
		type:String,
		required: true
	},
	userPhone:String,
	userEmail:String
}); 

module.exports.orders = db.model('orders', orderSchema);
module.exports.items = db.model('items', itemSchema);
module.exports.users = db.model('users', userSchema);

