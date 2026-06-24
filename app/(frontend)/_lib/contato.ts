// Contatos e redes da GBA — centralizado num lugar só.
export const WHATSAPP_NUMERO = '5562996546707' // +55 62 99654-6707
export const INSTAGRAM_URL = 'https://www.instagram.com/guilherme_borges._/'
export const STRAVA_URL = 'https://strava.app.link/zsiVgU1wb4b'

/** Monta um link wa.me com a mensagem já codificada pra URL. */
export function whatsappLink(mensagem: string): string {
  return `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensagem)}`
}

/** Mensagem pra contato geral (CTA principal, footer). */
export const WHATSAPP_MSG_GERAL =
  'Olá, Guilherme! Quero saber mais sobre a assessoria de corrida da GBA.'

/** Mensagem personalizada por plano. */
export function whatsappMsgPlano(nome: string, precoFmt: string): string {
  return `Olá, Guilherme! Quero começar minha assessoria de corrida no plano *${nome}* (R$ ${precoFmt}). Pode me passar os próximos passos?`
}
