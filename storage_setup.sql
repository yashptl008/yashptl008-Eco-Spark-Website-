-- 1. Create the Storage Buckets
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('brochures', 'brochures', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Drop existing policies just in case to avoid conflicts
DROP POLICY IF EXISTS "Public view product-images" ON storage.objects;
DROP POLICY IF EXISTS "Admin upload product-images" ON storage.objects;
DROP POLICY IF EXISTS "Admin delete product-images" ON storage.objects;

-- 3. Set up Policies for 'product-images'
CREATE POLICY "Public view product-images" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'product-images');

CREATE POLICY "Admin upload product-images" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');

CREATE POLICY "Admin update product-images" 
ON storage.objects FOR UPDATE 
WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');

CREATE POLICY "Admin delete product-images" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');

-- 4. Do the same for 'brochures'
DROP POLICY IF EXISTS "Public view brochures" ON storage.objects;
DROP POLICY IF EXISTS "Admin upload brochures" ON storage.objects;
DROP POLICY IF EXISTS "Admin update brochures" ON storage.objects;
DROP POLICY IF EXISTS "Admin delete brochures" ON storage.objects;

CREATE POLICY "Public view brochures" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'brochures');

CREATE POLICY "Admin upload brochures" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'brochures' AND auth.role() = 'authenticated');

CREATE POLICY "Admin update brochures" 
ON storage.objects FOR UPDATE 
WITH CHECK (bucket_id = 'brochures' AND auth.role() = 'authenticated');

CREATE POLICY "Admin delete brochures" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'brochures' AND auth.role() = 'authenticated');
