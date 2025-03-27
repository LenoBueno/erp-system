-- Consultas otimizadas para o sistema ERP

-- 1. Consulta para o dashboard - Vendas por período
SELECT 
    DATE_FORMAT(created_at, '%Y-%m') AS month,
    SUM(total_amount) AS total_sales,
    COUNT(*) AS order_count
FROM 
    orders
WHERE 
    status = 'completed' 
    AND created_at >= DATE_SUB(CURRENT_DATE(), INTERVAL 12 MONTH)
GROUP BY 
    DATE_FORMAT(created_at, '%Y-%m')
ORDER BY 
    month;

-- 2. Consulta para o dashboard - Produtos mais vendidos
SELECT 
    p.id,
    p.name,
    SUM(oi.quantity) AS total_quantity,
    SUM(oi.quantity * oi.price) AS total_revenue
FROM 
    products p
    JOIN order_items oi ON p.id = oi.product_id
    JOIN orders o ON oi.order_id = o.id
WHERE 
    o.status = 'completed'
    AND o.created_at >= DATE_SUB(CURRENT_DATE(), INTERVAL 3 MONTH)
GROUP BY 
    p.id, p.name
ORDER BY 
    total_quantity DESC
LIMIT 10;

-- 3. Consulta para o dashboard - Categorias mais vendidas
SELECT 
    c.id,
    c.name,
    SUM(oi.quantity) AS total_quantity,
    SUM(oi.quantity * oi.price) AS total_revenue
FROM 
    categories c
    JOIN products p ON c.id = p.category_id
    JOIN order_items oi ON p.id = oi.product_id
    JOIN orders o ON oi.order_id = o.id
WHERE 
    o.status = 'completed'
    AND o.created_at >= DATE_SUB(CURRENT_DATE(), INTERVAL 3 MONTH)
GROUP BY 
    c.id, c.name
ORDER BY 
    total_quantity DESC;

-- 4. Consulta para relatórios - Clientes que mais compram
SELECT 
    c.id,
    c.name,
    c.email,
    COUNT(DISTINCT o.id) AS order_count,
    SUM(o.total_amount) AS total_spent
FROM 
    customers c
    JOIN orders o ON c.id = o.customer_id
WHERE 
    o.status = 'completed'
    AND o.created_at >= DATE_SUB(CURRENT_DATE(), INTERVAL 6 MONTH)
GROUP BY 
    c.id, c.name, c.email
ORDER BY 
    total_spent DESC
LIMIT 10;

-- 5. Consulta para estoque - Produtos com estoque baixo
SELECT 
    p.id,
    p.name,
    p.stock_quantity,
    p.reorder_level,
    c.name AS category_name
FROM 
    products p
    JOIN categories c ON p.category_id = c.id
WHERE 
    p.stock_quantity <= p.reorder_level
ORDER BY 
    (p.stock_quantity / p.reorder_level) ASC;

-- 6. Consulta para financeiro - Contas a receber vencidas
SELECT 
    ar.id,
    ar.amount,
    ar.due_date,
    DATEDIFF(CURRENT_DATE(), ar.due_date) AS days_overdue,
    c.name AS customer_name,
    c.phone AS customer_phone
FROM 
    accounts_receivable ar
    JOIN customers c ON ar.customer_id = c.id
WHERE 
    ar.status = 'pending'
    AND ar.due_date < CURRENT_DATE()
ORDER BY 
    days_overdue DESC;

-- 7. Consulta para financeiro - Contas a pagar próximas do vencimento
SELECT 
    ap.id,
    ap.description,
    ap.amount,
    ap.due_date,
    DATEDIFF(ap.due_date, CURRENT_DATE()) AS days_until_due,
    s.name AS supplier_name
FROM 
    accounts_payable ap
    LEFT JOIN suppliers s ON ap.supplier_id = s.id
WHERE 
    ap.status = 'pending'
    AND ap.due_date BETWEEN CURRENT_DATE() AND DATE_ADD(CURRENT_DATE(), INTERVAL 7 DAY)
ORDER BY 
    days_until_due ASC;

-- 8. Consulta para vendas - Pedidos recentes com detalhes
SELECT 
    o.id,
    o.order_number,
    o.created_at,
    o.total_amount,
    o.status,
    o.payment_status,
    c.name AS customer_name,
    c.phone AS customer_phone
FROM 
    orders o
    JOIN customers c ON o.customer_id = c.id
ORDER BY 
    o.created_at DESC
LIMIT 20;

-- 9. Consulta para vendas - Detalhes de um pedido específico
SELECT 
    oi.id,
    p.name AS product_name,
    oi.quantity,
    oi.price,
    (oi.quantity * oi.price) AS subtotal
FROM 
    order_items oi
    JOIN products p ON oi.product_id = p.id
WHERE 
    oi.order_id = ?
ORDER BY 
    p.name;

-- 10. Consulta para relatórios - Movimentações de estoque por produto
SELECT 
    sm.id,
    sm.created_at,
    sm.quantity,
    sm.type,
    sm.reason,
    u.name AS created_by_user
FROM 
    stock_movements sm
    JOIN users u ON sm.created_by = u.id
WHERE 
    sm.product_id = ?
ORDER BY 
    sm.created_at DESC;

-- 11. Consulta para relatórios - Fluxo de caixa
SELECT 
    DATE_FORMAT(date_col, '%Y-%m-%d') AS date,
    SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS income,
    SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS expense,
    SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END) AS balance
FROM (
    SELECT 
        payment_date AS date_col,
        amount,
        'income' AS type
    FROM 
        accounts_receivable
    WHERE 
        status = 'paid'
        AND payment_date IS NOT NULL
        AND payment_date BETWEEN ? AND ?
    
    UNION ALL
    
    SELECT 
        payment_date AS date_col,
        amount,
        'expense' AS type
    FROM 
        accounts_payable
    WHERE 
        status = 'paid'
        AND payment_date IS NOT NULL
        AND payment_date BETWEEN ? AND ?
) AS combined_data
GROUP BY 
    DATE_FORMAT(date_col, '%Y-%m-%d')
ORDER BY 
    date;

-- 12. Stored Procedure para atualizar estoque após venda
DELIMITER //
CREATE PROCEDURE update_stock_after_sale(IN p_order_id INT, IN p_user_id INT)
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE v_product_id INT;
    DECLARE v_quantity INT;
    
    DECLARE cur CURSOR FOR 
        SELECT product_id, quantity 
        FROM order_items 
        WHERE order_id = p_order_id;
    
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    OPEN cur;
    
    read_loop: LOOP
        FETCH cur INTO v_product_id, v_quantity;
        IF done THEN
            LEAVE read_loop;
        END IF;
        
        -- Atualizar estoque do produto
        UPDATE products 
        SET stock_quantity = stock_quantity - v_quantity 
        WHERE id = v_product_id;
        
        -- Registrar movimentação de estoque
        INSERT INTO stock_movements (product_id, quantity, type, reason, reference_id, reference_type, created_by) 
        VALUES (v_product_id, v_quantity, 'remove', 'sale', p_order_id, 'order', p_user_id);
    END LOOP;
    
    CLOSE cur;
END //
DELIMITER ;

-- 13. Trigger para atualizar total do pedido quando itens são adicionados/alterados
DELIMITER //
CREATE TRIGGER update_order_total AFTER INSERT ON order_items
FOR EACH ROW
BEGIN
    DECLARE new_total DECIMAL(10, 2);
    
    -- Calcular novo total
    SELECT SUM(quantity * price) INTO new_total
    FROM order_items
    WHERE order_id = NEW.order_id;
    
    -- Atualizar total do pedido
    UPDATE orders
    SET total_amount = new_total
    WHERE id = NEW.order_id;
END //
DELIMITER ;

-- 14. View para relatório de vendas por categoria
CREATE VIEW vw_sales_by_category AS
SELECT 
    c.id AS category_id,
    c.name AS category_name,
    COUNT(DISTINCT o.id) AS order_count,
    SUM(oi.quantity) AS total_quantity,
    SUM(oi.quantity * oi.price) AS total_revenue
FROM 
    categories c
    JOIN products p ON c.id = p.category_id
    JOIN order_items oi ON p.id = oi.product_id
    JOIN orders o ON oi.order_id = o.id
WHERE 
    o.status = 'completed'
GROUP BY 
    c.id, c.name;

-- 15. View para relatório de clientes
CREATE VIEW vw_customer_report AS
SELECT 
    c.id,
    c.name,
    c.email,
    c.phone,
    c.city,
    c.state,
    COUNT(DISTINCT o.id) AS total_orders,
    SUM(o.total_amount) AS total_spent,
    MAX(o.created_at) AS last_order_date
FROM 
    customers c
    LEFT JOIN orders o ON c.id = o.customer_id AND o.status = 'completed'
GROUP BY 
    c.id, c.name, c.email, c.phone, c.city, c.state;

