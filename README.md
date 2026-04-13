# 🔧 Healing Agent Test Page

A comprehensive test page designed for testing AI-powered locator healing in test automation frameworks.

![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live-success)
![HTML](https://img.shields.io/badge/HTML-5-orange)
![CSS](https://img.shields.io/badge/CSS-3-blue)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow)

## 🌐 Live Demo

Visit the live demo: [https://yourusername.github.io/healing-agent-test-page/](https://yourusername.github.io/healing-agent-test-page/)

## 📋 Overview

This project provides a comprehensive test page for validating healing agent functionality in test automation. It includes various UI elements with multiple locator strategies to test different healing scenarios.

## ✨ Features

- **Static Elements** - Buttons with multiple locator strategies (ID, Class, Text)
- **Form Inputs** - Text fields, email, textarea for form testing
- **Dynamic Content** - JavaScript-generated elements for dynamic testing
- **Modal/Overlays** - Popup dialogs for z-index and visibility testing
- **Conditional Elements** - Show/hide functionality for visibility testing
- **Navigation Links** - Anchor tags for link-based navigation

## 🎯 Use Cases

### For QA Engineers
- Test automation healing agent functionality
- Validate locator fallback strategies
- Measure healing success rates
- Document test scenarios

### For Developers
- Debug healing agent algorithms
- Benchmark performance metrics
- Test edge cases
- Validate DOM scoring logic

## 🚀 Quick Start

### Option 1: Use GitHub Pages (Recommended)

1. Fork this repository
2. Go to Settings → Pages
3. Select `main` branch as source
4. Visit `https://yourusername.github.io/healing-agent-test-page/`

### Option 2: Run Locally

```bash
# Clone the repository
git clone https://github.com/yourusername/healing-agent-test-page.git

# Navigate to directory
cd healing-agent-test-page

# Open in browser
open index.html
# or
python3 -m http.server 8000  # Then visit http://localhost:8000
```

## 📁 Project Structure

```
healing-agent-test-page/
├── index.html          # Main test page
├── styles.css          # Styling
├── script.js           # Interactive functionality
├── docs.html           # Documentation page
├── README.md           # This file
├── LICENSE             # MIT License
└── .gitignore          # Git ignore rules
```

## 🧪 Test Scenarios

### Level 1: Static Heuristics
Test basic locator fallback when primary locator fails.

**Example:**
```javascript
// Original
xpath: //button[@id='loginButton']
id: loginButton

// Break ID locator
xpath: //button[@id='brokenLoginButton']
id: loginButton  // ✅ Healing uses this
```

### Level 2: DOM Scoring
Test weighted similarity scoring when all original locators fail.

**Example:**
```javascript
// All locators broken
// Healing uses:
// - Tag name similarity
// - Screen region matching
// - Class token overlap
// - Text content matching
```

### Level 3: AI Recovery
Test AI-powered element finding when confidence is low.

**Example:**
```javascript
// Natural language understanding
stepDef: "click on Login"
// AI finds element by semantic meaning
```

## 🎨 Customization

### Adding New Elements

Edit `index.html`:

```html
<div class="test-card">
    <h3>Your Element</h3>
    <button id="yourElementId" class="your-class">Click Me</button>
    <ul class="element-list">
        <li><strong>ID:</strong> yourElementId</li>
        <li><strong>Class:</strong> your-class</li>
    </ul>
</div>
```

### Modifying Styles

Edit `styles.css` to customize:
- Colors and gradients
- Layout and spacing
- Responsive breakpoints
- Animations

### Adding Functionality

Edit `script.js` to add:
- Event handlers
- Dynamic content generators
- Custom interactions

## 📖 Documentation

Full documentation is available at [docs.html](docs.html) or visit the [live docs](https://yourusername.github.io/healing-agent-test-page/docs.html).

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Testing Checklist

- [ ] All buttons clickable
- [ ] Form inputs accept text
- [ ] Dynamic content generates correctly
- [ ] Modal opens and closes
- [ ] Toggle shows/hides elements
- [ ] Navigation links work
- [ ] Responsive on mobile
- [ ] Cross-browser compatible

## 🐛 Known Issues

None at this time. Please report issues on the [GitHub Issues](https://github.com/yourusername/healing-agent-test-page/issues) page.

## 📊 Browser Support

| Browser | Version | Status |
|---------|---------|--------|
| Chrome  | 90+     | ✅ Supported |
| Firefox | 88+     | ✅ Supported |
| Safari  | 14+     | ✅ Supported |
| Edge    | 90+     | ✅ Supported |

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Automator.AI Team** - Initial work

## 🙏 Acknowledgments

- Inspired by test automation best practices
- Designed for healing agent validation
- Built with modern web standards

## 📞 Support

For support, please:
- Open an issue on GitHub
- Visit our [documentation](docs.html)
- Contact the maintainers

## 🔗 Related Projects

- [Automator Core Engine](https://github.com/yourusername/automator-core-engine)
- [Healing Agent Architecture](https://github.com/yourusername/healing-agent-docs)

## 📈 Roadmap

- [ ] Add more complex form scenarios
- [ ] Include iframe testing
- [ ] Add shadow DOM elements
- [ ] Implement accessibility testing
- [ ] Add performance metrics display

---

**Made with ❤️ by Automator.AI**

[⬆ Back to top](#-healing-agent-test-page)
