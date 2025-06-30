import { useContext } from 'react'
import Card from '../Card/Card'
import { DataContext } from '../../App'
import { CardState } from '../../constants'
import { requestUpdateCard } from '../../requests'
import { useNotify } from '../Notify/Context'
import { t } from 'i18next'

export default function ArchivedCards () {
    const { cards, setCards, cardsByList, setCardsByList } = useContext(DataContext)
    const { notify } = useNotify()

    function onUnarchiveClick (cardId) {
        requestUpdateCard({ cardId, state: CardState.IN_PROGRESS })
            .then(res => res.json())
            .then(res => {
                if (res.success) {
                    const modifiedCardIndex = cards.findIndex(card => parseInt(card.id) === parseInt(cardId))
                    cards[modifiedCardIndex].state = CardState.IN_PROGRESS

                    setCards(cards)

                    notify({ message: t('Card unarchived successfully.') })
                } else {
                    notify({
                        message: t('Unable to unarchive the card. Please, see the logs.'),
                        type: 'error'
                    })
                }
            })
            .catch((e) => {
                notify({
                    message: t('Unable to unarchive the card. Please, see the logs.'),
                    type: 'error'
                })
                console.log(e)
            })
    }

    return (
        <div className='lkn-flex lkn-flex-col lkn-gap-2'>
            {cards.filter(card => parseInt(card.state) === CardState.ARCHIVED).map(card => (
                <Card
                    key={card.id}
                    id={card.id}
                    listId={card.list_id}
                    referId={card.refer_id}
                    referType={card.refer_type}
                    title={card.title}
                    showUnarchiveBtn={true}
                    onUnarchiveClick={onUnarchiveClick}
                />
            ))}
        </div>
    )
}
