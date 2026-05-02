import { test, expect } from '@playwright/test';

test('Deberia tener un buscador visible', async ({ page }) => {
  await page.goto('http://localhost:5173/');

  await expect(page.getByRole('searchbox')).toBeVisible();
});

test('Deberia buscar un empleo', async ({ page }) => {
  await page.goto('http://localhost:5173/');

  const searchBox = page.getByRole('searchbox');
  const searchButton = page.getByRole('button', {name: 'Buscar'});
  await searchBox.fill('react');
  await searchButton.click();

  await expect(page.getByRole('button', {name: 'aplicar'}).first()).toBeVisible();
});

test('Deberia aplicar a un empleo', async ({ page }) => {
  await page.goto('http://localhost:5173/');

  const searchBox = page.getByRole('searchbox');
  const searchButton = page.getByRole('button', {name: 'Buscar'});
  await searchBox.fill('JavaScript');
  await searchButton.click();

  await expect(page.getByRole('button', {name: 'aplicar'}).first()).toBeVisible();

  const inicioSesion = page.getByRole('button', {name: 'Iniciar sesión'});
  await inicioSesion.click();
  
  const botonAplicar = page.getByRole('button', {name: 'aplicar'}).first();
  await botonAplicar.click();
  await expect(page.getByRole('button', {name: 'Aplicado!'})).toBeVisible();
});

test('Deberia usar filtros', async ({ page }) => {
  await page.goto('http://localhost:5173/search');

  await page.locator('#search-ubi').selectOption('Remoto');
  await page.locator('#search-nivel').selectOption('Senior');

  const primerResultado = page.getByRole('article').first();
  await expect(primerResultado).toContainText('Remoto');
  await expect(primerResultado).toContainText('Senior');
});

test('Debe verificar la paginación', async ({ page }) => {
  await page.goto('http://localhost:5173/search');

  const searchBox = page.getByRole('searchbox');
  await searchBox.fill('de');
  await searchBox.press('Enter');

  const botonSiguiente = page.getByRole('link', { name: 'Ir a la página de resultados' });
  await expect(botonSiguiente).toBeVisible();
  
  const primerResultadoP1 = page.getByRole('article').first();
  const tituloP1 = await primerResultadoP1.textContent();

  await botonSiguiente.click();

  const primerTrabajoP2 = page.getByRole('article').first();
  const tituloP2 = await primerTrabajoP2.textContent();

  expect(tituloP1).not.toEqual(tituloP2);
});

test('Test de detalle de empleo', async ({ page }) => {
  await page.goto('http://localhost:5173/search');

  const primerResultado = page.getByRole('article').first();
  
  await expect(primerResultado).toBeVisible();
  await page.getByRole('link', { name: 'Desarrollador de Software' }).click();

  await expect(page.getByRole('heading', { name: 'Descripción del puesto' })).toBeVisible();

  const botonAplicar = page.getByRole('button', {name: 'aplicar'}).first();
  await botonAplicar.click();
  await expect(page.getByRole('button', {name: 'Aplicado!'})).toBeVisible();

});
