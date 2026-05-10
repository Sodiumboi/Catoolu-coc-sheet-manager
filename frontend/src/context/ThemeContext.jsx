import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(
    () => localStorage.getItem('coc_theme') || 'dark'
  );
  const [skillSize, setSkillSizeState] = useState(
    () => localStorage.getItem('coc_skill_size') || 'sm'
  );

  // Applies data-theme="dark" or data-theme="parchment" to <html>
  // This is what activates the CSS variable block in index.css
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('coc_theme', theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme(t => (t === 'dark' ? 'parchment' : 'dark'));

  const setSkillSize = (size) => {
    setSkillSizeState(size);
    localStorage.setItem('coc_skill_size', size);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, skillSize, setSkillSize }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
}