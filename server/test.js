// used to demonstrate different ways we can work with our data
var models = require("./server.js").models;
/*
var toSatve = [
  { name: "Thkimou3", email: "th@me.tn" },
  { name: "Thkimou4", email: "thdez@me.tn" },
  { name: "Thkimou5", email: "tffgfh@me.tn" },
  { name: "Thkimou36", email: "treteh@me.tn" },
  { name: "Thkimou37", email: "thdfg@me.tn" },
  { name: "Thkimou38", email: "thdgfde@me.tn" },
  { name: "Thkimou39", email: "tazeash@me.tn" },
  { name: "Thkimou310", email: "sqdqth@me.tn" },
  { name: "Thkimou31", email: "pimith@me.tn" }
];

toSatve.map(obj => {
  models.Profile.create(obj, (err, created) => {
    console.log("Created?", created);
  });
});
*/
/*
var filter = {
  where: {
    email: { like: "thkimou" }
    //postCount: { lte: 10 }
  },
  order: "id ASC",
  limit: 10,
  skip: 1,
  fields: {
    email: true
  }
};
*/
models.Profile.findById("5dc2daf600a2db3dd8b44f5f", (err, found) => {
  console.log("Found?", err, found);
  found.destroy();
});
