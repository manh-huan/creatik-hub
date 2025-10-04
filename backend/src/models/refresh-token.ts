import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import sequelize from '../config/database';
import { User } from '.';



class RefreshToken extends Model<InferAttributes<RefreshToken>, InferCreationAttributes<RefreshToken>> {
  declare id: CreationOptional<string>;
  declare userId: string;
  declare tokenHash: string;
  declare deviceInfo: CreationOptional<string | null>;
  declare ipAddress: CreationOptional<string | null>;
  declare userAgent: CreationOptional<string | null>;
  declare expiresAt: Date;
  declare isRevoked: CreationOptional<boolean>;
  declare revokedAt: CreationOptional<Date | null>;
  declare parentTokenId: CreationOptional<string | null>;
  declare createdAt: CreationOptional<Date>;
}

RefreshToken.init({
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
  tokenHash: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    field: 'token_hash',
  },
  deviceInfo: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'device_info',
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
  isRevoked: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'is_revoked',
  },
  revokedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'revoked_at',
  },
  parentTokenId: {
    type: DataTypes.UUID,
    allowNull: true,
    field: 'parent_token_id',
    references: {
      model: 'refresh_tokens',
      key: 'id',
    },
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'created_at',
  },
}, {
  sequelize,
  tableName: 'refresh_tokens',
  modelName: 'RefreshToken',
  underscored: true,
  timestamps: false, // We manage created_at manually
});

// Define associations
RefreshToken.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

User.hasMany(RefreshToken, {
  foreignKey: 'userId',
  as: 'refreshTokens',
});

export default RefreshToken;

export interface CreateRefreshTokenData {
  userId: string;
  tokenHash: string;
  deviceInfo?: string;
  ipAddress?: string;
  userAgent?: string;
  expiresAt: Date;
  parentTokenId?: string;
}
