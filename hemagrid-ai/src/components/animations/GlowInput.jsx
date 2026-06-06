import { motion } from 'framer-motion';
import { useState } from 'react';

const GlowInput = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder = '',
  required = false,
  options = null, // for select
  className = '',
  error = '',
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(!!value);

  const handleChange = (e) => {
    setHasValue(!!e.target.value);
    if (onChange) onChange(e);
  };

  const inputClasses = `
    w-full bg-gray-900 text-white rounded-xl px-4 py-3
    border transition-all duration-300 outline-none
    placeholder-gray-600 text-sm
    ${isFocused
      ? 'border-red-500 shadow-[0_0_0_3px_rgba(239,68,68,0.15)]'
      : error
        ? 'border-red-700/70'
        : 'border-gray-700 hover:border-gray-500'
    }
  `;

  return (
    <div className={`relative ${className}`}>
      {label && (
        <motion.label
          animate={{
            color: isFocused ? '#ef4444' : error ? '#dc2626' : '#9ca3af',
            y: 0,
          }}
          transition={{ duration: 0.2 }}
          className="block text-sm font-medium mb-2"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </motion.label>
      )}

      <div className="relative">
        {options ? (
          <select
            name={name}
            value={value}
            required={required}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={`${inputClasses} appearance-none cursor-pointer`}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-gray-900">
                {opt.label}
              </option>
            ))}
          </select>
        ) : type === 'textarea' ? (
          <textarea
            name={name}
            value={value}
            required={required}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            rows={4}
            className={`${inputClasses} resize-none`}
          />
        ) : (
          <input
            type={type}
            name={name}
            value={value}
            required={required}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            className={inputClasses}
          />
        )}

        {/* Animated glow line at bottom */}
        <motion.div
          className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-red-600 to-red-400 rounded-full"
          animate={{ width: isFocused ? '100%' : '0%' }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-500 text-xs mt-1"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};

export default GlowInput;