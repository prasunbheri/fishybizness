export const MAX_CONCURRENT_IMAGES = 4

let active = 0
const queue = []

export function loadImage(src, { onLoad, onError } = {}) {
  let cancelled = false
  let started = false
  let done = false
  const image = new Image()

  const pump = () => {
    while (active < MAX_CONCURRENT_IMAGES && queue.length > 0) {
      const job = queue.shift()
      job.start()
    }
  }

  const finish = (ok) => {
    if (done) return
    done = true
    active = Math.max(0, active - 1)
    if (!cancelled) {
      if (ok) onLoad?.()
      else onError?.()
    }
    pump()
  }

  const start = () => {
    if (cancelled) return
    started = true
    active++
    image.onload = () => finish(true)
    image.onerror = () => finish(false)
    image.src = src
  }

  if (active < MAX_CONCURRENT_IMAGES) {
    start()
  } else {
    queue.push({ start })
  }

  return () => {
    cancelled = true
    image.onload = null
    image.onerror = null
    if (!done) {
      if (started) active = Math.max(0, active - 1)
      done = true
      pump()
    }
    image.src = ''
  }
}
