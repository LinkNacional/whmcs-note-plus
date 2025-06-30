import { useContext, useEffect, useState } from 'react'
import { requestArchivedLists, requestUnarchiveList, requestUpdateList } from '../../requests'
import { ArrowUturnLeftIcon } from '@heroicons/react/24/solid'
import { Trans } from 'react-i18next'
import { useNotify } from '../Notify/Context'
import { t } from 'i18next'
import { ListState } from '../../constants'
import { DataContext } from '../../App'

export default function ArchivedLists ({ onClickBackToInitialMenu }) {
    const { cardsByList, setCardsByList } = useContext(DataContext)
    const { notify } = useNotify()

    function onUnarchiveListClick (listId) {
        requestUpdateList({ listId, state: ListState.IN_PROGRESS })
            .then(res => res.json())
            .then(res => {
                if (res.success) {
                    const modifiedCardIndex = cardsByList.findIndex(list => parseInt(list.id) === parseInt(listId))
                    cardsByList[modifiedCardIndex].state = ListState.IN_PROGRESS

                    setCardsByList(cardsByList)

                    notify({ message: t('List unarchived successfully.') })
                } else {
                    notify({
                        message: t('Unable to unarchive the list. Please, see the logs.'),
                        type: 'error'
                    })
                }
            })
            .catch((e) => {
                notify({
                    message: t('Unable to unarchive the list. Please, see the logs.'),
                    type: 'error'
                })
                console.log(e)
            })
    }

    return (
        <div className='lkn-flex lkn-flex-col lkn-gap-2'>
            {
                cardsByList.filter(list => parseInt(list.state) === ListState.ARCHIVED).map(list => (
                    <div key={list.id} className='lkn-border lkn-border-gray-200 lkn-rounded-lg lkn-p-2 lkn-flex lkn-items-center lkn-justify-between lkn-gap-4'>
                        <div className='lkn-text-sm'>{list.name}</div>
                        <div onClick={() => onUnarchiveListClick(list.id)} className='lkn-flex lkn-gap-2 lkn-text-sm lkn-mt-2 hover:lkn-underline lkn-underline-offset-2 lkn-cursor-pointer lkn-bg-gray-100 lkn-px-2 lkn-py-1 lkn-rounded lkn-w-fit lkn-min-w-fit'>
                            <ArrowUturnLeftIcon width={15} /> <Trans>Send to board</Trans>
                        </div>
                    </div>
                ))
            }
        </div>
    )
}
