import { createContext, useContext, useState, useEffect } from "react"

const AppContext = createContext()

const POINTS_RULES = {
    plastic: 10,
    paper: 5,
    metal: 15,
    cardboard: 8,
}

export function AppProvider({ children }) {
    const [pickupRequests, setPickupRequests] = useState(() => {
        const saved = localStorage.getItem("revalue_pickups")
        return saved ? JSON.parse(saved) : []
    })

    useEffect(() => {
        localStorage.setItem(
            "revalue_pickups",
            JSON.stringify(pickupRequests)
        )
    }, [pickupRequests])

    // Create new pickup request
    const createPickupRequest = (items, pickupDate) => {
        const newRequest = {
            id: Date.now(),
            items: items.map(item => ({
                ...item,
                actual: null,
            })),
            pickupDate,
            status: "scheduled",
            totalPoints: 0,
        }

        setPickupRequests(prev => [...prev, newRequest])
    }

    // Admin confirms actual weight
    const completePickup = (id, updatedItems) => {
        setPickupRequests(prev =>
            prev.map(req => {
                if (req.id !== id) return req

                const totalPoints = updatedItems.reduce((acc, item) => {
                    return acc + POINTS_RULES[item.type] * item.actual
                }, 0)

                return {
                    ...req,
                    items: updatedItems,
                    status: "completed",
                    totalPoints,
                }
            })
        )
    }

    // Derived values
    const totalPoints = pickupRequests
        .filter(req => req.status === "completed")
        .reduce((acc, req) => acc + req.totalPoints, 0)

    const treesPlanted = Math.floor(totalPoints / 100)

    return (
        <AppContext.Provider
            value={{
                pickupRequests,
                createPickupRequest,
                completePickup,
                totalPoints,
                treesPlanted,
            }}
        >
            {children}
        </AppContext.Provider>
    )
}

export function useApp() {
    return useContext(AppContext)
}