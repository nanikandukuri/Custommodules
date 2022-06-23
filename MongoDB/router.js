var express = require('express');
var router = express.Router({ caseSensitive: true });

router.use('/user', require('./modules/users/index'))



module.exports = router