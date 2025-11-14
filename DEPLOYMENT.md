# 🚀 Guia de Deployment - TradeJournal Pro

Este guia detalha como fazer o deploy do TradeJournal Pro em produção.

## 📋 Pré-requisitos

- Conta no [Vercel](https://vercel.com) (gratuita)
- Conta no [Supabase](https://supabase.com) (gratuita)
- Repositório Git (GitHub, GitLab ou Bitbucket)

## 🔧 Preparação

### 1. Configure o Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Crie um novo projeto
3. Aguarde o provisionamento (2-3 minutos)
4. Execute a migration SQL:
   - Vá em **SQL Editor**
   - Copie o conteúdo de `supabase/migrations/001_initial_schema.sql`
   - Cole e execute

### 2. Configure o Repositório

Certifique-se de que seu código está em um repositório Git:

```bash
git init
git add .
git commit -m "Initial commit: TradeJournal Pro"
git branch -M main
git remote add origin https://github.com/seu-usuario/ninja_journal.git
git push -u origin main
```

## 🌐 Deploy na Vercel

### Método 1: Via Dashboard (Recomendado)

1. Acesse [vercel.com](https://vercel.com)
2. Clique em **Add New** → **Project**
3. Import seu repositório
4. Configure as variáveis de ambiente (veja abaixo)
5. Clique em **Deploy**

### Método 2: Via CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### Variáveis de Ambiente na Vercel

Configure em: **Settings** → **Environment Variables**

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key
API_SECRET_KEY=sua-chave-secreta-forte
NEXT_PUBLIC_SITE_URL=https://seu-dominio.vercel.app
```

**⚠️ IMPORTANTE**: Adicione as variáveis em **Production**, **Preview** e
**Development**

## 🔒 Configurações de Segurança

### 1. Configure o Supabase Auth

No dashboard do Supabase:

1. Vá em **Authentication** → **URL Configuration**
2. Adicione sua URL da Vercel em **Site URL**:
   ```
   https://seu-dominio.vercel.app
   ```
3. Adicione em **Redirect URLs**:
   ```
   https://seu-dominio.vercel.app/auth/callback
   https://seu-dominio.vercel.app/dashboard
   ```

### 2. Configure Email Templates (Opcional)

Em **Authentication** → **Email Templates**, customize:

- Confirm signup
- Reset password
- Magic Link

## 🌍 Domínio Customizado

### Na Vercel

1. Vá em **Settings** → **Domains**
2. Adicione seu domínio customizado
3. Configure os DNS records conforme instruído

### Exemplo com Cloudflare

```
Type: CNAME
Name: @
Target: cname.vercel-dns.com
```

## 📊 Monitoramento

### Analytics da Vercel

A Vercel oferece analytics gratuitos:

- Pageviews
- Performance metrics
- Erro tracking

Ative em: **Settings** → **Analytics**

### Supabase Dashboard

Monitore no Supabase:

- Database usage
- API requests
- Auth users
- Storage usage

## 🔄 CI/CD Automático

Com a Vercel, cada push automaticamente:

- ✅ Cria um preview deployment
- ✅ Roda testes (se configurados)
- ✅ Deploy em produção (main branch)

### GitHub Actions (Opcional)

Crie `.github/workflows/ci.yml`:

```yaml
name: CI

on: [push, pull_request]

jobs:
    build:
        runs-on: ubuntu-latest
        steps:
            - uses: actions/checkout@v3
            - uses: actions/setup-node@v3
              with:
                  node-version: "18"
            - run: npm ci
            - run: npm run build
            - run: npm run lint
```

## 🚨 Troubleshooting

### Erro: "Database connection failed"

**Solução**: Verifique as variáveis de ambiente no Vercel

### Erro: "Auth redirect mismatch"

**Solução**: Configure as Redirect URLs no Supabase

### Erro: "API route not found"

**Solução**: Faça rebuild do projeto na Vercel

### Build falha

```bash
# Teste localmente primeiro
npm run build

# Se funcionar, o problema pode ser nas env vars da Vercel
```

## 📈 Otimizações de Performance

### 1. Edge Functions (Vercel)

O middleware já está configurado para Edge Runtime.

### 2. Image Optimization

Next.js otimiza imagens automaticamente. Use sempre:

```tsx
import Image from "next/image";

<Image src="/logo.png" width={100} height={100} alt="Logo" />;
```

### 3. Caching

Configure headers em `next.config.js`:

```js
async headers() {
  return [
    {
      source: '/api/:path*',
      headers: [
        { key: 'Cache-Control', value: 'no-store' },
      ],
    },
  ]
}
```

## 💰 Custos Estimados

### Vercel (Free Tier)

- ✅ 100GB bandwidth
- ✅ Deployments ilimitados
- ✅ Previews automáticos
- ✅ SSL gratuito

### Supabase (Free Tier)

- ✅ 500MB database
- ✅ 1GB file storage
- ✅ 50,000 monthly active users
- ✅ 2GB bandwidth

**Total: $0/mês** (até os limites gratuitos)

### Upgrade recomendado quando crescer:

- **Vercel Pro**: $20/mês
- **Supabase Pro**: $25/mês

## 🔐 Backup e Recovery

### Backup do Supabase

1. **Automático**: Supabase faz daily backups (Pro plan)
2. **Manual**:
   ```bash
   # Export via CLI
   supabase db dump -f backup.sql
   ```

### Backup do Código

- Git já é seu backup
- Use tags para releases importantes:
  ```bash
  git tag -a v1.0.0 -m "Release 1.0.0"
  git push origin v1.0.0
  ```

## 📱 Testando em Produção

Após o deploy:

1. ✅ Teste o login/signup
2. ✅ Adicione um trade via API
3. ✅ Verifique os gráficos
4. ✅ Teste em mobile
5. ✅ Teste em diferentes browsers

### Checklist de Produção

- [ ] HTTPS funcionando
- [ ] Login/Signup funcionando
- [ ] Todos os gráficos carregando
- [ ] API endpoint respondendo
- [ ] Email de confirmação chegando
- [ ] Responsivo em mobile
- [ ] Performance > 90 no Lighthouse
- [ ] Sem erros no console

## 🎉 Sucesso!

Seu TradeJournal Pro está no ar! 🚀

**Próximos passos:**

1. Compartilhe com outros traders
2. Colete feedback
3. Itere e melhore
4. Monitore usage e performance

---

**Precisa de ajuda?** Abra uma issue no GitHub ou consulte:

- [Vercel Docs](https://vercel.com/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
