import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { Hub } from "nerdy-lib";

createRoot(document.getElementById('root')).render(
  <Hub>
	  <App />
  </Hub>
)
