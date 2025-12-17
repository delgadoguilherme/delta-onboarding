# Delta Onboarding - Especificações para iOS

## 🔗 Protótipo Interativo
**https://delgadoguilherme.github.io/delta-onboarding/**

---

## 🎨 Design Tokens

### Cores
```swift
// Cores principais
let bgColor = Color(hex: "#F2F2F7")           // Fundo (iOS system gray 6)
let textPrimary = Color(hex: "#1A1A1A")       // Texto principal
let textSecondary = Color(hex: "#8E8E93")     // Texto secundário (iOS system gray)
let textTertiary = Color(hex: "#C7C7CC")      // Texto terciário / disabled

// Accent
let accentGreen = Color(hex: "#A8E025")       // Verde principal
let accentGreenLight = Color(hex: "#B8F25C")  // Verde claro (gradiente)

// Botões
let buttonDark = Color(hex: "#1C1C1E")        // Botão escuro (iOS system gray 6 dark)
```

### Tipografia
```swift
// Títulos das perguntas
.font(.system(size: 32, weight: .bold))
.tracking(-0.5)  // letter-spacing

// Subtítulos
.font(.system(size: 17, weight: .regular))
.foregroundColor(textSecondary)

// Picker - valor selecionado
.font(.system(size: 24, weight: .bold))

// Picker - unidade (hours, min, sec)
.font(.system(size: 16, weight: .medium))

// Botões
.font(.system(size: 17, weight: .semibold))

// Tela Confirm - tempo total
.font(.system(size: 80, weight: .bold))
.tracking(-2)
.monospacedDigit()
```

### Espaçamentos
```swift
// Padding horizontal geral
let horizontalPadding: CGFloat = 24

// Progress bar
let progressBarTopPadding: CGFloat = 70  // do topo da safe area
let progressSegmentHeight: CGFloat = 4
let progressSegmentGap: CGFloat = 8
let progressSegmentCornerRadius: CGFloat = 2

// Entre título e subtítulo
let titleSubtitleSpacing: CGFloat = 12

// Entre question section e picker
let questionToPickerSpacing: CGFloat = 40

// Botão
let buttonHeight: CGFloat = 56  // padding 18 top/bottom
let buttonCornerRadius: CGFloat = 16

// Home indicator area
let bottomSafeArea: CGFloat = 40
```

---

## 📱 Estrutura das Telas

### Tela 0: Welcome
- Logo centralizado com animação de "rings" pulsando
- Título: "Welcome to Delta"
- Subtítulo: "High-intensity interval training made simple"
- Botão: "Get started" (escuro)
- **Sem** progress bar

### Telas 1-3: Perguntas (com Picker)
- Progress bar fixa no topo (4 segmentos)
- Título da pergunta
- Subtítulo explicativo
- Picker iOS nativo (horas, minutos, segundos)
- Botão: "Continue" (escuro)

| Tela | Título | Subtítulo |
|------|--------|-----------|
| 1 | How many rounds your exercise has? | Each round includes exercise + rest |
| 2 | How long is each round? | This is how long you'll work out before resting |
| 3 | How long should the break be? | Time to recover between each round |

### Tela 4: Confirm
- Progress bar (4/4 ativo)
- Título: "Confirm your settings"
- Subtítulo: "You can adjust these anytime"
- Tempo total grande (ex: "1:00")
- Lista de settings com ícones
- Botão: "Confirm" (verde gradiente)

---

## ✨ Animações

### Progress Bar (Indicador deslizante)
```swift
// O indicador preto desliza para a próxima posição
withAnimation(.easeInOut(duration: 0.4)) {
    currentStep += 1
}
// Curva: cubic-bezier(0.4, 0, 0.2, 1) ≈ .easeInOut
```

### Transição entre telas de Onboarding
```swift
// Conteúdo atual SAI para a ESQUERDA
// Novo conteúdo ENTRA pela DIREITA

// Exit animation
.transition(.asymmetric(
    insertion: .move(edge: .trailing).combined(with: .opacity),
    removal: .move(edge: .leading).combined(with: .opacity)
))

// Duração: 0.3s saída, 0.4s entrada
```

### Entrada dos elementos (telas 1-4)
```swift
// Ordem de aparição com stagger:
// 1. Título + Subtítulo (delay: 0.1s) - vem da DIREITA
// 2. Botão (delay: 0.2s) - vem da DIREITA  
// 3. Picker (delay: 0.5s) - vem de BAIXO

// Animação padrão vindo da direita
.offset(x: isVisible ? 0 : 40)
.opacity(isVisible ? 1 : 0)
.animation(.easeOut(duration: 0.5).delay(0.1), value: isVisible)

// Picker vindo de baixo
.offset(y: isVisible ? 0 : 30)
.opacity(isVisible ? 1 : 0)
.animation(.easeOut(duration: 0.5).delay(0.5), value: isVisible)
```

### Tela Welcome - Animações especiais
```swift
// Logo: scale com bounce
.scaleEffect(isVisible ? 1 : 0.5)
.opacity(isVisible ? 1 : 0)
.animation(.spring(response: 0.6, dampingFraction: 0.7).delay(0.1), value: isVisible)

// Rings pulsando (4 rings, delays escalonados)
// Ring 1: delay 0.2s
// Ring 2: delay 0.35s
// Ring 3: delay 0.5s
// Ring 4: delay 0.65s
.scaleEffect(isVisible ? 1 : 0.8)
.opacity(isVisible ? 0.3 : 0)

// Texto: slide up
.offset(y: isVisible ? 0 : 20)
.animation(.easeOut(duration: 0.6).delay(0.4), value: isVisible)

// Botão: slide up
.offset(y: isVisible ? 0 : 20)
.animation(.easeOut(duration: 0.5).delay(0.5), value: isVisible)
```

### Tela Confirm - Settings items
```swift
// Cada item entra da direita com stagger
// Item 1: delay 0.2s
// Item 2: delay 0.28s
// Item 3: delay 0.36s

.offset(x: isVisible ? 0 : 40)
.opacity(isVisible ? 1 : 0)
```

---

## 🧩 Componentes SwiftUI Sugeridos

### Progress Bar
```swift
struct OnboardingProgressBar: View {
    let totalSteps = 4
    @Binding var currentStep: Int
    
    var body: some View {
        HStack(spacing: 8) {
            ForEach(0..<totalSteps, id: \.self) { index in
                RoundedRectangle(cornerRadius: 2)
                    .fill(Color(hex: "#C7C7CC"))
                    .frame(height: 4)
                    .overlay(
                        RoundedRectangle(cornerRadius: 2)
                            .fill(Color(hex: "#1A1A1A"))
                            .opacity(index == currentStep ? 1 : 0)
                    )
            }
        }
        .animation(.easeInOut(duration: 0.4), value: currentStep)
    }
}
```

### Botão Primary
```swift
struct PrimaryButton: View {
    let title: String
    let style: ButtonStyle // .dark ou .green
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            Text(title)
                .font(.system(size: 17, weight: .semibold))
                .foregroundColor(style == .dark ? .white : Color(hex: "#1A1A1A"))
                .frame(maxWidth: .infinity)
                .frame(height: 56)
                .background(
                    style == .dark 
                        ? AnyView(Color(hex: "#1C1C1E"))
                        : AnyView(LinearGradient(
                            colors: [Color(hex: "#B8F25C"), Color(hex: "#A8E025")],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                          ))
                )
                .cornerRadius(16)
        }
        .buttonStyle(ScaleButtonStyle()) // Press feedback
    }
}

struct ScaleButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .scaleEffect(configuration.isPressed ? 0.98 : 1)
            .animation(.easeInOut(duration: 0.2), value: configuration.isPressed)
    }
}
```

---

## 📂 Arquivos do Protótipo

- `index.html` - Estrutura das telas
- `styles.css` - Todos os estilos e animações CSS
- `script.js` - Lógica de navegação e transições

---

## 💡 Notas de Implementação

1. **Picker**: Usar `Picker` nativo do iOS com `.pickerStyle(.wheel)`

2. **Progress Bar**: A barra fica FIXA no topo durante todas as telas de onboarding (1-4). Apenas o indicador preto anima para a nova posição.

3. **Transições**: O conteúdo sai para esquerda e entra pela direita. A progress bar não participa dessa animação.

4. **Safe Areas**: Respeitar safe areas do iPhone (notch, home indicator)

5. **Haptics**: Considerar adicionar feedback háptico nos botões e transições

---

## 🎬 Vídeo de Referência

Grave um vídeo do protótipo web para referência visual das animações:
1. Abra https://delgadoguilherme.github.io/delta-onboarding/
2. Use QuickTime Player > File > New Screen Recording
3. Grave o fluxo completo

---

Qualquer dúvida, consulte o protótipo interativo ou os arquivos fonte.

