// Pure collection logic: IDs, never array positions, are persisted and shared.
export const STORAGE_KEY = 'go-nexus:backgrounds:v1';
export const BACKUP_KEY = `${STORAGE_KEY}:backup`;
export const MAX_FILE_SIZE = 500000;
export const emptyCollection = () => ({format:'go-nexus-backgrounds',version:1,trainer:'',obtained:[]});
export function validateCollection(value) {
  if (!value || value.format !== 'go-nexus-backgrounds' || value.version !== 1 ||
      !Array.isArray(value.obtained) || value.obtained.length > 5000 ||
      (value.trainer !== undefined && (typeof value.trainer !== 'string' || value.trainer.length > 40)) ||
      value.obtained.some(id => typeof id !== 'string' || !/^[a-z0-9][a-z0-9-]{0,119}$/.test(id))) {
    throw new Error('Arquivo de coleção inválido ou versão não compatível. Use um JSON exportado pelo GO Nexus.');
  }
  return {...emptyCollection(), trainer:value.trainer || '', obtained:[...new Set(value.obtained)]};
}
export function parseCollection(text) {
  if (typeof text !== 'string' || text.length > MAX_FILE_SIZE) throw new Error('Arquivo muito grande. O limite é 500 KB.');
  let value;
  try { value = JSON.parse(text); } catch { throw new Error('Não foi possível ler este JSON. Nenhuma marcação foi alterada.'); }
  return validateCollection(value);
}
export const normalize = text => String(text || '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
// Require traceable, same-site assets; provenance is not a copyright license.
export function localImage(image) {
  const validPath=value=>typeof value==='string'&&/^assets\/fundos\/[a-z0-9/-]+\.(?:webp|jpg|png)$/.test(value)&&!value.includes('..');
  return image && image.provenanceReference && validPath(image.src) && validPath(image.thumbnail) ? image : null;
}
export function released(item, today = new Date().toISOString().slice(0,10)) {
  return item.status === 'released' && (!item.releaseDate || item.releaseDate <= today);
}
export function progress(items, ids, today) {
  const owned = new Set(ids), available = items.filter(item => released(item,today));
  const count = list => {
    const obtained = list.filter(item => owned.has(item.id)).length;
    return {total:list.length,obtained,remaining:list.length-obtained,percent:list.length?Math.round(obtained/list.length*1000)/10:0};
  };
  return {...count(available),categories:Object.fromEntries(['special','location'].map(category=>[category,count(available.filter(item=>item.category===category))]))};
}
export function filterItems(items, filters, ids, today) {
  const owned = new Set(ids), query = normalize(filters.query).trim().split(/\s+/).filter(Boolean);
  return items.filter(item => {
    const text = normalize([item.name,item.event,...(item.aliases||[]),...(item.pokemon||[])].join(' '));
    return query.every(word=>text.includes(word)) && (!filters.category || item.category===filters.category) &&
      (!filters.year || String(item.year)===filters.year) && (!filters.event || item.event===filters.event) &&
      (!filters.ownership || (filters.ownership==='owned'?owned.has(item.id):!owned.has(item.id))) &&
      (!filters.status || (filters.status==='released'?released(item,today):!released(item,today)));
  }).sort((a,b)=>filters.sort==='name'?a.name.localeCompare(b.name,'pt-BR'):
    filters.sort==='oldest'?(a.releaseDate||'9999').localeCompare(b.releaseDate||'9999')||a.id.localeCompare(b.id):
    (b.releaseDate||'0000').localeCompare(a.releaseDate||'0000')||a.id.localeCompare(b.id));
}
export function mergeCollections(current, incoming) {
  return validateCollection({...current,trainer:current.trainer||incoming.trainer,obtained:[...new Set([...current.obtained,...incoming.obtained])]});
}
export function exportCollection(collection, catalogVersion) {
  return JSON.stringify({...validateCollection(collection),catalogVersion,exportedAt:new Date().toISOString()},null,2);
}
export function encodeShare(collection) {
  const bytes = new TextEncoder().encode(JSON.stringify(validateCollection(collection)));
  const encoded = btoa(Array.from(bytes,byte=>String.fromCharCode(byte)).join('')).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
  if(encoded.length>16000) throw new Error('Esta coleção é grande para um link confiável. Compartilhe a imagem ou o arquivo JSON.');
  return `#colecao=${encoded}`;
}
export function decodeShare(hash) {
  if (!hash.startsWith('#colecao=')) throw new Error('Link de coleção inválido.');
  const value=hash.slice(9);
  if (!value || value.length>16000 || !/^[A-Za-z0-9_-]+$/.test(value)) throw new Error('Link de coleção inválido ou muito grande.');
  try {
    const bytes = Uint8Array.from(atob(value.replace(/-/g,'+').replace(/_/g,'/')),c=>c.charCodeAt(0));
    return parseCollection(new TextDecoder('utf-8',{fatal:true}).decode(bytes));
  } catch { throw new Error('Não foi possível abrir esta coleção. Confira se o link está completo.'); }
}
export function readCollection(storage, key=STORAGE_KEY) {
  const raw=storage.getItem(key);
  return raw===null?emptyCollection():parseCollection(raw);
}
// Write the backup first. A failed backup/primary write must never report success.
export function saveCollection(storage, next, {backup=false}={}) {
  const clean=validateCollection(next);
  if(backup) {
    const previous=storage.getItem(STORAGE_KEY);
    if(previous!==null) storage.setItem(BACKUP_KEY,previous);
    else storage.setItem(BACKUP_KEY,JSON.stringify(emptyCollection()));
  }
  storage.setItem(STORAGE_KEY,JSON.stringify(clean));
  return clean;
}
