import { configureStore } from '@reduxjs/toolkit'

import gameBoardReducer from './gameBoardSlice'

export default configureStore({
  reducer: {
    gameBoard: gameBoardReducer,
  },
})