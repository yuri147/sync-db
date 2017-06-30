var express = require('express');
var router = express.Router();
var items = require('../database/db').items;
var formidable = require("formidable");
var util = require('util');
var cdnClient = require('../cloud/qiniu').cdnClient;

router.post('/insert', function(req, res) {
	if (!req.body.itemID || !req.body.itemName || !req.body.itemType) {
		res.send({
			result: 'fail',
			message: 'itemID and itemName must be itemType'
		});
	}
	// 数据集
	var content = {
		itemID: req.body.itemID,
		itemName: req.body.itemName,
		itemType: req.body.itemType
	};
	// 实例化对象并插入数据
	var monInsert = new items(content);
	monInsert.save(function(err) {
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

router.get('/list', function(req, res) {
	var query = {};
	var result = {};
	var content = {};
	var field = {
		itemID: 1,
		itemName: 1,
		itemType: 1
	};
	items.find(content, field, function(err, result) {
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
	var itemID = req.body.itemID || req.query.itemID;
	if (!itemID) {
		res.send({
			result: 'fail',
			message: 'itemID is required'
		});
	}
	var del = {
		itemID: itemID
	};
	items.remove(del, function(err) {
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

router.get('/search', function(req, res) {
	if (!req.body.itemID) {
		res.send({
			result: 'fail',
			message: 'itemID must be filed '
		});
	}
	var query = {};
	var result = {};
	var content = {
		itemID: req.body.itemID
	};
	var field = {
		itemID: 1,
		itemName: 1,
		itemType: 1
	};
	items.find(content, field, function(err, result) {
		if (err) {
			console.log(err);
		} else {
			res.send({
				result: result
			});
		}
	});
});

router.post('/upload', function(req, res) {
	var form = new formidable.IncomingForm();
	form.maxFieldsSize = 5 * 1024 * 1024;
	form.multiples = true;
	form.uploadDir = "../tmp";
	form.parse(req, function(err, fields, files) {
		if (err) {
			res.end(util.inspect({
				fields: fields,
				files: files
			}));
		} else {
			var file = files.file;
			var fileLocalPath = file.path;
			var fileName = file.name;

			var client = new cdnClient(fileName, fileLocalPath, "image/spf/item/");
			client.uploadFile()
				.then(function(data) {
					res.send({
						data: data,
						result: 'success'
					});
				}).catch(function(data) {
					res.send({
						data: 'error',
						result: 'failed'
					});
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
