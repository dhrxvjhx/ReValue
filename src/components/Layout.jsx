import { Outlet, useLocation } from "react-router-dom"
import { motion } from "framer-motion"
import BottomNav from "./BottomNav"

function Layout() {
    const location = useLocation()

    return (
        <div className="
      min-h-[100dvh]
      bg-gradient-to-b from-[#0B1120] to-[#0E1629]
      text-white
      flex flex-col
      overflow-x-hidden
    ">
            <motion.div
                key={location.pathname}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="
          flex-1
          px-4
          pt-6
          pb-28
          max-w-md
          mx-auto
          w-full
        "
            >
                <Outlet />
            </motion.div>

            <BottomNav />
        </div>
    )
}

export default Layout