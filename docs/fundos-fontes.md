# Coleção de Fundos — fontes e manutenção

Revisão editorial: **7 de novembro de 2026**. O catálogo entregue é um recorte verificável, não uma afirmação de que todos os fundos do jogo foram inventariados. Há **264 registros: 259 lançados, 4 anunciados e 1 não confirmado**. São 49 especiais e 215 de localização. O total do progresso significa “fundos lançados presentes neste catálogo”.

## Origem e permissões

- A referência solicitada, [DittoBase](https://www.dittobase.com/pokemon-go/backgrounds), foi examinada para entender a organização da ferramenta. Seus [termos, seções 12 e 14](https://www.dittobase.com/terms), proíbem coleta automatizada em massa e a republicação substancial sem autorização escrita. **Não foi importada sua base, não foram chamados seus endpoints internos e nenhum endpoint interno foi consultado. Na etapa posterior, a pedido expresso do responsável pelo projeto, imagens da referência pogo-bg foram convertidas e incorporadas localmente; a autorização dos titulares permanece pendente.**
- O levantamento histórico usa [Backgrounds, dos colaboradores da Pokémon GO Wiki](https://pokemongo.fandom.com/wiki/Backgrounds). O [rodapé da wiki](https://pokemongo.fandom.com/wiki/Pok%C3%A9mon_GO_Wiki) declara CC BY-SA; a licença padrão do Fandom é CC BY-SA 3.0. A adaptação deste catálogo é oferecida sob [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/), uma versão posterior compatível para adaptações. A atribuição abrange os colaboradores da wiki; o [histórico da página](https://pokemongo.fandom.com/wiki/Backgrounds?action=history) identifica as contribuições. Foram alteradas a organização, a redação, a língua, a nomenclatura, as datas revistas e a classificação de disponibilidade.
- Anúncios do Pokémon GO e da The Pokémon Company complementam os fatos recentes, com links por registro. As descrições do GO Nexus são resumos factuais próprios, não transcrições de artigos.
- A [política da Bulbapedia](https://bulbapedia.bulbagarden.net/wiki/Bulbapedia:Copyrights) estabelece CC BY-NC-SA. Seu texto e tabelas não foram incorporados como base reutilizável em razão da restrição não comercial e da presença de publicidade no portal.
- Nenhuma licença geral de reutilização das **imagens do jogo** foi confirmada. Por solicitação expressa do responsável pelo projeto, 237 registros agora usam imagens locais WebP derivadas da referência pogo-bg; todos declaram `authorizationStatus: "pending"`. Os outros 27 mantêm `image: null` e ilustrações abstratas próprias, identificadas como ilustrativas. A solicitação de publicação não equivale à autorização dos titulares.
- A licença CC BY-SA aplica-se ao arquivo **fundos-catalogo.json**, não relicencia os demais arquivos do portal, não confere licença sobre marcas nem sobre imagens de terceiros. Manter atribuição e licença quando redistribuir o catálogo.

## Fontes primárias usadas para revisão

Os links completos constam em `sources` em cada registro. Entre as principais:

- [Road to Kalos](https://pokemongo.com/news/road-to-kalos-event) e [GO Tour: Kalos Global](https://pokemongo.com/en/gotour/global): fundos Gold, Silver, Ruby, Sapphire, Diamond, Pearl, X, Y e Mega.
- [Detalhes finais do GO Fest 2026](https://pokemongo.com/news/go-fest-2026-global-final-details): fundo Caminho das Lendas separado do fundo de Mewtwo. O [anúncio Road of Legends](https://pokemongo.com/news/road-of-legends-2026) confirma 2026 e descreve o efeito adicional de Mega Evolução como variação do mesmo fundo.
- [LEGO em Copenhague](https://pokemongo.com/news/gofest-2026-copenhagen-lego): início em 12/06; datas de inserção dos assets não são datas de disponibilidade.
- [Arraiá 2026](https://pokemongo.com/pt-BR/news/festa-junina-2026): Tauros de Paldea da Espécie Aquática no Brasil.
- [National Trust](https://pokemongo.com/news/nationaltrust-2026): 27 fundos locais, a partir de 18/07.
- [Pokémon Center Stamp Rally](https://shop.pokemon.co.jp/ja/shop/common/events/202606/000336.html): lojas japonesas, a partir de 01/07.
- [NPB](https://pokemongo.com/news/nippon_pro_baseball) e [All-Star Game](https://pokemongo.com/news/allstar): 12 clubes e Toyama; Tokyo Dome reutiliza o fundo do Yomiuri Giants.
- [Museus ESA](https://pokemongo.com/news/european-space-agency-event): início em 04/10, não a data de disponibilização de imagens nos assets.
- [PokéXciting! Stamp Rally](https://pokemongo.com/en/news/event-apac-stamp-rally-2026): quatro localidades desde 12/09; Bangkok ainda sem início confirmado do rally.
- [City Safari Boston](https://pokemongo.com/news/boston-city-safari-know-before-you-go): evento adiado. Não contar automaticamente como lançado porque a data originalmente anunciada passou.
- [Night Out](https://pokemongo.com/news/pokemon-night-out-irl-details2026): Los Angeles em 24/10; Londres anunciado para 10/11.
- [GO Wild Area 2026](https://pokemongo.com/news/get-ready-for-gowildarea-2026): separar os fundos locais do especial global e não confundir liberação no perfil com primeira captura.

## Critérios e limites editoriais

1. Um registro representa **um tipo de fundo**, não uma combinação fundo/Pokémon. Evoluções, formas e Pokémon diferentes não multiplicam o checklist.
2. Uma nova arte da mesma cidade em um evento diferente pode ser um registro distinto. A reutilização comprovada da mesma arte mantém um só registro. Foram consolidados Miami Marlins 2024/2025, Seattle Mariners 2024/2025, reedições dos fundos de equipes, Mega Evolução e Tokyo Dome All-Stars.
3. Nomes de exibição são editoriais em português. `aliases` guarda nomes em inglês e grafias alternativas, como Wormhole/Ultrafenda, Duel/Dual Destiny e Gibslide/Gibside. Eles não geram cartões duplicados.
4. `releaseDate` é ISO `AAAA-MM-DD` somente quando há dia documentado suficiente; `null` mantém o ano quando conhecido. Nos Poké Lid de 2026, por exemplo, não foi inventado 1º de janeiro.
5. `released` significa que houve distribuição, não que o fundo continua obtenível hoje. `announced` fica fora do denominador, inclusive um evento adiado. `unconfirmed` não representa lançamento comprovado.
6. `pokemon` é uma lista **exemplificativa de espécies documentadas**, nunca uma garantia de exaustividade. Arrays vazios significam que a lista não foi validada nesta revisão. `pokemonScope: "examples"` e `pokemonNote` explicitam esse limite.
7. O artigo histórico da wiki consultado estava parcialmente defasado em 2026. Anúncios oficiais corrigiram várias datas e estados. Ainda faltam validações de ações regionais recentes, por exemplo eventuais reedições esportivas de 2026, Poké Lid Nagano e possíveis novas variantes regionais. Tampa Bay 2026 foi incluído após confirmação independente no anúncio oficial da MLB. Não criar registros por suposição nem anunciar a base como exaustiva.
8. A arte antiga não utilizada de Pyeongchang não entra como item obtível. Busan Fireworks permanece não confirmado. Dados sem fonte suficiente ficam fora até revisão.
9. O catálogo não consulta terceiros em tempo de uso. Os links de fonte são abertos somente por iniciativa do visitante.

## Atualizações sem perder coleções

- **Nunca renomear nem reciclar `id` publicado**, mesmo ao corrigir o nome de exibição, evento ou data. Os IDs atuais foram criados a partir dos nomes iniciais, mas são identificadores fixos a partir da publicação.
- Adicionar novos itens com novos IDs e conferir duplicidade pela arte/tipo do fundo e suas fontes, não apenas pelo nome da cidade.
- Conservar IDs antigos se algum item for suspenso ou reclassificado; não apagar marcações desconhecidas na importação/exportação.
- Para fusão de dois registros duplicados, implementar uma migração explícita de IDs na ferramenta antes de remover um deles. `aliases` são nomes de busca, não migrações de IDs.
- Confirmar uma distribuição em fonte confiável antes de trocar `announced`/`unconfirmed` por `released`. A passagem do calendário não é confirmação suficiente.
- Registrar a fonte e atualizar `updatedAt` ao revisar. Registrar autorização/licença específica e atribuição exigida para cada imagem; o conjunto atual está publicado por solicitação do responsável, com direitos ainda pendentes.
- Exibir aviso de cobertura e atribuição da wiki no produto. O percentual é relativo à base local em sua versão atual; ele pode cair ao serem acrescentados novos fundos, sem apagar nada da coleção.

## Comparação com a referência indicada pelo usuário

O repositório [psoren/pogo-bg](https://github.com/psoren/pogo-bg) foi examinado localmente para conferir identidades e caminhos de imagens. Seu conjunto de 240 registros corresponde a 237 tipos de fundo do GO Nexus; 27 itens do catálogo não têm equivalente nessa versão. A revisão e a origem de cada correspondência estão em [fundos-comparacao-pogo-bg.md](fundos-comparacao-pogo-bg.md) e [fundos-imagens-mapeamento.json](fundos-imagens-mapeamento.json). Não foi importada a base de eventos, espécies ou descrições do repositório.

A cópia local de trabalho da referência foi usada para inspeção e conversão de 237 imagens representativas e 237 miniaturas WebP. O repositório não apresenta licença que autorize a redistribuição dos assets; as correspondências usam `locally-integrated-pending-permission`, com `approvedLocalPath: null`. `localPath` informa apenas o arquivo integrado, sem alegar aprovação de direitos. A integração foi solicitada expressamente pelo responsável pelo projeto; os direitos dos titulares continuam pendentes.
