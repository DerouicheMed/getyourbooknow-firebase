const functions = require("firebase-functions");
const admin = require("firebase-admin");
var serviceAccount = require("../getyourbooknow-firebase-adminsdk.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://getyourbooknow.firebaseio.com",
});
const express = require("express");
const app = express();

app.get("/books", (req, res) => {
  admin
    .firestore()
    .collection("books")
    .get()
    .then((data) => {
      let books = [];
      data.forEach((doc) => {
        books.push(doc.data());
      });
      return res.json(books);
    })
    .catch((err) => console.error(err));
});

app.get("/books/:id", (req, res) => {
  let id = req.params.id;
  admin
    .firestore()
    .collection("books")
    .doc(id)
    .get()
    .then((data) => {
      return res.json(data.data());
    })
    .catch((err) => {
      res.status("500").json(err);
      console.error(err);
    });
});

exports.api = functions.https.onRequest(app);
