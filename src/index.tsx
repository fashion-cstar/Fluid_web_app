import React from 'react'
import ReactDOM from 'react-dom'
import "./tailwind.output.css"
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import { SessionProvider } from 'contexts'
import {  
  ProcessingProvider
} from 'contexts'
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <SessionProvider>
        <ProcessingProvider>
          <GoogleReCaptchaProvider reCaptchaKey={process.env.REACT_APP_RECAPTCHA_KEY}>
            <App />
          </GoogleReCaptchaProvider>
        </ProcessingProvider>
      </SessionProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
)
