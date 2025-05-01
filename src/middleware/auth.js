const TTL = 3600000 // 1 hour in milliseconds
const USER_SESSION_CONTEXT = "userSession"

export const getUserSession = () => {
  try {
    const encodedSession = localStorage.getItem(USER_SESSION_CONTEXT)
    if (!encodedSession) return null

    const decodedSession = atob(encodedSession)
    const session = JSON.parse(decodedSession)
    const { expires } = session

    if (Date.now() > expires) {
      localStorage.removeItem(USER_SESSION_CONTEXT)
      return null
    }
    return session
  } catch (error) {
    console.log("Error retrieving user session:", error)
    return null
  }
}

export const setUserSession = user => {
  try {
    const encodedSession = btoa(
      JSON.stringify({ ...user, expires: Date.now() + TTL })
    )
    localStorage.setItem(USER_SESSION_CONTEXT, encodedSession)
  } catch (error) {
    console.log("Error storing user session:", error)
  }
}

export const removeUserSession = () => {
  try {
    localStorage.removeItem(USER_SESSION_CONTEXT)
  } catch (error) {
    console.log("Error removing user session:", error)
  }
}
