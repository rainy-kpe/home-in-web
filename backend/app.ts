/// <reference path="../typings/main.d.ts" />

"use strict";

import * as express from "express";
import * as path from "path";

const app: express.Application = express();

app.use(express.static('output/frontend'));
app.get('/', (req: express.Request, res: express.Response) => {
  res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});

app.listen(9000);
