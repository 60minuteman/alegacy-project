'use client'

import './globals.css'
import { fraunces, dmSans } from './fonts'
import { Provider } from 'react-redux'
import { store } from '../store/store'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${dmSans.variable}`}>
      <body>
        <Provider store={store}>
          {children}
        </Provider>
      </body>
    </html>
  )
}