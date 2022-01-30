var express = require('express');
var router = express.Router();
var db = require('../dao/query.js');
let jwt = require('jwt-simple');
let secret = 'wanyicheng520yupengtao';
var codeMap = require('../err-code/index.js');

let genTime = () => {
	return (new Date()).getTime() + 30 * 24 * 60 * 60 * 1000;
}

router.use(function (req, res, next) {
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

router.get('/userinfo', function (req, res, next) {
	let id = req.query.id;
	if (!id) {
		res.send({
			status: 'failed',
			code: 5,
			reason: codeMap['5']
		})
		return;
	}
	db.query('select * from t_user as u where u.id = ?', [id], function (err, result, fields) {
		if (err) {
			res.send({
				status: 'failed',
				reason: `${err}`
			})
			return;
		}
		res.send({
			username: result[0].username,
			id: result[0].id,
			wx_id: result[0].wx_id,
			avatar: result[0].avatar,
		});
	});
	
});

router.post('/register', function (req, res, next) {
	let {username, password, wx_id} = req.body;
	if (!username || !password || !wx_id) {
		res.send({
			status: 'failed',
			code: 2,
			reason: '用户名 密码 微信号 不得为空'
		})
		return;
	}
	// 先查这个用户存在与否
	db.query('select wx_id from t_user as u where u.wx_id = ?', [wx_id], function (err, result, fields) {
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
				reason: `用户 ${wx_id} 已存在`
			})
			return;
		}
		// 插入这条新数据
		db.query('insert into t_user (username, password, wx_id) values (?, ?, ?)', [username, password, wx_id], function (err, uResult, fields) {
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
					expiresIn: genTime()
				}
				let token =  jwt.encode(tokenData, secret);
				res.send({
					status: 'ok',
					code: 0,
					data: {
						username: username,
						id: uResult.insertId,
						wx_id: wx_id,
						avatar: null,
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
		return;
	}
	// 先查这个用户存在与否
	db.query('select * from t_user as u where u.username = ? and u.password = ?', [username, password], function (err, result, fields) {
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
				expiresIn: genTime()
			}
			let token =  jwt.encode(tokenData, secret);
			res.send({
				status: 'ok',
				code: 0,
				data: {
					username: result[0].username,
					id:  result[0].id,
					wx_id: result[0].wx_id,
					avatar: result[0].avatar,
					token: token
				}
			})
		} else {
			res.send({
				status: 'failed',
				code: 4,
				reason: `用户 ${username} 不存在`
			})
		}
	});
	
});

module.exports = router;
