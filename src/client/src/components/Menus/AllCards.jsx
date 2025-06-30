import { useContext, useState } from 'react'
import { DataContext } from '../../App'
import Card from '../Card/Card'
import { t } from 'i18next'
import { ArrowLongDownIcon, ArrowLongUpIcon } from '@heroicons/react/24/solid'
import { Trans } from 'react-i18next'

export default function AllCards () {
    const { cards } = useContext(DataContext)
    const [_cards, _setCards] = useState(cards)
    const [isAscendingOrder, setIsAscendingOrder] = useState(true)

    function sortByCreatedAt (ascending) {
        _cards.sort((a, b) => {
            const dateA = new Date(a.created_at)
            const dateB = new Date(b.created_at)
            if (ascending) {
                return dateA - dateB
            } else {
                return dateB - dateA
            }
        })

        const sortedCards = _cards
        _setCards(sortedCards)
    }

    return (
        <div className='lkn-flex lkn-flex-col lkn-gap-2'>
            <div className='lkn-flex lkn-items-center lkn-w-full lkn-gap-2 lkn-text-sm'>
                <p className='min-w-fit lkn-break-keep lkn-font-medium lkn-text-gray-600'><Trans>Order by</Trans></p>
                <select disabled className='lkn-h-10 lkn-outline-none lkn-bg-transparent lkn-border-gray-100 lkn-flex-1 lkn-border-2 lkn-rounded-lg lkn-cursor-pointer' defaultValue={'created_at'}>
                    <option value="created_at">{t('Creation date')}</option>
                </select>
                <button
                    onClick={() => { setIsAscendingOrder(!isAscendingOrder); sortByCreatedAt(!isAscendingOrder) }}
                    className='lkn-p-2 hover:lkn-bg-gray-200 lkn-rounded'
                >
                    {
                        isAscendingOrder ? (
                            <ArrowLongDownIcon width={18} height={18} />
                        ) : (
                            <ArrowLongUpIcon width={18} height={18} />
                        )
                    }
                </button>
            </div>
            {_cards.map(card => (
                <Card
                    key={card.id + card.title}
                    id={card.id}
                    listId={card.list_id}
                    referId={card.refer_id}
                    referType={card.refer_type}
                    title={card.title}
                />
            ))}
        </div>
    )
}
