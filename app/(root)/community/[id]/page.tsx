"use client"
import { useParams, useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { axiosdata } from "@utils/axiosUrl"
import { useState } from "react"

export default function CommunityPostPage() {
  const { id } = useParams()
  const router = useRouter()
  const [reporting, setReporting] = useState(false)
  const { data, isLoading } = useQuery({ queryKey: ["community", id], queryFn: () => axiosdata.value.get(`/api/community/${id}`).then((response) => response.data.post), enabled: !!id })
  if (isLoading) return <main className="mx-auto mt-28 w-[92%] max-w-3xl animate-pulse"><div className="h-10 rounded bg-muted" /></main>
  if (!data) return <main className="mx-auto mt-28 w-[92%] max-w-3xl text-center">Post not found.</main>
  const report = async () => { setReporting(true); await axiosdata.value.post(`/api/community/${id}/report`); setReporting(false) }
  return <main className="mx-auto mt-20 w-full max-w-5xl overflow-x-hidden px-4 pb-24 sm:mt-24 sm:px-8 lg:px-12"><span className="text-xs font-semibold uppercase tracking-wide text-primary">{data.category}</span><h1 className="mt-4 break-words text-3xl font-bold sm:text-5xl">{data.title}</h1><p className="mt-4 text-sm text-muted-foreground">By {data.author?.username}</p><article className="mt-8 max-w-full overflow-hidden whitespace-pre-wrap break-words rounded-2xl border border-border/60 bg-background p-6 text-base leading-8 sm:mt-10 sm:p-10">{data.content}</article><div className="mt-6 flex flex-wrap gap-3"><button disabled={reporting} onClick={report} className="rounded-xl border border-destructive/40 px-4 py-2 text-sm text-destructive">{reporting ? "Reporting..." : "Report post"}</button><button onClick={() => router.push("/community")} className="rounded-xl border border-border px-4 py-2 text-sm">Back to community</button></div></main>
}
