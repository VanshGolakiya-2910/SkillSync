
import "./services/preload.service.js"
import connectDB from "./db/index.js";
import app from "./app.js";


const PORT = `${process.env.PORT}` || 5000
console.log("PORT" , PORT)
connectDB()
  .then(() => {
    app.listen(PORT , () => {
      console.log(`Server running on Port ${PORT} in ${process.env.NODE_ENV} mode`);
    });
  })
  .catch((err) => {
    console.log("Serer Error" , err)
  });



