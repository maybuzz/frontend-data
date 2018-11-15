require("dotenv").config()

const axios = require("axios")
const dallyApi = require("./new-dally-api.js")
const chalk = require("chalk")
const express = require("express")
const app = express()
const port = 3000

const obaApi = new dallyApi({public: process.env.PUBLIC})

obaApi.getAll("search", {
      facet: "genre(stripverhaal)",
      q: "format:book",
      sort: "year",
      librarian: true,
      refine: true
    },
    {
      page: 1,
      pagesize: 20,
      maxpages: 10

}).then(response => { return response.data
}).then(response => {
  app.get("/", (req, res) => res.json(response))
  app.listen(port, () => console.log(chalk.green("Listening on port " + port)))
  console.log(response.length);
})
.catch(err => console.log(err))
