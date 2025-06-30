import { ArrowLongDownIcon, ArrowLongUpIcon } from '@heroicons/react/24/solid'
import { t } from 'i18next'
import { useEffect, useState } from 'react'
import { Trans } from 'react-i18next'
import { requestNotes } from '../../requests'
import Note from '../Note'

export default function AllNotes() {
    const [notes, setNotes] = useState([])
    const [isAscendingOrder, setIsAscendingOrder] = useState(true)

    useEffect(() => {
        requestNotes()
            .then((res) => res.json())
            .then((res) => {
                setNotes(res.data.notes)
            })
    }, [])

    function sortByCreatedAt(ascending) {
        notes.sort((a, b) => {
            const dateA = new Date(a.modified)
            const dateB = new Date(b.modified)
            if (ascending) {
                return dateA - dateB
            } else {
                return dateB - dateA
            }
        })

        const sortedNotes = notes
        setNotes(sortedNotes)
    }

    return (
        <div className="lkn-flex lkn-flex-col lkn-gap-2">
            <div className="lkn-flex lkn-items-center lkn-w-full lkn-gap-2 lkn-text-sm">
                <p className="min-w-fit lkn-break-keep lkn-font-medium lkn-text-gray-600">
                    <Trans>Order by</Trans>
                </p>
                <select
                    disabled
                    className="lkn-h-10 lkn-outline-none lkn-bg-transparent lkn-border-gray-100 lkn-flex-1 lkn-border-2 lkn-rounded-lg lkn-cursor-pointer"
                    defaultValue={'created_at'}
                >
                    <option value="created_at">{t('Creation date')}</option>
                </select>
                <button
                    onClick={() => {
                        setIsAscendingOrder(!isAscendingOrder)
                        sortByCreatedAt(!isAscendingOrder)
                    }}
                    className="lkn-p-2 hover:lkn-bg-gray-200 lkn-rounded"
                >
                    {isAscendingOrder ? (
                        <ArrowLongDownIcon width={18} height={18} />
                    ) : (
                        <ArrowLongUpIcon width={18} height={18} />
                    )}
                </button>
            </div>
            <div className="lkn-flex lkn-flex-col lkn-gap-5 lkn-overflow-y-scroll lkn-pr-2 lkn-max-h-[calc(100vh-180px)]">
                {notes.map((note) => (
                    <Note
                        key={note.id}
                        id={note.id}
                        cardId={note?.card?.id}
                        clientId={note.userid}
                        adminEmail={note?.admin?.email}
                        adminFullName={`${note?.admin?.firstname} ${note?.admin?.lastname}`.trim()}
                        note={note.note}
                        modified={note.modified}
                        dense={true}
                        showEditIcon={true}
                    />
                ))}
            </div>
        </div>
    )
}
