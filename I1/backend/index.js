const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const PORT = process.env.PORT || 3001;

const app = express();
app.use(express.json());
app.use(cors()); 

const Routers = require("./routes/Routes");
const ImagesRouter = require('./routes/Images'); 

app.use("/Routes", Routers);
app.use('/Images', ImagesRouter);

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    console.error(err.message, err.stack);
    res.status(statusCode).json({ message: err.message });
    return;
  });

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});