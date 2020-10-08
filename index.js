const mongoose = require("mongoose");

// Import of the model Recipe from './models/Recipe.model.js'
const Recipe = require("./models/Recipe.model");
// Import of the data from './data.json'
const data = require("./data");

const MONGODB_URI = "mongodb://localhost:27017/recipe-app";

// Connection to the database "recipe-app"
mongoose
  .connect(MONGODB_URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((self) => {
    console.log(`Connected to the database: "${self.connection.name}"`);
    // Before adding any documents to the database, let's delete all previous entries
    return self.connection.dropDatabase();
  })
  .then(() => {
    Recipe.create({
      title: "Test",
      level: "Amateur Chef",
      ingredients: ["1/2 cup rice vinegar", "5 tablespoons honey"],
      cuisine: "Asian",
      dishType: "main_course",
      image:
        "https://images.media-allrecipes.com/userphotos/720x405/815964.jpg",
      duration: 40,
      creator: "Chef LePapu",
    })
      .then(() => {
        console.log("New recipe created");
      })
      .catch((err) => {
        console.log("Error...", err);
      });

    // Insert all
    Recipe.insertMany(data)
      .then((data) => {
        data.forEach((recipe) => {
          console.log(recipe.title);
        });

        // Update Rigatoni
        let updateRigatoni = Recipe.findOneAndUpdate(
          { title: "Rigatoni alla Genovese" },
          { $set: { duration: 100 } }
        );

        updateRigatoni
          .then(() => {
            console.log("Rigatoni alla Genovese was updated!");
          })
          .catch((err) => {
            console.log("Error", err);
          });

        // Remove Carrot Cake
        let removeCarrotCake = Recipe.deleteOne({ title: "Carrot Cake" });

        removeCarrotCake
          .then(() => {
            console.log("Carrot Cake was removed!");
          })
          .catch((err) => {
            console.log("Error...", err);
          });

        Promise.all([updateRigatoni, removeCarrotCake])
          .then(() => {
            mongoose.connection.close();
            console.log("Connection closed");
          })
          .catch((err) => {
            console.log("Still connecting...", err);
          });
      })
      .catch((err) => {
        console.log("Error...", err);
      });
  })
  .catch((error) => {
    console.error("Error connecting to the database", error);
  });
