# Process

![structuur](tree.png)

## Table of contents

* [Concept](#concept)
* [API](#api)
* [Data](#data)
* [Circle packing](#circle-packing)
* [D3](#d3)
  * [Nesting](#nesting)
  * [Interaction](#interaction)

## Concept

At first I thought I needed to structure my data in the server, but this was wrong. Now I just collect the data I need and add the structure in D3. This makes it possible to add a size value which is needed to calculate the depth of the 'bubble'. I'm using `d3.nest()` to structure the data. Because I need to go deeper into the bubbles every time, I need to nest inside my nest. This works; I am able to show genre-bubbles with my books inside.

![drawing](drawing.JPG)

## API



## Data



## Circle packing



## D3



### Nesting

I started the nesting process in `const sortByLanguage`. Usually a nest results in `keys` and `values`. I need a different structure, I need `names` and `children`. To get these, I need to `map` and change the keys and values to names and children. This structure is needed to create my circle packing.

### Interaction



I used `D3` and everything I learned with functional programming to create a data visualization. The circle packing I made turned out to be a bit harder than I thought.



Now I need a new layer. I need my books to be inside the genre-bubbles INSIDE a language bubble. This way I can visualize genres inside (original) language, and show my books per genre. If this works I am able to add a filter, so the user can choose to either see books per genre per language or just books per language. Not very interesting, but it's the best I can do...

I struggled a lot to get the bubbles working. Titus and Folkert helped me a lot and we eventually managed to get it to work. Now I'm struggling to get my data structure right... I haven't even gotten started on the interaction part...

I tried nesting my genres into my original language. For some reason this is an impossible task... I am able to show my books per language, but when I try to add a new layer (genres) it's not working the way I want it too.
