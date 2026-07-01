'use client';

import { useState } from 'react';

export default function Calculator() {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('0');
  const [justEvaluated, setJustEvaluated] = useState(false);

  const buttons = [
    'C', '±', '%', '/',
    '7', '8', '9', '*',
    '4', '5', '6', '-',
    '1', '2', '3', '+',
    '0', '.', '⌫', '=',
  ];

  const handleClick = (val: string) => {
    if (val === 'C') {
      setExpression('');
      setResult('0');
      setJustEvaluated(false);
    } else if (val === '=') {
      try {
        const evalResult = Function('"use strict"; return (' + expression + ')')();
        setResult(String(evalResult));
        setExpression(String(evalResult));
        setJustEvaluated(true);
      } catch {
        setResult('Error');
        setJustEvaluated(true);
      }
    } else if (val === '⌫') {
      if (justEvaluated) {
        setExpression('');
        setResult('0');
        setJustEvaluated(false);
      } else {
        const next = expression.slice(0, -1);
        setExpression(next);
        if (!next) setResult('0');
        else setResult(next);
      }
    } else if (val === '±') {
      if (result !== '0') {
        const toggled = result.startsWith('-') ? result.slice(1) : '-' + result;
        setResult(toggled);
        setExpression(toggled);
      }
    } else {
      if (justEvaluated) {
        if (['+', '-', '*', '/', '%'].includes(val)) {
          setJustEvaluated(false);
        } else {
          setExpression('');
          setResult('0');
          setJustEvaluated(false);
        }
      }
      const next = expression + val;
      setExpression(next);
      setResult(next);
    }
  };

  return (
    <div className="calc-layout">
      <div className="calc-display">
        <div className="calc-expression">{expression}</div>
        <div className="calc-result">{result}</div>
      </div>
      <div className="calc-grid">
        {buttons.map((b) => {
          let cls = 'calc-btn';
          if (b === '=') cls += ' eq';
          else if (['+', '-', '*', '/', '%'].includes(b)) cls += ' op';
          else if (b === 'C') cls += ' clr';
          if (b === '0') cls += ' span2';
          return (
            <button key={b} className={cls} onClick={() => handleClick(b)}>
              {b}
            </button>
          );
        })}
      </div>
    </div>
  );
}
