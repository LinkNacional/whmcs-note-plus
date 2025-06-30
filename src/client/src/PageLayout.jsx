import { Outlet } from 'react-router-dom'
import Header from './components/Header'
import { useState } from 'react'
import Navigation from './components/Navigation'

export default function PageLayout () {
    const [showMenu, setShowMenu] = useState(false)

    return (
        <div className={'lkn-flex lkn-w-full ' + (showMenu && 'lkn-gap-8')}>
            <div className='lkn-flex lkn-flex-col lkn-gap-8 lkn-w-full lkn-min-w-0'>
                <Header showMenu={showMenu} onClickOpenMenu={() => setShowMenu(!showMenu)} />

                <main className={'lkn-overflow-x-auto lkn-w-full ' + (import.meta.env.DEV ? 'lkn-max-h-[calc(100vh-101px)] lkn-h-[calc(100vh-101px)]' : 'max-[950px]:lkn-h-[calc(100vh-243px)] max-[950px]:lkn-max-h-[calc(100vh-243px)] lkn-h-[calc(100vh-198px)] lkn-max-h-[calc(100vh-198pxpx)]')}>
                    <Outlet />
                </main>
            </div>

            {showMenu && <Navigation onClickCloseMenu={() => setShowMenu(false)} />}
        </div>
    )
}
