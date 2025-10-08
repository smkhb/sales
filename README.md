# 📝 CRM de Análise de Vendas

Este documento descreve o projeto de uma API REST para um CRM (Customer Relationship Management) de Análise de Vendas. O objetivo é aplicar os princípios de Domain-Driven Design (DDD) e Clean Architecture para construir um sistema robusto, modular e de fácil manutenção.

## 🎯 Objetivos

[ ] A aplicação deve ter dois tipos de usuário, Vendedor e/ou Gerente de Vendas.

[ ] Deve ser possível realizar login com e-mail e senha.

[ ] Deve ser possível realizar o CRUD dos vendedores (acessível apenas por gerentes).

[ ] Deve ser possível realizar o CRUD dos clientes.

[ ] Deve ser possível realizar o CRUD das oportunidades de vendas.

[ ] Deve ser possível listar as vendas com endereços de entrega próximo ao local do vendedor.

[ ] Deve ser possível alterar a senha de um usuário (gerentes podem alterar as senhas dos vendedores).

[ ] Deve ser possível listar as vendas de um usuário (vendedor).

[ ] Deve ser possível notificar o gerente a cada alteração no status de uma venda de alto valor.

## 📑 Regras de negócio

[ ] Somente usuário do tipo gerente pode realizar operações de CRUD nos vendedores.

[ ] Somente o vendedor que está logado pode gerenciar seus próprios clientes.

[ ] Para marcar uma oportunidade de venda como entregue, é obrigatório o envio de uma foto.

[ ] Somente o vendedor pode alterar a senha de um usuário.

[ ] Não deve ser possível um vendedor listar as vendas de outro vendedor.

## ✏️ Conceitos que pode praticar

- DDD, Domain Events, Clean Architecture

- Autenticação e Autorização (RBAC)

- Testes unitários e e2e

- Integração com serviços externos

## 🏛️ Arquitetura da Solução

A API é construída com Node.js e Nest.js, seguindo a Clean Architecture e o Domain-Driven Design.

Camada core: Contém os blocos de construção fundamentais e genéricos, como Entity, AggregateRoot e os padrões Either e DomainEvents.

Camada domain: O coração do projeto. É onde residem as regras de negócio puras, entidades (Client, Salesperson), casos de uso (RegisterClientUseCase) e repositórios (interfaces).

Camada infra: A camada de infraestrutura, responsável por implementar a persistência de dados (usando Prisma), a comunicação HTTP (controllers) e os serviços externos.

Testes: Uma pasta dedicada a testes unitários e e2e para garantir a integridade do sistema.
