import { useEffect, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { CardReferLabels } from '../../../constants'
import { requestNewCardSearch } from '../../../requests'

export default function NewCardSearch({ handleNewCardClick }) {
    const { t } = useTranslation()
    const [filter, updateFilter] = useState('all')
    const [search, updateSearch] = useState('')
    const [searchResults, updateSearchResults] = useState([])

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (search.length === 0) {
                return
            }

            requestNewCardSearch(search, filter)
                .then(res => res.json())
                .then(res => {
                    updateSearchResults(res.data.results.length ? res.data.results : [])
                })
                .catch(err => {
                    console.log(err)
                })
        }, 800)

        return () => clearTimeout(timeoutId)
    }, [search, filter])


    return (
        <div className='lkn-flex lkn-flex-col lkn-gap-4 lkn-text-gray-700 lkn-text-sm lkn-border lkn-border-gray-300 lkn-rounded lkn-p-4'>
            <div className='lkn-flex lkn-bg-gray-50 lkn-rounded lkn-text-xs'>
                <select className='lkn-max-w-fit lkn-h-10 lkn-outline-none lkn-bg-transparent lkn-cursor-pointer' defaultValue={'all'} onChange={e => updateFilter(e.target.value)}>
                    <option value="all">{t('All')}</option>
                    <option value="invoice">{t('Invoice')}</option>
                    <option value="client">{t('Client')}</option>
                    <option value="domain">{t('Domain')}</option>
                    <option value="ticket">{t('Ticket')}</option>
                </select>
                <input
                    id="search-client-input"
                    type="text"
                    maxLength="255"
                    className="lkn-p-2 lkn-w-full lkn-text-gray-800 lkn-outline-none lkn-font-medium lkn-bg-transparent"
                    placeholder={t('Type here...')}
                    autoComplete="off"
                    onKeyUp={e => updateSearch(e.target.value)}
                />
            </div>
            <div className='lkn-flex lkn-flex-col lkn-gap-2 lkn-h-[300px] lkn-max-h-[300px] lkn-overflow-y-scroll'>
                {
                    searchResults.length > 0 ? searchResults.map(result => (
                        <div key={`${result.id}.${result.refer_type}.${result.title}`} onClick={() => handleNewCardClick(result.id, result.refer_type)} className='lkn-flex lkn-flex-col lkn-gap-1 lkn-text-sm lkn-break-words lkn-bg-gray-50 hover:lkn-bg-gray-100 active:lkn-bg-gray-200 lkn-p-3 lkn-rounded lkn-cursor-pointer'>
                            <div className='lkn-flex lkn-gap-2 lkn-font-light lkn-text-xs lkn-text-gray-900'>
                                <div>
                                    {CardReferLabels[result.refer_type]}
                                </div>
                                <div>#{result.id}</div>
                            </div>
                            <div className='lkn-font-medium'>{result.title}</div>
                        </div>
                    )) : (
                        <div className='lkn-text-sm lkn-text-center lkn-text-gray-600 lkn-p-5'><Trans>Search for client, domain, ticket, ID</Trans></div>
                    )
                }
            </div>
        </div>
    )
}
