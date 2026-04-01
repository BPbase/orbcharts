'use client'

import { useState, useEffect, useRef } from 'react'
import type { RawData } from '@orbcharts/core'
import { OrbCharts } from '@orbcharts/core'
import { RankedPlot, Tooltip, Legend } from '@orbcharts/plugin-basic'


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
        "value": 14
    },
    {
        "id": "news [三立新聞網]-26",
        "name": "news [三立新聞網]-26",
        "series": "news [三立新聞網]",
        "category": "26",
        "value": 3
    },
    {
        "id": "news [三立新聞網]-27",
        "name": "news [三立新聞網]-27",
        "series": "news [三立新聞網]",
        "category": "27",
        "value": 11
    },
    {
        "id": "news [LINE TODAY]-0",
        "name": "news [LINE TODAY]-0",
        "series": "news [LINE TODAY]",
        "category": "0",
        "value": 0
    },
    {
        "id": "news [LINE TODAY]-1",
        "name": "news [LINE TODAY]-1",
        "series": "news [LINE TODAY]",
        "category": "1",
        "value": 0
    },
    {
        "id": "news [LINE TODAY]-2",
        "name": "news [LINE TODAY]-2",
        "series": "news [LINE TODAY]",
        "category": "2",
        "value": 148
    },
    {
        "id": "news [LINE TODAY]-3",
        "name": "news [LINE TODAY]-3",
        "series": "news [LINE TODAY]",
        "category": "3",
        "value": 191
    },
    {
        "id": "news [LINE TODAY]-4",
        "name": "news [LINE TODAY]-4",
        "series": "news [LINE TODAY]",
        "category": "4",
        "value": 135
    },
    {
        "id": "news [LINE TODAY]-5",
        "name": "news [LINE TODAY]-5",
        "series": "news [LINE TODAY]",
        "category": "5",
        "value": 104
    },
    {
        "id": "news [LINE TODAY]-6",
        "name": "news [LINE TODAY]-6",
        "series": "news [LINE TODAY]",
        "category": "6",
        "value": 59
    },
    {
        "id": "news [LINE TODAY]-7",
        "name": "news [LINE TODAY]-7",
        "series": "news [LINE TODAY]",
        "category": "7",
        "value": 47
    },
    {
        "id": "news [LINE TODAY]-8",
        "name": "news [LINE TODAY]-8",
        "series": "news [LINE TODAY]",
        "category": "8",
        "value": 37
    },
    {
        "id": "news [LINE TODAY]-9",
        "name": "news [LINE TODAY]-9",
        "series": "news [LINE TODAY]",
        "category": "9",
        "value": 30
    },
    {
        "id": "news [LINE TODAY]-10",
        "name": "news [LINE TODAY]-10",
        "series": "news [LINE TODAY]",
        "category": "10",
        "value": 36
    },
    {
        "id": "news [LINE TODAY]-11",
        "name": "news [LINE TODAY]-11",
        "series": "news [LINE TODAY]",
        "category": "11",
        "value": 23
    },
    {
        "id": "news [LINE TODAY]-12",
        "name": "news [LINE TODAY]-12",
        "series": "news [LINE TODAY]",
        "category": "12",
        "value": 10
    },
    {
        "id": "news [LINE TODAY]-13",
        "name": "news [LINE TODAY]-13",
        "series": "news [LINE TODAY]",
        "category": "13",
        "value": 16
    },
    {
        "id": "news [LINE TODAY]-14",
        "name": "news [LINE TODAY]-14",
        "series": "news [LINE TODAY]",
        "category": "14",
        "value": 17
    },
    {
        "id": "news [LINE TODAY]-15",
        "name": "news [LINE TODAY]-15",
        "series": "news [LINE TODAY]",
        "category": "15",
        "value": 11
    },
    {
        "id": "news [LINE TODAY]-16",
        "name": "news [LINE TODAY]-16",
        "series": "news [LINE TODAY]",
        "category": "16",
        "value": 17
    },
    {
        "id": "news [LINE TODAY]-17",
        "name": "news [LINE TODAY]-17",
        "series": "news [LINE TODAY]",
        "category": "17",
        "value": 5
    },
    {
        "id": "news [LINE TODAY]-18",
        "name": "news [LINE TODAY]-18",
        "series": "news [LINE TODAY]",
        "category": "18",
        "value": 11
    },
    {
        "id": "news [LINE TODAY]-19",
        "name": "news [LINE TODAY]-19",
        "series": "news [LINE TODAY]",
        "category": "19",
        "value": 13
    },
    {
        "id": "news [LINE TODAY]-20",
        "name": "news [LINE TODAY]-20",
        "series": "news [LINE TODAY]",
        "category": "20",
        "value": 12
    },
    {
        "id": "news [LINE TODAY]-21",
        "name": "news [LINE TODAY]-21",
        "series": "news [LINE TODAY]",
        "category": "21",
        "value": 6
    },
    {
        "id": "news [LINE TODAY]-22",
        "name": "news [LINE TODAY]-22",
        "series": "news [LINE TODAY]",
        "category": "22",
        "value": 6
    },
    {
        "id": "news [LINE TODAY]-23",
        "name": "news [LINE TODAY]-23",
        "series": "news [LINE TODAY]",
        "category": "23",
        "value": 7
    },
    {
        "id": "news [LINE TODAY]-24",
        "name": "news [LINE TODAY]-24",
        "series": "news [LINE TODAY]",
        "category": "24",
        "value": 10
    },
    {
        "id": "news [LINE TODAY]-25",
        "name": "news [LINE TODAY]-25",
        "series": "news [LINE TODAY]",
        "category": "25",
        "value": 4
    },
    {
        "id": "news [LINE TODAY]-26",
        "name": "news [LINE TODAY]-26",
        "series": "news [LINE TODAY]",
        "category": "26",
        "value": 4
    },
    {
        "id": "news [LINE TODAY]-27",
        "name": "news [LINE TODAY]-27",
        "series": "news [LINE TODAY]",
        "category": "27",
        "value": 3
    },
    {
        "id": "news [PChome新聞]-0",
        "name": "news [PChome新聞]-0",
        "series": "news [PChome新聞]",
        "category": "0",
        "value": 0
    },
    {
        "id": "news [PChome新聞]-1",
        "name": "news [PChome新聞]-1",
        "series": "news [PChome新聞]",
        "category": "1",
        "value": 1
    },
    {
        "id": "news [PChome新聞]-2",
        "name": "news [PChome新聞]-2",
        "series": "news [PChome新聞]",
        "category": "2",
        "value": 203
    },
    {
        "id": "news [PChome新聞]-3",
        "name": "news [PChome新聞]-3",
        "series": "news [PChome新聞]",
        "category": "3",
        "value": 200
    },
    {
        "id": "news [PChome新聞]-4",
        "name": "news [PChome新聞]-4",
        "series": "news [PChome新聞]",
        "category": "4",
        "value": 105
    },
    {
        "id": "news [PChome新聞]-5",
        "name": "news [PChome新聞]-5",
        "series": "news [PChome新聞]",
        "category": "5",
        "value": 83
    },
    {
        "id": "news [PChome新聞]-6",
        "name": "news [PChome新聞]-6",
        "series": "news [PChome新聞]",
        "category": "6",
        "value": 56
    },
    {
        "id": "news [PChome新聞]-7",
        "name": "news [PChome新聞]-7",
        "series": "news [PChome新聞]",
        "category": "7",
        "value": 37
    },
    {
        "id": "news [PChome新聞]-8",
        "name": "news [PChome新聞]-8",
        "series": "news [PChome新聞]",
        "category": "8",
        "value": 27
    },
    {
        "id": "news [PChome新聞]-9",
        "name": "news [PChome新聞]-9",
        "series": "news [PChome新聞]",
        "category": "9",
        "value": 23
    },
    {
        "id": "news [PChome新聞]-10",
        "name": "news [PChome新聞]-10",
        "series": "news [PChome新聞]",
        "category": "10",
        "value": 14
    },
    {
        "id": "news [PChome新聞]-11",
        "name": "news [PChome新聞]-11",
        "series": "news [PChome新聞]",
        "category": "11",
        "value": 17
    },
    {
        "id": "news [PChome新聞]-12",
        "name": "news [PChome新聞]-12",
        "series": "news [PChome新聞]",
        "category": "12",
        "value": 5
    },
    {
        "id": "news [PChome新聞]-13",
        "name": "news [PChome新聞]-13",
        "series": "news [PChome新聞]",
        "category": "13",
        "value": 9
    },
    {
        "id": "news [PChome新聞]-14",
        "name": "news [PChome新聞]-14",
        "series": "news [PChome新聞]",
        "category": "14",
        "value": 10
    },
    {
        "id": "news [PChome新聞]-15",
        "name": "news [PChome新聞]-15",
        "series": "news [PChome新聞]",
        "category": "15",
        "value": 2
    },
    {
        "id": "news [PChome新聞]-16",
        "name": "news [PChome新聞]-16",
        "series": "news [PChome新聞]",
        "category": "16",
        "value": 10
    },
    {
        "id": "news [PChome新聞]-17",
        "name": "news [PChome新聞]-17",
        "series": "news [PChome新聞]",
        "category": "17",
        "value": 3
    },
    {
        "id": "news [PChome新聞]-18",
        "name": "news [PChome新聞]-18",
        "series": "news [PChome新聞]",
        "category": "18",
        "value": 12
    },
    {
        "id": "news [PChome新聞]-19",
        "name": "news [PChome新聞]-19",
        "series": "news [PChome新聞]",
        "category": "19",
        "value": 14
    },
    {
        "id": "news [PChome新聞]-20",
        "name": "news [PChome新聞]-20",
        "series": "news [PChome新聞]",
        "category": "20",
        "value": 10
    },
    {
        "id": "news [PChome新聞]-21",
        "name": "news [PChome新聞]-21",
        "series": "news [PChome新聞]",
        "category": "21",
        "value": 6
    },
    {
        "id": "news [PChome新聞]-22",
        "name": "news [PChome新聞]-22",
        "series": "news [PChome新聞]",
        "category": "22",
        "value": 1
    },
    {
        "id": "news [PChome新聞]-23",
        "name": "news [PChome新聞]-23",
        "series": "news [PChome新聞]",
        "category": "23",
        "value": 2
    },
    {
        "id": "news [PChome新聞]-24",
        "name": "news [PChome新聞]-24",
        "series": "news [PChome新聞]",
        "category": "24",
        "value": 5
    },
    {
        "id": "news [PChome新聞]-25",
        "name": "news [PChome新聞]-25",
        "series": "news [PChome新聞]",
        "category": "25",
        "value": 4
    },
    {
        "id": "news [PChome新聞]-26",
        "name": "news [PChome新聞]-26",
        "series": "news [PChome新聞]",
        "category": "26",
        "value": 4
    },
    {
        "id": "news [PChome新聞]-27",
        "name": "news [PChome新聞]-27",
        "series": "news [PChome新聞]",
        "category": "27",
        "value": 1
    },
    {
        "id": "FB [東森新聞]-0",
        "name": "FB [東森新聞]-0",
        "series": "FB [東森新聞]",
        "category": "0",
        "value": 0
    },
    {
        "id": "FB [東森新聞]-1",
        "name": "FB [東森新聞]-1",
        "series": "FB [東森新聞]",
        "category": "1",
        "value": 0
    },
    {
        "id": "FB [東森新聞]-2",
        "name": "FB [東森新聞]-2",
        "series": "FB [東森新聞]",
        "category": "2",
        "value": 161
    },
    {
        "id": "FB [東森新聞]-3",
        "name": "FB [東森新聞]-3",
        "series": "FB [東森新聞]",
        "category": "3",
        "value": 102
    },
    {
        "id": "FB [東森新聞]-4",
        "name": "FB [東森新聞]-4",
        "series": "FB [東森新聞]",
        "category": "4",
        "value": 86
    },
    {
        "id": "FB [東森新聞]-5",
        "name": "FB [東森新聞]-5",
        "series": "FB [東森新聞]",
        "category": "5",
        "value": 56
    },
    {
        "id": "FB [東森新聞]-6",
        "name": "FB [東森新聞]-6",
        "series": "FB [東森新聞]",
        "category": "6",
        "value": 60
    },
    {
        "id": "FB [東森新聞]-7",
        "name": "FB [東森新聞]-7",
        "series": "FB [東森新聞]",
        "category": "7",
        "value": 40
    },
    {
        "id": "FB [東森新聞]-8",
        "name": "FB [東森新聞]-8",
        "series": "FB [東森新聞]",
        "category": "8",
        "value": 24
    },
    {
        "id": "FB [東森新聞]-9",
        "name": "FB [東森新聞]-9",
        "series": "FB [東森新聞]",
        "category": "9",
        "value": 27
    },
    {
        "id": "FB [東森新聞]-10",
        "name": "FB [東森新聞]-10",
        "series": "FB [東森新聞]",
        "category": "10",
        "value": 57
    },
    {
        "id": "FB [東森新聞]-11",
        "name": "FB [東森新聞]-11",
        "series": "FB [東森新聞]",
        "category": "11",
        "value": 13
    },
    {
        "id": "FB [東森新聞]-12",
        "name": "FB [東森新聞]-12",
        "series": "FB [東森新聞]",
        "category": "12",
        "value": 5
    },
    {
        "id": "FB [東森新聞]-13",
        "name": "FB [東森新聞]-13",
        "series": "FB [東森新聞]",
        "category": "13",
        "value": 4
    },
    {
        "id": "FB [東森新聞]-14",
        "name": "FB [東森新聞]-14",
        "series": "FB [東森新聞]",
        "category": "14",
        "value": 10
    },
    {
        "id": "FB [東森新聞]-15",
        "name": "FB [東森新聞]-15",
        "series": "FB [東森新聞]",
        "category": "15",
        "value": 6
    },
    {
        "id": "FB [東森新聞]-16",
        "name": "FB [東森新聞]-16",
        "series": "FB [東森新聞]",
        "category": "16",
        "value": 4
    },
    {
        "id": "FB [東森新聞]-17",
        "name": "FB [東森新聞]-17",
        "series": "FB [東森新聞]",
        "category": "17",
        "value": 0
    },
    {
        "id": "FB [東森新聞]-18",
        "name": "FB [東森新聞]-18",
        "series": "FB [東森新聞]",
        "category": "18",
        "value": 2
    },
    {
        "id": "FB [東森新聞]-19",
        "name": "FB [東森新聞]-19",
        "series": "FB [東森新聞]",
        "category": "19",
        "value": 10
    },
    {
        "id": "FB [東森新聞]-20",
        "name": "FB [東森新聞]-20",
        "series": "FB [東森新聞]",
        "category": "20",
        "value": 3
    },
    {
        "id": "FB [東森新聞]-21",
        "name": "FB [東森新聞]-21",
        "series": "FB [東森新聞]",
        "category": "21",
        "value": 4
    },
    {
        "id": "FB [東森新聞]-22",
        "name": "FB [東森新聞]-22",
        "series": "FB [東森新聞]",
        "category": "22",
        "value": 3
    },
    {
        "id": "FB [東森新聞]-23",
        "name": "FB [東森新聞]-23",
        "series": "FB [東森新聞]",
        "category": "23",
        "value": 2
    },
    {
        "id": "FB [東森新聞]-24",
        "name": "FB [東森新聞]-24",
        "series": "FB [東森新聞]",
        "category": "24",
        "value": 4
    },
    {
        "id": "FB [東森新聞]-25",
        "name": "FB [東森新聞]-25",
        "series": "FB [東森新聞]",
        "category": "25",
        "value": 0
    },
    {
        "id": "FB [東森新聞]-26",
        "name": "FB [東森新聞]-26",
        "series": "FB [東森新聞]",
        "category": "26",
        "value": 0
    },
    {
        "id": "FB [東森新聞]-27",
        "name": "FB [東森新聞]-27",
        "series": "FB [東森新聞]",
        "category": "27",
        "value": 1
    },
    {
        "id": "FB [TVBS新聞]-0",
        "name": "FB [TVBS新聞]-0",
        "series": "FB [TVBS新聞]",
        "category": "0",
        "value": 0
    },
    {
        "id": "FB [TVBS新聞]-1",
        "name": "FB [TVBS新聞]-1",
        "series": "FB [TVBS新聞]",
        "category": "1",
        "value": 0
    },
    {
        "id": "FB [TVBS新聞]-2",
        "name": "FB [TVBS新聞]-2",
        "series": "FB [TVBS新聞]",
        "category": "2",
        "value": 155
    },
    {
        "id": "FB [TVBS新聞]-3",
        "name": "FB [TVBS新聞]-3",
        "series": "FB [TVBS新聞]",
        "category": "3",
        "value": 134
    },
    {
        "id": "FB [TVBS新聞]-4",
        "name": "FB [TVBS新聞]-4",
        "series": "FB [TVBS新聞]",
        "category": "4",
        "value": 97
    },
    {
        "id": "FB [TVBS新聞]-5",
        "name": "FB [TVBS新聞]-5",
        "series": "FB [TVBS新聞]",
        "category": "5",
        "value": 71
    },
    {
        "id": "FB [TVBS新聞]-6",
        "name": "FB [TVBS新聞]-6",
        "series": "FB [TVBS新聞]",
        "category": "6",
        "value": 61
    },
    {
        "id": "FB [TVBS新聞]-7",
        "name": "FB [TVBS新聞]-7",
        "series": "FB [TVBS新聞]",
        "category": "7",
        "value": 28
    },
    {
        "id": "FB [TVBS新聞]-8",
        "name": "FB [TVBS新聞]-8",
        "series": "FB [TVBS新聞]",
        "category": "8",
        "value": 16
    },
    {
        "id": "FB [TVBS新聞]-9",
        "name": "FB [TVBS新聞]-9",
        "series": "FB [TVBS新聞]",
        "category": "9",
        "value": 10
    },
    {
        "id": "FB [TVBS新聞]-10",
        "name": "FB [TVBS新聞]-10",
        "series": "FB [TVBS新聞]",
        "category": "10",
        "value": 13
    },
    {
        "id": "FB [TVBS新聞]-11",
        "name": "FB [TVBS新聞]-11",
        "series": "FB [TVBS新聞]",
        "category": "11",
        "value": 11
    },
    {
        "id": "FB [TVBS新聞]-12",
        "name": "FB [TVBS新聞]-12",
        "series": "FB [TVBS新聞]",
        "category": "12",
        "value": 5
    },
    {
        "id": "FB [TVBS新聞]-13",
        "name": "FB [TVBS新聞]-13",
        "series": "FB [TVBS新聞]",
        "category": "13",
        "value": 5
    },
    {
        "id": "FB [TVBS新聞]-14",
        "name": "FB [TVBS新聞]-14",
        "series": "FB [TVBS新聞]",
        "category": "14",
        "value": 9
    },
    {
        "id": "FB [TVBS新聞]-15",
        "name": "FB [TVBS新聞]-15",
        "series": "FB [TVBS新聞]",
        "category": "15",
        "value": 2
    },
    {
        "id": "FB [TVBS新聞]-16",
        "name": "FB [TVBS新聞]-16",
        "series": "FB [TVBS新聞]",
        "category": "16",
        "value": 6
    },
    {
        "id": "FB [TVBS新聞]-17",
        "name": "FB [TVBS新聞]-17",
        "series": "FB [TVBS新聞]",
        "category": "17",
        "value": 0
    },
    {
        "id": "FB [TVBS新聞]-18",
        "name": "FB [TVBS新聞]-18",
        "series": "FB [TVBS新聞]",
        "category": "18",
        "value": 7
    },
    {
        "id": "FB [TVBS新聞]-19",
        "name": "FB [TVBS新聞]-19",
        "series": "FB [TVBS新聞]",
        "category": "19",
        "value": 14
    },
    {
        "id": "FB [TVBS新聞]-20",
        "name": "FB [TVBS新聞]-20",
        "series": "FB [TVBS新聞]",
        "category": "20",
        "value": 7
    },
    {
        "id": "FB [TVBS新聞]-21",
        "name": "FB [TVBS新聞]-21",
        "series": "FB [TVBS新聞]",
        "category": "21",
        "value": 2
    },
    {
        "id": "FB [TVBS新聞]-22",
        "name": "FB [TVBS新聞]-22",
        "series": "FB [TVBS新聞]",
        "category": "22",
        "value": 1
    },
    {
        "id": "FB [TVBS新聞]-23",
        "name": "FB [TVBS新聞]-23",
        "series": "FB [TVBS新聞]",
        "category": "23",
        "value": 2
    },
    {
        "id": "FB [TVBS新聞]-24",
        "name": "FB [TVBS新聞]-24",
        "series": "FB [TVBS新聞]",
        "category": "24",
        "value": 9
    },
    {
        "id": "FB [TVBS新聞]-25",
        "name": "FB [TVBS新聞]-25",
        "series": "FB [TVBS新聞]",
        "category": "25",
        "value": 3
    },
    {
        "id": "FB [TVBS新聞]-26",
        "name": "FB [TVBS新聞]-26",
        "series": "FB [TVBS新聞]",
        "category": "26",
        "value": 0
    },
    {
        "id": "FB [TVBS新聞]-27",
        "name": "FB [TVBS新聞]-27",
        "series": "FB [TVBS新聞]",
        "category": "27",
        "value": 3
    },
    {
        "id": "FB [TVBS娛樂頭條]-0",
        "name": "FB [TVBS娛樂頭條]-0",
        "series": "FB [TVBS娛樂頭條]",
        "category": "0",
        "value": 0
    },
    {
        "id": "FB [TVBS娛樂頭條]-1",
        "name": "FB [TVBS娛樂頭條]-1",
        "series": "FB [TVBS娛樂頭條]",
        "category": "1",
        "value": 0
    },
    {
        "id": "FB [TVBS娛樂頭條]-2",
        "name": "FB [TVBS娛樂頭條]-2",
        "series": "FB [TVBS娛樂頭條]",
        "category": "2",
        "value": 156
    },
    {
        "id": "FB [TVBS娛樂頭條]-3",
        "name": "FB [TVBS娛樂頭條]-3",
        "series": "FB [TVBS娛樂頭條]",
        "category": "3",
        "value": 114
    },
    {
        "id": "FB [TVBS娛樂頭條]-4",
        "name": "FB [TVBS娛樂頭條]-4",
        "series": "FB [TVBS娛樂頭條]",
        "category": "4",
        "value": 84
    },
    {
        "id": "FB [TVBS娛樂頭條]-5",
        "name": "FB [TVBS娛樂頭條]-5",
        "series": "FB [TVBS娛樂頭條]",
        "category": "5",
        "value": 73
    },
    {
        "id": "FB [TVBS娛樂頭條]-6",
        "name": "FB [TVBS娛樂頭條]-6",
        "series": "FB [TVBS娛樂頭條]",
        "category": "6",
        "value": 49
    },
    {
        "id": "FB [TVBS娛樂頭條]-7",
        "name": "FB [TVBS娛樂頭條]-7",
        "series": "FB [TVBS娛樂頭條]",
        "category": "7",
        "value": 30
    },
    {
        "id": "FB [TVBS娛樂頭條]-8",
        "name": "FB [TVBS娛樂頭條]-8",
        "series": "FB [TVBS娛樂頭條]",
        "category": "8",
        "value": 21
    },
    {
        "id": "FB [TVBS娛樂頭條]-9",
        "name": "FB [TVBS娛樂頭條]-9",
        "series": "FB [TVBS娛樂頭條]",
        "category": "9",
        "value": 15
    },
    {
        "id": "FB [TVBS娛樂頭條]-10",
        "name": "FB [TVBS娛樂頭條]-10",
        "series": "FB [TVBS娛樂頭條]",
        "category": "10",
        "value": 10
    },
    {
        "id": "FB [TVBS娛樂頭條]-11",
        "name": "FB [TVBS娛樂頭條]-11",
        "series": "FB [TVBS娛樂頭條]",
        "category": "11",
        "value": 13
    },
    {
        "id": "FB [TVBS娛樂頭條]-12",
        "name": "FB [TVBS娛樂頭條]-12",
        "series": "FB [TVBS娛樂頭條]",
        "category": "12",
        "value": 5
    },
    {
        "id": "FB [TVBS娛樂頭條]-13",
        "name": "FB [TVBS娛樂頭條]-13",
        "series": "FB [TVBS娛樂頭條]",
        "category": "13",
        "value": 6
    },
    {
        "id": "FB [TVBS娛樂頭條]-14",
        "name": "FB [TVBS娛樂頭條]-14",
        "series": "FB [TVBS娛樂頭條]",
        "category": "14",
        "value": 9
    },
    {
        "id": "FB [TVBS娛樂頭條]-15",
        "name": "FB [TVBS娛樂頭條]-15",
        "series": "FB [TVBS娛樂頭條]",
        "category": "15",
        "value": 5
    },
    {
        "id": "FB [TVBS娛樂頭條]-16",
        "name": "FB [TVBS娛樂頭條]-16",
        "series": "FB [TVBS娛樂頭條]",
        "category": "16",
        "value": 6
    },
    {
        "id": "FB [TVBS娛樂頭條]-17",
        "name": "FB [TVBS娛樂頭條]-17",
        "series": "FB [TVBS娛樂頭條]",
        "category": "17",
        "value": 0
    },
    {
        "id": "FB [TVBS娛樂頭條]-18",
        "name": "FB [TVBS娛樂頭條]-18",
        "series": "FB [TVBS娛樂頭條]",
        "category": "18",
        "value": 9
    },
    {
        "id": "FB [TVBS娛樂頭條]-19",
        "name": "FB [TVBS娛樂頭條]-19",
        "series": "FB [TVBS娛樂頭條]",
        "category": "19",
        "value": 21
    },
    {
        "id": "FB [TVBS娛樂頭條]-20",
        "name": "FB [TVBS娛樂頭條]-20",
        "series": "FB [TVBS娛樂頭條]",
        "category": "20",
        "value": 10
    },
    {
        "id": "FB [TVBS娛樂頭條]-21",
        "name": "FB [TVBS娛樂頭條]-21",
        "series": "FB [TVBS娛樂頭條]",
        "category": "21",
        "value": 3
    },
    {
        "id": "FB [TVBS娛樂頭條]-22",
        "name": "FB [TVBS娛樂頭條]-22",
        "series": "FB [TVBS娛樂頭條]",
        "category": "22",
        "value": 2
    },
    {
        "id": "FB [TVBS娛樂頭條]-23",
        "name": "FB [TVBS娛樂頭條]-23",
        "series": "FB [TVBS娛樂頭條]",
        "category": "23",
        "value": 2
    },
    {
        "id": "FB [TVBS娛樂頭條]-24",
        "name": "FB [TVBS娛樂頭條]-24",
        "series": "FB [TVBS娛樂頭條]",
        "category": "24",
        "value": 9
    },
    {
        "id": "FB [TVBS娛樂頭條]-25",
        "name": "FB [TVBS娛樂頭條]-25",
        "series": "FB [TVBS娛樂頭條]",
        "category": "25",
        "value": 5
    },
    {
        "id": "FB [TVBS娛樂頭條]-26",
        "name": "FB [TVBS娛樂頭條]-26",
        "series": "FB [TVBS娛樂頭條]",
        "category": "26",
        "value": 1
    },
    {
        "id": "FB [TVBS娛樂頭條]-27",
        "name": "FB [TVBS娛樂頭條]-27",
        "series": "FB [TVBS娛樂頭條]",
        "category": "27",
        "value": 3
    },
    {
        "id": "news [中時新聞網]-0",
        "name": "news [中時新聞網]-0",
        "series": "news [中時新聞網]",
        "category": "0",
        "value": 0
    },
    {
        "id": "news [中時新聞網]-1",
        "name": "news [中時新聞網]-1",
        "series": "news [中時新聞網]",
        "category": "1",
        "value": 0
    },
    {
        "id": "news [中時新聞網]-2",
        "name": "news [中時新聞網]-2",
        "series": "news [中時新聞網]",
        "category": "2",
        "value": 105
    },
    {
        "id": "news [中時新聞網]-3",
        "name": "news [中時新聞網]-3",
        "series": "news [中時新聞網]",
        "category": "3",
        "value": 112
    },
    {
        "id": "news [中時新聞網]-4",
        "name": "news [中時新聞網]-4",
        "series": "news [中時新聞網]",
        "category": "4",
        "value": 73
    },
    {
        "id": "news [中時新聞網]-5",
        "name": "news [中時新聞網]-5",
        "series": "news [中時新聞網]",
        "category": "5",
        "value": 60
    },
    {
        "id": "news [中時新聞網]-6",
        "name": "news [中時新聞網]-6",
        "series": "news [中時新聞網]",
        "category": "6",
        "value": 51
    },
    {
        "id": "news [中時新聞網]-7",
        "name": "news [中時新聞網]-7",
        "series": "news [中時新聞網]",
        "category": "7",
        "value": 27
    },
    {
        "id": "news [中時新聞網]-8",
        "name": "news [中時新聞網]-8",
        "series": "news [中時新聞網]",
        "category": "8",
        "value": 24
    },
    {
        "id": "news [中時新聞網]-9",
        "name": "news [中時新聞網]-9",
        "series": "news [中時新聞網]",
        "category": "9",
        "value": 22
    },
    {
        "id": "news [中時新聞網]-10",
        "name": "news [中時新聞網]-10",
        "series": "news [中時新聞網]",
        "category": "10",
        "value": 22
    },
    {
        "id": "news [中時新聞網]-11",
        "name": "news [中時新聞網]-11",
        "series": "news [中時新聞網]",
        "category": "11",
        "value": 26
    },
    {
        "id": "news [中時新聞網]-12",
        "name": "news [中時新聞網]-12",
        "series": "news [中時新聞網]",
        "category": "12",
        "value": 16
    },
    {
        "id": "news [中時新聞網]-13",
        "name": "news [中時新聞網]-13",
        "series": "news [中時新聞網]",
        "category": "13",
        "value": 11
    },
    {
        "id": "news [中時新聞網]-14",
        "name": "news [中時新聞網]-14",
        "series": "news [中時新聞網]",
        "category": "14",
        "value": 8
    },
    {
        "id": "news [中時新聞網]-15",
        "name": "news [中時新聞網]-15",
        "series": "news [中時新聞網]",
        "category": "15",
        "value": 8
    },
    {
        "id": "news [中時新聞網]-16",
        "name": "news [中時新聞網]-16",
        "series": "news [中時新聞網]",
        "category": "16",
        "value": 3
    },
    {
        "id": "news [中時新聞網]-17",
        "name": "news [中時新聞網]-17",
        "series": "news [中時新聞網]",
        "category": "17",
        "value": 12
    },
    {
        "id": "news [中時新聞網]-18",
        "name": "news [中時新聞網]-18",
        "series": "news [中時新聞網]",
        "category": "18",
        "value": 13
    },
    {
        "id": "news [中時新聞網]-19",
        "name": "news [中時新聞網]-19",
        "series": "news [中時新聞網]",
        "category": "19",
        "value": 14
    },
    {
        "id": "news [中時新聞網]-20",
        "name": "news [中時新聞網]-20",
        "series": "news [中時新聞網]",
        "category": "20",
        "value": 9
    },
    {
        "id": "news [中時新聞網]-21",
        "name": "news [中時新聞網]-21",
        "series": "news [中時新聞網]",
        "category": "21",
        "value": 5
    },
    {
        "id": "news [中時新聞網]-22",
        "name": "news [中時新聞網]-22",
        "series": "news [中時新聞網]",
        "category": "22",
        "value": 3
    },
    {
        "id": "news [中時新聞網]-23",
        "name": "news [中時新聞網]-23",
        "series": "news [中時新聞網]",
        "category": "23",
        "value": 3
    },
    {
        "id": "news [中時新聞網]-24",
        "name": "news [中時新聞網]-24",
        "series": "news [中時新聞網]",
        "category": "24",
        "value": 6
    },
    {
        "id": "news [中時新聞網]-25",
        "name": "news [中時新聞網]-25",
        "series": "news [中時新聞網]",
        "category": "25",
        "value": 5
    },
    {
        "id": "news [中時新聞網]-26",
        "name": "news [中時新聞網]-26",
        "series": "news [中時新聞網]",
        "category": "26",
        "value": 5
    },
    {
        "id": "news [中時新聞網]-27",
        "name": "news [中時新聞網]-27",
        "series": "news [中時新聞網]",
        "category": "27",
        "value": 2
    },
    {
        "id": "news [NOWnews今日新聞]-0",
        "name": "news [NOWnews今日新聞]-0",
        "series": "news [NOWnews今日新聞]",
        "category": "0",
        "value": 0
    },
    {
        "id": "news [NOWnews今日新聞]-1",
        "name": "news [NOWnews今日新聞]-1",
        "series": "news [NOWnews今日新聞]",
        "category": "1",
        "value": 3
    },
    {
        "id": "news [NOWnews今日新聞]-2",
        "name": "news [NOWnews今日新聞]-2",
        "series": "news [NOWnews今日新聞]",
        "category": "2",
        "value": 129
    },
    {
        "id": "news [NOWnews今日新聞]-3",
        "name": "news [NOWnews今日新聞]-3",
        "series": "news [NOWnews今日新聞]",
        "category": "3",
        "value": 120
    },
    {
        "id": "news [NOWnews今日新聞]-4",
        "name": "news [NOWnews今日新聞]-4",
        "series": "news [NOWnews今日新聞]",
        "category": "4",
        "value": 62
    },
    {
        "id": "news [NOWnews今日新聞]-5",
        "name": "news [NOWnews今日新聞]-5",
        "series": "news [NOWnews今日新聞]",
        "category": "5",
        "value": 67
    },
    {
        "id": "news [NOWnews今日新聞]-6",
        "name": "news [NOWnews今日新聞]-6",
        "series": "news [NOWnews今日新聞]",
        "category": "6",
        "value": 41
    },
    {
        "id": "news [NOWnews今日新聞]-7",
        "name": "news [NOWnews今日新聞]-7",
        "series": "news [NOWnews今日新聞]",
        "category": "7",
        "value": 35
    },
    {
        "id": "news [NOWnews今日新聞]-8",
        "name": "news [NOWnews今日新聞]-8",
        "series": "news [NOWnews今日新聞]",
        "category": "8",
        "value": 26
    },
    {
        "id": "news [NOWnews今日新聞]-9",
        "name": "news [NOWnews今日新聞]-9",
        "series": "news [NOWnews今日新聞]",
        "category": "9",
        "value": 13
    },
    {
        "id": "news [NOWnews今日新聞]-10",
        "name": "news [NOWnews今日新聞]-10",
        "series": "news [NOWnews今日新聞]",
        "category": "10",
        "value": 12
    },
    {
        "id": "news [NOWnews今日新聞]-11",
        "name": "news [NOWnews今日新聞]-11",
        "series": "news [NOWnews今日新聞]",
        "category": "11",
        "value": 9
    },
    {
        "id": "news [NOWnews今日新聞]-12",
        "name": "news [NOWnews今日新聞]-12",
        "series": "news [NOWnews今日新聞]",
        "category": "12",
        "value": 10
    },
    {
        "id": "news [NOWnews今日新聞]-13",
        "name": "news [NOWnews今日新聞]-13",
        "series": "news [NOWnews今日新聞]",
        "category": "13",
        "value": 4
    },
    {
        "id": "news [NOWnews今日新聞]-14",
        "name": "news [NOWnews今日新聞]-14",
        "series": "news [NOWnews今日新聞]",
        "category": "14",
        "value": 6
    },
    {
        "id": "news [NOWnews今日新聞]-15",
        "name": "news [NOWnews今日新聞]-15",
        "series": "news [NOWnews今日新聞]",
        "category": "15",
        "value": 5
    },
    {
        "id": "news [NOWnews今日新聞]-16",
        "name": "news [NOWnews今日新聞]-16",
        "series": "news [NOWnews今日新聞]",
        "category": "16",
        "value": 6
    },
    {
        "id": "news [NOWnews今日新聞]-17",
        "name": "news [NOWnews今日新聞]-17",
        "series": "news [NOWnews今日新聞]",
        "category": "17",
        "value": 6
    },
    {
        "id": "news [NOWnews今日新聞]-18",
        "name": "news [NOWnews今日新聞]-18",
        "series": "news [NOWnews今日新聞]",
        "category": "18",
        "value": 9
    },
    {
        "id": "news [NOWnews今日新聞]-19",
        "name": "news [NOWnews今日新聞]-19",
        "series": "news [NOWnews今日新聞]",
        "category": "19",
        "value": 13
    },
    {
        "id": "news [NOWnews今日新聞]-20",
        "name": "news [NOWnews今日新聞]-20",
        "series": "news [NOWnews今日新聞]",
        "category": "20",
        "value": 10
    },
    {
        "id": "news [NOWnews今日新聞]-21",
        "name": "news [NOWnews今日新聞]-21",
        "series": "news [NOWnews今日新聞]",
        "category": "21",
        "value": 4
    },
    {
        "id": "news [NOWnews今日新聞]-22",
        "name": "news [NOWnews今日新聞]-22",
        "series": "news [NOWnews今日新聞]",
        "category": "22",
        "value": 2
    },
    {
        "id": "news [NOWnews今日新聞]-23",
        "name": "news [NOWnews今日新聞]-23",
        "series": "news [NOWnews今日新聞]",
        "category": "23",
        "value": 1
    },
    {
        "id": "news [NOWnews今日新聞]-24",
        "name": "news [NOWnews今日新聞]-24",
        "series": "news [NOWnews今日新聞]",
        "category": "24",
        "value": 6
    },
    {
        "id": "news [NOWnews今日新聞]-25",
        "name": "news [NOWnews今日新聞]-25",
        "series": "news [NOWnews今日新聞]",
        "category": "25",
        "value": 4
    },
    {
        "id": "news [NOWnews今日新聞]-26",
        "name": "news [NOWnews今日新聞]-26",
        "series": "news [NOWnews今日新聞]",
        "category": "26",
        "value": 1
    },
    {
        "id": "news [NOWnews今日新聞]-27",
        "name": "news [NOWnews今日新聞]-27",
        "series": "news [NOWnews今日新聞]",
        "category": "27",
        "value": 4
    },
    {
        "id": "news [TVBS新聞]-0",
        "name": "news [TVBS新聞]-0",
        "series": "news [TVBS新聞]",
        "category": "0",
        "value": 0
    },
    {
        "id": "news [TVBS新聞]-1",
        "name": "news [TVBS新聞]-1",
        "series": "news [TVBS新聞]",
        "category": "1",
        "value": 1
    },
    {
        "id": "news [TVBS新聞]-2",
        "name": "news [TVBS新聞]-2",
        "series": "news [TVBS新聞]",
        "category": "2",
        "value": 100
    },
    {
        "id": "news [TVBS新聞]-3",
        "name": "news [TVBS新聞]-3",
        "series": "news [TVBS新聞]",
        "category": "3",
        "value": 105
    },
    {
        "id": "news [TVBS新聞]-4",
        "name": "news [TVBS新聞]-4",
        "series": "news [TVBS新聞]",
        "category": "4",
        "value": 63
    },
    {
        "id": "news [TVBS新聞]-5",
        "name": "news [TVBS新聞]-5",
        "series": "news [TVBS新聞]",
        "category": "5",
        "value": 61
    },
    {
        "id": "news [TVBS新聞]-6",
        "name": "news [TVBS新聞]-6",
        "series": "news [TVBS新聞]",
        "category": "6",
        "value": 38
    },
    {
        "id": "news [TVBS新聞]-7",
        "name": "news [TVBS新聞]-7",
        "series": "news [TVBS新聞]",
        "category": "7",
        "value": 33
    },
    {
        "id": "news [TVBS新聞]-8",
        "name": "news [TVBS新聞]-8",
        "series": "news [TVBS新聞]",
        "category": "8",
        "value": 26
    },
    {
        "id": "news [TVBS新聞]-9",
        "name": "news [TVBS新聞]-9",
        "series": "news [TVBS新聞]",
        "category": "9",
        "value": 20
    },
    {
        "id": "news [TVBS新聞]-10",
        "name": "news [TVBS新聞]-10",
        "series": "news [TVBS新聞]",
        "category": "10",
        "value": 20
    },
    {
        "id": "news [TVBS新聞]-11",
        "name": "news [TVBS新聞]-11",
        "series": "news [TVBS新聞]",
        "category": "11",
        "value": 16
    },
    {
        "id": "news [TVBS新聞]-12",
        "name": "news [TVBS新聞]-12",
        "series": "news [TVBS新聞]",
        "category": "12",
        "value": 13
    },
    {
        "id": "news [TVBS新聞]-13",
        "name": "news [TVBS新聞]-13",
        "series": "news [TVBS新聞]",
        "category": "13",
        "value": 9
    },
    {
        "id": "news [TVBS新聞]-14",
        "name": "news [TVBS新聞]-14",
        "series": "news [TVBS新聞]",
        "category": "14",
        "value": 10
    },
    {
        "id": "news [TVBS新聞]-15",
        "name": "news [TVBS新聞]-15",
        "series": "news [TVBS新聞]",
        "category": "15",
        "value": 8
    },
    {
        "id": "news [TVBS新聞]-16",
        "name": "news [TVBS新聞]-16",
        "series": "news [TVBS新聞]",
        "category": "16",
        "value": 9
    },
    {
        "id": "news [TVBS新聞]-17",
        "name": "news [TVBS新聞]-17",
        "series": "news [TVBS新聞]",
        "category": "17",
        "value": 6
    },
    {
        "id": "news [TVBS新聞]-18",
        "name": "news [TVBS新聞]-18",
        "series": "news [TVBS新聞]",
        "category": "18",
        "value": 13
    },
    {
        "id": "news [TVBS新聞]-19",
        "name": "news [TVBS新聞]-19",
        "series": "news [TVBS新聞]",
        "category": "19",
        "value": 12
    },
    {
        "id": "news [TVBS新聞]-20",
        "name": "news [TVBS新聞]-20",
        "series": "news [TVBS新聞]",
        "category": "20",
        "value": 11
    },
    {
        "id": "news [TVBS新聞]-21",
        "name": "news [TVBS新聞]-21",
        "series": "news [TVBS新聞]",
        "category": "21",
        "value": 6
    },
    {
        "id": "news [TVBS新聞]-22",
        "name": "news [TVBS新聞]-22",
        "series": "news [TVBS新聞]",
        "category": "22",
        "value": 3
    },
    {
        "id": "news [TVBS新聞]-23",
        "name": "news [TVBS新聞]-23",
        "series": "news [TVBS新聞]",
        "category": "23",
        "value": 4
    },
    {
        "id": "news [TVBS新聞]-24",
        "name": "news [TVBS新聞]-24",
        "series": "news [TVBS新聞]",
        "category": "24",
        "value": 8
    },
    {
        "id": "news [TVBS新聞]-25",
        "name": "news [TVBS新聞]-25",
        "series": "news [TVBS新聞]",
        "category": "25",
        "value": 4
    },
    {
        "id": "news [TVBS新聞]-26",
        "name": "news [TVBS新聞]-26",
        "series": "news [TVBS新聞]",
        "category": "26",
        "value": 2
    },
    {
        "id": "news [TVBS新聞]-27",
        "name": "news [TVBS新聞]-27",
        "series": "news [TVBS新聞]",
        "category": "27",
        "value": 5
    },
    {
        "id": "news [民視新聞]-0",
        "name": "news [民視新聞]-0",
        "series": "news [民視新聞]",
        "category": "0",
        "value": 0
    },
    {
        "id": "news [民視新聞]-1",
        "name": "news [民視新聞]-1",
        "series": "news [民視新聞]",
        "category": "1",
        "value": 0
    },
    {
        "id": "news [民視新聞]-2",
        "name": "news [民視新聞]-2",
        "series": "news [民視新聞]",
        "category": "2",
        "value": 111
    },
    {
        "id": "news [民視新聞]-3",
        "name": "news [民視新聞]-3",
        "series": "news [民視新聞]",
        "category": "3",
        "value": 83
    },
    {
        "id": "news [民視新聞]-4",
        "name": "news [民視新聞]-4",
        "series": "news [民視新聞]",
        "category": "4",
        "value": 64
    },
    {
        "id": "news [民視新聞]-5",
        "name": "news [民視新聞]-5",
        "series": "news [民視新聞]",
        "category": "5",
        "value": 64
    },
    {
        "id": "news [民視新聞]-6",
        "name": "news [民視新聞]-6",
        "series": "news [民視新聞]",
        "category": "6",
        "value": 38
    },
    {
        "id": "news [民視新聞]-7",
        "name": "news [民視新聞]-7",
        "series": "news [民視新聞]",
        "category": "7",
        "value": 23
    },
    {
        "id": "news [民視新聞]-8",
        "name": "news [民視新聞]-8",
        "series": "news [民視新聞]",
        "category": "8",
        "value": 25
    },
    {
        "id": "news [民視新聞]-9",
        "name": "news [民視新聞]-9",
        "series": "news [民視新聞]",
        "category": "9",
        "value": 24
    },
    {
        "id": "news [民視新聞]-10",
        "name": "news [民視新聞]-10",
        "series": "news [民視新聞]",
        "category": "10",
        "value": 23
    },
    {
        "id": "news [民視新聞]-11",
        "name": "news [民視新聞]-11",
        "series": "news [民視新聞]",
        "category": "11",
        "value": 14
    },
    {
        "id": "news [民視新聞]-12",
        "name": "news [民視新聞]-12",
        "series": "news [民視新聞]",
        "category": "12",
        "value": 4
    },
    {
        "id": "news [民視新聞]-13",
        "name": "news [民視新聞]-13",
        "series": "news [民視新聞]",
        "category": "13",
        "value": 9
    },
    {
        "id": "news [民視新聞]-14",
        "name": "news [民視新聞]-14",
        "series": "news [民視新聞]",
        "category": "14",
        "value": 7
    },
    {
        "id": "news [民視新聞]-15",
        "name": "news [民視新聞]-15",
        "series": "news [民視新聞]",
        "category": "15",
        "value": 6
    },
    {
        "id": "news [民視新聞]-16",
        "name": "news [民視新聞]-16",
        "series": "news [民視新聞]",
        "category": "16",
        "value": 3
    },
    {
        "id": "news [民視新聞]-17",
        "name": "news [民視新聞]-17",
        "series": "news [民視新聞]",
        "category": "17",
        "value": 3
    },
    {
        "id": "news [民視新聞]-18",
        "name": "news [民視新聞]-18",
        "series": "news [民視新聞]",
        "category": "18",
        "value": 9
    },
    {
        "id": "news [民視新聞]-19",
        "name": "news [民視新聞]-19",
        "series": "news [民視新聞]",
        "category": "19",
        "value": 7
    },
    {
        "id": "news [民視新聞]-20",
        "name": "news [民視新聞]-20",
        "series": "news [民視新聞]",
        "category": "20",
        "value": 9
    },
    {
        "id": "news [民視新聞]-21",
        "name": "news [民視新聞]-21",
        "series": "news [民視新聞]",
        "category": "21",
        "value": 1
    },
    {
        "id": "news [民視新聞]-22",
        "name": "news [民視新聞]-22",
        "series": "news [民視新聞]",
        "category": "22",
        "value": 0
    },
    {
        "id": "news [民視新聞]-23",
        "name": "news [民視新聞]-23",
        "series": "news [民視新聞]",
        "category": "23",
        "value": 2
    },
    {
        "id": "news [民視新聞]-24",
        "name": "news [民視新聞]-24",
        "series": "news [民視新聞]",
        "category": "24",
        "value": 3
    },
    {
        "id": "news [民視新聞]-25",
        "name": "news [民視新聞]-25",
        "series": "news [民視新聞]",
        "category": "25",
        "value": 1
    },
    {
        "id": "news [民視新聞]-26",
        "name": "news [民視新聞]-26",
        "series": "news [民視新聞]",
        "category": "26",
        "value": 0
    },
    {
        "id": "news [民視新聞]-27",
        "name": "news [民視新聞]-27",
        "series": "news [民視新聞]",
        "category": "27",
        "value": 1
    },
    {
        "id": "news [中天新聞網]-0",
        "name": "news [中天新聞網]-0",
        "series": "news [中天新聞網]",
        "category": "0",
        "value": 0
    },
    {
        "id": "news [中天新聞網]-1",
        "name": "news [中天新聞網]-1",
        "series": "news [中天新聞網]",
        "category": "1",
        "value": 0
    },
    {
        "id": "news [中天新聞網]-2",
        "name": "news [中天新聞網]-2",
        "series": "news [中天新聞網]",
        "category": "2",
        "value": 97
    },
    {
        "id": "news [中天新聞網]-3",
        "name": "news [中天新聞網]-3",
        "series": "news [中天新聞網]",
        "category": "3",
        "value": 75
    },
    {
        "id": "news [中天新聞網]-4",
        "name": "news [中天新聞網]-4",
        "series": "news [中天新聞網]",
        "category": "4",
        "value": 66
    },
    {
        "id": "news [中天新聞網]-5",
        "name": "news [中天新聞網]-5",
        "series": "news [中天新聞網]",
        "category": "5",
        "value": 55
    },
    {
        "id": "news [中天新聞網]-6",
        "name": "news [中天新聞網]-6",
        "series": "news [中天新聞網]",
        "category": "6",
        "value": 53
    },
    {
        "id": "news [中天新聞網]-7",
        "name": "news [中天新聞網]-7",
        "series": "news [中天新聞網]",
        "category": "7",
        "value": 28
    },
    {
        "id": "news [中天新聞網]-8",
        "name": "news [中天新聞網]-8",
        "series": "news [中天新聞網]",
        "category": "8",
        "value": 21
    },
    {
        "id": "news [中天新聞網]-9",
        "name": "news [中天新聞網]-9",
        "series": "news [中天新聞網]",
        "category": "9",
        "value": 23
    },
    {
        "id": "news [中天新聞網]-10",
        "name": "news [中天新聞網]-10",
        "series": "news [中天新聞網]",
        "category": "10",
        "value": 11
    },
    {
        "id": "news [中天新聞網]-11",
        "name": "news [中天新聞網]-11",
        "series": "news [中天新聞網]",
        "category": "11",
        "value": 14
    },
    {
        "id": "news [中天新聞網]-12",
        "name": "news [中天新聞網]-12",
        "series": "news [中天新聞網]",
        "category": "12",
        "value": 7
    },
    {
        "id": "news [中天新聞網]-13",
        "name": "news [中天新聞網]-13",
        "series": "news [中天新聞網]",
        "category": "13",
        "value": 7
    },
    {
        "id": "news [中天新聞網]-14",
        "name": "news [中天新聞網]-14",
        "series": "news [中天新聞網]",
        "category": "14",
        "value": 10
    },
    {
        "id": "news [中天新聞網]-15",
        "name": "news [中天新聞網]-15",
        "series": "news [中天新聞網]",
        "category": "15",
        "value": 2
    },
    {
        "id": "news [中天新聞網]-16",
        "name": "news [中天新聞網]-16",
        "series": "news [中天新聞網]",
        "category": "16",
        "value": 4
    },
    {
        "id": "news [中天新聞網]-17",
        "name": "news [中天新聞網]-17",
        "series": "news [中天新聞網]",
        "category": "17",
        "value": 4
    },
    {
        "id": "news [中天新聞網]-18",
        "name": "news [中天新聞網]-18",
        "series": "news [中天新聞網]",
        "category": "18",
        "value": 5
    },
    {
        "id": "news [中天新聞網]-19",
        "name": "news [中天新聞網]-19",
        "series": "news [中天新聞網]",
        "category": "19",
        "value": 9
    },
    {
        "id": "news [中天新聞網]-20",
        "name": "news [中天新聞網]-20",
        "series": "news [中天新聞網]",
        "category": "20",
        "value": 7
    },
    {
        "id": "news [中天新聞網]-21",
        "name": "news [中天新聞網]-21",
        "series": "news [中天新聞網]",
        "category": "21",
        "value": 4
    },
    {
        "id": "news [中天新聞網]-22",
        "name": "news [中天新聞網]-22",
        "series": "news [中天新聞網]",
        "category": "22",
        "value": 1
    },
    {
        "id": "news [中天新聞網]-23",
        "name": "news [中天新聞網]-23",
        "series": "news [中天新聞網]",
        "category": "23",
        "value": 0
    },
    {
        "id": "news [中天新聞網]-24",
        "name": "news [中天新聞網]-24",
        "series": "news [中天新聞網]",
        "category": "24",
        "value": 7
    },
    {
        "id": "news [中天新聞網]-25",
        "name": "news [中天新聞網]-25",
        "series": "news [中天新聞網]",
        "category": "25",
        "value": 2
    },
    {
        "id": "news [中天新聞網]-26",
        "name": "news [中天新聞網]-26",
        "series": "news [中天新聞網]",
        "category": "26",
        "value": 2
    },
    {
        "id": "news [中天新聞網]-27",
        "name": "news [中天新聞網]-27",
        "series": "news [中天新聞網]",
        "category": "27",
        "value": 2
    },
    {
        "id": "news [東森新聞]-0",
        "name": "news [東森新聞]-0",
        "series": "news [東森新聞]",
        "category": "0",
        "value": 0
    },
    {
        "id": "news [東森新聞]-1",
        "name": "news [東森新聞]-1",
        "series": "news [東森新聞]",
        "category": "1",
        "value": 1
    },
    {
        "id": "news [東森新聞]-2",
        "name": "news [東森新聞]-2",
        "series": "news [東森新聞]",
        "category": "2",
        "value": 103
    },
    {
        "id": "news [東森新聞]-3",
        "name": "news [東森新聞]-3",
        "series": "news [東森新聞]",
        "category": "3",
        "value": 68
    },
    {
        "id": "news [東森新聞]-4",
        "name": "news [東森新聞]-4",
        "series": "news [東森新聞]",
        "category": "4",
        "value": 62
    },
    {
        "id": "news [東森新聞]-5",
        "name": "news [東森新聞]-5",
        "series": "news [東森新聞]",
        "category": "5",
        "value": 51
    },
    {
        "id": "news [東森新聞]-6",
        "name": "news [東森新聞]-6",
        "series": "news [東森新聞]",
        "category": "6",
        "value": 32
    },
    {
        "id": "news [東森新聞]-7",
        "name": "news [東森新聞]-7",
        "series": "news [東森新聞]",
        "category": "7",
        "value": 31
    },
    {
        "id": "news [東森新聞]-8",
        "name": "news [東森新聞]-8",
        "series": "news [東森新聞]",
        "category": "8",
        "value": 27
    },
    {
        "id": "news [東森新聞]-9",
        "name": "news [東森新聞]-9",
        "series": "news [東森新聞]",
        "category": "9",
        "value": 23
    },
    {
        "id": "news [東森新聞]-10",
        "name": "news [東森新聞]-10",
        "series": "news [東森新聞]",
        "category": "10",
        "value": 10
    },
    {
        "id": "news [東森新聞]-11",
        "name": "news [東森新聞]-11",
        "series": "news [東森新聞]",
        "category": "11",
        "value": 10
    },
    {
        "id": "news [東森新聞]-12",
        "name": "news [東森新聞]-12",
        "series": "news [東森新聞]",
        "category": "12",
        "value": 7
    },
    {
        "id": "news [東森新聞]-13",
        "name": "news [東森新聞]-13",
        "series": "news [東森新聞]",
        "category": "13",
        "value": 6
    },
    {
        "id": "news [東森新聞]-14",
        "name": "news [東森新聞]-14",
        "series": "news [東森新聞]",
        "category": "14",
        "value": 8
    },
    {
        "id": "news [東森新聞]-15",
        "name": "news [東森新聞]-15",
        "series": "news [東森新聞]",
        "category": "15",
        "value": 1
    },
    {
        "id": "news [東森新聞]-16",
        "name": "news [東森新聞]-16",
        "series": "news [東森新聞]",
        "category": "16",
        "value": 2
    },
    {
        "id": "news [東森新聞]-17",
        "name": "news [東森新聞]-17",
        "series": "news [東森新聞]",
        "category": "17",
        "value": 0
    },
    {
        "id": "news [東森新聞]-18",
        "name": "news [東森新聞]-18",
        "series": "news [東森新聞]",
        "category": "18",
        "value": 6
    },
    {
        "id": "news [東森新聞]-19",
        "name": "news [東森新聞]-19",
        "series": "news [東森新聞]",
        "category": "19",
        "value": 8
    },
    {
        "id": "news [東森新聞]-20",
        "name": "news [東森新聞]-20",
        "series": "news [東森新聞]",
        "category": "20",
        "value": 5
    },
    {
        "id": "news [東森新聞]-21",
        "name": "news [東森新聞]-21",
        "series": "news [東森新聞]",
        "category": "21",
        "value": 5
    },
    {
        "id": "news [東森新聞]-22",
        "name": "news [東森新聞]-22",
        "series": "news [東森新聞]",
        "category": "22",
        "value": 1
    },
    {
        "id": "news [東森新聞]-23",
        "name": "news [東森新聞]-23",
        "series": "news [東森新聞]",
        "category": "23",
        "value": 1
    },
    {
        "id": "news [東森新聞]-24",
        "name": "news [東森新聞]-24",
        "series": "news [東森新聞]",
        "category": "24",
        "value": 5
    },
    {
        "id": "news [東森新聞]-25",
        "name": "news [東森新聞]-25",
        "series": "news [東森新聞]",
        "category": "25",
        "value": 3
    },
    {
        "id": "news [東森新聞]-26",
        "name": "news [東森新聞]-26",
        "series": "news [東森新聞]",
        "category": "26",
        "value": 1
    },
    {
        "id": "news [東森新聞]-27",
        "name": "news [東森新聞]-27",
        "series": "news [東森新聞]",
        "category": "27",
        "value": 5
    },
    {
        "id": "FB [快點TV]-0",
        "name": "FB [快點TV]-0",
        "series": "FB [快點TV]",
        "category": "0",
        "value": 0
    },
    {
        "id": "FB [快點TV]-1",
        "name": "FB [快點TV]-1",
        "series": "FB [快點TV]",
        "category": "1",
        "value": 0
    },
    {
        "id": "FB [快點TV]-2",
        "name": "FB [快點TV]-2",
        "series": "FB [快點TV]",
        "category": "2",
        "value": 118
    },
    {
        "id": "FB [快點TV]-3",
        "name": "FB [快點TV]-3",
        "series": "FB [快點TV]",
        "category": "3",
        "value": 67
    },
    {
        "id": "FB [快點TV]-4",
        "name": "FB [快點TV]-4",
        "series": "FB [快點TV]",
        "category": "4",
        "value": 67
    },
    {
        "id": "FB [快點TV]-5",
        "name": "FB [快點TV]-5",
        "series": "FB [快點TV]",
        "category": "5",
        "value": 46
    },
    {
        "id": "FB [快點TV]-6",
        "name": "FB [快點TV]-6",
        "series": "FB [快點TV]",
        "category": "6",
        "value": 37
    },
    {
        "id": "FB [快點TV]-7",
        "name": "FB [快點TV]-7",
        "series": "FB [快點TV]",
        "category": "7",
        "value": 28
    },
    {
        "id": "FB [快點TV]-8",
        "name": "FB [快點TV]-8",
        "series": "FB [快點TV]",
        "category": "8",
        "value": 17
    },
    {
        "id": "FB [快點TV]-9",
        "name": "FB [快點TV]-9",
        "series": "FB [快點TV]",
        "category": "9",
        "value": 14
    },
    {
        "id": "FB [快點TV]-10",
        "name": "FB [快點TV]-10",
        "series": "FB [快點TV]",
        "category": "10",
        "value": 15
    },
    {
        "id": "FB [快點TV]-11",
        "name": "FB [快點TV]-11",
        "series": "FB [快點TV]",
        "category": "11",
        "value": 8
    },
    {
        "id": "FB [快點TV]-12",
        "name": "FB [快點TV]-12",
        "series": "FB [快點TV]",
        "category": "12",
        "value": 3
    },
    {
        "id": "FB [快點TV]-13",
        "name": "FB [快點TV]-13",
        "series": "FB [快點TV]",
        "category": "13",
        "value": 3
    },
    {
        "id": "FB [快點TV]-14",
        "name": "FB [快點TV]-14",
        "series": "FB [快點TV]",
        "category": "14",
        "value": 9
    },
    {
        "id": "FB [快點TV]-15",
        "name": "FB [快點TV]-15",
        "series": "FB [快點TV]",
        "category": "15",
        "value": 7
    },
    {
        "id": "FB [快點TV]-16",
        "name": "FB [快點TV]-16",
        "series": "FB [快點TV]",
        "category": "16",
        "value": 2
    },
    {
        "id": "FB [快點TV]-17",
        "name": "FB [快點TV]-17",
        "series": "FB [快點TV]",
        "category": "17",
        "value": 3
    },
    {
        "id": "FB [快點TV]-18",
        "name": "FB [快點TV]-18",
        "series": "FB [快點TV]",
        "category": "18",
        "value": 3
    },
    {
        "id": "FB [快點TV]-19",
        "name": "FB [快點TV]-19",
        "series": "FB [快點TV]",
        "category": "19",
        "value": 10
    },
    {
        "id": "FB [快點TV]-20",
        "name": "FB [快點TV]-20",
        "series": "FB [快點TV]",
        "category": "20",
        "value": 8
    },
    {
        "id": "FB [快點TV]-21",
        "name": "FB [快點TV]-21",
        "series": "FB [快點TV]",
        "category": "21",
        "value": 3
    },
    {
        "id": "FB [快點TV]-22",
        "name": "FB [快點TV]-22",
        "series": "FB [快點TV]",
        "category": "22",
        "value": 1
    },
    {
        "id": "FB [快點TV]-23",
        "name": "FB [快點TV]-23",
        "series": "FB [快點TV]",
        "category": "23",
        "value": 0
    },
    {
        "id": "FB [快點TV]-24",
        "name": "FB [快點TV]-24",
        "series": "FB [快點TV]",
        "category": "24",
        "value": 6
    },
    {
        "id": "FB [快點TV]-25",
        "name": "FB [快點TV]-25",
        "series": "FB [快點TV]",
        "category": "25",
        "value": 3
    },
    {
        "id": "FB [快點TV]-26",
        "name": "FB [快點TV]-26",
        "series": "FB [快點TV]",
        "category": "26",
        "value": 0
    },
    {
        "id": "FB [快點TV]-27",
        "name": "FB [快點TV]-27",
        "series": "FB [快點TV]",
        "category": "27",
        "value": 2
    },
    {
        "id": "news [壹蘋新聞網]-0",
        "name": "news [壹蘋新聞網]-0",
        "series": "news [壹蘋新聞網]",
        "category": "0",
        "value": 0
    },
    {
        "id": "news [壹蘋新聞網]-1",
        "name": "news [壹蘋新聞網]-1",
        "series": "news [壹蘋新聞網]",
        "category": "1",
        "value": 1
    },
    {
        "id": "news [壹蘋新聞網]-2",
        "name": "news [壹蘋新聞網]-2",
        "series": "news [壹蘋新聞網]",
        "category": "2",
        "value": 92
    },
    {
        "id": "news [壹蘋新聞網]-3",
        "name": "news [壹蘋新聞網]-3",
        "series": "news [壹蘋新聞網]",
        "category": "3",
        "value": 68
    },
    {
        "id": "news [壹蘋新聞網]-4",
        "name": "news [壹蘋新聞網]-4",
        "series": "news [壹蘋新聞網]",
        "category": "4",
        "value": 43
    },
    {
        "id": "news [壹蘋新聞網]-5",
        "name": "news [壹蘋新聞網]-5",
        "series": "news [壹蘋新聞網]",
        "category": "5",
        "value": 40
    },
    {
        "id": "news [壹蘋新聞網]-6",
        "name": "news [壹蘋新聞網]-6",
        "series": "news [壹蘋新聞網]",
        "category": "6",
        "value": 25
    },
    {
        "id": "news [壹蘋新聞網]-7",
        "name": "news [壹蘋新聞網]-7",
        "series": "news [壹蘋新聞網]",
        "category": "7",
        "value": 21
    },
    {
        "id": "news [壹蘋新聞網]-8",
        "name": "news [壹蘋新聞網]-8",
        "series": "news [壹蘋新聞網]",
        "category": "8",
        "value": 15
    },
    {
        "id": "news [壹蘋新聞網]-9",
        "name": "news [壹蘋新聞網]-9",
        "series": "news [壹蘋新聞網]",
        "category": "9",
        "value": 18
    },
    {
        "id": "news [壹蘋新聞網]-10",
        "name": "news [壹蘋新聞網]-10",
        "series": "news [壹蘋新聞網]",
        "category": "10",
        "value": 12
    },
    {
        "id": "news [壹蘋新聞網]-11",
        "name": "news [壹蘋新聞網]-11",
        "series": "news [壹蘋新聞網]",
        "category": "11",
        "value": 13
    },
    {
        "id": "news [壹蘋新聞網]-12",
        "name": "news [壹蘋新聞網]-12",
        "series": "news [壹蘋新聞網]",
        "category": "12",
        "value": 6
    },
    {
        "id": "news [壹蘋新聞網]-13",
        "name": "news [壹蘋新聞網]-13",
        "series": "news [壹蘋新聞網]",
        "category": "13",
        "value": 8
    },
    {
        "id": "news [壹蘋新聞網]-14",
        "name": "news [壹蘋新聞網]-14",
        "series": "news [壹蘋新聞網]",
        "category": "14",
        "value": 7
    },
    {
        "id": "news [壹蘋新聞網]-15",
        "name": "news [壹蘋新聞網]-15",
        "series": "news [壹蘋新聞網]",
        "category": "15",
        "value": 4
    },
    {
        "id": "news [壹蘋新聞網]-16",
        "name": "news [壹蘋新聞網]-16",
        "series": "news [壹蘋新聞網]",
        "category": "16",
        "value": 3
    },
    {
        "id": "news [壹蘋新聞網]-17",
        "name": "news [壹蘋新聞網]-17",
        "series": "news [壹蘋新聞網]",
        "category": "17",
        "value": 2
    },
    {
        "id": "news [壹蘋新聞網]-18",
        "name": "news [壹蘋新聞網]-18",
        "series": "news [壹蘋新聞網]",
        "category": "18",
        "value": 12
    },
    {
        "id": "news [壹蘋新聞網]-19",
        "name": "news [壹蘋新聞網]-19",
        "series": "news [壹蘋新聞網]",
        "category": "19",
        "value": 11
    },
    {
        "id": "news [壹蘋新聞網]-20",
        "name": "news [壹蘋新聞網]-20",
        "series": "news [壹蘋新聞網]",
        "category": "20",
        "value": 5
    },
    {
        "id": "news [壹蘋新聞網]-21",
        "name": "news [壹蘋新聞網]-21",
        "series": "news [壹蘋新聞網]",
        "category": "21",
        "value": 3
    },
    {
        "id": "news [壹蘋新聞網]-22",
        "name": "news [壹蘋新聞網]-22",
        "series": "news [壹蘋新聞網]",
        "category": "22",
        "value": 2
    },
    {
        "id": "news [壹蘋新聞網]-23",
        "name": "news [壹蘋新聞網]-23",
        "series": "news [壹蘋新聞網]",
        "category": "23",
        "value": 3
    },
    {
        "id": "news [壹蘋新聞網]-24",
        "name": "news [壹蘋新聞網]-24",
        "series": "news [壹蘋新聞網]",
        "category": "24",
        "value": 7
    },
    {
        "id": "news [壹蘋新聞網]-25",
        "name": "news [壹蘋新聞網]-25",
        "series": "news [壹蘋新聞網]",
        "category": "25",
        "value": 5
    },
    {
        "id": "news [壹蘋新聞網]-26",
        "name": "news [壹蘋新聞網]-26",
        "series": "news [壹蘋新聞網]",
        "category": "26",
        "value": 3
    },
    {
        "id": "news [壹蘋新聞網]-27",
        "name": "news [壹蘋新聞網]-27",
        "series": "news [壹蘋新聞網]",
        "category": "27",
        "value": 3
    },
    {
        "id": "FB [三立新聞]-0",
        "name": "FB [三立新聞]-0",
        "series": "FB [三立新聞]",
        "category": "0",
        "value": 0
    },
    {
        "id": "FB [三立新聞]-1",
        "name": "FB [三立新聞]-1",
        "series": "FB [三立新聞]",
        "category": "1",
        "value": 0
    },
    {
        "id": "FB [三立新聞]-2",
        "name": "FB [三立新聞]-2",
        "series": "FB [三立新聞]",
        "category": "2",
        "value": 114
    },
    {
        "id": "FB [三立新聞]-3",
        "name": "FB [三立新聞]-3",
        "series": "FB [三立新聞]",
        "category": "3",
        "value": 78
    },
    {
        "id": "FB [三立新聞]-4",
        "name": "FB [三立新聞]-4",
        "series": "FB [三立新聞]",
        "category": "4",
        "value": 52
    },
    {
        "id": "FB [三立新聞]-5",
        "name": "FB [三立新聞]-5",
        "series": "FB [三立新聞]",
        "category": "5",
        "value": 33
    },
    {
        "id": "FB [三立新聞]-6",
        "name": "FB [三立新聞]-6",
        "series": "FB [三立新聞]",
        "category": "6",
        "value": 35
    },
    {
        "id": "FB [三立新聞]-7",
        "name": "FB [三立新聞]-7",
        "series": "FB [三立新聞]",
        "category": "7",
        "value": 20
    },
    {
        "id": "FB [三立新聞]-8",
        "name": "FB [三立新聞]-8",
        "series": "FB [三立新聞]",
        "category": "8",
        "value": 18
    },
    {
        "id": "FB [三立新聞]-9",
        "name": "FB [三立新聞]-9",
        "series": "FB [三立新聞]",
        "category": "9",
        "value": 9
    },
    {
        "id": "FB [三立新聞]-10",
        "name": "FB [三立新聞]-10",
        "series": "FB [三立新聞]",
        "category": "10",
        "value": 8
    },
    {
        "id": "FB [三立新聞]-11",
        "name": "FB [三立新聞]-11",
        "series": "FB [三立新聞]",
        "category": "11",
        "value": 4
    },
    {
        "id": "FB [三立新聞]-12",
        "name": "FB [三立新聞]-12",
        "series": "FB [三立新聞]",
        "category": "12",
        "value": 8
    },
    {
        "id": "FB [三立新聞]-13",
        "name": "FB [三立新聞]-13",
        "series": "FB [三立新聞]",
        "category": "13",
        "value": 6
    },
    {
        "id": "FB [三立新聞]-14",
        "name": "FB [三立新聞]-14",
        "series": "FB [三立新聞]",
        "category": "14",
        "value": 4
    },
    {
        "id": "FB [三立新聞]-15",
        "name": "FB [三立新聞]-15",
        "series": "FB [三立新聞]",
        "category": "15",
        "value": 0
    },
    {
        "id": "FB [三立新聞]-16",
        "name": "FB [三立新聞]-16",
        "series": "FB [三立新聞]",
        "category": "16",
        "value": 2
    },
    {
        "id": "FB [三立新聞]-17",
        "name": "FB [三立新聞]-17",
        "series": "FB [三立新聞]",
        "category": "17",
        "value": 3
    },
    {
        "id": "FB [三立新聞]-18",
        "name": "FB [三立新聞]-18",
        "series": "FB [三立新聞]",
        "category": "18",
        "value": 5
    },
    {
        "id": "FB [三立新聞]-19",
        "name": "FB [三立新聞]-19",
        "series": "FB [三立新聞]",
        "category": "19",
        "value": 4
    },
    {
        "id": "FB [三立新聞]-20",
        "name": "FB [三立新聞]-20",
        "series": "FB [三立新聞]",
        "category": "20",
        "value": 9
    },
    {
        "id": "FB [三立新聞]-21",
        "name": "FB [三立新聞]-21",
        "series": "FB [三立新聞]",
        "category": "21",
        "value": 2
    },
    {
        "id": "FB [三立新聞]-22",
        "name": "FB [三立新聞]-22",
        "series": "FB [三立新聞]",
        "category": "22",
        "value": 1
    },
    {
        "id": "FB [三立新聞]-23",
        "name": "FB [三立新聞]-23",
        "series": "FB [三立新聞]",
        "category": "23",
        "value": 3
    },
    {
        "id": "FB [三立新聞]-24",
        "name": "FB [三立新聞]-24",
        "series": "FB [三立新聞]",
        "category": "24",
        "value": 5
    },
    {
        "id": "FB [三立新聞]-25",
        "name": "FB [三立新聞]-25",
        "series": "FB [三立新聞]",
        "category": "25",
        "value": 5
    },
    {
        "id": "FB [三立新聞]-26",
        "name": "FB [三立新聞]-26",
        "series": "FB [三立新聞]",
        "category": "26",
        "value": 0
    },
    {
        "id": "FB [三立新聞]-27",
        "name": "FB [三立新聞]-27",
        "series": "FB [三立新聞]",
        "category": "27",
        "value": 2
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
        "value": 0
    },
    {
        "id": "news [聯合新聞網]-2",
        "name": "news [聯合新聞網]-2",
        "series": "news [聯合新聞網]",
        "category": "2",
        "value": 79
    },
    {
        "id": "news [聯合新聞網]-3",
        "name": "news [聯合新聞網]-3",
        "series": "news [聯合新聞網]",
        "category": "3",
        "value": 105
    },
    {
        "id": "news [聯合新聞網]-4",
        "name": "news [聯合新聞網]-4",
        "series": "news [聯合新聞網]",
        "category": "4",
        "value": 58
    },
    {
        "id": "news [聯合新聞網]-5",
        "name": "news [聯合新聞網]-5",
        "series": "news [聯合新聞網]",
        "category": "5",
        "value": 34
    },
    {
        "id": "news [聯合新聞網]-6",
        "name": "news [聯合新聞網]-6",
        "series": "news [聯合新聞網]",
        "category": "6",
        "value": 30
    },
    {
        "id": "news [聯合新聞網]-7",
        "name": "news [聯合新聞網]-7",
        "series": "news [聯合新聞網]",
        "category": "7",
        "value": 13
    },
    {
        "id": "news [聯合新聞網]-8",
        "name": "news [聯合新聞網]-8",
        "series": "news [聯合新聞網]",
        "category": "8",
        "value": 11
    },
    {
        "id": "news [聯合新聞網]-9",
        "name": "news [聯合新聞網]-9",
        "series": "news [聯合新聞網]",
        "category": "9",
        "value": 10
    },
    {
        "id": "news [聯合新聞網]-10",
        "name": "news [聯合新聞網]-10",
        "series": "news [聯合新聞網]",
        "category": "10",
        "value": 14
    },
    {
        "id": "news [聯合新聞網]-11",
        "name": "news [聯合新聞網]-11",
        "series": "news [聯合新聞網]",
        "category": "11",
        "value": 7
    },
    {
        "id": "news [聯合新聞網]-12",
        "name": "news [聯合新聞網]-12",
        "series": "news [聯合新聞網]",
        "category": "12",
        "value": 4
    },
    {
        "id": "news [聯合新聞網]-13",
        "name": "news [聯合新聞網]-13",
        "series": "news [聯合新聞網]",
        "category": "13",
        "value": 5
    },
    {
        "id": "news [聯合新聞網]-14",
        "name": "news [聯合新聞網]-14",
        "series": "news [聯合新聞網]",
        "category": "14",
        "value": 6
    },
    {
        "id": "news [聯合新聞網]-15",
        "name": "news [聯合新聞網]-15",
        "series": "news [聯合新聞網]",
        "category": "15",
        "value": 2
    },
    {
        "id": "news [聯合新聞網]-16",
        "name": "news [聯合新聞網]-16",
        "series": "news [聯合新聞網]",
        "category": "16",
        "value": 3
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
        "value": 7
    },
    {
        "id": "news [聯合新聞網]-20",
        "name": "news [聯合新聞網]-20",
        "series": "news [聯合新聞網]",
        "category": "20",
        "value": 7
    },
    {
        "id": "news [聯合新聞網]-21",
        "name": "news [聯合新聞網]-21",
        "series": "news [聯合新聞網]",
        "category": "21",
        "value": 5
    },
    {
        "id": "news [聯合新聞網]-22",
        "name": "news [聯合新聞網]-22",
        "series": "news [聯合新聞網]",
        "category": "22",
        "value": 0
    },
    {
        "id": "news [聯合新聞網]-23",
        "name": "news [聯合新聞網]-23",
        "series": "news [聯合新聞網]",
        "category": "23",
        "value": 2
    },
    {
        "id": "news [聯合新聞網]-24",
        "name": "news [聯合新聞網]-24",
        "series": "news [聯合新聞網]",
        "category": "24",
        "value": 2
    },
    {
        "id": "news [聯合新聞網]-25",
        "name": "news [聯合新聞網]-25",
        "series": "news [聯合新聞網]",
        "category": "25",
        "value": 3
    },
    {
        "id": "news [聯合新聞網]-26",
        "name": "news [聯合新聞網]-26",
        "series": "news [聯合新聞網]",
        "category": "26",
        "value": 0
    },
    {
        "id": "news [聯合新聞網]-27",
        "name": "news [聯合新聞網]-27",
        "series": "news [聯合新聞網]",
        "category": "27",
        "value": 0
    },
    {
        "id": "FB [中時新聞網]-0",
        "name": "FB [中時新聞網]-0",
        "series": "FB [中時新聞網]",
        "category": "0",
        "value": 0
    },
    {
        "id": "FB [中時新聞網]-1",
        "name": "FB [中時新聞網]-1",
        "series": "FB [中時新聞網]",
        "category": "1",
        "value": 0
    },
    {
        "id": "FB [中時新聞網]-2",
        "name": "FB [中時新聞網]-2",
        "series": "FB [中時新聞網]",
        "category": "2",
        "value": 90
    },
    {
        "id": "FB [中時新聞網]-3",
        "name": "FB [中時新聞網]-3",
        "series": "FB [中時新聞網]",
        "category": "3",
        "value": 66
    },
    {
        "id": "FB [中時新聞網]-4",
        "name": "FB [中時新聞網]-4",
        "series": "FB [中時新聞網]",
        "category": "4",
        "value": 43
    },
    {
        "id": "FB [中時新聞網]-5",
        "name": "FB [中時新聞網]-5",
        "series": "FB [中時新聞網]",
        "category": "5",
        "value": 49
    },
    {
        "id": "FB [中時新聞網]-6",
        "name": "FB [中時新聞網]-6",
        "series": "FB [中時新聞網]",
        "category": "6",
        "value": 25
    },
    {
        "id": "FB [中時新聞網]-7",
        "name": "FB [中時新聞網]-7",
        "series": "FB [中時新聞網]",
        "category": "7",
        "value": 6
    },
    {
        "id": "FB [中時新聞網]-8",
        "name": "FB [中時新聞網]-8",
        "series": "FB [中時新聞網]",
        "category": "8",
        "value": 16
    },
    {
        "id": "FB [中時新聞網]-9",
        "name": "FB [中時新聞網]-9",
        "series": "FB [中時新聞網]",
        "category": "9",
        "value": 13
    },
    {
        "id": "FB [中時新聞網]-10",
        "name": "FB [中時新聞網]-10",
        "series": "FB [中時新聞網]",
        "category": "10",
        "value": 13
    },
    {
        "id": "FB [中時新聞網]-11",
        "name": "FB [中時新聞網]-11",
        "series": "FB [中時新聞網]",
        "category": "11",
        "value": 10
    },
    {
        "id": "FB [中時新聞網]-12",
        "name": "FB [中時新聞網]-12",
        "series": "FB [中時新聞網]",
        "category": "12",
        "value": 5
    },
    {
        "id": "FB [中時新聞網]-13",
        "name": "FB [中時新聞網]-13",
        "series": "FB [中時新聞網]",
        "category": "13",
        "value": 2
    },
    {
        "id": "FB [中時新聞網]-14",
        "name": "FB [中時新聞網]-14",
        "series": "FB [中時新聞網]",
        "category": "14",
        "value": 8
    },
    {
        "id": "FB [中時新聞網]-15",
        "name": "FB [中時新聞網]-15",
        "series": "FB [中時新聞網]",
        "category": "15",
        "value": 3
    },
    {
        "id": "FB [中時新聞網]-16",
        "name": "FB [中時新聞網]-16",
        "series": "FB [中時新聞網]",
        "category": "16",
        "value": 5
    },
    {
        "id": "FB [中時新聞網]-17",
        "name": "FB [中時新聞網]-17",
        "series": "FB [中時新聞網]",
        "category": "17",
        "value": 0
    },
    {
        "id": "FB [中時新聞網]-18",
        "name": "FB [中時新聞網]-18",
        "series": "FB [中時新聞網]",
        "category": "18",
        "value": 3
    },
    {
        "id": "FB [中時新聞網]-19",
        "name": "FB [中時新聞網]-19",
        "series": "FB [中時新聞網]",
        "category": "19",
        "value": 8
    },
    {
        "id": "FB [中時新聞網]-20",
        "name": "FB [中時新聞網]-20",
        "series": "FB [中時新聞網]",
        "category": "20",
        "value": 6
    },
    {
        "id": "FB [中時新聞網]-21",
        "name": "FB [中時新聞網]-21",
        "series": "FB [中時新聞網]",
        "category": "21",
        "value": 5
    },
    {
        "id": "FB [中時新聞網]-22",
        "name": "FB [中時新聞網]-22",
        "series": "FB [中時新聞網]",
        "category": "22",
        "value": 0
    },
    {
        "id": "FB [中時新聞網]-23",
        "name": "FB [中時新聞網]-23",
        "series": "FB [中時新聞網]",
        "category": "23",
        "value": 0
    },
    {
        "id": "FB [中時新聞網]-24",
        "name": "FB [中時新聞網]-24",
        "series": "FB [中時新聞網]",
        "category": "24",
        "value": 4
    },
    {
        "id": "FB [中時新聞網]-25",
        "name": "FB [中時新聞網]-25",
        "series": "FB [中時新聞網]",
        "category": "25",
        "value": 4
    },
    {
        "id": "FB [中時新聞網]-26",
        "name": "FB [中時新聞網]-26",
        "series": "FB [中時新聞網]",
        "category": "26",
        "value": 0
    },
    {
        "id": "FB [中時新聞網]-27",
        "name": "FB [中時新聞網]-27",
        "series": "FB [中時新聞網]",
        "category": "27",
        "value": 2
    },
    {
        "id": "news [CTWANT]-0",
        "name": "news [CTWANT]-0",
        "series": "news [CTWANT]",
        "category": "0",
        "value": 0
    },
    {
        "id": "news [CTWANT]-1",
        "name": "news [CTWANT]-1",
        "series": "news [CTWANT]",
        "category": "1",
        "value": 0
    },
    {
        "id": "news [CTWANT]-2",
        "name": "news [CTWANT]-2",
        "series": "news [CTWANT]",
        "category": "2",
        "value": 88
    },
    {
        "id": "news [CTWANT]-3",
        "name": "news [CTWANT]-3",
        "series": "news [CTWANT]",
        "category": "3",
        "value": 59
    },
    {
        "id": "news [CTWANT]-4",
        "name": "news [CTWANT]-4",
        "series": "news [CTWANT]",
        "category": "4",
        "value": 51
    },
    {
        "id": "news [CTWANT]-5",
        "name": "news [CTWANT]-5",
        "series": "news [CTWANT]",
        "category": "5",
        "value": 29
    },
    {
        "id": "news [CTWANT]-6",
        "name": "news [CTWANT]-6",
        "series": "news [CTWANT]",
        "category": "6",
        "value": 26
    },
    {
        "id": "news [CTWANT]-7",
        "name": "news [CTWANT]-7",
        "series": "news [CTWANT]",
        "category": "7",
        "value": 14
    },
    {
        "id": "news [CTWANT]-8",
        "name": "news [CTWANT]-8",
        "series": "news [CTWANT]",
        "category": "8",
        "value": 13
    },
    {
        "id": "news [CTWANT]-9",
        "name": "news [CTWANT]-9",
        "series": "news [CTWANT]",
        "category": "9",
        "value": 16
    },
    {
        "id": "news [CTWANT]-10",
        "name": "news [CTWANT]-10",
        "series": "news [CTWANT]",
        "category": "10",
        "value": 7
    },
    {
        "id": "news [CTWANT]-11",
        "name": "news [CTWANT]-11",
        "series": "news [CTWANT]",
        "category": "11",
        "value": 9
    },
    {
        "id": "news [CTWANT]-12",
        "name": "news [CTWANT]-12",
        "series": "news [CTWANT]",
        "category": "12",
        "value": 2
    },
    {
        "id": "news [CTWANT]-13",
        "name": "news [CTWANT]-13",
        "series": "news [CTWANT]",
        "category": "13",
        "value": 6
    },
    {
        "id": "news [CTWANT]-14",
        "name": "news [CTWANT]-14",
        "series": "news [CTWANT]",
        "category": "14",
        "value": 6
    },
    {
        "id": "news [CTWANT]-15",
        "name": "news [CTWANT]-15",
        "series": "news [CTWANT]",
        "category": "15",
        "value": 5
    },
    {
        "id": "news [CTWANT]-16",
        "name": "news [CTWANT]-16",
        "series": "news [CTWANT]",
        "category": "16",
        "value": 6
    },
    {
        "id": "news [CTWANT]-17",
        "name": "news [CTWANT]-17",
        "series": "news [CTWANT]",
        "category": "17",
        "value": 2
    },
    {
        "id": "news [CTWANT]-18",
        "name": "news [CTWANT]-18",
        "series": "news [CTWANT]",
        "category": "18",
        "value": 9
    },
    {
        "id": "news [CTWANT]-19",
        "name": "news [CTWANT]-19",
        "series": "news [CTWANT]",
        "category": "19",
        "value": 11
    },
    {
        "id": "news [CTWANT]-20",
        "name": "news [CTWANT]-20",
        "series": "news [CTWANT]",
        "category": "20",
        "value": 3
    },
    {
        "id": "news [CTWANT]-21",
        "name": "news [CTWANT]-21",
        "series": "news [CTWANT]",
        "category": "21",
        "value": 4
    },
    {
        "id": "news [CTWANT]-22",
        "name": "news [CTWANT]-22",
        "series": "news [CTWANT]",
        "category": "22",
        "value": 0
    },
    {
        "id": "news [CTWANT]-23",
        "name": "news [CTWANT]-23",
        "series": "news [CTWANT]",
        "category": "23",
        "value": 1
    },
    {
        "id": "news [CTWANT]-24",
        "name": "news [CTWANT]-24",
        "series": "news [CTWANT]",
        "category": "24",
        "value": 4
    },
    {
        "id": "news [CTWANT]-25",
        "name": "news [CTWANT]-25",
        "series": "news [CTWANT]",
        "category": "25",
        "value": 3
    },
    {
        "id": "news [CTWANT]-26",
        "name": "news [CTWANT]-26",
        "series": "news [CTWANT]",
        "category": "26",
        "value": 6
    },
    {
        "id": "news [CTWANT]-27",
        "name": "news [CTWANT]-27",
        "series": "news [CTWANT]",
        "category": "27",
        "value": 1
    }
]

export default function SeriesPlotPage() {

  const domRef = useRef<HTMLDivElement | null>(null)
  const chartRef = useRef<OrbCharts | null>(null)

  useEffect(() => {
    
    // console.log(domRef.current)

    const rankedPlot = new RankedPlot({
        RankedBubbles: {
            // bubble: {
            //     showZeroValue: true
            // }
        },
        RankedSeriesAxis: {},
        CategoryAxis: {},
        CategoryZoom: {},
        categoryAxis: {
            position: 'top',
        },
        CategoryAux: {}
      // Bars: {},
      // Lines: {},
      // Dots: {},
      // ValueAxis: {},
      // CategoryAxis: {},
      // CategoryZoom: {},
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
      // // seriesLabels: [],
      // container: {
      //   columnAmount: 1,
      //   rowAmount: 1,
      //   columnGap: 'auto',
      //   rowGap: 'auto',
      // },
      // separateSeries: false,
      // datasetIndex: 0
    //   visibleFilter: (datum) => datum.value <= 5
    })

    const tooltip = new Tooltip()
    // tooltip.showOnly(['Tooltip'])

    const legend = new Legend()

    const chart = new OrbCharts(domRef.current!, {
      data: data,
      encoding: {
        
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
      plugins: [rankedPlot, tooltip, legend]
    })

    // seriesPlugin.updateParams({
    //   Pie: {
    //     outerRadius: 0.85,
    //     innerRadius: 0.5,
    //     outerRadiusWhileHighlight: 0.9,
    //     startAngle: 0,
    //     endAngle: 6.283185307179586,
    //     padAngle: 0,
    //     strokeColorType: "background",
    //     strokeWidth: 1,
    //     cornerRadius: 0
    //   },
    // })

    // seriesPlugin.showOnly(['Pie'])
    
    // chart.updateEncoding({})
    // chart.updateTheme({})
    // chart.setPlugins([seriesPlugin])
    // chart.setData(data)
    chart.context.gridData$.subscribe(data => {
      console.log('Grid Data Updated:', data)
    })
    
    console.log(chart)

  }, [])

  return <div ref={domRef}></div>
}