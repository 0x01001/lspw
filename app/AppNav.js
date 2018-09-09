import { observable, action } from 'mobx'
import { NavigationActions } from 'react-navigation'

class ObservableNav {
  @observable.ref
  navigator = null;
  @observable.ref
  loading = null;
  @observable.ref
  import = null;
  showLoading() {
    this.loading && this.loading.show()
  }

  hideLoading() {
    this.loading && this.loading.hide()
  }

  showImport() {
    this.import && this.import.show()
  }

  hideImport() {
    this.import && this.import.hide()
  }

  @action
  goBack() {
    this.navigator.dispatch(NavigationActions.back())
  }
}

const AppNav = new ObservableNav()
export default AppNav
