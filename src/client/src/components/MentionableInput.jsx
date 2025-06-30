import { t } from 'i18next'
import { useEffect, useState } from 'react'
import { Mention, MentionsInput } from 'react-mentions'
import { requestSearchMention } from '../requests'

const mentionStyle = {
    backgroundColor: '#d3d535',
    borderRadius: '5px',
}

export default function MentionableInput({ value, onChange, singleLine = false, maxLength = 400 }) {
    const [data, setData] = useState([])

    useEffect(() => {
        requestSearchMention({ search: null })
            .then(res => res.json())
            .then(res => {
                setData(res.data.results)
            })
    }, [])

    const inputStyle = {
        suggestions: {
            top: '32px',
            list: {
                maxHeight: '300px',
                overflowY: 'scroll'
            }
        }
    }

    if (singleLine) {
        inputStyle.input = {
            overflow: 'auto',
            // height: 150,
            padding: '16px',
            fontSize: '0.875rem',
            lineHeight: '1.25rem',
            wordBreak: 'break-all'
        }
        inputStyle.highlighter = {
            boxSizing: 'border-box',
            overflow: 'hidden',
            // height: 150,
            padding: '16px',
            fontSize: '0.875rem',
            lineHeight: '1.25rem',
            wordBreak: 'break-all'
        }
    } else {
        inputStyle.input = {
            overflow: 'auto',
            height: 200,
            padding: '16px',
            fontSize: '0.875rem',
            lineHeight: '1.25rem',
            wordBreak: 'break-all'
        }
        inputStyle.highlighter = {
            boxSizing: 'border-box',
            overflow: 'hidden',
            height: 200,
            padding: '16px',
            fontSize: '0.875rem',
            lineHeight: '1.25rem',
            wordBreak: 'break-all'
        }
    }

    return (
        <MentionsInput
            value={value}
            onChange={event => { onChange(event.target.value) }}
            style={inputStyle}
            placeholder={t('Mention admins typing @')}
            className='lkn-mentions-input'
            maxLength={maxLength}
        >
            <Mention
                trigger="@"
                displayTransform={(username) => `@${username}`}
                markup="@__id__"
                data={data}
                regex={/@(\S+)/}
                style={mentionStyle}
                appendSpaceOnAdd
            />
        </MentionsInput>
    )
}
