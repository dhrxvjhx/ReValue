import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import App from "./App"
import { AppProvider } from "./context/AppContext"
import { AuthProvider } from "./context/AuthContext"
import "./index.css"
import { Toaster } from "react-hot-toast"

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <AppProvider>
        <App />
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "#111827",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.1)"
            }
          }}
        />
      </AppProvider>
    </AuthProvider>
  </BrowserRouter>
)