module.exports = {
    rules: {
      // Turn off annoying rules during development
      '@typescript-eslint/no-explicit-any': 'off',
      'no-console': 'off',
      'prettier/prettier': 'off', // if using prettier
      
      // Keep only what helps you
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { 
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_' 
      }]
    }
  }