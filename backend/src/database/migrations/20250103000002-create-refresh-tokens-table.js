'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Create refresh_tokens table for secure token rotation
    await queryInterface.createTable('refresh_tokens', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        comment: 'User who owns this refresh token',
      },
      token_hash: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
        comment: 'Hashed refresh token (bcrypt)',
      },
      device_info: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Device information for user session tracking',
      },
      ip_address: {
        type: Sequelize.INET,
        allowNull: true,
        comment: 'IP address where token was issued',
      },
      user_agent: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'User agent string from browser/client',
      },
      expires_at: {
        type: Sequelize.DATE,
        allowNull: false,
        comment: 'Token expiration timestamp',
      },
      is_revoked: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'True if token has been revoked',
      },
      revoked_at: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'Timestamp when token was revoked',
      },
      parent_token_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'refresh_tokens',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        comment: 'Parent token ID for rotation tracking (reuse detection)',
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
        comment: 'Token creation timestamp',
      },
    });

    // Add indexes for performance and security
    await queryInterface.addIndex('refresh_tokens', ['user_id', 'is_revoked'], {
      name: 'idx_refresh_tokens_user_revoked',
    });

    await queryInterface.addIndex('refresh_tokens', ['token_hash'], {
      name: 'idx_refresh_tokens_hash',
      unique: true,
    });

    await queryInterface.addIndex('refresh_tokens', ['expires_at'], {
      name: 'idx_refresh_tokens_expires',
      where: {
        is_revoked: false,
      },
    });

    await queryInterface.addIndex('refresh_tokens', ['parent_token_id'], {
      name: 'idx_refresh_tokens_parent',
    });
  },

  async down(queryInterface, Sequelize) {
    // Drop table and all indexes
    await queryInterface.dropTable('refresh_tokens');
  },
};
