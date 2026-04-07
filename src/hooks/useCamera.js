import { useState, useRef, useCallback, useEffect } from 'react'

export function useCamera() {
  const videoRef = useRef(null)
  const [stream, setStream] = useState(null)
  const [active, setActive] = useState(false)
  const [countdown, setCountdown] = useState(null)

  // When stream changes, connect it to the video element
  // This runs AFTER React renders the video element
  useEffect(() => {
    const video = videoRef.current
    if (!video || !stream) return

    video.srcObject = stream
    
    // iOS Safari requires explicit play() call
    const playPromise = video.play()
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.warn('Video autoplay failed, retrying:', err)
        // Retry after a tick
        setTimeout(() => {
          video.play().catch(() => {})
        }, 100)
      })
    }

    return () => {
      video.srcObject = null
    }
  }, [stream])

  const start = useCallback(async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 1080 },
          height: { ideal: 1440 },
        },
      })
      // Just set the stream — the useEffect above handles connecting to video
      setStream(s)
      setActive(true)
      return true
    } catch (err) {
      console.error('Camera error:', err)
      return false
    }
  }, [])

  const stop = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(t => t.stop())
    }
    setStream(null)
    setActive(false)
  }, [stream])

  const capture = useCallback(() => {
    return new Promise((resolve) => {
      const video = videoRef.current
      if (!video || !stream) {
        resolve(null)
        return
      }

      setCountdown(3)
      let count = 3

      const timer = setInterval(() => {
        count--
        if (count <= 0) {
          clearInterval(timer)
          setCountdown(null)

          try {
            const w = video.videoWidth || 720
            const h = video.videoHeight || 960

            const canvas = document.createElement('canvas')
            canvas.width = w
            canvas.height = h
            canvas.getContext('2d').drawImage(video, 0, 0, w, h)

            // Stop stream before reading data
            stream.getTracks().forEach(t => t.stop())
            setStream(null)
            setActive(false)

            // Use toBlob for iOS compatibility, fallback to toDataURL
            canvas.toBlob(
              (blob) => {
                if (blob) {
                  const reader = new FileReader()
                  reader.onloadend = () => resolve(reader.result)
                  reader.onerror = () => resolve(canvas.toDataURL('image/jpeg', 0.85))
                  reader.readAsDataURL(blob)
                } else {
                  resolve(canvas.toDataURL('image/jpeg', 0.85))
                }
              },
              'image/jpeg',
              0.85
            )
          } catch (err) {
            console.error('Capture error:', err)
            stream.getTracks().forEach(t => t.stop())
            setStream(null)
            setActive(false)
            resolve(null)
          }
        } else {
          setCountdown(count)
        }
      }, 800)
    })
  }, [stream])

  return {
    videoRef,
    active,
    countdown,
    start,
    stop,
    capture,
  }
}
