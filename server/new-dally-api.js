const axios = require('axios')
const convert = require('xml-to-json-promise').xmlDataToJSON

module.exports = class OBA {
    constructor(options) {
        this.key = options.public,
        this.pages = {}
    }

    stringify(object) {
        const keys = Object.keys(object)
        const values = Object.values(object)
        return keys.map((key, i) => `&${key}=${values[i]}`).join('')
    }

    get(endpoint, query, pages) {
        const url = `https://zoeken.oba.nl/api/v1/${endpoint}/?authorization=${this.key}${this.stringify(query)}`
        console.log(url)

        axios.get(url)
        .then(res => convert(res.data))
        .then(res => {
            return {
                data: res,
                url: url
            }
        })
    }

    getAll(endpoint, query, pages) {
        const url = `https://zoeken.oba.nl/api/v1/${endpoint}/?authorization=${this.key}${this.stringify(query)}`
        this.pages = pages

        return this.getRequests(url)
            .then(requests => {
                return {
                    data: [].concat(...requests.data),
                    url: url,
                    failed: requests.failed
                }
            })
        }

      getAmountOfRequests(url) {
        return axios.get(url)
          .then(res => convert(res.data))
          .then(res => {
              return {
                  amount: (Math.ceil(res.aquabrowser.meta[0].count[0] / this.pages.pagesize) + 1),
                  rctx: res.aquabrowser.meta[0].rctx[0]
              }
          })
      }

      getRequests(url) {
        return this.getAmountOfRequests(url).then(helpers => {
            helpers.amount > this.pages.maxpages ? helpers.amount = this.pages.maxpages : false
            let page = this.pages.page

            // The builder array, this is the eventual data that gets send
            let promises = [];
            let failedPages = [];
            console.log(helpers.amount)

            let promiseToSendAllData = new Promise( (resolve, reject) => {
                function TimeoutApi(pages, url, promises) {
                    if (pages.page > helpers.amount) {
                        setTimeout(() => {
                            resolve({data: promises, failed: failedPages})
                        }, 1000)
                    } else {
                        console.log(`Resolving page no.${pages.page}`)

                        axios.get(`${url}&page=${pages.page}&pagesize=20&rctx=${helpers.rctx}`)
                        // If status code 200:
                        .then(res => convert(res.data))
                        .then(res => res.aquabrowser.results[0].result)
                        .then(res => res.map(book => {
                            let bookArray = [];

                            // let title = book.titles && book.titles[0] && book.titles[0].title && book.titles[0].title[0] ? book.titles[0].title[0]._ : null;
                            let totalPages = book.description && book.description[0] && book.description[0]["physical-description"] && book.description[0]["physical-description"][0] ? book.description[0]["physical-description"][0]._ : null;

                            bookArray.push({
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
                                        year: book.publication && book.publication[0].year && book.publication[0].year[0]['_'] ? book.publication[0].year[0]['_'] : null
                                      },
                                    ],
                                    pages: Number(totalPages.substring(0, totalPages.indexOf('p')).trim())
                                    // cover: book.coverimages && book.coverimages[0] && book.coverimages[0].coverimage && book.coverimages[0].coverimage[1] ? book.coverimages[0].coverimage[1]._ : null
                                  }
                                ]
                            })

                            return promises.push(bookArray)
                        }))
                        .catch(err => {
                            let pageNumber = err.config.url.split('&')[4].split('=')[1]
                            console.log(`Error: Failed to resolve page: ${pageNumber}`)
                            return failedPages.push(pageNumber)
                        })

                        // If status code != 200, go on to the next request or retry.

                        pages.page++
                        setTimeout(TimeoutApi, 1100, pages, url, promises)
                    }
                }

                TimeoutApi(this.pages, url, promises)
            })

            return promiseToSendAllData
        })
    }
}
