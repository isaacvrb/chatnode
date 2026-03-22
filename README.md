# ChatNode

Chat em tempo real com Node.js, TypeScript e Socket.IO.

## Tecnologias

- **Node.js** + **Express** — servidor HTTP
- **Socket.IO** — comunicação em tempo real via WebSocket
- **TypeScript** — tipagem estática

## Estrutura do projeto

```
chatnode/
├── src/
│   └── server.ts       # Servidor principal
├── public/
│   ├── index.html      # Interface do chat
│   ├── styles.css      # Estilos
│   └── main.js         # Lógica do cliente
├── dist/               # Saída da compilação TypeScript (gerado)
├── tsconfig.json
└── package.json
```

## Instalação

```bash
npm install
```

## Scripts

| Comando         | Descrição                                           |
| --------------- | --------------------------------------------------- |
| `npm run dev`   | Inicia o servidor em modo desenvolvimento (ts-node) |
| `npm run build` | Compila o TypeScript para `dist/`                   |
| `npm start`     | Inicia o servidor compilado                         |

## Como usar

1. Inicie o servidor:
   ```bash
   npm run dev
   ```
2. Acesse `http://localhost:3000` no navegador
3. Digite seu nome e entre no chat
4. Abra em múltiplas abas para testar o chat em tempo real

## Funcionalidades

- Entrada na sala com nome de usuário
- Mensagens em tempo real entre múltiplos usuários
- Lista de usuários online atualizada dinamicamente
- Notificações de entrada e saída de usuários
- Reconexão automática ao servidor
