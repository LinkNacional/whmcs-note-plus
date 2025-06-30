export default function Button({text, icon: Icon = fals, type = 'btn'}) {
  return (
    <button className={"lkn-flex lkn-group/btn lkn-gap-2  lkn-px-2 lkn-py-2 lkn-rounded-lg " + (type === 'link' ? 'lkn-text-blue-500' : 'lkn-bg-gray-50')}>
      {Icon && <Icon width={20} height={20} className='group-hover/btn:lkn-translate-x-0.5' />} {text}
    </button>
  )
}
