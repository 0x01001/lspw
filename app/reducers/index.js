import { combineReducers } from 'redux'
import auth from './auth'
import main from './main'

export default combineReducers({
  auth,
  main,
})
