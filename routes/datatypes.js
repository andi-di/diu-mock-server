import express from 'express';

const fs = require('fs');

const router = express.Router();

const readJSONFile = (filename, callback) => {
  fs.readFile(filename, (err, data) => {
    if (err) {
      callback(err);
      return;
    }
    try {
      callback(null, JSON.parse(data));
    } catch (exception) {
      callback(exception);
    }
  });
};

/* GET index page. */
router.get('/', (req, res) => {
  readJSONFile('data/datatype_list.json', (err, data) => {
    if (err) {
      res.status(500).send(`Error: ${err}`);
    }
    data.forEach((obj) => {
      delete obj.info;
    });
    res.send(data);
  });
});

export default router;
