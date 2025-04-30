import { Ratelimit } from "@upstash/ratelimit";

import redis from "./redis";

 const ratelimit = new Ratelimit({
    redis: redis,
    limiter: Ratelimit.fixedWindow(10, "100s"),
    analytics: true,
    prefix: "@upstash/ratelimit",
})

export default ratelimit