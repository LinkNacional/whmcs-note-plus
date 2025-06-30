import { EllipsisHorizontalIcon } from '@heroicons/react/24/solid'
import lknLogo from '/logo.png'

export default function PageLayout({ showMenu, onClickOpenMenu }) {
    return (
        <header className="lkn-flex lkn-justify-between lkn-items-center lkn-w-full lkn-h-[38px]">
            <div className="lkn-flex lkn-items-end lkn-justify-center lkn-gap-5">
                <div className="lkn-flex lkn-justify-center lkn-items-center lkn-gap-4">
                    <p className="lkn-text-xl lkn-font-bold lkn-tracking-tight">
                        Note Plus
                    </p>
                    <div className="lkn-h-[30px] lkn-w-[1px] lkn-bg-gray-300"></div>
                    <img src={lknLogo} width={140}></img>
                </div>
            </div>

            <div className="lkn-flex lkn-items-center lkn-gap-4">
                {!showMenu && (
                    <button
                        className="hover:lkn-bg-gray-200 lkn-rounded lkn-p-1 lkn-transition-colors"
                        onClick={onClickOpenMenu}
                    >
                        <EllipsisHorizontalIcon width={30} height={30} />
                    </button>
                )}
            </div>
        </header>
    )
}
