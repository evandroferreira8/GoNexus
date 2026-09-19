# GO Nexus — Tipagens + Poképaradas

Versão do GO Nexus com duas novas áreas:

- **Tipagens** — guia visual para entender vantagens, desvantagens, fraquezas e resistências.
- **Poképaradas** — guia prático para indicação de Wayspots / Poképaradas sem complicar.

## O que foi feito

### 1) Nova página: `tipagens.html`
- Visual mais forte e chamativo, alinhado com a identidade já usada no GO Nexus.
- Dois modos de consulta:
  - **Atacando**: mostra contra quem cada tipo é forte ou fraco.
  - **Defendendo**: mostra fraquezas e resistências de tipos simples e duplos.
- Botões grandes para toque no celular.
- Resumo rápido por tipo em sanfona para reduzir rolagem.

### 2) Nova página: `pokeparadas.html`
- Explica o básico da indicação de Poképaradas / Wayspots.
- Traz visão prática de critérios, passo a passo, boas práticas e erros comuns.
- Inclui um analisador rápido do tipo “Esse lugar tem cara de Poképarada?”.
- Estrutura em sanfonas para mostrar só o que a pessoa quiser abrir.

### 3) Atualização da navegação
- As duas novas páginas entraram no menu compartilhado em `nav.js`.
- A página inicial (`index.html`) ganhou cartões novos e agora mostra **10 ferramentas**.

### 4) Ajustes de acessibilidade e celular
- Texto-base maior nas páginas novas.
- Botões e áreas clicáveis maiores.
- Layout pensado para diminuir rolagem excessiva.
- Sanfonas para esconder conteúdo secundário até o clique.

## Arquivos principais novos
- `tipagens.html`
- `pokeparadas.html`

## Observação
As informações da página de Poképaradas foram organizadas como **guia prático**, não como promessa de aprovação. A análise final continua dependendo dos critérios do Wayfarer e das regras de inclusão do Pokémon GO.

## Revisão de acessibilidade móvel

Esta versão também recebeu uma passada global de leitura no celular:

- texto corrido com alvo de **16 px ou mais** em telas estreitas;
- textos auxiliares e metadados com alvo de **14 px ou mais**;
- campos e botões com texto maior e área de toque mínima próxima de **44 px**;
- foco de teclado mais visível;
- cabeçalhos e espaçamentos verticais mais compactos para reduzir rolagem;
- a Central Mega ganhou um único bloco compacto para os três passos iniciais no celular;
- a Central Max também recebeu uma abertura mais densa, sem sacrificar legibilidade.
