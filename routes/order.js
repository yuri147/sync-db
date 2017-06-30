var express = require('express');
var router = express.Router();
var orders = require('../database/db').orders;

router.post('/insert', function(req, res) {
	// 数据集
	var content = {
		orderID: guid(),
		itemID: req.body.itemID,
		itemName: req.body.itemName,
		buyerName: req.body.buyerName,
		buyerPhone: req.body.buyerPhone,
		buyerAddress: req.body.buyerAddress
	};
	// 实例化对象并插入数据
	var monInsert = new orders(content);
	monInsert.save(function(err) {
		if (err) {
			console.log(err);
		} else {
			res.send({
				result: 'success'
			});
		}
	});
});

router.get('/list', function(req, res) {
	var query = {};
	var result = {};
	var content = {};
	var field = {
		orderID: 1,
		itemID: 1,
		itemName: 1,
		buyerName: 1,
		buyerPhone: 1,
		buyerAddress: 1
	};
	orders.find(content, field, function(err, result) {
		if (err) {
			console.log(err);
		} else {
			res.send({
				result: result
			});
		}
	});
});

router.post('/delete', function(req, res) {
	var orderID = req.body.orderID || req.query.orderID;
	if (!orderID) {
		res.send({
			result: 'fail',
			message: 'orderID is required'
		});
	}
	var del = {
		orderID: orderID
	};
	orders.remove(del, function(err) {
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
});


var guid = function() {
	function S4() {
		return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
	}
	return (S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4());
};


module.exports = router;
