-- Create applications table for filmmaker and distributor applications
CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  application_type VARCHAR(50) NOT NULL CHECK (application_type IN ('filmmaker', 'distributor', 'buyer')),
  status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  
  -- Filmmaker fields
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  film_title VARCHAR(255),
  film_genre VARCHAR(255),
  film_duration INTEGER, -- in minutes
  film_description TEXT,
  film_language VARCHAR(100),
  film_country VARCHAR(100),
  film_release_date DATE,
  film_url VARCHAR(500),
  
  -- Distributor fields
  company_name VARCHAR(255),
  company_website VARCHAR(500),
  company_description TEXT,
  company_country VARCHAR(100),
  company_size VARCHAR(50),
  distribution_platform VARCHAR(255),
  
  -- Common fields
  email VARCHAR(255),
  phone VARCHAR(20),
  website VARCHAR(500),
  bio TEXT,
  metadata JSONB DEFAULT '{}',
  
  -- Admin fields
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  -- Indexes for performance
  UNIQUE (user_id, application_type)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_applications_user_id ON applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_type ON applications(application_type);
CREATE INDEX IF NOT EXISTS idx_applications_created_at ON applications(created_at);
CREATE INDEX IF NOT EXISTS idx_applications_user_type ON applications(user_id, application_type);

-- Enable RLS (Row Level Security)
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view their own applications
CREATE POLICY "Users can view own applications"
  ON applications
  FOR SELECT
  USING (auth.uid() = user_id);

-- RLS Policy: Users can create applications
CREATE POLICY "Users can create applications"
  ON applications
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policy: Users can update their own pending applications
CREATE POLICY "Users can update own pending applications"
  ON applications
  FOR UPDATE
  USING (auth.uid() = user_id AND status = 'pending')
  WITH CHECK (auth.uid() = user_id AND status = 'pending');

-- RLS Policy: Admins can view all applications (use service role for this)
-- Note: Service role bypasses RLS, so no policy needed for admin reads

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_applications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER applications_updated_at
BEFORE UPDATE ON applications
FOR EACH ROW
EXECUTE FUNCTION update_applications_updated_at();
