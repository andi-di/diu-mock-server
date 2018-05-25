import express from 'express';
import readJSONFile from '../tools/utils';
const fs = require('fs');
const router = express.Router();


/* GET index page. */
router.get('/', (req, res) => {
  readJSONFile('tools/data/datatypes.json', (err, data) => {
    if (err) {
      res.status(500).send(`Error: ${err}`);
      return;
    }
    res.send(data);
  });
});

export default router;
