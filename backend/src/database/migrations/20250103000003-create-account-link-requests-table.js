'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Create account_link_requests table for SSO account linking flow
    await queryInterface.createTable('account_link_requests', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        comment: 'Existing user account to link to'
      },
      provider: {
        type: Sequelize.STRING(50),
        allowNull: false,
        comment: 'OAuth provider to link: google, facebook, apple'
      },
      provider_id: {
        type: Sequelize.STRING(255),
        allowNull: false,
        comment: 'Unique ID from OAuth provider'
      },
      provider_email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        comment: 'Email from OAuth provider (must match user email)'
      },
      token_hash: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
        comment: 'Hashed confirmation token (SHA-256)'
      },
      ip_address: {
        type: Sequelize.INET,
        allowNull: true,
        comment: 'IP address where link request was initiated'
      },
      user_agent: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'User agent string from browser/client'
      },
      expires_at: {
        type: Sequelize.DATE,
        allowNull: false,
        comment: 'Link request expiration (typically 24 hours)'
      },
      is_used: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'True if link has been confirmed'
      },
      used_at: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'Timestamp when link was confirmed'
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
        comment: 'Request creation timestamp'
      }
    });

    // Add indexes for performance and security
    await queryInterface.addIndex('account_link_requests', ['token_hash'], {
      name: 'idx_account_link_requests_token',
      unique: true,
      where: {
        is_used: false
      }
    });

    await queryInterface.addIndex('account_link_requests', ['user_id', 'provider'], {
      name: 'idx_account_link_requests_user_provider'
    });

    await queryInterface.addIndex('account_link_requests', ['expires_at', 'is_used'], {
      name: 'idx_account_link_requests_expires'
    });

    await queryInterface.addIndex('account_link_requests', ['provider_email'], {
      name: 'idx_account_link_requests_email'
    });
  },

  async down(queryInterface, Sequelize) {
    // Drop table and all indexes
    await queryInterface.dropTable('account_link_requests');
  }
};
