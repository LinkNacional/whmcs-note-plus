// Importando as dependências
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import translations from './locales'

// Configuração i18n
const i18nConfig = {
  resources: translations,
  fallbackLng: 'en-US',
  defaultNS: 'translations',
  lng: window?.lknNotePlus?.config?.lang ?? 'pt-BR',
  debug: import.meta.env.DEV
}

// Não vou entrar no assunto namespaces, nem em configurações mais complexas
// O objetivo é simplicidade

i18n
  .use(initReactI18next) // Usa o pacote do i18n específico para React
  .init(i18nConfig) // Usa nossas configurações

export default i18n
