/**
 * Standard Banco Central do Brasil (Bacen) PIX EMV-QRCPS BR Code Generator
 */

function getCRC16(payload: string): string {
  let crc = 0xffff;
  const polynomial = 0x1021;
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let bit = 0; bit < 8; bit++) {
      if ((crc & 0x8000) !== 0) {
        crc = (crc << 1) ^ polynomial;
      } else {
        crc = crc << 1;
      }
      crc &= 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

function formatField(id: string, value: string): string {
  const len = String(value.length).padStart(2, '0');
  return `${id}${len}${value}`;
}

export function generatePixBRCode(
  key: string,
  name: string = 'ZARVIC PLAY',
  city: string = 'BRASILIA',
  amount?: number,
  txid: string = '***'
): string {
  const cleanKey = key.trim();
  // Remove accents and special chars for Bacen compatibility
  const cleanName =
    name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toUpperCase()
      .slice(0, 25) || 'ZARVIC PLAY';

  const cleanCity =
    city
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toUpperCase()
      .slice(0, 15) || 'BRASILIA';

  const cleanTxid = txid.slice(0, 25) || '***';

  const merchantAccountInfo = formatField('00', 'br.gov.bcb.pix') + formatField('01', cleanKey);
  const additionalDataField = formatField('05', cleanTxid);

  let raw =
    formatField('00', '01') +
    formatField('26', merchantAccountInfo) +
    formatField('52', '0000') +
    formatField('53', '986');

  if (amount && amount > 0) {
    raw += formatField('54', amount.toFixed(2));
  }

  raw +=
    formatField('58', 'BR') +
    formatField('59', cleanName) +
    formatField('60', cleanCity) +
    formatField('62', additionalDataField) +
    '6304';

  const crc = getCRC16(raw);
  return raw + crc;
}
