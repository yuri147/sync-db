var qiniu = require("qiniu");
var Promise = require('bluebird');


//需要填写你的 Access Key 和 Secret Key
var accessKey = 'dd2N7wQwU19hYB4qF1bmTdoWwELbs3ThhTfvRd0Y';
var secretKey = 'jqUaf1mLs1dLgRdkrMQwm19G7zPaVWuKdLybhMcc';
//要上传的空间
var bucket = 'overflow';
var config = new qiniu.conf.Config();
var formUploader = new qiniu.form_up.FormUploader(config);
var putExtra = new qiniu.form_up.PutExtra();

var client = function(filename, localFilePath, uploadFilePath) {
	var self = this;
	//构建上传策略函数，设置回调的url以及需要回调给业务服务器的数据
	function uptoken(bucket, filename) {
		var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
		var options = {
			scope: bucket
		}
		var putPolicy = new qiniu.rs.PutPolicy(options);
		return putPolicy.uploadToken(mac);
	}

	this.token = uptoken(bucket, filename);
	//构造上传函数
	this.uploadFile = function() {
		return new Promise(function(resolve, reject) {
			formUploader.putFile(self.token, uploadFilePath + filename, localFilePath, putExtra, function(respErr,
				respBody, respInfo) {
				if (respErr) {
					reject(new Error(respErr));
				}
				if (respInfo.statusCode == 200) {
					resolve(respBody);
				} else {
                    console.log(respBody);
					reject(new Error(respBody));
				}
			});
		});
	}
}

module.exports.cdnClient = client;
