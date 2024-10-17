export function gameboxPictureGet(gamebox: GameBox) {
    const client = useSupabaseClient();
    const { data } = client.storage.from('gamebox-pics').getPublicUrl(gamebox.id.toString());
    return data.publicUrl ?? gamebox.photoUrl;
}