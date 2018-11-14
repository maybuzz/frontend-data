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
      maxpages: 400

}).then(response => { return response.data
  let res = response.data
  let allArr = []
  let newArr = res.map(book => {
    let title = book.titles[0].title[0]._
    let mainAuthor = book.authors[0]["main-author"][0]._
    let authors = book.authors[0].author ? book.authors[0].author.map(author =>  author._) : null
    let subject = book.subjects ? book.subjects[0]["topical-subject"][0]._ : null
    let genres = book.genres[0].genre.map(genre => genre._)
    let translation = book.languages[0].language[0]._
    let language = book.languages[0]["original-language"] ? book.languages[0]["original-language"][0]._ : book.languages[0].language[0]._
    let publisher = book.publication[0].publishers[0].publisher[0]._
    let place = book.publication[0].publishers[0].publisher[0].$.place
    let year = book.publication[0].year[0]._
    let pages = book.description[0]["physical-description"][0]._
    let cover = book.coverimages[0].coverimage[1]._

    title = title.substring(0, title.indexOf('/')).trim()
    pages = Number(pages.substring(0, pages.indexOf('p')).trim())

    // let allObj = {title, mainAuthor, authors, pages, translation, language, publisher, place, year, subject, genres, cover}
    let allObj = {place}

    allArr.push(allObj)

  })
  console.log(allArr.length)
  return allArr
  return response

}).then(response => {
  app.get("/", (req, res) => res.json(response))
  app.listen(port, () => console.log(chalk.green("Listening on port " + port)))
  console.log(response.length);
})
.catch(err => console.log(err))
