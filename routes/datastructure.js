import express from 'express';
import readJSONFile from '../tools/utils';
const router = express.Router();

/* GET index page. */
router.get('/:name', (req, res) => {
  readJSONFile('tools/data/datastructure_'+req.params.name+'.json', (err, data) => {
    if (err) {
      res.status(500).send(`Error: ${err}`);
      return;
    }
    res.send(data);
  });
});

export default router;
