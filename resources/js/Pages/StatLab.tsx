import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Classmate } from './Classmates';

// Load classmates data from localStorage
const loadClassmatesData = (): Classmate[] => {
  try {
    const saved = localStorage.getItem('classmates');
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    console.error('Failed to load classmates:', e);
    return [];
  }
};

const DRINKS = [
  { name: 'Coffee', emoji: '☕', color: '#8B4513' },
  { name: 'Tea', emoji: '🍵', color: '#3A7D44' },
  { name: 'Soda', emoji: '🥤', color: '#FF6B6B' },
  { name: 'Juice', emoji: '🧃', color: '#FFA500' },
  { name: 'Water', emoji: '💧', color: '#4A90E2' },
  { name: 'EnergyDrink', emoji: '⚡', color: '#FFD700' },
  { name: 'Milk', emoji: '🥛', color: '#F5DEB3' },
  { name: 'Smoothie', emoji: '🍹', color: '#FF69B4' },
];

const ZODIAC_SIGNS = [
  { sign: '♈', name: 'Aries', color: '#FF6B6B' },
  { sign: '♉', name: 'Taurus', color: '#FF8C42' },
  { sign: '♊', name: 'Gemini', color: '#FFD93D' },
  { sign: '♋', name: 'Cancer', color: '#6BCB77' },
  { sign: '♌', name: 'Leo', color: '#FFE66D' },
  { sign: '♍', name: 'Virgo', color: '#4D96FF' },
  { sign: '♎', name: 'Libra', color: '#FF6B9D' },
  { sign: '♏', name: 'Scorpio', color: '#C780FA' },
  { sign: '♐', name: 'Sagittarius', color: '#FF9F7F' },
  { sign: '♑', name: 'Capricorn', color: '#6BCB77' },
  { sign: '♒', name: 'Aquarius', color: '#4D96FF' },
  { sign: '♓', name: 'Pisces', color: '#FF6BCB' },
];

const MBTI_GROUPS = [
  { group: 'Analysts', types: ['INTJ', 'INTP', 'ENTJ', 'ENTP'], color: '#FF6B9D' },
  { group: 'Diplomats', types: ['INFJ', 'INFP', 'ENFJ', 'ENFP'], color: '#4ECDC4' },
  { group: 'Sentinels', types: ['ISTJ', 'ISFJ', 'ESTJ', 'ESFJ'], color: '#95E1D3' },
  { group: 'Explorers', types: ['ISTP', 'ISFP', 'ESTP', 'ESFP'], color: '#F38181' },
];

// Calculate statistics
const calculateStats = (classmates: Classmate[]) => {
  // Drink stats
  const drinkStats = DRINKS.map(drink => ({
    ...drink,
    count: classmates.filter(c => c.favoriteDrink === drink.name).length,
    percentage: (classmates.filter(c => c.favoriteDrink === drink.name).length / classmates.length) * 100,
  }));

  // MBTI stats
  const mbtiStats = MBTI_GROUPS.map(group => ({
    ...group,
    count: classmates.filter(c => group.types.includes(c.mbti)).length,
    percentage: (classmates.filter(c => group.types.includes(c.mbti)).length / classmates.length) * 100,
  }));

  // Zodiac stats
  const zodiacStats = ZODIAC_SIGNS.map(zodiac => ({
    ...zodiac,
    count: classmates.filter(c => c.zodiac === zodiac.name).length,
  }));

  // Birthday stats (by month)
  const birthmonthStats = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return {
      month: monthNames[i],
      count: classmates.filter(c => new Date(c.birthday).getMonth() === i).length,
    };
  });

  return { drinkStats, mbtiStats, zodiacStats, birthmonthStats };
};

export default function StatLab() {
  const navigate = useNavigate();
  
  // Load classmates data from localStorage
  const [classmates, setClassmates] = useState<Classmate[]>(() => loadClassmatesData());

  // Recalculate stats whenever classmates data changes
  const stats = useMemo(() => calculateStats(classmates), [classmates]);
  const maxBirthCount = Math.max(...stats.birthmonthStats.map(b => b.count), 1);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  return (
    <div className="stat-lab-page">
      {/* Scanlines effect overlay */}
      <div className="scanlines" />

      {/* Empty State - No Classmates */}
      {classmates.length === 0 && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          color: '#fff',
          fontFamily: "'Press Start 2P', monospace",
          textAlign: 'center',
          gap: '1rem'
        }}>
          <div style={{ fontSize: '3rem' }}>🎮</div>
          <h1 style={{ fontSize: '1rem', color: '#ff6b9d' }}>NO DATA TO ANALYZE</h1>
          <p style={{ fontFamily: "'VT323', monospace", fontSize: '1rem', color: '#8888aa' }}>
            Add classmates first in the Classmates page!
          </p>
          <button 
            onClick={() => navigate('/classmates')}
            style={{
              marginTop: '1rem',
              padding: '0.8rem 1.5rem',
              fontSize: '0.8rem',
              background: 'linear-gradient(180deg, #ff6b9d, #ff4d7d)',
              border: '3px solid #ff8899',
              color: '#fff',
              cursor: 'pointer',
              borderRadius: '8px',
              fontFamily: "'Press Start 2P', monospace",
            }}
          >
            ← GO TO CLASSMATES
          </button>
        </div>
      )}

      {/* Main Content - Only show if classmates exist */}
      {classmates.length > 0 && (
      <>
      {/* Header */}
      <motion.header 
        className="stat-header"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="header-content">
          <button 
            className="back-arcade-btn"
            onClick={() => navigate('/dashboard')}
          >
            ← BACK
          </button>
          
          <div className="header-text">
            <h1 className="stat-title">LEVEL 02: STAT LAB</h1>
            <p className="stat-subtitle">Analyzing Classmate Data...</p>
          </div>
          
          <div className="header-stats-badges">
            <span className="badge">
              <span className="badge-label">TOTAL</span>
              <span className="badge-value">{classmates.length}</span>
            </span>
          </div>
        </div>

        {/* Loading Bar */}
        <div className="loading-bar-container">
          <motion.div 
            className="loading-bar-fill"
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 2, ease: 'easeInOut' }}
          />
        </div>
      </motion.header>

      {/* Widgets Grid */}
      <motion.div 
        className="widgets-grid"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Widget 1: Vending Machine (Drinks) */}
        <motion.div 
          className="widget vending-machine"
          variants={cardVariants}
        >
          <div className="widget-header">
            <h2>🥤 DRINK VENDING</h2>
            <span className="widget-label">STOCK LEVELS</span>
          </div>

          <div className="vending-glass">
            <div className="drinks-shelf">
              {stats.drinkStats.map((drink, idx) => (
                <motion.div
                  key={idx}
                  className="drink-item"
                  whileHover={{ y: -8 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <span className="drink-emoji">{drink.emoji}</span>
                  <p className="drink-name">{drink.name}</p>
                  
                  {/* Stock Level Bar */}
                  <div className="stock-bar">
                    <motion.div
                      className="stock-fill"
                      initial={{ width: 0 }}
                      animate={{ width: `${drink.percentage}%` }}
                      transition={{ duration: 1, delay: 0.3 + idx * 0.1 }}
                      style={{ backgroundColor: drink.color }}
                    />
                  </div>
                  
                  <span className="stock-count">{drink.count}/{classmates.length}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Widget 2: Character Classes (MBTI) */}
        <motion.div 
          className="widget mbti-classes"
          variants={cardVariants}
        >
          <div className="widget-header">
            <h2>⚔️ CHARACTER CLASSES</h2>
            <span className="widget-label">RPG ARCHETYPES</span>
          </div>

          <div className="classes-container">
            {stats.mbtiStats.map((mbti, idx) => (
              <motion.div
                key={idx}
                className="class-row"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + idx * 0.1 }}
              >
                <div className="class-label" style={{ color: mbti.color }}>
                  {mbti.group}
                </div>

                {/* Health Bar */}
                <div className="health-bar">
                  <motion.div
                    className="health-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${mbti.percentage}%` }}
                    transition={{ duration: 0.8, delay: 0.5 + idx * 0.1 }}
                    style={{
                      backgroundColor: mbti.color,
                      boxShadow: `0 0 10px ${mbti.color}, inset 0 0 5px ${mbti.color}`,
                    }}
                  />
                </div>

                <div className="class-count">{mbti.count}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Widget 3: Cosmic Alignment (Zodiac) */}
        <motion.div 
          className="widget cosmic-alignment"
          variants={cardVariants}
        >
          <div className="widget-header">
            <h2>✨ COSMIC ALIGNMENT</h2>
            <span className="widget-label">STAR MAP</span>
          </div>

          <div className="zodiac-grid">
            {stats.zodiacStats.map((zodiac, idx) => (
              <motion.div
                key={idx}
                className="zodiac-item"
                whileHover={{ scale: 1.15 }}
                animate={{
                  boxShadow: zodiac.count > 0 
                    ? `0 0 ${8 + zodiac.count * 3}px ${zodiac.color}`
                    : 'none',
                }}
                style={{ borderColor: zodiac.color }}
              >
                <span className="zodiac-sign">{zodiac.sign}</span>
                <span className="zodiac-count">{zodiac.count}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Widget 4: Spawn Dates (Birthdays) */}
        <motion.div 
          className="widget spawn-dates"
          variants={cardVariants}
        >
          <div className="widget-header">
            <h2>🎂 SPAWN DATES</h2>
            <span className="widget-label">BIRTHDAY CHART</span>
          </div>

          <div className="birthmonth-chart">
            <div className="chart-bars">
              {stats.birthmonthStats.map((month, idx) => (
                <motion.div
                  key={idx}
                  className="month-column"
                  initial={{ height: 0 }}
                  animate={{ height: `${(month.count / maxBirthCount) * 100}%` }}
                  transition={{ duration: 0.6, delay: 0.3 + idx * 0.05 }}
                >
                  <div className="bar-fill" />
                  {month.count > 0 && <span className="bar-label">{month.count}</span>}
                </motion.div>
              ))}
            </div>

            <div className="chart-labels">
              {stats.birthmonthStats.map((month, idx) => (
                <span key={idx} className="month-label">{month.month}</span>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Footer Stats */}
      <motion.footer
        className="stat-footer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <div className="footer-stat">
          <span className="stat-label">ANALYSIS COMPLETE</span>
          <span className="stat-value">100%</span>
        </div>
        <div className="footer-stat">
          <span className="stat-label">CLASSMATES INDEXED</span>
          <span className="stat-value">{classmates.length}/{classmates.length}</span>
        </div>
      </motion.footer>
      </>
      )}
    </div>
  );
}
