"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const api_router_1 = require("./routes/api-router");
const statics_router_1 = require("./routes/statics-router");
const statics_dev_router_1 = require("./routes/statics-dev-router");
const config = require("./config");
const app = express();
app.use(api_router_1.apiRouter());
app.use(config.IS_PRODUCTION ? statics_router_1.staticsRouter() : statics_dev_router_1.staticsDevRouter());
app.listen(config.SERVER_PORT, () => {
    console.log(`App listening on port ${config.SERVER_PORT}!`);
});
//# sourceMappingURL=server.js.map