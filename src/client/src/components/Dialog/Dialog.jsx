import { useDialog } from './Context'

const Dialog = () => {
    const { dialogs, closeDialog } = useDialog()

    return (
        <>
            {dialogs.map((dialog, index) => (
                <div key={index} className={"lkn-absolute lkn-left-0 lkn-bottom-0 lkn-right-0 lkn-top-0 lkn-flex lkn-justify-center lkn-items-center lkn-text-base lkn-z-[900] " + (index === 0 && 'lkn-bg-[rgba(0,0,0,0.2)]')}>
                    <div className="lkn-bg-white lkn-shadow lkn-shadow-gray-400 lkn-rounded-lg lkn-px-6 lkn-pb-6 lkn-flex lkn-flex-col lkn-w-[280px]">
                        <div className='lkn-font-medium lkn-text-base lkn-text-center lkn-my-10'>
                            {dialog.content}
                        </div>

                        <div className='lkn-flex lkn-flex-col lkn-justify-between lkn-gap-4 *:lkn-transition-colors'>
                            <button onClick={() => { closeDialog(); dialog.onConfirmClick && dialog.onConfirmClick() }} className='lkn-p-2 lkn-bg-blue-500 hover:lkn-bg-blue-600 active:lkn-bg-blue-700 lkn-text-neutral-50 lkn-rounded lkn-text-sm'>Confirm</button>
                            <button onClick={() => { closeDialog(); dialog.onCancelClick && dialog.onCancelClick() }} className='lkn-p-2 lkn-border lkn-border-gray-200 hover:lkn-bg-gray-300 active:lkn-bg-gray-400 lkn-rounded lkn-text-sm lkn-text-gray-800'>Close</button>
                        </div>
                    </div>
                </div>
            ))}
        </>
    )
}

export default Dialog
