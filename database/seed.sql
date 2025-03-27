-- Inserir dados iniciais
USE simple_ink_umbandae;

-- Inserir usuário administrador (senha: admin123)
INSERT INTO users (name, email, password, role) VALUES 
('Administrador', 'admin@simpleink.com', '$2b$10$X7o4c5/QR5yEr5G9OB3Yp.X3GYr3ZNqB5Jy0Q5YyZ5X5Z5X5Z5X5Z5', 'admin');

-- Inserir categorias
INSERT INTO categories (name, description) VALUES 
('Velas', 'Velas para rituais e oferendas'),
('Ervas', 'Ervas para banhos e defumações'),
('Imagens', 'Imagens de orixás e entidades'),
('Guias', 'Guias e colares rituais'),
('Livros', 'Livros sobre umbanda e espiritualidade'),
('Incensos', 'Incensos e defumadores');

-- Inserir produtos
INSERT INTO products (name, description, price, stock_quantity, reorder_level, category_id, sku) VALUES 
('Vela 7 Dias Branca', 'Vela votiva branca para rituais de paz e proteção', 15.90, 50, 10, 1, 'VL-001'),
('Vela 7 Dias Vermelha', 'Vela votiva vermelha para rituais de amor e paixão', 15.90, 45, 10, 1, 'VL-002'),
('Vela 7 Dias Preta', 'Vela votiva preta para rituais de proteção e quebra de negatividade', 15.90, 30, 10, 1, 'VL-003'),
('Vela 7 Dias Amarela', 'Vela votiva amarela para rituais de prosperidade', 15.90, 40, 10, 1, 'VL-004'),
('Vela 7 Dias Verde', 'Vela votiva verde para rituais de saúde e cura', 15.90, 35, 10, 1, 'VL-005'),
('Vela 7 Dias Azul', 'Vela votiva azul para rituais de paz e comunicação', 15.90, 38, 10, 1, 'VL-006'),
('Vela 7 Dias Roxa', 'Vela votiva roxa para rituais de espiritualidade', 15.90, 25, 10, 1, 'VL-007'),
('Arruda', 'Maço de arruda fresca para banhos e defumações', 8.50, 20, 5, 2, 'ER-001'),
('Guiné', 'Maço de guiné fresca para banhos e defumações', 8.50, 18, 5, 2, 'ER-002'),
('Alecrim', 'Maço de alecrim fresco para banhos e defumações', 8.50, 25, 5, 2, 'ER-003'),
('Manjericão', 'Maço de manjericão fresco para banhos e defumações', 8.50, 22, 5, 2, 'ER-004'),
('Espada de São Jorge', 'Folha de espada de São Jorge para proteção', 12.00, 15, 5, 2, 'ER-005'),
('Imagem Oxalá', 'Imagem de Oxalá em resina - 20cm', 89.90, 10, 3, 3, 'IM-001'),
('Imagem Iemanjá', 'Imagem de Iemanjá em resina - 20cm', 89.90, 12, 3, 3, 'IM-002'),
('Imagem Oxum', 'Imagem de Oxum em resina - 20cm', 89.90, 8, 3, 3, 'IM-003'),
('Imagem Xangô', 'Imagem de Xangô em resina - 20cm', 89.90, 7, 3, 3, 'IM-004'),
('Imagem Ogum', 'Imagem de Ogum em resina - 20cm', 89.90, 9, 3, 3, 'IM-005'),
('Guia de Oxalá', 'Guia de contas brancas para Oxalá', 45.00, 15, 5, 4, 'GU-001'),
('Guia de Iemanjá', 'Guia de contas azul claro para Iemanjá', 45.00,  45.00, 15, 5, 4, 'GU-001'),
('Guia de Iemanjá', 'Guia de contas azul claro para Iemanjá', 45.00, 18, 5, 4, 'GU-002'),
('Guia de Oxum', 'Guia de contas amarelas para Oxum', 45.00, 12, 5, 4, 'GU-003'),
('Guia de Xangô', 'Guia de contas marrom e branco para Xangô', 45.00, 10, 5, 4, 'GU-004'),
('Guia de Ogum', 'Guia de contas azul escuro para Ogum', 45.00, 14, 5, 4, 'GU-005'),
('Livro Fundamentos da Umbanda', 'Livro sobre os fundamentos e história da umbanda', 35.90, 20, 5, 5, 'LV-001'),
('Livro Orixás', 'Livro sobre os orixás e suas características', 42.50, 15, 5, 5, 'LV-002'),
('Livro Rezas e Orações', 'Livro com rezas e orações para rituais', 28.90, 18, 5, 5, 'LV-003'),
('Incenso de Sândalo', 'Caixa com 20 varetas de incenso de sândalo', 12.50, 30, 10, 6, 'IN-001'),
('Incenso de Lavanda', 'Caixa com 20 varetas de incenso de lavanda', 12.50, 28, 10, 6, 'IN-002'),
('Incenso de Alecrim', 'Caixa com 20 varetas de incenso de alecrim', 12.50, 25, 10, 6, 'IN-003'),
('Incenso 7 Ervas', 'Caixa com 20 varetas de incenso de 7 ervas', 12.50, 32, 10, 6, 'IN-004');

-- Inserir clientes
INSERT INTO customers (name, email, phone, address, city, state, postal_code) VALUES 
('Maria Silva', 'maria.silva@email.com', '(11) 98765-4321', 'Rua das Flores, 123', 'São Paulo', 'SP', '01234-567'),
('João Santos', 'joao.santos@email.com', '(11) 91234-5678', 'Av. Paulista, 1000', 'São Paulo', 'SP', '01310-100'),
('Ana Oliveira', 'ana.oliveira@email.com', '(11) 99876-5432', 'Rua Augusta, 500', 'São Paulo', 'SP', '01305-000'),
('Carlos Pereira', 'carlos.pereira@email.com', '(11) 97654-3210', 'Rua Oscar Freire, 200', 'São Paulo', 'SP', '01426-000'),
('Fernanda Lima', 'fernanda.lima@email.com', '(11) 95432-1098', 'Alameda Santos, 800', 'São Paulo', 'SP', '01419-001');

-- Inserir fornecedores
INSERT INTO suppliers (name, contact_name, email, phone, address, city, state, postal_code) VALUES 
('Distribuidora Luz Divina', 'Roberto Mendes', 'contato@luzdivina.com.br', '(11) 3456-7890', 'Rua da Paz, 150', 'São Paulo', 'SP', '01234-000'),
('Ervas & Cia', 'Mariana Costa', 'vendas@ervasecia.com.br', '(11) 2345-6789', 'Av. do Verde, 500', 'São Paulo', 'SP', '02345-000'),
('Artesanato Místico', 'Paulo Souza', 'paulo@artesanatomistico.com.br', '(11) 3456-7891', 'Rua das Artes, 300', 'São Paulo', 'SP', '03456-000');

-- Inserir pedidos
INSERT INTO orders (order_number, customer_id, total_amount, status, payment_status, payment_method) VALUES 
('PED-2023-0001', 1, 125.70, 'completed', 'paid', 'credit_card'),
('PED-2023-0002', 2, 89.90, 'completed', 'paid', 'pix'),
('PED-2023-0003', 3, 57.50, 'processing', 'pending', 'bank_transfer'),
('PED-2023-0004', 4, 135.00, 'pending', 'pending', 'credit_card'),
('PED-2023-0005', 5, 42.50, 'completed', 'paid', 'cash');

-- Inserir itens de pedido
INSERT INTO order_items (order_id, product_id, quantity, price) VALUES 
(1, 1, 3, 15.90),
(1, 8, 2, 8.50),
(1, 20, 1, 12.50),
(2, 13, 1, 89.90),
(3, 8, 1, 8.50),
(3, 9, 1, 8.50),
(3, 20, 1, 12.50),
(3, 21, 1, 12.50),
(3, 22, 1, 12.50),
(4, 18, 1, 45.00),
(4, 19, 1, 45.00),
(4, 20, 1, 45.00),
(5, 27, 1, 42.50);

-- Inserir movimentações de estoque
INSERT INTO stock_movements (product_id, quantity, type, reason, created_by) VALUES 
(1, 50, 'add', 'initial_stock', 1),
(2, 45, 'add', 'initial_stock', 1),
(3, 30, 'add', 'initial_stock', 1),
(4, 40, 'add', 'initial_stock', 1),
(5, 35, 'add', 'initial_stock', 1),
(6, 38, 'add', 'initial_stock', 1),
(7, 25, 'add', 'initial_stock', 1),
(8, 20, 'add', 'initial_stock', 1),
(9, 18, 'add', 'initial_stock', 1),
(10, 25, 'add', 'initial_stock', 1),
(1, 3, 'remove', 'sale', 1),
(8, 2, 'remove', 'sale', 1),
(20, 1, 'remove', 'sale', 1),
(13, 1, 'remove', 'sale', 1);

-- Inserir contas a receber
INSERT INTO accounts_receivable (order_id, customer_id, amount, due_date, status, payment_date, payment_method) VALUES 
(1, 1, 125.70, '2023-05-15', 'paid', '2023-05-15', 'credit_card'),
(2, 2, 89.90, '2023-05-20', 'paid', '2023-05-20', 'pix'),
(3, 3, 57.50, '2023-06-01', 'pending', NULL, 'bank_transfer'),
(4, 4, 135.00, '2023-06-10', 'pending', NULL, 'credit_card'),
(5, 5, 42.50, '2023-05-25', 'paid', '2023-05-25', 'cash');

-- Inserir contas a pagar
INSERT INTO accounts_payable (supplier_id, description, amount, due_date, status) VALUES 
(1, 'Compra de velas', 500.00, '2023-06-15', 'pending'),
(2, 'Compra de ervas', 350.00, '2023-06-20', 'pending'),
(3, 'Compra de imagens', 1200.00, '2023-06-25', 'pending');

-- Inserir notificações
INSERT INTO notifications (user_id, message) VALUES 
(1, 'Bem-vindo ao sistema Simple Ink ERP!'),
(1, 'Você tem 3 pedidos pendentes para processar.'),
(1, 'Estoque baixo para o produto "Imagem Oxum". Considere fazer um novo pedido.');

-- Inserir configurações
INSERT INTO settings (company_name, company_address, company_phone, company_email, tax_rate) VALUES 
('Simple Ink Umbanda', 'Rua da Harmonia, 123 - São Paulo, SP', '(11) 3456-7890', 'contato@simpleink.com.br', 5.00);

