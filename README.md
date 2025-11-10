# Reengenharia Angular para React Assistida por IA

Um projeto abrangente de pesquisa acadêmica que investiga a eficácia de diferentes ferramentas de IA na migração de frontend de Angular para React. Este estudo compara três assistentes de IA líderes (ChatGPT, Claude AI e Google Gemini) em sua capacidade de realizar conversões de código precisas e sustentáveis, preservando a funcionalidade e melhorando as métricas de qualidade do código.

## 🎓 Contexto da Pesquisa

- **Instituição**: UFRB (Universidade Federal do Recôncavo da Bahia)
- **Curso**: BCET (Bacharelado em Ciências e Engenharia de Tecnologia)
- **Tipo**: Trabalho de Conclusão de Curso (TCC)
- **Foco**: Engenharia de Software, Reengenharia de Frameworks de Front-End Assistida por IA
- **Subtítulo**: Uma Análise Quantitativa e Qualitativa na Reengenharia de Angular para React com Modelos de Linguagem de Grande Escala.

## 🔬 Metodologia

- **Tamanho da Amostra**: 20 componentes Angular (10 simples + 10 complexos)
- **Ferramentas de IA**: ChatGPT, Claude AI, Google Gemini
- **Métricas**: Complexidade Ciclomática (CC), Índice de Manutenibilidade (MI), Linhas de Código (LOC), Repetição de Código (RC).
- **Análise**: Comparação quantitativa da qualidade do código pré/pós reengenharia

## 📁 Estrutura do Projeto

```
TCC - Narlan (BCET)/
├── Search/                          # Dados de pesquisa e análises
│   ├── Angular/                     # Códigos originais Angular
│   │   ├── Complex/                 # Códigos complexos (Code-1 a Code-10)
│   │   │   ├── Code-1/
│   │   │   │   ├── Component/       # Métricas e arquivos .ts
│   │   │   │   └── Design/          # Métricas e arquivos .html
│   │   │   ├── Code-2/
│   │   │   ├── ...
│   │   │   └── Code-10/
│   │   └── Simple/                  # Códigos simples (Code-1 a Code-10)
│   │       ├── Code-1/
│   │       │   ├── Component/       # Componentes TypeScript
│   │       │   └── Design/          # Templates HTML
│   │       ├── Code-2/
│   │       ├── ...
│   │       └── Code-10/
│   ├── Reengineering/               # Códigos React reengenheirados pelas IAs
│   │   ├── ChatGPT/                 # Códigos React gerados pelo ChatGPT
│   │   │   ├── Complex/             # Códigos complexos convertidos (Code-1 a Code-10)
│   │   │   └── Simple/              # Códigos simples convertidos (Code-1 a Code-10)
│   │   ├── ClaudeAI/                # Códigos React gerados pelo Claude AI
│   │   │   ├── Complex/             # Códigos complexos convertidos (Code-1 a Code-10)
│   │   │   └── Simples/             # Códigos simples convertidos (Code-1 a Code-10)
│   │   ├── GoogleAI/                # Códigos React gerados pelo Google AI
│   │   │   ├── Complex/             # Códigos complexos convertidos (Code-1 a Code-10)
│   │   │   └── Simple/              # Códigos simples convertidos (Code-1 a Code-10)
│   │   └── Dados Gerais/            # Dados consolidados e métricas gerais
│   │       ├── CC/                  # Complexidade Ciclomática
│   │       │   ├── Complex/
│   │       │   └── Simples/
│   │       └── MI/                  # Índice de Manutenibilidade
│   │           ├── Complex/
│   │           └── Simples/
│   └── gráficos/                    # Visualizações e gráficos
│       └── Dados Gerais/            # Gráficos dos dados consolidados
└── Sistema/                         # Sistema/aplicação desenvolvida
```

## 🔍 Descrição das Pastas

### Search/

Contém todos os dados de pesquisa e análises realizadas no TCC.

#### Angular/

Códigos originais Angular organizados por complexidade:

- **Complex/**: Códigos com alta complexidade (10 amostras)
- **Simple/**: Códigos com baixa complexidade (10 amostras)

Cada código Angular possui:

- **Component/**: Arquivos TypeScript (.ts) e métricas
- **Design/**: Arquivos HTML (.html) e métricas

#### Reengineering/

Códigos React resultantes da reengenharia assistida por diferentes IAs:

- **ChatGPT/**: Códigos React gerados pelo ChatGPT
- **ClaudeAI/**: Códigos React gerados pelo Claude AI
- **GoogleAI/**: Códigos React gerados pelo Google AI (Gemini)

Cada IA converteu códigos **Complex** e **Simple** (10 amostras cada) de Angular para React.

#### Dados Gerais/

Consolidação das métricas de qualidade:

- **CC/**: Complexidade Ciclomática
- **MI/**: Índice de Manutenibilidade

#### gráficos/

Visualizações gráficas dos dados analisados.

### Sistema/

Contém o imagem/aplicação do sistema o qual foi utilizado na reegenharia como parte do TCC (PPGCI).
Url: https://ppgcieventos.ufrb.edu.br/

## 📊 Métricas Avaliadas

O projeto analisa diferentes métricas de qualidade de código:

1. **Complexidade Ciclomática (CC)**: Mede a complexidade do fluxo de controle
2. **Índice de Manutenibilidade (MI)**: Avalia a facilidade de manutenção do código
3. **Métricas gerais**: Outras métricas relevantes para análise de qualidade (LOC, RC)

## 🤖 Ferramentas de IA Utilizadas

- **ChatGPT**: OpenAI GPT para reengenharia de código
- **Claude AI**: Anthropic Claude para análise e refatoração
- **Google AI (Gemini)**: Google Gemini para otimização de código

## 📈 Objetivo do Estudo

Este TCC investiga a eficácia de diferentes ferramentas de IA na reengenharia de front-end Angular para React, comparando:

- Qualidade do código antes (Angular) e depois (React) da reengenharia
- Performance das diferentes IAs na conversão Angular→React
- Impacto nas métricas de manutenibilidade e complexidade
- Diferenças na conversão entre códigos simples e complexos
- Fidelidade funcional na migração de frameworks

## 📝 Estrutura dos Dados

Cada amostra de código (Code-1 a Code-10) contém:

- **Código original**: Angular (TypeScript + HTML)
- **Métricas originais**: CC, MI, LOC do código Angular
- **Código convertido**: React (JSX/TSX) por cada IA
- **Métricas pós-conversão**: CC, MI, LOC do código React (xlsx)
- **Comparativos**: Análises Angular vs React por IA

---

**Autor**: Narlan Menezes Aragão
**Curso**: BCET (Bacharelado em Ciência e Engenharia de Tecnologia)  
**Tipo**: Trabalho de Conclusão de Curso (TCC)
