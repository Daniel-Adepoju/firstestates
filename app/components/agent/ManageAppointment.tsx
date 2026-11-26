import { CalendarCheck2, CalendarClock, History } from "lucide-react"
import { parseDate, createdAt } from "@utils/date"
type Props = {
  nextAppointment?: Date | null
  numberOfAppointments?: number
  lastAppointment?: Date | null
}
const ManageAppointment = ({ nextAppointment, numberOfAppointments, lastAppointment }: Props) => (
  <section className="w-full grid gap-3  grid-cols-[repeat(auto-fit,minmax(250px,1fr))]">
    <div className="rounded-2xl border bg-card p-5 shadow-sm">
      <CalendarCheck2 className="mb-6 size-5 text-primary" />
      <p className="text-sm text-muted-foreground">Total appointments</p>
      <p className="mt-1 text-lg font-bold">{numberOfAppointments || 0}</p>
    </div>
    <div className="rounded-2xl border bg-card p-5 shadow-sm">
      <CalendarClock className="mb-6 size-5 text-emerald-600" />
      <p className="text-sm text-muted-foreground">Next tour</p>
      <p className="mt-1 truncate text-lg font-bold">
        {nextAppointment ? parseDate(nextAppointment) : "Nothing scheduled"}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">
        {nextAppointment ? createdAt(nextAppointment) : "Ready when you are"}
      </p>
    </div>
    <div className="rounded-2xl border bg-card p-5 shadow-sm">
      <History className="mb-6 size-5 text-muted-foreground" />
      <p className="text-sm text-muted-foreground">Last tour</p>
      <p className="mt-1 truncate text-lg font-bold">
        {lastAppointment ? parseDate(lastAppointment) : "No previous tours"}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">
        {lastAppointment ? createdAt(lastAppointment) : "Your history appears here"}
      </p>
    </div>
  </section>
)
export default ManageAppointment
