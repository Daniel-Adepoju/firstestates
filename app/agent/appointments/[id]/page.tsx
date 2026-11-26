"use client"

import { useState } from "react"
import { CalendarDays, ChevronLeft, Info, Loader2 } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { format, startOfToday } from "date-fns"
import { useGetSingleListing } from "@lib/customApi"
import { axiosdata } from "@utils/axiosUrl"
import { Button } from "@components/ui/button"
import { Calendar } from "@components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@components/ui/popover"

const SetAppointmentForListing = () => {
  const router = useRouter(); const params = useParams(); const queryClient = useQueryClient(); const id = params?.id as string
  const [appointmentType, setAppointmentType] = useState(""); const [clientName, setClientName] = useState(""); const [date, setDate] = useState<Date>(); const [warning, setWarning] = useState("")
  const { data, isLoading } = useGetSingleListing(id, true)
  const mutation = useMutation({ mutationFn: async () => axiosdata.value.post("/api/listings/appointment", { appointmentType, clientName: clientName.trim(), date, listingID: id }), onSuccess: (response) => { if (response.status === 201) { queryClient.invalidateQueries({ queryKey: ["appointments"] }); router.back() } }, onError: (error: any) => setWarning(error?.response?.data?.error || "Unable to create this appointment") })
  const submit = (event: React.FormEvent) => { event.preventDefault(); if (!appointmentType || !clientName.trim() || !date) { setWarning("Choose a visit type, client name, and date"); return }; setWarning(""); mutation.mutate() }
  if (isLoading) return <div className="flex min-h-80 items-center justify-center"><Loader2 className="size-7 animate-spin text-muted-foreground" /></div>
  return <main className="mx-auto grid w-full max-w-5xl gap-6 pb-10 lg:grid-cols-[0.85fr_1.15fr]">
    <section className="rounded-3xl border bg-gradient-to-br from-primary/[0.12] via-background to-background p-6 shadow-sm sm:p-8"><Button variant="ghost" className="mb-10 -ml-3" onClick={() => router.back()}><ChevronLeft className="size-4" /> Back to appointments</Button><p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">New appointment</p><h1 className="mt-2 text-3xl font-bold tracking-tight">Schedule a property tour.</h1><p className="mt-3 text-sm leading-6 text-muted-foreground">Create the same kind of appointment a client can request from a listing. Add their details and a preferred date so the next step is clear.</p><div className="mt-8 rounded-2xl border bg-background/70 p-4 text-sm leading-6"><Info className="mr-2 inline size-4 text-primary" /> A tour request stays connected to this listing and appears in your appointments pipeline.</div></section>
    <form onSubmit={submit} className="space-y-6 rounded-3xl border bg-card p-6 shadow-sm sm:p-8"><div><h2 className="text-xl font-bold">Tour details</h2><p className="mt-1 text-sm text-muted-foreground">A few details are all you need to get it on the calendar.</p></div>
      <div className="space-y-2"><label htmlFor="visit-type" className="text-sm font-semibold">Appointment type</label><select id="visit-type" required value={appointmentType} onChange={(event) => setAppointmentType(event.target.value)} className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus:ring-4 focus:ring-primary/10"><option value="">Choose an appointment type</option><option value="tour">Property tour</option><option value="initial">Initial visit</option><option value="revisit">Revisit</option><option value="final">Final visit</option></select></div>
      <div className="space-y-2"><label htmlFor="client-name" className="text-sm font-semibold">Client name</label><input id="client-name" required value={clientName} onChange={(event) => setClientName(event.target.value)} placeholder="e.g. Ada Okafor" className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus:ring-4 focus:ring-primary/10" /></div>
      <div className="space-y-2"><label className="text-sm font-semibold">Preferred date</label><Popover><PopoverTrigger asChild><Button type="button" variant="outline" className="h-11 w-full justify-start rounded-xl font-normal"><CalendarDays className="mr-2 size-4" />{date ? format(date, "PPP") : "Choose a date"}</Button></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={date} onSelect={setDate} disabled={{ before: startOfToday() }} initialFocus /></PopoverContent></Popover></div>
      {warning && <p className="rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">{warning}</p>}
      <Button type="submit" disabled={mutation.isPending} className="h-11 w-full rounded-xl">{mutation.isPending ? <><Loader2 className="size-4 animate-spin" /> Creating appointment</> : "Create appointment"}</Button>
    </form>
  </main>
}

export default SetAppointmentForListing
