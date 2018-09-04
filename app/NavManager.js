import { observable, action } from 'mobx';
import { NavigationActions } from 'react-navigation';

class ObservableNavManager {
  @observable.ref
  navigator = null;
  @observable.ref
  loading = null;

  showLoading() {
    this.loading && this.loading.show();
  }

  hideLoading() {
    this.loading && this.loading.hide();
  }

  @action
  goBack() {
    this.navigator.dispatch(NavigationActions.back());
  }
}

const NavManager = new ObservableNavManager();
export default NavManager;
