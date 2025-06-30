import { useTranslation } from 'react-i18next'

const Translator = (text) => {
    const { t } = useTranslation()
    return t(text)
}

export default Translator
