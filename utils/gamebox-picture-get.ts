export async function gameboxPictureGet(gamebox: GameBox) {
    const client = useSupabaseClient();
    const { data } = client.storage.from('gamebox-pics').getPublicUrl(gamebox.id.toString());
    const resp = await fetch(data.publicUrl);
    if (!resp.ok) {
        return gamebox.photoUrl;
    }
    return data.publicUrl;
}