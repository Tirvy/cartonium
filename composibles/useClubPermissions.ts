
export default function () {
  return useState<number[]>('clubPermissions', () => {
    return [];
  })
}