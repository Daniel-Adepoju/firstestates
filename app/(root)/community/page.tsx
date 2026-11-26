"use client"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { axiosdata } from "@utils/axiosUrl"
import { useState } from "react"
// use infinite loader for community, maybe an algorithm to boot
export default function CommunityPage() {
  const [formOpen, setFormOpen] = useState(false)
  const [form, setForm] = useState({ title: "", content: "", category: "general" })
  const { data, refetch } = useQuery({ queryKey: ["community"], queryFn: () => axiosdata.value.get("/api/community").then((response) => response.data.posts) })
  const createPost = async (event: React.FormEvent) => {
    event.preventDefault()
    await axiosdata.value.post("/api/community", form)
    setForm({ title: "", content: "", category: "general" })
    setFormOpen(false)
    refetch()
  }
  return <main className="mx-auto mt-16 w-full max-w-7xl overflow-x-hidden px-4 pb-24 sm:mt-20 sm:px-8 lg:px-12">
    <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
      <div className="min-w-0"><p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Community</p><h1 className="mt-2 break-words text-3xl font-bold sm:text-4xl">Housing conversations that help.</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">Share practical experiences, questions, and neighborhood knowledge.</p></div>
      <button onClick={() => setFormOpen((value) => !value)} className="rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground">{formOpen ? "Close" : "Create post"}</button>
    </div>
    {formOpen && <form onSubmit={createPost} className="mb-10 grid gap-5 rounded-2xl border border-border/60 bg-background p-5 shadow-sm sm:p-8"><input required placeholder="Post title" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} className="box-border min-w-0 rounded-xl border border-border bg-transparent p-4 outline-none focus:border-primary" /><select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} className="box-border min-w-0 rounded-xl border border-border bg-background p-4 outline-none focus:border-primary"><option value="general">General</option><option value="housing">Housing</option><option value="student-life">Student life</option><option value="neighborhoods">Neighborhoods</option></select><textarea required placeholder="Write your post" value={form.content} onChange={(event) => setForm({ ...form, content: event.target.value })} className="box-border min-h-48 max-h-96 min-w-0 resize-none overflow-y-auto rounded-xl border border-border bg-transparent p-4 leading-7 outline-none focus:border-primary" /><button className="w-full rounded-xl bg-primary px-4 py-3 font-semibold text-primary-foreground sm:w-fit sm:px-6">Publish</button></form>}
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">{data?.map((post: any) => <Link href={`/community/${post._id}`} key={post._id} className="rounded-2xl border border-border/60 bg-background p-6 transition hover:border-primary/50 hover:shadow-sm"><span className="text-xs font-semibold uppercase tracking-wide text-primary">{post.category}</span><h2 className="mt-3 text-xl font-bold">{post.title}</h2><p className="mt-3 line-clamp-4 text-sm leading-7 text-muted-foreground">{post.content}</p><p className="mt-6 text-xs text-muted-foreground">By {post.author?.username || "First Estates user"}</p></Link>)}</div>
    {!data?.length && <p className="rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground">No community posts yet.</p>}
  </main>
}
