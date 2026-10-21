/* GO Nexus — Gerador de Pesquisas: local index, no account / no tracking of lists. */
(() => {
  "use strict";
  const byId = new Map();
  const byName = new Map();
  const input = document.getElementById("namesInput");
  const sample = document.getElementById("sampleBtn");
  const clear = document.getElementById("clearBtn");
  const copy = document.getElementById("copyBtn");
  const copyLabel = document.getElementById("copyLabel");
  const output = document.getElementById("searchOutput");
  const count = document.getElementById("resultCount");
  const ready = document.getElementById("dataStatus");
  const matches = document.getElementById("matchesPanel");
  const matchList = document.getElementById("matchList");
  const matchCount = document.getElementById("matchesCount");
  const errorsBox = document.getElementById("issuesBox");
  const errorsTitle = document.getElementById("issuesTitle");
  const errorsList = document.getElementById("issuesList");
  const formsNote = document.getElementById("formsNote");
  const EXAMPLE = "Palkia Origin\nReshiram\nXerneas\nDialga Origin\nLugia\nLunala\nZekrom\nHo-oh";
  const FALLBACK = {
    1:["Bulbasaur"],25:["Pikachu"],150:["Mewtwo"],249:["Lugia"],250:["Ho-Oh"],
    483:["Dialga"],484:["Palkia"],643:["Reshiram"],644:["Zekrom"],
    716:["Xerneas"],792:["Lunala"],1025:["Pecharunt"]
  };
  const normalize = (str) => String(str || "").normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("en")
    .replace(/♀/g, "female").replace(/♂/g, "male")
    .replace(/[^a-z0-9]/g, "");
  const formRx = /\b(origin(?:e)?|origem|originaria|originario|forme?|formas?|altered|alterada|alternada|mega|primal|primordial|shiny|brilhante|shadow|sombrio|purified|purificado|alolan|alola|galarian|galar|hisuian|hisui|paldean|paldea|gigantamax|gigamax|dynamax|dinamax)\b/gi;
  function addIndex(id, names) {
    const number = Number(id);
    if (!Number.isInteger(number) || number < 1 || number > 1025 || !Array.isArray(names) || typeof names[0] !== "string") return;
    const record = { id: number, name: names[0] };
    byId.set(number, record);
    names.forEach((name) => {
      const key = normalize(name);
      if (key && !byName.has(key)) byName.set(key, record);
    });
  }
  Object.entries(FALLBACK).forEach(([id, names]) => addIndex(id, names));

  // Localized synonyms and common abbreviated forms. Species IDs always win over names.
  const ALIASES = {
    "nidoranf":29,"nidoranm":32,"nidoranfemale":29,"nidoranmale":32,
    "mimejr":439,"mrmime":122,"mrrime":866,"farfetchd":83,"sirfetchd":865,
    "hooh":250,"type null":772
  };
  const aliasesToAdd = () => Object.entries(ALIASES).forEach(([name, id]) => {
    const record = byId.get(id);
    if (record) byName.set(normalize(name), record);
  });
  aliasesToAdd();
  let latestQuery = "";

  function splitList(text) {
    return String(text || "").split(/[\r\n,;|]+/).map(s => s.trim()
      .replace(/^\s*(?:[-*•–]|\d+[.)])\s+/, "")
      .replace(/^[«“"'‘]+|[»”"'’]+$/g, "")
      .trim()).filter(Boolean);
  }
  function resolve(raw) {
    const candidate = raw.trim().replace(/^pok[eé]dex\s*#?\s*/i, "").trim();
    const numberMatch = candidate.match(/^#?0*(\d{1,4})$/);
    if (numberMatch) {
      const found = byId.get(Number(numberMatch[1]));
      return found ? {...found, qualified: false} : null;
    }
    const plain = byName.get(normalize(candidate));
    if (plain) return {...plain, qualified: false};
    const simplified = candidate.replace(formRx, " ").replace(/[()[\]{}]/g, " ").replace(/\s+/g, " ").trim();
    if (!simplified || simplified === candidate) return null;
    const found = byName.get(normalize(simplified));
    if (!found) return null;
    return {...found, qualified: true};
  }
  function pill(record) {
    const el = document.createElement("span");
    el.className = "gp-pill";
    const number = document.createElement("span");
    number.className = "gp-pill-no";
    number.textContent = "#" + String(record.id).padStart(4,"0");
    const name = document.createElement("span");
    name.textContent = record.name;
    el.append(number, name);
    if (record.qualified) {
      const note = document.createElement("span");
      note.className = "gp-pill-note";
      note.textContent = "forma";
      el.append(note);
    }
    return el;
  }
  function render() {
    const raw = input.value.trim();
    clear.disabled = !raw;
    const items = splitList(raw).slice(0, 200);
    const recognized = new Map();
    const unknown = [];
    for (const item of items) {
      const record = resolve(item);
      if (!record) { unknown.push(item); continue; }
      if (recognized.has(record.id)) {
        if (record.qualified) recognized.get(record.id).qualified = true;
      } else recognized.set(record.id, record);
    }
    const selected = [...recognized.values()];
    latestQuery = selected.map(x => x.id).join(",");
    const size = selected.length;
    output.textContent = latestQuery || "Sua pesquisa aparece aqui.";
    output.classList.toggle("empty", !latestQuery);
    count.textContent = size + " Pokémon";
    copy.disabled = !latestQuery;
    copyLabel.textContent = "Copiar pesquisa";
    matches.hidden = !size;
    matchCount.textContent = size + (size === 1 ? " identificado" : " identificados");
    matchList.replaceChildren(...selected.map(pill));
    const extra = splitList(raw).length > 200;
    errorsBox.hidden = !unknown.length && !extra;
    if (unknown.length || extra) {
      errorsTitle.textContent = unknown.length ? unknown.length + (unknown.length===1 ? " nome não encontrado" : " nomes não encontrados") : "Lista longa";
      errorsList.textContent = unknown.slice(0, 12).join(" · ") + (unknown.length>12 ? " · …" : "") +
        (extra ? " · Limite de 200 itens por vez." : "");
    }
    formsNote.hidden = !selected.some(x => x.qualified);
  }
  input.addEventListener("input", render);
  sample.addEventListener("click", () => {input.value = EXAMPLE; render(); input.focus();});
  clear.addEventListener("click", () => {input.value = ""; render(); input.focus();});
  copy.addEventListener("click", async () => {
    if (!latestQuery) return;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(latestQuery);
      } else {
        const scratch = document.createElement("textarea");
        scratch.value = latestQuery;
        scratch.style.position = "fixed";
        scratch.style.top = "-9999px";
        document.body.appendChild(scratch);
        scratch.focus(); scratch.select();
        const success = document.execCommand("copy");
        scratch.remove();
        if (!success) throw Error("Clipboard failed");
      }
      copyLabel.textContent = "Copiado! Abra o Pokémon GO";
    } catch (error) {
      copyLabel.textContent = "Não foi possível copiar. Selecione o código acima.";
    }
  });
  render();
  fetch("dex-index.json", { cache: "force-cache" }).then(response => {
    if (!response.ok) throw Error("Pokédex indisponível");
    return response.json();
  }).then(data => {
    if (!data || typeof data !== "object" || Object.keys(data).length < 1025) throw Error("Dados incompletos");
    Object.entries(data).forEach(([id, names]) => addIndex(id, names));
    aliasesToAdd();
    ready.classList.add("ready");
    ready.lastChild.textContent = " Pokédex pronta · 1.025 espécies";
    render();
  }).catch(() => {
    ready.lastChild.textContent = " Base reduzida disponível. Recarregue para buscar todos.";
    render();
  });
})();
