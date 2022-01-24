var express = require('express');
var router = express.Router();
var db = require('../dao/query.js');
let jwt = require('jwt-simple');
let secret = 'wanyicheng520yupengtao';

router.use(function (req, res, next) {
	console.log('%s %s %s', req.method, req.url, req.path);
	// 对于 api 路径下 需要鉴权 除了 登录 和 注册 之外的接口
	let reg1 = /\/register/gi;
	let reg2 = /\/login/gi;
	if (reg1.test(req.url) || reg2.test(req.url)) {
		next();
		return;
	}
	let Authorization = req.headers.authorization || '';
    let [,token] = Authorization.split(' ');
    if(token){
        try{
            let r = jwt.decode(token,secret);
			console.log(r)
            if (r.expiresIn < (new Date()).getTime()) {
				res.send({
					code: 3,
					status: 'failed',
					reason: `用户未登录`
				})
			} else {
				next();
			}
        }catch(e){
			res.send({
				code: 3,
				status: 'failed',
				reason: `用户未登录`
			})
        }
    }else{
        res.send({
			code: 3,
			status: 'failed',
			reason: `用户未登录`
		})
    }

  })

/* GET api listing. */
router.get('/users', function (req, res, next) {
	db.query('select * from t_user', [], function (err, result, fields) {
		if (err) {
			res.send({
				status: 'failed',
				reason: `${err}`
			})
			return;
		}
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
			code: 2,
			reason: '用户名 密码 不得为空'
		})
	}
	// 先查这个用户存在与否
	db.query('select username from t_user as u where u.username = ?', [username], function (err, result, fields) {
		if (err) {
			res.send({
				status: 'failed',
				reason: `${err}`
			})
			return;
		}
		if (result && result.length) {
			res.send({
				status: 'failed',
				code: 1,
				reason: `用户名 ${username} 已存在`
			})
			return;
		}
		// 插入这条新数据
		db.query('insert into t_user (username, password) values (?, ?)', [username, password], function (err, uResult, fields) {
			if (err) {
				res.send({
					status: 'failed',
					reason: `${err}`
				})
				return;
			}
			if (uResult) {
				let tokenData = {
					username,
					expiresIn: (new Date()).getTime() + 2 * 24 * 60 * 60 * 1000
				}
				let token =  jwt.encode(tokenData, secret);
				res.send({
					status: 'ok',
					code: 0,
					data: {
						username: username,
						id: uResult.insertId,
						token: token
					}
				})
			}
			
		});
	});
	
});

router.post('/login', function (req, res, next) {
	let {username, password} = req.body;
	if (!username || !password) {
		res.send({
			status: 'failed',
			code: 2,
			reason: '用户名 密码 不得为空'
		})
	}
	// 先查这个用户存在与否
	db.query('select username from t_user as u where u.username = ?', [username], function (err, result, fields) {
		if (err) {
			res.send({
				status: 'failed',
				reason: `${err}`
			})
			return;
		}
		if (result && result.length) {
			let tokenData = {
				username,
				expiresIn: (new Date()).getTime() + 2 * 24 * 60 * 60 * 1000
			}
			let token =  jwt.encode(tokenData, secret);
			res.send({
				status: 'ok',
				code: 0,
				data: {
					username: result[0].username,
					id:  result[0].id,
					token: token
				}
			})
		} else {
			res.send({
				status: 'failed',
				code: 4,
				reason: `用户名 ${username} 不存在`
			})
		}
	});
	
});

module.exports = router;
