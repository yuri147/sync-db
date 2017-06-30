var express = require('express');
var router = express.Router();
var users = require('../database/db').users;

router.all('/login', function(req, res) {
	var userID = req.body.userID || req.query.userID;
	var userPWD = req.body.userPWD || req.query.userPWD;
	if (!userID || !userPWD) {
		res.send({
			result: 'fail',
			message: 'userID and userPWD must be filed'
		});
	}
	var content = {
		userID: userID,
		userPWD: userPWD
	};
	var field = {
		userID: 1,
		userPWD: 1,
		role: 1,
		userName: 1,
		userPhone: 1,
		userEmail: 1,
	};
	users.find(content, field, function(err, result) {
		if (err) {
			console.log(err);
		} else {
			res.send({
				result: result
			});
		}
	});
})

router.get('/list', function(req, res) {
	var query = {};
	var result = {};
	var content = {};
	var field = {
		userID: 1,
		userPWD: 1,
		role: 1,
		userName: 1,
		userPhone: 1,
		userEmail: 1,
	};
	users.find(content, field, function(err, result) {
		if (err) {
			res.send({
				result: 'fail',
				message: err
			});
		} else {
			res.send({
				result: result
			});
		}
	});
});

router.all('/insert', function(req, res) {
	var userID = req.body.userID || req.query.userID;
	var userPWD = req.body.userPWD || req.query.userPWD;
	var role = req.body.role || req.query.role;
	var userName = req.body.userName || req.query.userName;
	var userPhone = req.body.userPhone || req.query.userPhone;
	var userEmail = req.body.userEmail || req.query.userEmail;
	if (!userID || !userPWD) {
		res.send({
			result: 'fail',
			message: 'userID and userPWD must be filed'
		});
	}
	var content = {
		userID: userID,
		userPWD: userPWD,
		role: role,
		userName: userName,
		userPhone: userPhone,
		userEmail: userEmail
	};
	// 实例化对象并插入数据
	var monInsert = new users(content);
	monInsert.save(function(err) {
		if (err) {
			console.log(err);
		} else {
			res.send({
				result: 'success'
			});
		}
	});
})

router.all('/delete', function(req, res) {
	var userID = req.body.userID || req.query.userID;
	var userPWD = req.body.userPWD || req.query.userPWD;
	var id = req.body.id;
	if (!id) {
		res.send({
			result: 'fail',
			message: id
		});
	}
	var del = {
		_id: id
	};
	users.remove(del, function(err) {
		if (err) {
			res.send({
				result: 'fail',
				message: err
			});
		} else {
			res.send({
				result: 'success'
			});
		}
	});
})

var guid = function() {
	function S4() {
		return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
	}
	return (S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4());
};


module.exports = router;
