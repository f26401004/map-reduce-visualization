const { reduce } = require("core-js/fn/array")

let number = 0
let clusterNum = 1
let type = 'word-count'
let phase = 'waiting'
let data = {
  raw: [],
  mapped: [],
  shuffled: [],
  reduced: []
}

/**
 * sessionCode
 * 0: initialization
 * 1: receive raw data from manager
 * 2: start mapping
 * 3: send mapping result to manager
 * 4: receive assigned data for shuffling from manager
 * 5: start shuffling
 * 6: deliver shuffled data to corresponding cluster through manager
 * 7: receive assigned data for redeucing from manager
 * 8: start reducing
 * 9: send reduce result to manager
 */

onmessage = function (e) {
  switch (e.data.sessionCode) {
    case 0: // initialization
      initialization(e.data.content.type, e.data.content.number)
      break
    case 1: // receive raw data
      phase = 'pre-map'
      receiveData('raw', e.data.content)
    case 2: // map
      phase = 'mapping'
      data['mapped'] = map(type)
      break
    case 4: // receive assigned data for shuffling
      phase = 'pre-shuffle'
      receiveData('shuffled', e.data.content)
      break
    case 5: // shuffling
      phase = 'shuffling'
      shuffle(type)
    case 7: // receive assigned data for reducing
      phase = 'pre-reduce'
      receiveData('reduced', e.data.content)
      break
    case 8: // reducing
      phase = 'reducing'
      reduce(type)
  }
}


function initialization (type = 'word-count', number = 0) {
  type = type
  number = number
}

function receiveData (type, data) {
  data[type] = data
}

/**
 * Map related function below
 */

function map (type) {
  const mapResult = mapWord(data)
  // set the current phase from mapping to post-map 
  phase = 'post-map'
  // send the map result to the manager
  postMessage({
    sessionCode: 3,
    content: {
      phase: 'post-map',
      result: mapResult
    }
  })
}

function mapWord (data) {
  const result = {}
  for (let i = 0; i < data.length; ++i) {
    if (data[i] in result) {
      result[data[i]].count += 1
      result[data[i]].indexes.push(i)
    } else {
      result[data[i]] = {
        count: 1,
        indexes: [i]
      }
    }
  }
  return result
}
/**
 * Shuffle related function below
 */

function shuffle () {
  if (clusterNum === 1) {
    // send the shuffle result to the manager direclty
    postMessage({
      sessionCode: 3,
      content: {
        phase: 'post-shuffle',
        result: mapResult
      }
    })
    return
  }
  // compute the range with cluster num
  const range = Math.floor(26 / clusterNum)
  let startChar = 'a'
  let endChar = String.fromCharCode('a'.charCodeAt(0) + range)
  for (let i = 0; i < clusterNum; ++i) {
    // use regular expression to filter out the data
    const re = new RegExp(`^[${startChar}-${endChar}${startChar.toUpperCase()}-${endChar.toUpperCase()}]+`)
    const filtered = data['shuffled'].filter(target => re.test(target))
    if (i === number) {
      data['reduced'] = filtered
    } else {
      // deliver the filtered group data to corresponding cluster
      postMessage({
        sessionCode: 6,
        content: {
          shuffled: filtered,
          targetClusterNumber: i
        }
      })
    }

    // recompute the start and enc char for regular expression
    startChar = String.fromCharCode(endChar.charCodeAt(0) + 1)
    endChar = i === clusterNum - 2
      ? 'z'
      : String.fromCharCode(startChar.charCodeAt(0) + range)
  }

  // set the current phase from mapping to post-map 
  phase = 'post-shuffle'
  // send the map result to the manager
  postMessage({
    sessionCode: 3,
    content: {
      phase: 'post-shuffle',
      result: mapResult
    }
  })
}

/**
 * Reduce related function below
 */

function reduce (type) {
  let reduceResult
  switch (type) {
    case 'word-count':
      reduceResult = reduceWordCount(data)
      break
    case 'word-search':
      reduceResult = reduceWordSearch(data)
      break
  }
  // set the current phase from mapping to post-map 
  phase = 'post-map'
  // send the map result to the manager
  postMessage({
    sessionCode: 9,
    content: {
      phase: 'post-reduce',
      result: reduceResult
    }
  })
}
