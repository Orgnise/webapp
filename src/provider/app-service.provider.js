import React, { createContext } from 'react'
import AppService from '../service/app-service'

const AppServiceContext = createContext(null)
AppServiceContext.displayName = 'AppServiceContext'

export { AppServiceContext }

const AppServiceProvider = ({ children }) => {
  const appService = new AppService()

  return (
    <AppServiceContext.Provider value={appService}>
      {children}
    </AppServiceContext.Provider>
  )
}

export default AppServiceProvider
