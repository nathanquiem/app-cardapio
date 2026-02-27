# Variáveis de Ambiente Necessárias (Coolify)

Estas são as variáveis que você precisa copiar lá dentro da aba "Environment Variables" do seu projeto no **Coolify** (VPS) antes de rodar o Deploy.

O aplicativo não funcionará na Nuvem sem esses dois valores idênticos aos do seu `.env.local`!

```env
NEXT_PUBLIC_SUPABASE_URL=seu_url_do_supabase_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon_aqui
```

### Configurações Adicionais no Coolify
- **Build Server:** Nixpacks ou Dockerfile (O projeto está preparado para ambas as vias perfeitamente graças ao `Dockerfile` customizado para versão Standalone incluído).
- **Port:** 3000 (A porta que deve ser exposta).
