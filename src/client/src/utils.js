import { t } from 'i18next'

export function clickOutsideListener(element, action) {
  function handleClick(event) {
    if (!element.contains(event.target)) {
      action()
      document.removeEventListener('click', handleClick)
    }
  }

  document.addEventListener('click', handleClick, { once: true })
}

export function formatDate(dateString) {
  const date = new Date(dateString)

  const formattedDate = new Intl.DateTimeFormat(navigator.language, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  }).format(date)

  const hours = date.getHours()
  const minutes = date.getMinutes()
  const formattedTime = `${hours % 12 || 12}:${minutes.toString().padStart(2, '0')} ${hours >= 12 ? 'PM' : 'AM'}`

  return `${formattedDate} ${t('at')} ${formattedTime}`
}
