-- Enable Row Level Security on walamart_data table
ALTER TABLE public.walamart_data ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow public read access to all data
CREATE POLICY "Allow public read access to walamart_data" 
ON public.walamart_data 
FOR SELECT 
USING (true);