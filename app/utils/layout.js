import { getStatusBarHeight } from 'react-native-status-bar-height'
import { Dimensions, Platform } from 'react-native'
import { LayoutProvider } from 'recyclerlistview'

const { width, height } = Dimensions.get('window')
const isIPX = height === 812

export default class LayoutUtils {
  static getWindowWidth() {
    // To deal with precision issues on android
    // return Math.round(Dimensions.get('window').width * 1000) / 1000 - 6 // Adjustment for margin given to RLV;
    return width
  }

  static getExtraTop() {
    return getStatusBarHeight()
  }

  static getExtraTopAndroid() {
    return Platform.OS === 'android' ? getStatusBarHeight() : 0
  }

  static getExtraBottom() {
    return 0
  }

  static isLongScreenAndroid() {
    return Platform.OS === 'android' && width / height < 0.5625
  }

  static get heightNotif() {
    return isIPX ? 84 : 60
  }

  static isSmallScreen() {
    return height < 569
  }

  static getLayoutProvider(type) {
    switch (type) {
      default:
        return new LayoutProvider(
          () => 'VSEL',
          (type, dim) => {
            switch (type) {
              case 'VSEL':
                dim.width = this.getWindowWidth()
                dim.height = 66
                break
              default:
                dim.width = 0
                dim.heigh = 0
            }
          }
        )
    }
  }
}
