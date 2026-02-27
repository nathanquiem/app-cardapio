# Variáveis de Ambiente Necessárias (Coolify)

Estas são as variáveis que você precisa copiar lá dentro da aba "Environment Variables" do seu projeto no **Coolify** (VPS) antes de rodar o Deploy.

O aplicativo não funcionará na Nuvem sem esses dois valores idênticos aos do seu `.env.local`!

```env
NEXT_PUBLIC_SUPABASE_URL=https://hwmvywetjjruabfvgabf.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3bXZ5d2V0ampydWFiZnZnYWJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4NTQ3MjQsImV4cCI6MjA3OTQzMDcyNH0.9WIWMCrYtPVPY_3RsaI6NVRSDpVB8qv_lk8qXdeQFys

```

### Configurações Adicionais no Coolify
- **Build Server:** Nixpacks ou Dockerfile (O projeto está preparado para ambas as vias perfeitamente graças ao `Dockerfile` customizado para versão Standalone incluído).
- **Port:** 3000 (A porta que deve ser exposta).
