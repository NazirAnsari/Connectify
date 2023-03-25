const express = require('express'); //everytime i do require express it will not create new instance of express it will just fetch the existing instance
//express is created and required only once

const router = express.Router();

router.use('/v1',require('./v1')); //defining v1

module.exports = router;