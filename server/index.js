require("dotenv").config()

const axios = require("axios")
const api = require("@gijslaarman/oba-scraper")
const express = require("express")
const fs = require('fs')
const app = express()
const port = 3000

import delve from 'dlv'

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
      subject: book.subjects && book.subjects[0] && book.subjects[0]["topical-subject"] && book.subjects[0]["topical-subject"][0] ? book.subjects[0]["topical-subject"][0]._ : "overig",
      genres: book.genres && book.genres[0] && book.genres[0].genre ? book.genres[0].genre[0]._ : "overig",
      language: book.languages && book.languages[0] && book.languages[0].language && book.languages[0].language[0] ? book.languages[0].language[0]['_'] : null,
      originalLanguage: book.languages && book.languages[0] && book.languages[0]['original-language'] ? book.languages[0]['original-language'][0]['_'] : null,
      totalPages: book.description && book.description[0] && book.description[0]["physical-description"] && book.description[0]["physical-description"][0] ? Number(book.description[0]["physical-description"][0]._.split(' ')[0]) : null
    }
  ))

  // illustrator: book.authors && book.authors[0] && book.authors[0]["main-author"] && book.authors[0]["main-author"][0] ? book.authors[0]["main-author"][0]._ : null,
  // otherAuthors: book.authors && book.authors[0] && book.authors[0].author ? book.authors[0].author.map(author => ({author: author._})) : null,
  // publisher: book.publication[0] && book.publication[0].publishers[0] && book.publication[0].publishers[0].publisher[0] ? book.publication[0].publishers[0].publisher[0]._ : null,
  // place: book.publication && book.publication[0] && book.publication[0].publishers && book.publication[0].publishers[0] && book.publication[0].publishers[0].publisher && book.publication[0].publishers[0].publisher[0] ? book.publication[0].publishers[0].publisher[0].$.place : null,
  // year: book.publication && book.publication[0] && book.publication[0].year && book.publication[0].year[0]['_'] ? book.publication[0].year[0]['_'] : null,


  // writing data to json file
  fs.writeFile('data.json', JSON.stringify(data), 'utf8', () => {
    console.log('created data.json')
  })
}).catch(err => console.log(err))

// name: book.titles && book.titles[0] && book.titles[0].title && book.titles[0].title[0] ? book.titles[0].title[0]._ : null,
// children: [
//   {
//     name: "authors",
//     children: [
//       {
//         name: "illustrator",
//         children: [
//           {
//             name: book.authors && book.authors[0] && book.authors[0]["main-author"] && book.authors[0]["main-author"][0] ? book.authors[0]["main-author"][0]._ : null,
//           }
//         ]
//       },
//       {
//         name: "other authors",
//         children: [
//           {
//             name: book.authors && book.authors[0] && book.authors[0].author ? book.authors[0].author.map(author => ({author: author._})) : null,
//           }
//         ]
//       }
//     ]
//   },
//   {
//     name: "meta",
//     children: [
//       {
//         name: "subject",
//         children: [
//           {
//             name: book.subjects && book.subjects[0] && book.subjects[0]["topical-subject"] && book.subjects[0]["topical-subject"][0] ? book.subjects[0]["topical-subject"][0]._ : null
//           }
//         ]
//       },
//       {
//         name: "genres",
//         children: [
//           {
//             name: book.genres && book.genres[0] && book.genres[0].genre ? book.genres[0].genre.map(genre => ({genre: genre._})) : null
//           }
//         ]
//       }
//     ]
//   },
//   {
//     name: "languages",
//     children: [
//       {
//         name: "language",
//         children: [
//           {
//             name: book.languages && book.languages[0] && book.languages[0].language && book.languages[0].language[0] ? book.languages[0].language[0]['_'] : null
//           }
//         ]
//       },
//       {
//         name: "original language",
//         children: [
//           {
//             name: book.languages && book.languages[0] && book.languages[0]['original-language'] ? book.languages[0]['original-language'][0]['_'] : null
//           }
//         ]
//       }
//     ]
//   },
//   {
//     name: "publication",
//     children: [
//       {
//         name: "publisher",
//         children: [
//           {
//             name: book.publication && book.publication[0] && book.publication[0].publishers && book.publication[0].publishers[0] && book.publication[0].publishers[0].publisher && book.publication[0].publishers[0].publisher[0] ? book.publication[0].publishers[0].publisher[0]._ : null
//           }
//         ]
//       },
//       {
//         name: "place",
//         children: [
//           {
//             name: book.publication && book.publication[0] && book.publication[0].publishers && book.publication[0].publishers[0] && book.publication[0].publishers[0].publisher && book.publication[0].publishers[0].publisher[0] ? book.publication[0].publishers[0].publisher[0].$.place : null
//           }
//         ]
//       },
//       {
//         name: "year",
//         children: [
//           {
//             name: book.publication && book.publication[0] && book.publication[0].year && book.publication[0].year[0]['_'] ? book.publication[0].year[0]['_'] : null
//           }
//         ]
//       }
//     ]
//   },
//   {
//     name: "pages",
//     children: [
//       {
//         name: book.description && book.description[0] && book.description[0]["physical-description"] && book.description[0]["physical-description"][0] ?  book.description[0]["physical-description"][0]._ : null
//       }
//     ]
//   }
// ]
