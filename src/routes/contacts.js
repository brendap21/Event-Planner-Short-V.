const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/contacts');

router.get('/',    ctrl.getAll);
router.post('/',   ctrl.create);
router.delete('/:id', ctrl.remove);

module.exports = router;