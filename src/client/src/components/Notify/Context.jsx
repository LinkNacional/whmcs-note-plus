import { createContext, useState, useContext } from 'react'

const NotifyContext = createContext()

export const NotifyProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([])

    const removeNotification = (notificationToRemove) => {
        setNotifications((prevNotifications) =>
            prevNotifications.filter((notification) => notification !== notificationToRemove)
        )
    }

    const notify = ({ message, type = 'success' }) => {
        const notifConfig = { message, type }

        setNotifications((prevNotifications) => [...prevNotifications, notifConfig])
        setTimeout(() => {
            removeNotification(notifConfig)
        }, 2500)
    }

    return (
        <NotifyContext.Provider value={{ notifications, notify }}>
            {children}
        </NotifyContext.Provider>
    )
}

export const useNotify = () => {
    const context = useContext(NotifyContext)

    if (!context) {
        throw new Error('useNotify must be used within a NotifyProvider')
    }

    return context
}
