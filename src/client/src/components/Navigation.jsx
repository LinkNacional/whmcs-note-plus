import { ChevronLeftIcon, XMarkIcon } from '@heroicons/react/24/solid'
import { ChatBubbleBottomCenterTextIcon, QueueListIcon, Square3Stack3DIcon } from '@heroicons/react/24/outline'
import ArchivedLists from './Menus/ArchivedLists'
import ArchivedCards from './Menus/ArchivedCards'
import { useState } from 'react'
import { t } from 'i18next'
import AllCards from './Menus/AllCards'
import AllNotes from './Menus/AllNotes'

export default function Navigation ({ onClickCloseMenu }) {
    const [currentMenu, setCurrentMenu] = useState({})
    const menus = [
        {
            id: 1,
            label: t('Archived lists'),
            component: <ArchivedLists />,
            icon: <QueueListIcon width={18} height={18} />
        },
        {
            id: 2,
            label: t('Archived cards'),
            component: <ArchivedCards />,
            icon: <Square3Stack3DIcon width={18} height={18} />
        },
        {
            id: 3,
            label: t('All cards'),
            component: <AllCards />,
            delimter: true,
            icon: <Square3Stack3DIcon width={18} height={18} />
        },
        {
            id: 4,
            label: t('All notes'),
            component: <AllNotes />,
            icon: <ChatBubbleBottomCenterTextIcon width={18} height={18} />
        }
    ]

    return (
        <div className={
            'lkn-bg-white lkn-shadow lkn-shadow-gray-300 lkn-w-[300px] lkn-min-w-[300px] lkn-rounded-lg lkn-p-3 lkn-flex lkn-flex-col lkn-gap-4 lkn-overflow-y-scroll '
            + (
                import.meta.env.DEV ? 'lkn-max-h-[calc(100vh-30px)]' : 'lkn-max-h-[calc(100vh-133px)]'
            )
        }>
            <div className='lkn-relative'>
                {currentMenu.label && <ChevronLeftIcon className='hover:lkn-bg-gray-200 lkn-rounded-full lkn-p-1 lkn-cursor-pointer lkn-absolute lkn-left-0 lkn-top-0' width={32} height={32} onClick={() => setCurrentMenu({})} />}

                <p className='lkn-text-center lkn-h-[35px] lkn-leading-[35px] lkn-font-medium lkn-text-lg'>
                    {currentMenu.label ?? t('Menu')}
                </p>

                <XMarkIcon className='hover:lkn-bg-gray-200 lkn-rounded-full lkn-p-1 lkn-cursor-pointer lkn-absolute lkn-right-0 lkn-top-0' width={32} height={32} onClick={onClickCloseMenu} />
            </div>

            <div className='lkn-h-[1px] lkn-bg-gray-200 lkn-w-full lkn-my-1'></div>

            <div>
                {currentMenu.component ? currentMenu.component : (
                    <ul className=' lkn-flex lkn-flex-col lkn-gap-1'>
                        {
                            menus.map(menu => (
                                <div key={menu.id}>
                                    {menu.delimter && <div className='lkn-h-[1px] lkn-bg-gray-200 lkn-w-full lkn-my-2'></div>}
                                    <div
                                        className='lkn-flex lkn-justify-start lkn-gap-2 lkn-items-center lkn-text-left lkn-cursor-pointer hover:lkn-bg-gray-100 active:lkn-bg-gray-200 lkn-text-gray-800 lkn-p-2 lkn-rounded lkn-text-sm'
                                        onClick={() => setCurrentMenu(menu)}
                                    >
                                        {menu.icon}
                                        <li>{menu.label}</li>
                                    </div>
                                </div>
                            ))
                        }
                    </ul>
                )}
            </div>
        </div >
    )
}
