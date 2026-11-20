"use client"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { axiosdata } from "@utils/axiosUrl"
import { useState } from "react"

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
  return <main className="mx-auto mt-20 w-[94%] max-w-5xl pb-20">
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div><p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Community</p><h1 className="mt-2 text-3xl font-bold">Housing conversations that help.</h1><p className="mt-2 text-muted-foreground">Share practical experiences, questions, and neighborhood knowledge.</p></div>
      <button onClick={() => setFormOpen((value) => !value)} className="rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground">{formOpen ? "Close" : "Create post"}</button>
    </div>
    {formOpen && <form onSubmit={createPost} className="mb-8 grid gap-3 rounded-2xl border border-border/60 bg-background p-5 shadow-sm"><input required placeholder="Post title" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} className="rounded-xl border border-border bg-transparent p-3" /><select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} className="rounded-xl border border-border bg-transparent p-3"><option value="general">General</option><option value="housing">Housing</option><option value="student-life">Student life</option><option value="neighborhoods">Neighborhoods</option></select><textarea required placeholder="Write your post" value={form.content} onChange={(event) => setForm({ ...form, content: event.target.value })} className="min-h-40 rounded-xl border border-border bg-transparent p-3" /><button className="rounded-xl bg-primary px-4 py-3 font-semibold text-primary-foreground">Publish</button></form>}
    <div className="grid gap-4 md:grid-cols-2">{data?.map((post: any) => <Link href={`/community/${post._id}`} key={post._id} className="rounded-2xl border border-border/60 bg-background p-5 transition hover:border-primary/50"><span className="text-xs font-semibold uppercase tracking-wide text-primary">{post.category}</span><h2 className="mt-2 text-xl font-bold">{post.title}</h2><p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">{post.content}</p><p className="mt-4 text-xs text-muted-foreground">By {post.author?.username || "First Estates user"}</p></Link>)}</div>
    {!data?.length && <p className="rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground">No community posts yet.</p>}
  </main>
}
