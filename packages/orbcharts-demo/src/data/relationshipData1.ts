import type { DataRelationship } from "@orbcharts/core-types"

export default <DataRelationship>{
  nodes: [
    {
        "id": "80641013",
        "label": "豪潔實業股份有限公司",
        "value": 19800000,
        "categoryLabel": "法人"
    },
    {
        "id": "唐麗芬",
        "value": 0,
        "categoryLabel": "自然人"
    },
    {
        "id": "蔡德忠",
        "value": 0,
        "categoryLabel": "自然人"
    },
    {
        "id": "45110360",
        "label": "杏州醫藥股份有限公司",
        "value": 5114269,
        "categoryLabel": "法人"
    },
    {
        "id": "53836726",
        "label": "多寧生技股份有限公司",
        "value": 1093200,
        "categoryLabel": "法人"
    },
    {
        "id": "86649006",
        "label": "杏一醫療用品股份有限公司",
        "value": 32007217,
        "categoryLabel": "法人"
    },
    {
        "id": "曾盛誠",
        "value": 0,
        "categoryLabel": "自然人"
    },
    {
        "id": "28776432",
        "label": "麗德投資股份有限公司",
        "value": 18743266,
        "categoryLabel": "法人"
    },
    {
        "id": "李弘暉",
        "value": 0,
        "categoryLabel": "自然人"
    },
    {
        "id": "42750428",
        "label": "創晟國際股份有限公司",
        "value": 1000000,
        "categoryLabel": "法人"
    },
    {
        "id": "陳麗如",
        "value": 0,
        "categoryLabel": "自然人"
    },
    {
        "id": "83204178",
        "label": "軒如股份有限公司",
        "value": 4631703,
        "categoryLabel": "法人"
    },
    {
        "id": "黃成業",
        "value": 0,
        "categoryLabel": "自然人"
    },
    {
        "id": "53842500",
        "label": "精贊生技股份有限公司",
        "value": 3399144,
        "categoryLabel": "法人"
    }
],
  edges: [
    {
        "id": "86649006->80641013",
        "label": "86649006->80641013",
        "categoryLabel": "自然人",
        "start": "86649006",
        "end": "80641013",
        "value": 100
    },
    {
        "id": "86649006->45110360",
        "label": "86649006->45110360",
        "categoryLabel": "自然人",
        "start": "86649006",
        "end": "45110360",
        "value": 100
    },
    {
        "id": "86649006->53836726",
        "label": "86649006->53836726",
        "categoryLabel": "自然人",
        "start": "86649006",
        "end": "53836726",
        "value": 50
    },
    {
        "id": "83204178->86649006",
        "label": "83204178->86649006",
        "categoryLabel": "自然人",
        "start": "83204178",
        "end": "86649006",
        "value": 20.752235715203
    },
    {
        "id": "28776432->86649006",
        "label": "28776432->86649006",
        "categoryLabel": "自然人",
        "start": "28776432",
        "end": "86649006",
        "value": 27.472781543551
    },
    {
        "id": "曾盛誠->86649006",
        "label": "曾盛誠->86649006",
        "categoryLabel": "法人",
        "start": "曾盛誠",
        "end": "86649006",
        "value": 0
    },
    {
        "id": "唐麗芬->86649006",
        "label": "唐麗芬->86649006",
        "categoryLabel": "法人",
        "start": "唐麗芬",
        "end": "86649006",
        "value": 0
    },
    {
        "id": "李弘暉->86649006",
        "label": "李弘暉->86649006",
        "categoryLabel": "法人",
        "start": "李弘暉",
        "end": "86649006",
        "value": 0
    },
    {
        "id": "黃成業->86649006",
        "label": "黃成業->86649006",
        "categoryLabel": "法人",
        "start": "黃成業",
        "end": "86649006",
        "value": 0
    },
    {
        "id": "83204178->28776432",
        "label": "83204178->28776432",
        "categoryLabel": "自然人",
        "start": "83204178",
        "end": "28776432",
        "value": 100
    },
    {
        "id": "80641013->42750428",
        "label": "80641013->42750428",
        "categoryLabel": "自然人",
        "start": "80641013",
        "end": "42750428",
        "value": 100
    },
    {
        "id": "陳麗如->83204178",
        "label": "陳麗如->83204178",
        "categoryLabel": "法人",
        "start": "陳麗如",
        "end": "83204178",
        "value": 29.495571697929
    },
    {
        "id": "蔡德忠->83204178",
        "label": "蔡德忠->83204178",
        "categoryLabel": "法人",
        "start": "蔡德忠",
        "end": "83204178",
        "value": 20.208972073742
    },
    {
        "id": "86649006->53842500",
        "label": "86649006->53842500",
        "categoryLabel": "自然人",
        "start": "86649006",
        "end": "53842500",
        "value": 100
    }
]
}

/*
toOldFormatV4

let nodes = data.nodes.map((d, i) => {
  return {
    id: d.uniID,
    label: d.company_name,
    value: d.detail && d.detail.payload && d.detail.payload.basic && d.detail.payload.basic.shareholders
      ? d.detail.payload.basic.shareholders.reduce((prev, current) => current.stocks + prev, 0)
        : 0,
    categoryLabel: d.role ? d.role : ''
  }
})
let edges = data.edges.map((d, i) => {
  return {
    id: d.id,
    label: d.id,
    categoryLabel: isNaN(d['source-uniID']) === false ? '自然人' : '法人',
    start: d['source-uniID'],
    end: d['target-uniID'],
    value: d.percentage
  }
})
*/