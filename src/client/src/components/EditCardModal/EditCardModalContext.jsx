import { createContext, useState, useContext } from 'react'

const EditCardModalContext = createContext()

export const EditCardModalProvider = ({ children }) => {
    const [cardId, setCardId] = useState(null)
    const [onHideModal, setOnHideModal] = useState({ callback: null })

    function showCard (cardId, onHideModal = null) {
        setCardId(cardId)
        setOnHideModal({ callback: onHideModal })
    }

    function hideModal () {
        setCardId(null)

        if (onHideModal.callback) {
            onHideModal.callback()
        }
    }

    return (
        <EditCardModalContext.Provider value={{ cardId, showCard, hideModal }}>
            {children}
        </EditCardModalContext.Provider>
    )
}

export const useCardModal = () => {
    const context = useContext(EditCardModalContext)

    if (!context) {
        throw new Error('useNotify must be used within a EditCardModalProvider')
    }

    return context
}
