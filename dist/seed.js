"use strict";

require("reflect-metadata");

var _typeorm = require("typeorm");

var _User = require("./entity/User");

var _Post = require("./entity/Post");

var _Comment = require("./entity/Comment");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

(0, _typeorm.createConnection)().then( /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(function* (connection) {
    console.log('database connected: ', connection.isConnected); // 创建 user 1

    var user = new _User.User('frank', 'b9cbe8d1dfc7c2d531dedfcd4467bf1a'); // 创建 post 1

    var post = new _Post.Post(1, '如何保持健康？', '有4种方式可以保持健康，首先应该坚持锻炼，其次是节食。。。。。。'); // 创建 comment 1

    var comment = new _Comment.Comment(1, 1, '我认为节食不是一个聪明的做法，我认为不应该节食。吃饱了才有力气减肥呢。');
    var [, userCount] = yield connection.manager.findAndCount(_User.User);
    var [, postCount] = yield connection.manager.findAndCount(_Post.Post);
    var [, commentCount] = yield connection.manager.findAndCount(_Comment.Comment);

    if (userCount === 0 && postCount === 0 && commentCount === 0) {
      console.log('No data available in three relations, start seeding...');
      var insertUserResult = yield connection.manager.save(user);
      console.log(insertUserResult);
      var insertPostResult = yield connection.manager.save(post);
      console.log(insertPostResult);
      var insertCommentResult = yield connection.manager.save(comment);
      console.log(insertCommentResult);
      console.log('Finished');
    } else {
      yield connection.manager.clear(_User.User);
      yield connection.manager.clear(_Post.Post);
      yield connection.manager.clear(_Comment.Comment);
      console.log('Please do this operation again');
    }

    return yield connection.close();
  });

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}()).catch(error => console.log(error));