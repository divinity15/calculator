import React, { useState, useRef, useEffect } from 'react';

const ProfessionalScientificCalculator = () => {
  // Дефинирање на состојбата за влез (input) и референцата за тастатурниот фокус
  const [input, setInput] = useState('');
  const inputRef = useRef(null);

  // Дефинирање на состојбата за меморија (memory)
  const [memory, setMemory] = useState(null);

  // Дефинирање на состојбата за историја (history)
  const [history, setHistory] = useState([]);

  // Дефинирање на состојбата за прикажување историја (showHistory)
  const [showHistory, setShowHistory] = useState(false);

  // Дефинирање на состојбата за курсор (cursorPosition) и дали е фокусиран (isFocused)
  const [cursorPosition, setCursorPosition] = useState(0);
  const [isFocused, setIsFocused] = useState(false);

  // Дефинирање на состојбата за тема (theme)
  const [theme, setTheme] = useState('light');

  // Дефинирање на состојбата за степенски (degreeMode)
  const [degreeMode, setDegreeMode] = useState(true);

  // Ажурирање на root елементот со соодветна тема
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Функција за промена меѓу степени (DEG) и радијани (RAD)
  const toggleDegreeMode = () => {
    setDegreeMode(prev => !prev);
  };

  // Пресметка на факториел (factorial)
  const factorial = (n) => {
    if (n < 0) return 'Error';
    let res = 1;
    for (let i = 1; i <= n; i++) {
      res *= i;
    }
    return res;
  };

  // Сметање на број на отворени загради (openParenCount)
  const openParenCount =
    input.split('').filter(char => char === '(').length -
    input.split('').filter(char => char === ')').length;

  // Ракување со промена во полето за влез (handleInputChange)
  const handleInputChange = (e) => {
    setInput(e.target.value);
    setCursorPosition(e.target.selectionStart);
  };

  // Ракување со притисок на копче од тастатурата (handleButtonClick)
  const handleButtonClick = (value) => {
    const pos = inputRef.current ? inputRef.current.selectionStart : cursorPosition;
    const newInput = input.substring(0, pos) + value + input.substring(pos);
    setInput(newInput);
    setCursorPosition(pos + value.length);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Ракување со внес на функција (handleFunctionClick)
  const handleFunctionClick = (func) => {
    const pos = inputRef.current ? inputRef.current.selectionStart : cursorPosition;
    const newInput = input.substring(0, pos) + func + '(' + input.substring(pos);
    setInput(newInput);
    setCursorPosition(pos + func.length + 1);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Ракување со бришење на еден карактер (handleDelete)
  const handleDelete = () => {
    if (!input) return;
    const pos = inputRef.current ? inputRef.current.selectionStart : cursorPosition;
    if (pos > 0) {
      const newInput = input.substring(0, pos - 1) + input.substring(pos);
      setInput(newInput);
      setCursorPosition(pos - 1);
    }
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Ракување со целосно чистење (handleClear)
  const handleClear = () => {
    setInput('');
    setCursorPosition(0);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Ракување со функции за меморија (handleMemory)
  const handleMemory = (operation) => {
    if (operation === 'MS') {
      try {
        const currentValue = eval(input);
        setMemory(currentValue);
      } catch {
        return;
      }
    } else if (operation === 'MR') {
      if (memory !== null) {
        setInput(String(memory));
        setCursorPosition(String(memory).length);
      }
    } else if (operation === 'MC') {
      setMemory(null);
    } else if (operation === 'M+') {
      try {
        const currentValue = eval(input);
        setMemory((prev) => (prev !== null ? prev + currentValue : currentValue));
      } catch {
        return;
      }
    } else if (operation === 'M-') {
      try {
        const currentValue = eval(input);
        setMemory((prev) => (prev !== null ? prev - currentValue : -currentValue));
      } catch {
        return;
      }
    }
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Префрлање тема меѓу светла и темна (toggleTheme)
  const toggleTheme = () => {
    setTheme(prev => prev === "light" ? "dark" : "light");
  };

  // Израмнување на загради пред пресметка (balanceParentheses)
  const balanceParentheses = (expression) => {
    let openCount = 0;
    for (const char of expression) {
      if (char === '(') openCount++;
      else if (char === ')') openCount--;
    }
    if (openCount > 0) {
      return expression + ')'.repeat(openCount);
    }
    return expression;
  };

  // Пресметување на изразот, заменувајќи научни функции со Math еквиваленти (handleEvaluate)
  const handleEvaluate = () => {
    try {
      let expression = balanceParentheses(input);
      if (expression && expression !== "Error") {
        setHistory(prev => [...prev, expression]);
      }
      while (expression.includes('!')) {
        const factRegex = /(\d+)!/g;
        expression = expression.replace(factRegex, (match, number) => factorial(parseInt(number)));
      }
      expression = expression.replace(/\^/g, '**');
      expression = expression
        .replace(/sin\(/g, `Math.sin(${degreeMode ? 'Math.PI/180*' : ''}`)
        .replace(/cos\(/g, `Math.cos(${degreeMode ? 'Math.PI/180*' : ''}`)
        .replace(/tan\(/g, `Math.tan(${degreeMode ? 'Math.PI/180*' : ''}`)
        .replace(/asin\(/g, `${degreeMode ? '180/Math.PI*' : ''}Math.asin(`)
        .replace(/acos\(/g, `${degreeMode ? '180/Math.PI*' : ''}Math.acos(`)
        .replace(/atan\(/g, `${degreeMode ? '180/Math.PI*' : ''}Math.atan(`)
        .replace(/sqrt\(/g, 'Math.sqrt(')
        .replace(/log\(/g, 'Math.log10(')
        .replace(/ln\(/g, 'Math.log(')
        .replace(/abs\(/g, 'Math.abs(')
        .replace(/π/g, 'Math.PI')
        .replace(/e\b/g, 'Math.E');
      const result = eval(expression);
      let formattedResult;
      if (Number.isInteger(result)) {
        formattedResult = result;
      } else {
        formattedResult = parseFloat(result.toPrecision(10));
      }
      setInput(String(formattedResult));
      setCursorPosition(String(formattedResult).length);
    } catch (error) {
      setInput("Error");
      setCursorPosition(5);
    }
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Избирање пресметка од историја (selectHistoryItem)
  const selectHistoryItem = (item) => {
    setInput(item);
    setCursorPosition(item.length);
    setShowHistory(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Ракување со специјални функции (handleSpecialFunction)
  const handleSpecialFunction = (func) => {
    if (func === 'π') {
      handleButtonClick('π');
    } else if (func === 'e') {
      handleButtonClick('e');
    } else if (func === 'rand') {
      const random = Math.random();
      const pos = inputRef.current ? inputRef.current.selectionStart : cursorPosition;
      const newInput = input.substring(0, pos) + random + input.substring(pos);
      setInput(newInput);
      setCursorPosition(pos + String(random).length);
    } else if (func === 'x²') {
      handleButtonClick('^2');
    } else if (func === 'x³') {
      handleButtonClick('^3');
    } else if (func === '10^x') {
      handleButtonClick('10^');
    } else if (func === 'x^y') {
      handleButtonClick('^');
    } else if (func === '1/x') {
      try {
        const value = eval(input);
        const result = 1 / value;
        setInput(String(result));
        setCursorPosition(String(result).length);
      } catch {
        setInput("Error");
        setCursorPosition(5);
      }
    }
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Дефинирање на основните копчиња (mainButtons)
  const mainButtons = [
    { value: '7', display: '7', class: 'num-button' },
    { value: '8', display: '8', class: 'num-button' },
    { value: '9', display: '9', class: 'num-button' },
    { value: 'DEL', display: 'DEL', class: 'delete-button' },
    { value: 'C', display: 'C', class: 'clear-button' },
    
    { value: '4', display: '4', class: 'num-button' },
    { value: '5', display: '5', class: 'num-button' },
    { value: '6', display: '6', class: 'num-button' },
    { value: '*', display: '×', class: 'op-button' },
    { value: '/', display: '÷', class: 'op-button' },
    
    { value: '1', display: '1', class: 'num-button' },
    { value: '2', display: '2', class: 'num-button' },
    { value: '3', display: '3', class: 'num-button' },
    { value: '+', display: '+', class: 'op-button' },
    { value: '-', display: '−', class: 'op-button' },
    
    { value: '0', display: '0', class: 'num-button' },
    { value: '.', display: '.', class: 'num-button' },
    { value: '(', display: '(', class: 'bracket-button' },
    { value: ')', display: ')', class: 'bracket-button' },
    { value: '=', display: '=', class: 'equals-button' }
  ];

  // Дефинирање на научните копчиња (scientificButtons)
  const scientificButtons = [
    { value: 'sin', display: 'sin', class: 'sci-button', isFunction: true },
    { value: 'cos', display: 'cos', class: 'sci-button', isFunction: true },
    { value: 'tan', display: 'tan', class: 'sci-button', isFunction: true },
    { value: 'asin', display: 'asin', class: 'sci-button', isFunction: true },
    { value: 'acos', display: 'acos', class: 'sci-button', isFunction: true },
    
    { value: 'atan', display: 'atan', class: 'sci-button', isFunction: true },
    { value: 'log', display: 'log', class: 'sci-button', isFunction: true },
    { value: 'ln', display: 'ln', class: 'sci-button', isFunction: true },
    { value: 'sqrt', display: '√', class: 'sci-button', isFunction: true },
    { value: 'abs', display: '|x|', class: 'sci-button', isFunction: true },
    
    { value: 'π', display: 'π', class: 'constant-button', isFunction: false },
    { value: 'e', display: 'e', class: 'constant-button', isFunction: false },
    { value: 'x²', display: 'x²', class: 'sci-button', isFunction: false },
    { value: 'x³', display: 'x³', class: 'sci-button', isFunction: false },
    { value: 'x^y', display: 'xʸ', class: 'sci-button', isFunction: false },
    
    { value: '10^x', display: '10ˣ', class: 'sci-button', isFunction: false },
    { value: '!', display: 'x!', class: 'sci-button', isFunction: false },
    { value: '1/x', display: '1/x', class: 'sci-button', isFunction: false },
    { value: 'rand', display: 'Rand', class: 'sci-button', isFunction: false },
    { value: 'deg', display: degreeMode ? 'DEG' : 'RAD', class: 'mode-button', isFunction: false }
  ];

  // Дефинирање на копчињата за меморија (memoryButtons)
  const memoryButtons = [
    { value: 'MS', display: 'MS', class: 'memory-button' },
    { value: 'MR', display: 'MR', class: 'memory-button' },
    { value: 'MC', display: 'MC', class: 'memory-button' },
    { value: 'M+', display: 'M+', class: 'memory-button' },
    { value: 'M-', display: 'M-', class: 'memory-button' }
  ];

  return (
    <div className={`calculator-container ${theme}`}>
      <div className="calculator">
        <div className="calculator-header">
          <button onClick={toggleTheme} className="theme-toggle">
            {theme === "light" ? "🌙" : "☀️"}
          </button>
          <div className="calc-title">Pro Scientific Calc</div>
          <button onClick={() => setShowHistory(!showHistory)} className="history-toggle">
            {showHistory ? "Hide History" : "History"}
          </button>
        </div>
      
        <div className="display-container">
          <div className="memory-indicator">
            {memory !== null && <span>M</span>}
            <span className="mode-indicator">{degreeMode ? "DEG" : "RAD"}</span>
            {openParenCount > 0 && (
              <span className="paren-indicator">({openParenCount})</span>
            )}
          </div>
          <div className="input-wrapper">
            <input
              ref={inputRef}
              type="text"
              value={input}
              className="calculator-display"
              placeholder="0"
              onChange={handleInputChange}
              onSelect={(e) => setCursorPosition(e.target.selectionStart)}
              onFocus={(e) => {
                setIsFocused(true);
                setCursorPosition(e.target.selectionStart);
              }}
              onBlur={() => setIsFocused(false)}
            />
          </div>
        </div>
      
        {showHistory && (
          <div className="history-panel">
            <div className="history-title">Calculation History</div>
            {history.length === 0 ? (
              <div className="no-history">No calculations yet</div>
            ) : (
              history
                .map((item, index) => (
                  <div
                    key={index}
                    className="history-item"
                    onClick={() => selectHistoryItem(item)}
                  >
                    {item}
                  </div>
                ))
                .reverse()
            )}
          </div>
        )}

        <div className="memory-buttons">
          {memoryButtons.map((btn) => (
            <button
              key={btn.value}
              onClick={() => handleMemory(btn.value)}
              className={`calc-button ${btn.class}`}
              disabled={btn.value === 'MR' && memory === null}
            >
              {btn.display}
            </button>
          ))}
        </div>
        
        <div className="scientific-buttons">
          {scientificButtons.map((btn) => (
            <button
              key={btn.value}
              onClick={() => {
                if (btn.value === 'deg') {
                  toggleDegreeMode();
                } else if (['π', 'e', 'rand', 'x²', 'x³', '10^x', 'x^y', '1/x'].includes(btn.value)) {
                  handleSpecialFunction(btn.value);
                } else if (btn.isFunction) {
                  handleFunctionClick(btn.value);
                } else {
                  handleButtonClick(btn.value);
                }
              }}
              className={`calc-button ${btn.class}`}
            >
              {btn.display}
            </button>
          ))}
        </div>
        
        <div className="main-buttons">
          {mainButtons.map((btn) => {
            if (btn.value === 'C') {
              return (
                <button
                  key={btn.value}
                  onClick={handleClear}
                  className={`calc-button ${btn.class}`}
                >
                  {btn.display}
                </button>
              );
            } else if (btn.value === 'DEL') {
              return (
                <button
                  key={btn.value}
                  onClick={handleDelete}
                  className={`calc-button ${btn.class}`}
                >
                  {btn.display}
                </button>
              );
            } else if (btn.value === '=') {
              return (
                <button
                  key={btn.value}
                  onClick={handleEvaluate}
                  className={`calc-button ${btn.class}`}
                >
                  {btn.display}
                </button>
              );
            } else {
              return (
                <button
                  key={btn.value}
                  onClick={() => handleButtonClick(btn.value)}
                  className={`calc-button ${btn.class}`}
                >
                  {btn.display}
                </button>
              );
            }
          })}
        </div>
      </div>
      
      <style jsx>{`
        :root[data-theme="light"] {
          --bg-color: #f0f0f0;
          --calculator-bg: #ffffff;
          --display-bg: #f8f8f8;
          --text-color: #333333;
          --button-bg: #e0e0e0;
          --button-hover: #d0d0d0;
          --num-button-bg: #f0f0f0;
          --num-button-hover: #e0e0e0;
          --op-button-bg: #e1eaf5;
          --op-button-hover: #d1dae5;
          --equals-button-bg: #4CAF50;
          --equals-button-hover: #45A049;
          --clear-button-bg: #f44336;
          --clear-button-hover: #e53935;
          --delete-button-bg: #ff9800;
          --delete-button-hover: #fb8c00;
          --sci-button-bg: #e0f7fa;
          --sci-button-hover: #b2ebf2;
          --memory-button-bg: #fff8e1;
          --memory-button-hover: #ffecb3;
          --shadow-color: rgba(0, 0, 0, 0.1);
          --cursor-color: #4CAF50;
        }
        
        :root[data-theme="dark"] {
          --bg-color: #121212;
          --calculator-bg: #1e1e1e;
          --display-bg: #2d2d2d;
          --text-color: #f0f0f0;
          --button-bg: #3d3d3d;
          --button-hover: #4d4d4d;
          --num-button-bg: #2d2d2d;
          --num-button-hover: #3d3d3d;
          --op-button-bg: #344861;
          --op-button-hover: #455a7a;
          --equals-button-bg: #388e3c;
          --equals-button-hover: #2e7d32;
          --clear-button-bg: #d32f2f;
          --clear-button-hover: #c62828;
          --delete-button-bg: #ef6c00;
          --delete-button-hover: #e65100;
          --sci-button-bg: #006064;
          --sci-button-hover: #00838f;
          --memory-button-bg: #4e342e;
          --memory-button-hover: #5d4037;
          --shadow-color: rgba(0, 0, 0, 0.3);
          --cursor-color: #4CAF50;
        }
        
        .calculator-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: var(--bg-color);
          padding: 20px;
          transition: background 0.3s ease;
        }
        
        .calculator {
          background: var(--calculator-bg);
          border-radius: 16px;
          box-shadow: 0 10px 30px var(--shadow-color);
          padding: 20px;
          width: 340px;
          color: var(--text-color);
          transition: all 0.3s ease;
        }
        
        .calculator-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }
        
        .calc-title {
          font-weight: bold;
          font-size: 1.2em;
        }
        
        .theme-toggle, .history-toggle {
          background: none;
          border: none;
          color: var(--text-color);
          cursor: pointer;
          font-size: 1em;
          padding: 5px;
        }
        
        .display-container {
          margin-bottom: 20px;
          position: relative;
          width: 100%;
        }
        
        .memory-indicator {
          display: flex;
          justify-content: space-between;
          font-size: 0.8em;
          margin-bottom: 5px;
        }
        
        .paren-indicator {
          background: var(--op-button-bg);
          padding: 2px 5px;
          border-radius: 4px;
        }
        
        .input-wrapper {
          position: relative;
          width: 100%;
        }
        
        .calculator-display {
          width: 100%;
          height: 60px;
          text-align: right;
          font-size: 1.8em;
          padding: 10px;
          border: none;
          border-radius: 8px;
          background-color: var(--display-bg);
          color: var(--text-color);
          margin-bottom: 15px;
          box-sizing: border-box;
        }
        
        .calculator-display:focus {
          outline: 2px solid var(--equals-button-bg);
        }
        
        .memory-buttons,
        .scientific-buttons,
        .main-buttons {
          display: grid;
          gap: 8px;
          margin-bottom: 8px;
        }
        
        .memory-buttons {
          grid-template-columns: repeat(5, 1fr);
        }
        
        .scientific-buttons {
          grid-template-columns: repeat(5, 1fr);
        }
        
        .main-buttons {
          grid-template-columns: repeat(5, 1fr);
        }
        
        .calc-button {
          padding: 12px 5px;
          font-size: 0.9em;
          border: none;
          border-radius: 8px;
          background: var(--button-bg);
          cursor: pointer;
          transition: all 0.2s ease;
          color: var(--text-color);
        }
        
        .calc-button:hover {
          background: var(--button-hover);
          transform: translateY(-2px);
        }
        
        .num-button {
          background: var(--num-button-bg);
        }
        
        .num-button:hover {
          background: var(--num-button-hover);
        }
        
        .op-button {
          background: var(--op-button-bg);
          font-weight: bold;
        }
        
        .op-button:hover {
          background: var(--op-button-hover);
        }
        
        .equals-button {
          background: var(--equals-button-bg);
          color: white;
          font-weight: bold;
        }
        
        .equals-button:hover {
          background: var(--equals-button-hover);
        }
        
        .clear-button {
          background: var(--clear-button-bg);
          color: white;
        }
        
        .clear-button:hover {
          background: var(--clear-button-hover);
        }
        
        .delete-button {
          background: var(--delete-button-bg);
          color: white;
        }
        
        .delete-button:hover {
          background: var(--delete-button-hover);
        }
        
        .sci-button,
        .constant-button {
          background: var(--sci-button-bg);
        }
        
        .sci-button:hover,
        .constant-button:hover {
          background: var(--sci-button-hover);
        }
        
        .memory-button {
          background: var(--memory-button-bg);
          font-size: 0.75em;
        }
        
        .memory-button:hover {
          background: var(--memory-button-hover);
        }
        
        .history-panel {
          background: var(--display-bg);
          border-radius: 8px;
          padding: 10px;
          margin-bottom: 15px;
          max-height: 150px;
          overflow-y: auto;
        }
        
        .history-title {
          font-weight: bold;
          margin-bottom: 8px;
          text-align: center;
        }
        
        .history-item {
          padding: 5px;
          cursor: pointer;
          border-bottom: 1px solid var(--button-bg);
          text-align: right;
        }
        
        .history-item:hover {
          background: var(--button-hover);
        }
        
        .no-history {
          text-align: center;
          font-style: italic;
          opacity: 0.7;
        }
        
        .mode-indicator {
          font-size: 0.9em;
          padding: 2px 5px;
          border-radius: 4px;
          background: var(--sci-button-bg);
        }
      `}</style>
    </div>
  );
};

export default ProfessionalScientificCalculator;
