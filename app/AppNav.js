import { observable, action } from 'mobx'
import { NavigationActions, DrawerActions, StackActions } from 'react-navigation'
import { DURATION } from '../app/components/common/Toast'

class ObservableNav {
  @observable.ref
  navigator = null;
  @observable.ref
  loading = null;
  // @observable.ref
  // import = null;
  @observable.ref
  toast = null;
  @observable.ref
  notify = null;

  cacheMsg = '';

  showLoading() {
    this.loading && this.loading.show()
  }

  hideLoading() {
    this.loading && this.loading.hide()
  }

  // showImport() {
  //   this.import && this.import.show()
  // }

  // hideImport() {
  //   this.import && this.import.hide()
  // }

  @action
  showToast(msg) {
    this.toast.show(msg, DURATION.SHORT)
    // if (this.cacheMsg === msg) {
    //   return
    // }
    // // console.log('show msg')
    // this.cacheMsg = msg
    // Toast.show(msg, {
    //   containerStyle: { borderRadius: 1 },
    //   opacity: 0.6,
    //   onHide: () => { this.cacheMsg = '' }
    // })
  }

  @action showNotify(content, style, styleText) {
    this.notify && this.notify.show(content, style, styleText)
  }

  @action
  closeMenu() {
    this.navigator.dispatch(DrawerActions.closeDrawer())
  }

  @action
  openMenu() {
    this.navigator.dispatch(DrawerActions.openDrawer())
  }

  // const prevGetStateForAction = this.navigator.router.getStateForAction;

  // this.navigator.router.getStateForAction = (action, state) => {
  //   // Do not allow to go back from Home
  //   if (action.type === 'Navigation/BACK' && state && state.routes[state.index].routeName === 'home') {
  //     return null;
  //   }

  //   // Do not allow to go back to Login
  //   if (action.type === 'Navigation/BACK' && state) {
  //     const newRoutes = state.routes.filter(r => r.routeName !== 'loginStack');
  //     const newIndex = newRoutes.length - 1;
  //     return prevGetStateForAction(action, { index: newIndex, routes: newRoutes });
  //   }
  //   return prevGetStateForAction(action, state);
  // };

  @action
  goBack() {
    this.navigator.dispatch(NavigationActions.back())
  }

  @action pushToScreen(routeName, params = null) {
    this.navigator.dispatch(NavigationActions.navigate({
      routeName,
      params
    }))
  }

  @action reset(routeName, params = null) {
    // const resetAction = {
    //   type: NavigationActions.NAVIGATE,
    //   routeName: 'mainStack',
    //   action: {
    //     type: NavigationActions.RESET,
    //     index: 0,
    //     actions: [{ type: NavigationActions.NAVIGATE, routeName: 'mainStack' }]
    //   }
    // }
    // this.navigator.dispatch(resetAction)
    const resetAction = StackActions.reset({
      index: 0,
      key: null, // black magic
      actions: [NavigationActions.navigate({ routeName, params })]
    })
    this.navigator.dispatch(resetAction)
  }

  // @action reset() {
  //   // This will reset back to loginStack
  //   // https://github.com/react-community/react-navigation/issues/1127
  //   const actionToDispatch = NavigationActions.reset({
  //     index: 0,
  //     key: null, // black magic
  //     actions: [NavigationActions.navigate({ routeName: 'loginStack' })]
  //   })
  //    this.navigator.dispatch(actionToDispatch)
  // }
}

const AppNav = new ObservableNav()
export default AppNav
