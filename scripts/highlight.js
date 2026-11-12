// Tiny build-time JavaScript syntax highlighter (no dependencies, no runtime JS).
// Good enough for short, hand-picked snippets. Outputs escaped HTML with
// <span class="tok-*"> wrappers that styles.css colors.

const KEYWORDS = new Set(
  'async await break case catch class const continue default delete do else export extends finally for from function if import in instanceof let new of return switch throw try typeof var void while yield'.split(' ')
);
const LITERALS = new Set(['true', 'false', 'null', 'undefined', 'this']);

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const TOKEN = new RegExp(
  [
    '(\\/\\/[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/)', // 1 comment
    '(`(?:\\\\[\\s\\S]|[^`\\\\])*`|"(?:\\\\.|[^"\\\\])*"|\'(?:\\\\.|[^\'\\\\])*\')', // 2 string
    '(\\b\\d+(?:\\.\\d+)?\\b)', // 3 number
    '([A-Za-z_$][\\w$]*)(?=\\s*\\()', // 4 function call / declaration
    '([A-Za-z_$][\\w$]*)', // 5 identifier
    '(=>|===|!==|[=+\\-*/<>!&|?:]+)', // 6 operator
  ].join('|'),
  'g'
);

function highlight(code) {
  let out = '';
  let last = 0;
  for (const m of code.matchAll(TOKEN)) {
    out += esc(code.slice(last, m.index));
    last = m.index + m[0].length;
    const t = esc(m[0]);
    if (m[1]) out += `<span class="tok-comment">${t}</span>`;
    else if (m[2]) out += `<span class="tok-string">${t}</span>`;
    else if (m[3]) out += `<span class="tok-number">${t}</span>`;
    else if (m[4]) out += KEYWORDS.has(m[4]) ? `<span class="tok-keyword">${t}</span>` : `<span class="tok-fn">${t}</span>`;
    else if (m[5]) {
      if (KEYWORDS.has(m[5])) out += `<span class="tok-keyword">${t}</span>`;
      else if (LITERALS.has(m[5])) out += `<span class="tok-literal">${t}</span>`;
      else out += t;
    } else if (m[6]) out += `<span class="tok-op">${t}</span>`;
  }
  return out + esc(code.slice(last));
}

module.exports = { highlight };
