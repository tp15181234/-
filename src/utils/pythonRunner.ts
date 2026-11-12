/**
 * Client-side educational Python emulator for the school curriculum:
 * Supports:
 * - print(...)
 * - input(...)
 * - int(), float(), str(), type()
 * - if, elif, else
 * - for i in range(...)
 * - while ...
 * - variable assignment, arithmetic and comparisons
 */

export interface RunResult {
  output: string;
  hasError: boolean;
  errorMessage?: string;
  variables: { name: string; type: string; value: string }[];
}

function stripInlineComment(str: string): string {
  let inSingle = false;
  let inDouble = false;
  for (let i = 0; i < str.length; i++) {
    const ch = str[i];
    if (ch === "'" && !inDouble) inSingle = !inSingle;
    else if (ch === '"' && !inSingle) inDouble = !inDouble;
    else if (ch === '#' && !inSingle && !inDouble) {
      return str.slice(0, i).trim();
    }
  }
  return str.trim();
}

export function executeEducationalPython(
  code: string,
  userInputs: string[] = []
): RunResult {
  const outputs: string[] = [];
  const memory: Record<string, any> = {};
  let inputCursor = 0;

  try {
    const lines = code.split('\n');
    let lineIdx = 0;
    const maxSteps = 2000;
    let stepCount = 0;

    // Helper to evaluate basic expressions in current memory scope
    const evalExpr = (exprStr: string): any => {
      let trimmed = stripInlineComment(exprStr.trim());
      if (!trimmed) return undefined;

      // Check if expression is entirely wrapped in a single function call fnName(...)
      const isEntirelyCall = (str: string, fnName: string) => {
        const prefix = fnName + '(';
        if (!str.startsWith(prefix) || !str.endsWith(')')) return false;
        let depth = 0;
        for (let i = prefix.length - 1; i < str.length; i++) {
          if (str[i] === '(') depth++;
          else if (str[i] === ')') {
            depth--;
            if (depth === 0) return i === str.length - 1;
          }
        }
        return false;
      };

      // Handle input()
      if (isEntirelyCall(trimmed, 'input')) {
        const val = inputCursor < userInputs.length ? userInputs[inputCursor++] : '0';
        return String(val); // input is always str
      }

      // Handle type()
      if (isEntirelyCall(trimmed, 'type')) {
        const inner = trimmed.slice(5, -1);
        const innerVal = evalExpr(inner);
        if (typeof innerVal === 'number') {
          return Number.isInteger(innerVal) ? "<class 'int'>" : "<class 'float'>";
        }
        if (typeof innerVal === 'string') return "<class 'str'>";
        if (typeof innerVal === 'boolean') return "<class 'bool'>";
        return "<class 'object'>";
      }

      // Handle direct int(...)
      if (isEntirelyCall(trimmed, 'int')) {
        const inner = trimmed.slice(4, -1);
        const innerVal = evalExpr(inner);
        const parsed = parseInt(String(innerVal), 10);
        if (isNaN(parsed)) throw new Error(`ValueError: invalid literal for int() with base 10: '${innerVal}'`);
        return parsed;
      }

      // Handle direct float(...)
      if (isEntirelyCall(trimmed, 'float')) {
        const inner = trimmed.slice(6, -1);
        const innerVal = evalExpr(inner);
        const parsed = parseFloat(String(innerVal));
        if (isNaN(parsed)) throw new Error(`ValueError: could not convert string to float: '${innerVal}'`);
        return parsed;
      }

      // Handle direct str(...)
      if (isEntirelyCall(trimmed, 'str')) {
        const inner = trimmed.slice(4, -1);
        const innerVal = evalExpr(inner);
        return String(innerVal);
      }

      // Direct string literal
      if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
        return trimmed.slice(1, -1);
      }

      // Direct boolean
      if (trimmed === 'True') return true;
      if (trimmed === 'False') return false;

      // Direct number
      if (/^-?\d+$/.test(trimmed)) return parseInt(trimmed, 10);
      if (/^-?\d+\.\d+$/.test(trimmed)) return parseFloat(trimmed);

      // Binary expressions with python operators
      const varNames = Object.keys(memory);
      const varValues = Object.values(memory);

      // Convert python syntax to js syntax for safe execution
      let jsCode = trimmed
        .replace(/\band\b/g, '&&')
        .replace(/\bor\b/g, '||')
        .replace(/\bnot\b/g, '!')
        .replace(/==/g, '===')
        .replace(/!=/g, '!==')
        .replace(/\bTrue\b/g, 'true')
        .replace(/\bFalse\b/g, 'false');

      // Check if expression is just a variable
      if (varNames.includes(trimmed)) {
        return memory[trimmed];
      }

      const pyInt = (v: any) => {
        const parsed = parseInt(String(v), 10);
        if (isNaN(parsed)) throw new Error(`ValueError: invalid literal for int() with base 10: '${v}'`);
        return parsed;
      };
      const pyFloat = (v: any) => {
        const parsed = parseFloat(String(v));
        if (isNaN(parsed)) throw new Error(`ValueError: could not convert string to float: '${v}'`);
        return parsed;
      };
      const pyStr = (v: any) => String(v);

      try {
        const fn = new Function('int', 'float', 'str', ...varNames, `return (${jsCode});`);
        return fn(pyInt, pyFloat, pyStr, ...varValues);
      } catch {
        return trimmed;
      }
    };

    // Helper to evaluate print statement
    const handlePrint = (line: string) => {
      const match = line.match(/^print\s*\((.*)\)\s*$/);
      if (!match) return;
      const rawArgs = match[1];
      if (!rawArgs.trim()) {
        outputs.push('\n');
        return;
      }

      // Split args by comma considering quotes
      const args: string[] = [];
      let current = '';
      let inQuote = false;
      let quoteChar = '';

      for (let i = 0; i < rawArgs.length; i++) {
        const char = rawArgs[i];
        if ((char === '"' || char === "'") && (i === 0 || rawArgs[i - 1] !== '\\')) {
          if (!inQuote) {
            inQuote = true;
            quoteChar = char;
          } else if (char === quoteChar) {
            inQuote = false;
          }
        }
        if (char === ',' && !inQuote) {
          args.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      if (current.trim()) args.push(current.trim());

      let sep = ' ';
      let end = '\n';
      const evaluatedParts: string[] = [];

      for (const arg of args) {
        if (arg.startsWith('sep=')) {
          sep = String(evalExpr(arg.slice(4)));
        } else if (arg.startsWith('end=')) {
          end = String(evalExpr(arg.slice(4)));
        } else {
          const val = evalExpr(arg);
          evaluatedParts.push(val !== undefined ? String(val) : '');
        }
      }

      const printed = evaluatedParts.join(sep);
      outputs.push(printed + end);
    };

    // Block runner
    const runLines = (start: number, end: number, minIndent: number) => {
      let idx = start;
      while (idx < end) {
        stepCount++;
        if (stepCount > maxSteps) {
          throw new Error('무한 루프 방지: 실행 단계 수가 2000회를 초과했습니다. while문 조건을 확인하세요!');
        }

        const raw = lines[idx];
        const trimmed = stripInlineComment(raw.trim());

        // Skip blank or comment
        if (!trimmed || trimmed.startsWith('#')) {
          idx++;
          continue;
        }

        const indent = raw.search(/\S/);
        if (indent < minIndent) break;

        // Print
        if (trimmed.startsWith('print(')) {
          handlePrint(trimmed);
          idx++;
          continue;
        }

        // Variable assignment (e.g. x = 10, total = total + i)
        if (trimmed.includes('=') && !trimmed.startsWith('if') && !trimmed.startsWith('while') && !trimmed.startsWith('for')) {
          const eqIdx = trimmed.indexOf('=');
          const left = trimmed.slice(0, eqIdx).trim();
          const right = trimmed.slice(eqIdx + 1).trim();

          // Handle +=, -=, *=
          if (left.endsWith('+') || left.endsWith('-') || left.endsWith('*')) {
            const op = left.slice(-1);
            const varName = left.slice(0, -1).trim();
            const val = evalExpr(right);
            if (op === '+') memory[varName] = (memory[varName] || 0) + val;
            if (op === '-') memory[varName] = (memory[varName] || 0) - val;
            if (op === '*') memory[varName] = (memory[varName] || 0) * val;
          } else {
            memory[left] = evalExpr(right);
          }
          idx++;
          continue;
        }

        // IF / ELIF / ELSE
        if (trimmed.startsWith('if ') || trimmed.startsWith('if(')) {
          const condMatch = trimmed.match(/^if\s+(.*):$/) || trimmed.match(/^if\((.*)\):$/);
          const condition = condMatch ? condMatch[1] : trimmed.slice(2).replace(/:$/, '');

          // Find the block of lines for this 'if'
          let ifBlockEnd = idx + 1;
          while (ifBlockEnd < end) {
            const nextRaw = lines[ifBlockEnd];
            if (!nextRaw.trim() || nextRaw.trim().startsWith('#')) {
              ifBlockEnd++;
              continue;
            }
            const nextIndent = nextRaw.search(/\S/);
            if (nextIndent <= indent) break;
            ifBlockEnd++;
          }

          const condResult = Boolean(evalExpr(condition));
          let conditionHandled = false;

          if (condResult) {
            runLines(idx + 1, ifBlockEnd, indent + 1);
            conditionHandled = true;
          }

          idx = ifBlockEnd;

          // Check for elif or else at the same indent
          while (idx < end) {
            const checkRaw = lines[idx];
            if (!checkRaw.trim() || checkRaw.trim().startsWith('#')) {
              idx++;
              continue;
            }
            const checkIndent = checkRaw.search(/\S/);
            if (checkIndent !== indent) break;

            const checkTrimmed = checkRaw.trim();
            if (checkTrimmed.startsWith('elif ')) {
              const elifCond = checkTrimmed.slice(4).replace(/:$/, '').trim();
              let elifBlockEnd = idx + 1;
              while (elifBlockEnd < end) {
                const nextRaw = lines[elifBlockEnd];
                if (!nextRaw.trim() || nextRaw.trim().startsWith('#')) {
                  elifBlockEnd++;
                  continue;
                }
                if (nextRaw.search(/\S/) <= indent) break;
                elifBlockEnd++;
              }

              if (!conditionHandled && evalExpr(elifCond)) {
                runLines(idx + 1, elifBlockEnd, indent + 1);
                conditionHandled = true;
              }
              idx = elifBlockEnd;
            } else if (checkTrimmed.startsWith('else:')) {
              let elseBlockEnd = idx + 1;
              while (elseBlockEnd < end) {
                const nextRaw = lines[elseBlockEnd];
                if (!nextRaw.trim() || nextRaw.trim().startsWith('#')) {
                  elseBlockEnd++;
                  continue;
                }
                if (nextRaw.search(/\S/) <= indent) break;
                elseBlockEnd++;
              }

              if (!conditionHandled) {
                runLines(idx + 1, elseBlockEnd, indent + 1);
                conditionHandled = true;
              }
              idx = elseBlockEnd;
            } else {
              break;
            }
          }
          continue;
        }

        // FOR LOOP (range)
        if (trimmed.startsWith('for ')) {
          const match = trimmed.match(/^for\s+([a-zA-Z_]\w*)\s+in\s+range\((.*)\):$/);
          if (match) {
            const varName = match[1];
            const rangeArgsStr = match[2];
            const rangeArgs = rangeArgsStr.split(',').map((s) => evalExpr(s));

            let startVal = 0;
            let stopVal = 0;
            let stepVal = 1;

            if (rangeArgs.length === 1) {
              stopVal = rangeArgs[0];
            } else if (rangeArgs.length === 2) {
              startVal = rangeArgs[0];
              stopVal = rangeArgs[1];
            } else if (rangeArgs.length >= 3) {
              startVal = rangeArgs[0];
              stopVal = rangeArgs[1];
              stepVal = rangeArgs[2];
            }

            // Find for block
            let loopEnd = idx + 1;
            while (loopEnd < end) {
              const nextRaw = lines[loopEnd];
              if (!nextRaw.trim() || nextRaw.trim().startsWith('#')) {
                loopEnd++;
                continue;
              }
              if (nextRaw.search(/\S/) <= indent) break;
              loopEnd++;
            }

            // Execute range iterations
            if (stepVal > 0) {
              for (let v = startVal; v < stopVal; v += stepVal) {
                memory[varName] = v;
                runLines(idx + 1, loopEnd, indent + 1);
              }
            } else if (stepVal < 0) {
              for (let v = startVal; v > stopVal; v += stepVal) {
                memory[varName] = v;
                runLines(idx + 1, loopEnd, indent + 1);
              }
            }

            idx = loopEnd;
            continue;
          }
        }

        // WHILE LOOP
        if (trimmed.startsWith('while ')) {
          const match = trimmed.match(/^while\s+(.*):$/);
          if (match) {
            const condition = match[1];
            // Find while block
            let whileEnd = idx + 1;
            while (whileEnd < end) {
              const nextRaw = lines[whileEnd];
              if (!nextRaw.trim() || nextRaw.trim().startsWith('#')) {
                whileEnd++;
                continue;
              }
              if (nextRaw.search(/\S/) <= indent) break;
              whileEnd++;
            }

            while (Boolean(evalExpr(condition))) {
              stepCount++;
              if (stepCount > maxSteps) {
                throw new Error('무한 루프 방지: while문이 너무 많이 반복되었습니다. 변수 증감(count = count + 1 등)을 확인하세요.');
              }
              runLines(idx + 1, whileEnd, indent + 1);
            }

            idx = whileEnd;
            continue;
          }
        }

        idx++;
      }
    };

    runLines(0, lines.length, 0);

    const variables = Object.entries(memory).map(([key, val]) => {
      let typeStr = 'unknown';
      if (typeof val === 'number') typeStr = Number.isInteger(val) ? 'int' : 'float';
      else if (typeof val === 'string') typeStr = 'str';
      else if (typeof val === 'boolean') typeStr = 'bool';

      return {
        name: key,
        type: typeStr,
        value: typeof val === 'string' ? `"${val}"` : String(val),
      };
    });

    return {
      output: outputs.join('') || '(출력 내용 없음)',
      hasError: false,
      variables,
    };
  } catch (err: any) {
    return {
      output: outputs.join(''),
      hasError: true,
      errorMessage: err.message || '실행 오류',
      variables: Object.entries(memory).map(([key, val]) => ({
        name: key,
        type: typeof val,
        value: String(val),
      })),
    };
  }
}
