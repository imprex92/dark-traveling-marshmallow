import { useRouter } from "next/navigation"

export function closeSideNav() {
  var instance = M.Sidenav.getInstance(document.querySelector('.sidenav'))
  instance.close()
}

export async function handleLogout() {
  setError('')
  try {
    var instance = M.Sidenav.getInstance(document.querySelector('.sidenav'))
    instance.close()
    await logout()
  } catch {
    console.log(error)
    M.toast({ text: "We couldn't log you out!", error, classes: 'rounded' })
  }
}
export function handleNewPost() {
  var instance = M.Sidenav.getInstance(document.querySelector('.sidenav'))
  instance.close()
  useRouter().push('/user/newpost')
}
