const config = {
  requestUrl: import.meta.env.DEV ? 'https://whmcs.criarsite.online/cliente/modules/addons/lknnoteplus/api.php' : window.lknNotePlus.config.apiUrl
}

async function request(endpoint, data = {}) {
  data.a = endpoint

  return await fetch(
    config.requestUrl,
    {
      method: 'POST',
      body: JSON.stringify(data)
    }
  )
}


export const requestLists = async () => {
  return await request('list:index')
}

export const requestNewCardSearch = async (search, filter) => {
  return await request('card:new-card-search', { search, filter })
}

export const requestCreateCard = async (listId, referId, referType) => {
  return await request('card:create', { listId, referId, referType })
}

export const requestCreateList = async (name) => {
  return await request('list:create', { name })
}

export const requestUpdateList = async ({ listId, name = null, state = null }) => {
  return await request('list:update', { listId, name, state })
}

export const requestCardShow = async (cardId) => {
  return await request('card:show', { cardId })
}

export const requestArchivedLists = async () => await request('list:index:archived')

export const requestUnarchiveList = async () => await (request('list:update:unarchive'))

export const requestArchivedCard = async () => await request('cards:index:archived')
export const requestCards = async () => await request('card:index')
export const requestUpdateCard = async ({ cardId, state = null, note = null }) => await request('card:update', { cardId, state, note })
export const requestCreateNote = async ({ cardId, clientId, note }) => await request('note:create', { cardId, clientId, note })
export const requestSearchMention = async ({ search }) => await request('card:search-mention', { search })
export const requestNotes = async () => await request('note:index')
