import { connectToDB } from "@utils/database"
import Inhabitant from "@models/inhabitant"
import { NextResponse } from "next/server"
import { auth } from "@auth"

export const DELETE = async (req, { params }) => {
  try {
    const inhabitantId = (await params).id
    const session = await auth()
    await connectToDB()
    const isAgent = await Inhabitant.findOne({ _id: inhabitantId, agent: session?.user?.id })
    if (!isAgent) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }
    await Inhabitant.findByIdAndDelete(inhabitantId)
    return NextResponse.json({ message: "Inhabitant deleted successfully" }, { status: 200 })
  } catch (err) {
    console.error("DELETE /inhabitant error:", err)
    return NextResponse.json({ message: "Failed to delete inhabitant" }, { status: 500 })
  }
}
