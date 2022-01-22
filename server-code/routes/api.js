var express = require('express');
var router = express.Router();
var db = require('../dao/query.js');

/* GET api listing. */
router.get('/users', function (req, res, next) {
	db.query('select * from t_user', [], function (result, fields) {
		console.log('查询结果：');
		console.log(result);
		res.send(result);
	});
});

router.post('/register', function (req, res, next) {
	let {username, password} = req.body;
	if (!username || !password) {
		res.send({
			status: 'failed',
			reason: '用户名 密码 不得为空'
		})
	}
	try {
		// 先查这个用户存在与否
		db.query('select username from t_user as u where u.username = ?', [username], function (result, fields) {
			if (result && result.length) {
				res.send({
					status: 'failed',
					reason: `用户名 ${username} 已存在`
				})
				return;
			}
			// 插入这条新数据
			db.query('insert into t_user (username, password) values (?, ?)', [username, password], function (uResult, fields) {
				if (uResult) {
					res.send({
						status: 'ok',
						data: {
							username: username,
							id: uResult.insertId,
							token: `user ${username} logined`
						}
					})
				}
				
			});
		});

	} catch (e) {
		res.send({
			status: 'failed',
			reason: `${e}`
		})
	}
	
});

module.exports = router;
