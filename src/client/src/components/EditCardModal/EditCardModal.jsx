import {
    ArchiveBoxArrowDownIcon as ArchiveBoxArrowDownIconOutline,
    ArchiveBoxIcon,
    ArchiveBoxXMarkIcon as ArchiveBoxXMarkIconOutline,
    AtSymbolIcon,
    ChatBubbleBottomCenterIcon,
    DocumentTextIcon,
    GlobeAltIcon,
    UserIcon,
} from '@heroicons/react/24/outline'
import { Bars3BottomLeftIcon, XMarkIcon } from '@heroicons/react/24/solid'
import sha256 from 'crypto-js/sha256'
import { t } from 'i18next'
import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { Trans } from 'react-i18next'
import { DataContext } from '../../App'
import { CardReferLabels, CardState } from '../../constants'
import {
    requestCardShow,
    requestCreateNote,
    requestUpdateCard,
} from '../../requests'
import MentionableInput from '../MentionableInput'
import Note from '../Note'
import { useNotify } from '../Notify/Context'
import { useCardModal } from './EditCardModalContext'

export default function EditCardModal() {
    const [card, updateCard] = useState({
        notes: [],
        client: { adminNotes: '' },
    })
    const [cardLoading, setCardLoading] = useState(true)
    const [isCardArchived, setIsCarcArchived] = useState(true)
    const { notify } = useNotify()
    const { cards, setCards } = useContext(DataContext)
    const { cardId: id, hideModal } = useCardModal()
    const [enableSaveAdminNoteBtn, setEnableSaveAdminNoteBtn] = useState(false)
    const [enableSaveNewNoteBtn, setEnableSaveNewNoteBtn] = useState(false)
    const modalElementRef = useRef()
    const clientLinks = [
        {
            label: t('Profile'),
            link: `clientsprofile.php?userid=${card.client.id}`,
            icon: <UserIcon width={16} height={16} />,
        },
        {
            label: t('Products'),
            link: `clientsservices.php?userid=${card.client.id}`,
            icon: <ArchiveBoxIcon width={16} height={16} />,
        },
        {
            label: t('Invoices'),
            link: `clientsinvoices.php?userid=${card.client.id}`,
            icon: <DocumentTextIcon width={16} height={16} />,
        },
        {
            label: t('Domains'),
            link: `clientsdomains.php?userid=${card.client.id}`,
            icon: <GlobeAltIcon width={16} height={16} />,
        },
        {
            label: t('E-mails'),
            link: `clientsemails.php?userid=${card.client.id}`,
            icon: <AtSymbolIcon width={16} height={16} />,
        },
    ]
    const [adminNote, setAdminNote] = useState('')
    const [newNote, setNewNote] = useState('')

    useEffect(() => {
        if (id === null) {
            return
        }

        setCardLoading(true)

        requestCardShow(id)
            .then((res) => res.json())
            .then((res) => {
                updateCard({
                    id: res.data.card.id,
                    referType: res.data.card.refer_type,
                    referId: res.data.card.refer_id,
                    title: res.data.card.title,
                    state: res.data.card.state,
                    notes: res.data.card.notes ?? [],
                    client: res.data.card.client ?? [],
                })
                setIsCarcArchived(
                    parseInt(res.data.card.state) ===
                        parseInt(CardState.ARCHIVED)
                )
                setAdminNote(res.data.card.client.adminNotes)
            })
            .finally(() => {
                setCardLoading(false)
            })
    }, [id])

    const onCloseModalClick = useCallback(() => {
        hideModal()
    }, [hideModal])

    function handleOnArchiveCardClick() {
        requestUpdateCard({ cardId: id, state: CardState.ARCHIVED })
            .then((res) => res.json())
            .then((res) => {
                if (res.success) {
                    const modifiedCardIndex = cards.findIndex(
                        (card) => parseInt(card.id) === parseInt(id)
                    )
                    cards[modifiedCardIndex].state = CardState.ARCHIVED

                    setCards(cards)
                    setIsCarcArchived(true)

                    notify({ message: t('Card archived successfully.') })
                } else {
                    notify({
                        message: t(
                            'Unable to archive the card. Please, see the logs.'
                        ),
                        type: 'error',
                    })
                }
            })
            .catch((e) => {
                console.log(e)
                notify({
                    message: t(
                        'Unable to archive the card. Please, see the logs.'
                    ),
                    type: 'error',
                })
            })
    }

    function handleOnUnarchiveCardClick() {
        requestUpdateCard({ cardId: id, state: CardState.IN_PROGRESS })
            .then((res) => res.json())
            .then((res) => {
                if (res.success) {
                    const modifiedCardIndex = cards.findIndex(
                        (card) => parseInt(card.id) === parseInt(id)
                    )
                    cards[modifiedCardIndex].state = CardState.IN_PROGRESS

                    setCards(cards)
                    setIsCarcArchived(false)

                    notify({ message: t('Card unarchived successfully.') })
                } else {
                    notify({
                        message: t(
                            'Unable to unarchive the card. Please, see the logs.'
                        ),
                        type: 'error',
                    })
                }
            })
            .catch((e) => {
                console.log(e)
                notify({
                    message: t(
                        'Unable to unarchive the card. Please, see the logs.'
                    ),
                    type: 'error',
                })
            })
    }

    function onSaveAdminNoteClick() {
        setEnableSaveAdminNoteBtn(false)

        requestUpdateCard({ cardId: card.id, note: adminNote })
            .then((res) => res.json())
            .then((res) => {
                if (res.success) {
                    notify({ message: t('Admin note saved successfully.') })
                } else {
                    notify({
                        message: t(
                            'Unable to save the admin note. Please, see the logs.'
                        ),
                        type: 'error',
                    })
                }
            })
            .catch(() => {
                notify({
                    message: t(
                        'Unable to save the admin note. Please, see the logs.'
                    ),
                    type: 'error',
                })
            })
    }

    function onSaveNewNoteClick() {
        setEnableSaveNewNoteBtn(false)

        requestCreateNote({
            cardId: card.id,
            clientId: card.client.id,
            note: newNote,
        })
            .then((res) => res.json())
            .then((res) => {
                if (res.success) {
                    notify({ message: t('Note added successfully.') })
                    const newCardState = card
                    newCardState.notes.unshift({
                        id: res.data.note.id,
                        note: res.data.note.note,
                        modified: res.data.note.modified,
                        admin: {
                            fullName: res.data.note.admin.fullName,
                            email: res.data.note.admin.email,
                        },
                    })
                    updateCard(newCardState)
                    setNewNote('')
                } else {
                    notify({
                        message: t(
                            'Unable to add the note. Please, see the logs.'
                        ),
                        type: 'error',
                    })
                }
            })
            .catch((e) => {
                console.log(e)
                notify({
                    message: t('Unable to add the note. Please, see the logs.'),
                    type: 'error',
                })
            })
    }

    const backgroundRef = useRef(null)

    useEffect(() => {
        if (backgroundRef.current && modalElementRef.current) {
            backgroundRef.current.addEventListener('click', (event) => {
                if (!modalElementRef.current.contains(event.target)) {
                    onCloseModalClick()
                }
            })
        }
    }, [backgroundRef, modalElementRef, onCloseModalClick])

    function handleOnAdminNoteChange(newAdminNote) {
        setAdminNote(newAdminNote)

        if (newAdminNote !== card.client.adminNotes) {
            setEnableSaveAdminNoteBtn(true)
        } else {
            setEnableSaveAdminNoteBtn(false)
        }
    }

    function handleOnNewNoteChange(newNoteValue) {
        setNewNote(newNoteValue)

        if (newNoteValue.length > 0) {
            setEnableSaveNewNoteBtn(true)
        } else {
            setEnableSaveNewNoteBtn(false)
        }
    }

    return id ? (
        <div
            ref={backgroundRef}
            className="lkn-fixed lkn-left-0 lkn-right-0 lkn-top-0 lkn-bottom-0 lkn-p-5 lkn-h-screen lkn-overflow-y-scroll lkn-z-[800] lkn-bg-[rgba(0,0,0,0.6)]"
        >
            <div
                ref={modalElementRef}
                className="lkn-max-w-[768px] lkn-bg-white lkn-rounded-lg lkn-mx-auto lkn-p-8 lkn-text-gray-800"
            >
                <div className="lkn-flex lkn-justify-between">
                    {cardLoading ? (
                        <div className="lkn-w-full lkn-h-[35px] lkn-bg-gray-200 lkn-animate-pulse lkn-rounded"></div>
                    ) : (
                        <div className="lkn-flex lkn-gap-2 lkn-items-center lkn-text-md lkn-h-fit lkn-bg-gray-200 lkn-rounded-full lkn-px-2 lkn-py-1">
                            <div>
                                <Trans>{CardReferLabels[card.referType]}</Trans>
                            </div>
                            <div>#{card.referId}</div>
                        </div>
                    )}
                    <XMarkIcon
                        className="hover:lkn-bg-gray-200 lkn-rounded-full lkn-p-1 lkn-cursor-pointer"
                        width={35}
                        height={35}
                        onClick={onCloseModalClick}
                    />
                </div>

                {cardLoading ? (
                    <div className="lkn-w-full lkn-h-[32px] lkn-bg-gray-200 lkn-animate-pulse lkn-rounded lkn-mb-8 lkn-mt-1"></div>
                ) : (
                    <div className="lkn-text-2xl lkn-font-semibold lkn-mb-8">
                        {card.title}
                    </div>
                )}

                <div className="lkn-flex lkn-gap-8">
                    <div className="lkn-flex-auto">
                        <div className="lkn-mb-12">
                            <div className="lkn-flex lkn-gap-2 lkn-justify-start lkn-items-start lkn-text-gray-800 lkn-mb-8">
                                <Bars3BottomLeftIcon width={22} height={22} />

                                <div className="lkn-flex lkn-grow lkn-flex-col lkn-gap-2 lkn-relative lkn-h-fit">
                                    <span className="lkn-font-medium lkn-pl-4">
                                        <Trans>Admin notes</Trans>
                                    </span>
                                    <MentionableInput
                                        value={adminNote}
                                        onChange={handleOnAdminNoteChange}
                                        maxLength={1000}
                                    />
                                    <div className="lkn-h-[36px] lkn-flex lkn-justify-end">
                                        {enableSaveAdminNoteBtn && (
                                            <button
                                                onClick={onSaveAdminNoteClick}
                                                className="disabled:lkn-bg-blue-300 lkn-bg-blue-700 lkn-w-fit lkn-self-end lkn-mt-2 hover:lkn-bg-blue-800 active:lkn-bg-blue-900 lkn-flex lkn-transition-colors lkn-text-white lkn-rounded lkn-px-3 lkn-py-1 lkn-text-sm lkn-font-medium"
                                            >
                                                Save
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="lkn-flex lkn-gap-2 lkn-justify-start lkn-items-start lkn-text-gray-800">
                                <ChatBubbleBottomCenterIcon
                                    width={22}
                                    height={22}
                                />

                                <div className="lkn-flex lkn-grow lkn-flex-col lkn-gap-2 lkn-relative">
                                    <span className="lkn-font-medium lkn-pl-4">
                                        <Trans>Notes</Trans>
                                    </span>
                                    <MentionableInput
                                        value={newNote}
                                        onChange={handleOnNewNoteChange}
                                        singleLine={true}
                                    />
                                    <div className="lkn-h-[36px] lkn-flex lkn-justify-end">
                                        {enableSaveNewNoteBtn && (
                                            <button
                                                onClick={onSaveNewNoteClick}
                                                className="disabled:lkn-bg-blue-300 lkn-bg-blue-700 lkn-w-fit lkn-self-end lkn-mt-2 hover:lkn-bg-blue-800 active:lkn-bg-blue-900 lkn-flex lkn-transition-colors lkn-text-white lkn-rounded lkn-px-3 lkn-py-1 lkn-text-sm lkn-font-medium"
                                            >
                                                Save
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="lkn-flex lkn-flex-col lkn-gap-8">
                            {card.notes.map((note) => (
                                <Note
                                    key={note.id}
                                    id={note.id}
                                    cardId={note?.card?.id}
                                    clientId={note.userid}
                                    adminEmail={note?.admin?.email}
                                    adminFullName={
                                        note.admin?.fullName ??
                                        `${note?.admin?.firstname} ${note?.admin?.lastname}`.trim()
                                    }
                                    note={note.note}
                                    modified={note.modified}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="lkn-w-[130px] lkn-min-w-[130px] lkn-flex lkn-flex-col lkn-gap-4">
                        <div className="lkn-text-sm lkn-font-medium">
                            <Trans>Fast access</Trans>
                        </div>
                        {clientLinks.map((link) => (
                            <a
                                key={link.link}
                                className="lkn-bg-gray-100 hover:lkn-bg-neutral-200 active:lkn-bg-neutral-300 lkn-flex lkn-gap-2 lkn-items-center lkn-transition-colors lkn-text-neutral-800 lkn-rounded lkn-px-2 lkn-py-1 lkn-text-sm lkn-font-medium"
                                href={link.link}
                                target="_blank"
                                rel="noreferrer"
                            >
                                {link.icon} {link.label}
                            </a>
                        ))}

                        {!cardLoading && (
                            <>
                                <div className="lkn-text-sm lkn-font-medium">
                                    <Trans>Card</Trans>
                                </div>

                                {isCardArchived ? (
                                    <button
                                        onClick={handleOnUnarchiveCardClick}
                                        className="lkn-bg-gray-100 hover:lkn-bg-neutral-200 active:lkn-bg-neutral-300 lkn-flex lkn-gap-2 lkn-items-center lkn-text-left lkn-transition-colors lkn-text-neutral-800 lkn-rounded lkn-px-2 lkn-py-1 lkn-text-sm lkn-font-medium"
                                    >
                                        <ArchiveBoxXMarkIconOutline
                                            width={16}
                                            height={16}
                                        />{' '}
                                        {t('Unarchive')}
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleOnArchiveCardClick}
                                        className="lkn-bg-gray-100 hover:lkn-bg-neutral-200 active:lkn-bg-neutral-300 lkn-flex lkn-gap-2 lkn-items-center lkn-text-left lkn-transition-colors lkn-text-neutral-800 lkn-rounded lkn-px-2 lkn-py-1 lkn-text-sm lkn-font-medium"
                                    >
                                        <ArchiveBoxArrowDownIconOutline
                                            width={16}
                                            height={16}
                                        />{' '}
                                        {t('Archive')}
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    ) : (
        false
    )
}

function NoteAdminPhoto({ adminEmail }) {
    const [gravatar, setGravatar] = useState(false)

    useEffect(() => {
        if (!adminEmail) return

        const emailHash = sha256(adminEmail)

        fetch(`https://www.gravatar.com/avatar/${emailHash}?d=404`).then(
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
            width={32}
            height={32}
        />
    ) : (
        <UserIcon className="lkn-min-w-[32px]" width={32} height={32} />
    )
}
