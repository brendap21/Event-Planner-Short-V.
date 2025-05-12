const express = require('express');
const router  = express.Router({ mergeParams: true });
const ctrl    = require('../controllers/guests');

router.get('/',          ctrl.getAll);
router.post('/',         ctrl.create);
router.delete('/:guestId', ctrl.remove);

module.exports = router;
