import { useContext, useEffect, useRef, useState } from 'react'
import { requestCreateList, requestUpdateList } from '../../requests'
import List from './components/List'
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { Trans } from 'react-i18next'
import { useTranslation } from 'react-i18next'
import { useDialog } from '../../components/Dialog/Context'
import { DataContext } from '../../App'
import { ListState } from '../../constants'
import { useNotify } from '../../components/Notify/Context'
import { Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useCardModal } from '../../components/EditCardModal/EditCardModalContext'

export default function HomePage () {
    const { t } = useTranslation()
    const newListNameInput = useRef()
    const { cardsByList, setCardsByList } = useContext(DataContext)
    const [showNewListform, setShowNewListForm] = useState(false)
    const [newListLoadingState, setNewListLoadingState] = useState(false)
    const { openDialog } = useDialog()
    const { notify } = useNotify()
    const routeParams = useParams()
    const navigate = useNavigate()
    const { showCard } = useCardModal()

    useEffect(() => {
        if ('cardId' in routeParams) {
            showCard(routeParams.cardId, () => navigate('/'))
        }
    }, [routeParams])

    function handleArchiveList (listId) {
        openDialog({
            content: t('Do you really want to archive this list?'),
            onConfirmClick: () => {
                requestUpdateList({ listId: listId, state: ListState.ARCHIVED })
                    .then(res => res.json())
                    .then(res => {
                        if (res.success) {
                            const modifiedCardIndex = cardsByList.findIndex(list => parseInt(list.id) === parseInt(listId))
                            cardsByList[modifiedCardIndex].state = ListState.ARCHIVED
                            setCardsByList(cardsByList)

                            notify({ message: t('List archived successfully.') })

                            return
                        } else {
                            notify({
                                message: t('Unable to archive the list. Please, see the logs.'),
                                type: 'error'
                            })
                        }
                    })
                    .catch(err => {
                        console.log(err)

                        notify({
                            message: t('Unable to archive the list. Please, see the logs.'),
                            type: 'error'
                        })
                    })
            }
        })
    }

    function handleAddNewListBtnClick () {
        const newListName = newListNameInput.current.value

        if (!newListName.length > 0) {
            return
        }

        setNewListLoadingState(true)

        requestCreateList(newListName)
            .then(res => res.json())
            .then(res => {
                setCardsByList([...cardsByList, res.data.list])
            })
            .catch(err => {
                console.log(err)
            })
            .finally(() => {
                setNewListLoadingState(false)
                newListNameInput.current.value = ''
                setShowNewListForm(false)
            })
    }

    function handleShowNewListForm () {
        setShowNewListForm(!showNewListform)

        if (!showNewListform) {
            setTimeout(() => newListNameInput.current.focus(), 1)
        }
    }

    function handleNewListNameInputOnKeyDown (event) {
        if (event.key !== 'Enter') {
            return
        }

        handleAddNewListBtnClick()
    }

    const inProgressLists = cardsByList.filter(list => parseInt(list.state) === ListState.IN_PROGRESS)

    return (
        <div className='lkn-flex lkn-gap-4 lkn-h-full lkn-w-full'>
            {inProgressLists.map(list => (
                <List
                    key={list.id}
                    id={list.id}
                    name={list.name}
                    handleArchiveList={handleArchiveList}
                    cards={list.cards}
                />
            ))}
            <div className='lkn-w-[260px] lkn-max-w-[260px] lkn-min-w-[260px] lkn-flex lkn-flex-col lkn-gap-5 lkn-h-full lkn-max-h-full'>
                <button onClick={handleShowNewListForm} className='lkn-group/list-header lkn-w-full lkn-flex lkn-items-center lkn-justify-stretch lkn-gap-2 lkn-text-gray-500 lkn-text-base lkn-py-1 lkn-px-2 hover:lkn-bg-gray-100 lkn-text-left lkn-rounded lkn-transition-colors'>
                    {
                        showNewListform ? (
                            <>
                                <p className='lkn-grow lkn-font-medium'><Trans>Cancel</Trans></p>
                                <XMarkIcon width={20} height={20} />
                            </>
                        ) : (
                            <>
                                <p className='lkn-grow lkn-font-medium'><Trans>Add list</Trans></p>
                                <PlusIcon width={20} height={20} />
                            </>
                        )
                    }
                </button>

                {
                    showNewListform && (
                        <div className='lkn-flex lkn-flex-col lkn-gap-4 lkn-max-h-[calc(100%-150px)] lkn-overflow-y-scroll lkn-pr-1'>
                            <div className='lkn-flex lkn-flex-col lkn-gap-4 lkn-text-gray-700 lkn-text-sm lkn-border lkn-border-gray-300 lkn-rounded lkn-p-4'>
                                <input
                                    id="search-client-input"
                                    ref={newListNameInput}
                                    type="text"
                                    maxLength="50"
                                    minLength={1}
                                    className="lkn-p-2 lkn-w-full lkn-text-gray-800 lkn-bg-neutral-100 lkn-rounded lkn-outline-none lkn-bg-transparent disabled:lkn-bg-gray-100"
                                    autoComplete="off"
                                    placeholder={t('Type the list name')}
                                    onKeyDown={handleNewListNameInputOnKeyDown}
                                    disabled={newListLoadingState}
                                />
                                <button onClick={handleAddNewListBtnClick} disabled={newListLoadingState} className='lkn-bg-gray-200 lkn-py-2 lkn-font-medium lkn-rounded hover:lkn-bg-gray-300 active:lkn-bg-gray-400 disabled:lkn-bg-gray-300 lkn-transition-colors'><Trans>Add list</Trans></button>
                            </div>
                        </div>
                    )
                }
            </div>
        </div >
    )
}
