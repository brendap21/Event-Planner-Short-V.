const express = require('express');
const app = express();
const auth = require('./middlewares/auth');
// ...código existente...

// Usa el middleware en todas las rutas protegidas
app.use('/api/events', auth, require('./routes/events'));
app.use('/api/users', auth, require('./routes/users'));
// ...other protected routes...

app.use('/api/shopping-list', auth, require('./routes/shoppingList'));
app.use('/api/event-supplies', auth, require('./routes/eventSupplies'));
app.use('/api/guests', auth, require('./routes/guests'));

// ...código existente...