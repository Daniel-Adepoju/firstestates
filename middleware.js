import { NextRequest, NextResponse } from "next/server";
import {analytics} from '@/utils/analytics'
export default async function middleware (req) {
  if(req.nextUrl.pathname === '/re') {
  try {
     analytics.track('pageview', {
        page:'/'
     })
  } catch(err) {
    console.log(err)
  }
}
  return NextResponse.next()
}











// export { auth as middleware } from "@auth";