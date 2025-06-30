import { t } from 'i18next'
import { createContext, useEffect, useState } from 'react'
import { RouterProvider, createHashRouter } from 'react-router-dom'
import { DialogProvider } from './components/Dialog/Context'
import Dialog from './components/Dialog/Dialog'
import EditCardModal from './components/EditCardModal/EditCardModal'
import { EditCardModalProvider } from './components/EditCardModal/EditCardModalContext'
import { NotifyProvider, useNotify } from './components/Notify/Context'
import Notify from './components/Notify/Notify'
import PageLayout from './PageLayout'
import HomePage from './pages/Home'
import { requestCards, requestLists } from './requests'

const router = createHashRouter([
    {
        path: '/',
        element: <PageLayout />,
        children: [
            {
                index: true,
                element: <HomePage />,
            },
            {
                path: '/:cardId',
                element: <HomePage />,
            },
        ],
    },
])

export const DataContext = createContext()

export const DataProvider = ({ children }) => {
    const [cards, setCards] = useState([])
    const [cardsByList, setCardsByList] = useState([])
    const { notify } = useNotify()

    useEffect(() => {
        requestCards()
            .then((res) => res.json())
            .then((res) => {
                setCards(res.data.cards)
            })
            .catch((err) => {
                console.log(err)
                notify({
                    message: t('Unable to load the cards.'),
                    type: 'error',
                })
            })

        requestLists()
            .then((res) => res.json())
            .then((res) => {
                setCardsByList(res.data.lists)
            })
            .catch((err) => {
                console.log(err)
                notify({
                    message: t('Unable to load the lists.'),
                    type: 'error',
                })
            })
    }, [])

    return (
        <DataContext.Provider
            value={{
                cards,
                setCards: (newCards) => setCards(newCards),
                cardsByList,
                setCardsByList: (newLists) => setCardsByList(newLists),
            }}
        >
            {children}
        </DataContext.Provider>
    )
}

export default function App() {
    return (
        <NotifyProvider>
            <Notify />
            <DataProvider>
                <DialogProvider>
                    <Dialog />
                    <EditCardModalProvider>
                        <EditCardModal />
                        <RouterProvider router={router} />
                    </EditCardModalProvider>
                </DialogProvider>
            </DataProvider>
        </NotifyProvider>
    )
}
