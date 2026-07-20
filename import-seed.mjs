import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY // Must use service role key to bypass RLS

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ ERROR: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing in .env.local")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function seedProducts() {
  try {
    const rawData = fs.readFileSync(path.resolve(__dirname, 'seed-data.json'), 'utf-8')
    const products = JSON.parse(rawData)

    if (!Array.isArray(products)) {
      throw new Error("JSON data must be an array of products")
    }

    console.log(`⏳ Seeding ${products.length} products...`)

    // Format products slightly if needed to match DB schema exactly
    const formattedProducts = products.map(p => ({
      ...p,
      // Default missing fields
      specs: p.specs || [],
      features: p.features || [],
      applications: p.applications || [],
      images: p.images || [],
      status: p.status || 'active',
      featured: p.featured || false
    }))

    const { data, error } = await supabase
      .from('products')
      .upsert(formattedProducts, { onConflict: 'slug' }) // Update if slug already exists

    if (error) {
      console.error("❌ Database Error:", error.message)
    } else {
      console.log(`✅ Successfully seeded ${formattedProducts.length} products into the database!`)
    }

  } catch (err) {
    console.error("❌ Error reading or parsing seed-data.json:", err.message)
  }
}

seedProducts()
