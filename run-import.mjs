import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const envContent = fs.readFileSync(path.resolve(__dirname, '.env.local'), 'utf8')
const env = {}
envContent.split('\n').forEach(line => {
  const [key, ...val] = line.split('=')
  if (key && val.length) env[key.trim()] = val.join('=').trim()
})

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY // Bypass RLS

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ ERROR: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing in .env.local")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function seedProducts() {
  try {
    const rawData = fs.readFileSync(path.resolve(__dirname, 'raw-data.json'), 'utf-8')
    const rawProducts = JSON.parse(rawData)

    console.log(`⏳ Formatting and Seeding ${rawProducts.length} products...`)

    // Format products to match DB schema exactly
    const formattedProducts = rawProducts.map(p => {
      // Convert specifications object to array of {label, value}
      const specsArray = []
      if (p.specifications) {
        if (p.specifications.chemistry) specsArray.push({ label: 'Chemistry', value: p.specifications.chemistry })
        if (p.specifications.cycle_life) specsArray.push({ label: 'Cycle Life', value: p.specifications.cycle_life })
        if (p.specifications.dod_level) specsArray.push({ label: 'DoD Level', value: p.specifications.dod_level })
        if (p.specifications.working_temperature) specsArray.push({ label: 'Working Temperature', value: p.specifications.working_temperature })
        
        // Handle available models by summarizing them
        if (p.specifications.available_models && Array.isArray(p.specifications.available_models)) {
          const modelsSummary = p.specifications.available_models.map(m => m.model).join(', ')
          specsArray.push({ label: 'Available Models', value: modelsSummary })
        }
      }

      return {
        name: p.title,
        slug: p.slug,
        category: 'Industrial Batteries', // Generic category since it's missing
        short_description: p.short_description,
        full_description: p.description,
        specs: specsArray,
        features: p.specifications?.features || [],
        applications: [], // missing in JSON
        status: p.status || 'active',
        featured: false,
        images: []
      }
    })

    const { data, error } = await supabase
      .from('products')
      .upsert(formattedProducts, { onConflict: 'slug' })

    if (error) {
      console.error("❌ Database Error:", error.message)
    } else {
      console.log(`✅ Successfully seeded ${formattedProducts.length} products into the database!`)
    }

  } catch (err) {
    console.error("❌ Error reading or formatting data:", err.message)
  }
}

seedProducts()
