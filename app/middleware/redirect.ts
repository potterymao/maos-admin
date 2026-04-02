const appStore = useAppStore();

export default function ({ redirect }: any) {
  if (appStore.firstPage) {
    // return navigateTo('/' + appStore.firstPage);
    return redirect('/' + appStore.firstPage);
  }
}