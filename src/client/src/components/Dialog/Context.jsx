import { createContext, useState, useContext } from 'react'

const DialogContext = createContext()

export function DialogProvider ({ children }) {
    const [dialogs, setDialogs] = useState([])

    /**
     * @type {Function}
     * @param {React.ReactNode} content
     * @param {() => void} onConfirmClick
     * @param {() => void} onCancelClick
     */
    const openDialog = ({ content, onConfirmClick = null, onCancelClick = null }) => {
        setDialogs((prevDialogs) => [...prevDialogs, { content, onConfirmClick, onCancelClick }])
    }

    const closeDialog = () => {
        setDialogs((prevDialogs) => prevDialogs.slice(0, -1))
    }

    return (
        <DialogContext.Provider value={{ dialogs, openDialog, closeDialog }}>
            {children}
        </DialogContext.Provider>
    )
}

export function useDialog () {
    const context = useContext(DialogContext)

    if (!context) {
        throw new Error('useDialog must be used within a DialogProvider')
    }

    return context
}
