import logger from '@/utils/logger.js'

class ClusterNode {
  constructor (type, onchange, onmessage) {
    logger.info(`Create a new cluster for ${type}`)
    this.worker = new Worker('./worker.js')

    // register the web worker with corresponding type
    this.worker.postMessage({
      sessionCode: 0,
      content: {
        type: type
      }
    })

    // register the callback function if defined any
    if (onchange) {
      this.worker.onchange = onchange
    }
    if (onmessage) {
      this.worker.onmessage = onmessage
    }
  }

  // The function to bind the different callback function for worker
  on (type, callback) {
    this.worker[type] = callback
  }
}

export default ClusterNode
