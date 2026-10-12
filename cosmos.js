(() => {
  "use strict";
  const baseStyles=window.__GO_NEXUS_BASE_STYLES || '';
  if(!window.__GNX_COSMOS_ASSETS || window.__GNX_COSMOS_ASSETS.length!==11)throw new Error('Artes da experiência cósmica não carregadas');
  // Easter egg cósmico do GO Nexus — versão final.
  // A experiência usa uma árvore mítica/temática, não uma genealogia biológica literal.
  class GoNexusCosmicEgg extends HTMLElement {
    connectedCallback(){
      if(this.shadowRoot) return;

      // Imagens do easter egg embutidas no próprio nav.js para evitar falhas de caminho
      // ao publicar pelo GitHub Pages. Isso elimina dependência da pasta assets/easter-egg.
      const EGG_DATA=window.__GNX_COSMOS_ASSETS[0];
      const ARCEUS_DATA=window.__GNX_COSMOS_ASSETS[1];
      const SPRITE_DATA=window.__GNX_COSMOS_ASSETS[2];
      const SPRITE_CELL=112,SPRITE_W=1120,SPRITE_H=1008;
      const SPRITE_POS={"articuno":[0,0],"azelf":[112,0],"calyrex":[224,0],"celebi":[336,0],"chi_yu":[448,0],"chien_pao":[560,0],"cobalion":[672,0],"cosmoem":[784,0],"cosmog":[896,0],"cresselia":[1008,0],"darkrai":[0,112],"deoxys":[112,112],"dialga":[224,112],"enamorus":[336,112],"entei":[448,112],"eternatus":[560,112],"fezandipiti":[672,112],"genesect":[784,112],"giratina":[896,112],"glastrier":[1008,112],"groudon":[0,224],"heatran":[112,224],"ho_oh":[224,224],"jirachi":[336,224],"keldeo":[448,224],"koraidon":[560,224],"kubfu":[672,224],"kyogre":[784,224],"kyurem":[896,224],"landorus":[1008,224],"latias":[0,336],"latios":[112,336],"lugia":[224,336],"lunala":[336,336],"magearna":[448,336],"manaphy":[560,336],"marshadow":[672,336],"melmetal":[784,336],"meloetta":[896,336],"meltan":[1008,336],"mesprit":[0,448],"mew":[112,448],"mewtwo":[224,448],"miraidon":[336,448],"moltres":[448,448],"munkidori":[560,448],"necrozma":[672,448],"ogerpon":[784,448],"okidogi":[896,448],"palkia":[1008,448],"pecharunt":[0,560],"phione":[112,560],"raikou":[224,560],"rayquaza":[336,560],"regice":[448,560],"regidrago":[560,560],"regieleki":[672,560],"regigigas":[784,560],"regirock":[896,560],"registeel":[1008,560],"reshiram":[0,672],"shaymin":[112,672],"solgaleo":[224,672],"spectrier":[336,672],"suicune":[448,672],"tapu_bulu":[560,672],"tapu_fini":[672,672],"tapu_koko":[784,672],"tapu_lele":[896,672],"terapagos":[1008,672],"terrakion":[0,784],"thundurus":[112,784],"ting_lu":[224,784],"tornadus":[336,784],"urshifu":[448,784],"uxie":[560,784],"victini":[672,784],"virizion":[784,784],"wo_chien":[896,784],"zacian":[1008,784],"zamazenta":[0,896],"zapdos":[112,896],"zarude":[224,896],"zekrom":[336,896],"zeraora":[448,896]};
      const lore={
        arceus:{name:'Arceus',tag:'O Original',glow:'250,204,21',text:'A tradição de Sinnoh diz que Arceus moldou tudo o que existe neste mundo. É o ponto central da cosmogonia mais conhecida da franquia.'},
        dialga:{name:'Dialga',tag:'Tempo',glow:'59,130,246',text:'Lendário de Sinnoh ligado ao tempo. Sua Forma Origem é descrita oficialmente como capaz de expandir, destruir e criar o próprio tempo.'},
        palkia:{name:'Palkia',tag:'Espaço',glow:'244,114,182',text:'Lendário de Sinnoh ligado ao espaço e capaz de distorcê-lo. A mitologia o descreve como uma divindade espacial.'},
        giratina:{name:'Giratina',tag:'Mundo Distorção',glow:'168,85,247',text:'Associado ao mundo do lado reverso do nosso, o Mundo Distorção. Sua lenda representa uma face diferente da criação de Sinnoh.'},
        uxie:{name:'Uxie',tag:'Conhecimento',glow:'250,204,21',text:'Conhecido como o Ser do Conhecimento. As lendas de Sinnoh o colocam, junto de Mesprit e Azelf, no equilíbrio espiritual do mundo.'},
        mesprit:{name:'Mesprit',tag:'Emoção',glow:'236,72,153',text:'Conhecido como o Ser da Emoção. Integra o trio dos lagos e simboliza a capacidade de sentir.'},
        azelf:{name:'Azelf',tag:'Vontade',glow:'56,189,248',text:'Conhecido como o Ser da Vontade. A Pokédex afirma que Uxie, Mesprit e Azelf teriam vindo do mesmo ovo.'},

        articuno:{name:'Articuno',tag:'Gelo',glow:'125,211,252',text:'Ave lendária capaz de controlar gelo. Diz-se que o bater de suas asas resfria o ar e pode provocar neve.'},
        zapdos:{name:'Zapdos',tag:'Trovão',glow:'250,204,21',text:'Ave lendária associada a tempestades elétricas. É descrita surgindo das nuvens e ganhando força com relâmpagos.'},
        moltres:{name:'Moltres',tag:'Fogo',glow:'251,113,133',text:'Ave lendária envolta em chamas. Sua passagem e suas asas flamejantes são ligadas ao fogo e à chegada da primavera em antigas histórias.'},
        mewtwo:{name:'Mewtwo',tag:'Ciência genética',glow:'167,139,250',text:'Pokémon criado por engenharia genética a partir de DNA ligado a Mew. A própria franquia o apresenta como resultado de experimentos científicos.'},

        raikou:{name:'Raikou',tag:'Relâmpago',glow:'250,204,21',text:'Fera lendária de Johto associada à velocidade do relâmpago e ao poder das tempestades.'},
        entei:{name:'Entei',tag:'Vulcões',glow:'248,113,113',text:'Fera lendária cuja força é associada ao magma e aos vulcões. Lendas dizem que seu rugido faz vulcões entrarem em erupção.'},
        suicune:{name:'Suicune',tag:'Água pura',glow:'56,189,248',text:'Fera lendária que percorre o mundo em busca de água limpa e possui a capacidade de purificar água contaminada.'},
        lugia:{name:'Lugia',tag:'Mares e tempestades',glow:'147,197,253',text:'Lendário de Johto que vive nas profundezas do mar. Seu enorme poder é associado a tempestades e ao controle de ventos intensos.'},
        ho_oh:{name:'Ho-Oh',tag:'Arco-íris e renascimento',glow:'251,191,36',text:'Lendário de Johto associado ao arco-íris. A tradição da Torre Queimada também o relaciona ao renascimento das três feras lendárias.'},

        latias:{name:'Latias',tag:'Empatia',glow:'251,113,133',text:'Lendário extremamente sensível às emoções humanas. Pode envolver o corpo com luz e alterar sua aparência.'},
        latios:{name:'Latios',tag:'Inteligência',glow:'96,165,250',text:'Lendário inteligente que entende a fala humana e pode compartilhar imagens do que viu ou imaginou por telepatia.'},
        kyogre:{name:'Kyogre',tag:'Mares',glow:'37,99,235',text:'A mitologia de Hoenn atribui a Kyogre a expansão dos mares. Seu conflito ancestral com Groudon é interrompido por Rayquaza.'},
        groudon:{name:'Groudon',tag:'Continentes',glow:'239,68,68',text:'A mitologia de Hoenn atribui a Groudon a expansão das terras. Seu confronto com Kyogre ameaça o equilíbrio natural.'},
        rayquaza:{name:'Rayquaza',tag:'Céu e equilíbrio',glow:'52,211,153',text:'Vive na camada de ozônio e surge como força de equilíbrio quando Groudon e Kyogre entram em conflito.'},

        regirock:{name:'Regirock',tag:'Titã de rocha',glow:'251,146,60',text:'Um dos titãs lendários. Seu corpo é formado por rochas de lugares diferentes, substituídas quando partes dele se quebram.'},
        regice:{name:'Regice',tag:'Titã de gelo',glow:'103,232,249',text:'Titã lendário cujo corpo é feito de gelo extremamente antigo, associado ao período glacial.'},
        registeel:{name:'Registeel',tag:'Titã de aço',glow:'148,163,184',text:'Titã lendário de corpo metálico incomum, endurecido ao longo de milhares de anos sob pressão subterrânea.'},
        regigigas:{name:'Regigigas',tag:'Continentes',glow:'163,230,53',text:'Uma lenda duradoura afirma que Regigigas arrastou continentes usando cordas. Também é ligado à criação de outros titãs.'},
        regieleki:{name:'Regieleki',tag:'Titã elétrico',glow:'250,204,21',text:'Titã composto quase totalmente de energia elétrica. Suas argolas são descritas como restrições impostas ao seu enorme poder.'},
        regidrago:{name:'Regidrago',tag:'Titã dragão',glow:'244,63,94',text:'Titã cujo corpo é composto de energia de dragão cristalizada. A tradição diz que Regigigas não conseguiu completar seu corpo.'},

        heatran:{name:'Heatran',tag:'Magma',glow:'251,113,133',text:'Lendário que habita cavernas vulcânicas. Sangue semelhante a magma circula por seu corpo de aço.'},
        cresselia:{name:'Cresselia',tag:'Lua crescente',glow:'244,114,182',text:'Lendário associado à lua crescente e a sonhos agradáveis. Suas penas são tradicionalmente ligadas ao fim de pesadelos.'},

        cobalion:{name:'Cobalion',tag:'Espadachim da Justiça',glow:'96,165,250',text:'Líder sereno dos Espadachins da Justiça. As lendas de Unova contam que protegeu Pokémon dos conflitos entre humanos.'},
        terrakion:{name:'Terrakion',tag:'Espadachim da Justiça',glow:'251,146,60',text:'Integrante dos Espadachins da Justiça, conhecido por força suficiente para romper enormes estruturas e defender Pokémon.'},
        virizion:{name:'Virizion',tag:'Espadachim da Justiça',glow:'74,222,128',text:'Integrante veloz dos Espadachins da Justiça, descrito enfrentando humanos para proteger Pokémon.'},
        tornadus:{name:'Tornadus',tag:'Ventos e tempestades',glow:'74,222,128',text:'Força da Natureza associada a ventos violentos e tempestades que atravessam regiões inteiras.'},
        thundurus:{name:'Thundurus',tag:'Trovões',glow:'96,165,250',text:'Força da Natureza associada a relâmpagos e tempestades. Suas descargas podem provocar incêndios e destruição.'},
        landorus:{name:'Landorus',tag:'Colheitas e solo',glow:'251,146,60',text:'Força da Natureza venerada por enriquecer o solo e favorecer colheitas após absorver energia do vento e do relâmpago.'},
        reshiram:{name:'Reshiram',tag:'Verdade',glow:'226,232,240',text:'Parte da lenda do dragão original de Unova. Reshiram se associa à verdade e escolhe aqueles que buscam um mundo verdadeiro.'},
        zekrom:{name:'Zekrom',tag:'Ideais',glow:'71,85,105',text:'Parte da lenda do dragão original de Unova. Zekrom se associa aos ideais e à construção de um mundo desejado.'},
        kyurem:{name:'Kyurem',tag:'O que restou',glow:'125,211,252',text:'Ligado ao mito do dragão original de Unova. Pode se fundir com Reshiram ou Zekrom, assumindo as formas Kyurem Branco ou Preto.'},

        tapu_koko:{name:'Tapu Koko',tag:'Guardião de Melemele',glow:'250,204,21',text:'Divindade guardiã de Melemele, curiosa e ligada ao relâmpago. Apesar do título de guardião, pode ser feroz quando provocada.'},
        tapu_lele:{name:'Tapu Lele',tag:'Guardião de Akala',glow:'244,114,182',text:'Divindade guardiã de Akala. Espalha escamas brilhantes que estimulam o corpo, mas seu poder pode ser perigoso em excesso.'},
        tapu_bulu:{name:'Tapu Bulu',tag:'Guardião de Ula’ula',glow:'74,222,128',text:'Divindade guardiã de Ula’ula que controla plantas. Prefere evitar conflitos, mas possui força devastadora.'},
        tapu_fini:{name:'Tapu Fini',tag:'Guardião de Poni',glow:'103,232,249',text:'Divindade guardiã de Poni, capaz de manipular água e névoa. É reverenciada e temida por quem se aproxima sem cautela.'},
        cosmog:{name:'Cosmog',tag:'Nebulosa',glow:'167,139,250',text:'Pequeno Pokémon lendário de corpo gasoso. Sua origem é misteriosa e ele pode abrir caminhos espaciais para escapar do perigo.'},
        cosmoem:{name:'Cosmoem',tag:'Protostrela',glow:'250,204,21',text:'Evolução extremamente densa de Cosmog. Sua forma funciona como uma etapa entre a nebulosa e Solgaleo ou Lunala.'},
        solgaleo:{name:'Solgaleo',tag:'Emissário do Sol',glow:'250,204,21',text:'Lendário de Alola venerado como emissário do sol. Pode atravessar Ultra Wormholes e liberar luz intensa.'},
        lunala:{name:'Lunala',tag:'Emissária da Lua',glow:'129,140,248',text:'Lendário de Alola venerado como emissário da lua. Absorve luz e também está ligado às Ultra Wormholes.'},
        necrozma:{name:'Necrozma',tag:'Luz',glow:'168,85,247',text:'Entidade lendária ligada à luz e ao Ultra Space. Busca luz como fonte de energia e pode fundir-se com Solgaleo ou Lunala.'},

        zacian:{name:'Zacian',tag:'Espada heroica',glow:'96,165,250',text:'Herói lendário de Galar. Absorve partículas metálicas para formar uma arma e, com Zamazenta, enfrentou a calamidade do Darkest Day.'},
        zamazenta:{name:'Zamazenta',tag:'Escudo heroico',glow:'248,113,113',text:'Herói lendário de Galar. Seu corpo protegido se torna um escudo e, com Zacian, enfrentou a calamidade do Darkest Day.'},
        eternatus:{name:'Eternatus',tag:'Darkest Day',glow:'236,72,153',text:'Lendário alienígena cuja energia está ligada ao fenômeno Dynamax e ao Darkest Day, antiga calamidade de Galar.'},
        kubfu:{name:'Kubfu',tag:'Treinamento',glow:'148,163,184',text:'Jovem Lendário treinado nas artes marciais. Evolui para Urshifu após superar um dos caminhos das torres de Galar.'},
        urshifu:{name:'Urshifu',tag:'Artes marciais',glow:'71,85,105',text:'Lendário mestre de artes marciais que assume dois estilos: Golpe Decisivo ou Golpes Fluidos, conforme seu treinamento.'},
        glastrier:{name:'Glastrier',tag:'Corcel de gelo',glow:'186,230,253',text:'Corcel lendário de força extrema. Seu frio intenso forma uma máscara de gelo descrita como muito mais dura que diamante.'},
        spectrier:{name:'Spectrier',tag:'Corcel espectral',glow:'139,92,246',text:'Corcel lendário que corre pela noite e absorve força vital de criaturas adormecidas. Prefere silêncio e isolamento.'},
        calyrex:{name:'Calyrex',tag:'Rei da colheita',glow:'167,139,250',text:'Lendário lembrado como antigo rei de Galar. É associado a colheitas abundantes e pode cavalgar Glastrier ou Spectrier.'},
        enamorus:{name:'Enamorus',tag:'Primavera e amor',glow:'244,114,182',text:'Força da Natureza registrada em Hisui. Sua chegada é associada ao fim do inverno, à primavera e ao florescimento da vida.'},

        wo_chien:{name:'Wo-Chien',tag:'Tabletes da Ruína',glow:'132,204,22',text:'A rancorosa memória de alguém punido por registrar os crimes de um rei teria envolvido tabletes de madeira e folhas, originando Wo-Chien.'},
        chien_pao:{name:'Chien-Pao',tag:'Espada da Ruína',glow:'186,230,253',text:'O ódio daqueles que morreram por uma espada antiga teria envolvido neve e os fragmentos da arma, dando origem a Chien-Pao.'},
        ting_lu:{name:'Ting-Lu',tag:'Vaso da Ruína',glow:'161,98,7',text:'O medo derramado em um antigo recipiente ritual teria se envolvido em terra e pedras, tomando a forma de Ting-Lu.'},
        chi_yu:{name:'Chi-Yu',tag:'Contas da Ruína',glow:'251,113,133',text:'A inveja acumulada em antigas contas teria ganhado vida como Chi-Yu, capaz de derreter rochas com chamas intensas.'},
        koraidon:{name:'Koraidon',tag:'Passado',glow:'248,113,113',text:'Lendário de Paldea estreitamente relacionado a um Pokémon Paradoxo do passado. Sua história é central em Pokémon Scarlet.'},
        miraidon:{name:'Miraidon',tag:'Futuro',glow:'139,92,246',text:'Lendário de Paldea estreitamente relacionado a um Pokémon Paradoxo do futuro. Sua história é central em Pokémon Violet.'},
        ogerpon:{name:'Ogerpon',tag:'Máscaras de Kitakami',glow:'74,222,128',text:'Lendária de Kitakami cuja história é ligada a quatro máscaras especiais. A verdade sobre ela contradiz a antiga lenda popular da região.'},
        okidogi:{name:'Okidogi',tag:'Corrente Tóxica',glow:'74,222,128',text:'Um dos “Três Leais” de Kitakami. Sua Toxic Chain ampliou sua força física e o liga diretamente à história de Pecharunt.'},
        munkidori:{name:'Munkidori',tag:'Corrente Tóxica',glow:'167,139,250',text:'Um dos “Três Leais” de Kitakami. Sua Toxic Chain estimulou o cérebro e lhe concedeu capacidades psíquicas.'},
        fezandipiti:{name:'Fezandipiti',tag:'Corrente Tóxica',glow:'244,114,182',text:'Um dos “Três Leais” de Kitakami. Sua Toxic Chain aumentou seu charme e está ligada à influência de Pecharunt.'},
        terapagos:{name:'Terapagos',tag:'Energia Terastal',glow:'56,189,248',text:'Lendário no centro do mistério do fenômeno Terastal. Sua carapaça armazena energia de todos os tipos e possui múltiplas formas.'},

        mew:{name:'Mew',tag:'DNA ancestral',glow:'244,114,182',text:'Pokémon Mítico cujo DNA contém material genético de muitas espécies. Por isso, cientistas da franquia o tratam como peça-chave para estudar a origem dos Pokémon.'},
        celebi:{name:'Celebi',tag:'Viagem no tempo',glow:'74,222,128',text:'Mítico que atravessa o tempo. Sua presença é associada a florestas saudáveis e à esperança de um futuro brilhante.'},
        jirachi:{name:'Jirachi',tag:'Desejos',glow:'250,204,21',text:'Mítico dos desejos. A tradição afirma que desperta por apenas sete dias a cada mil anos e pode realizar desejos nesse período.'},
        deoxys:{name:'Deoxys',tag:'DNA do espaço',glow:'248,113,113',text:'Mítico originado quando o DNA de um vírus extraterrestre sofreu mutação após exposição a um raio laser. Seu cristal atua como cérebro.'},
        phione:{name:'Phione',tag:'Deriva marinha',glow:'125,211,252',text:'Mítico marinho que deriva em mares quentes e sempre retorna ao lugar onde nasceu, por mais longe que tenha sido levado.'},
        manaphy:{name:'Manaphy',tag:'Vínculo',glow:'56,189,248',text:'Mítico marinho que nasce com uma capacidade extraordinária de criar laços com qualquer espécie de Pokémon.'},
        darkrai:{name:'Darkrai',tag:'Pesadelos',glow:'88,28,135',text:'Mítico que provoca pesadelos como mecanismo de defesa. É fortemente associado à lua nova e contraposto a Cresselia em várias histórias.'},
        shaymin:{name:'Shaymin',tag:'Gratidão',glow:'74,222,128',text:'Mítico conhecido como Pokémon Gratidão. Flores de Gracidea permitem sua transformação e a gratidão é o tema central de sua lenda.'},
        victini:{name:'Victini',tag:'Vitória e energia',glow:'251,113,133',text:'Mítico associado à vitória. Suas descrições afirmam que produz energia ilimitada e pode compartilhá-la com quem toca.'},
        keldeo:{name:'Keldeo',tag:'Espadachim',glow:'56,189,248',text:'Mítico ligado aos Espadachins da Justiça. Seu crescimento e sua Forma Resoluta representam treinamento, coragem e domínio da técnica.'},
        meloetta:{name:'Meloetta',tag:'Música e dança',glow:'74,222,128',text:'Mítico cuja voz e dança alteram as emoções de quem as presencia. Relic Song permite alternar entre as Formas Ária e Pirueta.'},
        genesect:{name:'Genesect',tag:'Paleozoico modificado',glow:'168,85,247',text:'Inseto antigo de cerca de 300 milhões de anos que foi modificado tecnologicamente pela Equipe Plasma e recebeu um canhão nas costas.'},
        magearna:{name:'Magearna',tag:'Alma artificial',glow:'226,232,240',text:'Mítico artificial construído por um cientista cerca de 500 anos atrás. Seu verdadeiro ser é o Soul-Heart, uma alma artificial.'},
        marshadow:{name:'Marshadow',tag:'Sombras',glow:'148,163,184',text:'Mítico que se esconde nas sombras de pessoas e Pokémon, observando movimentos para aprender e reproduzir suas técnicas.'},
        zeraora:{name:'Zeraora',tag:'Eletricidade',glow:'250,204,21',text:'Mítico que concentra eletricidade nas patas e usa campos magnéticos para atingir velocidades extremas.'},
        meltan:{name:'Meltan',tag:'Metal líquido',glow:'148,163,184',text:'Mítico de corpo metálico líquido. Dissolve ferro e outros metais no solo para absorvê-los e incorporá-los ao próprio corpo.'},
        melmetal:{name:'Melmetal',tag:'Metal ancestral',glow:'148,163,184',text:'Evolução de Meltan. Antigas tradições dizem que ressurgiu após cerca de 3.000 anos e possui a capacidade de produzir metal.'},
        zarude:{name:'Zarude',tag:'Floresta',glow:'74,222,128',text:'Mítico que vive em bandos dentro de florestas densas. As vinhas que se desprendem de seu corpo viram nutrientes para a vegetação.'},
        pecharunt:{name:'Pecharunt',tag:'Mochi e Correntes Tóxicas',glow:'168,85,247',text:'Mítico de Kitakami que produz mochi venenoso capaz de controlar quem o come. Sua história está diretamente ligada aos Três Leais.'}
      };

      const legendaryGroups=[
        {title:'Kanto · aves e ciência',members:['articuno','zapdos','moltres','mewtwo']},
        {title:'Johto · feras, céu e mar',members:['raikou','entei','suicune','lugia','ho_oh']},
        {title:'Hoenn · Eons e clima ancestral',members:['latias','latios','groudon','kyogre','rayquaza']},
        {title:'Titãs · elementos e continentes',members:['regirock','regice','registeel','regigigas','regieleki','regidrago']},
        {title:'Sinnoh · criação, lagos e sonhos',members:['dialga','palkia','giratina','uxie','mesprit','azelf','heatran','cresselia']},
        {title:'Unova · justiça, natureza e dragão original',members:['cobalion','terrakion','virizion','tornadus','thundurus','landorus','reshiram','zekrom','kyurem']},
        {title:'Alola · guardiões, luz e Ultra Space',members:['tapu_koko','tapu_lele','tapu_bulu','tapu_fini','cosmog','cosmoem','solgaleo','lunala','necrozma']},
        {title:'Galar e Hisui · heróis e soberanos',members:['zacian','zamazenta','eternatus','kubfu','urshifu','glastrier','spectrier','calyrex','enamorus']},
        {title:'Paldea e Kitakami · ruína e Terastal',members:['wo_chien','chien_pao','ting_lu','chi_yu','koraidon','miraidon','ogerpon','okidogi','munkidori','fezandipiti','terapagos']}
      ];
      const mythicals=['mew','celebi','jirachi','deoxys','phione','manaphy','darkrai','shaymin','victini','keldeo','meloetta','genesect','magearna','marshadow','zeraora','meltan','melmetal','zarude','pecharunt'];


      const companionProfiles={
        lugia:{name:'Lugia',type:'Lendário',title:'O guardião sereno',traits:['Equilíbrio','Proteção','Serenidade'],glow:'96,165,250',gradient:['#1d4ed8','#7c3aed'],desc:'Você transmite calma mesmo em momentos intensos. Costuma proteger as pessoas ao redor e prefere força com controle a exageros.',share:'Meu companheiro do GO Nexus é Lugia 🌊 · equilíbrio, proteção e serenidade.'},
        ho_oh:{name:'Ho-Oh',type:'Lendário',title:'A chama da esperança',traits:['Carisma','Renovação','Brilho'],glow:'251,146,60',gradient:['#ea580c','#dc2626'],desc:'Sua energia reacende o ânimo do grupo. Você inspira, levanta o astral e transforma recomeços em algo bonito.',share:'Meu companheiro do GO Nexus é Ho-Oh 🔥 · carisma, renovação e brilho.'},
        rayquaza:{name:'Rayquaza',type:'Lendário',title:'A presença majestosa',traits:['Liderança','Instinto','Grandeza'],glow:'34,197,94',gradient:['#0f766e','#16a34a'],desc:'Você tem presença forte e senso de direção. Quando age, costuma ir direto ao ponto e enxergar o panorama de cima.',share:'Meu companheiro do GO Nexus é Rayquaza 🐉 · liderança, instinto e grandeza.'},
        suicune:{name:'Suicune',type:'Lendário',title:'A pureza que acolhe',traits:['Sensibilidade','Intuição','Calma'],glow:'56,189,248',gradient:['#0369a1','#2563eb'],desc:'Você observa antes de agir e valoriza ambientes leves. Sua força aparece no cuidado, na escuta e na delicadeza.',share:'Meu companheiro do GO Nexus é Suicune 💧 · sensibilidade, intuição e calma.'},
        mew:{name:'Mew',type:'Mítico',title:'A curiosidade viva',traits:['Curiosidade','Versatilidade','Leveza'],glow:'244,114,182',gradient:['#db2777','#8b5cf6'],desc:'Você gosta de explorar possibilidades, aprender coisas novas e circular com naturalidade entre grupos, ideias e caminhos.',share:'Meu companheiro do GO Nexus é Mew ✨ · curiosidade, versatilidade e leveza.'},
        celebi:{name:'Celebi',type:'Mítico',title:'O coração da floresta',traits:['Cuidado','Harmonia','Esperança'],glow:'74,222,128',gradient:['#15803d','#0f766e'],desc:'Você tem um jeito gentil de fazer bem aos outros. Procura harmonia, respeita o tempo das coisas e valoriza vínculos genuínos.',share:'Meu companheiro do GO Nexus é Celebi 🌿 · cuidado, harmonia e esperança.'},
        jirachi:{name:'Jirachi',type:'Mítico',title:'O desejo que guia',traits:['Sonho','Doçura','Sutileza'],glow:'250,204,21',gradient:['#ca8a04','#d97706'],desc:'Você alimenta sonhos com delicadeza e constância. Tem um brilho discreto, mas marcante, que torna seus objetivos especiais.',share:'Meu companheiro do GO Nexus é Jirachi 🌠 · sonho, doçura e sutileza.'},
        darkrai:{name:'Darkrai',type:'Mítico',title:'O mistério profundo',traits:['Profundidade','Reserva','Intensidade'],glow:'168,85,247',gradient:['#6d28d9','#312e81'],desc:'Você é mais intenso do que parece à primeira vista. Prefere profundidade a superficialidade e costuma perceber nuances que passam despercebidas.',share:'Meu companheiro do GO Nexus é Darkrai 🌙 · profundidade, reserva e intensidade.'}
      };

      const companionAssetMap={
        lugia:window.__GNX_COSMOS_ASSETS[3],
        ho_oh:window.__GNX_COSMOS_ASSETS[4],
        rayquaza:window.__GNX_COSMOS_ASSETS[5],
        suicune:window.__GNX_COSMOS_ASSETS[6],
        mew:window.__GNX_COSMOS_ASSETS[7],
        celebi:window.__GNX_COSMOS_ASSETS[8],
        jirachi:window.__GNX_COSMOS_ASSETS[9],
        darkrai:window.__GNX_COSMOS_ASSETS[10]
      };
      const companionArt=(key,cls='')=>`<img ${cls?`class="${cls}"`:''} loading="eager" src="${companionAssetMap[key]}" alt="${companionProfiles[key]?.name||key}">`;
      const companionPriority=['lugia','ho_oh','rayquaza','suicune','mew','celebi','jirachi','darkrai'];
      const companionQuestions=[
        {q:'Em um evento do Pokémon GO, qual papel combina mais com você?',options:[
          {text:'Organizar a turma e manter tudo sob controle.',scores:{lugia:2,suicune:1}},
          {text:'Animar o grupo e levantar o astral.',scores:{ho_oh:2,jirachi:1}},
          {text:'Tomar a dianteira e puxar o ritmo.',scores:{rayquaza:2,darkrai:1}},
          {text:'Observar, explorar e descobrir coisas novas.',scores:{mew:2,celebi:1}}
        ]},
        {q:'Qual cenário parece mais com a sua energia?',options:[
          {text:'Oceano, vento e silêncio.',scores:{lugia:2,suicune:1}},
          {text:'Pôr do sol, luz quente e céu aberto.',scores:{ho_oh:2,rayquaza:1}},
          {text:'Floresta viva, fresca e acolhedora.',scores:{celebi:2,mew:1}},
          {text:'Noite, estrelas e um clima misterioso.',scores:{darkrai:2,jirachi:1}}
        ]},
        {q:'O que mais move você quando quer muito alguma coisa?',options:[
          {text:'Proteger quem está comigo.',scores:{lugia:2,suicune:1}},
          {text:'Inspirar e reacender a esperança.',scores:{ho_oh:2,celebi:1}},
          {text:'Ir além, crescer e vencer limites.',scores:{rayquaza:2,jirachi:1}},
          {text:'Entender o desconhecido e ir mais fundo.',scores:{darkrai:2,mew:1}}
        ]},
        {q:'Se pudesse escolher um bônus simbólico para hoje, qual seria?',options:[
          {text:'Mais tranquilidade e proteção para todos.',scores:{suicune:2,lugia:1}},
          {text:'Mais sorte, brilho e boas vibrações.',scores:{jirachi:2,ho_oh:1}},
          {text:'Mais liberdade para explorar e improvisar.',scores:{mew:2,rayquaza:1}},
          {text:'Mais profundidade, foco e intensidade.',scores:{darkrai:2,celebi:1}}
        ]},
        {q:'Como seus amigos provavelmente descreveriam você?',options:[
          {text:'Confiável, sereno e equilibrado.',scores:{lugia:2,suicune:1}},
          {text:'Radiante, inspirador e caloroso.',scores:{ho_oh:2,jirachi:1}},
          {text:'Marcante, livre e determinado.',scores:{rayquaza:2,darkrai:1}},
          {text:'Curioso, gentil e fora do óbvio.',scores:{mew:2,celebi:2}}
        ]}
      ];

      const img=(key,cls='')=>{
        const label=lore[key]?.name||key;
        if(key==='arceus')return `<img ${cls?`class="${cls}"`:''} loading="lazy" src="${ARCEUS_DATA}" alt="${label}">`;
        const p=SPRITE_POS[key];
        if(!p)return `<span class="missing-art" role="img" aria-label="${label}">✦</span>`;
        return `<i ${cls?`class="sprite-frame ${cls}"`:'class="sprite-frame"'} role="img" aria-label="${label}"><i class="sprite-sheet" style="--sx:-${p[0]}px;--sy:-${p[1]}px"></i></i>`;
      };
      const node=(key,extra='')=>{const p=lore[key];return `<button type="button" class="cosmic-node ${extra}" data-key="${key}" style="--node-glow:${p.glow}" aria-label="Ver a história de ${p.name}">${img(key)}<span>${p.name}</span><small>${p.tag}</small></button>`};
      const legendaryHtml=legendaryGroups.map(group=>`<section class="legend-group"><div class="legend-title">${group.title}</div><div class="legend-orbit">${group.members.map(k=>node(k,'mini')).join('')}</div></section>`).join('');
      const mythicalHtml=mythicals.map(k=>node(k,'myth-mini')).join('');

      const root=this.attachShadow({mode:'open'});
      root.innerHTML=`
      <style>
        ${baseStyles}
        :host{--cyan:#38bdf8;--violet:#8b5cf6;--pink:#ec4899;--gold:#facc15;--ink:#07111f;--line:#2b3c59;color:#f8fafc}
        button{font:inherit}
        .sprite-frame{position:relative;display:block;width:84px;height:84px;overflow:hidden;flex:0 0 auto;--sprite-scale:.75}
        .sprite-sheet{position:absolute;left:50%;top:50%;width:112px;height:112px;background-image:url("${SPRITE_DATA}");background-size:1120px 1008px;background-repeat:no-repeat;background-position:var(--sx) var(--sy);transform:translate(-50%,-50%) scale(var(--sprite-scale));transform-origin:center;pointer-events:none}
        .missing-art{display:grid;place-items:center;width:84px;height:84px;border-radius:50%;color:#fde68a;background:rgba(250,204,21,.08);font-size:1.35rem}
        .egg-dock{position:fixed;left:13px;bottom:13px;z-index:1600;display:flex;align-items:flex-end;gap:9px;max-width:calc(100vw - 26px)}
        .egg{width:76px;height:76px;position:relative;border:0;background:transparent;padding:0;cursor:pointer;transition:transform .28s ease,filter .28s ease;filter:drop-shadow(0 8px 18px rgba(0,0,0,.36)) drop-shadow(0 0 10px rgba(250,204,21,.16))}
        .egg:hover{transform:translateY(-2px) scale(1.035);filter:drop-shadow(0 8px 18px rgba(0,0,0,.36)) drop-shadow(0 0 14px rgba(250,204,21,.28)) drop-shadow(0 0 18px rgba(134,239,172,.14))}
        .egg:focus-visible{outline:2px solid #facc15;outline-offset:4px;border-radius:50%}
        .egg-art{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;transform-origin:50% 58%;transition:filter .42s ease,transform .42s ease;filter:saturate(.98) brightness(.98)}
        .egg-aura{position:absolute;inset:-5px;border-radius:50%;pointer-events:none;background:radial-gradient(circle,rgba(255,255,255,.18) 0%,rgba(250,204,21,.14) 35%,rgba(134,239,172,.08) 54%,transparent 73%);filter:blur(5px);opacity:.58;transition:opacity .42s ease,transform .42s ease}
        .cracks{position:absolute;left:19px;right:19px;top:14px;bottom:13px;opacity:0;pointer-events:none;filter:drop-shadow(0 0 5px rgba(255,255,255,.75));transition:opacity .35s ease,transform .35s ease}
        .cracks::before,.cracks::after{content:"";position:absolute;left:50%;top:17%;width:28px;height:42px;background:linear-gradient(132deg,transparent 0 20%,#fff 21% 23%,transparent 24% 41%,#fff 42% 44%,transparent 45% 62%,#fff 63% 65%,transparent 66%);transform:translateX(-50%)}
        .cracks::after{top:34%;left:44%;transform:rotate(95deg);opacity:.72}
        .egg-stars{position:absolute;inset:-2px;pointer-events:none}.egg-stars i{position:absolute;width:4px;height:4px;border-radius:50%;background:#fff;box-shadow:0 0 8px currentColor;opacity:.72}.egg-stars i:nth-child(1){left:5px;top:22px;color:#facc15}.egg-stars i:nth-child(2){right:6px;top:13px;color:#86efac}.egg-stars i:nth-child(3){right:8px;bottom:9px;color:#fde68a}.egg-stars i:nth-child(4){left:12px;bottom:7px;color:#a7f3d0}
        .egg[data-stage="1"] .egg-art{animation:eggWake1 .85s ease;filter:saturate(1.06) brightness(1.04) drop-shadow(0 0 7px rgba(250,204,21,.32))}.egg[data-stage="1"] .egg-aura{opacity:.82;transform:scale(1.05)}.egg[data-stage="1"] .cracks{opacity:.28}
        .egg[data-stage="2"] .egg-art{animation:eggWake2 1.15s ease;filter:saturate(1.12) brightness(1.09) drop-shadow(0 0 9px rgba(250,204,21,.42)) drop-shadow(0 0 8px rgba(134,239,172,.25))}.egg[data-stage="2"] .egg-aura{opacity:1;transform:scale(1.1)}.egg[data-stage="2"] .cracks{opacity:.78;transform:scale(1.05)}
        .egg[data-stage="3"]{filter:drop-shadow(0 0 20px rgba(250,204,21,.34))}.egg[data-stage="3"] .egg-art{filter:brightness(1.2) saturate(1.12);transform:scale(1.04)}.egg[data-stage="3"] .cracks{opacity:1}
        @keyframes eggWake1{0%,100%{transform:rotate(0) scale(1)}25%{transform:rotate(-3deg) scale(1.02)}50%{transform:rotate(3deg) scale(1.03)}75%{transform:rotate(-2deg) scale(1.015)}}
        @keyframes eggWake2{0%,100%{transform:rotate(0) scale(1)}18%{transform:rotate(-4deg) scale(1.025)}36%{transform:rotate(4deg) scale(1.045)}54%{transform:rotate(-3deg) scale(1.04)}72%{transform:rotate(3deg) scale(1.03)}}
        .egg-hint{opacity:0;visibility:hidden;transform:translateY(5px) scale(.98);transition:opacity .22s,transform .22s,visibility .22s;max-width:220px;padding:10px 12px;border-radius:14px;border:1px solid rgba(79,103,144,.72);background:linear-gradient(145deg,rgba(8,20,36,.97),rgba(6,15,28,.98));color:#b6c6d9;font-size:.74rem;line-height:1.48;box-shadow:0 16px 34px rgba(0,0,0,.34),0 0 18px rgba(56,189,248,.06);pointer-events:none}.egg-dock:hover .egg-hint,.egg-dock:focus-within .egg-hint,.egg-dock.prompt .egg-hint{opacity:1;visibility:visible;transform:none}.egg-hint b{display:block;margin-bottom:2px;color:#fff3bf;font-size:.78rem}.egg-hint .hint-progress{display:inline-flex;align-items:center;gap:5px;margin-top:7px;color:#8fb8d2;font-size:.66rem;font-weight:850;letter-spacing:.02em}.egg-hint .hint-progress i{display:block;width:5px;height:5px;border-radius:50%;background:#47617e;box-shadow:none}.egg-hint .hint-progress i.on{background:#fde68a;box-shadow:0 0 8px rgba(250,204,21,.5)}

        .flash{position:fixed;inset:0;z-index:1690;display:none;place-items:center;background:radial-gradient(circle at center,rgba(250,204,21,.12),rgba(5,9,24,.9) 58%,rgba(3,6,18,.97));backdrop-filter:blur(9px)}.flash.show{display:grid;animation:flashFade 2.65s ease forwards}.flash-stage{position:relative;width:min(430px,82vw);aspect-ratio:1/1;display:grid;place-items:center}.flash-ring{position:absolute;inset:3%;border-radius:50%;background:conic-gradient(from 0deg,transparent,rgba(250,204,21,.26),transparent 14%,rgba(134,239,172,.18),transparent 32%,rgba(56,189,248,.16),transparent 52%,rgba(250,204,21,.24),transparent 72%);filter:blur(8px);animation:spinRing 4.6s linear infinite}.flash-egg{position:relative;z-index:2;width:76%;height:76%;object-fit:contain;filter:drop-shadow(0 0 22px rgba(250,204,21,.42)) drop-shadow(0 0 18px rgba(134,239,172,.2));animation:hatchEgg 2.35s ease forwards}.flash-arceus{position:absolute;z-index:1;width:66%;height:66%;object-fit:contain;opacity:0;filter:drop-shadow(0 0 22px rgba(250,204,21,.28));animation:arceusReveal 2.35s ease forwards}.flash-crack{position:absolute;z-index:3;width:44%;height:46%;top:29%;left:28%;opacity:0;background:linear-gradient(135deg,transparent 0 22%,#fff 23% 25%,transparent 26% 43%,#fff 44% 46%,transparent 47% 63%,#fff 64% 66%,transparent 67%);filter:drop-shadow(0 0 8px white);animation:crackReveal 2.35s ease forwards}
        @keyframes hatchEgg{0%{transform:scale(.82);opacity:0}12%{opacity:1}35%{transform:scale(.95) rotate(-2deg)}50%{transform:scale(1.04) rotate(2deg)}67%{transform:scale(1.08);opacity:1}82%,100%{transform:scale(1.2);opacity:0}}
        @keyframes arceusReveal{0%,55%{opacity:0;transform:scale(.72)}72%{opacity:.38;transform:scale(.86)}100%{opacity:1;transform:scale(1)}}
        @keyframes crackReveal{0%,38%{opacity:0}52%{opacity:.45}68%{opacity:1;transform:scale(1.05)}82%,100%{opacity:0;transform:scale(1.2)}}
        @keyframes flashFade{0%,82%{opacity:1}100%{opacity:0}}@keyframes spinRing{to{transform:rotate(360deg)}}

        .overlay{position:fixed;inset:0;z-index:1700;display:none;align-items:center;justify-content:center;padding:16px;background:rgba(2,6,23,.87);backdrop-filter:blur(12px)}.overlay.open{display:flex}
        .cosmos{width:min(1160px,96vw);max-height:min(92vh,980px);overflow:auto;position:relative;border:1px solid rgba(81,104,151,.58);border-radius:28px;background:radial-gradient(circle at 50% -8%,rgba(250,204,21,.08),transparent 24%),radial-gradient(circle at 88% 5%,rgba(236,72,153,.09),transparent 24%),radial-gradient(circle at 10% 16%,rgba(56,189,248,.11),transparent 24%),linear-gradient(180deg,#081424,#07111f);box-shadow:0 35px 90px rgba(0,0,0,.58),0 0 0 1px rgba(255,255,255,.025)}
        .cosmos::before{content:"";position:absolute;inset:0;pointer-events:none;opacity:.48;background-image:radial-gradient(circle at 10% 10%,#fff 0 1px,transparent 1.4px),radial-gradient(circle at 68% 18%,#fff 0 1px,transparent 1.4px),radial-gradient(circle at 28% 56%,#fff 0 1px,transparent 1.4px),radial-gradient(circle at 82% 70%,#fff 0 1px,transparent 1.4px),radial-gradient(circle at 45% 83%,#fff 0 1px,transparent 1.4px);background-size:110px 110px,150px 150px,170px 170px,130px 130px,190px 190px}
        .close{position:sticky;float:right;top:12px;right:12px;z-index:5;margin:12px 12px 0 0;width:42px;height:42px;border-radius:999px;border:1px solid #354967;background:#0b1729;color:#e7eef8;font-size:1.25rem;cursor:pointer}.close:hover{border-color:#64748b;background:#13233a}.close:focus-visible{outline:2px solid var(--cyan);outline-offset:2px}
        .cosmic-hero{position:relative;display:grid;grid-template-columns:210px minmax(0,1fr);gap:28px;align-items:center;padding:30px 34px 22px}.arceus-stage{min-height:210px;display:grid;place-items:center;position:relative}.arceus-stage::before{content:"";position:absolute;width:176px;height:176px;border-radius:50%;border:1px solid rgba(250,204,21,.22);box-shadow:0 0 34px rgba(250,204,21,.08),inset 0 0 30px rgba(56,189,248,.05)}.arceus-stage img{position:relative;z-index:1;max-width:190px;max-height:190px;filter:drop-shadow(0 10px 16px rgba(0,0,0,.38)) drop-shadow(0 0 11px rgba(250,204,21,.16))}.hero-copy .eyebrow{display:inline-flex;padding:6px 10px;border-radius:999px;border:1px solid rgba(250,204,21,.2);background:rgba(250,204,21,.055);color:#fde68a;font-size:.72rem;font-weight:900;letter-spacing:.06em;text-transform:uppercase}.hero-copy h2{font-size:clamp(1.65rem,3vw,2.35rem);margin:11px 0 8px}.hero-copy p{margin:0;color:#a7b8cd;line-height:1.7;font-size:.91rem;max-width:760px}.hero-copy strong{color:#f5e9bd}
        .tabs{position:relative;display:flex;gap:8px;padding:0 34px 18px;flex-wrap:wrap}.tab{position:relative;isolation:isolate;border:1px solid #314765;border-radius:12px;background:#0a1729;color:#98abc2;padding:9px 13px;font-size:.82rem;font-weight:900;cursor:pointer;transition:transform .18s ease,border-color .18s ease,box-shadow .18s ease,background .18s ease,color .18s ease}.tab:hover,.tab:focus-visible{transform:translateY(-1px);border-color:#4a648f;box-shadow:0 10px 22px rgba(0,0,0,.14)}.tab.active{color:#fff;border-color:#536b99;background:linear-gradient(135deg,rgba(37,99,235,.3),rgba(124,58,237,.3));box-shadow:0 0 18px rgba(99,102,241,.13)}.tab-companion{border-color:rgba(141,166,214,.44);background:linear-gradient(135deg,rgba(32,65,120,.28),rgba(91,48,170,.28));color:#e9f1ff;box-shadow:0 0 0 1px rgba(255,255,255,.025) inset,0 0 18px rgba(99,102,241,.08)}.tab-companion::after{content:'';position:absolute;inset:-8px;border-radius:18px;background:radial-gradient(circle at 25% 35%,rgba(56,189,248,.23),transparent 55%),radial-gradient(circle at 80% 35%,rgba(168,85,247,.22),transparent 56%),radial-gradient(circle at 50% 75%,rgba(250,204,21,.18),transparent 52%);filter:blur(14px);opacity:.55;z-index:-1;pointer-events:none;transition:opacity .2s ease,filter .2s ease}.tab-companion:hover,.tab-companion:focus-visible{border-color:rgba(196,181,253,.72);color:#fff;box-shadow:0 12px 24px rgba(0,0,0,.2),0 0 22px rgba(99,102,241,.14),0 0 24px rgba(250,204,21,.12)}.tab.active.tab-companion{color:#fff;border-color:rgba(196,181,253,.9);background:linear-gradient(135deg,rgba(59,130,246,.46),rgba(124,58,237,.54));box-shadow:0 0 0 1px rgba(255,255,255,.05) inset,0 0 24px rgba(99,102,241,.28),0 0 40px rgba(250,204,21,.18)}.tab.active.tab-companion::after{opacity:.96;filter:blur(18px)}
        .panel{display:none;position:relative;padding:0 34px 30px}.panel.active{display:block}.panel-title{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:13px}.panel-title h3{margin:0;font-size:1.02rem}.panel-title p{margin:4px 0 0;color:#8498b1;font-size:.77rem}.micro{color:#8ea5bf;font-size:.7rem;font-weight:800}
        .origin-map{border:1px solid rgba(48,69,103,.72);border-radius:22px;background:rgba(7,16,29,.72);padding:17px;display:grid;gap:10px}.origin-row{display:flex;justify-content:center;gap:10px;flex-wrap:wrap}.down{display:grid;place-items:center;color:#7dd3fc;opacity:.64;font-size:1.05rem}
        .legend-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.legend-group{position:relative;overflow:hidden;border:1px solid rgba(48,69,103,.72);border-radius:20px;background:linear-gradient(180deg,rgba(8,18,33,.9),rgba(7,16,29,.94));padding:14px}.legend-group::before{content:"";position:absolute;inset:0 0 auto;height:2px;background:linear-gradient(90deg,#38bdf8,#8b5cf6,#ec4899,#facc15)}.legend-title{color:#dce8f6;font-size:.78rem;font-weight:900;margin-bottom:10px}.legend-orbit{display:grid;grid-template-columns:repeat(auto-fit,minmax(104px,1fr));gap:8px;padding:2px}.myth-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(104px,1fr));gap:9px}
        .cosmic-node{--node-glow:56,189,248;position:relative;display:grid;justify-items:center;align-content:start;gap:4px;width:150px;padding:12px 10px;border:1px solid rgba(var(--node-glow),.26);border-radius:18px;background:linear-gradient(180deg,rgba(13,28,49,.95),rgba(7,17,31,.96));color:#f8fbff;cursor:pointer;box-shadow:0 10px 26px rgba(0,0,0,.17),0 0 14px rgba(var(--node-glow),.07);transition:transform .2s,border-color .2s,box-shadow .2s}
        .cosmic-node::before{content:"";position:absolute;left:50%;top:9px;width:96px;height:96px;transform:translateX(-50%);border-radius:50%;background:radial-gradient(circle,rgba(var(--node-glow),.16) 0%,rgba(var(--node-glow),.07) 48%,transparent 73%);opacity:.78;pointer-events:none;transition:.2s}.cosmic-node:hover,.cosmic-node:focus-visible{transform:translateY(-2px);border-color:rgba(var(--node-glow),.62);box-shadow:0 10px 26px rgba(0,0,0,.2),0 0 20px rgba(var(--node-glow),.17)}.cosmic-node:hover::before,.cosmic-node:focus-visible::before{opacity:1;background:radial-gradient(circle,rgba(var(--node-glow),.22) 0%,rgba(var(--node-glow),.09) 50%,transparent 74%)}.cosmic-node.selected{border-color:rgba(var(--node-glow),.82);box-shadow:0 10px 26px rgba(0,0,0,.2),0 0 0 1px rgba(var(--node-glow),.16),0 0 25px rgba(var(--node-glow),.24)}.cosmic-node.selected::before{opacity:1;background:radial-gradient(circle,rgba(var(--node-glow),.3) 0%,rgba(var(--node-glow),.12) 50%,transparent 74%)}.cosmic-node:focus-visible{outline:2px solid rgba(var(--node-glow),.78);outline-offset:2px}.cosmic-node img{position:relative;z-index:1;width:84px;height:84px;object-fit:contain;filter:drop-shadow(0 8px 10px rgba(0,0,0,.32)) drop-shadow(0 0 8px rgba(var(--node-glow),.17));transition:filter .2s,transform .2s}.cosmic-node .sprite-frame{position:relative;z-index:1;width:84px;height:84px;--sprite-scale:.75;filter:drop-shadow(0 8px 10px rgba(0,0,0,.32)) drop-shadow(0 0 8px rgba(var(--node-glow),.17));transition:filter .2s,transform .2s}.cosmic-node:hover img,.cosmic-node.selected img,.cosmic-node:hover .sprite-frame,.cosmic-node.selected .sprite-frame{filter:drop-shadow(0 8px 10px rgba(0,0,0,.32)) drop-shadow(0 0 12px rgba(var(--node-glow),.34));transform:scale(1.025)}.cosmic-node span{font-size:.82rem;font-weight:900;line-height:1.2;text-align:center;white-space:normal;overflow-wrap:anywhere}.cosmic-node small{font-size:.66rem;color:#8aa0ba;font-weight:700;line-height:1.25;text-align:center;white-space:normal;overflow-wrap:anywhere}.cosmic-node.god{width:190px;padding:16px}.cosmic-node.god img{width:112px;height:112px}.cosmic-node.god .sprite-frame{width:112px;height:112px;--sprite-scale:1}.cosmic-node.mini,.cosmic-node.myth-mini{width:112px;padding:9px}.cosmic-node.mini img,.cosmic-node.myth-mini img{width:66px;height:66px}.cosmic-node.mini .sprite-frame,.cosmic-node.myth-mini .sprite-frame{width:66px;height:66px;--sprite-scale:.59}.cosmic-node.mini span,.cosmic-node.myth-mini span{font-size:.75rem}.cosmic-node.mini small,.cosmic-node.myth-mini small{display:none}
        .poke-popover{--pop-glow:56,189,248;position:fixed;z-index:1810;width:min(360px,calc(100vw - 24px));display:none;grid-template-columns:68px 1fr;gap:11px;align-items:center;padding:12px 13px;border:1px solid rgba(var(--pop-glow),.56);border-radius:17px;background:linear-gradient(145deg,rgba(9,22,40,.99),rgba(8,17,31,.99));box-shadow:0 18px 44px rgba(0,0,0,.44),0 0 22px rgba(var(--pop-glow),.18);backdrop-filter:blur(11px);pointer-events:none}.poke-popover.show{display:grid}.poke-popover img{width:64px;height:64px;object-fit:contain;filter:drop-shadow(0 6px 10px rgba(0,0,0,.3)) drop-shadow(0 0 8px rgba(var(--pop-glow),.25))}.poke-popover .sprite-frame{width:64px;height:64px;--sprite-scale:.57;filter:drop-shadow(0 6px 10px rgba(0,0,0,.3)) drop-shadow(0 0 8px rgba(var(--pop-glow),.25))}.poke-popover strong{display:block;color:#f8fbff;font-size:.89rem;line-height:1.25}.poke-popover b{display:inline-block;margin-left:5px;color:rgb(var(--pop-glow));font-size:.68rem}.poke-popover p{margin:5px 0 0;color:#a9b9cc;font-size:.76rem;line-height:1.52}.poke-popover::after{content:"";position:absolute;width:10px;height:10px;background:#091628;border-left:1px solid rgba(var(--pop-glow),.56);border-top:1px solid rgba(var(--pop-glow),.56);transform:rotate(45deg);left:var(--arrow-x,22px);top:var(--arrow-y,-6px)}
        details.sources{margin-top:15px;border:1px solid rgba(49,69,103,.65);border-radius:16px;background:#081526;overflow:hidden}details.sources summary{cursor:pointer;padding:12px 14px;color:#bcd0e5;font-size:.78rem;font-weight:850;list-style:none}details.sources summary::-webkit-details-marker{display:none}.source-body{padding:0 14px 14px;border-top:1px solid rgba(49,69,103,.55);color:#8ca0b7;font-size:.73rem;line-height:1.6}.source-body a{color:#7dd3fc;text-underline-offset:2px}

        .companion-shell{display:grid;gap:14px}
        .companion-intro{position:relative;overflow:hidden;border:1px solid rgba(49,69,103,.72);border-radius:20px;background:linear-gradient(145deg,rgba(9,22,40,.96),rgba(8,17,31,.97));padding:16px 17px;box-shadow:0 14px 32px rgba(0,0,0,.16)}
        .companion-intro::before{content:'';position:absolute;inset:auto -18% -38% auto;width:180px;height:180px;border-radius:50%;background:radial-gradient(circle,rgba(56,189,248,.16),transparent 70%);pointer-events:none}
        .quiz-chip{display:inline-flex;align-items:center;padding:6px 10px;border-radius:999px;border:1px solid rgba(250,204,21,.24);background:rgba(250,204,21,.07);color:#fde68a;font-size:.7rem;font-weight:900;letter-spacing:.05em;text-transform:uppercase}
        .companion-intro h4{margin:11px 0 7px;font-size:1.08rem}
        .companion-intro p{margin:0;color:#9db0c8;font-size:.84rem;line-height:1.62;max-width:760px}
        .companion-quiz{display:grid;gap:14px}
        .quiz-card,.result-card{border:1px solid rgba(49,69,103,.72);border-radius:22px;background:linear-gradient(160deg,rgba(9,22,40,.98),rgba(7,17,31,.98));padding:17px;box-shadow:0 16px 34px rgba(0,0,0,.18)}
        .quiz-progress{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:12px}
        .quiz-progress span{color:#9ab0ca;font-size:.76rem;font-weight:800}
        .quiz-track{height:10px;flex:1;min-width:110px;border-radius:999px;background:rgba(42,58,86,.72);overflow:hidden}
        .quiz-fill{height:100%;border-radius:999px;background:linear-gradient(90deg,#38bdf8,#8b5cf6,#facc15)}
        .quiz-question{font-size:1.12rem;line-height:1.35;margin:0 0 14px;color:#f8fbff}
        .quiz-options{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
        .quiz-option{position:relative;display:flex;align-items:flex-start;gap:10px;text-align:left;border:1px solid rgba(58,79,114,.75);border-radius:16px;background:linear-gradient(160deg,rgba(12,25,44,.98),rgba(8,17,31,.98));padding:14px 13px;color:#e5eef9;cursor:pointer;transition:transform .18s ease,border-color .18s ease,box-shadow .18s ease,background .18s ease}
        .quiz-option:hover,.quiz-option:focus-visible{transform:translateY(-2px);border-color:rgba(96,165,250,.62);box-shadow:0 14px 26px rgba(0,0,0,.2),0 0 0 1px rgba(96,165,250,.12),0 0 18px rgba(96,165,250,.12)}
        .quiz-option-badge{width:29px;height:29px;flex:0 0 29px;display:grid;place-items:center;border-radius:50%;background:linear-gradient(135deg,rgba(56,189,248,.16),rgba(139,92,246,.18));border:1px solid rgba(96,165,250,.3);color:#d7e9ff;font-size:.78rem;font-weight:900}
        .quiz-option-text{font-size:.86rem;line-height:1.5;color:#e7eff8}
        .quiz-meta{margin-top:12px;color:#8ea4be;font-size:.75rem;line-height:1.55}
        .result-card{position:relative;overflow:hidden;border:1px solid rgba(67,88,122,.68);border-radius:28px;background:radial-gradient(circle at 50% 4%,rgba(var(--glow,56,189,248),.08),transparent 30%),linear-gradient(160deg,rgba(9,22,40,.985),rgba(6,15,28,.99));padding:28px 28px 24px;box-shadow:0 24px 55px rgba(0,0,0,.22)}
        .result-card::before{content:'';position:absolute;inset:0 0 auto;height:2px;background:linear-gradient(90deg,transparent,var(--c1,#38bdf8) 20%,#facc15 50%,var(--c2,#8b5cf6) 80%,transparent);opacity:.9}
        .result-top{display:grid;grid-template-columns:230px minmax(0,1fr);gap:32px;align-items:center}
        .result-art{position:relative;min-height:230px;display:grid;place-items:center;background:transparent;border:0;border-radius:0;isolation:isolate}
        .result-art::before{content:'';position:absolute;width:190px;height:190px;border-radius:50%;background:radial-gradient(circle,rgba(var(--glow,56,189,248),.30),rgba(var(--glow,56,189,248),.11) 42%,transparent 72%);filter:blur(7px);z-index:-1}
        .result-art::after{content:'';position:absolute;width:172px;height:172px;border-radius:50%;border:1px solid rgba(var(--glow,56,189,248),.20);box-shadow:0 0 30px rgba(var(--glow,56,189,248),.10);z-index:-1}
        .result-art img.companion-result-art{position:relative;z-index:1;width:190px;height:190px;object-fit:contain;filter:drop-shadow(0 18px 20px rgba(0,0,0,.32)) drop-shadow(0 0 16px rgba(var(--glow,56,189,248),.20));transform:translateZ(0)}
        .result-kicker{display:inline-flex;align-items:center;padding:7px 12px;border-radius:999px;background:rgba(255,255,255,.055);border:1px solid rgba(255,255,255,.09);color:#dbe8f8;font-size:.69rem;font-weight:900;letter-spacing:.055em;text-transform:uppercase}
        .result-copy h4{margin:13px 0 4px;font-size:1.72rem;line-height:1.05;letter-spacing:-.025em}
        .result-copy .subtitle{margin:0;color:#fde68a;font-size:.94rem;font-weight:850}
        .result-copy p{margin:13px 0 0;color:#a9bbd0;font-size:.88rem;line-height:1.7;max-width:650px}
        .trait-list{display:flex;flex-wrap:wrap;gap:8px;margin:16px 0 0;padding:0;list-style:none}
        .trait-list li{padding:8px 12px;border-radius:999px;border:1px solid rgba(var(--glow,56,189,248),.18);background:rgba(var(--glow,56,189,248),.055);color:#eef6ff;font-size:.76rem;font-weight:850}
        .result-actions{display:grid;grid-template-columns:1.35fr 1fr 1fr auto;gap:10px;margin-top:25px;padding-top:20px;border-top:1px solid rgba(77,98,130,.34)}
        .result-btn{appearance:none;min-height:48px;border:1px solid rgba(70,96,138,.72);border-radius:14px;background:rgba(10,24,43,.76);color:#f5f9ff;padding:12px 14px;font-size:.8rem;font-weight:900;cursor:pointer;transition:transform .18s ease,border-color .18s ease,box-shadow .18s ease,background .18s ease}
        .result-btn:hover,.result-btn:focus-visible{transform:translateY(-1px);border-color:rgba(96,165,250,.7);background:rgba(15,32,56,.92);box-shadow:0 10px 22px rgba(0,0,0,.16),0 0 16px rgba(96,165,250,.09)}
        .result-btn.primary{background:linear-gradient(135deg,#2859e8,#7138e8);border-color:rgba(167,139,250,.52);box-shadow:0 12px 25px rgba(67,56,202,.17)}
        .result-note{margin:12px 2px 0;color:#7f94ad;font-size:.69rem;line-height:1.55}
        .companion-intro{padding:20px 20px 18px;background:radial-gradient(circle at 88% 18%,rgba(250,204,21,.09),transparent 28%),radial-gradient(circle at 12% 12%,rgba(56,189,248,.12),transparent 26%),linear-gradient(145deg,rgba(9,22,40,.98),rgba(8,17,31,.99))}
        .companion-intro::after{content:'';position:absolute;inset:0;pointer-events:none;background:linear-gradient(110deg,transparent 0 46%,rgba(255,255,255,.025) 48%,transparent 50%)}
        .companion-intro h4{font-size:1.22rem;letter-spacing:-.015em}.companion-intro p{max-width:820px}
        .companion-perks{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px}.companion-perks span{display:inline-flex;align-items:center;min-height:30px;padding:6px 10px;border-radius:999px;border:1px solid rgba(79,103,144,.6);background:rgba(10,22,39,.78);color:#bcd0e7;font-size:.72rem;font-weight:800}.companion-perks span::before{content:'✦';margin-right:6px;color:#fde68a;font-size:.65rem}
        .quiz-card{position:relative;overflow:hidden;padding:21px;background:radial-gradient(circle at 100% 0,rgba(139,92,246,.08),transparent 32%),linear-gradient(160deg,rgba(9,22,40,.99),rgba(7,17,31,.99))}.quiz-card::after{content:'';position:absolute;right:-54px;bottom:-72px;width:160px;height:160px;border-radius:50%;background:radial-gradient(circle,rgba(56,189,248,.09),transparent 70%);pointer-events:none}
        .quiz-track{height:8px}.quiz-fill{box-shadow:0 0 12px rgba(56,189,248,.18)}
        .quiz-question{font-size:1.22rem;letter-spacing:-.015em;margin-bottom:16px;max-width:820px}
        .quiz-options{gap:11px}.quiz-option{min-height:74px;padding:15px 14px;align-items:center}.quiz-option:hover,.quiz-option:focus-visible{background:linear-gradient(160deg,rgba(18,39,65,.99),rgba(10,22,40,.99))}.quiz-option-badge{width:33px;height:33px;flex-basis:33px;box-shadow:inset 0 0 0 1px rgba(255,255,255,.03)}.quiz-option-text{font-size:.9rem;line-height:1.48}
        .result-card{padding:21px;background:radial-gradient(circle at 14% 12%,rgba(var(--glow,56,189,248),.08),transparent 25%),radial-gradient(circle at 92% 8%,rgba(var(--glow,56,189,248),.07),transparent 24%),linear-gradient(160deg,rgba(9,22,40,.99),rgba(7,17,31,.995))}.result-card::after{content:'';position:absolute;inset:0;pointer-events:none;background:linear-gradient(115deg,transparent 0 43%,rgba(255,255,255,.018) 45%,transparent 47%)}
        .result-copy h4{font-size:1.7rem;margin-top:12px;letter-spacing:-.02em}
        .result-copy h4{font-size:1.7rem;margin-top:12px;letter-spacing:-.02em}.result-copy .subtitle{font-size:.92rem}.result-copy p{font-size:.9rem;max-width:720px}.trait-list li{background:rgba(var(--glow,56,189,248),.07);border-color:rgba(var(--glow,56,189,248),.22);color:#f4f8ff}.result-actions{padding-top:4px}.result-btn{min-height:46px;padding:12px 15px}.result-btn.primary{box-shadow:0 10px 24px rgba(29,78,216,.16),0 0 18px rgba(124,58,237,.12)}
        .result-note{display:flex;align-items:flex-start;gap:7px;margin-top:12px;padding:10px 12px;border-radius:12px;background:rgba(255,255,255,.025);border:1px solid rgba(255,255,255,.05)}.result-note::before{content:'ⓘ';color:#93c5fd;flex:0 0 auto}
        @media(max-width:800px){
          .overlay{padding:12px}.cosmos{width:100%;max-height:94vh;border-radius:24px}.cosmos::before{opacity:.28}
          .close{top:9px;right:9px;margin:9px 9px 0 0;width:38px;height:38px;font-size:1.12rem}
          .cosmic-hero{grid-template-columns:132px minmax(0,1fr);gap:16px;padding:22px 18px 14px;align-items:center}
          .arceus-stage{min-height:142px}.arceus-stage::before{width:124px;height:124px}.arceus-stage img{max-width:132px;max-height:132px}
          .hero-copy .eyebrow{font-size:.66rem;padding:5px 9px}.hero-copy h2{font-size:1.72rem;margin:8px 0 6px}.hero-copy p{font-size:.82rem;line-height:1.52;max-width:none}
          .tabs{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px;padding:0 18px 14px}.tab{padding:9px 8px;font-size:.76rem;min-width:0;white-space:nowrap}
          .panel{padding:0 18px 22px}.panel-title{align-items:flex-start;flex-direction:column;gap:7px;margin-bottom:11px}.panel-title h3{font-size:1rem}.panel-title p{font-size:.75rem;line-height:1.45;margin-top:3px}.micro{display:inline-flex;align-items:center;align-self:flex-start;padding:5px 8px;border:1px solid rgba(56,189,248,.18);border-radius:999px;background:rgba(56,189,248,.055);font-size:.66rem;line-height:1.25;color:#9dc8df}.quiz-options{grid-template-columns:1fr}.result-card{padding:22px 18px 20px}.result-top{grid-template-columns:1fr;gap:16px}.result-art{min-height:178px}.result-art::before{width:168px;height:168px}.result-art::after{width:148px;height:148px}.result-art img.companion-result-art{width:168px;height:168px}.result-copy{text-align:center;padding:0 4px}.result-copy p{margin-left:auto;margin-right:auto}.trait-list{justify-content:center}.result-actions{grid-template-columns:1fr;margin-top:21px;padding-top:18px}.result-btn{width:100%}.companion-intro{padding:14px 14px 15px}
          .legend-grid{grid-template-columns:1fr;gap:12px}.legend-group{padding:12px 12px 13px;overflow:visible}.legend-title{font-size:.82rem;margin-bottom:10px}.legend-orbit{grid-template-columns:repeat(2,minmax(0,1fr));gap:9px;overflow:visible;padding:0}.legend-orbit .cosmic-node:last-child:nth-child(odd){grid-column:1/-1;width:min(180px,100%);justify-self:center}
          .origin-row{gap:8px}.origin-row:not(:first-child){display:grid;grid-template-columns:repeat(2,minmax(0,1fr))}.origin-row:not(:first-child) .cosmic-node:last-child:nth-child(odd){grid-column:1/-1;justify-self:center;width:min(180px,100%)}
          .cosmic-node{width:100%;min-width:0;padding:10px 7px;border-radius:16px}.cosmic-node.god{width:164px;padding:13px 9px}.cosmic-node.mini,.cosmic-node.myth-mini{width:100%;padding:10px 7px}.cosmic-node img{width:72px;height:72px}.cosmic-node .sprite-frame{width:72px;height:72px;--sprite-scale:.643}.cosmic-node.mini img,.cosmic-node.myth-mini img{width:70px;height:70px}.cosmic-node.mini .sprite-frame,.cosmic-node.myth-mini .sprite-frame{width:70px;height:70px;--sprite-scale:.625}.cosmic-node span,.cosmic-node.mini span,.cosmic-node.myth-mini span{font-size:.77rem;min-height:1.9em;display:flex;align-items:center;justify-content:center}.cosmic-node small{font-size:.61rem}
          .myth-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}.myth-grid .cosmic-node:last-child:nth-child(odd){grid-column:1/-1;width:min(180px,100%);justify-self:center}
        }
        @media(max-width:520px){
          .egg-dock{left:9px;bottom:9px}.egg{width:68px;height:68px}.egg-hint{position:absolute;left:0;bottom:78px;width:min(270px,calc(100vw - 18px));max-width:none;padding:10px 12px;font-size:.72rem}.overlay{padding:7px}.cosmos{width:100%;max-height:95vh;border-radius:20px}
          .cosmic-hero{grid-template-columns:102px minmax(0,1fr);gap:12px;padding:18px 12px 10px}.arceus-stage{min-height:112px}.arceus-stage::before{width:96px;height:96px}.arceus-stage img{max-width:108px;max-height:108px}
          .hero-copy{text-align:left;padding-right:28px}.hero-copy .eyebrow{font-size:.6rem;padding:4px 7px;letter-spacing:.04em}.hero-copy h2{font-size:1.48rem;margin:7px 0 5px;line-height:1.08}.hero-copy p{font-size:.75rem;line-height:1.45;color:#aebed0}.hero-copy strong{display:inline;color:#f5e9bd}
          .tabs{padding:0 10px 11px;gap:6px}.tab{font-size:.7rem;padding:8px 5px;border-radius:10px}
          .panel{padding:0 10px 16px}.panel-title{margin-bottom:10px;gap:6px}.panel-title h3{font-size:.96rem}.panel-title p{font-size:.72rem}.micro{font-size:.62rem;padding:4px 7px}.quiz-card,.result-card{padding:13px}.quiz-question{font-size:1rem}.quiz-option{padding:12px 11px}.quiz-option-text{font-size:.82rem}.companion-intro h4{font-size:1rem}.companion-intro p{font-size:.78rem}.result-copy h4{font-size:1.26rem}.result-copy p{font-size:.8rem}.result-art img.companion-result-art{width:154px;height:154px}.result-art{min-height:164px}
          .origin-map{padding:10px;border-radius:18px}.origin-row{gap:7px}.cosmic-node.god{width:150px}.cosmic-node span,.cosmic-node.mini span,.cosmic-node.myth-mini span{font-size:.75rem}.cosmic-node small{font-size:.59rem}
          .legend-group{padding:11px;border-radius:18px}.legend-title{font-size:.79rem}.legend-orbit{grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.myth-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.cosmic-node.myth-mini{width:100%}
          .poke-popover{width:min(300px,calc(100vw - 20px));grid-template-columns:56px 1fr;padding:10px 11px;border-radius:15px}.poke-popover img,.poke-popover .sprite-frame{width:54px;height:54px}.poke-popover .sprite-frame{--sprite-scale:.482}.poke-popover strong{font-size:.82rem}.poke-popover p{font-size:.72rem;line-height:1.45}
        }
        @media(hover:none),(pointer:coarse){.egg-dock{max-width:86px}.egg{touch-action:manipulation}.egg-hint{display:block;opacity:0;visibility:hidden}.egg-dock.prompt .egg-hint{opacity:1;visibility:visible;transform:none}}
        @media(prefers-reduced-motion:reduce){.egg-art,.egg-aura,.flash,.flash-ring,.flash-egg,.flash-arceus,.flash-crack,.cosmic-node,.cosmic-node img{animation:none!important;transition:none!important}}
      </style>

      <div class="egg-dock">
        <button class="egg" data-stage="0" type="button" aria-label="Ovo de Pokémon GO com as cores de Arceus">
          <span class="egg-aura" aria-hidden="true"></span>
          <span class="egg-stars" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
          <img class="egg-art" src="${EGG_DATA}" alt="">
          <span class="cracks" aria-hidden="true"></span>
        </button>
        <div class="egg-hint" aria-live="polite"><b data-egg-hint-title>Um ovo incomum...</b><span data-egg-hint-text>Parece reagir à sua presença. Talvez valha a pena tocar nele.</span><span class="hint-progress" aria-hidden="true"><i data-hint-dot="1"></i><i data-hint-dot="2"></i><i data-hint-dot="3"></i><span data-hint-count>0/3</span></span></div>
      </div>

      <div class="flash" aria-hidden="true"><div class="flash-stage"><span class="flash-ring"></span><img class="flash-arceus" src="${ARCEUS_DATA}" alt=""><img class="flash-egg" src="${EGG_DATA}" alt=""><span class="flash-crack"></span></div></div>

      <div class="overlay" role="dialog" aria-modal="true" aria-labelledby="cosmos-title">
        <div class="cosmos">
          <button class="close" type="button" aria-label="Fechar a cosmogonia Pokémon">×</button>
          <div class="poke-popover" data-popover aria-live="polite"></div>
          <div class="cosmic-hero">
            <div class="arceus-stage">${img('arceus')}</div>
            <div class="hero-copy"><span class="eyebrow">✦ Segredo descoberto</span><h2 id="cosmos-title">O Ovo Original</h2><p><strong>Segundo as lendas de Sinnoh</strong>, Arceus está ligado à origem da criação. Explore a cosmogonia, os grandes grupos lendários e os Pokémon Míticos.</p></div>
          </div>
          <div class="tabs" role="tablist" aria-label="Cosmogonia Pokémon">
            <button class="tab active" type="button" data-tab="origin" role="tab" aria-selected="true">🌌 Origem</button>
            <button class="tab" type="button" data-tab="legendary" role="tab" aria-selected="false">⭐ Lendários</button>
            <button class="tab" type="button" data-tab="mythical" role="tab" aria-selected="false">✦ Míticos</button>
            <button class="tab tab-companion" type="button" data-tab="companion" role="tab" aria-selected="false">✨ Quiz do Companheiro</button>
          </div>

          <section class="panel active" data-panel="origin" role="tabpanel">
            <div class="panel-title"><div><h3>Árvore mítica da criação</h3><p>O núcleo mais conhecido das lendas de Sinnoh.</p></div><span class="micro">Toque em um Pokémon para ver sua história</span></div>
            <div class="origin-map">
              <div class="origin-row">${node('arceus','god selected')}</div><div class="down">↓</div>
              <div class="origin-row">${node('dialga')}${node('palkia')}${node('giratina')}</div><div class="down">↓</div>
              <div class="origin-row">${node('uxie')}${node('mesprit')}${node('azelf')}</div>
            </div>
            <details class="sources"><summary>Como interpretar esta árvore ▾</summary><div class="source-body">Ela representa uma <strong>cosmogonia</strong>, não parentesco biológico. Materiais oficiais dizem que Arceus teria moldado tudo o que existe; Dialga é ligado ao tempo, Palkia ao espaço, Giratina ao mundo reverso e o trio dos lagos a conhecimento, emoção e vontade.</div></details>
          </section>

          <section class="panel" data-panel="legendary" role="tabpanel">
            <div class="panel-title"><div><h3>Constelações lendárias</h3><p>Os principais núcleos de Lendários das regiões, apresentados visualmente.</p></div><span class="micro">Toque para abrir a nota ao lado</span></div>
            <div class="legend-grid">${legendaryHtml}</div>
          </section>

          <section class="panel" data-panel="mythical" role="tabpanel">
            <div class="panel-title"><div><h3>Pokémon Míticos</h3><p>Seres raros ligados a tempo, sonhos, desejos, natureza, tecnologia, metal e outros mitos.</p></div><span class="micro">Toque para descobrir a lore</span></div>
            <div class="myth-grid">${mythicalHtml}</div>
            <details class="sources"><summary>Fontes e critério editorial ▾</summary><div class="source-body">As notas foram revisadas a partir da Pokédex oficial e de páginas oficiais dos jogos. Para o núcleo da criação: <a href="https://legends.arceus.pokemon.com/en-us/pokemon/arceus/" target="_blank" rel="noopener">Arceus</a> · <a href="https://diamondpearl.pokemon.com/en-au/story/" target="_blank" rel="noopener">mitos de Sinnoh</a>. Para descrições individuais, a referência principal é a <a href="https://www.pokemon.com/br/pokedex" target="_blank" rel="noopener">Pokédex oficial Pokémon</a>. Quando a franquia apresenta algo como lenda, rumor ou tradição, o GO Nexus mantém essa linguagem em vez de tratar a afirmação como fato científico do universo Pokémon.</div></details>
          </section>

          <section class="panel" data-panel="companion" role="tabpanel">
            <div class="panel-title"><div><h3>Descubra seu companheiro lendário ou mítico</h3><p>Um quiz rápido e visual para revelar qual Pokémon raro combina com sua energia — e gerar um resultado compartilhável.</p></div><span class="micro">5 perguntas · resultado instantâneo</span></div>
            <div class="companion-shell">
              <div class="companion-intro">
                <span class="quiz-chip">Quiz do Companheiro</span>
                <h4>Qual lendário ou mítico caminharia com você?</h4>
                <p>Cinco escolhas rápidas revelam um Lendário ou Mítico com uma energia parecida com a sua. É uma brincadeira do GO Nexus — simples, bonita e sem resposta certa ou errada.</p>
                <div class="companion-perks" aria-label="Resumo do quiz"><span>5 perguntas</span><span>resultado instantâneo</span><span>card compartilhável</span></div>
              </div>
              <div class="companion-quiz" data-companion-quiz></div>
            </div>
          </section>
        </div>
      </div>`;

      const egg=root.querySelector('.egg');
      const flash=root.querySelector('.flash');
      const overlay=root.querySelector('.overlay');
      const close=root.querySelector('.close');
      const tabs=[...root.querySelectorAll('.tab')];
      const panels=[...root.querySelectorAll('.panel')];
      const popover=root.querySelector('[data-popover]');
      const eggDock=root.querySelector('.egg-dock');
      const eggHintTitle=root.querySelector('[data-egg-hint-title]');
      const eggHintText=root.querySelector('[data-egg-hint-text]');
      const eggHintCount=root.querySelector('[data-hint-count]');
      const eggHintDots=[...root.querySelectorAll('[data-hint-dot]')];
      let activeNode=null;
      let clicks=0,revealed=false,flashTimer=null,openTimer=null;

      const setStage=stage=>{egg.dataset.stage=String(stage);};
      const updateEggHint=(stage)=>{
        const messages={
          0:{title:'Um ovo incomum...',text:'Parece reagir à sua presença. Talvez valha a pena tocar nele.'},
          1:{title:'O ovo respondeu!',text:'Algo se moveu lá dentro. Toque mais uma vez.'},
          2:{title:'Está prestes a eclodir...',text:'As rachaduras aumentaram. Toque outra vez para revelar o segredo.'}
        };
        const msg=messages[stage]||messages[0];
        eggHintTitle.textContent=msg.title;eggHintText.textContent=msg.text;
        eggHintCount.textContent=`${stage}/3`;
        eggHintDots.forEach((dot,index)=>dot.classList.toggle('on',index<stage));
        if(stage>0&&stage<3)eggDock.classList.add('prompt');else eggDock.classList.remove('prompt');
      };
      const openCosmos=()=>{overlay.classList.add('open');close.focus();};
      const reveal=()=>{
        revealed=true;setStage(3);updateEggHint(3);flash.classList.add('show');
        clearTimeout(flashTimer);clearTimeout(openTimer);
        openTimer=setTimeout(openCosmos,2100);
        flashTimer=setTimeout(()=>flash.classList.remove('show'),2700);
      };
      egg.addEventListener('click',()=>{
        if(revealed){openCosmos();return;}
        clicks++;
        if(clicks===1){setStage(1);updateEggHint(1);egg.setAttribute('aria-label','O ovo reagiu. Toque mais uma vez.');}
        else if(clicks===2){setStage(2);updateEggHint(2);egg.setAttribute('aria-label','O ovo está prestes a eclodir. Toque outra vez para revelar o segredo.');}
        else reveal();
      });
      const closeCosmos=()=>{overlay.classList.remove('open');popover.classList.remove('show');activeNode?.classList.remove('selected');activeNode=null;};
      close.addEventListener('click',closeCosmos);
      overlay.addEventListener('click',e=>{if(e.target===overlay)closeCosmos();});
      root.addEventListener('keydown',e=>{if(e.key==='Escape'&&overlay.classList.contains('open'))closeCosmos();});

      tabs.forEach(tab=>tab.addEventListener('click',()=>{
        tabs.forEach(b=>{const on=b===tab;b.classList.toggle('active',on);b.setAttribute('aria-selected',on?'true':'false')});
        panels.forEach(p=>p.classList.toggle('active',p.dataset.panel===tab.dataset.tab));
        popover.classList.remove('show');activeNode?.classList.remove('selected');activeNode=null;
      }));

      const companionQuizHost=root.querySelector('[data-companion-quiz]');
      const shareUrl=new URL('index.html',location.href).href;
      const companionState={step:0,answers:[],result:null};
      let spriteSheetPromise=null;

      const imageCache=new Map();
      const loadImage=src=>{if(imageCache.has(src))return imageCache.get(src);const promise=new Promise((resolve,reject)=>{const image=new Image();image.decoding='async';image.onload=()=>resolve(image);image.onerror=()=>reject(new Error('Não foi possível carregar a arte do Pokémon.'));image.src=src;});imageCache.set(src,promise);return promise;};
      const getSpriteSheet=()=>spriteSheetPromise||(spriteSheetPromise=loadImage(SPRITE_DATA));
      const pulseButton=(button,label)=>{if(!button)return;const original=button.dataset.label||button.textContent;button.dataset.label=original;button.textContent=label;clearTimeout(button._pulseTimer);button._pulseTimer=setTimeout(()=>{button.textContent=button.dataset.label||original;},1600);};
      const resultPriority=(scores)=>companionPriority.map((key,index)=>({key,score:scores[key]||0,index})).sort((a,b)=>b.score-a.score||a.index-b.index)[0]?.key||'lugia';
      const computeCompanionResult=()=>{const scores={};companionState.answers.forEach((answerIndex,questionIndex)=>{const option=companionQuestions[questionIndex]?.options?.[answerIndex];if(!option)return;Object.entries(option.scores).forEach(([key,value])=>{scores[key]=(scores[key]||0)+value;});});return resultPriority(scores);};
      const companionProgress=(step,total)=>`<div class="quiz-progress"><span>Pergunta ${step} de ${total}</span><div class="quiz-track" aria-hidden="true"><div class="quiz-fill" style="width:${Math.round(step/total*100)}%"></div></div></div>`;
      const renderQuestion=()=>{const q=companionQuestions[companionState.step];companionQuizHost.innerHTML=`<div class="quiz-card">${companionProgress(companionState.step+1,companionQuestions.length)}<h4 class="quiz-question">${q.q}</h4><div class="quiz-options">${q.options.map((option,index)=>`<button class="quiz-option" type="button" data-answer="${index}"><span class="quiz-option-badge">${String.fromCharCode(65+index)}</span><span class="quiz-option-text">${option.text}</span></button>`).join('')}</div><div class="quiz-meta">Escolha a alternativa que mais combina com você. O resultado aparece ao final com um card próprio para compartilhar.</div></div>`;};
      const renderResult=key=>{const profile=companionProfiles[key];companionQuizHost.innerHTML=`<div class="result-card" style="--c1:${profile.gradient[0]};--c2:${profile.gradient[1]};--glow:${profile.glow}"><div class="result-top"><div class="result-art" style="--glow:${profile.glow}">${companionArt(key,'companion-result-art')}</div><div class="result-copy"><span class="result-kicker">✦ Companheiro encontrado · ${profile.type}</span><h4>${profile.name}</h4><p class="subtitle">${profile.title}</p><p>${profile.desc}</p><ul class="trait-list">${profile.traits.map(trait=>`<li>${trait}</li>`).join('')}</ul></div></div><div class="result-actions"><button class="result-btn primary" type="button" data-companion-action="share">📤 Compartilhar resultado</button><button class="result-btn" type="button" data-companion-action="save">🖼️ Salvar card</button><button class="result-btn" type="button" data-companion-action="copy">📋 Copiar texto</button><button class="result-btn" type="button" data-companion-action="reset">↻ Refazer</button></div><div class="result-note">O card é criado no seu próprio navegador. No celular, o botão de compartilhar usa o menu nativo quando disponível.</div></div>`;};
      const renderCompanionQuiz=()=>{if(!companionQuizHost)return;if(companionState.result)renderResult(companionState.result);else renderQuestion();};
      const roundedRect=(ctx,x,y,w,h,r)=>{const radius=Math.min(r,w/2,h/2);ctx.beginPath();ctx.moveTo(x+radius,y);ctx.arcTo(x+w,y,x+w,y+h,radius);ctx.arcTo(x+w,y+h,x,y+h,radius);ctx.arcTo(x,y+h,x,y,radius);ctx.arcTo(x,y,x+w,y,radius);ctx.closePath();};
      const wrapText=(ctx,text,x,y,maxWidth,lineHeight,color)=>{ctx.fillStyle=color;const words=text.split(/\s+/);let line='';let currentY=y;for(const word of words){const test=line?`${line} ${word}`:word;if(ctx.measureText(test).width>maxWidth&&line){ctx.fillText(line,x,currentY);line=word;currentY+=lineHeight;}else{line=test;}}if(line)ctx.fillText(line,x,currentY);return currentY;};
      const buildCompanionCard=async key=>{
        const profile=companionProfiles[key];
        const canvas=document.createElement('canvas');canvas.width=1080;canvas.height=1350;
        const ctx=canvas.getContext('2d'),W=canvas.width,H=canvas.height;
        ctx.fillStyle='#07111f';ctx.fillRect(0,0,W,H);
        const bg=ctx.createLinearGradient(0,0,W,H);bg.addColorStop(0,'#07111f');bg.addColorStop(.58,'#091426');bg.addColorStop(1,'#07101d');ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
        const glow1=ctx.createRadialGradient(100,70,0,100,70,520);glow1.addColorStop(0,profile.gradient[0]+'55');glow1.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=glow1;ctx.fillRect(0,0,W,H);
        const glow2=ctx.createRadialGradient(1000,1290,0,1000,1290,540);glow2.addColorStop(0,profile.gradient[1]+'44');glow2.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=glow2;ctx.fillRect(0,0,W,H);
        for(let i=0;i<28;i++){const x=(i*193)%W,y=(i*277)%H,r=1.4+(i%3);ctx.fillStyle=`rgba(255,255,255,${.025+(i%4)*.01})`;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();}
        const hero=ctx.createLinearGradient(70,80,1010,570);hero.addColorStop(0,profile.gradient[0]);hero.addColorStop(1,profile.gradient[1]);roundedRect(ctx,70,76,940,500,38);ctx.fillStyle=hero;ctx.fill();
        const heroShade=ctx.createLinearGradient(70,76,1010,576);heroShade.addColorStop(0,'rgba(0,0,0,.02)');heroShade.addColorStop(1,'rgba(4,10,20,.12)');ctx.fillStyle=heroShade;roundedRect(ctx,70,76,940,500,38);ctx.fill();
        ctx.fillStyle='rgba(255,255,255,.96)';ctx.font='800 30px Inter, Arial, sans-serif';ctx.fillText('GO NEXUS',116,142);
        ctx.fillStyle='rgba(255,255,255,.80)';ctx.font='600 24px Inter, Arial, sans-serif';ctx.fillText('MEU COMPANHEIRO LENDÁRIO OU MÍTICO',116,184);
        ctx.fillStyle='#fff';ctx.font='900 76px Inter, Arial, sans-serif';ctx.fillText(profile.name.toUpperCase(),116,300);
        ctx.fillStyle='rgba(255,249,214,.98)';ctx.font='800 34px Inter, Arial, sans-serif';ctx.fillText(profile.title,116,350);
        roundedRect(ctx,116,389,156,48,24);ctx.fillStyle='rgba(5,12,25,.23)';ctx.fill();ctx.fillStyle='#fff';ctx.font='800 24px Inter, Arial, sans-serif';ctx.fillText(profile.type,140,421);
        const art=await loadImage(companionAssetMap[key]);const cx=830,cy=320;const aura=ctx.createRadialGradient(cx,cy,20,cx,cy,190);aura.addColorStop(0,'rgba(255,255,255,.25)');aura.addColorStop(.42,`rgba(${profile.glow},.20)`);aura.addColorStop(1,'rgba(255,255,255,0)');ctx.fillStyle=aura;ctx.beginPath();ctx.arc(cx,cy,190,0,Math.PI*2);ctx.fill();ctx.strokeStyle='rgba(255,255,255,.24)';ctx.lineWidth=2;ctx.beginPath();ctx.arc(cx,cy,154,0,Math.PI*2);ctx.stroke();ctx.drawImage(art,690,180,280,280);
        ctx.fillStyle='#f7fbff';ctx.font='800 34px Inter, Arial, sans-serif';ctx.fillText('Sua energia',116,680);
        let tx=116,ty=734;ctx.font='800 25px Inter, Arial, sans-serif';for(const trait of profile.traits){const width=ctx.measureText(trait).width+48;if(tx+width>940){tx=116;ty+=58;}roundedRect(ctx,tx,ty-34,width,48,24);ctx.fillStyle=`rgba(${profile.glow},.08)`;ctx.fill();ctx.strokeStyle=`rgba(${profile.glow},.25)`;ctx.lineWidth=1.5;ctx.stroke();ctx.fillStyle='#f3f7fd';ctx.fillText(trait,tx+24,ty-2);tx+=width+12;}
        ctx.font='500 31px Inter, Arial, sans-serif';wrapText(ctx,profile.desc,116,852,840,47,'#cbd8e8');
        ctx.strokeStyle='rgba(128,150,184,.22)';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(116,1062);ctx.lineTo(964,1062);ctx.stroke();
        ctx.fillStyle='#93c5fd';ctx.font='800 28px Inter, Arial, sans-serif';ctx.fillText('Descubra o seu companheiro',116,1122);
        ctx.fillStyle='#9aacbf';ctx.font='500 23px Inter, Arial, sans-serif';ctx.fillText('evandroferreira8.github.io/GoNexus/',116,1164);
        ctx.fillStyle='rgba(255,255,255,.56)';ctx.font='600 21px Inter, Arial, sans-serif';ctx.fillText('Quiz lúdico · resultado baseado nas suas escolhas',116,1254);ctx.textAlign='right';ctx.fillStyle='rgba(255,255,255,.82)';ctx.font='800 22px Inter, Arial, sans-serif';ctx.fillText('GO NEXUS',964,1254);ctx.textAlign='left';
        const blob=await new Promise((resolve,reject)=>canvas.toBlob(value=>value?resolve(value):reject(new Error('O navegador não conseguiu gerar a imagem do card.')),'image/png'));
        return {blob,canvas};
      };
      const companionShareText=key=>`${companionProfiles[key].share}
Descubra o seu: ${shareUrl}`;
      const downloadBlob=(blob,filename)=>{const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=filename;a.rel='noopener';a.style.display='none';document.body.appendChild(a);a.click();setTimeout(()=>{a.remove();URL.revokeObjectURL(url);},2500);};
      const saveCompanionCard=async key=>{const {blob}=await buildCompanionCard(key);downloadBlob(blob,`go-nexus-companheiro-${key}.png`);};
      const shareCompanionCard=async key=>{const shareText=companionShareText(key);const {blob}=await buildCompanionCard(key);const filename=`go-nexus-companheiro-${key}.png`;const file=new File([blob],filename,{type:'image/png'});if(navigator.canShare?.({files:[file]})){try{await navigator.share({title:`Meu companheiro do GO Nexus é ${companionProfiles[key].name}`,text:shareText,files:[file]});return;}catch(err){if(err?.name==='AbortError')return;}}if(navigator.share){try{await navigator.share({title:`Meu companheiro do GO Nexus é ${companionProfiles[key].name}`,text:shareText,url:shareUrl});return;}catch(err){if(err?.name==='AbortError')return;}}downloadBlob(blob,filename);}
      const copyCompanionResult=async key=>{const text=companionShareText(key);if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(text);}else{const area=document.createElement('textarea');area.value=text;document.body.appendChild(area);area.select();document.execCommand('copy');area.remove();}}
      companionQuizHost?.addEventListener('click',async e=>{const answer=e.target.closest('[data-answer]');if(answer){const index=Number(answer.dataset.answer);companionState.answers[companionState.step]=index;if(companionState.step<companionQuestions.length-1){companionState.step+=1;}else{companionState.result=computeCompanionResult();}renderCompanionQuiz();return;}const action=e.target.closest('[data-companion-action]');if(!action||!companionState.result)return;try{if(action.dataset.companionAction==='reset'){companionState.step=0;companionState.answers=[];companionState.result=null;renderCompanionQuiz();return;}if(action.dataset.companionAction==='copy'){await copyCompanionResult(companionState.result);pulseButton(action,'✅ Copiado');return;}if(action.dataset.companionAction==='save'){action.disabled=true;pulseButton(action,'⏳ Gerando');await saveCompanionCard(companionState.result);action.disabled=false;pulseButton(action,'✅ Salvo');return;}if(action.dataset.companionAction==='share'){action.disabled=true;pulseButton(action,'⏳ Preparando');await shareCompanionCard(companionState.result);action.disabled=false;pulseButton(action,'✅ Pronto');return;}}catch(err){action.disabled=false;pulseButton(action,'⚠️ Tente de novo');console.warn(err);}});
      renderCompanionQuiz();

      const positionPopover=(button)=>{
        const r=button.getBoundingClientRect();
        const mobile=window.innerWidth<=700;
        const width=Math.min(mobile?300:360,window.innerWidth-(mobile?20:24));
        const estimatedH=mobile?132:148,gap=mobile?7:10;
        let left=r.right+gap,top=r.top+(r.height-estimatedH)/2,arrowX=-6,arrowY=32;
        if(left+width>window.innerWidth-12){left=r.left-width-gap;arrowX=width-5;arrowY=32;}
        if(mobile){
          left=Math.max(10,Math.min(r.left+r.width/2-width/2,window.innerWidth-width-10));
          const spaceBelow=window.innerHeight-r.bottom;
          const showAbove=spaceBelow<estimatedH+gap+18 && r.top>estimatedH+gap+18;
          top=showAbove?r.top-estimatedH-gap:r.bottom+gap;
          arrowX=Math.max(18,Math.min(width-28,r.left+r.width/2-left-5));
          arrowY=showAbove?estimatedH-5:-6;
        }
        top=Math.max(10,Math.min(top,window.innerHeight-estimatedH-10));
        popover.style.left=`${Math.round(left)}px`;popover.style.top=`${Math.round(top)}px`;
        popover.style.setProperty('--arrow-x',`${Math.round(arrowX)}px`);popover.style.setProperty('--arrow-y',`${Math.round(arrowY)}px`);
      };
      const showDetail=(button)=>{
        const key=button.dataset.key,p=lore[key];if(!p)return;
        root.querySelectorAll('.cosmic-node.selected').forEach(n=>n.classList.remove('selected'));
        button.classList.add('selected');activeNode=button;
        popover.style.setProperty('--pop-glow',p.glow);
        popover.innerHTML=`${img(key)}<div><strong>${p.name} <b>${p.tag}</b></strong><p>${p.text}</p></div>`;
        popover.classList.add('show');requestAnimationFrame(()=>positionPopover(button));
      };
      const popOverClose=()=>{popover.classList.remove('show');activeNode?.classList.remove('selected');activeNode=null;};
      root.querySelectorAll('.cosmic-node[data-key]').forEach(btn=>btn.addEventListener('click',e=>{e.stopPropagation();showDetail(btn);}));
      root.addEventListener('click',e=>{if(!e.composedPath().some(el=>el?.classList?.contains?.('cosmic-node')))popOverClose();});
      root.querySelector('.cosmos').addEventListener('scroll',()=>{if(activeNode)positionPopover(activeNode);},{passive:true});
      window.addEventListener('resize',()=>{if(activeNode)positionPopover(activeNode);});
    }
  }

  if(!customElements.get('go-nexus-cosmic-egg')) customElements.define('go-nexus-cosmic-egg',GoNexusCosmicEgg);
  const mountCosmicEgg=()=>{if(!document.querySelector('go-nexus-cosmic-egg'))document.body.appendChild(document.createElement('go-nexus-cosmic-egg'));};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mountCosmicEgg,{once:true});else mountCosmicEgg();


})();
