"use client"
import { useState } from "react"
import { CalendarDays, X } from "lucide-react"
import { axiosdata } from "@utils/axiosUrl"
import { useToast } from "@utils/Toast"

export default function ListingTourActionBar({ listing, session }: any) {
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const { setToastValues } = useToast()
  if (!session?.user || session.user.id === listing?.agent?._id || listing?.status !== "available") return null
  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    setSubmitting(true)
    try {
      await axiosdata.value.post("/api/listings/appointment", { listingID: listing._id, date, appointmentType: "initial" })
      setToastValues({ isActive: true, status: "success", message: "Tour request sent to the agent", duration: 2500 })
      setOpen(false)
    } catch (error: any) {
      setToastValues({ isActive: true, status: "danger", message: error?.response?.data?.error || "Unable to request a tour", duration: 3000 })
    } finally { setSubmitting(false) }
  }
  return <>
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border/70 bg-background/95 p-3 shadow-2xl backdrop-blur md:sticky md:bottom-4 md:mx-auto md:mt-6 md:w-[min(92%,720px)] md:rounded-2xl md:border">
      <div className="mx-auto flex max-w-xl items-center gap-2"><button onClick={() => setOpen(true)} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground"><CalendarDays size={18} />Book a tour</button><a href={`tel:${listing?.agent?.phone}`} className="rounded-xl border border-border px-4 py-3 text-sm font-semibold">Call agent</a></div>
    </div>
    {open && <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-3 md:items-center"><form onSubmit={submit} className="w-full max-w-md rounded-2xl bg-background p-5 shadow-xl"><div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-bold">Request a property tour</h2><button type="button" onClick={() => setOpen(false)} aria-label="Close"><X /></button></div><label className="text-sm font-semibold" htmlFor="tour-date">Preferred date and time</label><input required id="tour-date" type="datetime-local" value={date} min={new Date().toISOString().slice(0, 16)} onChange={(event) => setDate(event.target.value)} className="mt-2 w-full rounded-xl border border-border bg-transparent p-3" /><button disabled={submitting} className="mt-5 w-full rounded-xl bg-primary px-4 py-3 font-semibold text-primary-foreground">{submitting ? "Sending..." : "Send tour request"}</button></form></div>}
  </>
}
