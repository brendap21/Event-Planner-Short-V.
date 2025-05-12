// src/routes/eventSupplies.js
const express = require('express');
const router  = express.Router({ mergeParams: true });
// ——— aquí ↓
const ctrl    = require('../controllers/eventsupplies');

router.get('/',    ctrl.getAll);
router.post('/',   ctrl.create);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);

module.exports = router;
