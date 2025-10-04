import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import sequelize from '../config/database';
import User from './user';

class AccountLinkRequest extends Model<InferAttributes<AccountLinkRequest>, InferCreationAttributes<AccountLinkRequest>> {
  declare id: CreationOptional<string>;
  declare userId: string;
  declare provider: string;
  declare providerId: string;
  declare providerEmail: string;
  declare tokenHash: string;
  declare ipAddress: CreationOptional<string | null>;
  declare userAgent: CreationOptional<string | null>;
  declare expiresAt: Date;
  declare isUsed: CreationOptional<boolean>;
  declare usedAt: CreationOptional<Date | null>;
  declare createdAt: CreationOptional<Date>;
}

AccountLinkRequest.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'user_id',
    references: {
      model: 'users',
      key: 'id',
    },
  },
  provider: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  providerId: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'provider_id',
  },
  providerEmail: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'provider_email',
  },
  tokenHash: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    field: 'token_hash',
  },
  ipAddress: {
    type: DataTypes.STRING(45),
    allowNull: true,
    field: 'ip_address',
  },
  userAgent: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'user_agent',
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'expires_at',
  },
  isUsed: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'is_used',
  },
  usedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'used_at',
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'created_at',
  },
}, {
  sequelize,
  tableName: 'account_link_requests',
  modelName: 'AccountLinkRequest',
  underscored: true,
  timestamps: false, // We manage created_at manually
});

// Define associations
AccountLinkRequest.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

User.hasMany(AccountLinkRequest, {
  foreignKey: 'userId',
  as: 'linkRequests',
});

export default AccountLinkRequest;

export interface CreateAccountLinkRequestData {
  userId: string;
  provider: string;
  providerId: string;
  providerEmail: string;
  tokenHash: string;
  ipAddress?: string;
  userAgent?: string;
  expiresAt: Date;
}
