
export const useDefaultPage = () => {
  const router = useRouter();

  const route = router.getRoutes().find(item => item.name === 'gatherings-root');
  const ret = { ...route, params: { clubname: 'terra' } };
  return ret;
}
