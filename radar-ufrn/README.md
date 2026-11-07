# Radar 100% UFRN — consulta manual (experimental)

Ferramenta opcional para o GO Nexus, sem assinatura e sem consultas periódicas.

## Funcionamento

1. O usuário abre a página Radar 100% UFRN no GO Nexus e clica em Pesquisar Pokémon 100%.
2. A extensão local do Brave abre https://pogocoordinates.com/map.
3. Ela tenta preencher a busca com as coordenadas do Campus Central da UFRN e aciona o botão normal de pesquisa.
4. Examina apenas respostas JSON que essa visita já receberia; não acessa endpoints privados nem faz consultas periódicas.
5. O painel filtra IV 100% dentro do raio de 1,8 km, elimina duplicações e distingue ausência de resultados de dados inconclusivos.
6. Se habilitado pelo usuário, o ntfy pode enviar notificações após a pesquisa manual.

## Instalação no Brave

- Baixe o ZIP da extensão gerado no workflow Validar protótipo Radar UFRN e extraia para uma pasta local.
- Abra brave://extensions, ative Modo do desenvolvedor, escolha Carregar sem compactação e selecione a pasta que contém manifest.json.
- No ícone da extensão, configure opcionalmente o canal ntfy, sem compartilhá-lo.
- Abra o radar dentro do GO Nexus publicado e clique em Pesquisar Pokémon 100%; depois volte à página para ver o resultado.

## Limitações

- Protótipo ainda não validado com dados reais do mapa no Brave. Nenhum resultado só deve ser mostrado quando houver dados suficientes.
- O PoGo Coordinates não oferece a este projeto uma API formal. A extensão processa somente uma pesquisa iniciada pelo usuário, sem extração em massa ou republicação.
- A pesquisa funciona no computador com Brave e extensão instalada. O GO Nexus sozinho, inclusive no celular, não consegue acessar dados privados de outro domínio.
- Os marcadores do serviço de origem podem ser aproximados.
- A extensão não pede login do Pokémon GO.
- Os testes antigos de monitoramento contínuo não estão ativos.
