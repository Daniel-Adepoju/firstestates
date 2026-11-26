"use client"

import { useEffect, useRef, useState } from "react"
import { CalendarDays, Clock3, Info, Loader2, Plus, Search } from "lucide-react"
import Link from "next/link"
import AppointmentCard from "@components/agent/AppointmentCard"
import ManageAppointment from "@components/agent/ManageAppointment"
import PopularCard from "@components/listing/PopularCard"
import Searchbar from "@components/Searchbar"
import ScrollController from "@components/ScrollController"
import { Skeleton } from "@components/ui/skeleton"
import { Button } from "@components/ui/button"
import { useGetAgentListingsInfinite, useGetAppointmentsInfinite } from "@lib/customApi"
import { useNextPage } from "@lib/useIntersection"
import { useUser } from "@utils/user"
import { AppointmentInfoModal } from "@components/Modals"

const Appointment = () => {
  const { session } = useUser()
  const [search, setSearch] = useState("")
  const [debounced, setDebounced] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)
  const appointmentInfoRef = useRef<HTMLDialogElement>(null)
  const {
    data: listings,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useGetAgentListingsInfinite({
    id: session?.user.id || "",
    enabled: !!session?.user.id,
    page: "1",
    limit: 10,
    school: debounced,
    location: debounced,
  })
  const appointmentsQuery = useGetAppointmentsInfinite({ limit: 10 })
  const appointments = appointmentsQuery.data?.pages?.[0]
  const nextListingRef = useNextPage({ isLoading, hasNextPage, fetchNextPage })
  const nextAppointmentRef = useNextPage(appointmentsQuery)

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebounced(search)
      scrollRef.current?.scrollTo({ left: 0, behavior: "smooth" })
    }, 350)
    return () => clearTimeout(timeoutId)
  }, [search])

  const listingCards = listings?.pages?.flatMap((item: any) =>
    item.listings.map((listing: Listing, index: number) => (
      <PopularCard
        key={listing._id}
        listing={listing}
        type="appointment"
        showPopular={false}
        refValue={index === item.listings.length - 1 ? nextListingRef : null}
      />
    )),
  )

  return (
    <main className="mx-auto w-[90%]  space-y-12 pb-14">
      {/* Header */}
      <header className="mx-auto rounded-3xl border border-border/70 bg-linear-to-br from-primary/12 via-background to-background p-6 shadow-sm sm:p-8">
        <div className="flex flex-col  justify-between gap-5 md:flex-row">
          <div>
            <p className="mb-3 text-sm font-semibold text-primary">Appointment workspace</p>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Manage your property tours.
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
              Schedule viewings, respond to client requests, and keep every property appointment
              organized.
            </p>
          </div>
          <Button
            asChild
            className="shrink-0 rounded-xl"
          >
            <Link href="#schedule">
              <Plus className="size-4" /> Schedule a tour
            </Link>
          </Button>
        </div>
        <div className="mt-6 grid gap-3 border-t border-border/60 pt-5 sm:grid-cols-3">
          <div className="flex items-center gap-3 rounded-2xl bg-background/70 p-3">
            <CalendarDays className="size-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Pipeline</p>
              <p className="font-semibold">
                {appointments?.numberOfAppointments || 0} appointments
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl bg-background/70 p-3">
            <Clock3 className="size-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Next tour</p>
              <p className="font-semibold">
                {appointments?.nextAppointment
                  ? new Date(appointments.nextAppointment).toLocaleDateString()
                  : "Nothing scheduled"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl bg-background/70 p-3">
            <Info className="size-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Workflow</p>
              <p className="font-semibold">Request → confirm → meet</p>
            </div>
          </div>
        </div>
      </header>

      <ManageAppointment
        nextAppointment={appointments?.nextAppointment}
        numberOfAppointments={appointments?.numberOfAppointments}
        lastAppointment={appointments?.lastAppointment}
      />

      <section
        id="schedule"
        className="w-full scroll-mt-6 space-y-6 px-2.5 "
      >
        <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
              Create an appointment
            </p>
            <h2 className="mt-1 text-xl font-bold tracking-tight">Choose a listing to schedule</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Search by school or location, then choose a date and visit type.
            </p>
          </div>

          <Searchbar
            search={search}
            setSearch={(event) => setSearch(event.target.value)}
            placeholder="Search listings"
            className="w-[98%] flex gap-1 lg:max-w-sm"
          />
        </div>
        <div className="ml-auto flex justify-end w-28 px-1">
           <ScrollController
          scrollRef={scrollRef}
        />
        </div>

        <div
          ref={scrollRef}
          className="scrollbar-thin flex min-h-72 gap-5 overflow-x-auto px-1 pb-4 [scrollbar-color:var(--color-border)_transparent]"
        >
          {isLoading
            ? Array.from({ length: 5 }).map((_, index) => (
                <Skeleton
                  key={index}
                  className="h-64 min-w-56 shrink-0 rounded-2xl"
                />
              ))
            : listingCards}
          {isFetchingNextPage && (
            <Loader2 className="my-auto size-6 shrink-0 animate-spin text-muted-foreground" />
          )}
          {!isLoading && !listingCards?.length && (
            <div className="flex min-h-40 w-full items-center justify-center rounded-2xl border border-dashed text-sm text-muted-foreground">
              <Search className="mr-2 size-4" /> No matching listings
            </div>
          )}
        </div>
      </section>

      {/*  Appointments pipeline */}
      <section className="space-y-6 px-2.5">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="mt-1 text-xl font-bold tracking-tight">
              {"Appointments & Tours"}
            </h2>
                  <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-xl my-1"
            onClick={() => appointmentInfoRef.current?.showModal()}
          >
            <Info className="size-4" /> How it works
          </Button>
          </div>

        </div>
        <div className="space-y-5">
          {appointmentsQuery.isLoading
            ? Array.from({ length: 3 }).map((_, index) => (
                <Skeleton
                  key={index}
                  className="h-32 rounded-2xl"
                />
              ))
            : appointmentsQuery.data?.pages
                ?.flatMap((page: any) => page.posts || [])
                .map((item: any) => (
                  <AppointmentCard
                    key={item._id}
                    data={item}
                  />
                ))}
          <div
            ref={nextAppointmentRef}
            className="h-2"
          />
          {appointmentsQuery.isFetchingNextPage && (
            <div className="flex justify-center py-4">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
          )}
          {!appointmentsQuery.isLoading &&
            !appointmentsQuery.data?.pages?.some((page: any) => page.posts?.length) && (
              <div className="rounded-2xl border border-dashed p-10 text-center text-sm text-muted-foreground">
                No appointments yet. Choose a listing above to schedule the first tour.
              </div>
            )}
        </div>
      </section>
      <AppointmentInfoModal ref={appointmentInfoRef} />
    </main>
  )
}

export default Appointment
