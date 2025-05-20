const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/:filename', (req, res) => {
  const { filename } = req.params;
  const imagePath = path.join(__dirname, '..', 'images', filename);
  res.sendFile(imagePath);
});

module.exports = router;