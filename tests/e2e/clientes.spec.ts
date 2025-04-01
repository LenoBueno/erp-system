import { test, expect } from '@playwright/test';

test.describe('Funcionalidade de Clientes', () => {
  test.beforeEach(async ({ page }) => {
    // Navegar para a página de clientes
    await page.goto('/clientes');
  });

  test('deve permitir cadastrar um novo cliente', async ({ page }) => {
    // Clicar no botão de novo cliente
    await page.getByRole('button', { name: 'Novo Cliente' }).click();

    // Preencher os campos obrigatórios
    await page.getByLabel('Nome').fill('Cliente de Teste');
    await page.getByLabel('Tipo').selectOption('PF');
    await page.getByLabel('Documento').fill('123.456.789-00');
    await page.getByLabel('Email').fill('teste@email.com');
    await page.getByLabel('Telefone').fill('(11) 99999-9999');

    // Clicar em salvar
    await page.getByRole('button', { name: 'Salvar' }).click();

    // Verificar se o cliente foi cadastrado
    await expect(page.getByText('Cliente de Teste')).toBeVisible();
  });

  test('deve permitir editar um cliente existente', async ({ page }) => {
    // Buscar um cliente existente
    await page.getByLabel('Buscar').fill('Cliente de Teste');
    await page.getByRole('button', { name: 'Buscar' }).click();

    // Clicar no botão de editar
    await page.getByRole('button', { name: 'Editar' }).first().click();

    // Alterar o nome do cliente
    await page.getByLabel('Nome').fill('Cliente de Teste - Editado');

    // Salvar as alterações
    await page.getByRole('button', { name: 'Salvar' }).click();

    // Verificar se o nome foi atualizado
    await expect(page.getByText('Cliente de Teste - Editado')).toBeVisible();
  });

  test('deve permitir excluir um cliente', async ({ page }) => {
    // Buscar o cliente para exclusão
    await page.getByLabel('Buscar').fill('Cliente de Teste - Editado');
    await page.getByRole('button', { name: 'Buscar' }).click();

    // Clicar no botão de excluir
    await page.getByRole('button', { name: 'Excluir' }).first().click();

    // Confirmar a exclusão
    await page.getByRole('button', { name: 'Confirmar' }).click();

    // Verificar se o cliente foi removido
    await expect(page.getByText('Cliente de Teste - Editado')).not.toBeVisible();
  });
});
