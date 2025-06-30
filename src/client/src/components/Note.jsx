import { UserIcon } from '@heroicons/react/24/outline'
import { PencilIcon } from '@heroicons/react/24/solid'
import { SHA256 } from 'crypto-js'
import { useEffect, useState } from 'react'
import { formatDate } from '../utils'

export default function Note({
    id,
    cardId,
    clientId,
    adminEmail,
    adminFullName,
    note,
    modified,
    dense = false,
    showEditIcon = false,
}) {
    return (
        <div
            key={id}
            className="lkn-group/note lkn-flex lkn-items-start lkn-gap-2 lkn-text-gray-600"
        >
            <NoteAdminPhoto adminEmail={adminEmail} dense={dense} />

            <div className="lkn-grow">
                <div className="lkn-mb-2 lkn-text-sm lkn-font-medium">
                    {adminFullName}{' '}
                    <span
                        className={
                            'lkn-font-normal lkn-text-xs ' +
                            (dense ? 'lkn-block' : 'lkn-ml-2')
                        }
                    >
                        {formatDate(modified)}
                    </span>
                </div>
                <div
                    className={
                        'lkn-relative lkn-text-sm lkn-p-4 lkn-rounded-lg lkn-leading-6 lkn-break-all ' +
                        (dense
                            ? 'lkn-border-gray-200 lkn-border-[1px]'
                            : 'lkn-shadow lkn-shadow-gray-300')
                    }
                >
                    {showEditIcon && (
                        <div className="lkn-absolute lkn-right-0 lkn-top-0 lkn-bg-transparent lkn-pt-2 lkn-pr-2">
                            <a
                                href={`clientsnotes.php?userid=${clientId}&action=edit&id=${id}`}
                                target="_blank"
                                rel="noreferrer"
                            >
                                <PencilIcon
                                    width={24}
                                    height={24}
                                    className="lkn-hidden group-hover/note:lkn-block hover:lkn-bg-gray-200 lkn-rounded-full lkn-p-1 lkn-cursor-pointer"
                                />
                            </a>
                        </div>
                    )}
                    {note.replace(/@\(([\w.]+)\)/g, '@$1')}
                </div>
            </div>
        </div>
    )
}
function NoteAdminPhoto({ adminEmail, dense = false }) {
    const [gravatar, setGravatar] = useState(false)

    useEffect(() => {
        if (!adminEmail) return

        const emailHash = SHA256(adminEmail)

        fetch(`https://www.gravatar.com/avatar/${emailHash}?d=404&s=32`).then(
            (response) => {
                if (response.status === 200) {
                    response.blob().then((res) => {
                        setGravatar(URL.createObjectURL(res))
                    })
                }
            }
        )
    }, [adminEmail])

    return gravatar ? (
        <img
            className="lkn-rounded-full"
            src={gravatar}
            width={dense ? 24 : 32}
            height={dense ? 24 : 32}
        />
    ) : (
        <UserIcon
            className={dense ? 'lkn-min-w-[24px]' : 'lkn-min-w-[32px]'}
            width={dense ? 24 : 32}
            height={dense ? 24 : 32}
        />
    )
}
