# Protocolo de auditoria e correção — GO Nexus

Esta branch é **exclusivamente diagnóstica**. Nenhuma alteração produzida aqui é publicada na página principal.

## Referências imutáveis

- Antes da primeira reformulação 2.0: commit `676614b53a49ca825e61cbdec35f53a8c00584ad`.
- Versão atual: código de onde partiu esta branch, sempre com SHA identificado no relatório.
- A referência antiga é uma **fonte para recuperar comportamento e conteúdo**, não uma ordem de copiar a aparência antiga.

## Etapa 1 — Censo de todos os módulos

Inventariar 15 páginas HTML, componentes compartilhados (`nav.js`, `theme.css`, `monetization.js`, `theme.js`) e experiências opcionais (`cosmos.js`). Anotar para cada componente: função, aparência original, aparência 2.0, mudança intencional, regressão, gravidade e responsável.

## Etapa 2 — Evidências automáticas comparáveis

- Executar **ambas as versões localmente** com a mesma versão de Chromium.
- Capturar topo, rolagem e estados interativos nas larguras **360, 390 e 1365 px**.
- Repetir o procedimento para todas as 15 páginas, sem exigir prints enviados pelo usuário.
- Salvar capturas e dados técnicos no artefato do GitHub Actions por 14 dias.
- Medir sobreposição com menus e barra inferior, overflow horizontal, cores computadas, scripts com erros e banners internos visíveis.
- Validar contraste WCAG AA por inspeção automatizada adicional quando o fundo for opaco e unívoco; em gradientes, revisar com imagem real.

## Etapa 3 — Testar estados, não apenas página aberta

- Home: busca sem texto, com resultados e sem resultados; cards; notícias; rolagem.
- Ovo: estilo original, ícone visível, **sem balão permanente**, abrir, fechar, voltar ao foco e não encobrir navegação.
- Combate: espécies, tipos, clima, resultados e falha de consulta externa.
- Guia de Busca: filtros, geração e cópia.
- Vale a Caixa: preço ausente, preenchimento, mudança de moeda, ofertas com itens não precificados.
- Poeira Estelar: filtros, bônus e cálculos.
- Mega e Max: troca de seleção, cálculos, colapso/expansão, valores inválidos.
- Evoluções, formas, Ditto, efeitos e Poképaradas: filtros, cards, expansão e compartilhamento onde houver.
- Quiz: começar, responder, avançar e concluir.
- Mobile: navegação inferior, foco e teclado, menus, toques e rolagem.

## Etapa 4 — Diagnóstico de origem, não remendo

Classificar problemas em:
- **Estilos globais abrangentes:** classes genéricas (.card, .hero, .panel, .mode) sobrescrevem semânticas diferentes.
- **Componentes legados:** mantiveram CSS/HTML próprio e não foram migrados ao sistema Studio.
- **Componentes flutuantes:** ovo, balão, overlays e botões competem com navegação ou texto.
- **Falhas comportamentais:** filtros, cálculo, cópia, compartilhamento e erro de API.
- **Conteúdo e leitura:** excesso de texto, conteúdo truncado, contrastes, fontes e tamanhos.
- **Publicidade:** distinguir publicidade real do AdSense de banners autopromocionais internos.

## Etapa 5 — Correções agrupadas e auditáveis

1. Corrigir a **base do design system** e limitar CSS por escopo/raiz do módulo.
2. Restaurar o **componente original do ovo** e aplicar tratamento não intrusivo. Não apenas trocar o PNG por uma figura genérica.
3. Migrar cada ferramenta por lote pequeno com classes de componente estáveis e variáveis tipográficas.
4. Preservar a lógica JS, recursos, filtros e dados que passaram nos testes.
5. Acrescentar testes específicos **antes** de cada correção para impedir reincidência.

Todas as alterações acontecem em outra branch de desenvolvimento; **nunca diretamente na versão pública**.

## Etapa 6 — Critérios para publicar

- Zero falhas de JavaScript que impeçam funções.
- Zero sobreposições de ações flutuantes com a navegação inferior; nenhum balão fixo encobrindo conteúdo.
- Nenhum título ou texto com contraste ilegível; WCAG AA para texto normal quando aplicável.
- Zero páginas com rolagem horizontal involuntária em 360/390 px.
- Busca, quiz, calculadoras, filtros e compartilhamento aprovados nos fluxos principais.
- Capturas antes/depois comparadas e checklist assinado por ferramenta, em desktop e celular.
- **Publicação única** depois de toda a rodada, seguida de nova verificação do GitHub Pages.

## Princípio

Passar em testes de execução não equivale a qualidade de interface. A auditoria exige ambas: **comportamento + visual**. Divergência entre temas não implica automaticamente erro; defeitos são definidos por legibilidade, continuidade funcional, organização e intenção do design.
