
export const useDefaultPage = () => {
  const router = useRouter();

  const route = router.getRoutes().find(item => item.name === 'gatherings-public');
  const ret = { ...route, params: { clubname: 'terra' } };
  return ret;
}
