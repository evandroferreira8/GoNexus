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
const SEARCH_STOP_WORDS = new Set([
  'fundo','fundos','background','backgrounds','colecao','album','pokemon',
  'evento','eventos','em','no','na','nos','nas','de','do','da','dos','das',
  'e','a','o','as','os','um','uma','uns','umas','para','por','com','que',
  'foi','foram','tem','teve','tinha','aconteceu','ocorreu','ocorreram',
  'realizado','realizados','realizada','realizadas','aconteceram','acontecer','acontecido','acontecidos','ocorreram','ocorrido','ocorridos','existem','existe','disponivel','disponiveis','lancado','lancados','lancadas','saiu','sairam','realizou','realizaram','distribuido','distribuidos','apareceu','apareceram','onde','qual','quais',
  'meu','minha','meus','minhas','seu','sua','seus','suas','buscar','busca',
  'pesquisar','pesquisa','mostra','mostrar','quero','todos','todas',
  'the','of','in','at','on','to','and','for','from','by','is','are',
  'el','la','los','las','del','en','y','por','para'
]);
const normalizeSearch = value => normalize(value).replace(/[^a-z0-9]+/g,' ').trim();
const SEARCH_CACHE = new WeakMap();
const CONTINENT_ALIASES = {
  'america do norte':['north america','north american'],
  'america do sul':['south america','south american'],
  'asia':['asia','asian'],
  'europa':['europe','european'],
  'oceania':['oceania','oceanian']
};
function eventSearchAliases(item) {
  const source=normalizeSearch([item.name,item.event,...(item.aliases||[])].join(' '));
  const aliases=[];
  const add=(...values)=>aliases.push(...values);
  if(source.includes('city safari'))add('safari urbano','safari da cidade','safari nas cidades');
  if(source.includes('go wild area'))add('area selvagem','natureza selvagem','wild area');
  if(source.includes('safari zone'))add('zona safari','zona de safari');
  if(source.includes('go fest'))add('festival go','festival global pokemon go');
  if(source.includes('go tour'))add('tour pokemon go','turne pokemon go');
  if(source.includes('stamp rally'))add('rally de selos','rali de selos','rally de carimbos');
  if(source.includes('pokemon center'))add('centro pokemon','loja pokemon');
  if(source.includes('national trust'))add('patrimonio historico','jardins historicos');
  if(source.includes('dia de muertos')||source.includes('dia dos mortos'))add('day of the dead','mexico','mexicano');
  if(source.includes('festival of lights')||source.includes('festival das luzes'))add('diwali','india');
  if(source.includes('pokemon night')||source.includes('night out'))add('noite pokemon');
  if(source.includes('pokemon baseball')||source.includes('npb'))add('beisebol','baseball','liga japonesa de beisebol');
  if(source.includes('mlb'))add('beisebol','baseball','major league baseball');
  if(source.includes('nfl'))add('futebol americano','american football');
  if(source.includes('mundial')||source.includes('world championship'))add('pokemon worlds','campeonato mundial','worlds');
  if(source.includes('comic con'))add('convencao de quadrinhos','cultura pop');
  return aliases;
}
function searchDocument(item) {
  if(SEARCH_CACHE.has(item))return SEARCH_CACHE.get(item);
  const location=item.location||{};
  const continentAliases=CONTINENT_ALIASES[normalizeSearch(location.continent)]||[];
  const categoryAliases=item.category==='location'
    ?['localizacao','regional','presencial','local','location']
    :['especial','special'];
  const values=[
    item.id,item.name,item.event,...(item.aliases||[]),...(item.pokemon||[]),
    item.availability,item.year,item.releaseDate,item.category,item.status,
    location.place,location.city,location.admin,location.country,location.continent,
    ...(location.aliases||[]),...continentAliases,...(item.searchTerms||[]),
    ...categoryAliases,...eventSearchAliases(item)
  ];
  const normalized=normalizeSearch(values.filter(Boolean).join(' '));
  const tokens=new Set(normalized.split(' ').filter(Boolean));
  const doc={normalized,tokens};
  SEARCH_CACHE.set(item,doc);
  return doc;
}
function oneEditAway(a,b) {
  if(a===b)return true;
  if(Math.abs(a.length-b.length)>1)return false;
  let i=0,j=0,edits=0;
  while(i<a.length&&j<b.length){
    if(a[i]===b[j]){i++;j++;continue;}
    if(++edits>1)return false;
    if(a.length===b.length&&i+1<a.length&&j+1<b.length&&a[i]===b[j+1]&&a[i+1]===b[j]){
      i+=2;j+=2;continue;
    }
    if(a.length>b.length)i++;
    else if(b.length>a.length)j++;
    else{i++;j++;}
  }
  if(i<a.length||j<b.length)edits++;
  return edits<=1;
}
function queryTerms(value) {
  const raw=normalizeSearch(value).split(' ').filter(Boolean);
  if(!raw.length)return [];
  const useful=raw.filter(term=>!SEARCH_STOP_WORDS.has(term));
  return useful;
}
function matchesSearchTerm(term,doc) {
  if(term.length<=3)return doc.tokens.has(term);
  if(doc.normalized.includes(term))return true;
  if(term.length<6)return false;
  for(const token of doc.tokens)if(oneEditAway(term,token))return true;
  return false;
}
export function filterItems(items, filters, ids, today) {
  const owned = new Set(ids), query = queryTerms(filters.query);
  return items.filter(item => {
    const doc=searchDocument(item);
    return query.every(word=>matchesSearchTerm(word,doc)) &&
      (!filters.category || item.category===filters.category) &&
      (!filters.year || String(item.year)===filters.year) &&
      (!filters.event || normalizeSearch([item.event,...(item.aliases||[])].join(' ')).includes(normalizeSearch(filters.event))) &&
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
