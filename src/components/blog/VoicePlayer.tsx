import { Pause, Play } from 'phosphor-react'
import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import WaveSurfer from 'wavesurfer.js'
import { API_ENDPOINT } from '../../constants/api'

interface Props {
  url: string
}

export default function VoicePlayer(props: Props) {
  const [wavesurferInstance, setWaveSurferInstance] = useState<
    WaveSurfer | null
  >(null)
  const [playing, setPlaying] = useState(false)
  const audioPreviewRef = useRef<HTMLDivElement>(null)
  const PlaybackButton = !playing ? Play : Pause
  const { id } = useParams()

  useEffect(() => {
    if (!audioPreviewRef.current) return
    const wavesurfer = WaveSurfer.create({
      container: audioPreviewRef.current,
      url: props.url,
      waveColor: '#379792',
      progressColor: '#1c5551',
      cursorColor: '#5f5bdb',
      autoplay: false,
      barGap: 2,
    })

    wavesurfer.once('interaction', () => {
      wavesurfer.play()
    })
    let countedStat = false
    wavesurfer.on('play', () => {
      setPlaying(true)
      if (!countedStat) {
        fetch(API_ENDPOINT + '/blog/played_podcast/' + id).then((r) => r.text())
        countedStat = true
      }
    })
    wavesurfer.on('pause', () => setPlaying(false))
    setWaveSurferInstance(wavesurfer)
    return () => {
      wavesurfer.destroy()
    }
  }, [audioPreviewRef])

  return (
    <div className='my-8 flex items-center gap-4 relative'>
      <button
        className='bg-white text-black hover:text-primaryBg border-none'
        onClick={() => wavesurferInstance?.playPause()}
      >
        <PlaybackButton size={48} weight='thin' />
      </button>
      <div className='w-full'>
        <div id='audio_preview' ref={audioPreviewRef} />
      </div>
    </div>
  )
}
