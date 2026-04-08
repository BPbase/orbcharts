'use client'

import { useState, useEffect, useRef } from 'react'
import type { RawData } from '@orbcharts/core'
import { OrbCharts } from '@orbcharts/core'
import { CategoricalPlot, Tooltip, Legend } from '@orbcharts/plugin-basic'


const data: RawData = [
    {
        "id": "news [yahoo!奇摩新聞]-0",
        "name": "news [yahoo!奇摩新聞]-0",
        "series": "news [yahoo!奇摩新聞]",
        "category": "0",
        "value": 5
    },
    {
        "id": "news [yahoo!奇摩新聞]-1",
        "name": "news [yahoo!奇摩新聞]-1",
        "series": "news [yahoo!奇摩新聞]",
        "category": "1",
        "value": 5
    },
    {
        "id": "news [yahoo!奇摩新聞]-2",
        "name": "news [yahoo!奇摩新聞]-2",
        "series": "news [yahoo!奇摩新聞]",
        "category": "2",
        "value": 667
    },
    {
        "id": "news [yahoo!奇摩新聞]-3",
        "name": "news [yahoo!奇摩新聞]-3",
        "series": "news [yahoo!奇摩新聞]",
        "category": "3",
        "value": 725
    },
    {
        "id": "news [yahoo!奇摩新聞]-4",
        "name": "news [yahoo!奇摩新聞]-4",
        "series": "news [yahoo!奇摩新聞]",
        "category": "4",
        "value": 530
    },
    {
        "id": "news [yahoo!奇摩新聞]-5",
        "name": "news [yahoo!奇摩新聞]-5",
        "series": "news [yahoo!奇摩新聞]",
        "category": "5",
        "value": 427
    },
    {
        "id": "news [yahoo!奇摩新聞]-6",
        "name": "news [yahoo!奇摩新聞]-6",
        "series": "news [yahoo!奇摩新聞]",
        "category": "6",
        "value": 347
    },
    {
        "id": "news [yahoo!奇摩新聞]-7",
        "name": "news [yahoo!奇摩新聞]-7",
        "series": "news [yahoo!奇摩新聞]",
        "category": "7",
        "value": 211
    },
    {
        "id": "news [yahoo!奇摩新聞]-8",
        "name": "news [yahoo!奇摩新聞]-8",
        "series": "news [yahoo!奇摩新聞]",
        "category": "8",
        "value": 191
    },
    {
        "id": "news [yahoo!奇摩新聞]-9",
        "name": "news [yahoo!奇摩新聞]-9",
        "series": "news [yahoo!奇摩新聞]",
        "category": "9",
        "value": 131
    },
    {
        "id": "news [yahoo!奇摩新聞]-10",
        "name": "news [yahoo!奇摩新聞]-10",
        "series": "news [yahoo!奇摩新聞]",
        "category": "10",
        "value": 128
    },
    {
        "id": "news [yahoo!奇摩新聞]-11",
        "name": "news [yahoo!奇摩新聞]-11",
        "series": "news [yahoo!奇摩新聞]",
        "category": "11",
        "value": 109
    },
    {
        "id": "news [yahoo!奇摩新聞]-12",
        "name": "news [yahoo!奇摩新聞]-12",
        "series": "news [yahoo!奇摩新聞]",
        "category": "12",
        "value": 51
    },
    {
        "id": "news [yahoo!奇摩新聞]-13",
        "name": "news [yahoo!奇摩新聞]-13",
        "series": "news [yahoo!奇摩新聞]",
        "category": "13",
        "value": 71
    },
    {
        "id": "news [yahoo!奇摩新聞]-14",
        "name": "news [yahoo!奇摩新聞]-14",
        "series": "news [yahoo!奇摩新聞]",
        "category": "14",
        "value": 64
    },
    {
        "id": "news [yahoo!奇摩新聞]-15",
        "name": "news [yahoo!奇摩新聞]-15",
        "series": "news [yahoo!奇摩新聞]",
        "category": "15",
        "value": 41
    },
    {
        "id": "news [yahoo!奇摩新聞]-16",
        "name": "news [yahoo!奇摩新聞]-16",
        "series": "news [yahoo!奇摩新聞]",
        "category": "16",
        "value": 37
    },
    {
        "id": "news [yahoo!奇摩新聞]-17",
        "name": "news [yahoo!奇摩新聞]-17",
        "series": "news [yahoo!奇摩新聞]",
        "category": "17",
        "value": 23
    },
    {
        "id": "news [yahoo!奇摩新聞]-18",
        "name": "news [yahoo!奇摩新聞]-18",
        "series": "news [yahoo!奇摩新聞]",
        "category": "18",
        "value": 43
    },
    {
        "id": "news [yahoo!奇摩新聞]-19",
        "name": "news [yahoo!奇摩新聞]-19",
        "series": "news [yahoo!奇摩新聞]",
        "category": "19",
        "value": 66
    },
    {
        "id": "news [yahoo!奇摩新聞]-20",
        "name": "news [yahoo!奇摩新聞]-20",
        "series": "news [yahoo!奇摩新聞]",
        "category": "20",
        "value": 71
    },
    {
        "id": "news [yahoo!奇摩新聞]-21",
        "name": "news [yahoo!奇摩新聞]-21",
        "series": "news [yahoo!奇摩新聞]",
        "category": "21",
        "value": 29
    },
    {
        "id": "news [yahoo!奇摩新聞]-22",
        "name": "news [yahoo!奇摩新聞]-22",
        "series": "news [yahoo!奇摩新聞]",
        "category": "22",
        "value": 8
    },
    {
        "id": "news [yahoo!奇摩新聞]-23",
        "name": "news [yahoo!奇摩新聞]-23",
        "series": "news [yahoo!奇摩新聞]",
        "category": "23",
        "value": 13
    },
    {
        "id": "news [yahoo!奇摩新聞]-24",
        "name": "news [yahoo!奇摩新聞]-24",
        "series": "news [yahoo!奇摩新聞]",
        "category": "24",
        "value": 40
    },
    {
        "id": "news [yahoo!奇摩新聞]-25",
        "name": "news [yahoo!奇摩新聞]-25",
        "series": "news [yahoo!奇摩新聞]",
        "category": "25",
        "value": 18
    },
    {
        "id": "news [yahoo!奇摩新聞]-26",
        "name": "news [yahoo!奇摩新聞]-26",
        "series": "news [yahoo!奇摩新聞]",
        "category": "26",
        "value": 16
    },
    {
        "id": "news [yahoo!奇摩新聞]-27",
        "name": "news [yahoo!奇摩新聞]-27",
        "series": "news [yahoo!奇摩新聞]",
        "category": "27",
        "value": 22
    },
    {
        "id": "ptt [Gossiping]-0",
        "name": "ptt [Gossiping]-0",
        "series": "ptt [Gossiping]",
        "category": "0",
        "value": 0
    },
    {
        "id": "ptt [Gossiping]-1",
        "name": "ptt [Gossiping]-1",
        "series": "ptt [Gossiping]",
        "category": "1",
        "value": 7
    },
    {
        "id": "ptt [Gossiping]-2",
        "name": "ptt [Gossiping]-2",
        "series": "ptt [Gossiping]",
        "category": "2",
        "value": 694
    },
    {
        "id": "ptt [Gossiping]-3",
        "name": "ptt [Gossiping]-3",
        "series": "ptt [Gossiping]",
        "category": "3",
        "value": 353
    },
    {
        "id": "ptt [Gossiping]-4",
        "name": "ptt [Gossiping]-4",
        "series": "ptt [Gossiping]",
        "category": "4",
        "value": 194
    },
    {
        "id": "ptt [Gossiping]-5",
        "name": "ptt [Gossiping]-5",
        "series": "ptt [Gossiping]",
        "category": "5",
        "value": 187
    },
    {
        "id": "ptt [Gossiping]-6",
        "name": "ptt [Gossiping]-6",
        "series": "ptt [Gossiping]",
        "category": "6",
        "value": 118
    },
    {
        "id": "ptt [Gossiping]-7",
        "name": "ptt [Gossiping]-7",
        "series": "ptt [Gossiping]",
        "category": "7",
        "value": 58
    },
    {
        "id": "ptt [Gossiping]-8",
        "name": "ptt [Gossiping]-8",
        "series": "ptt [Gossiping]",
        "category": "8",
        "value": 34
    },
    {
        "id": "ptt [Gossiping]-9",
        "name": "ptt [Gossiping]-9",
        "series": "ptt [Gossiping]",
        "category": "9",
        "value": 31
    },
    {
        "id": "ptt [Gossiping]-10",
        "name": "ptt [Gossiping]-10",
        "series": "ptt [Gossiping]",
        "category": "10",
        "value": 29
    },
    {
        "id": "ptt [Gossiping]-11",
        "name": "ptt [Gossiping]-11",
        "series": "ptt [Gossiping]",
        "category": "11",
        "value": 20
    },
    {
        "id": "ptt [Gossiping]-12",
        "name": "ptt [Gossiping]-12",
        "series": "ptt [Gossiping]",
        "category": "12",
        "value": 23
    },
    {
        "id": "ptt [Gossiping]-13",
        "name": "ptt [Gossiping]-13",
        "series": "ptt [Gossiping]",
        "category": "13",
        "value": 10
    },
    {
        "id": "ptt [Gossiping]-14",
        "name": "ptt [Gossiping]-14",
        "series": "ptt [Gossiping]",
        "category": "14",
        "value": 7
    },
    {
        "id": "ptt [Gossiping]-15",
        "name": "ptt [Gossiping]-15",
        "series": "ptt [Gossiping]",
        "category": "15",
        "value": 20
    },
    {
        "id": "ptt [Gossiping]-16",
        "name": "ptt [Gossiping]-16",
        "series": "ptt [Gossiping]",
        "category": "16",
        "value": 8
    },
    {
        "id": "ptt [Gossiping]-17",
        "name": "ptt [Gossiping]-17",
        "series": "ptt [Gossiping]",
        "category": "17",
        "value": 15
    },
    {
        "id": "ptt [Gossiping]-18",
        "name": "ptt [Gossiping]-18",
        "series": "ptt [Gossiping]",
        "category": "18",
        "value": 5
    },
    {
        "id": "ptt [Gossiping]-19",
        "name": "ptt [Gossiping]-19",
        "series": "ptt [Gossiping]",
        "category": "19",
        "value": 10
    },
    {
        "id": "ptt [Gossiping]-20",
        "name": "ptt [Gossiping]-20",
        "series": "ptt [Gossiping]",
        "category": "20",
        "value": 11
    },
    {
        "id": "ptt [Gossiping]-21",
        "name": "ptt [Gossiping]-21",
        "series": "ptt [Gossiping]",
        "category": "21",
        "value": 0
    },
    {
        "id": "ptt [Gossiping]-22",
        "name": "ptt [Gossiping]-22",
        "series": "ptt [Gossiping]",
        "category": "22",
        "value": 4
    },
    {
        "id": "ptt [Gossiping]-23",
        "name": "ptt [Gossiping]-23",
        "series": "ptt [Gossiping]",
        "category": "23",
        "value": 14
    },
    {
        "id": "ptt [Gossiping]-24",
        "name": "ptt [Gossiping]-24",
        "series": "ptt [Gossiping]",
        "category": "24",
        "value": 7
    },
    {
        "id": "ptt [Gossiping]-25",
        "name": "ptt [Gossiping]-25",
        "series": "ptt [Gossiping]",
        "category": "25",
        "value": 5
    },
    {
        "id": "ptt [Gossiping]-26",
        "name": "ptt [Gossiping]-26",
        "series": "ptt [Gossiping]",
        "category": "26",
        "value": 6
    },
    {
        "id": "ptt [Gossiping]-27",
        "name": "ptt [Gossiping]-27",
        "series": "ptt [Gossiping]",
        "category": "27",
        "value": 1
    },
    {
        "id": "news [三立新聞網]-0",
        "name": "news [三立新聞網]-0",
        "series": "news [三立新聞網]",
        "category": "0",
        "value": 1
    },
    {
        "id": "news [三立新聞網]-1",
        "name": "news [三立新聞網]-1",
        "series": "news [三立新聞網]",
        "category": "1",
        "value": 1
    },
    {
        "id": "news [三立新聞網]-2",
        "name": "news [三立新聞網]-2",
        "series": "news [三立新聞網]",
        "category": "2",
        "value": 217
    },
    {
        "id": "news [三立新聞網]-3",
        "name": "news [三立新聞網]-3",
        "series": "news [三立新聞網]",
        "category": "3",
        "value": 190
    },
    {
        "id": "news [三立新聞網]-4",
        "name": "news [三立新聞網]-4",
        "series": "news [三立新聞網]",
        "category": "4",
        "value": 132
    },
    {
        "id": "news [三立新聞網]-5",
        "name": "news [三立新聞網]-5",
        "series": "news [三立新聞網]",
        "category": "5",
        "value": 112
    },
    {
        "id": "news [三立新聞網]-6",
        "name": "news [三立新聞網]-6",
        "series": "news [三立新聞網]",
        "category": "6",
        "value": 115
    },
    {
        "id": "news [三立新聞網]-7",
        "name": "news [三立新聞網]-7",
        "series": "news [三立新聞網]",
        "category": "7",
        "value": 45
    },
    {
        "id": "news [三立新聞網]-8",
        "name": "news [三立新聞網]-8",
        "series": "news [三立新聞網]",
        "category": "8",
        "value": 53
    },
    {
        "id": "news [三立新聞網]-9",
        "name": "news [三立新聞網]-9",
        "series": "news [三立新聞網]",
        "category": "9",
        "value": 44
    },
    {
        "id": "news [三立新聞網]-10",
        "name": "news [三立新聞網]-10",
        "series": "news [三立新聞網]",
        "category": "10",
        "value": 49
    },
    {
        "id": "news [三立新聞網]-11",
        "name": "news [三立新聞網]-11",
        "series": "news [三立新聞網]",
        "category": "11",
        "value": 32
    },
    {
        "id": "news [三立新聞網]-12",
        "name": "news [三立新聞網]-12",
        "series": "news [三立新聞網]",
        "category": "12",
        "value": 27
    },
    {
        "id": "news [三立新聞網]-13",
        "name": "news [三立新聞網]-13",
        "series": "news [三立新聞網]",
        "category": "13",
        "value": 21
    },
    {
        "id": "news [三立新聞網]-14",
        "name": "news [三立新聞網]-14",
        "series": "news [三立新聞網]",
        "category": "14",
        "value": 12
    },
    {
        "id": "news [三立新聞網]-15",
        "name": "news [三立新聞網]-15",
        "series": "news [三立新聞網]",
        "category": "15",
        "value": 9
    },
    {
        "id": "news [三立新聞網]-16",
        "name": "news [三立新聞網]-16",
        "series": "news [三立新聞網]",
        "category": "16",
        "value": 7
    },
    {
        "id": "news [三立新聞網]-17",
        "name": "news [三立新聞網]-17",
        "series": "news [三立新聞網]",
        "category": "17",
        "value": 10
    },
    {
        "id": "news [三立新聞網]-18",
        "name": "news [三立新聞網]-18",
        "series": "news [三立新聞網]",
        "category": "18",
        "value": 19
    },
    {
        "id": "news [三立新聞網]-19",
        "name": "news [三立新聞網]-19",
        "series": "news [三立新聞網]",
        "category": "19",
        "value": 21
    },
    {
        "id": "news [三立新聞網]-20",
        "name": "news [三立新聞網]-20",
        "series": "news [三立新聞網]",
        "category": "20",
        "value": 25
    },
    {
        "id": "news [三立新聞網]-21",
        "name": "news [三立新聞網]-21",
        "series": "news [三立新聞網]",
        "category": "21",
        "value": 9
    },
    {
        "id": "news [三立新聞網]-22",
        "name": "news [三立新聞網]-22",
        "series": "news [三立新聞網]",
        "category": "22",
        "value": 2
    },
    {
        "id": "news [三立新聞網]-23",
        "name": "news [三立新聞網]-23",
        "series": "news [三立新聞網]",
        "category": "23",
        "value": 5
    },
    {
        "id": "news [三立新聞網]-24",
        "name": "news [三立新聞網]-24",
        "series": "news [三立新聞網]",
        "category": "24",
        "value": 14
    },
    {
        "id": "news [三立新聞網]-25",
        "name": "news [三立新聞網]-25",
        "series": "news [三立新聞網]",
        "category": "25",
        "value": 5
    },
    {
        "id": "news [三立新聞網]-26",
        "name": "news [三立新聞網]-26",
        "series": "news [三立新聞網]",
        "category": "26",
        "value": 4
    },
    {
        "id": "news [三立新聞網]-27",
        "name": "news [三立新聞網]-27",
        "series": "news [三立新聞網]",
        "category": "27",
        "value": 4
    },
    {
        "id": "news [ETtoday新聞雲]-0",
        "name": "news [ETtoday新聞雲]-0",
        "series": "news [ETtoday新聞雲]",
        "category": "0",
        "value": 3
    },
    {
        "id": "news [ETtoday新聞雲]-1",
        "name": "news [ETtoday新聞雲]-1",
        "series": "news [ETtoday新聞雲]",
        "category": "1",
        "value": 3
    },
    {
        "id": "news [ETtoday新聞雲]-2",
        "name": "news [ETtoday新聞雲]-2",
        "series": "news [ETtoday新聞雲]",
        "category": "2",
        "value": 172
    },
    {
        "id": "news [ETtoday新聞雲]-3",
        "name": "news [ETtoday新聞雲]-3",
        "series": "news [ETtoday新聞雲]",
        "category": "3",
        "value": 142
    },
    {
        "id": "news [ETtoday新聞雲]-4",
        "name": "news [ETtoday新聞雲]-4",
        "series": "news [ETtoday新聞雲]",
        "category": "4",
        "value": 107
    },
    {
        "id": "news [ETtoday新聞雲]-5",
        "name": "news [ETtoday新聞雲]-5",
        "series": "news [ETtoday新聞雲]",
        "category": "5",
        "value": 77
    },
    {
        "id": "news [ETtoday新聞雲]-6",
        "name": "news [ETtoday新聞雲]-6",
        "series": "news [ETtoday新聞雲]",
        "category": "6",
        "value": 68
    },
    {
        "id": "news [ETtoday新聞雲]-7",
        "name": "news [ETtoday新聞雲]-7",
        "series": "news [ETtoday新聞雲]",
        "category": "7",
        "value": 29
    },
    {
        "id": "news [ETtoday新聞雲]-8",
        "name": "news [ETtoday新聞雲]-8",
        "series": "news [ETtoday新聞雲]",
        "category": "8",
        "value": 40
    },
    {
        "id": "news [ETtoday新聞雲]-9",
        "name": "news [ETtoday新聞雲]-9",
        "series": "news [ETtoday新聞雲]",
        "category": "9",
        "value": 39
    },
    {
        "id": "news [ETtoday新聞雲]-10",
        "name": "news [ETtoday新聞雲]-10",
        "series": "news [ETtoday新聞雲]",
        "category": "10",
        "value": 30
    },
    {
        "id": "news [ETtoday新聞雲]-11",
        "name": "news [ETtoday新聞雲]-11",
        "series": "news [ETtoday新聞雲]",
        "category": "11",
        "value": 22
    },
    {
        "id": "news [ETtoday新聞雲]-12",
        "name": "news [ETtoday新聞雲]-12",
        "series": "news [ETtoday新聞雲]",
        "category": "12",
        "value": 16
    },
    {
        "id": "news [ETtoday新聞雲]-13",
        "name": "news [ETtoday新聞雲]-13",
        "series": "news [ETtoday新聞雲]",
        "category": "13",
        "value": 16
    },
    {
        "id": "news [ETtoday新聞雲]-14",
        "name": "news [ETtoday新聞雲]-14",
        "series": "news [ETtoday新聞雲]",
        "category": "14",
        "value": 9
    },
    {
        "id": "news [ETtoday新聞雲]-15",
        "name": "news [ETtoday新聞雲]-15",
        "series": "news [ETtoday新聞雲]",
        "category": "15",
        "value": 7
    },
    {
        "id": "news [ETtoday新聞雲]-16",
        "name": "news [ETtoday新聞雲]-16",
        "series": "news [ETtoday新聞雲]",
        "category": "16",
        "value": 9
    },
    {
        "id": "news [ETtoday新聞雲]-17",
        "name": "news [ETtoday新聞雲]-17",
        "series": "news [ETtoday新聞雲]",
        "category": "17",
        "value": 5
    },
    {
        "id": "news [ETtoday新聞雲]-18",
        "name": "news [ETtoday新聞雲]-18",
        "series": "news [ETtoday新聞雲]",
        "category": "18",
        "value": 8
    },
    {
        "id": "news [ETtoday新聞雲]-19",
        "name": "news [ETtoday新聞雲]-19",
        "series": "news [ETtoday新聞雲]",
        "category": "19",
        "value": 17
    },
    {
        "id": "news [ETtoday新聞雲]-20",
        "name": "news [ETtoday新聞雲]-20",
        "series": "news [ETtoday新聞雲]",
        "category": "20",
        "value": 14
    },
    {
        "id": "news [ETtoday新聞雲]-21",
        "name": "news [ETtoday新聞雲]-21",
        "series": "news [ETtoday新聞雲]",
        "category": "21",
        "value": 5
    },
    {
        "id": "news [ETtoday新聞雲]-22",
        "name": "news [ETtoday新聞雲]-22",
        "series": "news [ETtoday新聞雲]",
        "category": "22",
        "value": 3
    },
    {
        "id": "news [ETtoday新聞雲]-23",
        "name": "news [ETtoday新聞雲]-23",
        "series": "news [ETtoday新聞雲]",
        "category": "23",
        "value": 5
    },
    {
        "id": "news [ETtoday新聞雲]-24",
        "name": "news [ETtoday新聞雲]-24",
        "series": "news [ETtoday新聞雲]",
        "category": "24",
        "value": 11
    },
    {
        "id": "news [ETtoday新聞雲]-25",
        "name": "news [ETtoday新聞雲]-25",
        "series": "news [ETtoday新聞雲]",
        "category": "25",
        "value": 6
    },
    {
        "id": "news [ETtoday新聞雲]-26",
        "name": "news [ETtoday新聞雲]-26",
        "series": "news [ETtoday新聞雲]",
        "category": "26",
        "value": 5
    },
    {
        "id": "news [ETtoday新聞雲]-27",
        "name": "news [ETtoday新聞雲]-27",
        "series": "news [ETtoday新聞雲]",
        "category": "27",
        "value": 3
    },
    {
        "id": "news [聯合新聞網]-0",
        "name": "news [聯合新聞網]-0",
        "series": "news [聯合新聞網]",
        "category": "0",
        "value": 2
    },
    {
        "id": "news [聯合新聞網]-1",
        "name": "news [聯合新聞網]-1",
        "series": "news [聯合新聞網]",
        "category": "1",
        "value": 2
    },
    {
        "id": "news [聯合新聞網]-2",
        "name": "news [聯合新聞網]-2",
        "series": "news [聯合新聞網]",
        "category": "2",
        "value": 154
    },
    {
        "id": "news [聯合新聞網]-3",
        "name": "news [聯合新聞網]-3",
        "series": "news [聯合新聞網]",
        "category": "3",
        "value": 118
    },
    {
        "id": "news [聯合新聞網]-4",
        "name": "news [聯合新聞網]-4",
        "series": "news [聯合新聞網]",
        "category": "4",
        "value": 93
    },
    {
        "id": "news [聯合新聞網]-5",
        "name": "news [聯合新聞網]-5",
        "series": "news [聯合新聞網]",
        "category": "5",
        "value": 65
    },
    {
        "id": "news [聯合新聞網]-6",
        "name": "news [聯合新聞網]-6",
        "series": "news [聯合新聞網]",
        "category": "6",
        "value": 60
    },
    {
        "id": "news [聯合新聞網]-7",
        "name": "news [聯合新聞網]-7",
        "series": "news [聯合新聞網]",
        "category": "7",
        "value": 26
    },
    {
        "id": "news [聯合新聞網]-8",
        "name": "news [聯合新聞網]-8",
        "series": "news [聯合新聞網]",
        "category": "8",
        "value": 30
    },
    {
        "id": "news [聯合新聞網]-9",
        "name": "news [聯合新聞網]-9",
        "series": "news [聯合新聞網]",
        "category": "9",
        "value": 27
    },
    {
        "id": "news [聯合新聞網]-10",
        "name": "news [聯合新聞網]-10",
        "series": "news [聯合新聞網]",
        "category": "10",
        "value": 20
    },
    {
        "id": "news [聯合新聞網]-11",
        "name": "news [聯合新聞網]-11",
        "series": "news [聯合新聞網]",
        "category": "11",
        "value": 18
    },
    {
        "id": "news [聯合新聞網]-12",
        "name": "news [聯合新聞網]-12",
        "series": "news [聯合新聞網]",
        "category": "12",
        "value": 11
    },
    {
        "id": "news [聯合新聞網]-13",
        "name": "news [聯合新聞網]-13",
        "series": "news [聯合新聞網]",
        "category": "13",
        "value": 9
    },
    {
        "id": "news [聯合新聞網]-14",
        "name": "news [聯合新聞網]-14",
        "series": "news [聯合新聞網]",
        "category": "14",
        "value": 8
    },
    {
        "id": "news [聯合新聞網]-15",
        "name": "news [聯合新聞網]-15",
        "series": "news [聯合新聞網]",
        "category": "15",
        "value": 7
    },
    {
        "id": "news [聯合新聞網]-16",
        "name": "news [聯合新聞網]-16",
        "series": "news [聯合新聞網]",
        "category": "16",
        "value": 5
    },
    {
        "id": "news [聯合新聞網]-17",
        "name": "news [聯合新聞網]-17",
        "series": "news [聯合新聞網]",
        "category": "17",
        "value": 5
    },
    {
        "id": "news [聯合新聞網]-18",
        "name": "news [聯合新聞網]-18",
        "series": "news [聯合新聞網]",
        "category": "18",
        "value": 6
    },
    {
        "id": "news [聯合新聞網]-19",
        "name": "news [聯合新聞網]-19",
        "series": "news [聯合新聞網]",
        "category": "19",
        "value": 10
    },
    {
        "id": "news [聯合新聞網]-20",
        "name": "news [聯合新聞網]-20",
        "series": "news [聯合新聞網]",
        "category": "20",
        "value": 12
    },
    {
        "id": "news [聯合新聞網]-21",
        "name": "news [聯合新聞網]-21",
        "series": "news [聯合新聞網]",
        "category": "21",
        "value": 4
    },
    {
        "id": "news [聯合新聞網]-22",
        "name": "news [聯合新聞網]-22",
        "series": "news [聯合新聞網]",
        "category": "22",
        "value": 3
    },
    {
        "id": "news [聯合新聞網]-23",
        "name": "news [聯合新聞網]-23",
        "series": "news [聯合新聞網]",
        "category": "23",
        "value": 4
    },
    {
        "id": "news [聯合新聞網]-24",
        "name": "news [聯合新聞網]-24",
        "series": "news [聯合新聞網]",
        "category": "24",
        "value": 9
    },
    {
        "id": "news [聯合新聞網]-25",
        "name": "news [聯合新聞網]-25",
        "series": "news [聯合新聞網]",
        "category": "25",
        "value": 4
    },
    {
        "id": "news [聯合新聞網]-26",
        "name": "news [聯合新聞網]-26",
        "series": "news [聯合新聞網]",
        "category": "26",
        "value": 3
    },
    {
        "id": "news [聯合新聞網]-27",
        "name": "news [聯合新聞網]-27",
        "series": "news [聯合新聞網]",
        "category": "27",
        "value": 3
    }
]

export default function CategoricalPlotPage() {

  const domRef = useRef<HTMLDivElement | null>(null)
  const chartRef = useRef<OrbCharts | null>(null)

  useEffect(() => {

    const categoricalPlot = new CategoricalPlot({
      RaisedBubble: {
        // bubble: {
        //   sizeAdjust: 0.8,
        //   arcScaleType: 'area',
        //   valueLinearOpacity: [0.5, 1],
        //   showZeroValue: false
        // }
      },
      CategoryAxis: {},
      CategoryZoom: {},
      ValueAxis: {},
      // styles: {
      //   padding: {
      //     top: 60,
      //     right: 60,
      //     bottom: 60,
      //     left: 80
      //   },
      //   highlightTarget: 'datum',
      //   highlightDefault: null,
      //   unhighlightedOpacity: 0.3,
      //   transitionDuration: 800,
      //   transitionEase: 'easeCubic'
      // },
      // visibleFilter: (datum: any) => true,
      // categoryAxis: {
      //   scaleDomain: [0, 'max'],
      //   scalePadding: 0.5,
      //   label: ''
      // },
      // valueAxis: {
      //   position: 'left',
      //   scaleDomain: ['auto', 'auto'],
      //   scaleRange: [0, 0.9],
      //   label: ''
      // },
      // datasetIndex: 0
    })

    const tooltip = new Tooltip()

    const legend = new Legend()

    const chart = new OrbCharts(domRef.current!, {
      data: data,
      encoding: {},
      theme: {
        // colorScheme: 'light',
      },
      plugins: [categoricalPlot, tooltip, legend]
    })

    chart.context.gridData$.subscribe(data => {
      console.log('Grid Data Updated:', data)
    })

    console.log(chart)

  }, [])

  return <div ref={domRef}></div>
}
