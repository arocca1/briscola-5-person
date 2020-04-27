import { combineReducers } from 'redux'
import gameTypesReducer from './gameTypesReducer'
import activeGameReducer from './activeGameReducer'

const rootReducer = combineReducers({
  gameTypesReducer,
  activeGameReducer,
})

export default rootReducer
