# GO Nexus 2.0 — revisão estratégica e sistema de identidade

**Data:** 12 de outubro de 2026  
**Nome da direção visual:** Field System  
**Status:** reformulação de arquitetura de informação e design, sem romper funcionalidades existentes.

## Diagnóstico

A versão anterior mostrava dez ferramentas quase com o mesmo peso, repetia ícones e gradientes coloridos em excesso, e colocava carrosséis e destaques editoriais antes da busca. A navegação usava um cabeçalho grande, e o ovo da experiência cósmica levava centenas de KB como prévia mesmo antes do primeiro toque.

O problema central não era a quantidade de ferramentas; era a falta de hierarquia. A versão 2.0 começa com tarefas concretas, depois aprofunda o planejamento, mantém guias secundários e oferece descoberta e novidades no fim.

## Decisões de produto

| Ferramenta | Decisão | Por quê |
|---|---|---|
| Central de Combate | **Priorizar** | Resolve dúvidas imediatas, por espécie e tipo. |
| Guia de Busca | **Priorizar** | É uma ferramenta utilitária que gera comandos copiáveis. |
| Vale a Caixa? | **Priorizar** | Permite decidir gastos e oferece comparação objetiva. |
| Poeira Estelar | **Priorizar** | Cálculo recorrente com escolha de Pokémon e bônus. |
| Central Mega | **Manter em planejamento** | Mecânica relevante, mas não precisa ocupar a primeira dobra. |
| Central Max | **Manter em planejamento** | Evolução de movimentos e custos requerem conferência periódica. |
| Evoluções Especiais | **Manter em planejamento** | Consulta pontual com requisitos e cards úteis. |
| Formas e Variações | **Manter, simplificar navegação no futuro** | Conteúdo amplo; Ditto e minijogo são recursos opcionais, não foco da home. |
| Efeitos Aventura | **Manter como guia** | Útil, porém menos frequente que combate e busca. |
| Poképaradas | **Manter como guia** | Fonte de referência, não ferramenta prioritária. |
| Quiz (80 perguntas) | **Manter em Explorar** | Material de aprendizado/entretenimento, sem competir com utilidades. |
| Pokémon do dia | **Manter em Explorar** | Destaque rotativo editorial, não deve parecer evento em tempo real. |
| Notícias oficiais | **Manter em Atualizações** | Ajudam a descoberta, com link original e atualização automática. |
| Experiência cósmica | **Manter como descoberta opcional da home** | Continua divertida, mas não precisa ser baixada em todas as páginas. |
| Publicidade | **Manter de forma discreta** | O site prioriza o uso; retirar cards autopromocionais da leitura. |

Nenhuma ferramenta principal foi excluída. Excluir agora geraria perda de capacidade sem evidência de pouco uso. Mudanças futuras devem usar dados reais de navegação e feedback.

## Identidade / Design tokens

- **Linguagem:** painel de campo, leitura editorial, orientação à tarefa, visual contemporâneo e independente das artes oficiais do jogo.
- **Fundo:** `#0b171b` | **Superfície:** `#14262a` | **Elevado:** `#1b3437`
- **Off-white:** `#f4f5ec` | **Lima funcional:** `#c5f277`
- **Teal complementar:** `#73ddd0` | **Âmbar de aviso:** `#ffbd77`.
- **Outfit:** headings, marca e títulos de cards.
- **DM Sans:** texto, botões, formulários e navegação.
- **IBM Plex Mono:** indicadores, números e legendas técnicas.
- Contraste e focos visíveis. Preferência por movimento reduzido respeitada.
- Estilos compartilhados em `theme.css`, com regras específicas da home em `home-v2.css`.

**Referência conceitual:** Linear (precisão, densidade informacional, economia de ornamentos). O GO Nexus não copia sua identidade, sua paleta ou seus componentes.

## Arquitetura 2.0

1. Acesso direto a tarefas + busca global.
2. Ferramentas essenciais.
3. Planejamento (Mega/Max/Evoluções/Formas).
4. Guias de referência.
5. Explorar: quiz e Pokémon do dia.
6. Novidades do projeto e notícias oficiais.

Cabeçalho e rodapé padronizados. Navegação possui menu com dez ferramentas, breadcrumbs nas páginas internas e botão de voltar ao topo. A experiência cósmica é inicializada apenas na página principal.

## Métricas para a próxima revisão

Não temos métricas suficientes para afirmar quais ferramentas são mais populares. Medir **busca utilizada**, **visitas a cada ferramenta**, **abandono de formulários** e **relatos de erro**, observando privacidade e consentimento quando necessário.

## Manutenção que continua necessária

O site tem dados que mudam com eventos, versões do jogo e loja. Mecanismos com números fixos (preços, Mega/Max, recompensas, disfarces de Ditto, evoluções e Efeitos Aventura) exigem auditoria editorial recorrente. A versão 2.0 renova a interface, mas não deve se apresentar como uma base de dados totalmente sincronizada em tempo real.

A rotina de notícias por GitHub Actions permanece separada das bases editoriais. Testes automatizados precisam passar antes da publicação.
