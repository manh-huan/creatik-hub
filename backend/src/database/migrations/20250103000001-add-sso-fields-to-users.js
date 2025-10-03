'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable('users');

    // Add 'provider' column if it doesn't exist
    if (!table.provider) {
      await queryInterface.addColumn('users', 'provider', {
        type: Sequelize.STRING(50),
        allowNull: true,
        comment: 'Authentication provider: local, google, facebook, apple',
        defaultValue: 'local'
      });
    }

    // Add 'provider_id' column if it doesn't exist
    if (!table.provider_id) {
      await queryInterface.addColumn('users', 'provider_id', {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: 'Unique ID from OAuth provider'
      });
    }

    // Add 'last_login_at' column if it doesn't exist
    if (!table.last_login_at) {
      await queryInterface.addColumn('users', 'last_login_at', {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'Timestamp of last successful login'
      });
    }

    // Change 'password_hash' to nullable only if currently NOT NULL
    if (table.password_hash && table.password_hash.allowNull === false) {
      await queryInterface.changeColumn('users', 'password_hash', {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: 'Hashed password (null for SSO-only users)'
      });
    }

    // Add indexes safely (Postgres-specific check)
    const addIndexSafe = async (columns, name) => {
      const [indexes] = await queryInterface.sequelize.query(
        `SELECT indexname FROM pg_indexes WHERE tablename='users' AND indexname='${name}'`
      );
      if (indexes.length === 0) {
        await queryInterface.addIndex('users', columns, { name, unique: false });
      }
    };

    await addIndexSafe(['provider', 'provider_id'], 'idx_users_provider');
    await addIndexSafe(['email', 'provider'], 'idx_users_email_provider');
  },

  async down(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable('users');

    // Remove indexes if exist
    const removeIndexSafe = async (name) => {
      try {
        await queryInterface.removeIndex('users', name);
      } catch (err) {
        // ignore if index doesn't exist
      }
    };

    await removeIndexSafe('idx_users_email_provider');
    await removeIndexSafe('idx_users_provider');

    // Remove columns if they exist
    if (table.last_login_at) await queryInterface.removeColumn('users', 'last_login_at');
    if (table.provider_id) await queryInterface.removeColumn('users', 'provider_id');
    if (table.provider) await queryInterface.removeColumn('users', 'provider');

    // Restore password_hash to NOT NULL only if currently nullable
    if (table.password_hash && table.password_hash.allowNull === true) {
      await queryInterface.changeColumn('users', 'password_hash', {
        type: Sequelize.STRING(255),
        allowNull: false
      });
    }
  }
};
