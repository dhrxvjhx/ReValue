import { createContext, useContext, useState, useEffect } from "react"

const AppContext = createContext()

const POINTS_RULES = {
    plastic: 10,
    paper: 5,
    metal: 15,
}

export function AppProvider({ children }) {
    const [submissions, setSubmissions] = useState(() => {
        const saved = localStorage.getItem("revalue_submissions")
        return saved ? JSON.parse(saved) : []
    })

    const [points, setPoints] = useState(() => {
        const saved = localStorage.getItem("revalue_points")
        return saved ? JSON.parse(saved) : 0
    })

    useEffect(() => {
        localStorage.setItem(
            "revalue_submissions",
            JSON.stringify(submissions)
        )
        localStorage.setItem("revalue_points", JSON.stringify(points))
    }, [submissions, points])

    const addSubmission = (type, quantity) => {
        const pts = POINTS_RULES[type] * quantity

        const newSubmission = {
            id: Date.now(),
            type,
            quantity,
            pointsEarned: pts,
            date: new Date().toISOString(),
            status: "approved",
        }

        setSubmissions(prev => [...prev, newSubmission])
        setPoints(prev => prev + pts)
    }

    const treesPlanted = Math.floor(points / 100)

    return (
        <AppContext.Provider
            value={{
                submissions,
                points,
                treesPlanted,
                addSubmission,
            }}
        >
            {children}
        </AppContext.Provider>
    )
}

export function useApp() {
    return useContext(AppContext)
}