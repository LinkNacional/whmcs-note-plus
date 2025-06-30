// Notify.js
import { useEffect } from 'react'
import { useNotify } from './Context'
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'

export default function Notify () {
    const { notifications, removeNotification } = useNotify()

    useEffect(() => {
        const timer = setTimeout(() => {
            // if (notifications.length > 0) {
            // removeNotification(notifications[0])
            // }
        }, 5000)
        return () => clearTimeout(timer)
    }, [notifications, removeNotification])

    return (
        <div className="notifications lkn-pointer-events-none lkn-fixed lkn-top-5 lkn-right-5 lkn-flex lkn-flex-col lkn-items-end lkn-gap-4 lkn-z-[1000]">
            {notifications.map((notif, index) => (
                <NotifyItem key={index} message={notif.message} type={notif.type} />
            ))}
        </div>
    )
}

function NotifyItem ({ message, type }) {
    return (
        <div className="lkn-bg-white lkn-shadow-sm lkn-shadow-gray-300 lkn-rounded-lg lkn-p-3 lkn-flex lkn-items-center lkn-w-[280px] lkn-gap-3">
            {
                type === 'success' ? (
                    <CheckCircleIcon width={25} height={25} />
                ) : (
                    <XCircleIcon width={25} height={25} />
                )
            }
            <div className='lkn-text-sm'>
                {message}
            </div>
        </div>
    )
}
