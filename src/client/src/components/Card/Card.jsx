import { Trans } from 'react-i18next'
import { CardReferLabels, CardReferIdLinkTemplates } from '../../constants'
import { useRef } from 'react'
import { ArchiveBoxArrowDownIcon, ArchiveBoxXMarkIcon } from '@heroicons/react/24/solid'
import { useNavigate } from 'react-router-dom'
import { useCardModal } from '../EditCardModal/EditCardModalContext'

export default function Card ({
    id,
    listId,
    referId,
    referType,
    title,
    onArchiveClick = null,
    showArchiveBtn = false,
    showUnarchiveBtn = false,
    onUnarchiveClick = null
}) {
    const unarchiveBtnElement = useRef()
    const archiveBtnElement = useRef()
    const navigate = useNavigate()
    const { showCard } = useCardModal()

    function handleShowCardModal (event) {
        if (showUnarchiveBtn && unarchiveBtnElement.current.contains(event.target)) {
            return
        }

        if (showArchiveBtn && archiveBtnElement.current.contains(event.target)) {
            return
        }

        navigate(`/${id}`)

        showCard(id, () => navigate('/'))
    }

    return (
        <div className='lkn-group/card lkn-flex lkn-flex-1 lkn-flex-col lkn-gap-4 lkn-text-gray-700 lkn-text-sm lkn-border lkn-border-gray-300 hover:lkn-border-gray-400 lkn-rounded lkn-p-4 lkn-cursor-pointer' onClick={handleShowCardModal}>
            <div className='lkn-text-sm lkn-font-semibold lkn-text-gray-900 lkn-flex lkn-justify-between'>
                <p><Trans>{CardReferLabels[referType]}</Trans></p>
                <a className='hover:lkn-text-gray-500 lkn-transition-colors' href={CardReferIdLinkTemplates[referType]?.replaceAll('{id}', referId)}>#{referId}</a>
            </div>
            <div className='lkn-flex lkn-break-all lkn-justify-between lkn-items-center lkn-gap-2'>
                <div className='lkn-text-xs'>{title}</div>
                {
                    showArchiveBtn && (
                        <ArchiveBoxArrowDownIcon ref={archiveBtnElement} onClick={() => onArchiveClick(id, listId, referId, referType, title)} className='hover:lkn-bg-gray-200 lkn-opacity-0 group-hover/card:lkn-opacity-100 lkn-p-1 lkn-rounded-full lkn-min-w-[28px]' width={28} height={28} />
                    )
                }
                {
                    showUnarchiveBtn && (
                        <ArchiveBoxXMarkIcon ref={unarchiveBtnElement} onClick={() => onUnarchiveClick(id, listId, referId, referType, title)} className='hover:lkn-bg-gray-200 lkn-opacity-20 group-hover/card:lkn-opacity-100 lkn-p-1 lkn-rounded-full lkn-min-w-[28px]' width={28} height={28} />
                    )
                }
            </div>
        </div>
    )
}
