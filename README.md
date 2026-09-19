# GO Nexus — Busca Global + Novidades Automáticas

Esta versão preserva as 10 ferramentas, o Quiz de 80 perguntas e acrescenta duas melhorias na página inicial.

## 1. Busca global

A Home agora possui uma busca que procura conteúdo em todas as 10 ferramentas e também no Quiz.

Exemplos de busca:

- `shiny`
- `Zygarde`
- `Gigamax`
- `Poképarada`
- `Megaenergia`
- `Poeira Estelar`

O arquivo `search-index.json` contém o índice utilizado pela busca. O script `scripts/build_search_index.py` recria esse índice a partir das páginas HTML do projeto.

## 2. Eventos e novidades

No final da Home há um carrossel com as cinco publicações mais recentes da página oficial de notícias do Pokémon GO em português.

Cada cartão mostra apenas:

- imagem de destaque;
- título;
- indicação de fonte oficial;
- link para abrir a matéria original no site do Pokémon GO.

O GO Nexus não republica o conteúdo das notícias.

## 3. Atualização automática pelo GitHub Actions

O workflow `.github/workflows/update-news.yml` roda duas vezes por dia e também pode ser iniciado manualmente.

Ele:

1. acessa `https://pokemongo.com/pt-BR/news`;
2. identifica as cinco publicações mais recentes;
3. abre cada notícia para obter título e imagem de destaque;
4. atualiza `news.json`;
5. recria `search-index.json`;
6. faz commit somente se houver mudanças.

O script foi feito para manter o último `news.json` válido caso o site oficial fique temporariamente indisponível ou mude de estrutura.

## Arquivos novos desta versão

- `news.json`
- `search-index.json`
- `scripts/update_news.py`
- `scripts/build_search_index.py`
- `.github/workflows/update-news.yml`

## Observação sobre GitHub Actions

Para a atualização automática funcionar, o GitHub Actions precisa estar habilitado no repositório. O workflow já solicita `contents: write` para poder salvar as alterações em `news.json` e `search-index.json`.

## Direitos autorais e uso

© 2026 Evandro Ferreira. Todos os direitos reservados.

O código-fonte e o conteúdo original do GO Nexus são disponibilizados publicamente para fins de consulta e funcionamento do projeto.

Não é autorizada a reprodução, redistribuição, republicação, modificação ou utilização deste projeto, total ou parcialmente, em outros sites, aplicações ou serviços sem autorização prévia do autor.

GO Nexus é um projeto independente criado para a comunidade de Pokémon GO e não possui afiliação, patrocínio ou vínculo oficial com The Pokémon Company, Nintendo, Niantic ou Scopely.

Pokémon, Pokémon GO e demais marcas, personagens, imagens e elementos relacionados pertencem aos seus respectivos titulares.

## Revisão técnica da busca global

A busca também indexa o texto usado para montar listas dinâmicas em JavaScript. Isso permite encontrar nomes que não aparecem no HTML inicial — por exemplo, espécies presentes nas listas da Central Mega e da Central Max — sem exibir código no trecho mostrado ao usuário.


## Ajustes de interface — 19/09/2026

- **Vale a Caixa?** ganhou o campo “Pokémoedas que você já tem”, cálculo de quanto falta para o combo, saldo restante e sugestão da combinação mais barata de pacotes para completar o saldo.
- **Superpoção** e **Hiperpoção** foram adicionadas à lista de itens como itens sem preço individual oficial.
- Corrigido o vazamento do card “3. Veja a chance acumulada” no mobile em **Formas e Variações**.
- Corrigida a imagem de **Persian de Alola** em **Poeira Estelar**.


## Easter egg — O Ovo Original

O site possui um easter egg visual no canto inferior esquerdo. O ovo cósmico muda de estado nos dois primeiros toques e, no terceiro, revela a cosmogonia Pokémon. A experiência usa os adesivos enviados para Arceus, Lendários e Míticos e organiza a lore em três painéis visuais: **Origem**, **Lendários** e **Míticos**.

A árvore é apresentada como uma **árvore mítica**, não como parentesco biológico literal. O núcleo de Sinnoh foi conferido em fontes oficiais da franquia.


## Easter egg — revisão visual definitiva v2

- Ovo redesenhado com referência visual aos ovos de Reide de Pokémon GO: formato mais redondo, casca clara, padrões geométricos, brilho discreto e paleta inspirada em Arceus (dourado, branco/cinza e verde).
- Pokémon clicáveis recebem uma aura neon discreta para comunicar interatividade sem poluir a interface.
- A informação de cada Pokémon agora aparece em um pequeno pop-up ancorado ao lado do card clicado; no celular, ele aparece imediatamente acima ou abaixo do Pokémon, evitando que o usuário precise procurar texto no fim da seção.
- Os antigos painéis de informação no rodapé das abas ficam ocultos.


## Easter egg — versão final com ovo inspirado no Pokémon GO

- O ovo anterior foi descartado e substituído pelo **ovo aprovado pelo usuário**, baseado no formato visual dos ovos do Pokémon GO e nas cores de Arceus.
- A terceira interação agora possui uma sequência de eclosão mais lenta, com cerca de 2,7 segundos de transição antes da cosmogonia.
- Lendários e Míticos receberam notas de lore revisadas e mais precisas, priorizando Pokédex e páginas oficiais Pokémon.
- A seção de Lendários foi expandida com núcleos de Kanto, Johto, Hoenn, Titãs, Sinnoh, Unova, Alola, Galar/Hisui e Paldea/Kitakami.
- Pokémon clicáveis usam uma aura neon discreta baseada em suas próprias cores. Ao selecionar, o destaque aumenta e a informação aparece imediatamente ao lado do Pokémon.
- O mapa continua sendo **mitológico/temático**, não uma árvore genealógica biológica literal.
