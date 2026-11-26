"use client"
import { AudioLines, Pause, Play } from "lucide-react"
import { useEffect, useRef, useState } from "react"
type Props = { url: string; duration?: number; waveform?: number[]; outgoing: boolean }
const time = (value: number) => `${Math.floor(Math.max(0, value) / 60)}:${String(Math.floor(Math.max(0, value) % 60)).padStart(2, "0")}`
export default function VoiceMessageBubble({ url, duration = 0, waveform = [], outgoing }: Props) {
  const audio = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [current, setCurrent] = useState(0)
  const [length, setLength] = useState(duration)
  const seeking = useRef(false)
  const bars = waveform.length ? waveform : Array.from({ length: 36 }, (_, i) => 0.25 + ((i * 17) % 70) / 100)
  useEffect(() => { const node = audio.current; if (!node) return; const tick = () => setCurrent(node.currentTime); const loaded = () => setLength(Number.isFinite(node.duration) ? node.duration : duration); const ended = () => { setPlaying(false); setCurrent(0) }; const failed = () => setPlaying(false); const stopOther = (event: Event) => { if ((event as CustomEvent<HTMLAudioElement>).detail !== node) { node.pause(); setPlaying(false) } }; node.addEventListener("timeupdate", tick); node.addEventListener("loadedmetadata", loaded); node.addEventListener("ended", ended); node.addEventListener("error", failed); window.addEventListener("chat-voice-play", stopOther); return () => { node.pause(); node.removeEventListener("timeupdate", tick); node.removeEventListener("loadedmetadata", loaded); node.removeEventListener("ended", ended); node.removeEventListener("error", failed); window.removeEventListener("chat-voice-play", stopOther) } }, [duration])
  const toggle = async () => { const node = audio.current; if (!node) return; if (node.paused) { window.dispatchEvent(new CustomEvent("chat-voice-play", { detail: node })); try { await node.play(); setPlaying(true) } catch { setPlaying(false) } } else { node.pause(); setPlaying(false) } }
  const seek = (event: React.PointerEvent<HTMLDivElement>) => { const node = audio.current; if (!node) return; const box = event.currentTarget.getBoundingClientRect(); node.currentTime = Math.min(1, Math.max(0, (event.clientX - box.left) / box.width)) * (length || 1); setCurrent(node.currentTime) }
  const startSeek = (event: React.PointerEvent<HTMLDivElement>) => { seeking.current = true; event.currentTarget.setPointerCapture(event.pointerId); seek(event) }
  const moveSeek = (event: React.PointerEvent<HTMLDivElement>) => { if (seeking.current) seek(event) }
  const endSeek = () => { seeking.current = false }
  const progress = (current / (length || 1)) * 100
  return <div className="flex min-w-[230px] items-center gap-3 rounded-2xl px-2 py-1"><audio data-chat-voice ref={audio} src={url} preload="metadata" /><button type="button" onClick={toggle} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/20" aria-label={playing ? "Pause voice message" : "Play voice message"}>{playing ? <Pause size={17} /> : <Play size={17} className="ml-0.5" />}</button><div className="min-w-0 flex-1"><div className="flex h-9 cursor-pointer touch-none items-center gap-[2px]" onPointerDown={startSeek} onPointerMove={moveSeek} onPointerUp={endSeek} onPointerCancel={endSeek} role="slider" aria-label="Seek voice message" aria-valuenow={current} aria-valuemin={0} aria-valuemax={length} tabIndex={0}>{bars.map((height, index) => <span key={index} className={`w-[3px] rounded-full ${outgoing ? "bg-white/90" : "bg-primary/75"}`} style={{ height: `${Math.max(20, height * 100)}%`, opacity: index / bars.length * 100 <= progress ? 1 : 0.35 }} />)}</div><div className="flex items-center justify-between text-[10px] opacity-75"><span><AudioLines size={11} className="mr-1 inline" />{time(current)}</span><span>{time(length)}</span></div></div></div>
}
