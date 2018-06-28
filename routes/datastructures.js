import express from 'express';
import readJSONFile from '../tools/utils';
const router = express.Router();

/* GET index page. */
router.get('/', (req, res) => {
  readJSONFile('tools/data/datatypes.json', (err, data) => {
    if (err) {
      res.status(500).send(`Error: ${err}`);
      return;
    }
    let datastructureLinks = [];
    data.forEach(element => {
      datastructureLinks.push({
        "name": element,
        "link": "/datastructures/" + encodeURIComponent(element)
      });
    });
    res.send(datastructureLinks);
  });
});

/* GET index page. */
router.get('/:name', (req, res) => {
  readJSONFile('tools/data/datastructure_' + req.params.name + '.json', (err, data) => {
    if (err) {
      res.status(500).send(`Error: ${err}`);
      return;
    }
    res.send(data);
  });
});

export default router;