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

    const [redeemedPoints, setRedeemedPoints] = useState(() => {
        const saved = localStorage.getItem("revalue_redeemed")
        return saved ? JSON.parse(saved) : 0
    })

    useEffect(() => {
        localStorage.setItem(
            "revalue_redeemed",
            JSON.stringify(redeemedPoints)
        )
    }, [redeemedPoints])

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
                    const weight = Number(item.actual) || 0
                    return acc + POINTS_RULES[item.type] * weight
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

    const availablePoints = totalPoints - redeemedPoints
    const treesPlanted = Math.floor(totalPoints / 100)

    const getLevel = (points) => {
        if (points < 200) return { level: 1, title: "Beginner 🌱" }
        if (points < 500) return { level: 2, title: "Eco Warrior 🌿" }
        if (points < 1000) return { level: 3, title: "Green Champion 🌳" }
        return { level: 4, title: "Planet Guardian 🌍" }
    }

    const userLevel = getLevel(totalPoints)

    const redeemReward = (cost) => {
        if (availablePoints < cost) {
            alert("Not enough points!")
            return
        }

        setRedeemedPoints((prev) => prev + cost)
    }
    return (
        <AppContext.Provider
            value={{
                pickupRequests,
                createPickupRequest,
                completePickup,
                totalPoints,
                availablePoints,
                treesPlanted,
                userLevel,
                redeemReward,
                redeemedPoints
            }}
        >
            {children}
        </AppContext.Provider>
    )
}

export function useApp() {
    return useContext(AppContext)
}