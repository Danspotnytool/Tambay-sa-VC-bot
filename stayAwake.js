const express = require('express');
const app = express();

const uptime = Date.now();

app.get('/', (req, res) => {
    res.send({
        status: "online",
        uptime: Date.now() - uptime
    });
});

app.listen(process.env.PORT || 8080, () => {
    onsole.log(`Listening to port: ${process.env.PORT || 8080}`);
});