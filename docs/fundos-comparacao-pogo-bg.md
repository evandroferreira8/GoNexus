# Comparação do catálogo com psoren/pogo-bg

Conferência em **8 de novembro de 2026**, preservando o corte editorial do catálogo em **7 de novembro**. Referência: [psoren/pogo-bg](https://github.com/psoren/pogo-bg), commit `50dd39505a40e46ea6d20d2f50a63f334310f500`. O campo `generated` do conjunto informa **2026-08-31**; isto descreve a versão consultada, não a data de lançamento dos fundos.

## Resultado

| Medida | Total |
| --- | ---: |
| Tipos no GO Nexus | 264 |
| Registros de fundo na referência | 240 |
| Arquivos de imagem referenciados e existentes | 240 |
| Arquivos com hashes SHA-256 distintos | 240 |
| Registros da referência com identidade associada | 240 |
| Tipos distintos do GO Nexus cobertos pelas associações | 237 |
| Tipos do GO Nexus sem equivalente nessa referência | 27 |
| Registros da referência sem associação de identidade | 0 |
| Grupos com mais de um registro de referência para o mesmo tipo | 2 |

Os 264 fundos são **259 lançados, 4 anunciados e 1 não confirmado**. Correspondência de identidade não é certificação da imagem final nem autorização de reprodução. As 240 relações foram conferidas por evento, local, ano e variantes nomeadas; cinco imagens ambíguas receberam inspeção visual específica. As outras 235 estão explicitamente marcadas `visualReview: not-reviewed` e precisam de inspeção antes do uso editorial.

O mapa completo e os hashes estão em [fundos-imagens-mapeamento.json](fundos-imagens-mapeamento.json). `referenceImagePath` é relativo à raiz da referência; `localPath` aponta para o WebP integrado no GO Nexus. Por solicitação expressa do responsável pelo projeto foram produzidos 237 arquivos de até 512 px e 237 miniaturas de até 200 px, em qualidade WebP 82/76. Todos os registros usam `status: locally-integrated-pending-permission` e `approvedLocalPath: null`; isto registra a integração, sem alegar licença ou autorização dos titulares.

## Registros sobrepostos e camadas

| Tipo preservado no GO Nexus | IDs da referência | Decisão |
| --- | --- | --- |
| Caminho das Lendas • GO Fest 2026 (`sp-10-aniversario-go-fest-2026`) | `roadoflegends`; `gofest2026global` | Mesmo tipo: um exemplo composto e uma camada base bege. Foi selecionado roadoflegends, sem alteração da arte; a camada isolada não reproduz a apresentação final. |
| Mewtwo • GO Fest 2026 (`sp-mewtwo-go-fest-2026`) | `mewtwo`; `megamewtwo`; `gofest2026mewtwo` | Mesmo tipo, com efeito de Mega Evolução e camada base. As duas capturas compostas incluem relógio e indicadores do celular. Para exibição foi escolhida mewtwo, com corte quadrado [64, 128, 448, 512] que remove a interface superior; a imagem resultante tem 384 × 384 px. |

Não há duplicatas binárias: são 240 hashes diferentes. Há, entretanto, **três registros excedentes quando a unidade é o tipo de fundo colecionável**. O [anúncio oficial de Road of Legends](https://pokemongo.com/news/road-of-legends-2026) situa esses lançamentos em julho de 2026 e descreve o efeito adicional de Mega Evolução do fundo de Mewtwo. A referência informa 2025 em alguns destes registros; esse ano não foi transplantado ao catálogo. Os IDs publicados do GO Nexus foram preservados ao corrigir o nome de exibição para Caminho das Lendas.

## Itens do GO Nexus sem imagem correspondente nesta versão

**Especiais (7):** Dança ao Luar 2026; Patterns of the Wild 2026; GO Wild Area 2026 (anunciado); Horizontes Pokémon 2026; Día de Muertos 2026; Mundial 2026 • Tinkaton; Festival das Luzes 2026.

**Museus ESA (6):** Science Museum • Londres; Cité de l’espace • Toulouse; Deutsches Museum • Nuremberg; Museu de les Ciències • Valência; Space Expo • Noordwijk; Euro Space Center • Transinne.

**City Safari 2026 (6):** Lisboa; Marselha; Munique; Brisbane; Rio de Janeiro; Boston (adiado, mantido como anunciado).

**Outros locais (8):** Los Angeles • Night Out 2026; Londres • Night Out 2026 (anunciado); Sendai • Tohoku • GO Wild Area 2026; Cidade do México • GO Wild Area 2026; ANA • Jato Verde; PokéXciting! • Bangkok (anunciado); FC Seoul 2026; Málaga • Comic-Con 2026.

A ausência nessa versão da referência não significa que a imagem não existe no jogo. Tampouco esta comparação demonstra exaustividade mundial: podem faltar fundos em ambos os conjuntos.

## Diferenças de nomes e revisão de datas

- Nomes traduzidos foram associados sem substituir IDs estáveis: London/Londres, New York City/Nova York, Cologne/Colônia, The Hague/Haia, Wormhole/Ultrafenda, Radiance/Radiância e Team/Equipe.
- Clubes e estádios apontam ao mesmo fundo quando a identidade coincide: Belluna/Saitama Seibu Lions, Kyocera/ORIX Buffaloes, Zozo Marine/Chiba Lotte Marines e demais clubes NPB. National Trust também usa pares como Belton House/Belton Estate, Hanbury/Hanbury Hall e Wimpole/Wimpole Estate.
- `taipeifloralpicnic2016` contém erro no rótulo: o próprio intervalo da referência é de 2026. Foi associado ao Floral Picnic 2026, sem adicionar “2016” como alias de busca.
- `pokexcitingphippines` contém erro de grafia. Foi associado a Manila/Filipinas; o erro não foi adotado como nome do fundo.
- `festivalofcolors` foi associado ao Festival das Cores 2026. O [anúncio oficial](https://pokemongo.com/news/festival-of-colors-2026) confirma a distribuição com fundo de 4 a 8 de março de 2026; o valor inicial de 2025 da referência não foi utilizado.
- As duas artes da EXPO Osaka e as duas de Méga Évolution Paris continuam separadas. Mudanças de Pokémon ou evoluções não criam novos cartões.
- Tampa Bay • Tropicana Field 2026 era uma lacuna do catálogo e foi acrescentado por confirmação independente do [anúncio oficial MLB 2026](https://pokemongo.com/news/mlb-2026), que lista 13 de setembro e o fundo de Pikachu. O [comunicado do estádio](https://www.mlb.com/press-release/rays-return-to-tropicana-field-for-a-three-team-nine-game-homestand-against-the-astros-athletics-and-red-sox) confirma a ação no Tropicana Field. É diferente de Steinbrenner Field 2025.
- Busan • Festival de Fogos continua `unconfirmed`: localizar um asset na referência não comprova sua distribuição.

## Origem e autorização das imagens

O [README da referência](https://github.com/psoren/pogo-bg/blob/50dd39505a40e46ea6d20d2f50a63f334310f500/README.md) explica a combinação de informações de Serebii e DittoBase, com imagens obtidas via PokeMiners. A árvore verificada não contém arquivo LICENSE; a ausência de licença não concede direito de redistribuição. Também não foi identificada uma licença de PokeMiners que conceda direitos sobre a arte de Pokémon GO. Uma eventual licença do código ou anuência do autor do agregador, isoladamente, não comprova permissão sobre imagens de terceiros.

A referência foi utilizada para uma **concordância factual de IDs, nomes e caminhos**. As descrições de eventos, listas de Pokémon e janelas de disponibilidade não foram copiadas para o catálogo. Por solicitação expressa do responsável pelo projeto, 237 imagens representativas da referência foram convertidas em WebP e incorporadas ao portal, junto de 237 miniaturas. Os JPEGs originais não foram incluídos na distribuição e nenhum hotlink foi habilitado. A autorização aplicável dos titulares continua pendente: `authorizationStatus: pending` no catálogo e `redistributionApproved: false` no mapa. Arquivos relacionados mas não selecionados apontam ao representante da mesma identidade, com `selectedForDisplay: false`; não foram convertidos separadamente. A aprovação da publicação pelo responsável pelo projeto não é apresentada como licença da arte de terceiros.
