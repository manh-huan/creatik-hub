-- ==================================================================
-- B2C Video SaaS Platform - Complete PostgreSQL Schema
-- Production-ready database for faceless video generation service
-- ==================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==================================================================
-- ENUMS
-- ==================================================================

CREATE TYPE user_role_enum AS ENUM (
    'CUSTOMER',
    'ADMIN'
);

CREATE TYPE subscription_status_enum AS ENUM (
    'TRIAL',
    'ACTIVE',
    'PAST_DUE',
    'CANCELED',
    'UNPAID'
);

CREATE TYPE billing_cycle_enum AS ENUM (
    'MONTHLY',
    'YEARLY'
);

CREATE TYPE project_status_enum AS ENUM (
    'DRAFT',
    'ACTIVE',
    'ARCHIVED'
);

CREATE TYPE asset_type_enum AS ENUM (
    'AUDIO',
    'IMAGE',
    'VIDEO',
    'DOCUMENT',
    'FONT'
);

CREATE TYPE job_status_enum AS ENUM (
    'PENDING',
    'QUEUED',
    'PROCESSING',
    'COMPLETED',
    'FAILED',
    'CANCELED'
);

CREATE TYPE payment_status_enum AS ENUM (
    'PENDING',
    'SUCCEEDED',
    'FAILED',
    'CANCELED',
    'REFUNDED'
);

-- ==================================================================
-- CORE TABLES
-- ==================================================================

-- Users table - Individual customers and admin users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role_enum NOT NULL DEFAULT 'CUSTOMER',
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    avatar_url VARCHAR(500),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    region VARCHAR(10) DEFAULT 'US', -- For analytics and compliance
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_login_at TIMESTAMPTZ
);

-- Subscription plans - Different tiers of service
CREATE TABLE subscription_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    price_monthly DECIMAL(10,2) NOT NULL DEFAULT 0,
    price_yearly DECIMAL(10,2) NOT NULL DEFAULT 0,
    video_quota_monthly INTEGER NOT NULL DEFAULT 0,
    max_video_duration INTEGER NOT NULL DEFAULT 300, -- seconds
    max_storage_gb INTEGER NOT NULL DEFAULT 5,
    features JSONB NOT NULL DEFAULT '{}', -- HD export, watermark removal, etc.
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- User subscriptions - Current and historical subscription data
CREATE TABLE user_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES subscription_plans(id),
    status subscription_status_enum NOT NULL DEFAULT 'TRIAL',
    billing_cycle billing_cycle_enum NOT NULL DEFAULT 'MONTHLY',
    video_quota_used INTEGER NOT NULL DEFAULT 0,
    storage_used_gb DECIMAL(10,3) NOT NULL DEFAULT 0,
    quota_reset_date DATE NOT NULL,
    stripe_subscription_id VARCHAR(255) UNIQUE,
    stripe_customer_id VARCHAR(255),
    current_period_start DATE,
    current_period_end DATE,
    trial_end_date DATE,
    canceled_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Projects - User's video projects
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    script_content TEXT,
    settings JSONB NOT NULL DEFAULT '{}', -- voice, speed, style settings
    status project_status_enum NOT NULL DEFAULT 'DRAFT',
    is_template BOOLEAN NOT NULL DEFAULT FALSE,
    thumbnail_url VARCHAR(500),
    estimated_duration INTEGER, -- estimated video duration in seconds
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Project assets - Audio, images, fonts, etc. for projects
CREATE TABLE project_assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    asset_type asset_type_enum NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_url VARCHAR(500) NOT NULL, -- S3 or CDN URL
    file_size_bytes BIGINT NOT NULL,
    mime_type VARCHAR(100),
    metadata JSONB NOT NULL DEFAULT '{}', -- dimensions, duration, etc.
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Render jobs - Video generation tasks
CREATE TABLE render_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status job_status_enum NOT NULL DEFAULT 'PENDING',
    queue_id VARCHAR(255), -- External queue system ID (SQS, etc.)
    priority INTEGER NOT NULL DEFAULT 0, -- Higher number = higher priority
    render_settings JSONB NOT NULL DEFAULT '{}', -- resolution, format, quality settings
    output_url VARCHAR(500), -- Final video URL
    output_file_size BIGINT, -- File size in bytes
    output_duration INTEGER, -- Actual video duration in seconds
    cost_estimate DECIMAL(10,4), -- Processing cost for analytics
    worker_instance_id VARCHAR(255), -- Which server processed this
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    error_message TEXT,
    error_code VARCHAR(50), -- Categorized error codes
    retry_count INTEGER NOT NULL DEFAULT 0,
    device_type VARCHAR(50), -- mobile, desktop, tablet
    region VARCHAR(10), -- Where request originated
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ
);

-- ==================================================================
-- BILLING AND PAYMENTS
-- ==================================================================

-- Payments - Track all payment attempts and results
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subscription_id UUID REFERENCES user_subscriptions(id),
    stripe_payment_intent_id VARCHAR(255) UNIQUE,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    status payment_status_enum NOT NULL DEFAULT 'PENDING',
    payment_method VARCHAR(50), -- card, bank_transfer, etc.
    billing_reason VARCHAR(100), -- subscription_create, subscription_update, etc.
    failure_reason VARCHAR(255),
    refunded_amount DECIMAL(10,2) DEFAULT 0,
    invoice_url VARCHAR(500), -- Stripe invoice URL
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==================================================================
-- AUDIT AND ANALYTICS
-- ==================================================================

-- Audit logs - Track important user and admin actions
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL, -- user_login, project_created, video_rendered, etc.
    resource_type VARCHAR(50), -- user, project, render_job, payment
    resource_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    device_type VARCHAR(50),
    region VARCHAR(10),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- User sessions - Track login sessions
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    ip_address INET,
    user_agent TEXT,
    device_type VARCHAR(50),
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_activity_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Usage analytics - Track user behavior for insights
CREATE TABLE usage_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    event_type VARCHAR(100) NOT NULL, -- page_view, button_click, feature_used
    resource_type VARCHAR(50),
    resource_id UUID,
    metadata JSONB NOT NULL DEFAULT '{}', -- Additional event data
    device_type VARCHAR(50),
    region VARCHAR(10),
    ip_address INET,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==================================================================
-- INDEXES FOR PERFORMANCE
-- ==================================================================

-- Users indexes
CREATE INDEX CONCURRENTLY idx_users_email ON users(email);
CREATE INDEX CONCURRENTLY idx_users_role_active ON users(role, is_active);
CREATE INDEX CONCURRENTLY idx_users_created_at ON users(created_at);


-- User subscriptions indexes
CREATE INDEX CONCURRENTLY idx_user_subscriptions_user_status ON user_subscriptions(user_id, status);
CREATE INDEX CONCURRENTLY idx_user_subscriptions_stripe_sub ON user_subscriptions(stripe_subscription_id);
CREATE INDEX CONCURRENTLY idx_user_subscriptions_quota_reset ON user_subscriptions(quota_reset_date);
CREATE INDEX CONCURRENTLY idx_user_subscriptions_period_end ON user_subscriptions(current_period_end);

-- Projects indexes
CREATE INDEX CONCURRENTLY idx_projects_user_status ON projects(user_id, status);
CREATE INDEX CONCURRENTLY idx_projects_user_created ON projects(user_id, created_at DESC);
CREATE INDEX CONCURRENTLY idx_projects_is_template ON projects(is_template) WHERE is_template = TRUE;


-- Render jobs indexes (CRITICAL for performance)
CREATE INDEX CONCURRENTLY idx_render_jobs_status_created ON render_jobs(status, created_at);
CREATE INDEX CONCURRENTLY idx_render_jobs_user_created ON render_jobs(user_id, created_at DESC);
CREATE INDEX CONCURRENTLY idx_render_jobs_project ON render_jobs(project_id, created_at DESC);
CREATE INDEX CONCURRENTLY idx_render_jobs_queue_status ON render_jobs(queue_id, status);
CREATE INDEX CONCURRENTLY idx_render_jobs_priority_created ON render_jobs(priority DESC, created_at) WHERE status IN ('PENDING', 'QUEUED');

-- Payments indexes
CREATE INDEX CONCURRENTLY idx_payments_user_created ON payments(user_id, created_at DESC);
CREATE INDEX CONCURRENTLY idx_payments_status_created ON payments(status, created_at);
CREATE INDEX CONCURRENTLY idx_payments_stripe_intent ON payments(stripe_payment_intent_id);


-- User sessions indexes
CREATE INDEX CONCURRENTLY idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX CONCURRENTLY idx_user_sessions_user_expires ON user_sessions(user_id, expires_at);
CREATE INDEX CONCURRENTLY idx_user_sessions_expires ON user_sessions(expires_at) WHERE expires_at;

-- Usage analytics indexes
CREATE INDEX CONCURRENTLY idx_usage_analytics_user_created ON usage_analytics(user_id, created_at DESC);
CREATE INDEX CONCURRENTLY idx_usage_analytics_event_created ON usage_analytics(event_type, created_at DESC);

-- ==================================================================
-- CONSTRAINTS AND TRIGGERS
-- ==================================================================

-- Ensure only one active subscription per user
CREATE UNIQUE INDEX idx_user_subscriptions_active_unique 
ON user_subscriptions(user_id) 
WHERE status IN ('TRIAL', 'ACTIVE');

-- Function to update updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subscription_plans_updated_at BEFORE UPDATE ON subscription_plans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_subscriptions_updated_at BEFORE UPDATE ON user_subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==================================================================
-- INITIAL DATA
-- ==================================================================

-- Insert default subscription plans
INSERT INTO subscription_plans (name, description, price_monthly, price_yearly, video_quota_monthly, max_video_duration, max_storage_gb, features, sort_order) VALUES
('Free', 'Get started with basic video generation', 0.00, 0.00, 3, 60, 1, 
 '{"watermark": true, "max_resolution": "720p", "export_formats": ["mp4"]}', 1),
('Pro', 'Perfect for content creators', 29.99, 299.99, 50, 300, 10, 
 '{"watermark": false, "max_resolution": "1080p", "export_formats": ["mp4", "mov"], "priority_queue": true}', 2),
('Business', 'For teams and agencies', 99.99, 999.99, 200, 600, 50, 
 '{"watermark": false, "max_resolution": "4k", "export_formats": ["mp4", "mov", "webm"], "priority_queue": true, "api_access": true}', 3);

-- Create admin user (password should be changed immediately)
INSERT INTO users (email, password_hash, role, first_name, last_name, is_active, email_verified) VALUES
('admin@videoplatform.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4hc9Ac3QT6', 'ADMIN', 'Admin', 'User', TRUE, TRUE);

-- -- ==================================================================
-- -- VIEWS FOR COMMON QUERIES
-- -- ==================================================================

-- -- View for active users with current subscription
-- CREATE VIEW active_users_with_subscription AS
-- SELECT 
--     u.id,
--     u.email,
--     u.first_name,
--     u.last_name,
--     u.created_at AS user_created_at,
--     sp.name AS plan_name,
--     us.status AS subscription_status,
--     us.video_quota_used,
--     sp.video_quota_monthly,
--     us.storage_used_gb,
--     sp.max_storage_gb,
--     us.current_period_end
-- FROM users u
-- LEFT JOIN user_subscriptions us ON u.id = us.user_id 
--     AND us.status IN ('TRIAL', 'ACTIVE')
-- LEFT JOIN subscription_plans sp ON us.plan_id = sp.id
-- WHERE u.is_active = TRUE;

-- -- View for render job queue (for worker processes)
-- CREATE VIEW render_job_queue AS
-- SELECT 
--     rj.id,
--     rj.project_id,
--     rj.user_id,
--     rj.priority,
--     rj.render_settings,
--     rj.created_at,
--     p.name AS project_name,
--     u.email AS user_email,
--     sp.name AS user_plan
-- FROM render_jobs rj
-- JOIN projects p ON rj.project_id = p.id
-- JOIN users u ON rj.user_id = u.id
-- LEFT JOIN user_subscriptions us ON u.id = us.user_id 
--     AND us.status IN ('TRIAL', 'ACTIVE')
-- LEFT JOIN subscription_plans sp ON us.plan_id = sp.id
-- WHERE rj.status IN ('PENDING', 'QUEUED')
-- ORDER BY rj.priority DESC, rj.created_at ASC;

-- -- ==================================================================
-- -- MATERIALIZED VIEWS FOR ANALYTICS
-- -- ==================================================================

-- -- Daily usage statistics
-- CREATE MATERIALIZED VIEW daily_usage_stats AS
-- SELECT 
--     DATE(created_at) AS date,
--     COUNT(*) AS total_renders,
--     COUNT(CASE WHEN status = 'COMPLETED' THEN 1 END) AS successful_renders,
--     COUNT(CASE WHEN status = 'FAILED' THEN 1 END) AS failed_renders,
--     AVG(EXTRACT(EPOCH FROM (completed_at - started_at))) AS avg_processing_time_seconds,
--     COUNT(DISTINCT user_id) AS active_users
-- FROM render_jobs 
-- GROUP BY DATE(created_at)
-- ORDER BY date DESC;

-- -- Create index on materialized view
-- CREATE UNIQUE INDEX idx_daily_usage_stats_date ON daily_usage_stats(date);

-- -- ==================================================================
-- -- HELPFUL FUNCTIONS
-- -- ==================================================================

-- -- Function to check if user can create video (quota check)
-- CREATE OR REPLACE FUNCTION can_user_create_video(p_user_id UUID)
-- RETURNS BOOLEAN AS $$
-- DECLARE
--     v_quota_used INTEGER;
--     v_quota_limit INTEGER;
-- BEGIN
--     SELECT us.video_quota_used, sp.video_quota_monthly
--     INTO v_quota_used, v_quota_limit
--     FROM user_subscriptions us
--     JOIN subscription_plans sp ON us.plan_id = sp.id
--     WHERE us.user_id = p_user_id 
--     AND us.status IN ('TRIAL', 'ACTIVE');
    
--     RETURN COALESCE(v_quota_used, 0) < COALESCE(v_quota_limit, 0);
-- END;
-- $$ LANGUAGE plpgsql;

-- -- Function to increment user's video quota usage
-- CREATE OR REPLACE FUNCTION increment_video_quota(p_user_id UUID)
-- RETURNS VOID AS $$
-- BEGIN
--     UPDATE user_subscriptions 
--     SET video_quota_used = video_quota_used + 1,
--         updated_at = NOW()
--     WHERE user_id = p_user_id 
--     AND status IN ('TRIAL', 'ACTIVE');
-- END;
-- $$ LANGUAGE plpgsql;

-- -- ==================================================================
-- -- CLEANUP PROCEDURES
-- -- ==================================================================

-- -- Procedure to clean up expired sessions
-- CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
-- RETURNS INTEGER AS $$
-- DECLARE
--     deleted_count INTEGER;
-- BEGIN
--     DELETE FROM user_sessions 
--     WHERE expires_at < NOW();
    
--     GET DIAGNOSTICS deleted_count = ROW_COUNT;
--     RETURN deleted_count;
-- END;
-- $$ LANGUAGE plpgsql;

-- -- Procedure to archive old audit logs (older than 2 years)
-- CREATE OR REPLACE FUNCTION archive_old_audit_logs()
-- RETURNS INTEGER AS $$
-- DECLARE
--     archived_count INTEGER;
-- BEGIN
--     -- In production, you'd move these to an archive table
--     DELETE FROM audit_logs 
--     WHERE created_at < NOW() - INTERVAL '2 years';
    
--     GET DIAGNOSTICS archived_count = ROW_COUNT;
--     RETURN archived_count;
-- END;
-- $$ LANGUAGE pl