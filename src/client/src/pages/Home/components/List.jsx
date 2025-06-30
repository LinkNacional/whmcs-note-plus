import { Trans } from 'react-i18next'
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/solid'
import { ArchiveBoxIcon } from '@heroicons/react/24/outline'
import { CloudArrowUpIcon } from '@heroicons/react/24/solid'
import NewCardSearch from './NewCardSearch'
import { useContext, useEffect, useRef, useState } from 'react'
import { requestArchivedCard, requestCreateCard, requestUpdateCard, requestUpdateList } from '../../../requests'
import { t } from 'i18next'
import { clickOutsideListener } from '../../../utils'
import Card from '../../../components/Card/Card'
import { useNotify } from '../../../components/Notify/Context'
import { CardState } from '../../../constants'
import { DataContext } from '../../../App'
import { useDialog } from '../../../components/Dialog/Context'

export default function List ({ id, name, handleArchiveList }) {
    const cardsContainer = useRef()
    const listRenameInput = useRef()
    const [displayNewCardLoading, setDisplayNewCardLoading] = useState(false)
    const [showAddCardBtn, setShowAddCardBtn] = useState(true)
    const [showNewCardSearch, setShowNewCardSearch] = useState(false)
    const [showRenameListIput, setShowRenameListInput] = useState(false)
    const [listName, updateListName] = useState(name)
    const { notify } = useNotify()
    const { cards, setCards } = useContext(DataContext)
    const { openDialog } = useDialog()

    function handleDisplayNewCardSearchClick () {
        setShowAddCardBtn(false)
        setShowNewCardSearch(true)
        setTimeout(() => {
            cardsContainer.current.scrollTop = cardsContainer.current.scrollHeight
        }, 100)
    }

    function handleNewCardClick (referId, referType) {
        setDisplayNewCardLoading(true)

        requestCreateCard(id, referId, referType)
            .then(res => res.json())
            .then(res => {
                setCards([...cards, res.data.card])
                setDisplayNewCardLoading(false)
            })
            .catch(err => {
                console.log(err)
            })
            .finally(() => {
                setShowAddCardBtn(true)
                setShowNewCardSearch(false)
            })
    }

    function handleRenameListOnClick () {
        setShowRenameListInput(true)
        setTimeout(() => {
            listRenameInput.current.focus()
            clickOutsideListener(listRenameInput.current, () => {
                setShowRenameListInput(false)
            })
        }, 1)

    }

    function handleSaveNewListName (event) {
        if (event.key !== 'Enter') {
            return
        }

        const newListName = listRenameInput.current.value

        if (!newListName > 0) {
            return
        }

        requestUpdateList({ listId: id, name: newListName })
            .then(res => res.json())
            .then(res => {
                updateListName(newListName)
            })
            .catch(err => {
                console.log(err)
            })
            .finally(() => {
                setShowRenameListInput(false)
            })
    }

    function handleOnArchiveCardClick (cardId) {
        openDialog({
            content: t('Do you really want to archive this card?'),
            onConfirmClick: () => {
                requestUpdateCard({ cardId, state: CardState.ARCHIVED })
                    .then(res => res.json())
                    .then(res => {
                        if (res.success) {
                            const modifiedCardIndex = cards.findIndex(card => parseInt(card.id) === parseInt(cardId))
                            cards[modifiedCardIndex].state = CardState.ARCHIVED

                            setCards(cards)

                            notify({ message: t('Card archived successfully.') })
                        } else {
                            notify({
                                message: t('Unable to archive the card. Please, see the logs.'),
                                type: 'error'
                            })
                        }
                    })
                    .catch(() => {
                        notify({
                            message: t('Unable to archive the card. Please, see the logs.'),
                            type: 'error'
                        })
                    })
            }
        })
    }

    const inProgressCards = cards.filter(card => parseInt(card.list_id) === parseInt(id) && parseInt(card.state) === CardState.IN_PROGRESS)

    return (
        <div className='lkn-w-[260px] lkn-max-w-[260px] lkn-min-w-[260px] lkn-flex lkn-flex-col lkn-gap-5 lkn-h-full lkn-max-h-full'>
            <div className='lkn-group/list-header lkn-w-full lkn-flex lkn-items-center lkn-justify-stretch lkn-gap-2 lkn-text-gray-500 lkn-text-base lkn-py-1 lkn-px-2'>
                {!showRenameListIput && <p className='lkn-grow lkn-font-medium lkn-h-[30px] lkn-cursor-text' onClick={handleRenameListOnClick}>{listName}</p>}
                {showRenameListIput && <input ref={listRenameInput} onKeyDown={handleSaveNewListName} className='lkn-grow lkn-font-medium lkn-outline-none lkn-border-b-2 lkn-border-b-gray-200 lkn-h-[30px]' placeholder={t('Type the new name...')} defaultValue={listName}></input>}

                <div className='lkn-flex lkn-gap-2'>
                    <button className='lkn-opacity-0 group-hover/list-header:lkn-opacity-100 lkn-transition-opacity' onClick={() => handleArchiveList(id)}>
                        <ArchiveBoxIcon width={20} height={20} />
                    </button>

                    <div className='lkn-bg-gray-100 lkn-text-gray-400 lkn-rounded lkn-p-1 lkn-w-[25px] lkn-text-center lkn-text-xs lkn-font-medium'>{inProgressCards.length}</div>
                </div>
            </div>

            <div ref={cardsContainer} className='lkn-flex lkn-flex-col lkn-gap-4 lkn-max-h-[calc(100%-150px)] lkn-overflow-y-scroll lkn-pr-1'>
                {inProgressCards.map(card => (
                    <Card
                        key={card.id}
                        id={card.id}
                        listId={id}
                        referId={card.refer_id}
                        referType={card.refer_type}
                        title={card.title}
                        showArchiveBtn={true}
                        onArchiveClick={handleOnArchiveCardClick}
                    />
                ))}
                {
                    showNewCardSearch && (
                        <div className='lkn-relative'>
                            {
                                displayNewCardLoading && (
                                    <div className='lkn-absolute lkn-left-0 lkn-right-0 lkn-top-0 lkn-bottom-0 lkn-flex lkn-justify-center lkn-items-center lkn-bg-[rgba(255,255,255,0.8)]'>
                                        <CloudArrowUpIcon width={30} height={30} className='lkn-text-gray-500 lkn-animate-pulse' />
                                    </div>
                                )
                            }
                            <NewCardSearch handleNewCardClick={handleNewCardClick} />
                        </div>
                    )
                }
            </div>

            <div className='lkn-w-full lkn-text-sm lkn-text-gray-500 lkn-font-medium hover:lkn-bg-gray-100 lkn-transition-colors lkn-p-2 lkn-rounded'>
                {
                    showAddCardBtn ? (
                        <button className='lkn-w-full lkn-flex lkn-items-center lkn-justify-center' onClick={handleDisplayNewCardSearchClick}>
                            <p className='lkn-grow lkn-text-left'><Trans>Add card</Trans></p>
                            <PlusIcon width={20} height={20} />
                        </button>
                    ) : (
                        <button className='lkn-w-full lkn-flex lkn-items-center lkn-justify-center' onClick={() => { setShowAddCardBtn(true); setShowNewCardSearch(false) }}>
                            <p className='lkn-grow lkn-text-left'><Trans>Cancel</Trans></p>
                            <XMarkIcon width={20} height={20} />
                        </button>
                    )
                }
            </div>
        </div>
    )
}
