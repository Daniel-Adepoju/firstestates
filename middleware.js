import { NextRequest, NextResponse } from "next/server";
import {analytics} from '@/utils/analytics'
export default async function middleware (req) {
  if(req.nextUrl.pathname === '/') {
  try {
  await  analytics.track('pageview', {
        page:'/'
     })
  } catch(err) {
    console.log(err)
  }
} else if (req.nextUrl.pathname === '/agent') {
  try {
  await analytics.track('pageview', {
      page:'/agent'
    })
  } catch(err) {
    console.log(err)
  }
}
  return NextResponse.next()
}











// export { auth as middleware } from "@auth";