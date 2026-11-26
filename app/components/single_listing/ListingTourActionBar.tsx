"use client"
import { useState } from "react"
import { format, startOfToday } from "date-fns"
import { Calendar as CalendarIcon, X } from "lucide-react"
import { axiosdata } from "@utils/axiosUrl"
import { useToast } from "@utils/Toast"
import { Button } from "@components/ui/button"
import { Calendar } from "@components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@components/ui/popover"

export default function ListingTourActionBar({ listing, session, children }: any) {
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState<Date>()
  const [time, setTime] = useState("09:00")
  const [submitting, setSubmitting] = useState(false)
  const { setToastValues } = useToast()
  if (
    !session?.user ||
    String(session.user.id) === String(listing?.agent?._id) ||
    listing?.status !== "available"
  )
    return null
  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!date) return
    setSubmitting(true)
    try {
      await axiosdata.value.post("/api/listings/appointment", {
        listingID: listing._id,
        date: `${format(date, "yyyy-MM-dd")}T${time}`,
        appointmentType: "initial",
      })
      setToastValues({
        isActive: true,
        status: "success",
        message: "Tour request sent to the agent",
        duration: 2500,
      })
      setOpen(false)
    } catch (error: any) {
      setToastValues({
        isActive: true,
        status: "danger",
        message: error?.response?.data?.error || "Unable to request a tour",
        duration: 3000,
      })
    } finally {
      setSubmitting(false)
    }
  }
  return (
    <>
      {children?.({ open: () => setOpen(true), submitting })}
      {open && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-slate-950/60 p-3 backdrop-blur-sm md:items-center">
          <form
            onSubmit={submit}
            className="w-full max-w-md rounded-[1.75rem] border border-border/70 bg-background p-5 text-foreground shadow-2xl sm:p-7"
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
                  Listing tour
                </p>
                <h2 className="mt-1 text-xl font-bold">Request a property tour</h2>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close tour request"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-muted-foreground transition hover:text-foreground"
              >
                <X size={19} />
              </button>
            </div>
            <label
              className="text-sm font-semibold"
              htmlFor="tour-date"
            >
              Preferred date
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="tour-date"
                  type="button"
                  variant="outline"
                  className="mt-2 h-auto w-full justify-start rounded-xl p-3 text-left font-normal"
                >
                  <CalendarIcon className="mr-2" />
                  {date ? format(date, "PPP") : "Choose a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="z-[70] w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={{ before: startOfToday() }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <label className="mt-4 block text-sm font-semibold" htmlFor="tour-time">
              Preferred time
            </label>
            <input
              required
              id="tour-time"
              type="time"
              value={time}
              onChange={(event) => setTime(event.target.value)}
              className="mt-2 w-full rounded-xl border border-border bg-transparent p-3 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
            />
            <button
              disabled={submitting || !date}
              className="mt-5 w-full rounded-2xl bg-primary px-4 py-3 font-semibold text-primary-foreground transition hover:brightness-110 disabled:cursor-wait disabled:opacity-60"
            >
              {submitting ? "Sending..." : "Send tour request"}
            </button>
          </form>
        </div>
      )}
    </>
  )
}
