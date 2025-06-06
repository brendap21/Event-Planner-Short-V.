const express = require('express');
const router  = express.Router({ mergeParams: true });
const ctrl    = require('../controllers/shoppingList');

router.get('/',          ctrl.getAll);
router.post('/',         ctrl.create);
router.put('/:id',       ctrl.update);
router.delete('/:id',    ctrl.remove);

module.exports = router;