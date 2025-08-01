
# Teste técnico - CRUD de Usuários com controle de sessão via JWT

---

## Sobre o Projeto

Este projeto consiste em um frontend e um microserviço para gerenciamento de usuários, sendo o backend desenvolvido em NestJS com banco de dados PostgreSQL e o TypeORM, e para o Frontend, o React.js com as bibliotecas React Router e ContextAPI para controle de estados. 

Este frontend + microsserviço foi desenvolvido como parte de um teste técnico para a **Stefanini**, considerando boas práticas em arquitetura, código limpo e escalabilidade.

---

## Funcionalidades

- Fazer login utilizando JWT para proteção dos endpoints
- Criar um novo usuário (SBN, nome, descrição, autor e estoque)
- Atualizar dados de um usuário
- Excluir um usuário

---

## Tecnologias Utilizadas


FrontEnd

| Tecnologia        | Descrição                                 |
|-------------------|-------------------------------------------|
| Typescript        | Superset do JS                            |
| React.js          | Framework Web Reativo                     |
| Shadcn            | UI Kit com Tailwind                       |
| React Router      | Roteamento da aplicação WEB               |
| ContextAPI        | Gerenciamento de estados                  |
| Docker + Compose  | Containerização e orquestração            |

Backend

| Tecnologia        | Descrição                                  |
|-------------------|--------------------------------------------|
| NestJS            | Framework backend em Node.js               |
| TypeORM           | ORM para integração com PostgreSQL         |
| PostgreSQL        | Banco de dados relacional                  |
| Docker + Compose  | Containerização e orquestração             |
| Winston           | Logging estruturado                        |
| Swagger           | Documentação (disponível em /api)          |
| AWS CloudWatch    | Persistência e análise de logs (opcional) |

---

## Configuração e Execução

### Pré-requisitos

- Docker & Docker Compose instalados;
- Node.js v18+ (para execução local sem Docker);
- Conta AWS com permissões para CloudWatch (opcional).

### Passos para rodar o Frontend

As variaveis de exemplo estão no arquivo `.env.example` e tambem no docker-compose para a execução e testes.

1. Subir os containers:
   ```bash
   docker-compose up --build
   ```

2. Acessar o frontend em:  
   `http://localhost:5173`

---
### Passos para rodar a API

As variaveis de exemplo estão no arquivo `.env.example` e tambem no docker-compose para a execução e testes.

AWS_ACCESS_KEY_ID e AWS_SECRET_ACCESS_KEY devem ser configurados via IAM roles em produção

1. Subir os containers:
   ```bash
   docker-compose up --build
   ```

2. Acessar o swagger da API em:  
   `http://localhost:3000/api`

---

## Observabilidade

- Logs estruturados via **Winston**;
- Suporte para envio dos logs ao **AWS CloudWatch Logs**;
- Possibilidade futura de integração com Prometheus/Grafana para métricas se desejado.

---

## Docker Compose

O projeto está preparado para rodar com Docker Compose, incluindo os seguintes serviços para:

- Banco de dados PostgreSQL;
- Aplicação NestJS containerizada.
- Aplicação Web com Vite + React

---

## Considerações Finais

O Frontend foi desenvolvido seguindo as praticas recomendadas pela equipe do React e como padrão de mercado, levando em conta sempre a estrutura basica de Components, Pages, ContextAPI e Router. 

O microserviço foi desenvolvido seguindo as seguintes boas práticas, levando em conta a estrutura padrão já fornecida pelo NestJS:

- **Separação clara** entre camadas (Controller, Service, Entity, DTO);
- **DTOs** para validação e segurança dos dados;
- **Logs estruturados** para facilitar o monitoramento em produção.

---

## Melhorias e observações

- Implementar Terraform se o deploy for em ambiente AWS
- Mudança de arquitetura backend futura para melhor estruturação do projeto se necessário (Talvez com um DDD ou Clean Arch se novas features exigirem)
