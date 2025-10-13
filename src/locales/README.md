# Multi-Language Support Documentation

## Overview

This application now supports multiple languages through a centralized translation system. All static text, labels, and messages are stored in JSON files and can be easily accessed throughout the application.

## File Structure

```
src/
├── locales/
│   ├── en.json          # English translations
│   ├── ar.json          # Arabic translations (to be added)
│   └── README.md        # This file
├── contexts/
│   └── LanguageContext.js  # Language provider and hook
```

## How to Use Translations

### 1. In React Components

Import the `useLanguage` hook and use the `translate()` function:

```javascript
import { useLanguage } from '../contexts/LanguageContext';

const MyComponent = () => {
  const { translate } = useLanguage();
  
  return (
    <div>
      <h1>{translate('myProfile.PAGE_TITLE')}</h1>
      <button>{translate('common.SAVE')}</button>
    </div>
  );
};
```

### 2. Translation Keys

Translation keys use dot notation to organize them hierarchically:

- `common.*` - Common strings used across the app (buttons, actions, etc.)
- `myProfile.*` - My Profile page specific strings
- `sell.*` - Sell Your Car page specific strings
- `validation.*` - Form validation messages
- `messages.*` - Generic messages and notifications

### 3. With Variables

You can use variables in translations using `{{variableName}}` syntax:

**In en.json:**
```json
{
  "validation": {
    "MIN_LENGTH": "Minimum length is {{min}} characters"
  }
}
```

**In your component:**
```javascript
const errorMessage = translate('validation.MIN_LENGTH', { min: 5 });
// Result: "Minimum length is 5 characters"
```

### 4. Changing Language

To change the current language:

```javascript
const { changeLanguage, currentLanguage } = useLanguage();

// Change to Arabic
changeLanguage('ar');

// Get current language
console.log(currentLanguage); // 'en'
```

## Adding a New Language

1. **Create a new language file:**
   - Copy `en.json` to a new file (e.g., `ar.json` for Arabic)
   - Translate all values (keep keys the same)

2. **Register the language:**
   - Open `src/contexts/LanguageContext.js`
   - Add the language to the `LANGUAGES` object:
     ```javascript
     const LANGUAGES = {
       EN: 'en',
       AR: 'ar', // Add this
     };
     ```
   - Import and register the language file:
     ```javascript
     import arTranslations from '../locales/ar.json';
     
     const languageFiles = {
       en: enTranslations,
       ar: arTranslations, // Add this
     };
     ```

3. **Add language selector (optional):**
   ```javascript
   const LanguageSelector = () => {
     const { changeLanguage, currentLanguage } = useLanguage();
     
     return (
       <select 
         value={currentLanguage} 
         onChange={(e) => changeLanguage(e.target.value)}
       >
         <option value="en">English</option>
         <option value="ar">العربية</option>
       </select>
     );
   };
   ```

## Translation File Structure

### Example en.json structure:

```json
{
  "common": {
    "LOGIN": "Login",
    "SIGN_UP": "Sign Up",
    "SAVE": "Save",
    "CANCEL": "Cancel"
  },
  "myProfile": {
    "PAGE_TITLE": "My Profile",
    "FIRST_NAME": "First Name",
    "FIRST_NAME_REQUIRED": "First name is required"
  },
  "validation": {
    "REQUIRED_FIELD": "This field is required",
    "INVALID_EMAIL": "Invalid email address"
  }
}
```

## Best Practices

1. **Naming Convention:**
   - Use UPPER_SNAKE_CASE for translation keys
   - Group related translations under common prefixes
   - Keep keys descriptive and meaningful

2. **Key Organization:**
   - Place common strings in the `common` section
   - Create new sections for each major page/feature
   - Keep validation messages in the `validation` section

3. **Adding New Translations:**
   - Always add keys to ALL language files
   - If translation is not ready, use English as placeholder
   - Keep the structure consistent across all language files

4. **Never Hardcode Text:**
   ```javascript
   // ❌ BAD
   <button>Save Changes</button>
   
   // ✅ GOOD
   <button>{translate('myProfile.SAVE_CHANGES')}</button>
   ```

5. **Form Validation Messages:**
   - Use translation keys in validation rules
   - Keep error messages user-friendly
   ```javascript
   rules={[
     { 
       required: true, 
       message: translate('myProfile.FIRST_NAME_REQUIRED') 
     }
   ]}
   ```

## Components Already Using Translations

- ✅ `MyProfileForm.js` - Fully translated
- 🔄 `sell.js` - To be translated
- 🔄 Other components - To be translated

## Adding Translations to a New Component

1. Import the hook:
   ```javascript
   import { useLanguage } from '../contexts/LanguageContext';
   ```

2. Use the hook in your component:
   ```javascript
   const { translate } = useLanguage();
   ```

3. Add translation keys to `en.json`:
   ```json
   {
     "myComponent": {
       "TITLE": "My Component Title",
       "DESCRIPTION": "Component description"
     }
   }
   ```

4. Use translations in JSX:
   ```javascript
   <h1>{translate('myComponent.TITLE')}</h1>
   <p>{translate('myComponent.DESCRIPTION')}</p>
   ```

## Troubleshooting

**Problem:** Translation key shows instead of text
- **Solution:** Make sure the key exists in the language file
- The system returns the key itself if translation is not found

**Problem:** Language not changing
- **Solution:** Check that the language file is properly registered in `LanguageContext.js`
- Clear browser cache and localStorage

**Problem:** Variables not working in translations
- **Solution:** Make sure you're passing the replacements object as the second parameter to `translate()`
  ```javascript
  translate('validation.MIN_LENGTH', { min: 5 })
  ```

## Future Enhancements

- [ ] Add Arabic (RTL) support
- [ ] Add French translations
- [ ] Create admin panel for managing translations
- [ ] Add translation loading from API
- [ ] Add missing translation detection in development mode

## Support

For questions or issues related to translations, contact the development team.

