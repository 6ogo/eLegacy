USE empires_legacy;

-- Insert initial dynasties
INSERT INTO dynasties (id, name, description, special_ability, resource_bonus, unit_bonus) VALUES
(UUID(), 'Merchants of Valor', 'Masters of trade and economy', 'Double resource generation from trade routes', 
    '{"gold": 1.5, "influence": 1.2}', 
    '{"cavalry": {"attack": 1.1}}'
),
(UUID(), 'Warriors of the North', 'Fierce warriors from the frozen lands', 'Bonus attack in mountain territories',
    '{"power": 1.3, "influence": 1.1}',
    '{"infantry": {"defense": 1.2}}'
),
(UUID(), 'Desert Nomads', 'Swift and adaptable desert dwellers', 'Units can move through neutral territories',
    '{"gold": 1.2, "power": 1.2}',
    '{"cavalry": {"movement": 2}}'
),
(UUID(), 'Imperial Dynasty', 'Ancient rulers with vast knowledge', 'Reduced building costs',
    '{"influence": 1.4, "gold": 1.1}',
    '{"artillery": {"attack": 1.2}}'
),
(UUID(), 'Island Kingdoms', 'Masters of naval warfare', 'Can cross water territories freely',
    '{"gold": 1.3, "power": 1.1}',
    '{"naval": {"attack": 1.3}}'
);

-- Create stored procedures for game management
DELIMITER //

CREATE PROCEDURE CreateGame(
    IN p_game_id VARCHAR(36),
    IN p_map_state JSON,
    IN p_settings JSON
)
BEGIN
    INSERT INTO game_sessions (id, status, map_state, turn_phase, settings)
    VALUES (p_game_id, 'waiting', p_map_state, 'setup', p_settings);
END //

CREATE PROCEDURE AddPlayerToGame(
    IN p_game_id VARCHAR(36),
    IN p_user_id VARCHAR(36),
    IN p_dynasty_id VARCHAR(36),
    IN p_turn_order INT
)
BEGIN
    INSERT INTO game_players (id, game_id, user_id, dynasty_id, player_state, turn_order, resources)
    VALUES (
        UUID(),
        p_game_id,
        p_user_id,
        p_dynasty_id,
        '{"ready": false}',
        p_turn_order,
        '{"gold": 100, "influence": 50, "power": 25}'
    );
END //

CREATE PROCEDURE LogGameAction(
    IN p_game_id VARCHAR(36),
    IN p_player_id VARCHAR(36),
    IN p_action_type VARCHAR(50),
    IN p_action_data JSON,
    IN p_turn_number INT
)
BEGIN
    INSERT INTO game_actions (id, game_id, player_id, action_type, action_data, turn_number)
    VALUES (UUID(), p_game_id, p_player_id, p_action_type, p_action_data, p_turn_number);
END //

DELIMITER ;

-- Create views for game statistics
CREATE VIEW player_statistics AS
SELECT 
    u.id,
    u.username,
    COUNT(DISTINCT gp.game_id) as games_played,
    SUM(CASE WHEN gs.winner_id = gp.id THEN 1 ELSE 0 END) as wins,
    AVG(CASE WHEN gs.winner_id = gp.id THEN 1 ELSE 0 END) as win_rate
FROM users u
LEFT JOIN game_players gp ON u.id = gp.user_id
LEFT JOIN game_sessions gs ON gp.game_id = gs.id
GROUP BY u.id;

-- Create triggers for game state management
DELIMITER //

CREATE TRIGGER before_game_update
BEFORE UPDATE ON game_sessions
FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
    IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
        SET NEW.completed_at = CURRENT_TIMESTAMP;
    END IF;
END //

DELIMITER ;