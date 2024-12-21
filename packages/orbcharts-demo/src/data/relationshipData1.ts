import type { DataRelationship } from "@orbcharts/core-types"

export default <DataRelationship>{
  "nodes": [
    {
      "id": "id0",
      "label": "label0",
      "value": 19800000,
      "categoryLabel": "category1"
    },
    {
      "id": "id1",
      "value": 0,
      "categoryLabel": "category2"
    },
    {
      "id": "id2",
      "value": 0,
      "categoryLabel": "category2"
    },
    {
      "id": "id3",
      "label": "label1",
      "value": 5114269,
      "categoryLabel": "category1"
    },
    {
      "id": "id4",
      "label": "label2",
      "value": 1093200,
      "categoryLabel": "category1"
    },
    {
      "id": "id5",
      "label": "label3",
      "value": 32007217,
      "categoryLabel": "category1"
    },
    {
      "id": "id6",
      "value": 0,
      "categoryLabel": "category2"
    },
    {
      "id": "id7",
      "label": "label4",
      "value": 18743266,
      "categoryLabel": "category1"
    },
    {
      "id": "id8",
      "value": 0,
      "categoryLabel": "category2"
    },
    {
      "id": "id9",
      "label": "label5",
      "value": 1000000,
      "categoryLabel": "category1"
    },
    {
      "id": "id10",
      "value": 0,
      "categoryLabel": "category2"
    },
    {
      "id": "id11",
      "label": "label6",
      "value": 4631703,
      "categoryLabel": "category1"
    },
    {
      "id": "id12",
      "value": 0,
      "categoryLabel": "category2"
    },
    {
      "id": "id13",
      "label": "label7",
      "value": 3399144,
      "categoryLabel": "category1"
    }
  ],
  "edges": [
    {
      "id": "id14",
      "label": "label8",
      "categoryLabel": "category2",
      "start": "id5",
      "end": "id0",
      "value": 100
    },
    {
      "id": "id15",
      "label": "",
      "categoryLabel": "category2",
      "start": "id5",
      "end": "id3",
      "value": 100
    },
    {
      "id": "id16",
      "label": "",
      "categoryLabel": "category2",
      "start": "id5",
      "end": "id4",
      "value": 50
    },
    {
      "id": "id17",
      "label": "",
      "categoryLabel": "category2",
      "start": "id11",
      "end": "id5",
      "value": 20.752235715203
    },
    {
      "id": "id18",
      "label": "",
      "categoryLabel": "category2",
      "start": "id7",
      "end": "id5",
      "value": 27.472781543551
    },
    {
      "id": "id19",
      "label": "",
      "categoryLabel": "category1",
      "start": "id6",
      "end": "id5",
      "value": 0
    },
    {
      "id": "id20",
      "label": "",
      "categoryLabel": "category1",
      "start": "id1",
      "end": "id5",
      "value": 0
    },
    {
      "id": "id21",
      "label": "",
      "categoryLabel": "category1",
      "start": "id8",
      "end": "id5",
      "value": 0
    },
    {
      "id": "id22",
      "label": "",
      "categoryLabel": "category1",
      "start": "id12",
      "end": "id5",
      "value": 0
    },
    {
      "id": "id23",
      "label": "",
      "categoryLabel": "category2",
      "start": "id11",
      "end": "id7",
      "value": 100
    },
    {
      "id": "id24",
      "label": "",
      "categoryLabel": "category2",
      "start": "id0",
      "end": "id9",
      "value": 100
    },
    {
      "id": "id25",
      "label": "",
      "categoryLabel": "category1",
      "start": "id10",
      "end": "id11",
      "value": 29.495571697929
    },
    {
      "id": "id26",
      "label": "label20",
      "categoryLabel": "category1",
      "start": "id2",
      "end": "id11",
      "value": 20.208972073742
    },
    {
      "id": "id27",
      "label": "",
      "categoryLabel": "category2",
      "start": "id5",
      "end": "id13",
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
    categoryLabel: isNaN(d['source-uniID']) === false ? 'category2' : 'category1',
    start: d['source-uniID'],
    end: d['target-uniID'],
    value: d.percentage
  }
})
*/

/*
function anonymizeData(data) {
    let idMap = new Map();
    let labelMap = new Map();
    let idCounter = 0;
    let labelCounter = 0;

    function getIdReplacement(id) {
        if (!idMap.has(id)) {
            idMap.set(id, `id${idCounter++}`);
        }
        return idMap.get(id);
    }

    function getLabelReplacement(label) {
        if (!labelMap.has(label)) {
            labelMap.set(label, `label${labelCounter++}`);
        }
        return labelMap.get(label);
    }

    // Anonymize nodes
    data.nodes.forEach((node) => {
        node.id = getIdReplacement(node.id);
        if (node.label) {
            node.label = getLabelReplacement(node.label);
        }
    });

    // Anonymize edges
    data.edges.forEach((edge) => {
        edge.id = getIdReplacement(edge.id);
        edge.start = getIdReplacement(edge.start);
        edge.end = getIdReplacement(edge.end);
        if (edge.label) {
            edge.label = getLabelReplacement(edge.label);
        }
    });

    return data;
}


console.log(JSON.stringify(anonymizeData(data), null, 2));
*/