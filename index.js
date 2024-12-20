let zh_CN = {
  "msgSaved":"已保存",
  "msgCopyFailed":"操作失败，未能复制元素链接",
  "msgNotElement": "刚刚复制的不是画板元素！",
  "msgIDFailed": "未能获取到画板元素的ID",
  "msgCopied": "已将链接复制到剪切板",
  "msgPreviewMode": "预览模式",
  "msgPreviewModeOff": "已关闭预览模式",
  "msgAutoSaveOff": "已关闭自动保存！",
  "msgAutoSaveOn": "编辑结束约2s后自动保存",
  "msgNoRelevantResults": "未查找到相关结果！",
  "msgNeedPlugin": "悬浮预览失败，建议先安装插件【开放API】",
  "msgSaveFailed":"保存失败，请查看控制台报错信息！",
  "msgGetFileFailed":"画板文件获取失败，手动刷新后将新建空的白板",
  "msgSetAliasFailed":"设置文档别名失败",
  "msgReadFilePathFailed":"未能读取到块属性中白板文件的路径，将自动刷新",
}
let en_US = {
  "msgSaved":"Saved",
  "msgCopyFailed":"Operation failed, unable to copy the element link.",
  "msgNotElement": "The copied item is not a canvas element!",
  "msgIDFailed": "Failed to get the ID of the canvas element.",
  "msgCopied": "The link has been copied to the clipboard.",
  "msgPreviewMode": "Preview mode",
  "msgPreviewModeOff": "Preview mode has been turned off.",
  "msgAutoSaveOff": "Auto-save has been turned off!",
  "msgAutoSaveOn": "Automatically save about 2 seconds after editing ends.",
  "msgNoRelevantResults": "No relevant results found!",
  "msgNeedPlugin": "Hover preview failed, it is recommended to install the plugin [Open API] first.",
  "msgSaveFailed":"Save failed, please check the console for error messages!",
  "msgGetFileFailed":"Failed to get the canvas file, a new blank whiteboard will be created after manual refresh.",
  "msgSetAliasFailed":"Failed to set document alias.",
  "msgReadFilePathFailed":"Failed to read the path of the whiteboard file in the block attributes, will automatically refresh.",
}
let es_ES = {
  "msgSaved":"Guardado",
  "msgCopyFailed":"La operación falló, no se pudo copiar el enlace del elemento.",
  "msgNotElement": "El elemento copiado no es un elemento del lienzo!",
  "msgIDFailed": "Fallido en obtener el ID del elemento del lienzo.",
  "msgCopied": "El enlace se ha copiado al portapapeles.",
  "msgPreviewMode": "Modo de vista previa",
  "msgPreviewModeOff": "El modo de vista previa ha sido desactivado.",
  "msgAutoSaveOff": "La función de guardado automático ha sido desactivada!",
  "msgAutoSaveOn": "Se guardará automáticamente aproximadamente cada 2 segundos después de finalizar la edición.",
  "msgNoRelevantResults": "No se han encontrado resultados relevantes!",
  "msgNeedPlugin": "Falló la vista previa en hover, se recomienda instalar el plugin [Open API] primero.",
  "msgSaveFailed":"Falló el guardado, por favor revisa la consola para obtener los mensajes de error!",
  "msgGetFileFailed":"Falló en obtener el archivo del lienzo, se creará un nuevo cuadro de lápiz tras una actualización manual.",
  "msgSetAliasFailed":"Falló en establecer el alias del documento.",
  "msgReadFilePathFailed":"Falló en leer el path del archivo de cuadro de lápiz en los atributos del bloque, se actualizará automáticamente tras una actualización manual.",
}

// When setting the language of a note-taking software 
// to Simplified Chinese or Traditional Chinese, 
// a Chinese prompt will pop up in the upper left corner. 
// Otherwise, an English prompt will pop up.

window._languages = zh_CN;
let lang = window.top.siyuan.config.lang;
switch (lang) {
  case "zh_CN":
  case "zh_CHT":
    window._languages = zh_CN;
    break;
  case "es_ES":
    window._languages = es_ES;
    break;
  default:
    window._languages = en_US;
    break;
}
let myMessage = document.getElementById("myMessage");
let saveBtn = document.getElementById('saveBtn');
let refreshBtn = document.getElementById('refreshBtn');
refreshBtn.addEventListener('click', () => { window.location.reload(); })
// Pop-up message box
window.showMessage = function (msg, duration = 2000) {
  let dom = document.createElement('div')
  dom.innerText = msg  + ` (${new Date().toLocaleString()})`;
  dom.className = 'message'
  myMessage.appendChild(dom);
  setTimeout(() => {
    if (dom.previousElementSibling) {
      myMessage.removeChild(dom.previousElementSibling)
    }
  }, duration);
}
// Save when saving defaults to writing the text content of the whiteboard into the document
// note, making it easy to search globally
window._allowSetMemo = true;
// Default off floating preview
window._allowPreview = false;
// Whether to default on auto-save
window._autoSave = true;
// The initial rendering triggers no need for the first auto-save, reducing performance consumption
window._state = false;
if (window._autoSave) {
  window._state = true;
  window._autoSave = !window._autoSave;
}
// Copy content to clipboard
function patseIntoClipboard(txt) {
  let status = false
  const input = document.createElement('textarea')
  document.body.appendChild(input)
  input.innerHTML = txt
  input.select()
  if (document.execCommand('copy')) {
    document.execCommand('copy')
    status = true
  } else {
    showMessage(window._languages["msgCopyFailed"])
  }
  document.body.removeChild(input)
  return status
}
async function getElementIDFromClipboadr() {
  let str = await navigator.clipboard.readText()
  if (!str.startsWith(`{"type":"excalidraw/clipboard"`)) {
    showMessage(window._languages["msgNotElement"])
    return null
  }
  let result = str.match(/\"id\"\:\"(.+?)\"/);
  let id;
  if (result && result[1]) {
    id = result[1]
  } else {
    showMessage(window._languages["msgIDFailed"])
    return null
  }
  let status = patseIntoClipboard(`excalidraw://${id}`);
  showMessage(window._languages["msgCopied"])
}
// Keyboard shortcuts
document.addEventListener("keydown", (e => {
  if (e.altKey && "q" === e.key) {
    window._allowPreview = !0;
    showMessage(window._languages["msgPreviewMode"])
  }
  if (e.altKey && "w" === e.key) {
    window._allowPreview = !1;
    showMessage(window._languages["msgPreviewModeOff"]);
  }
  if (e.altKey && "f" === e.key) {
    window._autoSave = !window._autoSave;
    if (!window._autoSave) {
      showMessage(window._languages["msgAutoSaveOff"])
    } else {
      showMessage(window._languages["msgAutoSaveOn"])
    }
  }
  if (e.ctrlKey && e.key === "j") {
    getElementIDFromClipboadr();
  }
  // Full Screen
  if (e.altKey && "y" === e.key) {
    if (window?.frameElement?.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.classList?.contains("protyle")) {
      if (window?.frameElement?.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.classList?.contains("fullscreen")) {
        window.frameElement.parentElement.parentElement.parentElement.parentElement.parentElement.classList.remove("fullscreen");
      } else {
        window.frameElement.parentElement.parentElement.parentElement.parentElement.parentElement.classList.add("fullscreen");
      }
    }
  }
}), !0);
// Manual Saving
saveBtn.addEventListener('click', (e) => {
  if (window._isDarwin) {
    // Saving on macOS
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "S", metaKey: true, bubbles: true }));
  } else {
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "S", ctrlKey: true, bubbles: true }));
  }
}, false);
//  Search keywords
(async () => {
  function request(url, data = null) { return new Promise((resolve, reject) => { fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data), }).then((data) => resolve(data.json()), (error) => { reject(error); }).catch((err) => { console.error("请求失败:", err); }); }); }
  ; const searchPanel = document.getElementById("searchPanel"),
    keywordInput = document.getElementById("keywordInput"),
    targetArrContainer = document.getElementById("targetArrContainer");
  async function itemsContainsKeyword(e) {
    let t = []; e = e.trim();
    let widgetID = window.frameElement.parentElement.parentElement.getAttribute('data-node-id');
    let memoPath = `assets/ExcalidrawFiles/${widgetID}.excalidraw`
    let memoData = await request("/api/attr/getBlockAttrs", { id: widgetID });
    if (memoData?.data["custom-data-assets"]) {
      memoPath = memoData.data["custom-data-assets"];
    }
    let res = await request("/api/file/getFile", { path: `/data/${memoPath}` })
    let r = res.elements;
    if (r && e.length > 0) {
      let keywordArr = e.split(' ');
      keywordArr = keywordArr.filter((item) => item.trim());
      keywordArr = Array.from(new Set(keywordArr));
      for (let n of r) if ("text" === n.type && keywordArr.every((item) => new RegExp(`${item}`, "i").test(n.text))) {
        n.text = n.text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        keywordArr.forEach((item) => {
          let r = new RegExp(`${item}`, "ig");
          n.text = n.text.replace(r, (function (e) { return ` ${e} ` }));
        });
        keywordArr.forEach((item) => {
          let r = new RegExp(` ${item} `, "ig");
          n.text = n.text.replace(r, (function (e) { return `<span style="background-color:#ffe955;color:black;">${e.trim()}</span>` }));
        });
        t.push([n.text, n.id, n.x, n.y]);
      }
    }
    return t
  }
  function debounce(e, t = 500) { let r = null; return function (...n) { clearTimeout(r), r = setTimeout((() => { e.apply(this, n) }), t) } }
  let itemsArr = [], currentIndex = -1;
  async function handleKeywordSubmit() {
    const e = keywordInput.value.trim();
    if (itemsArr = [], e.length > 0) if (targetArrContainer.innerHTML = "", itemsArr = await itemsContainsKeyword(e), itemsArr.length > 0) {
      const e = document.createDocumentFragment(); itemsArr.forEach((t => { const r = document.createElement("div"); r.className = "ExcalidrawItem", r.style.marginTop = "6px", r.style.color = "black", r.style.backgroundColor = "#ffffff", r.style.borderRadius = "4px", r.style.padding = "3px", r.setAttribute("data-x", t[2]), r.setAttribute("data-y", t[3]), r.innerHTML = `${t[0]}`, e.appendChild(r) })), targetArrContainer.appendChild(e)
    } else targetArrContainer.innerHTML = window._languages["msgNoRelevantResults"], currentIndex = -1; else targetArrContainer.innerHTML = window._languages["msgNoRelevantResults"], currentIndex = -1
  }
  keywordInput.addEventListener("input", debounce(handleKeywordSubmit), !1),
    targetArrContainer.addEventListener("click", (e => {
      e.stopPropagation(); let t = targetArrContainer.querySelectorAll("div.ExcalidrawItem");
      if (e.target.classList.contains("ExcalidrawItem")) { const r = parseInt(e.target.getAttribute("data-x")), n = parseInt(e.target.getAttribute("data-y")); window.dispatchEvent(new CustomEvent("searchKeyword", { detail: { x: r, y: n } })); for (let r = 0; r < t.length; r++)e.target !== t[r] || t[r].classList.contains("active") ? t[r].classList.remove("active") : (t[r].classList.add("active"), currentIndex = r) }
      else if ("SPAN" === e.target.tagName && e.target.parentElement.classList.contains("ExcalidrawItem")) {
        const r = parseInt(e.target.parentElement.getAttribute("data-x")), n = parseInt(e.target.parentElement.getAttribute("data-y"));
        window.dispatchEvent(new CustomEvent("searchKeyword", { detail: { x: r, y: n } }));
        for (let r = 0; r < t.length; r++)e.target.parentElement !== t[r] || t[r].classList.contains("active") ? t[r].classList.remove("active") : t[r].classList.add("active")
      }
    }), !1),
    searchPanel.addEventListener("click", (e => { e.stopPropagation() }), !1), document.addEventListener("keydown", (e => { e.altKey && "t" === e.key && (searchPanel.style.visibility = "hidden" === searchPanel.style.visibility ? "visible" : "hidden", keywordInput.focus(), currentIndex = -1) }), !1), document.addEventListener("click", (e => { "visible" === searchPanel.style.visibility && (searchPanel.style.visibility = "hidden") }), !1), keywordInput.addEventListener("keydown", (e => { if (itemsArr.length > 0 && ("ArrowDown" === e.key || "ArrowUp" === e.key)) { "ArrowDown" === e.key ? currentIndex++ : "ArrowUp" === e.key && (e.preventDefault(), currentIndex--), currentIndex > itemsArr.length - 1 && (currentIndex = 0), currentIndex < 0 && (currentIndex = itemsArr.length - 1); let t = targetArrContainer.querySelectorAll("div.ExcalidrawItem"); for (let e = 0; e < t.length; e++)e !== currentIndex || t[e].classList.contains("active") ? t[e].classList.remove("active") : t[e].classList.add("active"); const r = parseInt(itemsArr[currentIndex][2]), n = parseInt(itemsArr[currentIndex][3]); window.dispatchEvent(new CustomEvent("searchKeyword", { detail: { x: r, y: n } })) } }), !1);
})()