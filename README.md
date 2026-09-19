# GO Nexus

Guias e ferramentas para sua jornada no Pokémon GO.

## Estrutura
- `index.html` — página inicial / central de ferramentas
- `guia-busca.html` — Guia de Busca
- `calculadora.html` — Vale a Caixa?
- `efeitos-aventura.html` — Efeitos Aventura
- `poeira-estelar.html` — Poeira Estelar
- `evolucoes-especiais.html` — Evoluções Especiais
- `formas-especiais.html` — Formas Especiais, custos e Energia de Fusão
- `central-mega.html` — catálogo de Megaevoluções, Megaenergia e Meganíveis
- `central-max.html` — Dinamax, Gigamax e calculadora de Movimentos Max
- `nav.js` — cabeçalho, menu de ferramentas e rodapé compartilhados

## Estrutura compartilhada
O cabeçalho e o rodapé são definidos em `nav.js` e isolados com Shadow DOM. No desktop, o cabeçalho mantém uma navegação compacta; no celular, adapta a disposição sem alterar a identidade visual. O menu **Ferramentas** concentra as páginas para permitir que o GO Nexus cresça sem lotar o cabeçalho.

## Regra de interface
A interface do GO Nexus segue o princípio **“Resumo visível. Detalhes expansíveis. Rolagem mínima.”**

- Conteúdo essencial fica imediatamente visível.
- Explicações, listas extensas, fontes e observações ficam em seções expansíveis quando isso reduz a rolagem sem esconder o acesso à informação.
- Buscas e filtros abrem automaticamente apenas as seções relevantes.
- No celular, grupos expansíveis relacionados evitam manter várias áreas longas abertas ao mesmo tempo.
- Conteúdo já existente deve ser reorganizado, não removido, salvo quando uma informação estiver incorreta ou tiver sido substituída por uma versão verificada.

As Centrais **Mega** e **Max** priorizam explicação e consistência visual. Elas não usam artes externas de Pokémon: o foco é explicar as mecânicas, custos, progressão, dificuldade e disponibilidade de forma simples e compacta.

## Autoria
Desenvolvido por **DelorisNyx** · Código de amizade: **8596 0928 0640**

## Direitos autorais e uso
© 2026 Evandro Ferreira. Todos os direitos reservados.

O código-fonte e o conteúdo original do GO Nexus são disponibilizados publicamente para fins de consulta e funcionamento do projeto.

Não é autorizada a reprodução, redistribuição, republicação, modificação ou utilização deste projeto, total ou parcialmente, em outros sites, aplicações ou serviços sem autorização prévia do autor.

GO Nexus é um projeto independente criado para a comunidade de Pokémon GO e não possui afiliação, patrocínio ou vínculo oficial com The Pokémon Company, Nintendo, Niantic ou Scopely.

Pokémon, Pokémon GO e demais marcas, personagens, imagens e elementos relacionados pertencem aos seus respectivos titulares.


## Guia de Busca bilíngue
- O `guia-busca.html` usa Português (Brasil) por padrão e permite alternar para English.
- A busca local encontra filtros pelos dois idiomas, e o botão de copiar usa o idioma selecionado.
- Filtros principais foram revisados com a Central de Ajuda do Pokémon GO; filtros avançados não documentados oficialmente são sinalizados na interface.


## Ajuste visual e de Formas Especiais
- Seletor de idioma do Guia de Busca com acentos discretos inspirados nas cores do Brasil e dos EUA.
- Zygarde usa imagens específicas das formas 10%, 50% e Completa.
- Zygarde agora mostra separadamente os custos para subir, voltar e subir novamente.


## Centrais Mega e Max
- A Central Mega mostra no catálogo apenas Megaevoluções já lançadas no Pokémon GO; próximas estreias oficiais podem aparecer em destaque e entram na lista somente na data do lançamento.
- Mega Staraptor usa a data de 19/09/2026 para atualizar automaticamente seu estado visual de “chega amanhã/hoje” para “disponível”.
- A Central Mega inclui calculadora de Megaenergia e acompanhamento dos Meganíveis, incluindo o Super Nível Máximo.
- A Central Max mantém Dinamax e Gigamax em uma ferramenta própria, lista linhas Max disponíveis, formas Gigamax lançadas e não lançadas e calcula custos de Movimentos Max.
