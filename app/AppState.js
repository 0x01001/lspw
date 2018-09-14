import { observable, action } from 'mobx'

class AppState {
  @observable internetConnect = 'online' // online || offline

  @action setInternetConnect = (val) => { this.internetConnect = val }
}

export default new AppState()
