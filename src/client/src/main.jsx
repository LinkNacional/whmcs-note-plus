// import React from 'react'
import ReactDOM from 'react-dom/client'
import './assets/index.css'
import '../i18n'
import App from './App'

if (!document.getElementById('lknnoteplus')) {
    const divElement = document.createElement('div')
    divElement.id = 'lknnoteplus'

    document.body.appendChild(divElement)
}

ReactDOM.createRoot(document.getElementById("lknnoteplus")).render(<App />)
