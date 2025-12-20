
import "./services/preload.service.js"
import connectDB from "./db/index.js";
import app from "./app.js";



const PORT = `${process.env.PORT}` || 5000
connectDB()
  .then(() => {
    app.listen(PORT , () => {
      console.log(`Server running on Port ${process.env.port}`);
    });
  })
  .catch((err) => {
    console.log("Serer Error" , err)
  });



