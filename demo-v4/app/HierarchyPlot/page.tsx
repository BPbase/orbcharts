'use client'

import { useState, useEffect, useRef } from 'react'
import type { RawData } from '@orbcharts/core/types'
import { OrbCharts } from '@orbcharts/core/index'
import { HierarchyPlot, Tooltip, Legend } from '@orbcharts/plugins-basic/index'

const rawData: RawData = [
  {
    "id": "Movies",
    "name": "Movies",
    "value": null,
    "series": ""
  },
  {
    "id": "Movies.Action",
    "name": "Action",
    "value": null,
    "parent": "Movies",
    "series": ""
  },
  {
    "id": "Movies.Action.Avatar ",
    "name": "Avatar ",
    "value": 760505847,
    "parent": "Movies.Action",
    "series": "Action"
  },
  {
    "id": "Movies.Action.Jurassic World ",
    "name": "Jurassic World ",
    "value": 652177271,
    "parent": "Movies.Action",
    "series": "Action"
  },
  {
    "id": "Movies.Action.The Avengers ",
    "name": "The Avengers ",
    "value": 623279547,
    "parent": "Movies.Action",
    "series": "Action"
  },
  {
    "id": "Movies.Action.The Dark Knight ",
    "name": "The Dark Knight ",
    "value": 533316061,
    "parent": "Movies.Action",
    "series": "Action"
  },
  {
    "id": "Movies.Action.Star Wars: Episode I - The Phantom Menace ",
    "name": "Star Wars: Episode I - The Phantom Menace ",
    "value": 474544677,
    "parent": "Movies.Action",
    "series": "Action"
  },
  {
    "id": "Movies.Action.Star Wars: Episode IV - A New Hope ",
    "name": "Star Wars: Episode IV - A New Hope ",
    "value": 460935665,
    "parent": "Movies.Action",
    "series": "Action"
  },
  {
    "id": "Movies.Action.Avengers: Age of Ultron ",
    "name": "Avengers: Age of Ultron ",
    "value": 458991599,
    "parent": "Movies.Action",
    "series": "Action"
  },
  {
    "id": "Movies.Action.The Dark Knight Rises ",
    "name": "The Dark Knight Rises ",
    "value": 448130642,
    "parent": "Movies.Action",
    "series": "Action"
  },
  {
    "id": "Movies.Action.Pirates of the Caribbean: Dead Man's Chest ",
    "name": "Pirates of the Caribbean: Dead Man's Chest ",
    "value": 423032628,
    "parent": "Movies.Action",
    "series": "Action"
  },
  {
    "id": "Movies.Action.Iron Man 3",
    "name": "Iron Man 3",
    "value": 408992272,
    "parent": "Movies.Action",
    "series": "Action"
  },
  {
    "id": "Movies.Action.Captain America: Civil War ",
    "name": "Captain America: Civil War ",
    "value": 407197282,
    "parent": "Movies.Action",
    "series": "Action"
  },
  {
    "id": "Movies.Action.Spider-Man ",
    "name": "Spider-Man ",
    "value": 403706375,
    "parent": "Movies.Action",
    "series": "Action"
  },
  {
    "id": "Movies.Action.Transformers: Revenge of the Fallen ",
    "name": "Transformers: Revenge of the Fallen ",
    "value": 402076689,
    "parent": "Movies.Action",
    "series": "Action"
  },
  {
    "id": "Movies.Action.Star Wars: Episode III - Revenge of the Sith ",
    "name": "Star Wars: Episode III - Revenge of the Sith ",
    "value": 380262555,
    "parent": "Movies.Action",
    "series": "Action"
  },
  {
    "id": "Movies.Action.The Lord of the Rings: The Return of the King ",
    "name": "The Lord of the Rings: The Return of the King ",
    "value": 377019252,
    "parent": "Movies.Action",
    "series": "Action"
  },
  {
    "id": "Movies.Action.Spider-Man 2",
    "name": "Spider-Man 2",
    "value": 373377893,
    "parent": "Movies.Action",
    "series": "Action"
  },
  {
    "id": "Movies.Action.Deadpool ",
    "name": "Deadpool ",
    "value": 363024263,
    "parent": "Movies.Action",
    "series": "Action"
  },
  {
    "id": "Movies.Action.Transformers: Dark of the Moon ",
    "name": "Transformers: Dark of the Moon ",
    "value": 352358779,
    "parent": "Movies.Action",
    "series": "Action"
  },
  {
    "id": "Movies.Action.American Sniper ",
    "name": "American Sniper ",
    "value": 350123553,
    "parent": "Movies.Action",
    "series": "Action"
  },
  {
    "id": "Movies.Action.Furious 7",
    "name": "Furious 7",
    "value": 350034110,
    "parent": "Movies.Action",
    "series": "Action"
  },
  {
    "id": "Movies.Action.The Lord of the Rings: The Two Towers ",
    "name": "The Lord of the Rings: The Two Towers ",
    "value": 340478898,
    "parent": "Movies.Action",
    "series": "Action"
  },
  {
    "id": "Movies.Action.Spider-Man 3",
    "name": "Spider-Man 3",
    "value": 336530303,
    "parent": "Movies.Action",
    "series": "Action"
  },
  {
    "id": "Movies.Action.Minions ",
    "name": "Minions ",
    "value": 336029560,
    "parent": "Movies.Action",
    "series": "Action"
  },
  {
    "id": "Movies.Action.Guardians of the Galaxy ",
    "name": "Guardians of the Galaxy ",
    "value": 333130696,
    "parent": "Movies.Action",
    "series": "Action"
  },
  {
    "id": "Movies.Action.Batman v Superman: Dawn of Justice ",
    "name": "Batman v Superman: Dawn of Justice ",
    "value": 330249062,
    "parent": "Movies.Action",
    "series": "Action"
  },
  {
    "id": "Movies.Action.Transformers ",
    "name": "Transformers ",
    "value": 318759914,
    "parent": "Movies.Action",
    "series": "Action"
  },
  {
    "id": "Movies.Action.Iron Man ",
    "name": "Iron Man ",
    "value": 318298180,
    "parent": "Movies.Action",
    "series": "Action"
  },
  {
    "id": "Movies.Action.Indiana Jones and the Kingdom of the Crystal Skull ",
    "name": "Indiana Jones and the Kingdom of the Crystal Skull ",
    "value": 317011114,
    "parent": "Movies.Action",
    "series": "Action"
  },
  {
    "id": "Movies.Action.The Lord of the Rings: The Fellowship of the Ring ",
    "name": "The Lord of the Rings: The Fellowship of the Ring ",
    "value": 313837577,
    "parent": "Movies.Action",
    "series": "Action"
  },
  {
    "id": "Movies.Action.Iron Man 2",
    "name": "Iron Man 2",
    "value": 312057433,
    "parent": "Movies.Action",
    "series": "Action"
  },
  {
    "id": "Movies.Action.Star Wars: Episode II - Attack of the Clones ",
    "name": "Star Wars: Episode II - Attack of the Clones ",
    "value": 310675583,
    "parent": "Movies.Action",
    "series": "Action"
  },
  {
    "id": "Movies.Action.Pirates of the Caribbean: At World's End ",
    "name": "Pirates of the Caribbean: At World's End ",
    "value": 309404152,
    "parent": "Movies.Action",
    "series": "Action"
  },
  {
    "id": "Movies.Action.Star Wars: Episode VI - Return of the Jedi ",
    "name": "Star Wars: Episode VI - Return of the Jedi ",
    "value": 309125409,
    "parent": "Movies.Action",
    "series": "Action"
  },
  {
    "id": "Movies.Action.Independence Day ",
    "name": "Independence Day ",
    "value": 306124059,
    "parent": "Movies.Action",
    "series": "Action"
  },
  {
    "id": "Movies.Action.Pirates of the Caribbean: The Curse of the Black Pearl ",
    "name": "Pirates of the Caribbean: The Curse of the Black Pearl ",
    "value": 305388685,
    "parent": "Movies.Action",
    "series": "Action"
  },
  {
    "id": "Movies.Action.Skyfall ",
    "name": "Skyfall ",
    "value": 304360277,
    "parent": "Movies.Action",
    "series": "Action"
  },
  {
    "id": "Movies.Action.Inception ",
    "name": "Inception ",
    "value": 292568851,
    "parent": "Movies.Action",
    "series": "Action"
  },
  {
    "id": "Movies.Action.Man of Steel ",
    "name": "Man of Steel ",
    "value": 291021565,
    "parent": "Movies.Action",
    "series": "Action"
  },
  {
    "id": "Movies.Action.Star Wars: Episode V - The Empire Strikes Back ",
    "name": "Star Wars: Episode V - The Empire Strikes Back ",
    "value": 290158751,
    "parent": "Movies.Action",
    "series": "Action"
  },
  {
    "id": "Movies.Action.The Matrix Reloaded ",
    "name": "The Matrix Reloaded ",
    "value": 281492479,
    "parent": "Movies.Action",
    "series": "Action"
  },
  {
    "id": "Movies.Action.The Amazing Spider-Man ",
    "name": "The Amazing Spider-Man ",
    "value": 262030663,
    "parent": "Movies.Action",
    "series": "Action"
  },
  {
    "id": "Movies.Action.The Incredibles ",
    "name": "The Incredibles ",
    "value": 261437578,
    "parent": "Movies.Action",
    "series": "Action"
  },
  {
    "id": "Movies.Action.Captain America: The Winter Soldier ",
    "name": "Captain America: The Winter Soldier ",
    "value": 259746958,
    "parent": "Movies.Action",
    "series": "Action"
  },
  {
    "id": "Movies.Action.The Lego Movie ",
    "name": "The Lego Movie ",
    "value": 257756197,
    "parent": "Movies.Action",
    "series": "Action"
  },
  {
    "id": "Movies.Action.Star Trek ",
    "name": "Star Trek ",
    "value": 257704099,
    "parent": "Movies.Action",
    "series": "Action"
  },
  {
    "id": "Movies.Action.Batman ",
    "name": "Batman ",
    "value": 251188924,
    "parent": "Movies.Action",
    "series": "Action"
  },
  {
    "id": "Movies.Action.Night at the Museum ",
    "name": "Night at the Museum ",
    "value": 250863268,
    "parent": "Movies.Action",
    "series": "Action"
  },
  {
    "id": "Movies.Drama",
    "name": "Drama",
    "value": null,
    "parent": "Movies",
    "series": ""
  },
  {
    "id": "Movies.Drama.Titanic ",
    "name": "Titanic ",
    "value": 658672302,
    "parent": "Movies.Drama",
    "series": "Drama"
  },
  {
    "id": "Movies.Drama.The Sixth Sense ",
    "name": "The Sixth Sense ",
    "value": 293501675,
    "parent": "Movies.Drama",
    "series": "Drama"
  },
  {
    "id": "Movies.Drama.I Am Legend ",
    "name": "I Am Legend ",
    "value": 256386216,
    "parent": "Movies.Drama",
    "series": "Drama"
  },
  {
    "id": "Movies.Adventure",
    "name": "Adventure",
    "value": null,
    "parent": "Movies",
    "series": ""
  },
  {
    "id": "Movies.Adventure.Shrek 2",
    "name": "Shrek 2",
    "value": 436471036,
    "parent": "Movies.Adventure",
    "series": "Adventure"
  },
  {
    "id": "Movies.Adventure.The Hunger Games: Catching Fire ",
    "name": "The Hunger Games: Catching Fire ",
    "value": 424645577,
    "parent": "Movies.Adventure",
    "series": "Adventure"
  },
  {
    "id": "Movies.Adventure.The Lion King ",
    "name": "The Lion King ",
    "value": 422783777,
    "parent": "Movies.Adventure",
    "series": "Adventure"
  },
  {
    "id": "Movies.Adventure.Toy Story 3",
    "name": "Toy Story 3",
    "value": 414984497,
    "parent": "Movies.Adventure",
    "series": "Adventure"
  },
  {
    "id": "Movies.Adventure.The Hunger Games ",
    "name": "The Hunger Games ",
    "value": 407999255,
    "parent": "Movies.Adventure",
    "series": "Adventure"
  },
  {
    "id": "Movies.Adventure.Frozen ",
    "name": "Frozen ",
    "value": 400736600,
    "parent": "Movies.Adventure",
    "series": "Adventure"
  },
  {
    "id": "Movies.Adventure.Finding Nemo ",
    "name": "Finding Nemo ",
    "value": 380838870,
    "parent": "Movies.Adventure",
    "series": "Adventure"
  },
  {
    "id": "Movies.Adventure.The Jungle Book ",
    "name": "The Jungle Book ",
    "value": 362645141,
    "parent": "Movies.Adventure",
    "series": "Adventure"
  },
  {
    "id": "Movies.Adventure.Jurassic Park ",
    "name": "Jurassic Park ",
    "value": 356784000,
    "parent": "Movies.Adventure",
    "series": "Adventure"
  },
  {
    "id": "Movies.Adventure.Inside Out ",
    "name": "Inside Out ",
    "value": 356454367,
    "parent": "Movies.Adventure",
    "series": "Adventure"
  },
  {
    "id": "Movies.Adventure.The Hunger Games: Mockingjay - Part 1",
    "name": "The Hunger Games: Mockingjay - Part 1",
    "value": 337103873,
    "parent": "Movies.Adventure",
    "series": "Adventure"
  },
  {
    "id": "Movies.Adventure.Alice in Wonderland ",
    "name": "Alice in Wonderland ",
    "value": 334185206,
    "parent": "Movies.Adventure",
    "series": "Adventure"
  },
  {
    "id": "Movies.Adventure.Shrek the Third ",
    "name": "Shrek the Third ",
    "value": 320706665,
    "parent": "Movies.Adventure",
    "series": "Adventure"
  },
  {
    "id": "Movies.Adventure.Harry Potter and the Sorcerer's Stone ",
    "name": "Harry Potter and the Sorcerer's Stone ",
    "value": 317557891,
    "parent": "Movies.Adventure",
    "series": "Adventure"
  },
  {
    "id": "Movies.Adventure.The Hobbit: An Unexpected Journey ",
    "name": "The Hobbit: An Unexpected Journey ",
    "value": 303001229,
    "parent": "Movies.Adventure",
    "series": "Adventure"
  },
  {
    "id": "Movies.Adventure.Harry Potter and the Half-Blood Prince ",
    "name": "Harry Potter and the Half-Blood Prince ",
    "value": 301956980,
    "parent": "Movies.Adventure",
    "series": "Adventure"
  },
  {
    "id": "Movies.Adventure.The Twilight Saga: Eclipse ",
    "name": "The Twilight Saga: Eclipse ",
    "value": 300523113,
    "parent": "Movies.Adventure",
    "series": "Adventure"
  },
  {
    "id": "Movies.Adventure.The Twilight Saga: New Moon ",
    "name": "The Twilight Saga: New Moon ",
    "value": 296623634,
    "parent": "Movies.Adventure",
    "series": "Adventure"
  },
  {
    "id": "Movies.Adventure.Up ",
    "name": "Up ",
    "value": 292979556,
    "parent": "Movies.Adventure",
    "series": "Adventure"
  },
  {
    "id": "Movies.Adventure.The Twilight Saga: Breaking Dawn - Part 2",
    "name": "The Twilight Saga: Breaking Dawn - Part 2",
    "value": 292298923,
    "parent": "Movies.Adventure",
    "series": "Adventure"
  },
  {
    "id": "Movies.Adventure.Harry Potter and the Order of the Phoenix ",
    "name": "Harry Potter and the Order of the Phoenix ",
    "value": 292000866,
    "parent": "Movies.Adventure",
    "series": "Adventure"
  },
  {
    "id": "Movies.Adventure.The Chronicles of Narnia: The Lion, the Witch and the Wardrobe ",
    "name": "The Chronicles of Narnia: The Lion, the Witch and the Wardrobe ",
    "value": 291709845,
    "parent": "Movies.Adventure",
    "series": "Adventure"
  },
  {
    "id": "Movies.Adventure.Harry Potter and the Goblet of Fire ",
    "name": "Harry Potter and the Goblet of Fire ",
    "value": 289994397,
    "parent": "Movies.Adventure",
    "series": "Adventure"
  },
  {
    "id": "Movies.Adventure.Monsters, Inc. ",
    "name": "Monsters, Inc. ",
    "value": 289907418,
    "parent": "Movies.Adventure",
    "series": "Adventure"
  },
  {
    "id": "Movies.Adventure.The Hunger Games: Mockingjay - Part 2",
    "name": "The Hunger Games: Mockingjay - Part 2",
    "value": 281666058,
    "parent": "Movies.Adventure",
    "series": "Adventure"
  },
  {
    "id": "Movies.Adventure.Gravity ",
    "name": "Gravity ",
    "value": 274084951,
    "parent": "Movies.Adventure",
    "series": "Adventure"
  },
  {
    "id": "Movies.Adventure.Monsters University ",
    "name": "Monsters University ",
    "value": 268488329,
    "parent": "Movies.Adventure",
    "series": "Adventure"
  },
  {
    "id": "Movies.Adventure.Shrek ",
    "name": "Shrek ",
    "value": 267652016,
    "parent": "Movies.Adventure",
    "series": "Adventure"
  },
  {
    "id": "Movies.Adventure.Harry Potter and the Chamber of Secrets ",
    "name": "Harry Potter and the Chamber of Secrets ",
    "value": 261970615,
    "parent": "Movies.Adventure",
    "series": "Adventure"
  },
  {
    "id": "Movies.Adventure.Jaws ",
    "name": "Jaws ",
    "value": 260000000,
    "parent": "Movies.Adventure",
    "series": "Adventure"
  },
  {
    "id": "Movies.Adventure.The Hobbit: The Desolation of Smaug ",
    "name": "The Hobbit: The Desolation of Smaug ",
    "value": 258355354,
    "parent": "Movies.Adventure",
    "series": "Adventure"
  },
  {
    "id": "Movies.Adventure.The Hobbit: The Battle of the Five Armies ",
    "name": "The Hobbit: The Battle of the Five Armies ",
    "value": 255108370,
    "parent": "Movies.Adventure",
    "series": "Adventure"
  },
  {
    "id": "Movies.Adventure.Men in Black ",
    "name": "Men in Black ",
    "value": 250147615,
    "parent": "Movies.Adventure",
    "series": "Adventure"
  },
  {
    "id": "Movies.Family",
    "name": "Family",
    "value": null,
    "parent": "Movies",
    "series": ""
  },
  {
    "id": "Movies.Family.E.T. the Extra-Terrestrial ",
    "name": "E.T. the Extra-Terrestrial ",
    "value": 434949459,
    "parent": "Movies.Family",
    "series": "Family"
  },
  {
    "id": "Movies.Animation",
    "name": "Animation",
    "value": null,
    "parent": "Movies",
    "series": ""
  },
  {
    "id": "Movies.Animation.Despicable Me 2",
    "name": "Despicable Me 2",
    "value": 368049635,
    "parent": "Movies.Animation",
    "series": "Animation"
  },
  {
    "id": "Movies.Animation.The Secret Life of Pets ",
    "name": "The Secret Life of Pets ",
    "value": 323505540,
    "parent": "Movies.Animation",
    "series": "Animation"
  },
  {
    "id": "Movies.Animation.Despicable Me ",
    "name": "Despicable Me ",
    "value": 251501645,
    "parent": "Movies.Animation",
    "series": "Animation"
  },
  {
    "id": "Movies.Comedy",
    "name": "Comedy",
    "value": null,
    "parent": "Movies",
    "series": ""
  },
  {
    "id": "Movies.Comedy.Forrest Gump ",
    "name": "Forrest Gump ",
    "value": 329691196,
    "parent": "Movies.Comedy",
    "series": "Comedy"
  },
  {
    "id": "Movies.Comedy.Home Alone ",
    "name": "Home Alone ",
    "value": 285761243,
    "parent": "Movies.Comedy",
    "series": "Comedy"
  },
  {
    "id": "Movies.Comedy.Meet the Fockers ",
    "name": "Meet the Fockers ",
    "value": 279167575,
    "parent": "Movies.Comedy",
    "series": "Comedy"
  },
  {
    "id": "Movies.Comedy.The Hangover ",
    "name": "The Hangover ",
    "value": 277313371,
    "parent": "Movies.Comedy",
    "series": "Comedy"
  },
  {
    "id": "Movies.Comedy.How the Grinch Stole Christmas ",
    "name": "How the Grinch Stole Christmas ",
    "value": 260031035,
    "parent": "Movies.Comedy",
    "series": "Comedy"
  },
  {
    "id": "Movies.Comedy.The Hangover Part II ",
    "name": "The Hangover Part II ",
    "value": 254455986,
    "parent": "Movies.Comedy",
    "series": "Comedy"
  },
  {
    "id": "Movies.Biography",
    "name": "Biography",
    "value": null,
    "parent": "Movies",
    "series": ""
  },
  {
    "id": "Movies.Biography.The Blind Side ",
    "name": "The Blind Side ",
    "value": 255950375,
    "parent": "Movies.Biography",
    "series": "Biography"
  }
]


export default function HierarchyPlotPage() {

  const domRef = useRef<HTMLDivElement | null>(null)
  const chartRef = useRef<OrbCharts | null>(null)

  useEffect(() => {
    
    // console.log(domRef.current)

    const treePlot = new HierarchyPlot({
      // styles: {
      //   padding: {
      //     top: 60,
      //     right: 60,
      //     bottom: 60,
      //     left: 60
      //   },
      //   highlightTarget: 'datum',
      //   highlightDefault: null,
      //   unhighlightedOpacity: 0.3,
      //   transitionDuration: 800,
      //   transitionEase: 'easeCubic'
      // },
      // visibleFilter: (datum: any) => true,
      // sort: null,
      // // seriesLabels: [],
      // container: {
      //   columnAmount: 1,
      //   rowAmount: 1,
      //   columnGap: 'auto',
      //   rowGap: 'auto',
      // },
      // separateSeries: false,
      // separateName: false,
      // // sumSeries: false,
      // datasetIndex: 0
    })

    const tooltip = new Tooltip({
      Tooltip: {}
    })

    const legend = new Legend({
      Legend: {}
    })

    const chart = new OrbCharts(domRef.current!, {
      data: rawData,
      encoding: {
        // category 欄位改為 series 時，仍可直接用預設配置
        // createTreeData 已改成只依 dataset 分樹
        // value: {
        //   sort: 'asc'
        // },
        // color: {
        //   from: 'series'
        // }
      },
      // plugins: [],
      theme: {
        // colorScheme: 'light',
        // colors: {
        //   light: {
        //     data: [
        //       "#0088FF",
        //       "#FF3232",
        //       "#38BEA8",
        //       "#6F3BD5",
        //       "#314285",
        //       "#42C724",
        //       "#D52580",
        //       "#F4721B",
        //       "#D117EA",
        //       "#7E7D7D"
        //     ],
        //     primary: '#000000',
        //     secondary: '#e0e0e0',
        //     dataContrast: ['#ffffff', '#000000'],
        //     background: '#FFFFFF'
        //   },
        //   dark: {
        //     data: [
        //       "#4BABFF",
        //       "#FF6C6C",
        //       "#7DD3C4",
        //       "#8E6BC9",
        //       "#5366AC",
        //       "#86DC72",
        //       "#FF72BB",
        //       "#F9B052",
        //       "#EF76FF",
        //       "#C4C4C4"
        //     ],
        //     primary: '#FFFFFF',
        //     secondary: '#e0e0e0',
        //     dataContrast: ['#ffffff', '#000000'],
        //     background: '#000000'
        //   }
        // },
        // fontSize: '0.875rem'
      },
      plugins: [treePlot, tooltip, legend]
    })

    const subscription = chart.context.treeData$.subscribe(data => {
      console.log('Tree Data Updated:', data)
    })

    return () => {
      subscription.unsubscribe()
      chart.destroy()
    }

  }, [])

  return <div ref={domRef}></div>
}
