const tracker: { [ip: string]: { count: number; resetTime: number } } = {}

/**
 * Lightweight in-memory rate limiter for server routes
 * @param ip IP address of the requester
 * @param limit Maximum allowed requests in the window
 * @param windowMs Time window in milliseconds (default 1 minute)
 */
export function rateLimit(ip: string, limit = 60, windowMs = 60000): boolean {
  const now = Date.now()
  
  if (!tracker[ip]) {
    tracker[ip] = {
      count: 1,
      resetTime: now + windowMs,
    }
    return true
  }

  const record = tracker[ip]
  
  if (now > record.resetTime) {
    record.count = 1
    record.resetTime = now + windowMs
    return true
  }

  if (record.count >= limit) {
    return false
  }

  record.count++
  return true
}
