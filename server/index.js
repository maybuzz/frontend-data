require("dotenv").config()

const axios = require("axios")
const api = require("@gijslaarman/oba-scraper")
const chalk = require("chalk")
const express = require("express")
const app = express()
const port = 3000
const fs = require('fs')

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
        maxpages: 10
    },
}

client.getPages(search).then(response => { return response.data
}).then(response => {

  const data = response.map(book => (
    {
      title: book.titles && book.titles[0] && book.titles[0].title && book.titles[0].title[0] ? book.titles[0].title[0]._ : null,
      info: [
        {
          authors:[
            {
              illustrator: book.authors && book.authors[0] && book.authors[0]["main-author"] && book.authors[0]["main-author"][0] ? book.authors[0]["main-author"][0]._ : null
            },
            {
              authors: book.authors && book.authors[0] && book.authors[0].author ? book.authors[0].author.map(author => ({author: author._})) : null
            }
          ],
          meta: [
            {
              subject: book.subjects && book.subjects[0] && book.subjects[0]["topical-subject"] && book.subjects[0]["topical-subject"][0] ? book.subjects[0]["topical-subject"][0]._ : null
            },
            {
              genres: book.genres && book.genres[0] && book.genres[0].genre ? book.genres[0].genre.map(genre => ({genre: genre._})) : null
            }
          ],
          languages: [
            {
              language: book.languages && book.languages[0] && book.languages[0].language && book.languages[0].language[0] ? book.languages[0].language[0]['_'] : null
            },
            {
              originalLanguage: book.languages && book.languages[0] && book.languages[0]['original-language'] ? book.languages[0]['original-language'][0]['_'] : null
            }
          ],
          publication: [
            {
              publisher: book.publication && book.publication[0] && book.publication[0].publishers && book.publication[0].publishers[0] && book.publication[0].publishers[0].publisher && book.publication[0].publishers[0].publisher[0] ? book.publication[0].publishers[0].publisher[0]._ : null
            },
            {
              place: book.publication && book.publication[0] && book.publication[0].publishers && book.publication[0].publishers[0] && book.publication[0].publishers[0].publisher && book.publication[0].publishers[0].publisher[0] ? book.publication[0].publishers[0].publisher[0].$.place : null
            },
            {
              year: book.publication && book.publication[0] && book.publication[0].year && book.publication[0].year[0]['_'] ? book.publication[0].year[0]['_'] : null
            }
          ],
          pages: book.description && book.description[0] && book.description[0]["physical-description"] && book.description[0]["physical-description"][0] ?  book.description[0]["physical-description"][0]._ : null

          // Number(totalPages.substring(0, totalPages.indexOf('p')).trim())
        }
      ]
    }
  ))
  fs.writeFile('data.json', JSON.stringify(data), 'utf8', () => {
    console.log('created data.json')
  })
}).catch(err => console.log(err))
