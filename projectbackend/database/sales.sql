-- Drop existing sales table if it exists
DROP TABLE IF EXISTS sales;

-- Create sales table with modified constraints
CREATE TABLE IF NOT EXISTS sales (
    id INT PRIMARY KEY AUTO_INCREMENT,
    car_id INT NOT NULL,
    seller_id INT NOT NULL,
    buyer_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    sale_date DATETIME NOT NULL,
    payment_status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
    mpesa_transaction_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (car_id) REFERENCES cars(car_id) ON DELETE RESTRICT,
    FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE RESTRICT,
    FOREIGN KEY (buyer_id) REFERENCES users(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create trigger to handle car deletion
DELIMITER //
CREATE TRIGGER before_car_delete
BEFORE DELETE ON cars
FOR EACH ROW
BEGIN
    -- Check if car has any active reservations
    IF EXISTS (SELECT 1 FROM reservations WHERE car_id = OLD.car_id AND status = 'active') THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Cannot delete car with active reservations';
    END IF;
    
    -- Update any pending reservations to cancelled
    UPDATE reservations 
    SET status = 'cancelled', 
        updated_at = NOW() 
    WHERE car_id = OLD.car_id 
    AND status = 'pending';
END//
DELIMITER ; 