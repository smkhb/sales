# 📝 CRM de Análise de Vendas

Este documento descreve o projeto de uma API REST para um CRM (Customer Relationship Management) de Análise de Vendas. O objetivo é aplicar os princípios de Domain-Driven Design (DDD) e Clean Architecture para construir um sistema robusto, modular e de fácil manutenção.

## 🎯 Objetivos

[x] A aplicação deve ter dois tipos de usuário, Vendedor e/ou Gerente de Vendas.

[x] Deve ser possível realizar login com e-mail e senha.

[x] Deve ser possível realizar o CRUD dos vendedores (acessível apenas por gerentes).

[x] Deve ser possível realizar o CRUD dos clientes.

[x] Deve ser possível realizar o CRUD das oportunidades de vendas.

[x] Deve ser possível alterar a senha de um usuário (somente gerentes podem alterar as senhas dos vendedores).

[x] Deve ser possível listar as vendas de um usuário (vendedor).

[x] Deve ser possível notificar o gerente a cada alteração no status de uma venda de alto valor.

## 📑 Regras de negócio

[x] Somente usuário do tipo gerente pode realizar operações de CRUD nos vendedores.

[x] Somente o vendedor que está logado pode gerenciar seus próprios clientes.

[x] Para marcar uma oportunidade de venda como entregue, é obrigatório o envio de uma foto.

[x] Somente o gerente pode alterar a senha de um vendedor.

[x] Não deve ser possível um vendedor listar as vendas de outro vendedor.

[x] Todo cliente deve ter um vendedor associado.

[x] O primeiro vendedor associado do Cliente deve ser o vendedor que o criou.

[x] Toda oportunidade de venda deve estar associada a um cliente e a um vendedor.

[x] O vendedor que cria a oportunidade de venda é o seu primeiro responsável.

## ✏️ Conceitos que pode praticar

- DDD, Domain Events, Clean Architecture

- Testes unitários

## 🏛️ Arquitetura da Solução

A base da API é construída seguindo a Clean Architecture e o Domain-Driven Design.

Camada core: Contém os blocos de construção fundamentais e genéricos, como Entity, AggregateRoot e os padrões Either e DomainEvents.

Camada domain: O coração do projeto. É onde residem as regras de negócio puras, entidades (Client, Salesperson), casos de uso (RegisterClientUseCase) e repositórios (interfaces).

Testes: Uma pasta dedicada a testes unitários para garantir a integridade dos casos de uso.
