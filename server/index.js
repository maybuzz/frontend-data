require("dotenv").config()

const axios = require("axios")
const api = require("@gijslaarman/oba-scraper")
const express = require("express")
const fs = require('fs')
const app = express()
const port = 3000

// import delve from 'dlv'

const client = new api({
    publicKey: process.env.PUBLIC
})

const search = {
    endpoint: 'search',
    query: {
        q: 'format:book',
        facet: 'genre(stripverhaal)',
        sort: 'year',
        librarian: true,
        refine: true
    },
    pages: {
        page: 1,
        pagesize: 20,
        maxpages: 1
    },
}

// from the gissa node module
client.getPages(search).then(response => { return response.data
}).then(response => {

  const data = response.map(book => (
    {
      title: book.titles && book.titles[0] && book.titles[0].title && book.titles[0].title[0] ? book.titles[0].title[0]._.split('/')[0].trim() : null,
      genres: book.genres && book.genres[0] && book.genres[0].genre ? book.genres[0].genre[0]._ : "overig",
      originalLanguage: book.languages && book.languages[0] && book.languages[0]['original-language'] ? book.languages[0]['original-language'][0]['_'] : null,
      totalPages: book.description && book.description[0] && book.description[0]["physical-description"] && book.description[0]["physical-description"][0] ? Number(book.description[0]["physical-description"][0]._.split(' ')[0]) : null
    }
  ))

  // writing data to json file
  fs.writeFile('data.json', JSON.stringify(data), 'utf8', () => {
    console.log('created data.json')
  })
}).catch(err => console.log(err))
