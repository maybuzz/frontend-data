# frontend-data

## Table of contents

- Introduction
- Installation
- Data
  - API
  - Code
- Process
- To do
- Credits
  - Resources
- License

## Introduction

I made a datavisualisation about comic books in the public library of Amsterdam (OBA). I used the `OBA API` to collect the data. Read more about the data and code in `Data`

## Installation



## Data
functies en andere dingen die ik heb geleerd dit project
- `.map` ->
- `.trim()` ->
- `Number()` ->


### API
hoe ik communiceer met de api, hoe ik 100 keer van api ding verander en waarom ik het nu heb hoe ik het heb

plus, stukje dat ik in de gissa node module heb aan moeten passen


### Code
- `title`, `authors`, `languages`, `publication`, `pages` -> These labels kind of speak for themselves...
- `meta` -> This label includes the `subject` and `genre(s)`. I didn't really know what else to call it.

This is a piece of code from `index.js`. This is where I define my data structure using
```js
{
  title: book.titles && book.titles[0] && book.titles[0].title && book.titles[0].title[0] ? book.titles[0].title[0]._ : null,
  info: [
    {
      // main-author & other authors
      // separate objects to generate separate circles
      authors: [
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
    }
  ]
}
```


## Process

Over d3 en hoe ik mn data in d3 heb omgezet tot cirkeltjes

stukje code ?

I used `D3` and everything I learned with functional programming to create a datavisualisation.

## To do

- [x] Write (english) README.md
- [ ] Fix `table-of-contents`
- [ ] Write `Installation`, `API` and `Process`
- [ ] Finish `Data`, `Code`, `Credits`, `Resources` and `License`
- [ ] Fix code-snippet in `Code`
- [x] Connect to API
- [x] Generate data, write to data.json
- [ ] Create `D3` datavisualisation with 1000 books (part of data)
- [ ] Update datavisualisation to complete dataset (+/- 7000 books)
- [ ] Filter data, turn on and off


## Credits

github handles van al mijn lieve helpertjes

Titus Wormer `@wooorm`    
Folkert-Jan vd Pol `@FJvdP`    
Gijs Laarman `@gijslaarman`

### Resources

* [datavizcatalogue](https://datavizcatalogue.com/)    
  * [circle packing method](https://datavizcatalogue.com/methods/circle_packing.html)   
  * [tree map method](https://datavizcatalogue.com/methods/treemap.html)    
* [circle packing example](https://bl.ocks.org/mbostock/7607535)    
* [d3 layouts](https://d3indepth.com/layouts/)    
* [gissa oba scraper](https://www.npmjs.com/package/@gijslaarman/oba-scraper)    

## License
