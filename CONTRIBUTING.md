# Contribuindo para TradeJournal Pro

Obrigado por considerar contribuir para o TradeJournal Pro! 🎉

## Como Contribuir

### Reportando Bugs

Se você encontrou um bug, por favor abra uma issue incluindo:

- Descrição clara do problema
- Passos para reproduzir
- Comportamento esperado vs comportamento atual
- Screenshots (se aplicável)
- Informações do ambiente (OS, Browser, Node version)

### Sugerindo Features

Adoramos ouvir novas ideias! Para sugerir uma feature:

1. Verifique se já não existe uma issue similar
2. Abra uma nova issue com o label "enhancement"
3. Descreva claramente:
   - O problema que a feature resolve
   - Como ela deveria funcionar
   - Exemplos de uso

### Pull Requests

1. **Fork** o repositório
2. **Clone** seu fork
3. **Crie uma branch** para sua feature:
   ```bash
   git checkout -b feature/MinhaFeature
   ```
4. **Faça suas alterações**
5. **Teste** suas alterações localmente
6. **Commit** com mensagens claras:
   ```bash
   git commit -m "Add: Nova feature X"
   ```
7. **Push** para seu fork:
   ```bash
   git push origin feature/MinhaFeature
   ```
8. Abra um **Pull Request**

### Padrões de Código

- Use TypeScript para todo código novo
- Siga as convenções do ESLint
- Use Prettier para formatação
- Componentes React devem usar functional components + hooks
- Nomeie componentes em PascalCase
- Nomeie funções e variáveis em camelCase

### Estrutura de Commits

Use conventional commits:

- `feat:` nova feature
- `fix:` correção de bug
- `docs:` mudanças na documentação
- `style:` formatação, ponto e vírgula, etc
- `refactor:` refatoração de código
- `test:` adição de testes
- `chore:` mudanças em build, configs, etc

Exemplos:
```
feat: add dark mode toggle
fix: correct calculation of Sharpe Ratio
docs: update README with deploy instructions
```

### Testando Localmente

```bash
# Instalar dependências
npm install

# Configurar .env.local
cp .env.example .env.local
# Edite .env.local com suas credenciais

# Executar em desenvolvimento
npm run dev

# Build de produção
npm run build
npm start
```

### Checklist antes de enviar PR

- [ ] Código compila sem erros
- [ ] Sem erros do TypeScript
- [ ] Sem warnings do ESLint
- [ ] Testado localmente
- [ ] Documentação atualizada (se necessário)
- [ ] Commit messages seguem conventional commits

## Áreas que Precisam de Ajuda

- 📱 Mobile responsiveness
- 🎨 Melhorias de UI/UX
- 📊 Novos tipos de gráficos
- 🧪 Testes unitários
- 📝 Documentação
- 🌐 Internacionalização (i18n)
- ♿ Acessibilidade (a11y)

## Código de Conduta

- Seja respeitoso e inclusivo
- Aceite críticas construtivas
- Foque no que é melhor para a comunidade
- Mostre empatia com outros membros

## Dúvidas?

Se tiver dúvidas sobre como contribuir, sinta-se livre para:

- Abrir uma issue com o label "question"
- Enviar um email para: [seu-email]
- Entrar em contato via [Discord/Slack]

Obrigado por ajudar a tornar o TradeJournal Pro melhor! 🚀

