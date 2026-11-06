const fs = require('fs');
const content = fs.readFileSync('internahub.html', 'utf8');

const ioConstStart = content.indexOf('const IO_CONTAINER_HTML = "');
console.log('ioConstStart:', ioConstStart);

// find where IO_CONTAINER_HTML ends
// In internahub.html, it ended with </script>";\n\nfunction initAdjustrIo
const brokenEnd = content.indexOf('</script>";', ioConstStart);
console.log('brokenEnd:', brokenEnd);

const fullStr = content.substring(ioConstStart + 'const IO_CONTAINER_HTML = "'.length, brokenEnd);
const scriptOpen = fullStr.indexOf('<script>');
console.log('scriptOpen in fullStr:', scriptOpen);

if (scriptOpen !== -1) {
  const beforeScript = fullStr.substring(0, scriptOpen);
  console.log('HTML before script length:', beforeScript.length);
  const afterScriptStart = fullStr.substring(scriptOpen);
  console.log('Script length inside HTML string:', afterScriptStart.length);
}

const initFnStart = content.indexOf('function initAdjustrIo');
console.log('initFnStart:', initFnStart);
const initFnEnd = content.indexOf('/* ===================== RHEUMATOOLS REGISTRY ===================== */', initFnStart);
console.log('initFnEnd:', initFnEnd);
console.log('initAdjustrIo length:', initFnEnd - initFnStart);
