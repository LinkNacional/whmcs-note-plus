export const ListState = {
  IN_PROGRESS: 1,
  ARCHIVED: 2
}

export const CardState = {
  IN_PROGRESS: 1,
  ARCHIVED: 2
}

export const CardReferType = {
  CLIENT: 1,
  INVOICE: 2,
  DOMAIN: 3,
  TICKET: 4
}

export const CardReferLabels = {
  [CardReferType.CLIENT]: 'client',
  [CardReferType.INVOICE]: 'invoice',
  [CardReferType.DOMAIN]: 'domain',
  [CardReferType.TICKET]: 'ticket'
}

export const CardReferIdLinkTemplates = {
  [CardReferType.CLIENT]: 'clientssummary.php?userid={id}',
  [CardReferType.INVOICE]: 'invoices.php?action=edit&id={id}',
  [CardReferType.DOMAIN]: 'clientsdomains.php?id={id}',
  [CardReferType.TICKET]: 'supporttickets.php?action=view&id={id}'
}
