-- Initial database setup
CREATE DATABASE IF NOT EXISTS empires_legacy;
USE empires_legacy;

-- Enable JSON support
SET GLOBAL local_infile = 1;

-- Core Tables
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    rank INT DEFAULT 0,
    wins INT DEFAULT 0,
    losses INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT true,
    UNIQUE INDEX idx_username (username),
    UNIQUE INDEX idx_email (email)
);

CREATE TABLE IF NOT EXISTS dynasties (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    special_ability TEXT,
    resource_bonus JSON,
    unit_bonus JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS game_sessions (
    id VARCHAR(36) PRIMARY KEY,
    status ENUM('waiting', 'in_progress', 'completed', 'abandoned') NOT NULL,
    map_state JSON NOT NULL,
    turn_number INT DEFAULT 1,
    turn_phase ENUM('setup', 'resource', 'action', 'fortification') NOT NULL,
    current_player_id VARCHAR(36),
    winner_id VARCHAR(36) NULL,
    settings JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    FOREIGN KEY (current_player_id) REFERENCES users(id),
    FOREIGN KEY (winner_id) REFERENCES users(id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
);

CREATE TABLE IF NOT EXISTS game_players (
    id VARCHAR(36) PRIMARY KEY,
    game_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    dynasty_id VARCHAR(36) NOT NULL,
    player_state JSON NOT NULL,
    turn_order INT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    resources JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (game_id) REFERENCES game_sessions(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (dynasty_id) REFERENCES dynasties(id),
    INDEX idx_game_user (game_id, user_id)
);

CREATE TABLE IF NOT EXISTS territories (
    id VARCHAR(36) PRIMARY KEY,
    game_id VARCHAR(36) NOT NULL,
    name VARCHAR(100) NOT NULL,
    owner_id VARCHAR(36) NULL,
    units INT DEFAULT 0,
    buildings JSON,
    resources JSON,
    position JSON NOT NULL,
    adjacent_territories JSON NOT NULL,
    FOREIGN KEY (game_id) REFERENCES game_sessions(id),
    FOREIGN KEY (owner_id) REFERENCES game_players(id),
    INDEX idx_game_territory (game_id, id)
);

CREATE TABLE IF NOT EXISTS game_actions (
    id VARCHAR(36) PRIMARY KEY,
    game_id VARCHAR(36) NOT NULL,
    player_id VARCHAR(36) NOT NULL,
    turn_number INT NOT NULL,
    action_type VARCHAR(50) NOT NULL,
    action_data JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (game_id) REFERENCES game_sessions(id),
    FOREIGN KEY (player_id) REFERENCES game_players(id),
    INDEX idx_game_turn (game_id, turn_number)
);

CREATE TABLE IF NOT EXISTS game_chat (
    id VARCHAR(36) PRIMARY KEY,
    game_id VARCHAR(36) NOT NULL,
    player_id VARCHAR(36) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (game_id) REFERENCES game_sessions(id),
    FOREIGN KEY (player_id) REFERENCES game_players(id),
    INDEX idx_game_chat (game_id, created_at)
);