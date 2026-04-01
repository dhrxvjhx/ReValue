export const LEVELS = [
    { level: 1, min: 0, max: 100, title: "Starter" },
    { level: 2, min: 100, max: 300, title: "Recycler" },
    { level: 3, min: 300, max: 700, title: "Eco Hero" },
    { level: 4, min: 700, max: 1200, title: "Green Warrior" },
    { level: 5, min: 1200, max: 2000, title: "Sustainability Pro" },
    { level: 6, min: 2000, max: 3000, title: "Planet Guardian" },
    { level: 7, min: 3000, max: 4000, title: "Earth Protector" },
    { level: 8, min: 4000, max: 5000, title: "Climate Champion" },
    { level: 9, min: 5000, max: 7000, title: "Eco Legend" },
    { level: 10, min: 7000, max: 10000, title: "Savior of Earth 🌍" },
];

export const BADGES = [
    // 🔥 PICKUP BASED
    {
        id: "first",
        label: "First Pickup",
        icon: "🥇",
        condition: ({ pickups }) => pickups >= 1,
    },
    {
        id: "five",
        label: "5 Pickups",
        icon: "🔥",
        condition: ({ pickups }) => pickups >= 5,
    },
    {
        id: "ten",
        label: "10 Pickups",
        icon: "🚀",
        condition: ({ pickups }) => pickups >= 10,
    },
    {
        id: "twenty",
        label: "20 Pickups",
        icon: "💪",
        condition: ({ pickups }) => pickups >= 20,
    },

    // 💯 POINT BASED
    {
        id: "points100",
        label: "100 Points",
        icon: "💯",
        condition: ({ points }) => points >= 100,
    },
    {
        id: "points500",
        label: "500 Points",
        icon: "⭐",
        condition: ({ points }) => points >= 500,
    },
    {
        id: "points1000",
        label: "1000 Points",
        icon: "🌟",
        condition: ({ points }) => points >= 1000,
    },
    {
        id: "points3000",
        label: "3000 Points",
        icon: "🏆",
        condition: ({ points }) => points >= 3000,
    },

    // 🌱 TREE BASED
    {
        id: "tree1",
        label: "First Tree",
        icon: "🌱",
        condition: ({ trees }) => trees >= 1,
    },
    {
        id: "tree5",
        label: "5 Trees",
        icon: "🌳",
        condition: ({ trees }) => trees >= 5,
    },
    {
        id: "tree10",
        label: "10 Trees",
        icon: "🌲",
        condition: ({ trees }) => trees >= 10,
    },

    // ⚡ CONSISTENCY / ADVANCED
    {
        id: "ecoStreak",
        label: "Eco Starter",
        icon: "⚡",
        condition: ({ pickups }) => pickups >= 3,
    },
    {
        id: "hardcore",
        label: "Hardcore Recycler",
        icon: "🔥🔥",
        condition: ({ pickups, points }) => pickups >= 15 && points >= 1000,
    },
    {
        id: "legend",
        label: "Legend",
        icon: "👑",
        condition: ({ pickups, points, trees }) =>
            pickups >= 25 && points >= 3000 && trees >= 5,
    },
];