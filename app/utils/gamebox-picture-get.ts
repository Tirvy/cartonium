export async function gameboxPictureGet(gamebox: GameBox) {
  const publicUrl = `/gamebox-pics/${gamebox.id}`
  try {
    const resp = await fetch(publicUrl, { method: 'HEAD' })
    if (!resp.ok) {
      return gamebox.photoUrl
    }
    return publicUrl
  } catch {
    return gamebox.photoUrl
  }
}
