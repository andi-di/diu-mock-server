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
router.get('/:name', (req, res) => {
  readJSONFile('data/datastructure_'+req.params.name+'.json', (err, data) => {
    if (err) {
      res.status(500).send(`Error: ${err}`);
      return;
    }
    res.send(data);
  });
});

export default router;
