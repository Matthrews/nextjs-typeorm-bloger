"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

require("reflect-metadata");

var _typeorm = require("typeorm");

var _User = require("./entity/User");

var _Post = require("./entity/Post");

var _Comment = require("./entity/Comment");

(0, _typeorm.createConnection)().then( /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(connection) {
    var user, post, comment, _yield$connection$man, _yield$connection$man2, userCount, _yield$connection$man3, _yield$connection$man4, postCount, _yield$connection$man5, _yield$connection$man6, commentCount, insertUserResult, insertPostResult, insertCommentResult;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            console.log('database connected: ', connection.isConnected); // 创建 user 1

            user = new _User.User('frank', 'b9cbe8d1dfc7c2d531dedfcd4467bf1a'); // 创建 post 1

            post = new _Post.Post(1, '如何保持健康？', '有4种方式可以保持健康，首先应该坚持锻炼，其次是节食。。。。。。'); // 创建 comment 1

            comment = new _Comment.Comment(1, 1, '我认为节食不是一个聪明的做法，我认为不应该节食。吃饱了才有力气减肥呢。');
            _context.next = 6;
            return connection.manager.findAndCount(_User.User);

          case 6:
            _yield$connection$man = _context.sent;
            _yield$connection$man2 = (0, _slicedToArray2["default"])(_yield$connection$man, 2);
            userCount = _yield$connection$man2[1];
            _context.next = 11;
            return connection.manager.findAndCount(_Post.Post);

          case 11:
            _yield$connection$man3 = _context.sent;
            _yield$connection$man4 = (0, _slicedToArray2["default"])(_yield$connection$man3, 2);
            postCount = _yield$connection$man4[1];
            _context.next = 16;
            return connection.manager.findAndCount(_Comment.Comment);

          case 16:
            _yield$connection$man5 = _context.sent;
            _yield$connection$man6 = (0, _slicedToArray2["default"])(_yield$connection$man5, 2);
            commentCount = _yield$connection$man6[1];

            if (!(userCount === 0 && postCount === 0 && commentCount === 0)) {
              _context.next = 36;
              break;
            }

            console.log('No data available in three relations, start seeding...');
            _context.next = 23;
            return connection.manager.save(user);

          case 23:
            insertUserResult = _context.sent;
            console.log(insertUserResult);
            _context.next = 27;
            return connection.manager.save(post);

          case 27:
            insertPostResult = _context.sent;
            console.log(insertPostResult);
            _context.next = 31;
            return connection.manager.save(comment);

          case 31:
            insertCommentResult = _context.sent;
            console.log(insertCommentResult);
            console.log('Finished');
            _context.next = 43;
            break;

          case 36:
            _context.next = 38;
            return connection.manager.clear(_User.User);

          case 38:
            _context.next = 40;
            return connection.manager.clear(_Post.Post);

          case 40:
            _context.next = 42;
            return connection.manager.clear(_Comment.Comment);

          case 42:
            console.log('Please do this operation again');

          case 43:
            _context.next = 45;
            return connection.close();

          case 45:
            return _context.abrupt("return", _context.sent);

          case 46:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}())["catch"](function (error) {
  return console.log(error);
});