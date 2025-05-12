const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/events');

router.get('/',        ctrl.getAll);
router.get('/archived',ctrl.getArchived);
router.get('/:id',     ctrl.getById);
router.post('/',       ctrl.create);
router.put('/:id',     ctrl.update);
router.delete('/:id',  ctrl.remove);
router.post('/:id/archive',    ctrl.archive);
router.post('/:id/unarchive',  ctrl.unarchive);

module.exports = router;