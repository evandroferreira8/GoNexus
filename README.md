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


## Easter egg cósmico — versão corrigida e auditada

- As imagens da experiência cósmica foram separadas do `nav.js`. O ovo continua visível, mas as artes completas só carregam no primeiro toque, por meio de `cosmos.js` e cinco arquivos `cosmos-assets-*.js`. Os caminhos são relativos, compatíveis com GitHub Pages.
- Corrigido o comportamento do balão do ovo em telas touch: ele não permanece aberto sobre o conteúdo da página.
- Refinado o alinhamento do cabeçalho da experiência cósmica em desktop e mobile.
- As informações dos Pokémon continuam aparecendo junto ao Pokémon selecionado, em popover contextual.
- Auditoria de regressão: as páginas e scripts da base estável foram preservados; fora desta documentação, apenas `nav.js` foi alterado.


## Correção — Poeira Estelar (19/09/2026)

- Adicionado **Chimecho** à faixa de **1.000 Poeira Estelar** por captura.
- Removido **Drampa** dessa faixa: a recompensa base de captura atual é 100 Poeira Estelar, não 1.000.
- Índice da busca global regenerado após a correção.


## Revisão responsiva definitiva do Easter Egg — 19/09/2026

- Revelação de Arceus compactada no celular para que título, introdução e abas apareçam mais cedo.
- Abas Origem, Lendários e Míticos passam a ocupar três colunas equilibradas no mobile.
- Grupos de Lendários não usam mais rolagem horizontal: os Pokémon são exibidos em grade responsiva.
- Nomes dos Pokémon podem quebrar linha e não são mais cortados em telas estreitas.
- A instrução de toque virou um marcador compacto junto ao título da seção.
- O fundo estrelado foi suavizado no mobile para preservar legibilidade.
- O cartão de lore continua aparecendo junto do Pokémon selecionado e agora se reposiciona durante a rolagem em vez de desaparecer.


## Atualização extra
- Easter egg com nova aba **Companheiro** dentro da cosmogonia.
- Quiz de 5 perguntas para revelar qual Lendário ou Mítico combina mais com a pessoa.
- Botões para **compartilhar**, **salvar card**, **copiar resultado** e **refazer teste**.


## Refinamento visual do quiz Companheiro
- Interface do quiz refinada para mobile e desktop.
- Resultado com arte maior, halo do Pokémon e hierarquia visual mais forte.
- Card compartilhável redesenhado em 1080×1350 (4:5), ideal para feed e mensageiros.
- O card continua sendo gerado localmente no navegador.

## Ajuste visual extra

- Aba **Quiz do Companheiro** recebeu título mais forte e brilho visual mais evidente para destacar a experiência.


## Refinamento profundo do resultado
- Arte do companheiro usa PNGs transparentes individuais em alta qualidade, sem recorte quadrado do sprite sheet.
- Resultado no site ganhou mais respiro, aura limpa e hierarquia refinada.
- Card 1080×1350 passou a ser full-bleed, sem quadro externo, com composição mais editorial e espaçamento equilibrado.


## Ovo — orientação de interação
- O primeiro toque agora revela uma mensagem explícita pedindo um novo toque.
- O segundo toque avisa que o ovo está prestes a eclodir e orienta o terceiro toque.
- O aviso funciona também em telas touch e mostra progresso visual 1/3 e 2/3.


## Ditto e Disfarces
- Nova aba **Ditto e Disfarces** em Formas e Variações.
- Lista regular de disfarces revisada para setembro de 2026.
- Minijogo **Onde está o Ditto?**: um card esconde Ditto a cada rodada, com animação de transformação, contador de tentativas e chance lúdica de Ditto Brilhante.
- As imagens dos disfarces ficam incorporadas diretamente na página, sem depender de uma pasta externa de imagens.
- A chance de Ditto Brilhante do minijogo é apenas recreativa e não reproduz a taxa real do Pokémon GO.

## Refinamento de tipografia — Ditto e Disfarces
- Textos explicativos, títulos, dicas, status, cards e notas da nova seção receberam tamanhos mais confortáveis no desktop e no celular.
- Os nomes dos Pokémon foram ampliados sem alterar a grade ou a mecânica do minijogo.
- A aba responsiva ganhou tipografia ligeiramente maior no mobile.

## Ajuste da lista de Ditto
- A seção agora mostra apenas os disfarces atuais de Ditto reportados para setembro de 2026.
- Referências a listas temporárias de eventos foram removidas da interface.


## Correção de imagens e exportação
- As artes do quiz Companheiro são mantidas nos arquivos `cosmos-assets-*.js`, carregados somente quando a experiência cósmica é aberta.
- Artes do minijogo Ditto ficam incorporadas em `formas-especiais.html`, eliminando dependência de `assets/ditto/`.
- Salvamento do card foi reforçado para navegadores móveis, com geração em PNG validada antes do download.
- Removido um bloco antigo de CSS que voltava a colocar moldura pesada atrás da arte do companheiro.

## Auditoria e manutenção — 12/10/2026

- **Vale a Caixa?**: o resultado exige preço preenchido; limites de quantidade e valor evitam travamentos.
- **Central Max**: custo dos Doces com seleção por grupos A–D; níveis objetivos inferiores ao atual não escondem o total das outras linhas. Os custos excepcionais (por exemplo, Eternatus) não são calculados pelo modelo padrão.
- **Busca**: padronizada a tag portuguesa de traje.
- **Notícias**: fluxo oficial restaurado em `.github/workflows/update-news.yml`. Roda duas vezes ao dia, pode ser acionado manualmente e preserva os últimos dados se a fonte estiver indisponível.
- **Busca global**: `scripts/build_search_index.py` atualiza textos visíveis e preserva palavras-chave dinâmicas; não duplica o conteúdo a cada execução.
- **Publicação**: a rotina `.github/workflows/check-site.yml` testa sintaxe, caminhos locais e interações em telas de computador e celular por meio do Playwright.
- **Publicidade**: o carregador evita reinjetar o script do AdSense quando ele já está na página.
- **Desempenho**: `nav.js` foi reduzido em aproximadamente 84% ao separar a experiência cósmica; a observação global contínua do tema foi removida.

O conteúdo editorial de Pokémon GO pode mudar conforme novos eventos e versões do jogo. A atualização automática de notícias não substitui a conferência manual de listas de Pokémon, valores de itens e mecânicas especiais.
