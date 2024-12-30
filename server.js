const mongoose = require("mongoose");
require("dotenv").config();
const app = require("./app");

const port = process.env.PORT || 7000;

mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => {
    console.log("Data base connected successfully 🎉🎉");
    app.listen(port, "0.0.0.0", () => {
      console.log(`Serve listening on port ${port}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
